// utils/coords.ts
import { Vector3 } from "three";

/**
 * Convierte lat/lng (grados) a un Vector3 en una esfera de radio `r`.
 * -- lat: latitud en grados (N positive)
 * -- lng: longitud en grados (E positive; W negative)
 * Opciones:
 *   lonOffset: corrección en radianes (p.ej Math.PI / 2)
 *   latOffset: corrección en radianes
 *   invertLon: si true usa -lng (útil según orientación de la textura)
 */
export function latLngToVector3(
  lat: number,
  lng: number,
  r = 1,
  opts: { lonOffset?: number; latOffset?: number; invertLon?: boolean } = {}
) {
  const { lonOffset = 0, latOffset = 0, invertLon = false } = opts;

  // Convertimos a radianes
  const latRad = (lat * Math.PI) / 180 + latOffset;
  let lngRad = (lng * Math.PI) / 180 + lonOffset;
  if (invertLon) lngRad = -lngRad;

  // Fórmula estándar (X derecho, Y arriba, Z adelante)
  const x = r * Math.cos(latRad) * Math.cos(lngRad);
  const y = r * Math.sin(latRad);
  const z = r * Math.cos(latRad) * Math.sin(lngRad);

  return new Vector3(x, y, z);
}
