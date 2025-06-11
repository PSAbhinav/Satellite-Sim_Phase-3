// OrbitVisualizer.jsx
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState, Suspense } from "react";
import * as THREE from "three";
import SatelliteView from "./SatelliteView";

function Earth() {
  const [dayMap, specMap, cloudMap, nightMap] = useLoader(THREE.TextureLoader, [
    "/textures/earth_daymap.jpg",
    "/textures/earth_specular.jpg",
    "/textures/earth_clouds.jpg",
    "/textures/earth_nightmap.jpg",
  ]);

  const earthRef = useRef();
  const cloudsRef = useRef();

  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      dayTexture: { value: dayMap },
      nightTexture: { value: nightMap },
      lightDirection: { value: new THREE.Vector3(1, 0, 0) }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vWorldNormal;

      void main() {
        vUv = uv;
        // Transform normal to world space
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D dayTexture;
      uniform sampler2D nightTexture;
      uniform vec3 lightDirection;

      varying vec2 vUv;
      varying vec3 vWorldNormal;

      void main() {
        float intensity = dot(normalize(vWorldNormal), normalize(lightDirection));
        intensity = clamp(intensity, 0.0, 1.0);

        vec4 dayColor = texture2D(dayTexture, vUv);
        vec4 nightColor = texture2D(nightTexture, vUv);

        // Optional: darken the day texture for deep blue oceans
        dayColor.rgb *= 0.85;

        gl_FragColor = mix(nightColor, dayColor, intensity);
      }
    `
  });

  useFrame(() => {
    earthRef.current.rotation.y += 0.001;
    cloudsRef.current.rotation.y += 0.0015;

    const t = Date.now() * 0.0001;
    const x = Math.sin(t);
    const z = Math.cos(t);
    shaderMaterial.uniforms.lightDirection.value.set(x, 0, z).normalize();
  });

  return (
    <>
      <mesh ref={earthRef} position={[0, 0, 0]}>

        <sphereGeometry args={[1.5, 64, 64]} />
        <primitive object={shaderMaterial} attach="material" />
      </mesh>

      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.52, 64, 64]} />
        <meshPhongMaterial
          map={cloudMap}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}


function Sunlight() {
  return (
    <>
      <directionalLight
        position={[200, 0, 0]} // Sunlight comes from +X direction
        intensity={1.2}
        color={0xffffff}
        castShadow
      />
      <ambientLight intensity={0.2} />
    </>
  );
}

function GalaxyBackground() {
  const texture = useLoader(THREE.TextureLoader, "/textures/galaxy.jpg");
  return (
    <mesh>
      <sphereGeometry args={[500, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

export default function OrbitVisualizer({ telemetry, injectionParams }) {
  const [selected, setSelected] = useState(false);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
        <OrbitControls />
        <Suspense fallback={null}>
          <GalaxyBackground />
          <Sunlight />
          <Earth />
          <SatelliteView
            telemetry={telemetry}
            injectionParams={injectionParams}
            onClick={() => setSelected(true)}
          />
        </Suspense>
      </Canvas>

      {telemetry && injectionParams && (
        <div style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          background: "rgba(20, 20, 20, 0.85)",
          color: "white",
          padding: "1rem 1.5rem",
          borderRadius: "10px",
          zIndex: 10,
          fontFamily: "monospace"
        }}>
        </div>
      )}
    </div>
  );
}
