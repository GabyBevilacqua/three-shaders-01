"use client";
import { useState } from "react";

type Props = {
  onChange: (opts: { lonOffset: number; latOffset: number; invertLon: boolean }) => void;
};

export default function CalibrationControls({ onChange }: Props) {
  const [lonDeg, setLonDeg] = useState(199); // en grados, convierto a radianes internamente
  const [latDeg, setLatDeg] = useState(0);
  const [invert, setInvert] = useState(false);

  const handleUpdate = (lDeg = lonDeg, laDeg = latDeg, inv = invert) => {
    onChange({ lonOffset: (lDeg * Math.PI) / 180, latOffset: (laDeg * Math.PI) / 180, invertLon: inv });
  };

  return (
    <div style={{ position: "absolute", left: 12, top: 12, padding: 8, background: "rgba(0,0,0,0.5)", color: "white", zIndex: 10 }}>
      <div>
        <label>lonOffset (°): {lonDeg}</label>
        <input
          type="range"
          min={-360}
          max={360}
          value={lonDeg}
          onChange={(e) => { setLonDeg(Number(e.target.value)); handleUpdate(Number(e.target.value), latDeg, invert); }}
        />
      </div>
      <div>
        <label>latOffset (°): {latDeg}</label>
        <input
          type="range"
          min={-90}
          max={90}
          value={latDeg}
          onChange={(e) => { setLatDeg(Number(e.target.value)); handleUpdate(lonDeg, Number(e.target.value), invert); }}
        />
      </div>
      <div>
        <label>
          <input type="checkbox" checked={invert} onChange={(e) => { setInvert(e.target.checked); handleUpdate(lonDeg, latDeg, e.target.checked); }} />
          invertir longitud
        </label>
      </div>
      <div style={{ fontSize: 12, marginTop: 6 }}>
        Recomendado: mueve lonOffset hasta que México (o tu referencia) coincida con la textura.
      </div>
    </div>
  );
}
