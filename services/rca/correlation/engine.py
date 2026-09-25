from services.ml.schemas.anomaly import AnomalyResult
from services.rca.schema import RCAResult


class CorrelationEngine:
    """
    Rule-based multi-parameter correlation engine.

    This is an interpretable baseline for RCA.
    It does not claim causal certainty.
    """

    def analyze(
        self,
        anomaly: AnomalyResult,
    ) -> RCAResult:

        values = {
            item.channel: item.value
            for item in anomaly.channels
        }

        affected = set(anomaly.affectedChannels)

        # --------------------------------------------------
        # EPS: Battery degradation
        # --------------------------------------------------
        if {
            "battery_voltage",
            "battery_current",
            "bus_voltage",
        }.issubset(affected):

            battery_voltage = values.get(
                "battery_voltage",
                7.42,
            )

            battery_current = values.get(
                "battery_current",
                1.80,
            )

            bus_voltage = values.get(
                "bus_voltage",
                7.32,
            )

            if (
                battery_voltage < 7.1
                and battery_current > 2.0
                and bus_voltage < 7.1
            ):
                return RCAResult(
                    status="suspected",
                    subsystem="EPS",
                    candidate_cause="battery_degradation",
                    confidence=0.88,
                    evidence=[
                        "Battery voltage is below nominal range.",
                        "Battery current is elevated.",
                        "Bus voltage is also depressed.",
                        "The correlated pattern is consistent with battery degradation.",
                    ],
                )

        # --------------------------------------------------
        # EPS: Bus undervoltage
        # --------------------------------------------------
        if {
            "battery_voltage",
            "bus_voltage",
        }.issubset(affected):

            battery_voltage = values.get(
                "battery_voltage",
                7.42,
            )

            bus_voltage = values.get(
                "bus_voltage",
                7.32,
            )

            if (
                battery_voltage > 7.1
                and bus_voltage < 6.8
            ):
                return RCAResult(
                    status="suspected",
                    subsystem="EPS",
                    candidate_cause="bus_undervoltage",
                    confidence=0.82,
                    evidence=[
                        "Battery voltage remains comparatively stable.",
                        "Bus voltage is significantly depressed.",
                        "The pattern suggests a downstream bus-voltage issue.",
                    ],
                )

        # --------------------------------------------------
        # OBC: CPU overload
        # --------------------------------------------------
        if {
            "obc_cpu_utilization",
            "obc_memory_utilization",
            "obc_temperature",
        }.issubset(affected):

            cpu = values.get(
                "obc_cpu_utilization",
                34.0,
            )

            memory = values.get(
                "obc_memory_utilization",
                42.0,
            )

            temperature = values.get(
                "obc_temperature",
                40.0,
            )

            if (
                cpu > 65
                and memory > 50
                and temperature > 43
            ):
                return RCAResult(
                    status="suspected",
                    subsystem="OBC",
                    candidate_cause="cpu_overload",
                    confidence=0.90,
                    evidence=[
                        "OBC CPU utilization is elevated.",
                        "OBC memory utilization is elevated.",
                        "OBC temperature increased alongside compute load.",
                    ],
                )

        # --------------------------------------------------
        # OBC: Overheating
        # --------------------------------------------------
        if "obc_temperature" in affected:

            temperature = values.get(
                "obc_temperature",
                40.0,
            )

            cpu = values.get(
                "obc_cpu_utilization",
                34.0,
            )

            if temperature > 52 and cpu < 65:
                return RCAResult(
                    status="suspected",
                    subsystem="OBC",
                    candidate_cause="obc_overheating",
                    confidence=0.78,
                    evidence=[
                        "OBC temperature is significantly elevated.",
                        "CPU utilization does not indicate a corresponding overload.",
                        "The pattern is consistent with a thermal issue.",
                    ],
                )

        # --------------------------------------------------
        # ADCS: Instability
        # --------------------------------------------------
        if {
            "angular_velocity_x",
            "angular_velocity_y",
            "attitude_error",
            "reaction_wheel_speed",
        }.intersection(affected):

            attitude_error = values.get(
                "attitude_error",
                0.15,
            )

            wheel_speed = values.get(
                "reaction_wheel_speed",
                1750.0,
            )

            if attitude_error > 1.0 or wheel_speed > 2200:
                return RCAResult(
                    status="suspected",
                    subsystem="ADCS",
                    candidate_cause="adcs_instability",
                    confidence=0.86,
                    evidence=[
                        "Attitude error is elevated or reaction-wheel speed is abnormal.",
                        "The pattern suggests degraded attitude-control stability.",
                    ],
                )

        # --------------------------------------------------
        # COMM: Communication degradation
        # --------------------------------------------------
        if {
            "rssi",
            "packet_loss",
        }.issubset(affected):

            rssi = values.get(
                "rssi",
                -68.0,
            )

            packet_loss = values.get(
                "packet_loss",
                0.8,
            )

            if rssi < -80 and packet_loss > 8:
                return RCAResult(
                    status="suspected",
                    subsystem="COMM",
                    candidate_cause="communication_degradation",
                    confidence=0.91,
                    evidence=[
                        "Received signal strength is significantly reduced.",
                        "Packet loss is elevated.",
                        "The combined pattern suggests communication degradation.",
                    ],
                )

        # --------------------------------------------------
        # No correlated explanation
        # --------------------------------------------------
        if anomaly.severity != "normal":
            return RCAResult(
                status="suspected",
                subsystem=None,
                candidate_cause=None,
                confidence=0.35,
                evidence=[
                    "One or more telemetry channels deviated from baseline.",
                    "No configured multi-parameter rule matched the current pattern.",
                ],
            )

        return RCAResult(
            status="no_issue",
            subsystem=None,
            candidate_cause=None,
            confidence=0.0,
            evidence=[],
        )