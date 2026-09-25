from datetime import datetime, timezone

from services.telemetry.simulator.spacecraft import SpacecraftSimulator
from services.ml.baselines.statistical import (
    StatisticalAnomalyDetector,
)


def main():
    spacecraft = SpacecraftSimulator()
    detector = StatisticalAnomalyDetector()

    print("Generating nominal telemetry...\n")

    for _ in range(5):
        packet = spacecraft.step()

        result = detector.detect(
            telemetry=packet.telemetry,
            spacecraft_id=packet.spacecraftId,
            timestamp=packet.timestamp,
        )

        print(
            f"SEQ {packet.sequence:03d} | "
            f"score={result.score:.2f} | "
            f"severity={result.severity} | "
            f"affected={result.affectedChannels}"
        )

    print("\nActivating battery degradation...\n")

    spacecraft.faults.activate("battery_degradation")

    for _ in range(5):
        packet = spacecraft.step()

        result = detector.detect(
            telemetry=packet.telemetry,
            spacecraft_id=packet.spacecraftId,
            timestamp=packet.timestamp,
        )

        print(
            f"SEQ {packet.sequence:03d} | "
            f"score={result.score:.2f} | "
            f"severity={result.severity} | "
            f"affected={result.affectedChannels}"
        )


if __name__ == "__main__":
    main()