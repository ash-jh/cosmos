import random


class EPSSimulator:
    def __init__(self):
        self.state_of_charge = 82.0

    def update(self, fault=None):
        current = random.gauss(1.8, 0.08)

        battery_voltage = random.gauss(7.42, 0.025)
        battery_temperature = random.gauss(31.0, 0.3)

        # Normal battery discharge
        self.state_of_charge -= 0.002

        # Fault effects
        if fault == "battery_degradation":
            battery_voltage -= 0.45
            current += 0.35

        elif fault == "battery_overheating":
            battery_temperature += 12.0

        elif fault == "bus_undervoltage":
            battery_voltage -= 0.65

        battery_voltage = max(battery_voltage, 5.5)

        bus_voltage = battery_voltage - random.gauss(0.10, 0.015)

        return {
            "battery_voltage": round(battery_voltage, 3),
            "battery_current": round(current, 3),
            "battery_temperature": round(battery_temperature, 2),
            "bus_voltage": round(bus_voltage, 3),
            "state_of_charge": round(self.state_of_charge, 2),
        }