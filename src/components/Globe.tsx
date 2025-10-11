"use client";

import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, AdditiveBlending, ShaderMaterial, Mesh } from "three";

export default function Globe() {
  const meshRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const [texture] = useLoader(TextureLoader, ["/img/globe.jpg"]);

  // 🔹 Shaders inline (sin loaders)
  const vertexShader = `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vNormal;
    void main() {
      // Cálculo de intensidad del halo según el ángulo
      float intensity = pow(0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
      vec3 glow = vec3(0.2, 0.5, 1.0) * intensity;
      gl_FragColor = vec4(glow, 1.0);
    }
  `;

  // 🔹 Material personalizado para el halo
  const glowMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        blending: AdditiveBlending,
        transparent: true,
        side: 2, // THREE.BackSide (para verse desde fuera)
      }),
    []
  );

  // 🔹 Animación (rotación)
  useFrame(() => {
    if (meshRef.current && glowRef.current) {
      meshRef.current.rotation.y += 0.002;
      glowRef.current.rotation.y += 0.002;
    }
  });

  return (
    <>
      {/* 🌍 Globo principal con textura */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={texture} color="white" />
      </mesh>

      {/* 💫 Halo azul */}
      <mesh ref={glowRef} scale={1.05} material={glowMaterial}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>
    </>
  );
}
