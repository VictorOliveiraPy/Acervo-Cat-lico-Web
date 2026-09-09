import type { Metadata } from "next";

import { Breadcrumbs, PageHeader } from "@/components/Editorial";
import { ChatForm } from "@/components/ChatForm";

const TITLE = "Perguntar ao Acervo";
const KICKER = "Chatbot do Compêndio Católico";
const DESCRIPTION =
  "Pergunte algo sobre fé, doutrina ou vida católica. A resposta vem só do que está no próprio acervo, com a fonte sempre citada — sem trecho relevante, o chatbot diz que não encontrou, em vez de arriscar uma resposta inventada.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/perguntar" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/perguntar" },
};

export default function PerguntarPage() {
  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <Breadcrumbs trail={[{ label: "Acervo", href: "/" }, { label: TITLE }]} />

      <PageHeader kicker={KICKER} title={TITLE} description={DESCRIPTION} />

      <div className="mt-10 max-w-2xl">
        <ChatForm />
      </div>
    </div>
  );
}
