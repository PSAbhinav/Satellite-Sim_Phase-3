# backend/main.py
import asyncio
import websockets
import json
import random
import datetime

async def telemetry_sender(websocket):
    while True:
        telemetry = {
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "altitude": round(random.uniform(400, 410), 2),
            "velocity": round(random.uniform(7.5, 7.8), 2),
            "temperature": round(random.uniform(-20, 50), 2)
        }
        await websocket.send(json.dumps(telemetry))
        await asyncio.sleep(1)

async def main():
    async with websockets.serve(telemetry_sender, "localhost", 8000):
        print("WebSocket server started on ws://localhost:8000")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
