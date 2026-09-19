import numpy as np
from typing import Dict, List, Tuple
from collections import deque

class ChannelStatisticalTracker:
    """Tracks streaming values for a single telemetry channel and computes rolling z-scores and EWMA."""
    def __init__(self, window_size: int = 60, alpha: float = 0.15):
        self.window_size = window_size
        self.alpha = alpha
        self.history = deque(maxlen=window_size)
        self.ewma: float | None = None

    def update(self, value: float) -> Tuple[float, float, float]:
        """
        Updates tracker with new value.
        Returns (z_score, ewma_residual, anomaly_score_0_to_1)
        """
        self.history.append(value)
        if self.ewma is None:
            self.ewma = value
        else:
            self.ewma = self.alpha * value + (1 - self.alpha) * self.ewma

        if len(self.history) < 5:
            return 0.0, 0.0, 0.0

        mean = float(np.mean(self.history))
        std = float(np.std(self.history))
        if std < 1e-4:
            std = 1e-4

        z_score = abs(value - mean) / std
        residual = abs(value - self.ewma)

        # Scale z-score to 0-1 anomaly score (sigmoid or clipped linear)
        # z=3 gives ~0.75, z=5+ gives ~0.95+
        anomaly_score = float(1.0 / (1.0 + np.exp(-1.2 * (z_score - 3.0))))
        return z_score, residual, anomaly_score

class StatisticalAnomalyDetector:
    """Manages statistical baseline trackers for all telemetry channels."""
    def __init__(self, channels: List[str]):
        self.trackers = {ch: ChannelStatisticalTracker() for ch in channels}
        self.nominal_ranges: Dict[str, Tuple[float, float]] = {
            "battery_voltage": (6.8, 8.4),
            "battery_current": (-2.5, 4.0),
            "battery_temperature": (-10.0, 45.0),
            "bus_voltage": (6.0, 8.4),
            "cpu_temperature": (-10.0, 75.0),
            "cpu_utilization": (0.0, 95.0),
            "attitude_error": (0.0, 5.0),
            "reaction_wheel_speed": (-6000.0, 6000.0),
            "comm_rssi": (-115.0, -40.0),
            "packet_loss": (0.0, 15.0),
        }

    def evaluate_packet(self, telemetry: Dict[str, float]) -> Dict[str, Any]:
        channel_scores = {}
        affected_channels = []
        max_score = 0.0

        for ch_name, val in telemetry.items():
            if ch_name not in self.trackers:
                self.trackers[ch_name] = ChannelStatisticalTracker()

            z, res, score = self.trackers[ch_name].update(val)
            
            # Check static boundary limits as well
            if ch_name in self.nominal_ranges:
                min_v, max_v = self.nominal_ranges[ch_name]
                if val < min_v or val > max_v:
                    # Boost anomaly score if out of physical limits
                    score = max(score, 0.85)

            channel_scores[ch_name] = {
                "value": val,
                "z_score": round(z, 2),
                "residual": round(res, 3),
                "anomaly_score": round(score, 3),
                "is_anomalous": score > 0.70,
            }

            if score > 0.70:
                affected_channels.append(ch_name)
            if score > max_score:
                max_score = score

        return {
            "overall_score": round(max_score, 3),
            "threshold": 0.70,
            "is_anomaly": max_score > 0.70,
            "severity": "critical" if max_score > 0.85 else ("warning" if max_score > 0.70 else "nominal"),
            "affected_channels": affected_channels,
            "channel_scores": channel_scores,
        }

