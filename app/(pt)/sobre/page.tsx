import type { Metadata } from "next";

import { PageHeader } from "@/components/Editorial";

// TODO(responsável): trocar para `true` quando os textos abaixo estiverem preenchidos.
const TEXTO_PRONTO = false;

const SECTIONS = [
  // TODO(responsável): escrever a missão do Compêndio Católico.
  { id: "missao", title: "Missão", text: "" },
  // TODO(responsável): listar as fontes usadas (ex.: documentos em vatican.va).
  { id: "fontes", title: "Fontes usadas", text: "" },
  // TODO(responsável): descrever como o conteúdo é escrito e revisado.
  { id: "revisao", title: "Processo de revisão", text: "" },
  // TODO(responsável): informar o e-mail ou outro canal de contato.
  { id: "contato", title: "Contato", text: "" },
];

export const metadata: Metadata = {
  title: "Sobre e como escrevemos",
  description: "Missão, fontes e processo de revisão do Compêndio Católico.",
  alternates: { canonical: "/sobre" },
  // Sem o texto, a página não deve ser indexada.
  robots: { index: TEXTO_PRONTO, follow: true },
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <PageHeader kicker="Sobre" title="Sobre e como escrevemos" />
      <div className="mt-8 flex max-w-measure flex-col gap-8">
        {SECTIONS.map(({ id, title, text }) => (
          <section key={id} aria-labelledby={id}>
            <h2 id={id} className="font-display text-title-md text-ink">
              {title}
            </h2>
            <p className="mt-2 text-body text-ink-muted">{text || "Em preparação."}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
