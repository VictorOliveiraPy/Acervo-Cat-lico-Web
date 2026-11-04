import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/Editorial";
import { INSTAGRAM_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre e como escrevemos",
  description:
    "Missão, fontes eclesiásticas, processo de revisão e contato do Compêndio Católico — acervo de consulta sobre santos, orações, catecismo, papas, concílios e liturgia.",
  alternates: { canonical: "/sobre" },
  robots: { index: true, follow: true },
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <PageHeader
        kicker="Sobre"
        title="Sobre e como escrevemos"
        description="O Compêndio Católico é um acervo de consulta sobre a fé católica, construído a partir de fontes eclesiásticas primárias e organizado para ser lido por qualquer pessoa."
      />

      <div className="mt-10 flex max-w-measure flex-col gap-12">

        <section aria-labelledby="missao">
          <h2 id="missao" className="font-display text-title-md text-ink">
            Missão
          </h2>
          <div className="mt-4 flex flex-col gap-4 text-body text-ink-muted">
            <p>
              O Compêndio Católico reúne explicações claras sobre santos, papas, concílios,
              sacramentos, orações, doutores da Igreja, milagres eucarísticos, catecismo e
              liturgia diária — tudo em um único lugar, de acesso livre e gratuito.
            </p>
            <p>
              Não somos um canal de opinião nem de teologia acadêmica. Nosso objetivo é ser
              uma referência de consulta confiável: o tipo de página que alguém abre quando
              quer entender um termo da Missa, conhecer a história de um santo ou ler a
              oração certa para um momento específico.
            </p>
            <p>
              Todo o conteúdo é escrito a partir de documentos oficiais da Igreja Católica —
              citados individualmente em cada entrada — e está em revisão editorial contínua.
              Nenhum verbete substitui os documentos originais; os links para as fontes estão
              sempre presentes.
            </p>
          </div>
        </section>

        <section aria-labelledby="fontes">
          <h2 id="fontes" className="font-display text-title-md text-ink">
            Fontes usadas
          </h2>
          <div className="mt-4 flex flex-col gap-4 text-body text-ink-muted">
            <p>
              Cada entrada do acervo cita as fontes usadas na sua escrita. As principais
              referências são:
            </p>
            <ul className="flex list-disc flex-col gap-2 pl-6">
              <li>
                <strong className="font-semibold text-ink">Catecismo da Igreja Católica</strong>{" "}
                (1992) — disponível em{" "}
                <a
                  href="https://www.vatican.va/archive/cathechism_po/index_po.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline underline-offset-4 hover:text-accent-hover"
                >
                  vatican.va
                </a>
              </li>
              <li>
                <strong className="font-semibold text-ink">Compêndio do Catecismo da Igreja Católica</strong>{" "}
                (2005) — síntese em formato de perguntas e respostas
              </li>
              <li>
                <strong className="font-semibold text-ink">Documentos do Concílio Vaticano II</strong>{" "}
                (1962–1965) — Lumen Gentium, Dei Verbum, Gaudium et Spes e outros
              </li>
              <li>
                <strong className="font-semibold text-ink">Encíclicas e documentos papais</strong>{" "}
                — publicados em{" "}
                <a
                  href="https://www.vatican.va"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline underline-offset-4 hover:text-accent-hover"
                >
                  vatican.va
                </a>
              </li>
              <li>
                <strong className="font-semibold text-ink">Martirológio Romano</strong> e
                fontes hagiográficas para os santos
              </li>
              <li>
                <strong className="font-semibold text-ink">Missal Romano</strong> e
                documentos litúrgicos para orações e sacramentos
              </li>
              <li>
                <strong className="font-semibold text-ink">Atos dos concílios</strong>{" "}
                (Niceia, Trento, Vaticano I e outros) para as entradas históricas
              </li>
            </ul>
            <p>
              Quando uma entrada usa fontes secundárias — como comentários de teólogos,
              enciclopédias católicas ou biografias —, elas são indicadas separadamente das
              fontes primárias.
            </p>
          </div>
        </section>

        <section aria-labelledby="revisao">
          <h2 id="revisao" className="font-display text-title-md text-ink">
            Processo de revisão
          </h2>
          <div className="mt-4 flex flex-col gap-4 text-body text-ink-muted">
            <p>
              O acervo está em construção e revisão contínua. Nosso processo atual:
            </p>
            <ol className="flex list-decimal flex-col gap-3 pl-6">
              <li>
                <strong className="font-semibold text-ink">Escrita a partir da fonte primária.</strong>{" "}
                Cada entrada é redigida consultando diretamente os documentos oficiais citados,
                não a partir de resumos ou paráfrases de terceiros.
              </li>
              <li>
                <strong className="font-semibold text-ink">Citação da fonte em cada entrada.</strong>{" "}
                Ao final de cada verbete constam as referências usadas, com número de parágrafo
                ou artigo quando aplicável.
              </li>
              <li>
                <strong className="font-semibold text-ink">Atualização com data visível.</strong>{" "}
                Toda entrada exibe a data da última atualização. Revisões editoriais são
                registradas como atualização.
              </li>
              <li>
                <strong className="font-semibold text-ink">Revisão por especialista em andamento.</strong>{" "}
                Textos sobre sacramentos, liturgia e doutrina moral estão sendo revisados por
                um sacerdote. Entradas ainda não revisadas são indicadas como &ldquo;em revisão
                editorial&rdquo;.
              </li>
            </ol>
            <p>
              Se você encontrar um erro doutrinário, uma imprecisão histórica ou uma citação
              incorreta, use o canal de contato abaixo — toda correção apontada é analisada
              e respondida.
            </p>
          </div>
        </section>

        <section aria-labelledby="contato">
          <h2 id="contato" className="font-display text-title-md text-ink">
            Contato
          </h2>
          <div className="mt-4 flex flex-col gap-4 text-body text-ink-muted">
            <p>
              Para reportar erros doutrinários, sugerir conteúdo ou tirar dúvidas sobre o
              acervo, entre em contato pelo Instagram:
            </p>
            <p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary inline-flex"
              >
                Falar pelo Instagram →
              </a>
            </p>
            <p>
              Respondemos mensagens diretas no Instagram. Para erros no conteúdo, inclua
              o nome da entrada e o trecho que você acredita estar incorreto, com a fonte
              que você consultou.
            </p>
            <p className="text-meta">
              Este acervo não oferece acompanhamento espiritual, aconselhamento religioso nem
              substituição de orientação pastoral. Para isso, procure um sacerdote ou sua
              paróquia local.
            </p>
          </div>
        </section>

        <section aria-labelledby="acervo-aberto">
          <h2 id="acervo-aberto" className="font-display text-title-md text-ink">
            Acervo aberto
          </h2>
          <div className="mt-4 flex flex-col gap-4 text-body text-ink-muted">
            <p>
              Todo o conteúdo do Compêndio Católico é de acesso livre, sem cadastro e sem
              pagamento. A{" "}
              <Link
                href="/academia"
                className="text-accent underline underline-offset-4 hover:text-accent-hover"
              >
                Academia da Fé
              </Link>{" "}
              (lições de estudo) também é gratuita — a criação de perfil é opcional e serve
              apenas para acompanhar o próprio progresso.
            </p>
            <p>
              O assistente de perguntas (&ldquo;Perguntar ao acervo&rdquo;) responde com base no conteúdo
              publicado no próprio acervo e indica sempre as entradas de onde veio a resposta.
              Não é um serviço de teologia, não inventa respostas e diz quando não encontra
              nada sobre o que foi perguntado.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
