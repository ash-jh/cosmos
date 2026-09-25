import websocket


def main():
    ws = websocket.create_connection(
        "ws://localhost:8000/ws/telemetry"
    )

    print("Connected to COSMOS telemetry stream.")
    print()

    try:
        while True:
            message = ws.recv()
            print(message)

    except KeyboardInterrupt:
        print("\nDisconnected.")

    finally:
        ws.close()


if __name__ == "__main__":
    main()