import { ListSkeleton } from "@/components/ListSkeleton";

/**
 * Esqueleto da home enquanto a API responde (categorias + amostra).
 *
 * Não replica a home inteira pixel a pixel (o herói tem banners de liturgia
 * e vela que dependem de dado que ainda não chegou) — só o suficiente pra
 * a primeira tela não ficar em branco: um bloco de título e a mesma
 * geometria de linha que `EntryList` usa embaixo.
 */
export default function Loading() {
  return (
    <div className="mx-auto max-w-shell px-4 py-12 sm:px-6 md:py-16">
      <div aria-hidden="true" className="max-w-measure animate-pulse space-y-4">
        <div className="h-3 w-40 bg-parchment-deep" />
        <div className="h-9 w-full bg-parchment-deep" />
        <div className="h-9 w-2/3 bg-parchment-deep" />
      </div>
      <div className="mt-10">
        <ListSkeleton rows={4} />
      </div>
    </div>
  );
}
