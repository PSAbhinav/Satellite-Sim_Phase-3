let socket;

export function connectTelemetry(callback) {
  socket = new WebSocket("ws://localhost:8000");

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    callback(data);
  };

  socket.onerror = (err) => {
    console.error("WebSocket error", err);
  };
}
