from typing import Dict, Any, List
from pydantic import BaseModel

class SpacecraftFault(BaseModel):
    id: str
    subsystem: str
    name: str
    description: str
    default_duration: float = 60.0
    allowed_severities: List[str] = ["Low", "Medium", "Critical"]

FAULT_LIBRARY: Dict[str, SpacecraftFault] = {
    "battery_degradation": SpacecraftFault(
        id="battery_degradation",
        subsystem="EPS",
        name="Battery Cell Degradation (Internal Resistance Spike)",
        description="Increases battery equivalent series resistance (ESR) by 2x-4.5x, creating voltage droop under load and Ohmic Joule overheating.",
    ),
    "current_spike": SpacecraftFault(
        id="current_spike",
        subsystem="EPS",
        name="Payload Latchup / Bus Current Surge",
        description="Surges draw by +1.5A to +4.5A, stressing battery discharge limits and depressing regulated bus rails.",
    ),
    "battery_overheating": SpacecraftFault(
        id="battery_overheating",
        subsystem="THERMAL",
        name="Battery Thermal Runaway / Radiator Occlusion",
        description="Heat accumulation increases pack temperature above nominal 24.5°C threshold towards 50°C+ thermal damage boundary.",
    ),
    "cpu_overload": SpacecraftFault(
        id="cpu_overload",
        subsystem="OBC",
        name="Flight Computer CPU Thread Saturation",
        description="Endless execution thread consumes 100% CPU capacity, driving compute core temperatures to 70°C+.",
    ),
    "wheel_degradation": SpacecraftFault(
        id="wheel_degradation",
        subsystem="ADCS",
        name="Reaction Wheel Bearing Friction Drag",
        description="Bearing resistance causes reaction wheel drag, pointing attitude error drift, and elevated motor power consumption.",
    ),
    "packet_loss": SpacecraftFault(
        id="packet_loss",
        subsystem="COMM",
        name="RF Frontend Link Degradation",
        description="Multi-path loss and antenna misalignment spikes packet rejection rate from 1.2% up to 45%+.",
    ),
}

class FaultEngine:
    """Manages available spacecraft faults and activates them on the twin."""
    def __init__(self):
        self.library = FAULT_LIBRARY

    def get_available_faults(self) -> List[Dict[str, Any]]:
        return [f.model_dump() for f in self.library.values()]

    def get_fault(self, fault_id: str) -> SpacecraftFault:
        if fault_id not in self.library:
            raise ValueError(f"Unknown fault ID: {fault_id}")
        return self.library[fault_id]

