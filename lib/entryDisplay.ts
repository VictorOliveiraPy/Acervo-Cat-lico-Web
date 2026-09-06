/**
 * Lógica de apresentação de uma entrada do acervo.
 *
 * Vive em `lib/` porque é a parte que realmente tem regra: quais campos
 * próprios de cada categoria aparecem, com que rótulo, em que ordem, e o que
 * fazer quando o dado histórico é incerto ("c. 1181-1182") ou ausente. Os
 * componentes só recebem pares rótulo/valor prontos e desenham.
 */

import { CATEGORY_LABELS } from "@/lib/categories";
import type { Entry, EntryOf } from "@/lib/schemas";

/** Par rótulo/valor exibido na ficha de uma entrada. */
export type MetaField = {
  label: string;
  value: string;
};

const EN_DASH = "\u2013";

function field(label: string, value: string | null | undefined): MetaField[] {
  if (value === null || value === undefined) return [];
  const clean = value.trim();
  return clean ? [{ label, value: clean }] : [];
}

function listField(label: string, values: readonly string[]): MetaField[] {
  const clean = values.map((value) => value.trim()).filter(Boolean);
  return clean.length ? [{ label, value: clean.join(" · ") }] : [];
}

/**
 * Formata um intervalo de anos certos (concílios, proclamações).
 *
 * Um concílio de um único ano (Niceia I, 325) é exibido como "325", não como
 * "325–325": repetir o mesmo ano sugere duração que não houve.
 */
export function formatYearRange(
  start: number | null,
  end: number | null,
): string | null {
  if (start === null && end === null) return null;
  if (start === null) return `até ${end}`;
  if (end === null) return `desde ${start}`;
  if (start === end) return String(start);
  return `${start}${EN_DASH}${end}`;
}

/**
 * Formata um intervalo cujas pontas são texto livre (pontificados, vidas).
 *
 * As pontas vêm como string porque o acervo registra "c. 1181-1182" e
 * "século VIII (tradição)" — converter para número inventaria precisão.
 */
export function formatTextRange(
  start: string | null,
  end: string | null,
): string | null {
  const from = start?.trim() || null;
  const to = end?.trim() || null;
  if (!from && !to) return null;
  if (!from) return `até ${to}`;
  if (!to) return `desde ${from}`;
  return `${from} ${EN_DASH} ${to}`;
}

/** Faixas de parágrafos do Catecismo, ex.: ["1285-1321"] → "CIC 1285-1321". */
export function formatCatechismParagraphs(ranges: readonly string[]): string | null {
  const clean = ranges.map((range) => range.trim()).filter(Boolean);
  return clean.length ? `CIC ${clean.join(", ")}` : null;
}

/**
 * Marcador de posição da entrada na sequência da categoria.
 *
 * Só existe onde a ordem é parte do conteúdo (papa nº 265, 21º concílio,
 * parte 3 do Catecismo); nas outras categorias devolve `null` em vez de
 * numerar uma lista que não tem ordem canônica.
 */
export function entryOrdinal(entry: Entry): string | null {
  switch (entry.categoria) {
    case "papas":
      return entry.numero_ordem === null ? null : `${entry.numero_ordem}º Papa`;
    case "concilios":
      return entry.numero_ordem === null
        ? null
        : `${entry.numero_ordem}º concílio ecumênico`;
    case "catecismo":
      return entry.ordem === null ? null : `Parte ${entry.ordem}`;
    case "crisma":
      return entry.ordem === null ? null : `Tema ${entry.ordem}`;
    case "pecados":
      return entry.ordem === null ? null : `${entry.ordem}º pecado capital`;
    case "sacramentos":
      return entry.ordem === null ? null : `${entry.ordem}º sacramento`;
    case "mandamentos":
      return entry.tipo === "decalogo" && entry.ordem !== null
        ? `${entry.ordem}º mandamento`
        : null;
    case "jesus-cristo":
      return entry.ordem === null ? null : `Tema ${entry.ordem}`;
    case "doutrina-social":
      return entry.ordem === null ? null : `Princípio ${entry.ordem}`;
    case "liturgia-das-horas":
      return entry.ordem === null ? null : `Hora ${entry.ordem}`;
    case "arte-sacra-simbolos":
      return entry.ordem === null ? null : `Símbolo ${entry.ordem}`;
    case "direito-canonico":
      return entry.ordem === null ? null : `Tópico ${entry.ordem}`;
    case "vocacoes-estados-de-vida":
      return entry.ordem === null ? null : `Tema ${entry.ordem}`;
    case "primeira-comunhao":
      return entry.ordem === null ? null : `Tema ${entry.ordem}`;
    case "musica-sacra":
      return entry.ordem === null ? null : `Tema ${entry.ordem}`;
    default:
      return null;
  }
}

/**
 * Linha única de contexto para a listagem: o dado que mais distingue a
 * entrada das irmãs dela (data da festa, local do milagre, período histórico).
 */
export function entryHighlight(entry: Entry): string | null {
  switch (entry.categoria) {
    case "santos":
      return entry.festa ? `Festa em ${entry.festa}` : null;
    case "papas":
      return formatTextRange(entry.pontificado_inicio, entry.pontificado_fim);
    case "concilios": {
      const years = formatYearRange(entry.ano_inicio, entry.ano_fim);
      return [years, entry.local].filter(Boolean).join(" · ") || null;
    }
    case "milagres-eucaristicos":
      return [entry.local, entry.ano].filter(Boolean).join(" · ") || null;
    case "catecismo":
    case "crisma":
      return formatCatechismParagraphs(entry.paragrafos_ccc);
    case "doutores-igreja":
      return entry.titulo_honorifico;
    case "historia":
      return entry.periodo;
    case "nossa-senhora":
      return [marianTypeLabel(entry.tipo), entry.ano].filter(Boolean).join(" · ") || null;
    case "livros":
      return [entry.autor, entry.ano_publicacao].filter(Boolean).join(" · ") || null;
    case "oracoes":
      return entry.uso;
    case "pecados":
      return entry.virtude_oposta ? `Virtude oposta: ${entry.virtude_oposta}` : null;
    case "liturgia":
      return formatCatechismParagraphs(entry.paragrafos_ccc);
    case "sacramentos":
      return entry.ministro ? `Ministro: ${entry.ministro}` : null;
    case "virtudes":
      return [virtudeTypeLabel(entry.tipo), entry.referencia_biblica]
        .filter(Boolean)
        .join(" · ") || null;
    case "mandamentos":
      return entry.referencia_biblica;
    case "biblia":
      return [testamentoLabel(entry.testamento), entry.genero_literario]
        .filter(Boolean)
        .join(" · ") || null;
    case "devocoes":
      return entry.origem;
    case "glossario":
      return null;
    case "calendario-liturgico":
      return entry.cor_liturgica ? `Cor: ${entry.cor_liturgica}` : null;
    case "novissimos":
      return null;
    case "ordens-religiosas":
      return [entry.fundador, entry.ano_fundacao].filter(Boolean).join(" · ") || null;
    case "estrutura-igreja":
      return null;
    case "santuarios":
      return [entry.local, entry.pais].filter(Boolean).join(" · ") || null;
    case "documentos-magisterio":
      return [entry.tipo_documento, entry.ano].filter(Boolean).join(" · ") || null;
    case "beatos-canonizacao":
      return null;
    case "igreja-brasil":
      return null;
    case "sacramentais":
      return null;
    case "apologetica":
      return entry.objecao;
    case "jesus-cristo":
      return [jesusTypeLabel(entry.tipo), entry.referencia_biblica]
        .filter(Boolean)
        .join(" · ") || null;
    case "personagens-biblicos":
      return [personagemBiblicoTypeLabel(entry.tipo), testamentoLabel(entry.testamento)]
        .filter(Boolean)
        .join(" · ") || null;
    case "parabolas":
      return entry.referencia_biblica;
    case "milagres-de-jesus":
      return milagreDeJesusTypeLabel(entry.tipo);
    case "terra-santa":
      return [entry.local, entry.pais].filter(Boolean).join(" · ") || null;
    case "padres-da-igreja":
      return [entry.regiao, entry.seculo].filter(Boolean).join(" · ") || null;
    case "heresias-cismas":
      return [heresiaCismaTypeLabel(entry.tipo), entry.seculo].filter(Boolean).join(" · ") || null;
    case "anjos-demonios":
      return anjoDemonioTypeLabel(entry.tipo);
    case "doutrina-social":
      return null;
    case "liturgia-das-horas":
      return null;
    case "ritos-orientais":
      return [entry.familia_liturgica, entry.regiao].filter(Boolean).join(" · ") || null;
    case "arte-sacra-simbolos":
      return null;
    case "direito-canonico":
      return null;
    case "vocacoes-estados-de-vida":
      return null;
    case "primeira-comunhao":
      return formatCatechismParagraphs(entry.paragrafos_ccc);
    case "musica-sacra":
      return entry.idioma;
  }
}

/** Rótulo em português de cada tipo de entrada mariana. */
function marianTypeLabel(tipo: EntryOf<"nossa-senhora">["tipo"]): string {
  switch (tipo) {
    case "dogma":
      return "Dogma";
    case "aparicao":
      return "Aparição";
    case "titulo":
      return "Título";
  }
}

/** Rótulo em português de cada tipo de virtude/dom/bem-aventurança. */
function virtudeTypeLabel(tipo: EntryOf<"virtudes">["tipo"]): string {
  switch (tipo) {
    case "teologal":
      return "Virtude teologal";
    case "cardeal":
      return "Virtude cardeal";
    case "dom_espirito_santo":
      return "Dom do Espírito Santo";
    case "fruto_espirito_santo":
      return "Fruto do Espírito Santo";
    case "bem_aventuranca":
      return "Bem-aventurança";
    case "obra_misericordia_corporal":
      return "Obra de misericórdia corporal";
    case "obra_misericordia_espiritual":
      return "Obra de misericórdia espiritual";
  }
}

/** Rótulo em português de cada tipo de mandamento. */
function mandamentoTypeLabel(tipo: EntryOf<"mandamentos">["tipo"]): string {
  switch (tipo) {
    case "decalogo":
      return "Dez Mandamentos";
    case "igreja":
      return "Preceito da Igreja";
  }
}

/** Rótulo em português do testamento de um livro bíblico (ou personagem). */
function testamentoLabel(
  testamento: EntryOf<"biblia">["testamento"] | EntryOf<"personagens-biblicos">["testamento"],
): string {
  switch (testamento) {
    case "antigo":
      return "Antigo Testamento";
    case "novo":
      return "Novo Testamento";
  }
}

/** Rótulo em português de cada tipo de entrada sobre Jesus Cristo. */
function jesusTypeLabel(tipo: EntryOf<"jesus-cristo">["tipo"]): string {
  switch (tipo) {
    case "misterio_vida":
      return "Mistério da vida";
    case "titulo":
      return "Título bíblico";
    case "dogma_cristologico":
      return "Dogma cristológico";
  }
}

/** Rótulo em português de cada tipo de personagem bíblico. */
function personagemBiblicoTypeLabel(tipo: EntryOf<"personagens-biblicos">["tipo"]): string {
  switch (tipo) {
    case "patriarca":
      return "Patriarca";
    case "profeta":
      return "Profeta";
    case "rei":
      return "Rei";
    case "apostolo":
      return "Apóstolo";
    case "mulher":
      return "Mulher da Bíblia";
    case "outro":
      return "Outra figura bíblica";
  }
}

/** Rótulo em português de cada tipo de milagre de Jesus. */
function milagreDeJesusTypeLabel(tipo: EntryOf<"milagres-de-jesus">["tipo"]): string {
  switch (tipo) {
    case "cura":
      return "Cura";
    case "exorcismo":
      return "Exorcismo";
    case "natureza":
      return "Domínio sobre a natureza";
    case "ressureicao":
      return "Ressurreição";
  }
}

/** Rótulo em português de cada tipo de heresia/cisma. */
function heresiaCismaTypeLabel(tipo: EntryOf<"heresias-cismas">["tipo"]): string {
  switch (tipo) {
    case "heresia":
      return "Heresia";
    case "cisma":
      return "Cisma";
  }
}

/** Rótulo em português de cada tipo de anjo/demônio. */
function anjoDemonioTypeLabel(tipo: EntryOf<"anjos-demonios">["tipo"]): string {
  switch (tipo) {
    case "arcanjo":
      return "Arcanjo";
    case "coro_angelico":
      return "Coro angélico";
    case "anjo_da_guarda":
      return "Anjo da guarda";
    case "demonio":
      return "Demônio";
    case "conceito":
      return "Conceito doutrinal";
  }
}

/** Campos próprios da categoria, na ordem em que a ficha os apresenta. */
export function entryMetaFields(entry: Entry): MetaField[] {
  switch (entry.categoria) {
    case "santos":
      return [
        ...field("Festa", entry.festa),
        ...field("Nascimento", entry.nascimento),
        ...field("Morte", entry.morte),
        ...listField("Patronato", entry.patronato),
      ];
    case "papas":
      return [
        ...field(
          "Sucessão",
          entry.numero_ordem === null
            ? null
            : `${entry.numero_ordem}º Bispo de Roma`,
        ),
        ...field(
          "Pontificado",
          formatTextRange(entry.pontificado_inicio, entry.pontificado_fim),
        ),
      ];
    case "concilios":
      return [
        ...field(
          "Posição",
          entry.numero_ordem === null
            ? null
            : `${entry.numero_ordem}º dos concílios ecumênicos`,
        ),
        ...field("Anos", formatYearRange(entry.ano_inicio, entry.ano_fim)),
        ...field("Local", entry.local),
      ];
    case "milagres-eucaristicos":
      return [...field("Local", entry.local), ...field("Data", entry.ano)];
    case "catecismo":
      return [
        ...field("Parte", entry.ordem === null ? null : String(entry.ordem)),
        ...field("Parágrafos", formatCatechismParagraphs(entry.paragrafos_ccc)),
      ];
    case "crisma":
      return [
        ...field("Tema", entry.ordem === null ? null : String(entry.ordem)),
        ...field("Parágrafos", formatCatechismParagraphs(entry.paragrafos_ccc)),
      ];
    case "doutores-igreja":
      return [
        ...field("Título", entry.titulo_honorifico),
        ...field(
          "Proclamação",
          entry.ano_proclamacao === null ? null : String(entry.ano_proclamacao),
        ),
      ];
    case "historia":
      return [...field("Período", entry.periodo)];
    case "nossa-senhora":
      return [
        ...field("Tipo", marianTypeLabel(entry.tipo)),
        ...field("Ano", entry.ano),
        ...field("Local", entry.local),
      ];
    case "livros":
      return [
        ...field("Autor", entry.autor),
        ...field("Publicação", entry.ano_publicacao),
        ...field("Gênero", entry.genero),
      ];
    case "oracoes":
      return [...field("Uso", entry.uso), ...field("Origem", entry.origem)];
    case "pecados":
      return [...field("Virtude oposta", entry.virtude_oposta)];
    case "liturgia":
      return [...field("Parágrafos", formatCatechismParagraphs(entry.paragrafos_ccc))];
    case "sacramentos":
      return [
        ...field("Matéria", entry.materia),
        ...field("Forma", entry.forma),
        ...field("Ministro", entry.ministro),
        ...field("Efeitos", entry.efeitos),
        ...field("Parágrafos", formatCatechismParagraphs(entry.paragrafos_ccc)),
      ];
    case "virtudes":
      return [
        ...field("Tipo", virtudeTypeLabel(entry.tipo)),
        ...field("Referência bíblica", entry.referencia_biblica),
      ];
    case "mandamentos":
      return [
        ...field("Tipo", mandamentoTypeLabel(entry.tipo)),
        ...field("Referência bíblica", entry.referencia_biblica),
        ...field("Parágrafos", formatCatechismParagraphs(entry.paragrafos_ccc)),
      ];
    case "biblia":
      return [
        ...field("Testamento", testamentoLabel(entry.testamento)),
        ...field("Gênero literário", entry.genero_literario),
        ...field("Autor tradicional", entry.autor_tradicional),
        ...field("Composição", entry.data_composicao),
        ...(entry.deuterocanonico ? [{ label: "Cânon", value: "Deuterocanônico" }] : []),
      ];
    case "devocoes":
      return [...field("Origem", entry.origem)];
    case "glossario":
      return [];
    case "calendario-liturgico":
      return [...field("Cor litúrgica", entry.cor_liturgica)];
    case "novissimos":
      return [];
    case "ordens-religiosas":
      return [
        ...field("Fundador", entry.fundador),
        ...field("Fundação", entry.ano_fundacao),
        ...field("Carisma", entry.carisma),
      ];
    case "estrutura-igreja":
      return [];
    case "santuarios":
      return [
        ...field("Local", entry.local),
        ...field("País", entry.pais),
        ...field("Ano", entry.ano),
      ];
    case "documentos-magisterio":
      return [
        ...field("Tipo", entry.tipo_documento),
        ...field("Autor", entry.papa_autor),
        ...field("Ano", entry.ano),
      ];
    case "beatos-canonizacao":
      return [];
    case "igreja-brasil":
      return [];
    case "sacramentais":
      return [];
    case "apologetica":
      return [...field("Objeção", entry.objecao)];
    case "jesus-cristo":
      return [
        ...field("Tipo", jesusTypeLabel(entry.tipo)),
        ...field("Referência bíblica", entry.referencia_biblica),
        ...field("Parágrafos", formatCatechismParagraphs(entry.paragrafos_ccc)),
      ];
    case "personagens-biblicos":
      return [
        ...field("Tipo", personagemBiblicoTypeLabel(entry.tipo)),
        ...field("Testamento", testamentoLabel(entry.testamento)),
        ...field("Referência bíblica", entry.referencia_biblica),
      ];
    case "parabolas":
      return [
        ...field("Referência bíblica", entry.referencia_biblica),
        ...listField("Evangelistas", entry.evangelistas),
      ];
    case "milagres-de-jesus":
      return [
        ...field("Tipo", milagreDeJesusTypeLabel(entry.tipo)),
        ...field("Referência bíblica", entry.referencia_biblica),
      ];
    case "terra-santa":
      return [
        ...field("Local", entry.local),
        ...field("País", entry.pais),
        ...field("Tipo de local", entry.tipo_local),
      ];
    case "padres-da-igreja":
      return [
        ...field("Região", entry.regiao),
        ...field("Século", entry.seculo),
        ...(entry.e_doutor ? [{ label: "Também é", value: "Doutor da Igreja" }] : []),
      ];
    case "heresias-cismas":
      return [
        ...field("Tipo", heresiaCismaTypeLabel(entry.tipo)),
        ...field("Século", entry.seculo),
        ...field("Condenação", entry.condenacao),
      ];
    case "anjos-demonios":
      return [...field("Tipo", anjoDemonioTypeLabel(entry.tipo))];
    case "doutrina-social":
      return [];
    case "liturgia-das-horas":
      return [];
    case "ritos-orientais":
      return [
        ...field("Família litúrgica", entry.familia_liturgica),
        ...field("Região", entry.regiao),
      ];
    case "arte-sacra-simbolos":
      return [];
    case "direito-canonico":
      return [];
    case "vocacoes-estados-de-vida":
      return [];
    case "primeira-comunhao":
      return [...field("Parágrafos", formatCatechismParagraphs(entry.paragrafos_ccc))];
    case "musica-sacra":
      return [...field("Idioma", entry.idioma)];
  }
}

/**
 * Quebra o corpo em parágrafos.
 *
 * O corpo chega como texto com linhas em branco entre parágrafos (é o formato
 * do acervo) e é renderizado como texto, nunca como HTML — daí só precisar da
 * separação, sem sanitização de marcação.
 */
export function paragraphs(corpo: string): string[] {
  return corpo
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

/** Contagem de entradas com plural correto, para rótulo de categoria. */
export function formatEntryCount(total: number): string {
  return total === 1 ? "1 entrada" : `${total} entradas`;
}

/** Título da página de listagem de uma categoria. */
export function categoryHeading(entry: Entry): string {
  return CATEGORY_LABELS[entry.categoria].heading;
}
