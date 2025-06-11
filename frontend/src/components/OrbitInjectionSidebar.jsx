import { useState, useEffect } from "react";

export default function OrbitInjectionSidebar({
  injectionParams,
  setInjectionParams,
  satelliteState,
  onInject
}) {
  const [status, setStatus] = useState("Pending");

  const targetApogee = 7;
  const targetPerigee = 5;
  const targetInclination = 30;
  const altitudeTolerance = 0.3;
  const inclinationTolerance = 2;
  const targetAltitude = (targetApogee + targetPerigee) / 2;

  useEffect(() => {
    if (!satelliteState) return;
    const { radius, inclination = 0 } = satelliteState;
    const radiusDiff = Math.abs(radius - targetAltitude);
    const inclinationDiff = Math.abs(inclination - targetInclination);

    if (radiusDiff <= altitudeTolerance && inclinationDiff <= inclinationTolerance) {
      setStatus("Success");
    } else if (radius > targetAltitude + altitudeTolerance) {
      setStatus("Overshot");
    } else if (radius < targetAltitude - altitudeTolerance) {
      setStatus("Undershot");
    } else {
      setStatus("Pending");
    }
  }, [satelliteState]);

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    marginTop: "0.25rem",
    marginBottom: "1rem",
    borderRadius: "6px",
    background: "#222",
    border: "1px solid #444",
    color: "#fff"
  };

  const labelStyle = {
    fontSize: "0.9rem",
    display: "block",
    marginBottom: "0.2rem"
  };

  const buttonStyle = {
    marginTop: "1rem",
    width: "100%",
    padding: "0.6rem",
    fontSize: "1rem",
    fontWeight: "bold",
    background: "#00bfff",
    color: "#000",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  };

  return (
    <div style={{
      position: "absolute",
      top: "1rem",
      left: "1rem",
      width: "320px",
      background: "#111",
      color: "#fff",
      padding: "1.5rem",
      borderRadius: "10px",
      zIndex: 10,
      fontFamily: "monospace",
      boxShadow: "0 0 15px rgba(0,0,0,0.6)"
    }}>
      <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>🛰️ Orbit Injection Settings</h3>

      <label style={labelStyle}>Apogee (Earth units)</label>
      <input
        type="number"
        value={injectionParams.apogee ?? ""}
        onChange={(e) =>
          setInjectionParams({ ...injectionParams, apogee: parseFloat(e.target.value) })
        }
        style={inputStyle}
      />

      <label style={labelStyle}>Perigee (Earth units)</label>
      <input
        type="number"
        value={injectionParams.perigee ?? ""}
        onChange={(e) =>
          setInjectionParams({ ...injectionParams, perigee: parseFloat(e.target.value) })
        }
        style={inputStyle}
      />

      <label style={labelStyle}>Eccentricity</label>
      <input
        type="number"
        step="0.001"
        value={injectionParams.eccentricity ?? ""}
        onChange={(e) =>
          setInjectionParams({ ...injectionParams, eccentricity: parseFloat(e.target.value) })
        }
        style={inputStyle}
      />

      <label style={labelStyle}>Burn Duration (sec)</label>
      <input
        type="number"
        value={injectionParams.burnDuration ?? ""}
        onChange={(e) =>
          setInjectionParams({ ...injectionParams, burnDuration: parseFloat(e.target.value) })
        }
        style={inputStyle}
      />

      <label style={labelStyle}>Thrust (Δspeed/frame)</label>
      <input
        type="number"
        step="0.01"
        value={injectionParams.thrust ?? ""}
        onChange={(e) =>
          setInjectionParams({ ...injectionParams, thrust: parseFloat(e.target.value) })
        }
        style={inputStyle}
      />

      <label style={labelStyle}>Coast Speed</label>
      <input
        type="number"
        step="0.001"
        value={injectionParams.coastSpeed ?? ""}
        onChange={(e) =>
          setInjectionParams({ ...injectionParams, coastSpeed: parseFloat(e.target.value) })
        }
        style={inputStyle}
      />

      <label style={labelStyle}>Inclination (°)</label>
      <input
        type="number"
        step="0.1"
        value={injectionParams.inclination ?? ""}
        onChange={(e) =>
          setInjectionParams({ ...injectionParams, inclination: parseFloat(e.target.value) })
        }
        style={inputStyle}
      />

      <button onClick={onInject} style={buttonStyle}>
        🚀 Inject Satellite
      </button>

      <p style={{ marginTop: "1rem", fontSize: "0.95rem" }}>
        <strong>Status:</strong>{" "}
        <span style={{
          color:
            status === "Success" ? "lightgreen" :
            status === "Overshot" ? "#ff4c4c" :
            status === "Undershot" ? "#ffa500" :
            "yellow"
        }}>
          {status}
        </span>
      </p>
    </div>
  );
}
