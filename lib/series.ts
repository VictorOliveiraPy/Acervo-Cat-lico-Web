/**
 * Séries do estúdio, como os cortes diários do Fr. Mike: o santo de amanhã e o Evangelho
 * de amanhã viram pedidos de vídeo prontos, que já levam ao verbete do site.
 */

import { trechoDoEvangelho } from "@/lib/liturgia";
import { formatDayMonth } from "@/lib/santoDoDia";

const SITE = "https://compendio-catolico.com";
const MAX_NOTAS = 2000;

type PedidoDeSerie = {
  tema: string;
  pergunta: string;
  notas: string;
  formato: "cinema" | "catequese";
  voz_propria: boolean;
};

export function amanha(hoje: string): string {
  const data = new Date(`${hoje}T12:00:00Z`);
  data.setUTCDate(data.getUTCDate() + 1);
  return data.toISOString().slice(0, 10);
}

export function pedidoSantoDoDia(
  santo: { titulo: string; slug: string; resumo: string },
  data: string,
  comMinhaVoz = true,
): PedidoDeSerie {
  const notas = [
    `Série "Santo do dia", para ${formatDayMonth(data)}.`,
    `Verbete no site: ${SITE}/santos/${santo.slug}`,
    `Resumo do verbete: ${santo.resumo}`,
    "Conte a história como um mistério que se revela: abra com um detalhe enigmático da vida dele e só depois diga o nome.",
    "Termine com o que a vida dele ensina hoje.",
  ].join("\n");
  return { tema: santo.titulo, pergunta: "", notas: notas.slice(0, MAX_NOTAS), formato: "cinema", voz_propria: comMinhaVoz };
}

export function pedidoEvangelho(
  liturgia: {
    data: string;
    celebracao: string | null;
    evangelho: { referencia: string; texto: string };
  },
  comMinhaVoz = true,
): PedidoDeSerie {
  const cabecalho = [
    `Série "Evangelho do dia", para ${formatDayMonth(liturgia.data)}${liturgia.celebracao ? ` (${liturgia.celebracao})` : ""}.`,
    `Link no site: ${SITE}/liturgia-diaria/${liturgia.data}`,
    "Explique o Evangelho para quem vai à Missa amanhã, com uma frase para levar no dia.",
    "Texto do Evangelho: ",
  ].join("\n");
  const texto = trechoDoEvangelho(liturgia.evangelho.texto, MAX_NOTAS - cabecalho.length);
  return {
    tema: `O Evangelho de ${formatDayMonth(liturgia.data)}: ${liturgia.evangelho.referencia}`,
    pergunta: "",
    notas: `${cabecalho}${texto}`,
    formato: "catequese",
    voz_propria: comMinhaVoz,
  };
}

/** Já existe um pedido igual que não foi cancelado nem deu erro. */
export function jaPedido(pedidos: ReadonlyArray<{ tema: string; status: string }>, tema: string): boolean {
  return pedidos.some((pedido) => pedido.tema === tema && pedido.status !== "cancelado" && pedido.status !== "erro");
}
