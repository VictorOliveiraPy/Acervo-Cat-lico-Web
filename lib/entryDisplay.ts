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
