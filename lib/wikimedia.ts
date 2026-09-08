/**
 * Utilitário compartilhado pelos geradores de cartão do Instagram
 * (`app/instagram/**\/route.tsx`) que buscam foto do Wikimedia Commons.
 */

/**
 * Reescreve a URL da imagem original pra uma miniatura do próprio Wikimedia
 * (`Special:FilePath?width=`, que redireciona pro tamanho pedido).
 *
 * Existe porque algumas imagens do acervo são o arquivo original do
 * Wikimedia em altíssima resolução (o caso real que travou o gerador de
 * cartão por verbete: o "Filho Pródigo" de Rembrandt, do Google Art
 * Project, tem 262 MB) — buscar isso no servidor pra desenhar um cartão de
 * 1080px é lento ou nem termina. Pedir sempre uma miniatura evita esse
 * problema pra qualquer imagem, não só as já conhecidas.
 */
export function wikimediaThumbUrl(originalUrl: string, width = 1200): string {
  // Imagens auto-hospedadas (ex.: "/img-acervo/foo.jpg", vindas do acervo
  // local do site) não são do Wikimedia — devolve sem alterar, senão a
  // reescrita abaixo gera uma URL quebrada em commons.wikimedia.org.
  if (!originalUrl.includes("wikimedia.org")) return originalUrl;

  const filename = originalUrl.split("/").pop();
  if (!filename) return originalUrl;
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=${width}`;
}

/**
 * Resolve a URL de imagem que um cartão de Instagram vai buscar: se for um
 * caminho relativo do acervo auto-hospedado (`/img-acervo/foo.jpg`), vira
 * absoluta a partir da origem da própria requisição — Satori roda no
 * servidor e não resolve caminho relativo como um `<img>` de navegador
 * resolveria. Se for do Wikimedia, ainda passa por `wikimediaThumbUrl`.
 */
export function resolveCardImageSrc(imagem: string, origin: string): string {
  const absolute = imagem.startsWith("/") ? `${origin}${imagem}` : imagem;
  return wikimediaThumbUrl(absolute);
}
