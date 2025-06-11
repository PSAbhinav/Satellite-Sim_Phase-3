import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function SatelliteView({ injectionParams = {}, onClick, setSatelliteState }) {
  const satelliteRef = useRef();
  const trailGeometryRef = useRef();
  const orbitGeometryRef = useRef();

  const { scene } = useGLTF("/models/meteor-m2.glb");

  const trailPointsRef = useRef([]);
  const theta = useRef(0);
  const speedRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const lastThetaRef = useRef(0);
  const fuelRef = useRef(100); // Simple simulation

  const {
    apogee = 7,
    perigee = 5,
    burnDuration = 10,
    thrust = 0.05,
    coastSpeed = 0.008,
    inclination = 0,
  } = injectionParams;

  const semiMajor = (apogee + perigee) / 2;
  const semiMinor = Math.sqrt(apogee * perigee); // Approximation
  const inclinationRad = (inclination * Math.PI) / 180;
  const eccentricity = (apogee - perigee) / (apogee + perigee);
  const targetAltitude = semiMajor * 6371;
  const targetInclination = inclination;

  useEffect(() => {
    theta.current = 0;
    speedRef.current = 0;
    fuelRef.current = 100;
    trailPointsRef.current = [];
    lastThetaRef.current = 0;
    startTimeRef.current = Date.now();

    const points = [];
    for (let i = 0; i <= 360; i++) {
      const angle = (i * Math.PI) / 180;
      const x = semiMajor * Math.cos(angle);
      const y = semiMinor * Math.sin(angle) * Math.sin(inclinationRad);
      const z = semiMinor * Math.sin(angle) * Math.cos(inclinationRad);
      points.push(new THREE.Vector3(x, y, z));
    }

    if (orbitGeometryRef.current) {
      orbitGeometryRef.current.setFromPoints(points);
    }
  }, [apogee, perigee, inclination]);

  useFrame(() => {
    const now = Date.now();
    const elapsed = (now - startTimeRef.current) / 1000;

    // Simulate thrust burn
    if (elapsed < burnDuration && fuelRef.current > 0) {
      speedRef.current += thrust;
      fuelRef.current -= 0.2;
    } else {
      speedRef.current = coastSpeed;
      fuelRef.current = Math.max(fuelRef.current, 0);
    }

    theta.current += speedRef.current;

    const x = semiMajor * Math.cos(theta.current);
    const y = semiMinor * Math.sin(theta.current) * Math.sin(inclinationRad);
    const z = semiMinor * Math.sin(theta.current) * Math.cos(inclinationRad);

    if (satelliteRef.current) {
      satelliteRef.current.position.set(x, y, z);
      satelliteRef.current.rotation.y += 0.005;
      const scaleFactor = 0.04 * (semiMajor / 5);
      satelliteRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }

    // Update trail
    trailPointsRef.current.push(new THREE.Vector3(x, y, z));
    if (trailPointsRef.current.length > 360) {
      trailPointsRef.current.shift();
    }
    if (trailGeometryRef.current) {
      trailGeometryRef.current.setFromPoints(trailPointsRef.current);
    }

    // One revolution complete
    if (theta.current - lastThetaRef.current >= Math.PI * 2) {
      trailPointsRef.current = [];
      theta.current = 0;
    }
    lastThetaRef.current = theta.current;

    if (setSatelliteState) {
      setSatelliteState({
        radius: semiMajor,
        speed: speedRef.current,
        inclination,
        position: { x, y, z },
        eccentricity,
        targetAltitude,
        targetInclination,
        fuelLeft: fuelRef.current,
      });
    }
  });

  return (
    <>
      <primitive ref={satelliteRef} object={scene} onClick={onClick} />
      <line>
        <bufferGeometry ref={trailGeometryRef} attach="geometry" />
        <lineBasicMaterial color="red" linewidth={1} />
      </line>
      <line>
        <bufferGeometry ref={orbitGeometryRef} attach="geometry" />
        <lineBasicMaterial color="cyan" transparent opacity={0.3} />
      </line>
    </>
  );
}
