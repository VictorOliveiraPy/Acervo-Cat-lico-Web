"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";

import type { PatronId } from "@/lib/padroeiros";

function StageMessage({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 grid place-items-center p-6 text-center text-meta text-ink-muted">
      {children}
    </div>
  );
}

// `ssr: false`: WebGL só existe no navegador. O `import()` também põe o `three`, que é
// pesado, em um arquivo separado, baixado só por quem abre o perfil.
const SaintScene = dynamic(() => import("@/components/perfil/SaintScene"), {
  ssr: false,
  loading: () => <StageMessage>Carregando a imagem…</StageMessage>,
});

/** Falha do 3D (driver, contexto perdido) não pode derrubar o perfil inteiro. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? (
      <StageMessage>Seu navegador não exibe 3D aqui.</StageMessage>
    ) : (
      this.props.children
    );
  }
}

function hasWebGl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Nicho em arco, estilo oratório, com o padroeiro dentro. */
export function SaintStage({ saintId, saintName }: { saintId: PatronId; saintName: string }) {
  const [webGl, setWebGl] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    setWebGl(hasWebGl());
  }, []);

  return (
    <div
      className="relative mx-auto aspect-[3/4] w-full max-w-[340px] overflow-hidden rounded-b-[14px] rounded-t-[190px] border border-border min-[820px]:max-w-none"
      style={{ background: "radial-gradient(120% 70% at 50% 30%, #E9E4D6, #D9D2BF)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 z-10 rounded-b-lg rounded-t-[180px] border border-gold/45"
      />
      {webGl === false ? (
        <StageMessage>Seu navegador não exibe 3D aqui.</StageMessage>
      ) : webGl ? (
        <SceneBoundary>
          <SaintScene
            saintId={saintId}
            label={`Imagem 3D de ${saintName}. Arraste para girar.`}
            onFirstDrag={() => setShowHint(false)}
          />
          {showHint ? (
            <p className="pointer-events-none absolute inset-x-0 bottom-3.5 text-center text-label text-ink-muted [letter-spacing:0]">
              Arraste para girar
            </p>
          ) : null}
        </SceneBoundary>
      ) : (
        <StageMessage>Carregando a imagem…</StageMessage>
      )}
    </div>
  );
}
