/**
 * Esqueleto de carregamento das listagens.
 *
 * Repete a mesma geometria das linhas reais (coluna de rótulo + título +
 * resumo) para a página não pular quando o conteúdo chega. É deliberadamente
 * sem animação chamativa: o acervo é texto, e um pulso forte aqui só disputa
 * atenção com o que vai aparecer.
 */
export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div aria-hidden="true" className="flex flex-col">
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 border-t border-rule-faint py-6 sm:flex-row sm:gap-8"
        >
          <div className="h-3 w-32 shrink-0 bg-parchment-deep sm:w-44" />
          <div className="w-full space-y-3">
            <div className="h-5 w-2/3 bg-parchment-deep" />
            <div className="h-3 w-full max-w-measure bg-parchment-deep/70" />
            <div className="h-3 w-5/6 max-w-measure bg-parchment-deep/70" />
          </div>
        </div>
      ))}
    </div>
  );
}
