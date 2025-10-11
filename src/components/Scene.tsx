"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function Scene() {
  return (
    <Canvas camera={{ position: [2, 2, 2], fov: 60 }}>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 3, 3]} intensity={1} />

      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  );
};


