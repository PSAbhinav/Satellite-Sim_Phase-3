// src/components/Satellite.jsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

export default function Satellite({ onClick }) {
  const ref = useRef();
  const { scene } = useGLTF("/models/meteor-m2.glb");

  const radius = 5;
  const speed = 0.01;
  const theta = useRef(0);

  useFrame(() => {
    theta.current += speed;
    const x = radius * Math.cos(theta.current);
    const z = radius * Math.sin(theta.current);
    ref.current.position.set(x, 0, z);
    ref.current.rotation.y += 0.005;
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={0.04}
      onClick={onClick}
    />
  );
}
