import random


class CommSimulator:
    def __init__(self):
        self.uplink_count = 0
        self.downlink_count = 0

    def update(self, fault=None):
        rssi = random.gauss(-68.0, 2.0)
        packet_loss = max(0.0, random.gauss(0.8, 0.3))

        self.downlink_count += 1

        if fault == "communication_degradation":
            rssi -= 18.0
            packet_loss += 12.0

        return {
            "rssi": round(rssi, 2),
            "packet_loss": round(packet_loss, 2),
            "uplink_count": self.uplink_count,
            "downlink_count": self.downlink_count,
        }