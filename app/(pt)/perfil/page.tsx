import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PatronChoice } from "@/components/perfil/PatronChoice";
import { PerfilView } from "@/components/perfil/PerfilView";
import { ProfileForm } from "@/components/ProfileForm";
import { LESSONS } from "@/lib/academia";
import { currentUser } from "@/lib/auth";
import { LOGIN_ENABLED } from "@/lib/auth-public";
import { listFavorites, listNotes, syncProfile } from "@/lib/services/perfilService";

export const metadata: Metadata = {
  title: "Meu perfil",
  alternates: { canonical: "/perfil" },
  robots: { index: false, follow: false },
};

export default async function PerfilPage() {
  if (!LOGIN_ENABLED) notFound();

  const user = await currentUser();
  if (!user) redirect("/api/auth/signin?callbackUrl=/perfil");

  const profile = await syncProfile(user.subject, user.name);
  if (profile.padroeiro_id === null) {
    return (
      <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
        <PatronChoice nome={profile.nome} />
      </div>
    );
  }
  const [favoritos, anotacoes] = await Promise.all([
    listFavorites(user.subject),
    listNotes(user.subject),
  ]);
  const completed = LESSONS.filter(({ slug }) => profile.licoes.includes(slug));

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <PerfilView
        nome={profile.nome}
        pontos={profile.pontos}
        padroeiroId={profile.padroeiro_id}
        atividades={profile.atividades}
        nivel={profile.nivel}
        sequencia={profile.sequencia}
        licoesConcluidas={completed.length}
        licoesTotal={LESSONS.length}
        favoritos={favoritos}
        anotacoes={anotacoes}
        licoes={LESSONS.map(({ slug, title }) => ({ slug, title }))}
      />

      <section aria-labelledby="minhas-licoes" className="mt-12 border-t border-border pt-8">
        <h2 id="minhas-licoes" className="font-display text-title-md text-ink">
          Lições concluídas
        </h2>
        {completed.length > 0 ? (
          <ul className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {completed.map(({ slug, title }) => (
              <li key={slug} className="flex items-baseline gap-2">
                <span aria-hidden="true" className="text-gold">✓</span>
                <Link href={`/academia/${slug}`} className="text-meta text-accent underline-offset-4 hover:underline">
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-meta text-ink-muted">
            Nenhuma ainda. <Link href="/academia" className="text-accent underline underline-offset-4">Abrir a Academia da Fé</Link>
          </p>
        )}
        <p className="mt-3">
          <Link href="/ranking" className="btn-tertiary">
            Ver o ranking <span aria-hidden="true">→</span>
          </Link>
        </p>
      </section>

      <section aria-labelledby="conta" className="mt-12 border-t border-border pt-8">
        <h2 id="conta" className="font-display text-title-md text-ink">
          Conta
        </h2>
        <div className="mt-4">
          <ProfileForm nome={profile.nome} noRanking={profile.no_ranking} />
        </div>
      </section>

      <p className="mt-8 max-w-measure text-meta text-ink-muted">
        Guardamos só o identificador do seu login, o nome de exibição, o padroeiro, as lições concluídas, as práticas marcadas em cada dia, os textos favoritos e as anotações. O exame de consciência
        nunca é salvo nem enviado. Não guardamos seu e-mail nem sua foto. Ao apagar a conta, tudo isso
        é apagado junto.
      </p>
    </div>
  );
}
