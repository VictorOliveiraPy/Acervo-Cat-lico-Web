import Image from "next/image";

import { PHOTO_OVERLAY } from "@/lib/designTokens";
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
 * do texto, em vez de emoldurar a página inteira.
 *
 * O véu bordô e a barra de crédito vêm de `PHOTO_OVERLAY` (e não de um hex
 * solto): são os mesmos valores que `lib/contrast.test.ts` mede contra a foto
 * mais clara possível, então mudar o véu por aqui não pode escapar do teste
 * de contraste.
 */
export function CategoryBanner({ background, title, description, meta }: CategoryBannerProps) {
  return (
    <div className="relative mx-[calc(50%-50vw)] overflow-hidden border-y border-border">
      <div className="absolute inset-0">
        <Image
          src={background.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={background.objectPosition ? { objectPosition: background.objectPosition } : undefined}
          priority
        />
        <div className="absolute inset-0" style={{ backgroundColor: PHOTO_OVERLAY.categoryVeil }} />
      </div>
      <div className="relative mx-auto max-w-shell px-4 py-16 sm:px-6 md:py-20">
        <p className="kicker text-canvas/80">Categoria</p>
        <h1 className="mt-2 max-w-measure font-display text-title-lg text-canvas md:text-title-xl">
          {title}
        </h1>
        <p className="mt-4 max-w-measure text-lead text-canvas/90">{description}</p>
        <p className="mt-4 text-meta text-canvas/80">{meta}</p>
      </div>
      <p
        className="relative px-4 py-1.5 text-right text-meta text-canvas/70 sm:px-6"
        style={{ backgroundColor: PHOTO_OVERLAY.creditBar }}
      >
        {background.credito}
      </p>
    </div>
  );
}
