"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from 'react';
import Globe from "./Globe";
import StarGeometry from "./StarGeometry";
import CountryBoxes from "./CountryBoxes";


export default function Scene() {
  return (
    <Canvas
      // Usa dpr para asegurar la nitidez de la textura en pantallas de alta densidad 
      // dpr={[3, 4]} no funciona bien 
      camera={{
        position: [2, 2, 2],
        fov: 60
      }}
      gl={{ antialias: true }}
    >
      <OrbitControls /> {/*autoRotate*/}
      <ambientLight intensity={2} />
      <directionalLight position={[3, 3, 3]} intensity={1} />

      {/* El componente Globe debe estar envuelto en Suspense */}
      <Suspense fallback={null /* o un componente de carga */}>
        <Globe />
         {/* Ponemos las cajas con radius=1 si tu globo es radius 1 */}
        {/* <CountryBoxes radius={1} /> */}
      </Suspense>

      <StarGeometry />

    </Canvas>
  );
};


