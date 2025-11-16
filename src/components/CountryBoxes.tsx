"use client";

import CountryBox, { CountryHoverInfo } from "./CountryBox";
import countries from "@/data/countries.json"; // ruta a tu JSON
import { Fragment, useState } from "react";
import { Html } from "@react-three/drei";

type Country = {
  name: string;
  population: number;
  latlng?: [number, number];
  // ...otros campos si los necesitas
};

export default function CountryBoxes({ 
  radius = 1, calibration, 
}: { 
  radius?: number; 
  calibration?: { lonOffset?: number; latOffset?: number; invertLon?: boolean };
 }) {
  // Filtramos países sin latlng
  const list: Country[] = (countries as any[]).filter(
    (c) => Array.isArray(c.latlng) && c.latlng.length === 2 && c.latlng[0] !== 0 && c.latlng[1] !== 0
  );
  const [hovered, setHovered] = useState<CountryHoverInfo | null>(null);

  return (
    <group name="country-boxes">
      {list.map((c) => (
        <Fragment key={c.name}>
          <CountryBox
            lat={c.latlng?.[0] ?? 0}
            lng={c.latlng?.[1] ?? 0}
            country={c.name}
            population={c.population}
            radius={radius}
            calibration={calibration} 
            onHoverChange={setHovered}
            hoverColor="#FFFFFF"
            // color puedes variar por región si quieres
          />
        </Fragment>
      ))}
      {hovered && (
        <Html position={hovered.position} center distanceFactor={8} pointerEvents="none">
          <div className="country-tooltip">
            <strong>{hovered.country}</strong>
            <span>{hovered.population.toLocaleString()} habitantes</span>
          </div>
        </Html>
      )}
    </group>
  );
}
