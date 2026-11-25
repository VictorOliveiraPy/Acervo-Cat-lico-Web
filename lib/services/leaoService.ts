import { z } from "zod";

import { somaConfirmacoes } from "@/lib/leaoNoBrasil";

const linhasSchema = z.array(z.object({ total: z.number() }));

/**
 * Total de confirmações do Leão XIV no Brasil, lido da visão pública do Supabase de lá
 * (`inscricoes_por_origem`, aberta para leitura). Cache de 5 minutos. Sem configuração
 * ou com o Supabase fora, devolve `null` e o bloco aparece sem o número.
 */
export async function fetchConfirmacoesLeao(): Promise<number | null> {
  const url = process.env.LEAO_SUPABASE_URL;
  const chave = process.env.LEAO_SUPABASE_KEY;
  if (!url || !chave) return null;
  try {
    const resposta = await fetch(`${url}/rest/v1/inscricoes_por_origem?select=total`, {
      headers: { apikey: chave },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(4000),
    });
    if (!resposta.ok) return null;
    return somaConfirmacoes(linhasSchema.parse(await resposta.json()));
  } catch {
    return null;
  }
}
