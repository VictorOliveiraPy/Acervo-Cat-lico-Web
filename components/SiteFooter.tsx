import Link from "next/link";

import { CATEGORY_LABELS, categoryPath } from "@/lib/categories";
import { CATEGORY_GROUPS } from "@/lib/categoryGroups";
import { ApiError } from "@/lib/api";
import { HIMETRICA_SHARE_URL } from "@/lib/himetricaShareUrl";
import { fetchHealth } from "@/lib/services/acervoService";
import { INSTAGRAM_URL, SANTO_GUARDIAO_URL } from "@/lib/site";
import type { HealthStatus } from "@/lib/schemas";

/**
 * Lê o tamanho do acervo para o rodapé.
 *
 * O rodapé aparece em toda página, então uma API fora do ar não pode derrubar
 * a leitura do que já foi renderizado: aqui a falha vira ausência de número,
 * e não uma exceção. Só falha esperada de API é engolida — qualquer outro erro
 * continua subindo.
 */
async function loadHealth(): Promise<HealthStatus | null> {
  try {
    return await fetchHealth();
  } catch (error: unknown) {
    if (error instanceof ApiError) return null;
    throw error;
  }
}

export async function SiteFooter() {
  const health = await loadHealth();

  return (
    <footer className="mt-section border-t-2 border-gold bg-parchment-deep">
      <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-measure">
            <h2 className="font-display text-title-sm text-bordeaux">
              Sobre este acervo
            </h2>
            <p className="mt-3 text-meta text-ink-muted">
              Conteúdo de consulta reunido a partir de fontes eclesiásticas
              citadas em cada entrada. É um conjunto inicial de exemplos, em
              revisão editorial — não substitui os documentos oficiais da Igreja.
            </p>
            {health ? (
              <p className="mt-4 text-meta text-ink">
                {health.total_entradas} entradas publicadas em{" "}
                {health.categorias} categorias.
              </p>
            ) : (
              <p className="mt-4 text-meta text-state-notice">
                Não foi possível confirmar o tamanho do acervo agora; o conteúdo
                em cache continua disponível.
              </p>
            )}
          </div>

          <div className="max-w-measure md:w-72">
            <h2 className="kicker">Plataforma irmã</h2>
            <p className="mt-3 text-meta text-ink-muted">
              Quer viver a fé em forma de jogo? No{" "}
              <a
                href={SANTO_GUARDIAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-bordeaux underline-offset-4 hover:underline"
              >
                Santo Guardião
              </a>{" "}
              você escolhe um santo de devoção e cumpre desafios e missões
              para crescer na fé.
            </p>
          </div>
        </div>

        {/* As 45 categorias soltas em duas colunas viraram cansativas de
            escanear — o mesmo agrupamento por assunto usado no painel
            "Todas as categorias" do header serve aqui de índice completo,
            sem precisar de clique nenhum (o rodapé já é a área "quero ver
            tudo"). */}
        <nav aria-label="Categorias, por assunto" className="mt-10 border-t border-rule-faint pt-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="kicker">{group.title}</h3>
                <ul className="mt-3 flex flex-col gap-2">
                  {group.slugs.map((slug) => (
                    <li key={slug}>
                      <Link
                        href={categoryPath(slug)}
                        className="text-meta text-ink-muted underline-offset-4 hover:text-bordeaux hover:underline"
                      >
                        {CATEGORY_LABELS[slug].nav}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-rule-faint pt-4 text-meta text-ink-muted">
          <Link
            href="/liturgia-diaria"
            className="underline-offset-4 hover:text-bordeaux hover:underline"
          >
            Liturgia diária →
          </Link>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:text-bordeaux hover:underline"
          >
            Instagram →
          </a>
          {HIMETRICA_SHARE_URL ? (
            <a
              href={HIMETRICA_SHARE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:text-bordeaux hover:underline"
            >
              Estatísticas do site →
            </a>
          ) : null}
        </div>

        {/* Lema em latim clássico (V no lugar de U, grafia de inscrição
            romana) — assinatura do site, não citação de documento, por isso
            sem número de página a verificar. Atribuição embaixo evita deixar
            a frase flutuando sem fonte, o que o próprio catálogo cobra de
            qualquer citação. */}
        <div className="mt-8 border-t border-rule-faint pt-6 text-center">
          {/* `text-gold` sobre `parchment-deep` (fundo deste rodapé) mede
              ~2,3:1 — bem abaixo do mínimo de 4,5:1. `text-bordeaux` (mesma
              cor já usada nos títulos deste rodapé) passa em ~8,9:1. */}
          <p className="font-display text-label uppercase tracking-[0.2em] text-bordeaux">
            Fides Quaerens Intellectvm
          </p>
          <p className="mt-1 text-meta text-ink-muted">
            Santo Anselmo de Cantuária, Proslogion, séc. XI
          </p>
        </div>
      </div>
    </footer>
  );
}
