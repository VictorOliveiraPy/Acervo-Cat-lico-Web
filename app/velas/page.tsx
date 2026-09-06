import type { Metadata } from "next";

import { Breadcrumbs, PageHeader, StatusMessage } from "@/components/Editorial";
import { Pagination } from "@/components/Pagination";
import { VelaForm } from "@/components/VelaForm";
import { VelaMural } from "@/components/VelaMural";
import { ApiError, getErrorMessage } from "@/lib/api";
import { computePagination, parseOffset } from "@/lib/pagination";
import { VELAS_PAGE_SIZE, fetchVelas } from "@/lib/services/velasService";
import type { VelaPage } from "@/lib/velasSchemas";

const TITLE = "Acender uma vela";
const DESCRIPTION =
  "Escolha uma vela, escreva seu nome e, se quiser, uma intenção — ela entra para o mural de orações de quem passou por aqui.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/velas" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/velas" },
};

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function VelasPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const offset = parseOffset(searchParams.offset);

  let page: VelaPage | null = null;
  let loadError: ApiError | null = null;
  try {
    page = await fetchVelas({ limit: VELAS_PAGE_SIZE, offset });
  } catch (error: unknown) {
    if (!(error instanceof ApiError)) throw error;
    loadError = error;
  }

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <Breadcrumbs trail={[{ label: "Acervo", href: "/" }, { label: TITLE }]} />

      <PageHeader kicker="Oração" title={TITLE} description={DESCRIPTION} />

      <div className="mt-10">
        <VelaForm />
      </div>

      <section aria-labelledby="mural" className="mt-14">
        <div className="flex items-baseline justify-between gap-4 border-b-2 border-gold pb-2">
          <h2 id="mural" className="font-display text-title-md text-ink">
            Mural de velas
          </h2>
          {page ? <p className="kicker">{page.total} acesas</p> : null}
        </div>

        <div className="mt-8">
          {loadError ? (
            loadError.status === 503 ? (
              <StatusMessage title="O mural está temporariamente indisponível">
                <p>Volte em instantes — o restante do site continua funcionando normalmente.</p>
              </StatusMessage>
            ) : (
              <StatusMessage title="Não foi possível carregar o mural" tone="error">
                <p>{getErrorMessage(loadError)}</p>
              </StatusMessage>
            )
          ) : page ? (
            <>
              <VelaMural velas={page.itens} />
              <div className="mt-10">
                <Pagination
                  basePath="/velas"
                  state={computePagination({
                    total: page.total,
                    limit: page.limit || VELAS_PAGE_SIZE,
                    offset: page.offset,
                  })}
                />
              </div>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}
