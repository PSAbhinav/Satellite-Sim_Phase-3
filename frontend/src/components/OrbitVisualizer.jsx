// src/components/OrbitVisualizer.jsx
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";
import Satellite from "./SatelliteView"; // ✅ Updated satellite

function Earth() {
  const [colorMap, specMap, cloudMap] = useLoader(THREE.TextureLoader, [
    "/textures/earth_daymap.jpg",
    "/textures/earth_specular.jpg",
    "/textures/earth_clouds.jpg",
  ]);

  const earthRef = useRef();
  const cloudsRef = useRef();

  useFrame(() => {
    earthRef.current.rotation.y += 0.001;
    cloudsRef.current.rotation.y += 0.0015;
  });

  return (
    <>
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          specularMap={specMap}
          specular={new THREE.Color("grey")}
          shininess={15}
        />
      </mesh>
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.52, 64, 64]} />
        <meshPhongMaterial
          map={cloudMap}
          transparent={true}
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function OrbitPath() {
  const points = [];
  const radius = 5;
  for (let i = 0; i <= 360; i++) {
    const angle = (i * Math.PI) / 180;
    points.push(new THREE.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle)));
  }

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial attach="material" color="white" linewidth={1} />
    </line>
  );
}

function GalaxyBackground() {
  const texture = useLoader(TextureLoader, "/textures/galaxy.jpg");
  return (
    <mesh>
      <sphereGeometry args={[500, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

export default function OrbitVisualizer({ telemetry }) {
  const [selected, setSelected] = useState(false);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls />

        <Suspense fallback={null}>
          <GalaxyBackground />
          <Earth />
          <OrbitPath />
          <Satellite telemetry={telemetry} onClick={() => setSelected(true)} />
        </Suspense>
      </Canvas>

      {selected && telemetry && (
        <div style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          background: "#222",
          color: "white",
          padding: "1rem",
          borderRadius: "10px",
          zIndex: 1
        }}>
          <h3>Satellite Telemetry</h3>
          <p><strong>Timestamp:</strong> {telemetry.timestamp}</p>
          <p><strong>Altitude:</strong> {telemetry.altitude} km</p>
          <p><strong>Velocity:</strong> {telemetry.velocity} km/s</p>
          <p><strong>Temperature:</strong> {telemetry.temperature} °C</p>
          <button onClick={() => setSelected(false)} style={{ marginTop: "0.5rem" }}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}
