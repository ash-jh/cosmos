import asyncio
import json
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .telemetry.canonical import CanonicalTelemetryPacket
from .digital_twin.spacecraft_model import CubeSatDigitalTwin
from .digital_twin.fault_engine import FaultEngine
from .digital_twin.recovery_engine import RecoveryEngine
from .ml.baselines.statistical import StatisticalAnomalyDetector
from .ml.models.lightweight_detector import SlidingWindowAnomalyPipeline
from .ml.edge.benchmarker import EdgeBenchmarker
from .rca.correlation_engine import CorrelationRCAEngine

app = FastAPI(
    title="COSMOS Mission Intelligence & Digital Twin Service",
    description="Backend service for RVCE CubeSat-01 (COSMOS-SAT-01) telemetry, ML anomaly detection, and in-the-loop recovery twin.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Singletons
twin = CubeSatDigitalTwin()
fault_engine = FaultEngine()
recovery_engine = RecoveryEngine(twin)

monitored_channels = [
    "battery_voltage",
    "battery_current",
    "battery_temperature",
    "bus_voltage",
    "state_of_charge",
    "cpu_temperature",
    "cpu_utilization",
    "attitude_error",
    "reaction_wheel_speed",
    "comm_rssi",
]

statistical_detector = StatisticalAnomalyDetector(monitored_channels)
tcn_pipeline = SlidingWindowAnomalyPipeline(monitored_channels, window_size=20)
rca_engine = CorrelationRCAEngine()
benchmarker = EdgeBenchmarker(num_channels=len(monitored_channels), window_size=20)

class FaultInjectionRequest(BaseModel):
    subsystem: str
    fault_type: str
    severity: str = "Medium"
    duration_sec: float = 60.0

class RecoveryRequest(BaseModel):
    action_id: str
    fault_type: str = "battery_degradation"

@app.get("/")
def get_root():
    return {
        "status": "online",
        "service": "COSMOS Flight Intelligence Platform",
        "organization": "RVCE",
        "mission": "RVCE CubeSat-01",
        "spacecraft": "COSMOS-SAT-01",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

@app.get("/api/health")
def get_health():
    return {
        "twin_sim_time": twin.sim_time_sec,
        "fault_active": twin.fault_active,
        "fault_type": twin.fault_type,
        "state_of_charge": twin.state_of_charge,
    }

@app.get("/api/telemetry/latest", response_model=CanonicalTelemetryPacket)
def get_latest_telemetry():
    t_data = twin.step(dt=1.0)
    packet = CanonicalTelemetryPacket(
        missionId="rvce-cubesat-01",
        spacecraftId="cosmos-sat-01",
        timestamp=datetime.now(timezone.utc).isoformat(),
        telemetry=t_data,
    )
    return packet

@app.post("/api/fault/inject")
def inject_spacecraft_fault(req: FaultInjectionRequest):
    twin.inject_fault(req.fault_type, req.severity, req.duration_sec)
    return {
        "status": "FAULT_INJECTED",
        "subsystem": req.subsystem,
        "fault_type": req.fault_type,
        "severity": req.severity,
        "duration_sec": req.duration_sec,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

@app.post("/api/fault/reset")
def reset_faults():
    twin.reset_nominal()
    return {"status": "TWIN_RESET_NOMINAL"}

@app.post("/api/twin/simulate-recovery")
def simulate_recovery(req: RecoveryRequest):
    validation = recovery_engine.validate_simulation(req.fault_type)
    return validation

@app.post("/api/twin/apply-action")
def apply_action(req: RecoveryRequest):
    twin.apply_recovery_action(req.action_id)
    return {
        "status": "ACTION_APPLIED_IN_TWIN",
        "action_id": req.action_id,
        "message": "Phase I simulated action approved and executed in Digital Twin.",
    }

@app.get("/api/ml/benchmark")
def run_benchmark(iterations: int = 500):
    return benchmarker.benchmark_inference(iterations=iterations)

@app.post("/api/telemetry/external")
def ingest_external_telemetry(packet: CanonicalTelemetryPacket):
    """
    Ground-station adapter ingestion endpoint.
    Accepts external telemetry packets conforming to canonical format.
    """
    # Evaluate anomaly detection
    stat_result = statistical_detector.evaluate_packet(packet.telemetry)
    tcn_result = tcn_pipeline.push(packet.telemetry)

    # Correlate if anomalous
    rca_diagnosis = None
    if tcn_result.get("is_anomaly") or stat_result.get("is_anomaly"):
        # Combine channel scores
        scores = {}
        for ch, details in stat_result["channel_scores"].items():
            scores[ch] = details["anomaly_score"]
        rca_diagnosis = rca_engine.correlate(scores)

    return {
        "status": "INGESTED",
        "timestamp": packet.timestamp,
        "statistical_anomaly": stat_result["is_anomaly"],
        "tcn_anomaly": tcn_result.get("is_anomaly", False),
        "rca": rca_diagnosis.model_dump() if rca_diagnosis else None,
    }

@app.websocket("/ws/telemetry")
async def websocket_telemetry_stream(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            t_data = twin.step(dt=1.0)
            packet = CanonicalTelemetryPacket(
                missionId="rvce-cubesat-01",
                spacecraftId="cosmos-sat-01",
                timestamp=datetime.now(timezone.utc).isoformat(),
                telemetry=t_data,
            )

            # Evaluate with ML pipeline
            tcn_res = tcn_pipeline.push(t_data)
            stat_res = statistical_detector.evaluate_packet(t_data)

            payload = {
                "packet": packet.model_dump(),
                "anomaly": {
                    "score": max(tcn_res.get("score", 0.0), stat_res.get("overall_score", 0.0)),
                    "is_anomaly": tcn_res.get("is_anomaly", False) or stat_res.get("is_anomaly", False),
                    "affected_channels": list(set(tcn_res.get("affected_channels", []) + stat_res.get("affected_channels", []))),
                },
            }

            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(1.0)
    except WebSocketDisconnect:
        pass

