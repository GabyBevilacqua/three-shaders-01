"use client";

import { useEffect, useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { latLngToVector3 } from "@/utils/coords";

type Props = {
  lat: number;
  lng: number;
  country: string;
  population: number;
  radius?: number; // radio del globo (por defecto 1)
  color?: string;
  calibration?: { lonOffset?: number; latOffset?: number; invertLon?: boolean };
};

export default function CountryBox({
  lat,
  lng,
  country,
  population,
  radius = 1,
  color = "#3BF7FF",
  calibration,
}: Props & { calibration?: { lonOffset?: number; latOffset?: number; invertLon?: boolean } }) {
  const meshRef = useRef<Mesh | null>(null);

  // convertir lat/lng a radianes
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;

  // escala basada en población usando logaritmo para cubrir rangos grandes
  // Esto hace que diferencias grandes en población se traduzcan en diferencias visibles
  const popLog = Math.log10(Math.max(1, population));
  const minLog = 4; // 10^4 = 10k
  const maxLog = 10; // 10^10 (to cap very large values)
  const t = Math.min(1, Math.max(0, (popLog - minLog) / (maxLog - minLog)));

  // baseScale entre 0.03 y 1.0 según población (interpolado por t)
  const baseScale = 0.03 + t * (1.0 - 0.03);

  // profundidad (altura) de la caja, entre 0.04 y 1.2
  const depth = 0.02 + t * (0.4 - 0.02);

// CORRECCIÓN DE ORIENTACIÓN: 
// giramos el eje de referencia 90° en longitud para que coincida con la textura del globo
const adjustedLng = lngRad + Math.PI; // o -Math.PI/2, depende del mapa

// Cálculo de la posición sobre la esfera
const x = radius * Math.cos(latRad) * Math.cos(adjustedLng);
const y = radius * Math.sin(latRad);
const z = radius * Math.cos(latRad) * Math.sin(adjustedLng);

  // colocaremos la caja **fuera** de la esfera desplazando a lo largo del vector normal
  // en render (useFrame) para no tener problemas de SSR
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

  // calcula la posición exacta en la superficie usando la misma lógica que DebugMarker
  // añadimos un pequeño offset (radius + 0.02) para que la caja no intersecte la superficie
  const surfacePos = latLngToVector3(lat, lng, radius + 0.02, calibration ?? {});

  // colocamos el mesh en esa posición
  mesh.position.copy(surfacePos);

  // normal desde el centro hacia el punto en la superficie
  const dir = surfacePos.clone().normalize();

  // sacamos la caja hacia fuera para que su base quede pegada:
  // usa depth/2 o un extra fijo según prefieras
  const extra = depth / 2; // o const extra = 0.05;
  mesh.position.add(dir.multiplyScalar(extra));

    // apuntar hacia el centro
    mesh.lookAt(0, 0, 0);

    // animación pulsante en Z
    gsap.to(mesh.scale, {
      z: 1.4,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "linear",
      delay: Math.random() * 1.0,
    });
  }, [x, y, z, depth, radius]);

  // pequeña rotación continua opcional para dar vida
  useFrame(() => {
    if (!meshRef.current) return;
    // podemos hacer un leve sway si quieres
    // meshRef.current.rotation.z += 0.001;
  });

  return (
    <mesh ref={meshRef}>
      {/* Tamaños X,Y reducidos para que las cajas sean más discretas; Z = depth */}
      <boxGeometry 
      args={[Math.max(0.02, 0.03 * baseScale), Math.max(0.02, 0.03 * baseScale), depth * 0.8]} />
      <meshBasicMaterial color={color} opacity={0.4} transparent />
      {/* Añade propiedades para debugging */}
      {/* @ts-ignore */}
      {/* meshRef.current!.userData = { country, population } */}
    </mesh>
  );
}
