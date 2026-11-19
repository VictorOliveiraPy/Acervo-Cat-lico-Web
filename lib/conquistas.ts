/**
 * Conquistas, vindas do Santo Guardião. Aqui elas não são guardadas: saem do que o
 * perfil já tem (recorde de dias seguidos, nível, lições, favoritos e anotações).
 * Por isso só usam números que não voltam para trás — o recorde, e não a sequência
 * atual — e uma conquista ganha não some no dia seguinte.
 */

export type ProgressoDoPerfil = {
  recorde: number;
  nivel: number;
  licoes: number;
  licoesTotal: number;
  favoritos: number;
  anotacoes: number;
};

export type Grupo = "constancia" | "caminho" | "estudo" | "tesouro";

type Definicao = {
  id: string;
  nome: string;
  descricao: string;
  grupo: Grupo;
  /** Onde a pessoa está e aonde precisa chegar, para a barra de progresso. */
  meta: (p: ProgressoDoPerfil) => { atual: number; alvo: number };
};

export type Conquista = {
  id: string;
  nome: string;
  descricao: string;
  grupo: Grupo;
  atual: number;
  alvo: number;
  ganha: boolean;
};

const sequencia = (id: string, nome: string, dias: number, descricao: string): Definicao => ({
  id,
  nome,
  descricao,
  grupo: "constancia",
  meta: (p) => ({ atual: p.recorde, alvo: dias }),
});

const nivel = (id: string, nome: string, alvo: number, descricao: string): Definicao => ({
  id,
  nome,
  descricao,
  grupo: "caminho",
  meta: (p) => ({ atual: p.nivel, alvo }),
});

export const CONQUISTAS: readonly Definicao[] = [
  sequencia("semana-santa", "Semana Santa", 7, "7 dias seguidos de oração ou estudo"),
  sequencia("mes-de-graca", "Mês de Graça", 30, "30 dias seguidos de oração ou estudo"),
  sequencia("centuriao-da-fe", "Centurião da Fé", 100, "100 dias seguidos de oração ou estudo"),
  sequencia("ano-liturgico", "Ano Litúrgico", 365, "Um ano inteiro, dia após dia"),
  nivel("servo-dedicado", "Servo Dedicado", 10, "Chegue ao nível 10: seu santo ganha luz"),
  nivel("portador-da-esperanca", "Portador da Esperança", 25, "Chegue ao nível 25"),
  nivel("mestre-espiritual", "Mestre Espiritual", 50, "Chegue ao nível 50"),
  {
    id: "primeiros-passos",
    nome: "Primeiros Passos",
    descricao: "Conclua a primeira lição da Academia da Fé",
    grupo: "estudo",
    meta: (p) => ({ atual: p.licoes, alvo: 1 }),
  },
  {
    id: "doutor-da-academia",
    nome: "Doutor da Academia",
    descricao: "Conclua todas as lições da Academia da Fé",
    grupo: "estudo",
    // Sem lições no ar, a meta fica impossível em vez de ser ganha de graça.
    meta: (p) => ({ atual: p.licoes, alvo: Math.max(p.licoesTotal, 1) }),
  },
  {
    id: "primeiro-tesouro",
    nome: "Primeiro Tesouro",
    descricao: "Guarde seu primeiro texto favorito",
    grupo: "tesouro",
    meta: (p) => ({ atual: p.favoritos, alvo: 1 }),
  },
  {
    id: "florilegio",
    nome: "Florilégio",
    descricao: "Guarde 25 textos favoritos",
    grupo: "tesouro",
    meta: (p) => ({ atual: p.favoritos, alvo: 25 }),
  },
  {
    id: "diario-espiritual",
    nome: "Diário Espiritual",
    descricao: "Escreva 10 anotações",
    grupo: "tesouro",
    meta: (p) => ({ atual: p.anotacoes, alvo: 10 }),
  },
];

export function conquistas(p: ProgressoDoPerfil): Conquista[] {
  return CONQUISTAS.map(({ meta, ...definicao }) => {
    const { atual, alvo } = meta(p);
    return { ...definicao, atual: Math.min(atual, alvo), alvo, ganha: atual >= alvo };
  });
}

/** A conquista ainda não ganha que está mais perto, em proporção; `null` se todas foram. */
export function proximaConquista(lista: readonly Conquista[]): Conquista | null {
  let melhor: Conquista | null = null;
  for (const conquista of lista) {
    if (conquista.ganha) continue;
    if (!melhor || conquista.atual / conquista.alvo > melhor.atual / melhor.alvo) melhor = conquista;
  }
  return melhor;
}

/** "faltam 4 dias", "falta 1 lição": o que a pessoa precisa fazer, em palavras. */
export function quantoFalta(conquista: Conquista): string {
  const falta = conquista.alvo - conquista.atual;
  const unidade: Record<Grupo, [string, string]> = {
    constancia: ["dia", "dias"],
    caminho: ["nível", "níveis"],
    estudo: ["lição", "lições"],
    tesouro: conquista.id === "diario-espiritual" ? ["anotação", "anotações"] : ["texto", "textos"],
  };
  const [singular, plural] = unidade[conquista.grupo];
  return falta === 1 ? `falta 1 ${singular}` : `faltam ${falta} ${plural}`;
}

/** Ids que passaram a valer entre dois momentos, para anunciar na tela. */
export function novasConquistas(antes: readonly Conquista[], depois: readonly Conquista[]): Conquista[] {
  const tinha = new Set(antes.filter((c) => c.ganha).map((c) => c.id));
  return depois.filter((c) => c.ganha && !tinha.has(c.id));
}
