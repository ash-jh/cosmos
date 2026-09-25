class FaultManager:
    VALID_FAULTS = {
        None,
        "battery_degradation",
        "battery_overheating",
        "bus_undervoltage",
        "cpu_overload",
        "obc_overheating",
        "adcs_instability",
        "communication_degradation",
    }

    def __init__(self):
        self.active_fault = None

    def activate(self, fault: str):
        if fault not in self.VALID_FAULTS:
            raise ValueError(f"Unknown fault: {fault}")

        self.active_fault = fault

    def clear(self):
        self.active_fault = None

    def current(self):
        return self.active_fault