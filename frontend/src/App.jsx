import { useEffect, useState } from "react";
import { connectTelemetry } from "./utils/telemetrySocket";
import OrbitVisualizer from "./components/OrbitVisualizer";
import OrbitInjectionSidebar from "./components/OrbitInjectionSidebar";
import TelemetryPanel from "./components/TelemetryPanel";
import Popup from "./components/Popup";

function App() {
  const [telemetry, setTelemetry] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [injectionParams, setInjectionParams] = useState({});
  const [satelliteState, setSatelliteState] = useState(null);

  useEffect(() => {
    connectTelemetry(setTelemetry);
  }, []);

  const handleInjection = () => {
    setSatelliteState({
      radius: (injectionParams.apogee + injectionParams.perigee) / 2,
      inclination: injectionParams.inclination,
      speed: 0,
      position: { x: 0, y: 0, z: 0 },
      timestamp: Date.now(),
    });
  };

  return (
    <div>
      <OrbitInjectionSidebar
        injectionParams={injectionParams}
        setInjectionParams={setInjectionParams}
        satelliteState={satelliteState}
        onInject={handleInjection}
      />

      <OrbitVisualizer
        telemetry={telemetry}
        injectionParams={injectionParams}
        onSatelliteClick={() => setPopupVisible(true)}
        setSatelliteState={setSatelliteState}
      />

      <TelemetryPanel satelliteState={satelliteState} />

      {popupVisible && telemetry && (
        <Popup telemetry={telemetry} onClose={() => setPopupVisible(false)} />
      )}
    </div>
  );
}

export default App;
