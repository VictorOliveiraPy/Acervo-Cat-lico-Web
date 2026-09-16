import { ListSkeleton } from "@/components/ListSkeleton";

/** Esqueleto da busca: a página inteira depende do resultado da API (sem
 * cache — cada termo é uma consulta nova), então é a rota que mais se
 * beneficia de um retorno visual imediato. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <div aria-hidden="true" className="max-w-measure animate-pulse space-y-4">
        <div className="h-3 w-32 bg-parchment-deep" />
        <div className="h-9 w-full bg-parchment-deep" />
      </div>
      <div className="mt-8 max-w-2xl">
        <div aria-hidden="true" className="h-14 w-full animate-pulse bg-parchment-deep" />
      </div>
      <div className="mt-10">
        <ListSkeleton rows={5} />
      </div>
    </div>
  );
}
