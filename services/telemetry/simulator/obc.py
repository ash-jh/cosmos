import random


class OBCSimulator:
    def __init__(self):
        self.reboot_count = 0

    def update(self, fault=None):
        cpu_utilization = random.gauss(34.0, 4.0)
        memory_utilization = random.gauss(42.0, 2.5)

        if fault == "cpu_overload":
            cpu_utilization += 45.0
            memory_utilization += 15.0

        cpu_utilization = max(0.0, min(cpu_utilization, 100.0))
        memory_utilization = max(0.0, min(memory_utilization, 100.0))

        obc_temperature = (
            36.0
            + cpu_utilization * 0.12
            + random.gauss(0, 0.4)
        )

        if fault == "obc_overheating":
            obc_temperature += 15.0

        return {
            "obc_cpu_utilization": round(cpu_utilization, 2),
            "obc_temperature": round(obc_temperature, 2),
            "obc_memory_utilization": round(memory_utilization, 2),
            "reboot_count": self.reboot_count,
        }