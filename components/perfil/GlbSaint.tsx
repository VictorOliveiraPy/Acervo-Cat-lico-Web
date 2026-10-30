"use client";

import { useGLTF } from "@react-three/drei";

/**
 * Modelo `.glb` de um santo. O segundo argumento desliga o Draco, que baixaria o
 * decodificador de outro domínio e seria bloqueado pela CSP do site.
 */
export default function GlbSaint({ url }: { url: string }) {
  const { scene } = useGLTF(url, false);
  return <primitive object={scene} />;
}
