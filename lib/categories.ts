/**
 * Rótulos e rotas das categorias do acervo.
 *
 * Os nomes ficam aqui, e não vêm de `/api/categories`, porque a navegação do
 * cabeçalho aparece em toda página: buscar os rótulos na API só para
 * desenhar o menu atrasaria o primeiro byte de qualquer rota. Os totais e o
 * aviso editorial, que mudam com o conteúdo, continuam vindo da API.
 */

import { CATEGORY_SLUGS, type CategorySlug } from "@/lib/schemas";

export type CategoryLabel = {
  /** Rótulo curto, usado no menu e nas migalhas de navegação. */
  nav: string;
  /** Título da página de listagem (pode ser mais explícito que o do menu). */
  heading: string;
  /** Uma linha dizendo o que a pessoa encontra ali, na voz do leitor. */
  tagline: string;
};

export const CATEGORY_LABELS: Record<CategorySlug, CategoryLabel> = {
  santos: {
    nav: "Santos",
    heading: "Santos e santas",
    tagline: "Vidas, festas e patronatos de santos canonizados.",
  },
  papas: {
    nav: "Papas",
    heading: "Papas",
    tagline: "Romanos Pontífices e a sucessão apostólica desde Pedro.",
  },
  "milagres-eucaristicos": {
    nav: "Milagres Eucarísticos",
    heading: "Milagres eucarísticos",
    tagline: "Casos com culto e documentação eclesiástica reconhecidos.",
  },
  catecismo: {
    nav: "Catecismo",
    heading: "Catecismo da Igreja Católica",
    tagline: "As quatro partes do Catecismo e o que cada uma ensina.",
  },
  crisma: {
    nav: "Crisma",
    heading: "Crisma",
    tagline: "Temas de preparação para a Confirmação, com base no Catecismo.",
  },
  historia: {
    nav: "História da Igreja",
    heading: "História da Igreja",
    tagline: "Períodos amplos, em recorte didático, da Igreja no tempo.",
  },
  "doutores-igreja": {
    nav: "Doutores da Igreja",
    heading: "Doutores da Igreja",
    tagline: "Santos cuja doutrina a Igreja reconhece como referência.",
  },
  concilios: {
    nav: "Concílios",
    heading: "Concílios ecumênicos",
    tagline: "Assembleias que definiram a fé, de Niceia ao Vaticano II.",
  },
  "nossa-senhora": {
    nav: "Nossa Senhora",
    heading: "Nossa Senhora",
    tagline: "Dogmas marianos, aparições aprovadas e títulos de devoção.",
  },
  livros: {
    nav: "Livros",
    heading: "Livros recomendados",
    tagline: "Clássicos da espiritualidade católica e obras de referência.",
  },
  oracoes: {
    nav: "Orações",
    heading: "Orações",
    tagline: "Textos para rezar, com origem e uso de cada oração.",
  },
  pecados: {
    nav: "Pecados",
    heading: "Pecados",
    tagline: "Os sete pecados capitais e a virtude que se opõe a cada um.",
  },
  liturgia: {
    nav: "Vida Litúrgica",
    heading: "Vida litúrgica",
    tagline: "A Missa do Rito Romano, a Confissão e a adoração ao Santíssimo.",
  },
  sacramentos: {
    nav: "Sacramentos",
    heading: "Sacramentos",
    tagline: "Os sete sacramentos: matéria, forma, ministro e efeitos de cada um.",
  },
  virtudes: {
    nav: "Virtudes",
    heading: "Virtudes",
    tagline: "Teologais, cardeais, dons do Espírito, bem-aventuranças e obras de misericórdia.",
  },
  mandamentos: {
    nav: "Mandamentos",
    heading: "Mandamentos",
    tagline: "Os Dez Mandamentos comentados um a um, e os preceitos da Igreja.",
  },
  biblia: {
    nav: "Bíblia",
    heading: "Bíblia",
    tagline: "Os 73 livros do cânon católico, um a um.",
  },
  devocoes: {
    nav: "Devoções",
    heading: "Devoções",
    tagline: "Via-Sacra, novenas, Sagrado Coração, escapulário e outras práticas devocionais.",
  },
  glossario: {
    nav: "Glossário",
    heading: "Glossário",
    tagline: "Termos litúrgicos, canônicos e devocionais explicados.",
  },
  "calendario-liturgico": {
    nav: "Calendário Litúrgico",
    heading: "Calendário litúrgico",
    tagline: "Tempos, cores e datas móveis do Ano Litúrgico.",
  },
};

/** Categorias na ordem editorial da navegação. */
export const CATEGORY_NAV: ReadonlyArray<{
  slug: CategorySlug;
  label: CategoryLabel;
}> = CATEGORY_SLUGS.map((slug) => ({ slug, label: CATEGORY_LABELS[slug] }));

/** Rótulo curto de uma categoria (usado em resultado de busca e migalhas). */
export function categoryNavLabel(slug: CategorySlug): string {
  return CATEGORY_LABELS[slug].nav;
}

export function categoryPath(slug: CategorySlug): string {
  return `/${slug}`;
}

export function entryPath(slug: CategorySlug, entrySlug: string): string {
  return `/${slug}/${entrySlug}`;
}
