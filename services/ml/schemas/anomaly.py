from datetime import datetime
from typing import Literal

from pydantic import BaseModel


Severity = Literal["normal", "warning", "critical"]


class ChannelAnomaly(BaseModel):
    channel: str
    value: float
    z_score: float
    severity: Severity


class AnomalyResult(BaseModel):
    spacecraftId: str
    timestamp: datetime

    detector: str

    score: float
    severity: Severity

    affectedChannels: list[str]
    channels: list[ChannelAnomaly]