import { z } from "zod";

/**
 * Vídeos do estúdio (projeto videos-py) mostrados em `/reels`. Vêm da API
 * (`/api/reels`), que guarda os reels no banco: o painel (`/painel/videos`) cria,
 * edita, publica e apaga sem precisar publicar o site de novo. Os MP4 e as capas
 * novas ficam no R2; as capas antigas continuam em `public/reels/`.
 */
export const reelSchema = z.object({
  slug: z.string(),
  titulo: z.string(),
  legenda: z.string(),
  tema: z.string(),
  largura: z.number(),
  altura: z.number(),
  video_url: z.string(),
  capa_url: z.string(),
  publicado: z.boolean(),
  criado_em: z.string().nullable(),
});

export const reelPageSchema = z.object({ itens: z.array(reelSchema), total: z.number() });

export type Reel = z.output<typeof reelSchema>;

/** Temas do filtro de `/reels`, na ordem dos botões (iguais aos da API). */
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

/** Tema válido do `?tema=`; `null` para "todos" ou qualquer valor desconhecido. */
export function parseTema(value: unknown): string | null {
  return typeof value === "string" && Object.hasOwn(REEL_TEMAS, value) ? value : null;
}
