"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import {
  TextureLoader,
  AdditiveBlending,
  ShaderMaterial,
  Mesh,
  DoubleSide,
  BackSide,
  Group
} from "three";
import CountryBoxes from "./CountryBoxes";
import DebugMarker from "./DebugMarker";

export default function Globe({ calibration }: { calibration?: { lonOffset: number; latOffset: number; invertLon: boolean } }) {
  const groupRef = useRef<Group>(null); // 👈 nuevo grupo que contendrá todo
  const globeRef = useRef<Mesh>(null);
  const atmosphereRef = useRef<Mesh>(null);
  const [texture] = useLoader(TextureLoader, ["/img/globe.jpg"]);
  


  /* ----------------------------------------------------------------
       🌍 SHADERS DEL GLOBO PRINCIPAL
       ----------------------------------------------------------------
       Estos shaders controlan cómo se dibuja la superficie del planeta.
       Incluyen el mapa de textura y un sutil efecto azul de atmósfera.
    */

  // 🧩 Vertex Shader (posición y normales del globo)
  const globeVertexShader = `
    // UV: coordenadas de textura (mapeo del planeta)
    varying vec2 vertexUV;

    // Normal: dirección perpendicular a la superficie
    varying vec3 vertexNormal;

    void main() {
      // Pasamos las coordenadas de textura al fragment shader
      vertexUV = uv;

      // Convertimos la normal al espacio de vista
      vertexNormal = normalize(normalMatrix * normal);

      // Calculamos la posición final del vértice en pantalla
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // 🎨 Fragment Shader (color y atmósfera en la superficie)
  const globeFragmentShader = `
    // Textura del planeta (imagen)
    uniform sampler2D globeTexture;

    // Valores interpolados desde el vertex shader
    varying vec2 vertexUV;
    varying vec3 vertexNormal;

    void main() {
      // Calculamos la intensidad de luz azul en base al ángulo de la normal
      // dot(a, b) mide qué tan alineadas están dos direcciones
      // Aquí, entre la normal y el eje Z (la "dirección de la cámara")
      float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));

      // Color de la atmósfera en la superficie
      // Se eleva con 'pow' para suavizar el borde
      vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 1.6);

      // Color base proveniente de la textura (el mapa del planeta)
      vec3 textureColor = texture2D(globeTexture, vertexUV).xyz;

      // Combinamos textura y atmósfera
      gl_FragColor = vec4(atmosphere + textureColor, 1.0);
    }
  `;

  /* ----------------------------------------------------------------
     💫 SHADERS DE LA ATMÓSFERA EXTERIOR (el halo)
     ----------------------------------------------------------------
     Esta segunda esfera es más grande y tiene un material transparente
     que crea el "glow" azulado que rodea el planeta.
  */

  // 🧩 Vertex Shader (solo pasa las normales)
  const atmosphereVertexShader = `
    // Enviamos la normal al fragment shader
    varying vec3 vertexNormal;

    void main() {
      // Normalizamos la normal transformada
      vertexNormal = normalize(normalMatrix * normal);

      // Calculamos la posición proyectada del vértice
      // (usamos 0.9 para mantener una ligera compresión de profundidad)
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0.9);
    }
  `;

  // 🎨 Fragment Shader (halo azulado)
  const atmosphereFragmentShader = `
    varying vec3 vertexNormal;

    void main() {
      // Calcula qué tan "de frente" está cada punto respecto al eje Z
      float intensity = pow(0.75 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);

      // Color azul con brillo proporcional a la intensidad
      gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
    }
  `;

  /* ----------------------------------------------------------------
     🧱 Creación de materiales personalizados con ShaderMaterial
     ---------------------------------------------------------------- */

  // 🌍 Material del globo con textura + atmósfera sutil
  const globeMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: globeVertexShader,
        fragmentShader: globeFragmentShader,
        uniforms: {
          globeTexture: { value: texture }, // Pasamos la textura al shader
        },
        side: DoubleSide, // Renderiza ambas caras (por seguridad)
      }),
    [texture]
  );

  // 💫 Material del halo atmosférico exterior
  const atmosphereMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        blending: AdditiveBlending, // Hace que se "sume" visualmente el brillo
        transparent: true, // Permite que se vea a través
        side: BackSide, // Renderiza la cara interna del halo
      }),
    []
  );

  /* ----------------------------------------------------------------
     🔁 Animación del planeta
     ---------------------------------------------------------------- */
  // useFrame(() => {
  //   if (globeRef.current && atmosphereRef.current) {
  //     // Rotamos ambos objetos lentamente sobre el eje Y
  //     globeRef.current.rotation.y += 0.001;
  //     atmosphereRef.current.rotation.y += 0.001;
  //   }
  // });

  // useFrame(() => {
  //   if (groupRef.current) {
  //     groupRef.current.rotation.y += 0.001; // 👈 rotamos TODO el grupo
  //   }
  // });

  return (

    <>
      <group ref={groupRef}>
        {/* 🌍 Globo con textura + leve atmósfera en superficie */}
        <mesh
          ref={globeRef}
          material={globeMaterial}
        >
          <sphereGeometry args={[1, 64, 64]} />
        </mesh>

        {/* 💫 Capa exterior de atmósfera */}
        <mesh ref={atmosphereRef} scale={1.1} material={atmosphereMaterial}>
          <sphereGeometry args={[1, 64, 64]} />
        </mesh>

        {/* 📊 Cajas de población */}
        <CountryBoxes radius={1}  calibration={calibration} />

        {/* 📍 Marcador de depuración en CDMX */}
        <DebugMarker
          lat={19.4326}
          lng={-99.1332}
          radius={1}
          opts={
            calibration ?? { lonOffset: Math.PI, latOffset: 0, invertLon: false }
          }
        />
      </group>
    </>
  );
}



/*

"use client";

import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, AdditiveBlending, ShaderMaterial, Mesh } from "three";

export default function Globe() {
  const globeRef = useRef<Mesh>(null);
  const atmosphereRef = useRef<Mesh>(null);
  const [texture] = useLoader(TextureLoader, ["/img/globe.jpg"]);

  // 🧠 Vertex Shader (mantiene la normal y dirección de vista)
  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewDir;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 viewPosition = modelViewMatrix * vec4(position, 0.95);
      vViewDir = normalize(viewPosition.xyz);
      gl_Position = projectionMatrix * viewPosition;
    }
  `;

  // 🌈 Fragment Shader (atmósfera azul realista)
  const fragmentShader = `
    varying vec3 vNormal;
    varying vec3 vViewDir;

    void main() {
      // Cálculo del ángulo entre la superficie y la cámara
      float angle = dot(vNormal, vViewDir);

      // Efecto más suave y difuso
      float intensity = pow(0.4 - angle, 9.0);

      // Gradiente de color (de azul intenso a celeste)
      vec3 innerColor = vec3(0.1, 0.3, 0.8);
      vec3 outerColor = vec3(0.4, 0.7, 1.0);

      // Mezcla los colores según la intensidad
      vec3 atmosphere = mix(outerColor, innerColor, intensity);

      gl_FragColor = vec4(atmosphere, intensity);
    }
  `;

  // ✨ Material para la atmósfera (shader custom)
  const atmosphereMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        blending: AdditiveBlending,
        transparent: true,
        side: 2, // THREE.BackSide
      }),
    []
  );

  // 🔄 Animación
  useFrame(() => {
    if (globeRef.current && atmosphereRef.current) {
      globeRef.current.rotation.y += 0.0015;
      atmosphereRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <>
      {/* 🌍 Globo principal con textura 
      <mesh ref={globeRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={texture} color="white" />
      </mesh>

      {/* 💫 Capa atmosférica 
      <mesh ref={atmosphereRef} scale={1.26} material={atmosphereMaterial}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>
    </>
  );
}




*/


