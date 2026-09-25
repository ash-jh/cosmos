from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class TelemetryData(BaseModel):
    # EPS
    battery_voltage: float
    battery_current: float
    battery_temperature: float
    bus_voltage: float
    state_of_charge: float

    # OBC
    obc_cpu_utilization: float
    obc_temperature: float
    obc_memory_utilization: float
    reboot_count: int

    # ADCS
    angular_velocity_x: float
    angular_velocity_y: float
    angular_velocity_z: float
    attitude_error: float
    reaction_wheel_speed: float

    # Communications
    rssi: float
    packet_loss: float
    uplink_count: int
    downlink_count: int

    # Payload
    payload_temperature: float


class TelemetryPacket(BaseModel):
    missionId: str
    spacecraftId: str
    timestamp: datetime
    source: Literal["simulator", "ground_station", "external"]
    sequence: int
    telemetry: TelemetryData