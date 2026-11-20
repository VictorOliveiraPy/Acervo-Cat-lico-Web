import { z } from "zod";

import { ApiError, getApiBaseUrl } from "@/lib/api";

const rankingSchema = z.array(z.object({ nome: z.string(), total: z.number() }));

export const resumoSchema = z.object({
  inicio: z.string(),
  fim: z.string(),
  gerado_em: z.string(),
  dias: z.array(z.object({ dia: z.string(), visitantes: z.number(), paginas: z.number() })),
  visitantes: z.number(),
  paginas: z.number(),
  visitantes_antes: z.number(),
  paginas_antes: z.number(),
  paginas_mais_vistas: rankingSchema,
  origens: rankingSchema,
  eventos: rankingSchema,
  dispositivos: rankingSchema,
});

export type ResumoMetricas = z.output<typeof resumoSchema>;

/** Resumo do painel; só o servidor do site chama, com o segredo interno. */
export async function fetchResumoMetricas(dias: number): Promise<ResumoMetricas> {
  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}/metricas/resumo?dias=${dias}`, {
      cache: "no-store",
      headers: { "X-Internal-Secret": process.env.INTERNAL_API_SECRET ?? "" },
    });
  } catch {
    throw new ApiError("Não foi possível falar com a API.", 503, "NETWORK_ERROR");
  }
  if (!response.ok) {
    throw new ApiError("Não foi possível ler as métricas.", response.status, "METRICAS_ERRO");
  }
  return resumoSchema.parse(await response.json());
}
