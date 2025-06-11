import asyncio
import websockets
import json
import datetime

# Initial state
fuel = 100.0  # %
burn_rate = 0.4  # % per second
initial_radius = 6771  # km (Earth radius + 400km orbit)
target_inclination = 98.7  # degrees (Sun-synchronous for example)
phase = "Orbit Injection"  # or "Coasting", etc.

async def telemetry_sender(websocket):
    global fuel
    while True:
        # Simulate telemetry
        telemetry = {
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "phase": phase,
            "altitude": round(initial_radius - 6371 + (0.1 - 0.05), 2),  # km above Earth's surface
            "velocity": round(7.5 + (0.3 * (fuel / 100)), 2),
            "temperature": round(-20 + 70 * (fuel / 100), 2),
            "fuel": round(fuel, 1),
            "initialRadius": initial_radius,
            "targetInclination": target_inclination
        }

        # Decrease fuel if burning
        if fuel > 0:
            fuel -= burn_rate
            fuel = max(fuel, 0)

        await websocket.send(json.dumps(telemetry))
        await asyncio.sleep(1)

async def main():
    async with websockets.serve(telemetry_sender, "localhost", 8000):
        print("WebSocket server started on ws://localhost:8000")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
