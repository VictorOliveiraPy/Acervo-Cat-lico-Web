import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PerfilView } from "@/components/perfil/PerfilView";
import { ProfileForm } from "@/components/ProfileForm";
import { LESSONS } from "@/lib/academia";
import { currentUser } from "@/lib/auth";
import { LOGIN_ENABLED } from "@/lib/auth-public";
import { CATEGORY_NAV, categoryPath } from "@/lib/categories";
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
  const [favoritos, anotacoes] = await Promise.all([
    listFavorites(user.subject),
    listNotes(user.subject),
  ]);
  const categories = CATEGORY_NAV.map(({ slug, label }) => ({ slug, label: label.nav }));
  const completed = LESSONS.filter(({ slug }) => profile.licoes.includes(slug));
  const preferred = categories.filter(({ slug }) => profile.preferencias.includes(slug));

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <PerfilView
        nome={profile.nome}
        pontos={profile.pontos}
        padroeiroId={profile.padroeiro_id}
        licoesConcluidas={completed.length}
        licoesTotal={LESSONS.length}
        favoritos={favoritos}
        anotacoes={anotacoes}
        licoes={LESSONS.map(({ slug, title }) => ({ slug, title }))}
      />

      {preferred.length > 0 ? (
        <section aria-labelledby="meus-temas" className="mt-12 border-t border-border pt-8">
          <h2 id="meus-temas" className="font-display text-title-md text-ink">
            Meus temas
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {preferred.map(({ slug, label }) => (
              <li key={slug}>
                <Link
                  href={categoryPath(slug)}
                  className="inline-flex rounded-edge border border-border bg-surface px-2.5 py-1 text-meta text-ink-muted transition-colors hover:border-accent hover:text-accent"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="minhas-licoes" className="mt-8">
        <h2 id="minhas-licoes" className="font-display text-title-md text-ink">
          Lições concluídas
        </h2>
        {completed.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-1">
            {completed.map(({ slug, title }) => (
              <li key={slug}>
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

      <section aria-labelledby="preferencias" className="mt-8">
        <h2 id="preferencias" className="font-display text-title-md text-ink">
          Preferências
        </h2>
        <div className="mt-4">
          <ProfileForm
            nome={profile.nome}
            preferencias={profile.preferencias}
            noRanking={profile.no_ranking}
            categories={categories}
          />
        </div>
      </section>

      <p className="mt-8 max-w-measure text-meta text-ink-muted">
        Guardamos só o identificador do seu login, o nome de exibição, o padroeiro, os temas
        escolhidos, as lições concluídas, os textos favoritos e as anotações. O exame de consciência
        nunca é salvo nem enviado. Não guardamos seu e-mail nem sua foto. Ao apagar a conta, tudo isso
        é apagado junto.
      </p>
    </div>
  );
}
