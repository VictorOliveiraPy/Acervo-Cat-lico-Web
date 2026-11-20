import { getApiBaseUrl } from "@/lib/api";

/**
 * Recebe a visita do navegador e repassa à API com quem visitou: o IP (que o Caddy
 * põe no `X-Forwarded-For`) e o navegador. A API só aceita com o segredo interno,
 * então ninguém de fora grava direto lá. Responde sempre 204: métrica não quebra nada.
 */
export async function POST(request: Request): Promise<Response> {
  const secret = process.env.INTERNAL_API_SECRET;
  const corpo = await request.text();
  if (secret && corpo.length <= 2048) {
    // O Caddy acrescenta o IP real no fim da lista; o começo pode vir do próprio cliente.
    const ip = (request.headers.get("x-forwarded-for") ?? "").split(",").pop()?.trim() ?? "";
    try {
      await fetch(`${getApiBaseUrl()}/metricas`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          "X-Internal-Secret": secret,
          "X-Visitante-IP": ip,
          "X-Visitante-UA": (request.headers.get("user-agent") ?? "").slice(0, 512),
        },
        body: corpo,
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });
    } catch {
      // API fora ou lenta: a visita se perde, o site segue.
    }
  }
  return new Response(null, { status: 204 });
}
