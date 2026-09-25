import random


class ThermalSimulator:
    def update(self, eps_data, obc_data):
        battery_temperature = eps_data["battery_temperature"]
        obc_temperature = obc_data["obc_temperature"]

        payload_temperature = (
            25.0
            + (battery_temperature - 30.0) * 0.15
            + (obc_temperature - 35.0) * 0.10
            + random.gauss(0, 0.25)
        )

        return {
            "payload_temperature": round(payload_temperature, 2),
        }