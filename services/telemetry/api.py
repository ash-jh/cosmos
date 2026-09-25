import asyncio
import json
from pydantic import BaseModel
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from services.rca.correlation.engine import CorrelationEngine
from services.telemetry.simulator.spacecraft import SpacecraftSimulator
from services.ml.baselines.statistical import (
    StatisticalAnomalyDetector,
)

app = FastAPI(
    title="COSMOS Telemetry Service",
    description="Telemetry simulation and streaming service for COSMOS.",
    version="0.1.0",
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# Shared spacecraft simulator
# ---------------------------------------------------------

spacecraft = SpacecraftSimulator()
anomaly_detector = StatisticalAnomalyDetector()
rca_engine = CorrelationEngine()

class FaultRequest(BaseModel):
    fault: str

# ---------------------------------------------------------
# Health endpoint
# ---------------------------------------------------------
@app.post("/faults/activate")
async def activate_fault(request: FaultRequest):
    spacecraft.faults.activate(request.fault)

    return {
        "status": "active",
        "fault": spacecraft.faults.current(),
        "simulation_only": True,
    }


@app.post("/faults/clear")
async def clear_fault():
    spacecraft.faults.clear()

    return {
        "status": "cleared",
        "fault": None,
        "simulation_only": True,
    }


@app.get("/faults")
async def get_fault():
    return {
        "fault": spacecraft.faults.current(),
        "simulation_only": True,
    }


@app.get("/health")
async def health():
    return {
        "status": "online",
        "mission": "rvce-cubesat-01",
        "spacecraft": "cosmos-sat-01",
    }


# ---------------------------------------------------------
# Current telemetry endpoint
# ---------------------------------------------------------

@app.get("/telemetry")
async def get_telemetry():
    packet = spacecraft.step()

    return packet.model_dump(mode="json")


# ---------------------------------------------------------
# WebSocket telemetry stream
# ---------------------------------------------------------

@app.websocket("/ws/telemetry")
async def telemetry_stream(websocket: WebSocket):
    await websocket.accept()

    print("Telemetry client connected.")

    try:
        while True:
            packet = spacecraft.step()

            await websocket.send_text(
                packet.model_dump_json()
            )

            await asyncio.sleep(1)

    except WebSocketDisconnect:
        print("Telemetry client disconnected.")

    except Exception as error:
        print(f"Telemetry stream error: {error}")

@app.websocket("/ws/mission")
async def mission_stream(websocket: WebSocket):
    await websocket.accept()
    print("Mission client connected.")

    try:
        while True:
            packet = spacecraft.step()

            anomaly = anomaly_detector.detect(
                telemetry=packet.telemetry,
                spacecraft_id=packet.spacecraftId,
                timestamp=packet.timestamp,
            )

            rca = rca_engine.analyze(anomaly)

            mission_packet = {
                "telemetry": packet.model_dump(mode="json"),
                "anomaly": anomaly.model_dump(mode="json"),
                "rca": rca.model_dump(mode="json"),
            }

            await websocket.send_text(
                json.dumps(mission_packet)
            )

            await asyncio.sleep(1)

    except WebSocketDisconnect:
        print("Mission client disconnected.")

    except Exception as error:
        print(f"Mission stream error: {error}")