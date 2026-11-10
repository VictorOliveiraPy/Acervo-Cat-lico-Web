import reels from "@/lib/reels.json";

/**
 * Vídeos do estúdio (projeto videos-py) mostrados em `/reels`, do mais novo para o
 * mais antigo. O JSON e as capas em `public/reels/` são gerados por
 * `scripts/add-reel.ts`; os MP4 ficam no R2, em `reels/`.
 */
export type Reel = {
  slug: string;
  title: string;
  caption: string;
  tema: string;
  width: number;
  height: number;
};

export const REELS: Reel[] = reels;

/** Temas do filtro de `/reels`, na ordem dos botões. */
export const REEL_TEMAS: Record<string, string> = {
  santos: "Santos",
  maria: "Nossa Senhora",
  anjos: "Anjos",
  biblia: "Bíblia",
  missa: "Missa e sacramentos",
  doutrina: "Doutrina",
  historia: "História da Igreja",
  papas: "Papas",
  igrejas: "Igrejas e devoções",
  curiosidades: "Curiosidades",
};

export const REELS_CDN = "https://img.compendio-catolico.com";

export function reelVideoUrl(slug: string): string {
  return `${REELS_CDN}/reels/${slug}.mp4`;
}

/** Tema válido do `?tema=`; `null` para "todos" ou qualquer valor desconhecido. */
export function parseTema(value: unknown): string | null {
  return typeof value === "string" && Object.hasOwn(REEL_TEMAS, value) ? value : null;
}
