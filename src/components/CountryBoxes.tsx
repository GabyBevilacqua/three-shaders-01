"use client";

import CountryBox from "./CountryBox";
import countries from "@/data/countries.json"; // ruta a tu JSON
import { Fragment } from "react";

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
            // color puedes variar por región si quieres
          />
        </Fragment>
      ))}
    </group>
  );
}
