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
  novissimos: {
    nav: "Novíssimos",
    heading: "Novíssimos",
    tagline: "Morte, juízo, céu, inferno e purgatório: as \"últimas coisas\".",
  },
  "ordens-religiosas": {
    nav: "Ordens Religiosas",
    heading: "Ordens religiosas",
    tagline: "Fundador, origem e carisma das principais ordens e congregações católicas.",
  },
  "estrutura-igreja": {
    nav: "Estrutura da Igreja",
    heading: "Estrutura da Igreja",
    tagline: "Do Papa à paróquia: como a Igreja Católica se organiza e se governa.",
  },
  santuarios: {
    nav: "Santuários",
    heading: "Santuários e basílicas",
    tagline: "Os principais destinos de peregrinação católica no mundo.",
  },
  "documentos-magisterio": {
    nav: "Documentos do Magistério",
    heading: "Documentos do magistério",
    tagline: "Encíclicas e constituições principais, com resumo e contexto.",
  },
  "beatos-canonizacao": {
    nav: "Beatos e Canonização",
    heading: "Beatos e processo de canonização",
    tagline: "As etapas do processo, de Servo de Deus a Santo.",
  },
  "igreja-brasil": {
    nav: "Igreja no Brasil",
    heading: "Igreja no Brasil",
    tagline: "Da primeira Missa de 1500 à CNBB e à Teologia da Libertação.",
  },
  sacramentais: {
    nav: "Sacramentais",
    heading: "Sacramentais",
    tagline: "Água benta, bênçãos, medalhas e outros sinais sagrados.",
  },
  apologetica: {
    nav: "Apologética",
    heading: "Apologética",
    tagline: "Respostas católicas a objeções clássicas sobre a fé e a prática da Igreja.",
  },
  "jesus-cristo": {
    nav: "Jesus Cristo",
    heading: "Jesus Cristo",
    tagline: "Os mistérios da vida de Cristo, seus títulos bíblicos e os dogmas sobre sua pessoa.",
  },
  "personagens-biblicos": {
    nav: "Personagens Bíblicos",
    heading: "Personagens bíblicos",
    tagline: "Patriarcas, profetas, reis e mulheres da Bíblia, além dos livros que contam suas histórias.",
  },
  parabolas: {
    nav: "Parábolas",
    heading: "Parábolas de Jesus",
    tagline: "As parábolas dos Evangelhos, com contexto e chave de interpretação.",
  },
  "milagres-de-jesus": {
    nav: "Milagres de Jesus",
    heading: "Milagres de Jesus",
    tagline: "Curas, exorcismos, domínio sobre a natureza e ressurreições nos Evangelhos.",
  },
  "terra-santa": {
    nav: "Terra Santa",
    heading: "Terra Santa",
    tagline: "Lugares da Palestina e de Israel ligados à vida de Cristo e à história bíblica.",
  },
  "padres-da-igreja": {
    nav: "Padres da Igreja",
    heading: "Padres da Igreja",
    tagline: "Escritores eclesiásticos dos primeiros séculos, testemunhas da fé apostólica.",
  },
  "heresias-cismas": {
    nav: "Heresias e Cismas",
    heading: "Heresias e cismas",
    tagline: "Os principais erros doutrinais e rupturas de comunhão, e a resposta da Igreja.",
  },
  "anjos-demonios": {
    nav: "Anjos e Demônios",
    heading: "Anjos e demônios",
    tagline: "Arcanjos, os nove coros angélicos, o anjo da guarda e a doutrina sobre o demônio.",
  },
  "doutrina-social": {
    nav: "Doutrina Social",
    heading: "Doutrina Social da Igreja",
    tagline: "Dignidade da pessoa, bem comum, subsidiariedade e os demais princípios sociais.",
  },
  "liturgia-das-horas": {
    nav: "Liturgia das Horas",
    heading: "Liturgia das Horas",
    tagline: "Laudes, Vésperas, Completas e as demais horas do Ofício Divino.",
  },
  "ritos-orientais": {
    nav: "Ritos Orientais",
    heading: "Ritos e Igrejas Orientais Católicas",
    tagline: "Bizantino, maronita, copta, siro-malabar e outras Igrejas em comunhão com Roma.",
  },
  "arte-sacra-simbolos": {
    nav: "Arte Sacra",
    heading: "Arte sacra e símbolos",
    tagline: "IHS, Crismon, peixe, vestes litúrgicas e outros símbolos da fé católica.",
  },
  "direito-canonico": {
    nav: "Direito Canônico",
    heading: "Direito Canônico",
    tagline: "Nulidade matrimonial, excomunhão, censuras e outros institutos jurídicos da Igreja.",
  },
  "vocacoes-estados-de-vida": {
    nav: "Vocações",
    heading: "Vocações e estados de vida",
    tagline: "Matrimônio, vida consagrada, ministério ordenado e vida leiga como caminhos de santidade.",
  },
  "primeira-comunhao": {
    nav: "Primeira Comunhão",
    heading: "Primeira Comunhão",
    tagline: "Trilha catequética de preparação para a Primeira Comunhão.",
  },
  "musica-sacra": {
    nav: "Música Sacra",
    heading: "Música Sacra",
    tagline: "Canto gregoriano e os grandes hinos latinos da tradição católica.",
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
