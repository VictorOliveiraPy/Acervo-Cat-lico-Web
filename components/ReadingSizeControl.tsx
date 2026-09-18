"use client";

import { useEffect, useState } from "react";

import {
  READING_SIZES,
  applyReadingSize,
  readStoredReadingSize,
  type ReadingSize,
} from "@/lib/readingSize";

const LABEL: Record<ReadingSize, string> = {
  normal: "A",
  larger: "A+",
  largest: "A++",
};

const DESCRIPTION: Record<ReadingSize, string> = {
  normal: "normal",
  larger: "grande",
  largest: "muito grande",
};

/**
 * Alterna o tamanho da fonte de leitura do verbete (afeta `.reading-column`,
 * ver globals.css). A escolha é lida de nome em `readStoredReadingSize` —
 * um script `beforeInteractive` no layout já aplicou o valor salvo antes da
 * hidratação, então este componente só sincroniza o estado visual dos
 * botões com o que já está no documento.
 */
export function ReadingSizeControl() {
  const [size, setSize] = useState<ReadingSize>("normal");

  useEffect(() => {
    setSize(readStoredReadingSize());
  }, []);

  function choose(next: ReadingSize) {
    setSize(next);
    applyReadingSize(next);
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Tamanho do texto">
      {READING_SIZES.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => choose(option)}
          aria-pressed={size === option}
          aria-label={`Tamanho do texto: ${DESCRIPTION[option]}`}
          className={`rounded-edge border px-3 py-1.5 text-label transition-colors ${
            size === option
              ? "border-bordeaux bg-bordeaux text-parchment-raised"
              : "border-rule-faint text-ink-muted hover:border-bordeaux hover:text-bordeaux"
          }`}
        >
          {LABEL[option]}
        </button>
      ))}
    </div>
  );
}
