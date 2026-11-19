import { calendarioDosSantos } from "@/lib/calendarioSantos";
import type { Santo } from "@/lib/santoDoDia";
import { fetchAllEntries } from "@/lib/services/acervoService";
import { SITE_URL } from "@/lib/site";

/** O calendário muda só quando entra santo novo: refaz uma vez por dia. */
export const revalidate = 86400;

/**
 * Calendário dos santos para assinar (webcal://…/calendario/santos.ics). O link de
 * assinatura fica na página do santo do dia.
 */
export async function GET() {
  const santos = (await fetchAllEntries("santos")) as Santo[];
  return new Response(calendarioDosSantos(santos, SITE_URL), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="santos-do-dia.ics"',
    },
  });
}
