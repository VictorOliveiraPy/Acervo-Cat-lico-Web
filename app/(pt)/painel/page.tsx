import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { currentEmail } from "@/lib/auth";
import { LOGIN_ENABLED } from "@/lib/auth-public";
import { isAdminEmail, nomeDoEvento, variacao } from "@/lib/painel";
import { fetchResumoMetricas, type ResumoMetricas } from "@/lib/services/metricasService";

export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

const PERIODOS = [7, 30, 90] as const;

type SearchParams = { [key: string]: string | string[] | undefined };

function periodo(searchParams: SearchParams): (typeof PERIODOS)[number] {
  const pedido = Number(Array.isArray(searchParams.dias) ? searchParams.dias[0] : searchParams.dias);
  return PERIODOS.find((dias) => dias === pedido) ?? 30;
}

const diaCurto = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", timeZone: "UTC" }).format(
    new Date(`${iso}T12:00:00Z`),
  );

function Numero({ rotulo, valor, antes }: { rotulo: string; valor: number; antes: number }) {
  const mudanca = variacao(valor, antes);
  return (
    <div className="rounded-panel border border-border bg-surface p-5">
      <p className="kicker">{rotulo}</p>
      <p className="mt-1 font-display text-title-xl text-ink [font-variant-numeric:tabular-nums]">
        {valor.toLocaleString("pt-BR")}
      </p>
      <p className="text-meta text-ink-muted">
        {mudanca
          ? `${mudanca} contra o período anterior (${antes.toLocaleString("pt-BR")})`
          : "Período anterior sem dados para comparar"}
      </p>
    </div>
  );
}

/** Barras de uma série só: um eixo, linha de base, dica por barra e tabela opcional. */
function GraficoDiario({
  titulo,
  dias,
  valor,
  unidade,
}: {
  titulo: string;
  dias: ResumoMetricas["dias"];
  valor: (dia: ResumoMetricas["dias"][number]) => number;
  unidade: string;
}) {
  const largura = 12;
  const vao = 2;
  const altura = 140;
  const maximo = Math.max(1, ...dias.map(valor));
  const total = dias.length * (largura + vao) - vao;
  const meio = dias[Math.floor(dias.length / 2)];

  return (
    <figure className="rounded-panel border border-border bg-surface p-5">
      <figcaption className="font-semibold text-ink">{titulo}</figcaption>
      <div className="mt-3 flex gap-2">
        <div className="flex flex-col justify-between pb-5 text-right text-label text-ink-muted [font-variant-numeric:tabular-nums]">
          <span>{maximo.toLocaleString("pt-BR")}</span>
          <span>0</span>
        </div>
        <div className="min-w-0 flex-1">
          <svg
            viewBox={`0 0 ${total} ${altura}`}
            preserveAspectRatio="none"
            className="h-36 w-full"
            role="img"
            aria-label={`${titulo}, de ${diaCurto(dias[0]?.dia ?? "")} a ${diaCurto(dias.at(-1)?.dia ?? "")}`}
          >
            <line x1="0" x2={total} y1={altura - 0.5} y2={altura - 0.5} className="stroke-border" strokeWidth="1" />
            {dias.map((dia, i) => {
              const v = valor(dia);
              const h = Math.max(v > 0 ? 2 : 0, (v / maximo) * (altura - 4));
              return (
                <g key={dia.dia}>
                  {/* Área de toque maior que a barra: a dica aparece em qualquer ponto da coluna. */}
                  <rect x={i * (largura + vao)} y="0" width={largura} height={altura} fill="transparent">
                    <title>{`${diaCurto(dia.dia)}: ${v.toLocaleString("pt-BR")} ${unidade}`}</title>
                  </rect>
                  <rect
                    x={i * (largura + vao)}
                    y={altura - h}
                    width={largura}
                    height={h}
                    rx="2"
                    className="pointer-events-none fill-accent"
                  />
                </g>
              );
            })}
          </svg>
          <div className="mt-1 flex justify-between text-label text-ink-muted">
            <span>{diaCurto(dias[0]?.dia ?? "")}</span>
            {meio ? <span>{diaCurto(meio.dia)}</span> : null}
            <span>{diaCurto(dias.at(-1)?.dia ?? "")}</span>
          </div>
        </div>
      </div>
      <details className="mt-3">
        <summary className="cursor-pointer text-meta text-accent">Ver em tabela</summary>
        <table className="mt-2 w-full text-meta">
          <thead>
            <tr className="text-left text-ink-muted">
              <th className="py-1 font-semibold">Dia</th>
              <th className="py-1 text-right font-semibold">{unidade}</th>
            </tr>
          </thead>
          <tbody>
            {[...dias].reverse().map((dia) => (
              <tr key={dia.dia} className="border-t border-border">
                <td className="py-1 text-ink">{diaCurto(dia.dia)}</td>
                <td className="py-1 text-right text-ink [font-variant-numeric:tabular-nums]">{valor(dia)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

function Ranking({
  titulo,
  itens,
  vazio,
  nome = (n) => n,
}: {
  titulo: string;
  itens: ResumoMetricas["origens"];
  vazio: string;
  nome?: (nome: string) => string;
}) {
  const maior = Math.max(1, ...itens.map((item) => item.total));
  return (
    <section className="rounded-panel border border-border bg-surface p-5">
      <h2 className="font-semibold text-ink">{titulo}</h2>
      {itens.length === 0 ? (
        <p className="mt-3 text-meta text-ink-muted">{vazio}</p>
      ) : (
        <ol className="mt-3 flex flex-col gap-1.5">
          {itens.map((item) => (
            <li key={item.nome} className="relative flex items-center justify-between gap-3 px-2 py-1 text-meta">
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 rounded bg-accent-soft"
                style={{ width: `${(item.total / maior) * 100}%` }}
              />
              <span className="relative min-w-0 truncate text-ink">{nome(item.nome)}</span>
              <span className="relative text-ink [font-variant-numeric:tabular-nums]">
                {item.total.toLocaleString("pt-BR")}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

/**
 * Painel de visitas, só para quem administra o site (e-mail em `ADMIN_EMAILS`). Para
 * qualquer outra pessoa a página não existe (404), nem mostra que há um painel.
 */
export default async function PainelPage({ searchParams }: { searchParams: SearchParams }) {
  if (!LOGIN_ENABLED) notFound();
  const email = await currentEmail();
  if (!email) redirect("/api/auth/signin?callbackUrl=/painel");
  if (!isAdminEmail(email, process.env.ADMIN_EMAILS)) notFound();

  const dias = periodo(searchParams);
  const resumo = await fetchResumoMetricas(dias);

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Painel</p>
          <h1 className="mt-2 font-display text-title-lg text-ink">Visitas do compêndio</h1>
          <p className="mt-1 text-meta text-ink-muted">
            {diaCurto(resumo.inicio)} a {diaCurto(resumo.fim)}. Visitante é cada pessoa diferente em cada
            dia: quem volta em dois dias conta duas vezes. Sem cookie, sem guardar IP, sem robôs e sem as
            suas próprias visitas.
          </p>
        </div>
        <nav aria-label="Período" className="flex gap-2">
          {PERIODOS.map((opcao) => (
            <Link
              key={opcao}
              href={`/painel?dias=${opcao}`}
              aria-current={opcao === dias ? "page" : undefined}
              className={`rounded-edge border px-3 py-1.5 text-meta font-semibold ${
                opcao === dias ? "border-accent bg-accent text-surface" : "border-border text-ink-muted hover:text-accent"
              }`}
            >
              {opcao} dias
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Numero rotulo="Visitantes" valor={resumo.visitantes} antes={resumo.visitantes_antes} />
        <Numero rotulo="Páginas vistas" valor={resumo.paginas} antes={resumo.paginas_antes} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <GraficoDiario titulo="Visitantes por dia" dias={resumo.dias} valor={(d) => d.visitantes} unidade="visitantes" />
        <GraficoDiario titulo="Páginas vistas por dia" dias={resumo.dias} valor={(d) => d.paginas} unidade="páginas" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Ranking titulo="Páginas mais vistas" itens={resumo.paginas_mais_vistas} vazio="Nenhuma visita ainda." />
        <Ranking titulo="De onde vieram" itens={resumo.origens} vazio="Ninguém veio de outro site ainda." />
        <Ranking titulo="O que fizeram" itens={resumo.eventos} vazio="Nenhum evento ainda." nome={nomeDoEvento} />
        <Ranking titulo="Aparelhos" itens={resumo.dispositivos} vazio="Sem dados ainda." />
      </div>
    </div>
  );
}
