import { isAdmin } from "@/lib/auth";
import { linkDeEnvio } from "@/lib/services/estudioService";

/** Até 300 MB por arquivo: o estúdio recomprime acima de 200 MB. */
const LIMITE = 300 * 1024 * 1024;

/**
 * Recebe o vídeo ou a capa do painel e repassa ao R2 pelo link que a API assina. Vai
 * em fluxo (sem juntar o arquivo inteiro na memória da VPS) e o navegador não precisa
 * de permissão de CORS no bucket. Responde o endereço público do arquivo.
 */
export async function POST(request: Request): Promise<Response> {
  if (!(await isAdmin())) return new Response("Acesso negado.", { status: 404 });

  const params = new URL(request.url).searchParams;
  const slug = params.get("slug") ?? "";
  const tipo = params.get("tipo");
  const tamanho = Number(request.headers.get("content-length"));
  if ((tipo !== "video" && tipo !== "capa" && tipo !== "voz") || !request.body || !tamanho || tamanho > LIMITE) {
    return Response.json({ mensagem: "Arquivo inválido ou grande demais." }, { status: 400 });
  }

  let link;
  try {
    link = await linkDeEnvio(slug, tipo);
  } catch (error: unknown) {
    return Response.json({ mensagem: error instanceof Error ? error.message : "Sem link de envio." }, { status: 502 });
  }
  const resposta = await fetch(link.upload_url, {
    method: "PUT",
    headers: { "Content-Type": link.content_type, "Content-Length": String(tamanho) },
    body: request.body,
    // @ts-expect-error -- `duplex` é exigido pelo fetch do Node para corpo em fluxo.
    duplex: "half",
  });
  if (!resposta.ok) {
    return Response.json({ mensagem: `O R2 recusou o arquivo (${resposta.status}).` }, { status: 502 });
  }
  return Response.json({ public_url: link.public_url });
}
