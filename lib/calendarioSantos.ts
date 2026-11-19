import { feastDates } from "@/lib/santoDoDia";

/**
 * Calendário dos santos em iCalendar (RFC 5545), para assinar no Google Agenda ou no
 * iPhone: o próprio celular lembra a pessoa no dia de cada festa, sem servidor de
 * notificação nem lista de e-mails. Cada festa é um evento anual de dia inteiro com
 * aviso às 8h, que leva ao verbete.
 */

type SantoDoCalendario = { slug: string; titulo: string; festa: string | null; resumo: string };

const HOST = "compendio-catolico.com";

/** Texto de propriedade: barra, vírgula, ponto e vírgula e quebra de linha escapados. */
export function escaparTexto(texto: string): string {
  return texto.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\r?\n/g, "\\n");
}

/** Linha com no máximo 75 bytes; a continuação começa com um espaço (RFC 5545, 3.1). */
export function dobrarLinha(linha: string): string {
  const encoder = new TextEncoder();
  const partes: string[] = [];
  let atual = "";
  for (const letra of linha) {
    const limite = partes.length === 0 ? 75 : 74; // a continuação gasta 1 byte no espaço
    if (encoder.encode(atual + letra).length > limite) {
      partes.push(atual);
      atual = letra;
    } else {
      atual += letra;
    }
  }
  partes.push(atual);
  return partes.map((parte, i) => (i === 0 ? parte : ` ${parte}`)).join("\r\n");
}

export function calendarioDosSantos(santos: readonly SantoDoCalendario[], siteUrl: string): string {
  const linhas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Compendio Catolico//Santos do dia//PT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Santos do dia · Compêndio Católico",
    "X-WR-TIMEZONE:America/Sao_Paulo",
  ];
  for (const santo of santos) {
    const url = `${siteUrl}/santos/${santo.slug}`;
    for (const mmdd of feastDates(santo.festa)) {
      linhas.push(
        "BEGIN:VEVENT",
        `UID:${santo.slug}-${mmdd}@${HOST}`,
        "DTSTAMP:20260101T000000Z",
        // Ano qualquer no passado + RRULE anual: o evento vale para todos os anos.
        `DTSTART;VALUE=DATE:2000${mmdd.replace("-", "")}`,
        "RRULE:FREQ=YEARLY",
        `SUMMARY:${escaparTexto(santo.titulo)}`,
        `DESCRIPTION:${escaparTexto(`${santo.resumo}\n\n${url}`)}`,
        `URL:${url}`,
        "TRANSP:TRANSPARENT",
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        `DESCRIPTION:${escaparTexto(`Hoje é dia de ${santo.titulo}`)}`,
        "TRIGGER:PT8H",
        "END:VALARM",
        "END:VEVENT",
      );
    }
  }
  linhas.push("END:VCALENDAR");
  return `${linhas.map(dobrarLinha).join("\r\n")}\r\n`;
}
