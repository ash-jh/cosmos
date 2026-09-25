from services.ml.baselines.statistical import (
    StatisticalAnomalyDetector,
)
from services.rca.correlation.engine import (
    CorrelationEngine,
)
from services.telemetry.simulator.spacecraft import (
    SpacecraftSimulator,
)


def main():
    spacecraft = SpacecraftSimulator()

    detector = StatisticalAnomalyDetector()
    rca_engine = CorrelationEngine()

    spacecraft.faults.activate("battery_degradation")

    for _ in range(3):
        packet = spacecraft.step()

        anomaly = detector.detect(
            telemetry=packet.telemetry,
            spacecraft_id=packet.spacecraftId,
            timestamp=packet.timestamp,
        )

        rca = rca_engine.analyze(anomaly)

        print("\n------------------------------")
        print(f"Sequence: {packet.sequence}")
        print(f"Anomaly: {anomaly.severity}")
        print(f"Score: {anomaly.score}")
        print(f"Subsystem: {rca.subsystem}")
        print(f"Cause: {rca.candidate_cause}")
        print(f"Confidence: {rca.confidence}")
        print("Evidence:")

        for evidence in rca.evidence:
            print(f"  - {evidence}")


if __name__ == "__main__":
    main()