import { apiGet } from "@/lib/api";
import { reelPageSchema } from "@/lib/reels";

/** Reels publicados; a página `/reels` mostra até 100 de uma vez. */
export async function fetchReels(tema: string | null) {
  return apiGet("/reels", reelPageSchema, {
    query: { tema: tema ?? undefined, limit: 100 },
    revalidateSeconds: 60,
  });
}
