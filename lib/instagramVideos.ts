import videos from "@/lib/instagramVideos.json";

/**
 * Vídeos do Instagram mostrados em `/reels`, do mais novo para o mais antigo.
 *
 * O JSON e as capas em `public/videos/` são gerados por
 * `scripts/add-instagram-video.ts`: as URLs de capa do Instagram expiram, então
 * não dá para apontar direto para elas.
 */
export type InstagramVideo = {
  id: string;
  caption: string;
  width: number;
  height: number;
};

export const INSTAGRAM_VIDEOS: InstagramVideo[] = videos;

export const INSTAGRAM_ORIGIN = "https://www.instagram.com";

export function instagramPostUrl(id: string): string {
  return `${INSTAGRAM_ORIGIN}/p/${id}/`;
}

/** Altura que o player do Instagram pede por `postMessage`; `null` para qualquer outra mensagem. */
export function instagramEmbedHeight(data: unknown): number | null {
  let message: unknown = data;
  if (typeof data === "string") {
    try {
      message = JSON.parse(data);
    } catch {
      return null;
    }
  }
  const { type, details } = (message ?? {}) as { type?: unknown; details?: { height?: unknown } };
  const height = details?.height;
  return type === "MEASURE" && typeof height === "number" && height > 0 ? height : null;
}
