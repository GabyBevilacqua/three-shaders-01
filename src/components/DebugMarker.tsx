import { useEffect, useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { latLngToVector3 } from "../utils/coords";

export default function DebugMarker({
  lat,
  lng,
  radius = 1,
  opts = { lonOffset: 0, latOffset: 0, invertLon: false },
}: { lat: number; lng: number; radius?: number; opts?: any }) {
  const ref = useRef<Mesh | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const pos = latLngToVector3(lat, lng, radius + 0.02, opts);
    ref.current.position.copy(pos);
    ref.current.lookAt(0, 0, 0);
  }, [lat, lng, radius, opts.lonOffset, opts.latOffset, opts.invertLon]);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.01, 12, 12]} />
      <meshBasicMaterial color={"red"} />
    </mesh>
  );
}
