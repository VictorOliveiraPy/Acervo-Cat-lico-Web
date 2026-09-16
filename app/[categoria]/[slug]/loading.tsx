/** Esqueleto da página de entrada: cabeçalho, foto e parágrafos — a mesma
 * geometria de `app/[categoria]/[slug]/page.tsx`, sem o texto real ainda. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-shell animate-pulse px-4 py-10 sm:px-6" aria-hidden="true">
      <div className="border-b border-rule-faint pb-8">
        <div className="h-3 w-24 bg-parchment-deep" />
        <div className="mt-3 h-9 w-2/3 max-w-measure bg-parchment-deep" />
        <div className="mt-4 h-4 w-full max-w-measure bg-parchment-deep/70" />
      </div>

      <div className="mt-8 h-72 w-full max-w-measure bg-parchment-deep sm:h-96" />

      <div className="mt-12 max-w-measure space-y-3">
        <div className="h-4 w-full bg-parchment-deep/70" />
        <div className="h-4 w-full bg-parchment-deep/70" />
        <div className="h-4 w-5/6 bg-parchment-deep/70" />
        <div className="h-4 w-full bg-parchment-deep/70" />
        <div className="h-4 w-3/4 bg-parchment-deep/70" />
      </div>
    </div>
  );
}
