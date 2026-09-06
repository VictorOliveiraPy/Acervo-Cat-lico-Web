#!/usr/bin/env node
/**
 * Avisa o IndexNow (Bing + Yandex, entre outros) sobre todas as URLs do
 * sitemap, de uma vez, em vez de esperar o rastreador natural passar.
 *
 * Roda sozinho a cada deploy (`postbuild` no package.json — o Vercel chama
 * `npm run build`, que dispara este script logo depois via lifecycle hook
 * do npm), então todo push que muda conteúdo já avisa o Bing sem passo
 * manual. Nunca falha o build: qualquer erro de rede aqui é só logado.
 *
 * A chave do IndexNow não é segredo — é só um token de posse do domínio,
 * de propósito público (o arquivo `public/<chave>.txt` é a prova).
 */

const INDEXNOW_KEY = "ff87540fdea51accae14c28c86c966df";
const HOST = "compendio-catolico.com";
const SITE_URL = `https://${HOST}`;

async function fetchSitemapUrls() {
  const response = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!response.ok) {
    throw new Error(`sitemap.xml respondeu ${response.status}`);
  }
  const xml = await response.text();
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches.map((match) => match[1]);
}

async function submitToIndexNow(urlList) {
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });
  return response.status;
}

async function main() {
  // Só no build de produção de verdade: `VERCEL_ENV` distingue produção de
  // preview (deploy de PR/branch), e sem `VERCEL` nenhum é build local —
  // nos dois casos as URLs de produção não têm por que ser renotificadas.
  if (process.env.VERCEL_ENV !== "production") {
    console.log(
      `[indexnow] ambiente '${process.env.VERCEL_ENV ?? "local"}' — pulando notificação.`,
    );
    return;
  }

  try {
    const urls = await fetchSitemapUrls();
    if (urls.length === 0) {
      console.warn("[indexnow] sitemap.xml sem nenhuma URL — nada a enviar.");
      return;
    }
    // IndexNow aceita até 10.000 URLs por chamada — o acervo está bem
    // abaixo disso, então uma chamada só resolve.
    const status = await submitToIndexNow(urls);
    console.log(`[indexnow] ${urls.length} URLs enviadas, resposta HTTP ${status}.`);
  } catch (error) {
    // De propósito silencioso pro build: isto é um "bônus" de SEO, não
    // pode nunca derrubar um deploy por causa de rede instável.
    console.warn("[indexnow] Falha ao notificar (ignorado):", error.message);
  }
}

main();
