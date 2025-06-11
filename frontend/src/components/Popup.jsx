// frontend/src/components/Popup.jsx
export default function Popup({ telemetry, onClose }) {
  return (
    <div style={popupStyles.overlay}>
      <div style={popupStyles.box}>
        <button style={popupStyles.closeButton} onClick={onClose}>X</button>
        <h3>Satellite Telemetry</h3>
        <p><strong>Timestamp:</strong> {telemetry.timestamp}</p>
        <p><strong>Altitude:</strong> {telemetry.altitude} km</p>
        <p><strong>Velocity:</strong> {telemetry.velocity} km/s</p>
        <p><strong>Temperature:</strong> {telemetry.temperature} °C</p>
      </div>
    </div>
  );
}

const popupStyles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  box: {
    background: "#fff",
    color: "#000",
    padding: "20px",
    borderRadius: "12px",
    minWidth: "300px",
    boxShadow: "0 0 10px rgba(0,0,0,0.25)"
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 15,
    background: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer"
  }
};
