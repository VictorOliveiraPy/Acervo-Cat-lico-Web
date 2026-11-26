import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { MeuCaminho } from "@/components/caminho/MeuCaminho";
import { currentUser } from "@/lib/auth";
import { LOGIN_ENABLED } from "@/lib/auth-public";
import { fetchCaminho, syncProfile } from "@/lib/services/perfilService";

export const metadata: Metadata = {
  title: "Meu Caminho da Santidade",
  alternates: { canonical: "/perfil/caminho" },
  robots: { index: false, follow: false },
};

export default async function MeuCaminhoPage() {
  if (!LOGIN_ENABLED) notFound();
  const user = await currentUser();
  // Quem não entrou conhece o Caminho pela página pública, e cria a conta de lá.
  if (!user) redirect("/caminho-da-santidade");

  const [profile, caminho] = await Promise.all([syncProfile(user.subject, user.name), fetchCaminho()]);
  if (profile.padroeiro_id === null) redirect("/perfil");

  return (
    <div className="mx-auto max-w-shell px-4 py-8 sm:px-6">
      <p>
        <Link href="/perfil" className="btn-tertiary">
          <span aria-hidden="true">←</span> Meu perfil
        </Link>
      </p>
      <h1 className="mt-4 text-center font-display text-title-lg text-ink">Caminho da Santidade</h1>
      <p className="mx-auto mt-2 max-w-measure text-center text-meta text-ink-muted">
        Uma casa por tarefa: reze, estude, receba os sacramentos. O seu padroeiro caminha com você até o fim.
      </p>
      <div className="mt-8">
        <MeuCaminho
          caminho={caminho}
          progresso={profile.caminho}
          feitasHoje={profile.atividades.filter((a) => a.feita_hoje).map((a) => a.id)}
          licoes={profile.licoes.length}
          padroeiroId={profile.padroeiro_id}
          estagio={profile.nivel.estagio}
        />
      </div>
    </div>
  );
}
