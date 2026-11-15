"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { Box3, Vector3 } from "three";

/** Mesma altura das figuras de primitivas, que a câmera da cena já enquadra. */
const HEIGHT = 2.2;

/**
 * Modelo `.glb` de um santo, de pé no chão da cena e com a altura padrão, qualquer
 * que seja a escala em que foi exportado. O decodificador Draco é servido pelo
 * próprio site (`public/draco/`), para não depender de outro domínio.
 */
export default function GlbSaint({ url }: { url: string }) {
  const { scene } = useGLTF(url, "/draco/");
  const fit = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const scale = HEIGHT / size.y;
    return { scale, position: [-center.x * scale, -box.min.y * scale, -center.z * scale] as const };
  }, [scene]);
  return <primitive object={scene} scale={fit.scale} position={fit.position} />;
}
