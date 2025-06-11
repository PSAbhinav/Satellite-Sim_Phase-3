export default function TelemetryPanel({ satelliteState }) {
  const boxStyle = {
    background: "#111",
    color: "#fff",
    padding: "1rem",
    borderRadius: "10px",
    width: "320px",
    position: "absolute",
    top: "1rem",
    right: "1rem",
    fontFamily: "monospace",
    boxShadow: "0 0 15px rgba(0,0,0,0.6)"
  };

  if (!satelliteState) return null;

  const {
    radius,
    speed,
    inclination,
    eccentricity,
    targetAltitude,
    targetInclination,
    fuelLeft,
    position
  } = satelliteState;

  return (
    <div style={boxStyle}>
      <h3 style={{ marginBottom: "0.8rem", fontSize: "1.2rem" }}>📊 Orbit Injection Telemetry</h3>
      <p><strong>Phase:</strong> Orbit Injection</p>
      <p><strong>Time:</strong> {new Date().toISOString()}</p>
      <p><strong>Altitude:</strong> {(radius * 6371).toFixed(2)} km</p>
      <p><strong>Velocity:</strong> {speed.toFixed(3)} km/s</p>
      <p><strong>Temperature:</strong> {(-20 + speed * 100).toFixed(1)} °C</p>
      <p><strong>Fuel Left:</strong> {fuelLeft.toFixed(1)}%</p>
      <p><strong>Target Altitude:</strong> {targetAltitude.toFixed(2)} km</p>
      <p><strong>Target Inclination:</strong> {targetInclination.toFixed(1)}°</p>
      <p><strong>Status:</strong> {fuelLeft <= 0 ? "Burn Complete" : "Burning..."}</p>

      <div style={{
        marginTop: "1rem",
        fontSize: "0.9rem",
        background: "#222",
        padding: "0.75rem",
        borderRadius: "6px",
        border: "1px solid #333"
      }}>
        <h4 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>📡 Live Satellite State</h4>
        <p><strong>Radius:</strong> {radius.toFixed(2)}</p>
        <p><strong>Speed:</strong> {speed.toFixed(3)}</p>
        <p><strong>Inclination:</strong> {inclination.toFixed(1)}°</p>
        <p><strong>Eccentricity:</strong> {eccentricity?.toFixed(3) ?? "0.000"}</p>
        <p><strong>Position:</strong></p>
        <ul style={{ marginTop: 0, paddingLeft: "1.2rem" }}>
          <li>X: {position.x.toFixed(2)}</li>
          <li>Y: {position.y.toFixed(2)}</li>
          <li>Z: {position.z.toFixed(2)}</li>
        </ul>
      </div>
    </div>
  );
}
