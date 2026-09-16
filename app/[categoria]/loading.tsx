import { ListSkeleton } from "@/components/ListSkeleton";

/** Esqueleto da listagem de uma categoria: banner + linhas no formato de
 * `EntryList`, enquanto a página troca de oferta (paginação) ou categoria. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <div aria-hidden="true" className="h-64 w-full animate-pulse rounded-edge bg-parchment-deep sm:h-80" />
      <div className="mt-10">
        <ListSkeleton rows={6} />
      </div>
    </div>
  );
}
