import Link from "next/link";

import { CATEGORY_NAV, categoryPath } from "@/lib/categories";
import { ApiError } from "@/lib/api";
import { fetchHealth } from "@/lib/services/acervoService";
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

          <nav aria-label="Categorias" className="md:w-72">
            <h2 className="kicker">Percorrer</h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2">
              {CATEGORY_NAV.map(({ slug, label }) => (
                <li key={slug}>
                  <Link
                    href={categoryPath(slug)}
                    className="text-meta text-ink-muted underline-offset-4 hover:text-bordeaux hover:underline"
                  >
                    {label.nav}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
