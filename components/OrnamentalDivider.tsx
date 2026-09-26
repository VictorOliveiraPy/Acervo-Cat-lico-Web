/**
 * Divisor ornamental — filete, cruz, filete — no lugar da linha reta
 * (`border-t`/`border-b`) nas quebras de página mais importantes.
 *
 * Existe pra dar "cara de missal" nos pontos estruturais do site (fim do
 * herói, fim do corpo de um verbete), sem virar papel de parede: usar só
 * nessas quebras maiores, nunca em todo componente com borda — repetição
 * demais transforma ornamento em ruído (o oposto do que o próprio catálogo
 * cobra de si mesmo ao revisar peça de terceiro).
 *
 * Filete e glifo são neutros frios: no design system atual o único matiz é o
 * bordô, reservado a ação e link, então o ornamento não compete por atenção.
 *
 * A cruz é o glifo `†` (dagger, U+2020) de propósito: existe em praticamente
 * toda fonte (ao contrário de glifos como ✠/☩, que dependem de suporte do
 * navegador e podem cair pra uma fonte de sistema destoante em Cormorant
 * Garamond).
 */
export function OrnamentalDivider() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center gap-4 py-8">
      <span className="h-px w-full max-w-[120px] flex-1 bg-border" />
      <span className="font-display text-lg leading-none text-ink-muted">†</span>
      <span className="h-px w-full max-w-[120px] flex-1 bg-border" />
    </div>
  );
}
