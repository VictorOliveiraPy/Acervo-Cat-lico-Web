import { META, diasAteAVisita, fraseDasConfirmacoes, linkConfirmar } from "@/lib/leaoNoBrasil";
import { todayInBrazil } from "@/lib/liturgia";
import { fetchConfirmacoesLeao } from "@/lib/services/leaoService";

/** As chaves de Pedro, em traço, como marca d'água do bloco. */
function Chaves() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <g transform="rotate(45 60 60)">
        <circle cx="60" cy="22" r="11" />
        <path d="M60 33v72M60 88h12M60 98h9" />
      </g>
      <g transform="rotate(-45 60 60)">
        <circle cx="60" cy="22" r="11" />
        <path d="M60 33v72M60 88h-12M60 98h-9" />
      </g>
    </svg>
  );
}

/**
 * Convite do compêndio para o Leão XIV no Brasil: a possível visita do Papa a Goiânia
 * (3 a 7 de setembro de 2027), os dias que faltam, as confirmações ao vivo e o botão para
 * confirmar presença no site do Leão. Usa as cores de lá (noite, ouro e marfim), num
 * bloco escuro também no tema claro.
 */
export async function LeaoNoBrasil({ origem }: { origem: string }) {
  const confirmados = await fetchConfirmacoesLeao();
  const dias = diasAteAVisita(todayInBrazil());
  const progresso = confirmados === null ? 0 : Math.min(100, (confirmados / META) * 100);

  return (
    <section
      aria-labelledby={`leao-${origem}`}
      className="relative overflow-hidden rounded-panel text-[#f4f2e6] shadow-sm"
      style={{ background: "radial-gradient(120% 140% at 85% 0%, #0b4a2f 0%, #053321 45%, #021a10 100%)" }}
    >
      {/* Faixa com as cores da bandeira, no alto. */}
      <div aria-hidden="true" className="flex h-1.5">
        <span className="flex-[3] bg-[#009c3b]" />
        <span className="flex-[2] bg-[#ffdf00]" />
        <span className="flex-1 bg-[#002776]" />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute -right-10 top-6 h-64 w-64 text-[#f2c230] opacity-[0.08]">
        <Chaves />
      </div>

      <div className="relative grid gap-8 p-6 sm:p-8 md:grid-cols-[1.3fr_1fr] md:items-center">
        <div>
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.16em] text-[#f2c230]">
            Possível visita · Goiânia, 3 a 7 de setembro de 2027
          </p>
          <h2 id={`leao-${origem}`} className="mt-3 font-display text-title-lg leading-tight text-[#f4f2e6] md:text-title-xl">
            Leão XIV no Brasil
          </h2>
          <p className="mt-3 max-w-xl text-body text-[#f4f2e6]/85">
            O Papa pode vir ao Brasil. Confirme que você vai: cada peregrino acende uma luz no mapa e mostra que o
            Brasil está esperando por ele.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href={linkConfirmar(origem)}
              target="_blank"
              rel="noopener"
              data-evento="leao_confirmar"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#f2c230] px-6 text-body font-bold text-[#021a10] shadow transition-colors hover:bg-[#ffe36e]"
            >
              Eu vou! Confirmar presença <span aria-hidden="true">→</span>
            </a>
            <span className="text-meta text-[#a3c4b2]">Gratuito. Leva um minuto.</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-panel border border-[#f4f2e6]/15 bg-[#021a10]/40 p-4">
            <p className="font-display text-[2.6rem] leading-none text-[#ffe36e] [font-variant-numeric:tabular-nums]">
              {dias.toLocaleString("pt-BR")}
            </p>
            <p className="mt-1 text-meta text-[#a3c4b2]">{dias === 1 ? "dia para a chegada" : "dias para a chegada"}</p>
          </div>
          <div className="rounded-panel border border-[#f4f2e6]/15 bg-[#021a10]/40 p-4">
            <p className="font-display text-[2.6rem] leading-none text-[#ffe36e] [font-variant-numeric:tabular-nums]">
              {confirmados === null ? "—" : confirmados.toLocaleString("pt-BR")}
            </p>
            <p className="mt-1 text-meta text-[#a3c4b2]">
              {confirmados === null ? "peregrinos confirmados" : fraseDasConfirmacoes(confirmados).replace(/^[\d.]+ /, "")}
            </p>
          </div>
          <div className="col-span-2">
            <div
              role="progressbar"
              aria-label={`Confirmações até a meta de ${META.toLocaleString("pt-BR")} peregrinos`}
              aria-valuemin={0}
              aria-valuemax={META}
              aria-valuenow={confirmados ?? 0}
              className="h-2 overflow-hidden rounded-full bg-[#f4f2e6]/15"
            >
              <div className="h-full rounded-full bg-gradient-to-r from-[#009c3b] via-[#ffdf00] to-[#f2c230]" style={{ width: `${Math.max(progresso, 1.5)}%` }} />
            </div>
            <p className="mt-2 text-meta text-[#a3c4b2]">
              Meta: {META.toLocaleString("pt-BR")} peregrinos, como o ano da visita.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
