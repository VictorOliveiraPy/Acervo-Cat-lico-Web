"use client";

import { lazy, Suspense } from "react";

import { patronById, type PatronId } from "@/lib/padroeiros";

// Em arquivo separado para o `drei` só baixar quando a cena 3D aparece.
const GlbSaint = lazy(() => import("@/components/perfil/GlbSaint"));

/** Imagem 3D do santo, a partir do `.glb` dele. Enquanto o modelo baixa, o nicho fica vazio. */
export function SaintModel({ saintId }: { saintId: PatronId }) {
  return (
    <Suspense fallback={null}>
      <GlbSaint url={patronById(saintId).modelo} />
    </Suspense>
  );
}
