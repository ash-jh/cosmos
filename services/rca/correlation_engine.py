from typing import Dict, List, Any
from pydantic import BaseModel

class RCAEvidence(BaseModel):
    channel: str
    observation: str
    score: float

class RCADiagnosis(BaseModel):
    incident_id: str
    candidate_subsystem: str
    candidate_cause: str
    confidence: float
    evidence: List[RCAEvidence]
    recommended_action: str

# Subsystem Topology mapping channels to subsystems
SUBSYSTEM_TOPOLOGY: Dict[str, List[str]] = {
    "EPS": [
        "battery_voltage",
        "battery_current",
        "battery_temperature",
        "bus_voltage",
        "state_of_charge",
        "solar_power",
    ],
    "THERMAL": [
        "battery_temperature",
        "obc_temperature",
        "payload_temperature",
    ],
    "OBC": [
        "cpu_utilization",
        "cpu_temperature",
        "memory_utilization",
        "reboot_count",
    ],
    "ADCS": [
        "attitude_error",
        "reaction_wheel_speed",
        "angular_velocity",
    ],
    "COMM": [
        "comm_rssi",
        "packet_loss",
        "uplink_count",
        "downlink_count",
    ],
}

class CorrelationRCAEngine:
    """
    Evaluates multi-channel anomaly signals against subsystem topologies
    to isolate the primary affected subsystem and synthesize a candidate root cause.
    """
    def __init__(self):
        self.topology = SUBSYSTEM_TOPOLOGY

    def correlate(self, channel_scores: Dict[str, float], incident_id: str = "INC-2026-0814") -> RCADiagnosis:
        """
        Takes a dict of channel_name -> anomaly_score (0.0 to 1.0).
        Calculates subsystem anomaly burden and produces candidate RCA.
        """
        subsystem_burdens: Dict[str, float] = {}
        subsystem_hits: Dict[str, int] = {}

        for sub_name, channels in self.topology.items():
            total_burden = 0.0
            hits = 0
            for ch in channels:
                score = channel_scores.get(ch, 0.0)
                if score > 0.65:
                    total_burden += score
                    hits += 1
            subsystem_burdens[sub_name] = total_burden
            subsystem_hits[sub_name] = hits

        # Identify top subsystem
        top_subsystem = max(subsystem_burdens, key=subsystem_burdens.get)
        top_burden = subsystem_burdens[top_subsystem]

        # Assemble evidence
        evidence_list: List[RCAEvidence] = []
        for ch in self.topology.get(top_subsystem, []):
            score = channel_scores.get(ch, 0.0)
            if score > 0.65:
                obs = f"Abnormal deviation (score: {score:.2f}) exceeding 3-sigma dynamic threshold."
                evidence_list.append(RCAEvidence(channel=ch, observation=obs, score=round(score, 2)))

        # Rule-based candidate cause mapping
        if top_subsystem == "EPS":
            v_score = channel_scores.get("battery_voltage", 0.0)
            t_score = channel_scores.get("battery_temperature", 0.0)
            c_score = channel_scores.get("battery_current", 0.0)
            if v_score > 0.75 and t_score > 0.70:
                candidate_cause = "Battery Cell Degradation / Internal Resistance Increase"
                rec_action = "EXEC_EPS_LOAD_SHED_PAYLOAD"
            elif c_score > 0.80:
                candidate_cause = "Payload Latchup / Bus Current Surge"
                rec_action = "EXEC_EPS_ISOLATE_BUS_RAIL"
            else:
                candidate_cause = "Main Bus Undervoltage"
                rec_action = "EXEC_EPS_LOAD_SHED_PAYLOAD"
        elif top_subsystem == "THERMAL":
            candidate_cause = "Radiator Thermal Runaway / Sun Tracking Occlusion"
            rec_action = "EXEC_THERMAL_ATTITUDE_SLEW"
        elif top_subsystem == "OBC":
            candidate_cause = "Flight Computer CPU Overload / Infinite Thread Loop"
            rec_action = "EXEC_OBC_WATCHDOG_RESTART_TASKS"
        elif top_subsystem == "ADCS":
            candidate_cause = "Reaction Wheel Bearing Friction Degradation"
            rec_action = "EXEC_ADCS_MAGNETORQUER_DETUMBLE"
        elif top_subsystem == "COMM":
            candidate_cause = "RF Frontend LNA Gain Drop / Multipath Loss"
            rec_action = "EXEC_COMM_FALLBACK_LOW_RATE"
        else:
            candidate_cause = "Uncorrelated Transitory Noise"
            rec_action = "EXEC_MONITOR_NOMINAL"

        confidence = min(0.96, max(0.60, 0.50 + (top_burden * 0.12)))

        return RCADiagnosis(
            incident_id=incident_id,
            candidate_subsystem=top_subsystem,
            candidate_cause=candidate_cause,
            confidence=round(confidence, 2),
            evidence=evidence_list,
            recommended_action=rec_action,
        )

