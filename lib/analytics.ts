export type ProductEvent =
  | "search_submitted"
  | "candle_lit"
  | "liturgy_opened"
  | "entry_favorited"
  | "entry_shared";

type ProductEventPayload = Record<string, string | number | boolean | undefined>;

export function trackEvent(
  name: ProductEvent,
  payload: ProductEventPayload = {},
): void {
  if (typeof window === "undefined") return;

  const event = { event: `compendio_${name}`, ...payload };
  const windowWithDataLayer = window as Window & { dataLayer?: unknown[] };
  windowWithDataLayer.dataLayer ??= [];
  windowWithDataLayer.dataLayer.push(event);
  window.dispatchEvent(new CustomEvent("compendio:analytics", { detail: event }));
}