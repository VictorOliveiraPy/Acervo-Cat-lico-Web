const FEED = "webcal://compendio-catolico.com/calendario/santos.ics";
const GOOGLE = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(FEED)}`;

/**
 * Convite para assinar o calendário dos santos: o celular passa a lembrar a pessoa
 * no dia de cada festa, sem notificação nossa nem lista de e-mails.
 */
export function AssinarCalendario({ compacto = false }: { compacto?: boolean }) {
  if (compacto) {
    return (
      <a data-evento="calendar_subscribed" href={GOOGLE} target="_blank" rel="noopener noreferrer" className="btn-tertiary">
        Lembrete no celular <span aria-hidden="true">→</span>
      </a>
    );
  }
  return (
    <aside aria-labelledby="lembrete" className="mt-10 rounded-panel border border-border bg-surface p-6">
      <h2 id="lembrete" className="font-display text-title-sm text-ink">
        O santo do dia no seu celular
      </h2>
      <p className="mt-2 max-w-measure text-meta text-ink-muted">
        Assine o calendário dos santos: no dia de cada festa, sua agenda avisa às 8h e leva
        à história do santo. Funciona no Google Agenda, no iPhone e no Outlook.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a data-evento="calendar_subscribed" href={GOOGLE} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          Adicionar ao Google Agenda
        </a>
        <a data-evento="calendar_subscribed" href={FEED} className="btn btn-secondary">
          iPhone e outros calendários
        </a>
      </div>
    </aside>
  );
}
