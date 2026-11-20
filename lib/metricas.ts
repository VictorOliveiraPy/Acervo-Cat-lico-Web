/**
 * Envio das métricas de visita (ver a API: app/interface/metrics). Vai para o próprio
 * site (`/api/metricas`), que repassa à API: sem domínio de terceiro, sem cookie.
 * `sendBeacon` não atrasa a navegação; texto puro evita a checagem CORS.
 */

export type Metrica =
  | { tipo: "pagina"; caminho: string; referencia?: string }
  | { tipo: "evento"; caminho: string; evento: string };

export function enviarMetrica(metrica: Metrica): void {
  if (typeof window === "undefined") return;
  const corpo = JSON.stringify(metrica);
  try {
    if (navigator.sendBeacon?.("/api/metricas", new Blob([corpo], { type: "text/plain" }))) return;
  } catch {
    // Alguns navegadores recusam o beacon; cai no fetch abaixo.
  }
  void fetch("/api/metricas", { method: "POST", body: corpo, keepalive: true }).catch(() => {});
}
