// frontend/src/components/TelemetryPanel.jsx
import { useEffect, useState } from "react";
import socket from "../websocket";

export default function TelemetryPanel() {
  const [telemetry, setTelemetry] = useState({});

  useEffect(() => {
    socket.onmessage = (event) => {
      setTelemetry(JSON.parse(event.data));
    };
  }, []);

  return (
    <div className="p-4 bg-gray-800 text-white rounded shadow-md">
      <h2 className="text-lg font-bold mb-2">Live Telemetry</h2>
      <pre>{JSON.stringify(telemetry, null, 2)}</pre>
    </div>
  );
}
