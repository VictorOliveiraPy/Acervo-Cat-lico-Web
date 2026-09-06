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
