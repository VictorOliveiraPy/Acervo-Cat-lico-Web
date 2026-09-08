/**
 * Divisor ornamental — filete dourado, cruz, filete dourado — no lugar da
 * linha reta (`border-t`/`border-b`) nas quebras de página mais importantes.
 *
 * Existe pra dar "cara de missal" nos pontos estruturais do site (fim do
 * herói, fim do corpo de um verbete), sem virar papel de parede: usar só
 * nessas quebras maiores, nunca em todo componente com borda — repetição
 * demais transforma ornamento em ruído (o oposto do que o próprio catálogo
 * cobra de si mesmo ao revisar peça de terceiro).
 *
 * A cruz é o glifo `†` (dagger, U+2020) de propósito: existe em praticamente
 * toda fonte (ao contrário de glifos como ✠/☩, que dependem de suporte do
 * navegador e podem cair pra uma fonte de sistema destoante em EB Garamond).
 */
export function OrnamentalDivider() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center gap-4 py-8">
      <span className="h-px w-full max-w-[120px] flex-1 bg-gold" />
      <span className="font-display text-lg leading-none text-gold">†</span>
      <span className="h-px w-full max-w-[120px] flex-1 bg-gold" />
    </div>
  );
}
