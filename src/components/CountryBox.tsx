"use client";

import { useEffect, useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";

type Props = {
  lat: number;
  lng: number;
  country: string;
  population: number;
  radius?: number; // radio del globo (por defecto 1)
  color?: string;
};

export default function CountryBox({
  lat,
  lng,
  country,
  population,
  radius = 1,
  color = "#3BF7FF",
}: Props) {
  const meshRef = useRef<Mesh | null>(null);

  // convertir lat/lng a radianes
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;

  // escala basada en población (ajusta la fórmula a tu gusto)
  const baseScale = Math.max(0.03, Math.min(1.0, population / 1_000_000_000)); // 0.1..1
  const depth = Math.max(0.03, 0.5 * baseScale); // tamaño en Z

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

    // ajustar la geometría: la caja la creamos centrada, así que desplazamos su posición
    // moveremos la posición hacia fuera para que el "pie" de la caja quede pegado al globo
    const dir = mesh.position.clone().normalize(); // dirección desde el centro
    // posicion original en la superficie
    mesh.position.set(x, y, z);
    // sacamos el centro hacia fuera por (depth/2) sobre el radio
    const extra = 0.05; // proporción
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
      {/* El tamaño X,Y lo hacemos proporcional (mínimo 0.03), Z será depth */}
      <boxGeometry args={[Math.max(0.03, 0.05 * baseScale), Math.max(0.03, 0.05 * baseScale), depth * 0.8]} />
      <meshBasicMaterial color={color} opacity={0.4} transparent />
      {/* Añade propiedades para debugging */}
      {/* @ts-ignore */}
      {/* meshRef.current!.userData = { country, population } */}
    </mesh>
  );
}
