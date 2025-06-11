// frontend/src/App.jsx
import { useEffect, useState } from "react";
import { connectTelemetry } from "./utils/telemetrySocket";
import OrbitVisualizer from "./components/OrbitVisualizer";
import Popup from "./components/Popup";

function App() {
  const [telemetry, setTelemetry] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    connectTelemetry(setTelemetry);
  }, []);

  const handleSatelliteClick = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  return (
    <div>
      <OrbitVisualizer telemetry={telemetry} onSatelliteClick={handleSatelliteClick} />
      {popupVisible && telemetry && (
        <Popup telemetry={telemetry} onClose={closePopup} />
      )}
    </div>
  );
}

export default App;
