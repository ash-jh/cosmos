from typing import Literal

from pydantic import BaseModel


RCAStatus = Literal[
    "no_issue",
    "suspected",
    "confirmed_simulation",
]


class RCAResult(BaseModel):
    status: RCAStatus
    subsystem: str | None
    candidate_cause: str | None
    confidence: float
    evidence: list[str]