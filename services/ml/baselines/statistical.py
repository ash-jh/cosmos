from services.telemetry.schema.telemetry import TelemetryData
from services.ml.schemas.anomaly import (
    AnomalyResult,
    ChannelAnomaly,
)


# Nominal simulator operating ranges.
#
# Format:
# channel: (expected_mean, expected_standard_deviation)

BASELINES = {
    "battery_voltage": (7.42, 0.05),
    "battery_current": (1.80, 0.12),
    "battery_temperature": (31.0, 0.8),
    "bus_voltage": (7.32, 0.05),
    "state_of_charge": (82.0, 3.0),

    "obc_cpu_utilization": (34.0, 8.0),
    "obc_temperature": (40.0, 2.5),
    "obc_memory_utilization": (42.0, 5.0),

    "angular_velocity_x": (0.0, 0.05),
    "angular_velocity_y": (0.0, 0.05),
    "angular_velocity_z": (0.0, 0.05),
    "attitude_error": (0.15, 0.10),
    "reaction_wheel_speed": (1750.0, 150.0),

    "rssi": (-68.0, 4.0),
    "packet_loss": (0.8, 0.7),

    "payload_temperature": (25.0, 1.0),
}


WARNING_THRESHOLD = 2.0
CRITICAL_THRESHOLD = 3.0


class StatisticalAnomalyDetector:
    """
    Lightweight statistical anomaly detector.

    Uses fixed nominal spacecraft baselines rather than learning
    statistics from the live stream. This prevents an active fault
    from becoming part of the new 'normal' distribution.
    """

    def __init__(self):
        self.name = "statistical-zscore-v1"

    def _severity(self, z_score: float) -> str:
        if z_score >= CRITICAL_THRESHOLD:
            return "critical"

        if z_score >= WARNING_THRESHOLD:
            return "warning"

        return "normal"

    def detect(
        self,
        telemetry: TelemetryData,
        spacecraft_id: str,
        timestamp,
    ) -> AnomalyResult:

        telemetry_dict = telemetry.model_dump()

        channel_results: list[ChannelAnomaly] = []

        for channel, (mean, std) in BASELINES.items():

            if channel not in telemetry_dict:
                continue

            value = float(telemetry_dict[channel])

            z_score = abs(value - mean) / std

            severity = self._severity(z_score)

            channel_results.append(
                ChannelAnomaly(
                    channel=channel,
                    value=round(value, 4),
                    z_score=round(z_score, 3),
                    severity=severity,
                )
            )

        # Highest channel deviation becomes the overall score.
        score = max(
            (channel.z_score for channel in channel_results),
            default=0.0,
        )

        affected_channels = [
            channel.channel
            for channel in channel_results
            if channel.severity != "normal"
        ]

        if score >= CRITICAL_THRESHOLD:
            overall_severity = "critical"
        elif score >= WARNING_THRESHOLD:
            overall_severity = "warning"
        else:
            overall_severity = "normal"

        return AnomalyResult(
            spacecraftId=spacecraft_id,
            timestamp=timestamp,
            detector=self.name,
            score=round(score, 3),
            severity=overall_severity,
            affectedChannels=affected_channels,
            channels=channel_results,
        )