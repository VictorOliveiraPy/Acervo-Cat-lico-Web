import type { Metadata } from "next";
import Link from "next/link";

import { TrilhaDesenho } from "@/components/caminho/TrilhaDesenho";
import { CriarConta } from "@/components/jornada/CriarConta";
import { ApiError } from "@/lib/api";
import { LOGIN_ENABLED } from "@/lib/auth-public";
import type { Caminho } from "@/lib/caminho";
import { safeJsonLd } from "@/lib/jsonLd";
import { fetchCaminho } from "@/lib/services/perfilService";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const TITULO = "Caminho da Santidade: as três vias da vida espiritual, casa por casa";
const DESCRICAO =
  "Uma trilha de 36 casas pelas vias purgativa, iluminativa e unitiva: reze, estude e receba os sacramentos, um passo por vez, com o seu santo padroeiro. Grátis no Compêndio Católico.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: "/caminho-da-santidade" },
  openGraph: { title: TITULO, description: DESCRICAO, url: `${SITE_URL}/caminho-da-santidade`, type: "article" },
};

// A trilha muda pouco: a página é regenerada a cada hora.
export const revalidate = 3600;

const VIAS_EXPLICADAS = [
  {
    nome: "Via Purgativa",
    texto:
      "É o tempo dos principiantes. A alma se volta para Deus, reconhece o próprio pecado e começa a combatê-lo pela oração, pela penitência e pelos sacramentos, sobretudo a Confissão. Aqui se aprende a rezar todo dia e a fugir das ocasiões de pecado.",
  },
  {
    nome: "Via Iluminativa",
    texto:
      "É o tempo dos que progridem. Purificada, a alma cresce nas virtudes: a Palavra de Deus e a Eucaristia iluminam a vida, a oração fica mais simples e a caridade passa a guiar as escolhas de cada dia.",
  },
  {
    nome: "Via Unitiva",
    texto:
      "É o tempo dos perfeitos. A alma vive habitualmente unida a Deus, e o amor se torna o motor de tudo: trabalho, família, sofrimento e alegria viram oferta. É a vida dos santos, a que todos somos chamados.",
  },
];

const PERGUNTAS = [
  {
    pergunta: "O que é o Caminho da Santidade?",
    resposta:
      "É uma trilha de 36 casas no Compêndio Católico, dividida nas três vias da vida espiritual. Cada casa pede uma tarefa concreta, como rezar o Terço, ir à Missa, confessar-se ou fazer uma lição da Academia da Fé. Feita a tarefa, você avança uma casa.",
  },
  {
    pergunta: "Quanto custa?",
    resposta: "Nada. Basta criar a conta com o Google. Não guardamos seu e-mail nem sua foto.",
  },
  {
    pergunta: "Dá para fazer tudo num dia só?",
    resposta:
      "Não, e é de propósito. Cada prática move uma casa por dia: a santidade se constrói com constância, não com pressa. Lições da Academia podem ser feitas no seu ritmo.",
  },
  {
    pergunta: "O que são as três vias?",
    resposta:
      "São as etapas clássicas da vida interior descritas pela tradição da Igreja: a purgativa (conversão), a iluminativa (crescimento nas virtudes) e a unitiva (união com Deus). Elas se misturam na vida real: todos precisam sempre de conversão.",
  },
];

async function carregar(): Promise<Caminho | null> {
  try {
    return await fetchCaminho();
  } catch (error: unknown) {
    if (error instanceof ApiError) return null;
    throw error;
  }
}

export default async function CaminhoDaSantidadePage() {
  const caminho = await carregar();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: TITULO,
        description: DESCRICAO,
        url: `${SITE_URL}/caminho-da-santidade`,
        inLanguage: "pt-BR",
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      },
      {
        "@type": "FAQPage",
        mainEntity: PERGUNTAS.map(({ pergunta, resposta }) => ({
          "@type": "Question",
          name: pergunta,
          acceptedAnswer: { "@type": "Answer", text: resposta },
        })),
      },
    ],
  };

  const convite = LOGIN_ENABLED ? (
    <div className="rounded-panel border border-border bg-surface p-4 text-center shadow-lg">
      <p className="text-label font-semibold uppercase text-accent">Comece aqui</p>
      <p className="mt-1 font-display text-title-sm text-ink">Seu primeiro passo</p>
      <CriarConta destino="/perfil/caminho" className="btn btn-primary mt-3 w-full">
        Começar o Caminho grátis
      </CriarConta>
    </div>
  ) : null;

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <header className="jornada-surge mx-auto max-w-3xl text-center">
        <p className="kicker">Vida espiritual</p>
        <h1 className="mt-3 font-display text-title-lg text-ink sm:text-title-xl">Caminho da Santidade</h1>
        <p className="mx-auto mt-4 max-w-measure text-body text-ink-muted">
          Uma trilha de 36 casas pelas três vias da vida espiritual. Reze, estude e receba os sacramentos: cada tarefa
          feita é um passo, e o seu santo padroeiro caminha com você até o fim.
        </p>
        {LOGIN_ENABLED ? (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <CriarConta destino="/perfil/caminho">Começar o Caminho grátis</CriarConta>
            <a href="/perfil/caminho" className="btn btn-secondary">
              Já tenho conta: continuar
            </a>
          </div>
        ) : null}
      </header>

      <section aria-labelledby="chamado" className="mx-auto mt-16 max-w-measure">
        <h2 id="chamado" className="font-display text-title-md text-ink">
          Todos são chamados à santidade
        </h2>
        <p className="mt-3 text-body text-ink">
          A santidade não é para poucos. O Concílio Vaticano II ensina que todos os fiéis, de qualquer estado ou
          condição, são chamados à plenitude da vida cristã e à perfeição da caridade (Lumen Gentium, 40; Catecismo, §
          2013). E o Catecismo lembra o preço do caminho: ele passa pela cruz, e não há santidade sem renúncia e sem
          combate espiritual (§ 2015).
        </p>
        <p className="mt-3 text-body text-ink">
          Para ajudar nesse caminho, a tradição da Igreja descreve a vida interior em três vias, que autores como São
          Boaventura e Garrigou-Lagrange explicaram em detalhe. O Caminho da Santidade do {SITE_NAME} segue essas três
          vias com tarefas simples, que cabem no seu dia.
        </p>
      </section>

      <section aria-labelledby="vias" className="mx-auto mt-14 max-w-4xl">
        <h2 id="vias" className="text-center font-display text-title-md text-ink">
          As três vias da vida espiritual
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {VIAS_EXPLICADAS.map((via, i) => (
            <li key={via.nome} className="jornada-surge rounded-panel border border-border bg-surface p-5" style={{ animationDelay: `${i * 120}ms` }}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-display text-title-sm text-white">
                {i + 1}
              </span>
              <h3 className="mt-3 font-semibold text-ink">{via.nome}</h3>
              <p className="mt-1 text-meta text-ink-muted">{via.texto}</p>
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-4 max-w-measure text-center text-meta text-ink-muted">
          As vias não são degraus estanques: na vida real elas se misturam, e todos precisam sempre de conversão.
        </p>
      </section>

      <section aria-labelledby="como" className="mx-auto mt-14 max-w-measure">
        <h2 id="como" className="font-display text-title-md text-ink">
          Como funciona a trilha
        </h2>
        <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-body text-ink">
          <li>Cada casa pede uma tarefa: uma prática do dia (Terço, Missa, Confissão, Adoração, jejum, caridade...) ou uma lição da Academia da Fé.</li>
          <li>Feita a tarefa, você avança uma casa. A mesma prática move só uma casa por dia: constância vale mais que pressa.</li>
          <li>As práticas também dão pontos, sobem o seu nível e acendem a luz do seu padroeiro em 3D.</li>
          <li>Cada via concluída é uma conquista. No fim, a conquista da Santidade.</li>
        </ul>
      </section>

      <section aria-labelledby="trilha" className="mt-14">
        <h2 id="trilha" className="text-center font-display text-title-md text-ink">
          As 36 casas do caminho
        </h2>
        {caminho ? (
          <div className="mt-6">
            <TrilhaDesenho caminho={caminho} concluidas={0} abaixo={convite} />
          </div>
        ) : (
          <p className="mt-4 text-center text-meta text-ink-muted">A trilha não carregou agora. Tente de novo em instantes.</p>
        )}
      </section>

      <section aria-labelledby="perguntas" className="mx-auto mt-16 max-w-measure">
        <h2 id="perguntas" className="font-display text-title-md text-ink">
          Perguntas frequentes
        </h2>
        <dl className="mt-4 flex flex-col gap-4">
          {PERGUNTAS.map(({ pergunta, resposta }) => (
            <div key={pergunta} className="border-l-2 border-gold pl-4">
              <dt className="font-semibold text-ink">{pergunta}</dt>
              <dd className="mt-1 text-meta text-ink-muted">{resposta}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-16 rounded-panel bg-accent px-6 py-10 text-center text-white sm:px-10">
        <h2 className="font-display text-title-md text-white sm:text-title-lg">A primeira casa está a uma oração de distância.</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {LOGIN_ENABLED ? (
            <CriarConta destino="/perfil/caminho" className="btn bg-white text-accent hover:bg-accent-soft">
              Começar o Caminho grátis
            </CriarConta>
          ) : null}
          <Link href="/academia" className="btn border border-white/60 text-white hover:bg-white/10">
            Conhecer a Academia da Fé
          </Link>
        </div>
      </section>
    </div>
  );
}
