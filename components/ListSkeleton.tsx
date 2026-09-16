/**
 * Esqueleto de carregamento das listagens (`EntryList`).
 *
 * Repete a mesma geometria das linhas reais — miniatura, título, rótulo,
 * resumo — para a página não pular quando o conteúdo chega. Deliberadamente
 * sem animação chamativa: o acervo é texto, e um pulso forte aqui só disputa
 * atenção com o que vai aparecer (`animate-pulse` do Tailwind já é sutil o
 * bastante, sem shimmer nem brilho).
 */
export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div aria-hidden="true" className="flex flex-col animate-pulse">
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 border-t border-rule-faint py-6 sm:flex-row sm:gap-6"
        >
          <div className="h-28 w-full shrink-0 rounded-edge bg-parchment-deep sm:h-24 sm:w-32" />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="h-5 w-2/3 bg-parchment-deep" />
            <div className="h-3 w-24 bg-parchment-deep/70" />
            <div className="space-y-2 pt-1">
              <div className="h-3 w-full max-w-measure bg-parchment-deep/70" />
              <div className="h-3 w-5/6 max-w-measure bg-parchment-deep/70" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
