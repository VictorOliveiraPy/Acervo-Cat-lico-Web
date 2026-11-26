import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CriarConta } from "@/components/jornada/CriarConta";
import { SantoQueAcende } from "@/components/jornada/SantoQueAcende";
import { LOGIN_ENABLED } from "@/lib/auth-public";
import { CONQUISTAS } from "@/lib/conquistas";
import { MULTIPLICADORES, TODOS_OS_TITULOS } from "@/lib/jornada";
import { PATRONS } from "@/lib/padroeiros";

export const metadata: Metadata = {
  title: "Sua jornada de fé: santo padroeiro, níveis e conquistas",
  description:
    "Crie sua conta grátis no Compêndio Católico: escolha um santo padroeiro em 3D, ganhe pontos rezando e estudando, suba de nível e colecione conquistas.",
  alternates: { canonical: "/jornada" },
};

const PASSOS = [
  {
    titulo: "Escolha seu padroeiro",
    texto: `${PATRONS.map((p) => p.nomeCurto).join(", ")}. Ele fica com você, em 3D, no seu perfil.`,
  },
  {
    titulo: "Reze e estude todo dia",
    texto: "Marque as práticas do dia e conclua as lições da Academia da Fé. Cada passo vale pontos.",
  },
  {
    titulo: "Suba de nível",
    texto: "São 100 níveis e 16 títulos. A cada etapa, o seu santo se enche de mais luz.",
  },
];

const FERRAMENTAS = [
  { titulo: "Textos favoritos", texto: "Guarde orações, trechos do Catecismo e vidas de santos para voltar quando quiser." },
  { titulo: "Anotações", texto: "Escreva o que tocou você na leitura: um diário espiritual que fica na sua conta." },
  { titulo: "Preparar a confissão", texto: "Um exame de consciência guiado. Ele nunca é salvo nem enviado." },
  { titulo: "Ranking", texto: "Caminhe junto com outros católicos. Aparecer no ranking é escolha sua." },
];

function Medalha() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" className="shrink-0">
      <path d="M11 2h5l2 8-4 2zM25 2h-5l-2 8 4 2z" className="fill-accent" />
      <circle cx="18" cy="22" r="11" className="fill-gold" />
      <circle cx="18" cy="22" r="8" fill="none" stroke="white" strokeOpacity=".6" />
      <path d="m18 16.5 1.7 3.5 3.8.5-2.8 2.6.7 3.8-3.4-1.8-3.4 1.8.7-3.8-2.8-2.6 3.8-.5z" fill="white" />
    </svg>
  );
}

export default function JornadaPage() {
  if (!LOGIN_ENABLED) notFound();

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <section className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
        <div className="jornada-surge">
          <p className="kicker">Sua jornada de fé</p>
          <h1 className="mt-3 font-display text-title-lg text-ink sm:text-title-xl">
            Um santo padroeiro que se enche de luz com a sua fé
          </h1>
          <p className="mt-5 max-w-measure text-body text-ink-muted">
            Crie sua conta grátis e transforme oração e estudo numa jornada: ganhe pontos todo dia, suba do
            Peregrino Iniciante ao Santo Glorificado, colecione conquistas e veja o seu padroeiro brilhar a cada etapa.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <CriarConta />
            <a href="#como-funciona" className="btn btn-secondary">
              Ver como funciona
            </a>
          </div>
          <p className="mt-3 text-meta text-ink-muted">
            Entre com o Google em um clique. Não guardamos seu e-mail nem sua foto.
          </p>
        </div>
        <SantoQueAcende />
      </section>

      <section id="como-funciona" aria-labelledby="como-titulo" className="mt-20 scroll-mt-24">
        <h2 id="como-titulo" className="font-display text-title-md text-ink">
          Como funciona
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {PASSOS.map((passo, i) => (
            <li
              key={passo.titulo}
              className="jornada-surge rounded-panel border border-border bg-surface p-5"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-display text-title-sm text-white">
                {i + 1}
              </span>
              <h3 className="mt-3 font-semibold text-ink">{passo.titulo}</h3>
              <p className="mt-1 text-meta text-ink-muted">{passo.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="titulos-titulo" className="mt-20">
        <h2 id="titulos-titulo" className="font-display text-title-md text-ink">
          Do Peregrino ao Santo Glorificado
        </h2>
        <p className="mt-2 max-w-measure text-meta text-ink-muted">Cada título é uma etapa do caminho. Quantos você vai alcançar?</p>
        <ol className="mt-6 flex flex-wrap gap-2">
          {TODOS_OS_TITULOS.map(({ nivel, titulo }, i) => (
            <li
              key={titulo}
              className="jornada-surge flex items-center gap-2 rounded-full border border-border bg-surface py-1.5 pl-1.5 pr-3.5"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-accent-soft px-1.5 text-label font-semibold text-accent [letter-spacing:0]">
                {nivel}
              </span>
              <span className="text-meta text-ink">{titulo}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="sequencia-titulo" className="mt-20 rounded-panel border border-border bg-surface p-6 sm:p-8">
        <h2 id="sequencia-titulo" className="font-display text-title-md text-ink">
          Não quebre a corrente
        </h2>
        <p className="mt-2 max-w-measure text-meta text-ink-muted">
          Volte todo dia para rezar ou estudar. Quanto mais dias seguidos, mais cada ponto vale.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {MULTIPLICADORES.map(({ dias, vezes }) => (
            <li key={dias} className="rounded-panel border border-border bg-canvas p-5 text-center">
              <p className="font-display text-title-xl text-accent">{vezes}</p>
              <p className="mt-1 text-meta text-ink">a partir de {dias} dias seguidos</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="conquistas-titulo" className="mt-20">
        <h2 id="conquistas-titulo" className="font-display text-title-md text-ink">
          {CONQUISTAS.length} conquistas para colecionar
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CONQUISTAS.map((conquista, i) => (
            <li
              key={conquista.id}
              className="jornada-surge flex items-center gap-3 rounded-panel border border-border bg-surface p-4"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <Medalha />
              <div>
                <p className="font-semibold text-ink">{conquista.nome}</p>
                <p className="text-meta text-ink-muted">{conquista.descricao}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ferramentas-titulo" className="mt-20">
        <h2 id="ferramentas-titulo" className="font-display text-title-md text-ink">
          E tudo o que você precisa para crescer
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {FERRAMENTAS.map((ferramenta) => (
            <li key={ferramenta.titulo} className="border-l-2 border-gold pl-4">
              <h3 className="font-semibold text-ink">{ferramenta.titulo}</h3>
              <p className="mt-1 text-meta text-ink-muted">{ferramenta.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 rounded-panel bg-accent px-6 py-10 text-center text-white sm:px-10">
        <h2 className="font-display text-title-md text-white sm:text-title-lg">Comece hoje. Seu primeiro ponto está a uma oração de distância.</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <CriarConta className="btn bg-white text-accent hover:bg-accent-soft">Criar minha conta grátis</CriarConta>
          <Link href="/ranking" className="btn border border-white/60 text-white hover:bg-white/10">
            Ver o ranking
          </Link>
        </div>
      </section>
    </div>
  );
}
