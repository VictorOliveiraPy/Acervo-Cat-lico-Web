/** Regras do painel de métricas (`/painel`), só para quem administra o site. */

/** `ADMIN_EMAILS` é uma lista separada por vírgulas, só no `.env` do servidor. */
export function isAdminEmail(email: string | null | undefined, adminEmails: string | undefined): boolean {
  if (!email || !adminEmails) return false;
  const lista = adminEmails
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return lista.includes(email.trim().toLowerCase());
}

/** "+25%", "−10%" ou `null` quando o período anterior não tem dados para comparar. */
export function variacao(atual: number, antes: number): string | null {
  if (antes === 0) return null;
  const pct = Math.round(((atual - antes) / antes) * 100);
  if (pct === 0) return "0%";
  return pct > 0 ? `+${pct}%` : `−${Math.abs(pct)}%`;
}

const EVENTOS: Readonly<Record<string, string>> = {
  search_submitted: "Buscas",
  candle_lit: "Velas acesas",
  liturgy_opened: "Liturgia aberta",
  entry_favorited: "Textos guardados",
  entry_shared: "Compartilhamentos",
  lesson_started: "Lições começadas",
  lesson_completed: "Lições concluídas",
  calendar_subscribed: "Calendário assinado",
  prayer_action: "Cliques em \"Leve para a oração\"",
  leao_confirmar: "Cliques em \"Eu vou!\" (Leão XIV)",
};

export function nomeDoEvento(nome: string): string {
  return EVENTOS[nome] ?? nome;
}

/** O endereço do vídeo a partir do título, igual ao `slugify` da API e do estúdio. */
export function slugDoTitulo(titulo: string): string {
  const simples = titulo.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();
  return simples.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/, "") || "video";
}

export const STATUS_PEDIDO: Readonly<Record<string, string>> = {
  na_fila: "Na fila",
  gerando: "Gerando",
  pronto: "Pronto",
  erro: "Parou com erro",
  cancelado: "Cancelado",
};

/** Pedido que ainda pode mudar sozinho: o painel se atualiza enquanto houver um. */
export function pedidoEmAndamento(status: string): boolean {
  return status === "na_fila" || status === "gerando";
}
