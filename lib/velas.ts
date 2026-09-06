/**
 * Os tipos de vela que a pessoa pode escolher ao acender, com a imagem de
 * cada um.
 *
 * Mesmo padrão de `CATEGORY_LABELS`: o rótulo e a imagem moram no frontend,
 * não vêm da API — o backend só guarda o slug (`TipoVela`) e valida contra
 * ele. Adicionar um tipo aqui sem adicionar no `TipoVela` do backend (ou
 * vice-versa) quebra a escolha na tela ou a gravação; os dois lados têm
 * que mudar juntos.
 */

import type { VelaTipo } from "@/lib/velasSchemas";

export type VelaTipoInfo = {
  tipo: VelaTipo;
  label: string;
  imagem: string;
  imagemCredito: string | null;
};

export const VELA_TIPOS: readonly VelaTipoInfo[] = [
  {
    tipo: "jesus",
    label: "Jesus Cristo",
    imagem: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Spas_vsederzhitel_sinay.jpg",
    imagemCredito: null,
  },
  {
    tipo: "nossa_senhora",
    label: "Nossa Senhora",
    imagem: "https://upload.wikimedia.org/wikipedia/commons/0/04/Kazan_moscow.jpg",
    imagemCredito: null,
  },
  {
    tipo: "aparecida",
    label: "N. Sra. Aparecida",
    imagem: "https://upload.wikimedia.org/wikipedia/commons/8/8a/NS_Aparecida.png",
    imagemCredito: null,
  },
  {
    tipo: "sao_jose",
    label: "São José",
    imagem: "https://upload.wikimedia.org/wikipedia/commons/7/74/Agust%C3%ADn_Rodr%C3%ADguez_-_San_Jos%C3%A9_y_el_Ni%C3%B1o.jpg",
    imagemCredito: null,
  },
  {
    tipo: "espirito_santo",
    label: "Espírito Santo",
    imagem: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Rom%2C_Vatikan%2C_Basilika_St._Peter%2C_Die_Taube_des_Heiligen_Geistes_%28Cathedra_Petri%2C_Bernini%29.jpg",
    imagemCredito: "Dnalor 01 — Wikimedia Commons, CC BY-SA 3.0 at",
  },
  {
    tipo: "sao_judas_tadeu",
    label: "São Judas Tadeu",
    imagem: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Anthonis_van_Dyck%2C_Kunsthistorisches_Museum_Wien%2C_Gem%C3%A4ldegalerie_-_Apostel_Judas_Thadd%C3%A4us_-_GG_6809_-_Kunsthistorisches_Museum.jpg",
    imagemCredito: null,
  },
] as const;

/** Vela pré-selecionada ao abrir o formulário — a primeira da lista acima. */
export const DEFAULT_VELA_TIPO: VelaTipo = "jesus";

export function velaTipoInfo(tipo: VelaTipo): VelaTipoInfo {
  const found = VELA_TIPOS.find((item) => item.tipo === tipo);
  // Nunca deveria faltar: `tipo` já veio validado pelo schema Zod contra o
  // mesmo enum que gera este array. Se faltar, é os dois lados fora de sync.
  if (!found) throw new Error(`Tipo de vela desconhecido: ${tipo}`);
  return found;
}

/** Data de uma vela em formato curto brasileiro, ex.: "6 de set. de 2026". */
export function formatVelaDate(isoDate: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

/** "Cidade, Estado", só "Cidade" ou só "Estado" — o que a pessoa preencheu. */
export function formatVelaLocation(
  cidade: string | null,
  estado: string | null,
): string | null {
  return [cidade, estado].filter(Boolean).join(", ") || null;
}
