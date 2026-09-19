from datetime import datetime, timezone
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field

class CanonicalTelemetryPacket(BaseModel):
    """
    Canonical Telemetry Packet format for COSMOS.
    Both the digital twin simulator and future ground-station decoders
    feed telemetry into COSMOS through this identical schema.
    """
    missionId: str = Field(default="rvce-cubesat-01", description="Mission unique identifier")
    spacecraftId: str = Field(default="cosmos-sat-01", description="Spacecraft unique identifier")
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="ISO 8601 UTC timestamp"
    )
    telemetry: Dict[str, float] = Field(
        default_factory=dict,
        description="Key-value mapping of telemetry channel names to numeric values"
    )
    metadata: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Optional transport metadata (e.g. RSSI, ground station ID)"
    )

    def get_channel(self, name: str, default: float = 0.0) -> float:
        return self.telemetry.get(name, default)

