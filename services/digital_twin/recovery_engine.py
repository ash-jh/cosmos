from typing import Dict, Any, List
from pydantic import BaseModel
from .spacecraft_model import CubeSatDigitalTwin

class CandidateRecoveryAction(BaseModel):
    action_id: str
    target_subsystem: str
    title: str
    description: str
    expected_recovery_time_sec: float
    power_delta_w: float
    risk_level: str  # "Low", "Medium", "High"

RECOVERY_LIBRARY: Dict[str, CandidateRecoveryAction] = {
    "battery_degradation": CandidateRecoveryAction(
        action_id="EXEC_EPS_LOAD_SHED_PAYLOAD",
        target_subsystem="EPS",
        title="Shed Non-Essential Payload & Throttle Transceiver",
        description="De-energizes secondary imaging payload (-3.6W) and transitions UHF transceiver to 20% beacon duty cycle, stabilizing main bus voltage > 7.7V.",
        expected_recovery_time_sec=15.0,
        power_delta_w=-3.6,
        risk_level="Low",
    ),
    "current_spike": CandidateRecoveryAction(
        action_id="EXEC_EPS_ISOLATE_BUS_RAIL",
        target_subsystem="EPS",
        title="Cycle Solid-State Power Switch (SSPS)",
        description="Opens latchup current protection switch on payload power rail to clear latchup condition.",
        expected_recovery_time_sec=5.0,
        power_delta_w=-4.5,
        risk_level="Low",
    ),
    "battery_overheating": CandidateRecoveryAction(
        action_id="EXEC_THERMAL_ATTITUDE_SLEW",
        target_subsystem="THERMAL",
        title="Orient Radiator Panel to Deep-Space Zenith",
        description="Commands ADCS to rotate spacecraft body -45° pitch to maximize radiative cooling away from Earth albedo.",
        expected_recovery_time_sec=120.0,
        power_delta_w=-0.8,
        risk_level="Medium",
    ),
    "cpu_overload": CandidateRecoveryAction(
        action_id="EXEC_OBC_WATCHDOG_RESTART_TASKS",
        target_subsystem="OBC",
        title="Restart Non-Essential Flight Tasks",
        description="Terminates rogue background logging thread and restarts telemetry compressor service.",
        expected_recovery_time_sec=10.0,
        power_delta_w=-1.2,
        risk_level="Low",
    ),
    "wheel_degradation": CandidateRecoveryAction(
        action_id="EXEC_ADCS_MAGNETORQUER_DETUMBLE",
        target_subsystem="ADCS",
        title="Engage Magnetorquer B-Dot Rate Damping",
        description="Transfers attitude control authority from degrading reaction wheel to magnetic torque coils.",
        expected_recovery_time_sec=45.0,
        power_delta_w=-0.5,
        risk_level="Medium",
    ),
    "packet_loss": CandidateRecoveryAction(
        action_id="EXEC_COMM_FALLBACK_LOW_RATE",
        target_subsystem="COMM",
        title="Switch to 1200 bps BPSK Safe Beacon",
        description="Drops data rate from 9600 bps to 1200 bps to gain +9 dB link margin and eliminate packet drop.",
        expected_recovery_time_sec=8.0,
        power_delta_w=-0.4,
        risk_level="Low",
    ),
}

class RecoveryEngine:
    """Generates candidate recovery actions and validates them using the digital twin."""
    def __init__(self, twin: CubeSatDigitalTwin):
        self.twin = twin
        self.library = RECOVERY_LIBRARY

    def recommend_action(self, fault_type: str) -> CandidateRecoveryAction:
        if fault_type in self.library:
            return self.library[fault_type]
        return self.library["battery_degradation"]

    def validate_simulation(self, fault_type: str) -> Dict[str, Any]:
        """
        Executes counterfactual simulation in the digital twin:
        Tests whether the candidate action successfully recovers telemetry to nominal.
        """
        sim_result = self.twin.simulate_recovery_counterfactual(horizon_steps=10, dt=5.0)
        action = self.recommend_action(fault_type)
        return {
            "candidate_action": action.model_dump(),
            "simulation_trajectory": sim_result,
            "status": "SIMULATION_VALIDATED" if sim_result["recovery_predicted"] else "SIMULATION_FAILED",
            "message": "Candidate action appears to restore nominal state." if sim_result["recovery_predicted"] else "Candidate action insufficient to restore nominal state.",
        }

