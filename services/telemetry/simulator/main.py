import asyncio
import json

from services.telemetry.simulator.spacecraft import SpacecraftSimulator


async def main():
    spacecraft = SpacecraftSimulator()

    print("==========================================")
    print(" COSMOS SPACECRAFT TELEMETRY SIMULATOR")
    print(" Mission:    RVCE CubeSat-01")
    print(" Spacecraft: COSMOS-SAT-01")
    print("==========================================")
    print()

    while True:
        packet = spacecraft.step()

        print(
            json.dumps(
                packet.model_dump(mode="json"),
                indent=2,
            )
        )

        await asyncio.sleep(1)


if __name__ == "__main__":
    asyncio.run(main())