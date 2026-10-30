import { SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Serialização segura de dado estruturado para `<script type="application/ld+json">`.
 *
 * `JSON.stringify` sozinho não escapa `</`, então um valor contendo
 * literalmente `</script>` fecharia a tag mais cedo e o que viesse depois
 * seria interpretado como HTML/JS pelo navegador — o vetor clássico de XSS
 * ao embutir JSON num `<script>` (mesmo problema que `dangerouslySetInnerHTML`
 * não previne sozinho). Hoje `titulo`/`resumo` vêm do acervo curado, não de
 * entrada pública, mas o escape custa nada e vale pra qualquer campo que no
 * futuro passe a vir de fora (ex.: conteúdo gerado por usuário).
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

const MONTHS: Record<string, string> = {
  janeiro: "01",
  fevereiro: "02",
  março: "03",
  abril: "04",
  maio: "05",
  junho: "06",
  julho: "07",
  agosto: "08",
  setembro: "09",
  outubro: "10",
  novembro: "11",
  dezembro: "12",
};

/**
 * "21 de fevereiro de 1801, Londres" vira `1801-02-21`. Data aproximada ("c. 330")
 * devolve `null`: o dado estruturado não pode afirmar uma precisão que não existe.
 */
export function toSchemaDate(value: string | null | undefined): string | null {
  const match = /^(\d{1,2})º? de ([a-zç]+) de (\d{3,4})\b/.exec(value ?? "");
  const month = match ? MONTHS[match[2] as string] : undefined;
  if (!match || !month) return null;
  return `${(match[3] as string).padStart(4, "0")}-${month}-${(match[1] as string).padStart(2, "0")}`;
}

type ArticleInput = {
  url: string;
  titulo: string;
  resumo: string;
  imagem: string | null;
  inLanguage: string;
  publicado_em: string | null;
  atualizado_em: string | null;
  nascimento?: string | null;
  morte?: string | null;
};

const ORGANIZATION = {
  "@type": "Organization",
  name: SITE_NAME,
  url: `${SITE_URL}/sobre`,
};

/** `Article` de um verbete. Campo sem dado fica de fora, em vez de valor inventado. */
export function articleJsonLd(input: ArticleInput): Record<string, unknown> {
  const birthDate = toSchemaDate(input.nascimento);
  const deathDate = toSchemaDate(input.morte);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.titulo,
    description: input.resumo,
    ...(input.imagem ? { image: input.imagem } : {}),
    inLanguage: input.inLanguage,
    ...(input.publicado_em ? { datePublished: input.publicado_em } : {}),
    ...(input.atualizado_em ? { dateModified: input.atualizado_em } : {}),
    author: ORGANIZATION,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512` },
    },
    mainEntityOfPage: input.url,
    ...(input.nascimento && input.morte
      ? {
          about: {
            "@type": "Person",
            name: input.titulo,
            ...(birthDate ? { birthDate } : {}),
            ...(deathDate ? { deathDate } : {}),
          },
        }
      : {}),
  };
}
