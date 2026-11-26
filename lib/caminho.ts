/**
 * Caminho da Santidade: a trilha vem pronta da API (`GET /api/caminho`), a mesma
 * para o perfil, a página pública e a home. Aqui só o que a tela precisa decidir.
 */
import { z } from "zod";

export const viaSchema = z.object({ id: z.string(), nome: z.string(), descricao: z.string() });

export const casaSchema = z.object({
  numero: z.number().int(),
  via: z.string(),
  titulo: z.string(),
  texto: z.string(),
  tipo: z.enum(["atividade", "licao"]),
  tarefa: z.string(),
  tarefa_nome: z.string(),
  licoes: z.number().int(),
});

export const caminhoSchema = z.object({ vias: z.array(viaSchema), casas: z.array(casaSchema) });
export const progressoNoCaminhoSchema = z.object({ concluidas: z.number().int(), hoje: z.array(z.number().int()) });

export type Via = z.output<typeof viaSchema>;
export type Casa = z.output<typeof casaSchema>;
export type Caminho = z.output<typeof caminhoSchema>;
export type ProgressoNoCaminho = z.output<typeof progressoNoCaminhoSchema>;

export type EstadoDaCasa = "feita" | "atual" | "bloqueada";

export function estadoDaCasa(numero: number, concluidas: number): EstadoDaCasa {
  if (numero <= concluidas) return "feita";
  return numero === concluidas + 1 ? "atual" : "bloqueada";
}

/**
 * O que falta para a casa atual: marcar a prática, fazer uma lição, avançar já ou
 * voltar amanhã (a mesma prática não move duas casas no mesmo dia). Espelha a regra
 * da API, que é quem decide de verdade.
 */
export function situacaoDaCasa(
  caminho: Caminho,
  numero: number,
  { feitasHoje, licoes, casasHoje }: { feitasHoje: readonly string[]; licoes: number; casasHoje: readonly number[] },
): "marcar" | "licao" | "avancar" | "amanha" {
  const casa = caminho.casas.find((c) => c.numero === numero);
  if (!casa) return "amanha";
  if (casa.tipo === "licao") return licoes >= casa.licoes ? "avancar" : "licao";
  const usadasHoje = new Set(
    caminho.casas.filter((c) => casasHoje.includes(c.numero) && c.tipo === "atividade").map((c) => c.tarefa),
  );
  if (usadasHoje.has(casa.tarefa)) return "amanha";
  return feitasHoje.includes(casa.tarefa) ? "avancar" : "marcar";
}

const ONDA = [0, 0.5, 1, 0.5, 0, -0.5, -1, -0.5] as const;

/** Quanto a casa sai do centro (-1 a 1): a trilha serpenteia como uma estrada. */
export function deslocamento(numero: number): number {
  return ONDA[(numero - 1) % ONDA.length] ?? 0;
}

export function progressoDaVia(caminho: Caminho, via: string, concluidas: number): { feitas: number; total: number } {
  const casas = caminho.casas.filter((c) => c.via === via);
  return { feitas: casas.filter((c) => c.numero <= concluidas).length, total: casas.length };
}
