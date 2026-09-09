import Image from "next/image";

import type { CategoryBackground } from "@/lib/categoryBackgrounds";

type CategoryBannerProps = {
  background: CategoryBackground;
  title: string;
  description: string;
  meta: string;
};

/**
 * Banner de foto de fundo para categorias com uma (`CATEGORY_BACKGROUNDS`,
 * hoje só "Papas") — a alternativa ilustrada ao `PageHeader` de sempre.
 *
 * `mx-[calc(50%-50vw)]` é o truque de "sangrar" a foto até a borda da tela
 * de dentro de um pai com `max-w-shell` (a técnica de full-bleed dentro de
 * container centralizado) — sem isso a foto ficaria presa na mesma largura
 * do texto, em vez de emoldurar a página inteira. `text-gold-wash` (não
 * `text-gold`) de propósito: dourado puro sobre foto escura mede abaixo de
 * 4,5:1 de contraste (mesmo problema já corrigido nos cartões de
 * Instagram) — o tom mais claro do dourado passa com folga.
 */
export function CategoryBanner({ background, title, description, meta }: CategoryBannerProps) {
  return (
    <div className="relative mx-[calc(50%-50vw)] overflow-hidden border-y-2 border-gold">
      <div className="absolute inset-0">
        <Image src={background.src} alt="" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-[#4E1620]/70" />
      </div>
      <div className="relative mx-auto max-w-shell px-4 py-16 sm:px-6 md:py-20">
        <p className="kicker text-gold-wash">Categoria</p>
        <h1 className="mt-2 max-w-measure font-display text-title-lg text-parchment md:text-title-xl">
          {title}
        </h1>
        <p className="mt-4 max-w-measure text-lead text-gold-wash">{description}</p>
        <p className="mt-4 text-meta text-parchment/80">{meta}</p>
      </div>
      <p className="relative bg-[#4E1620] px-4 py-1.5 text-right text-meta text-parchment/60 sm:px-6">
        {background.credito}
      </p>
    </div>
  );
}
