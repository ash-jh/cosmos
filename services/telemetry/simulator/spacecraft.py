from datetime import datetime, timezone

from services.telemetry.schema.telemetry import (
    TelemetryData,
    TelemetryPacket,
)

from services.telemetry.simulator.adcs import ADCSSimulator
from services.telemetry.simulator.comm import CommSimulator
from services.telemetry.simulator.eps import EPSSimulator
from services.telemetry.simulator.faults import FaultManager
from services.telemetry.simulator.obc import OBCSimulator
from services.telemetry.simulator.thermal import ThermalSimulator


class SpacecraftSimulator:
    def __init__(self):
        self.sequence = 0

        self.eps = EPSSimulator()
        self.obc = OBCSimulator()
        self.adcs = ADCSSimulator()
        self.comm = CommSimulator()
        self.thermal = ThermalSimulator()
        self.faults = FaultManager()

    def step(self):
        self.sequence += 1

        fault = self.faults.current()

        eps_data = self.eps.update(fault)
        obc_data = self.obc.update(fault)
        adcs_data = self.adcs.update(fault)
        comm_data = self.comm.update(fault)
        thermal_data = self.thermal.update(
            eps_data,
            obc_data,
        )

        telemetry = TelemetryData(
            **eps_data,
            **obc_data,
            **adcs_data,
            **comm_data,
            **thermal_data,
        )

        return TelemetryPacket(
            missionId="rvce-cubesat-01",
            spacecraftId="cosmos-sat-01",
            timestamp=datetime.now(timezone.utc),
            source="simulator",
            sequence=self.sequence,
            telemetry=telemetry,
        )