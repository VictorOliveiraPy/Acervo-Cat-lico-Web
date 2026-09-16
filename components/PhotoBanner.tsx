import Image from "next/image";

/**
 * Banner promocional com foto de fundo — mesma linguagem visual do mosaico
 * "Do acervo" (`EntryGrid`): foto de ponta a ponta, gradiente escuro atrás
 * do texto (legibilidade em qualquer foto, clara ou escura) e título em
 * branco. Aqui em formato horizontal, com uma chamada (CTA) ao lado do
 * texto em vez de sobreposta — o banner é uma convocação a agir (ler a
 * liturgia, acender uma vela), não um link de entrada como o mosaico.
 *
 * `children` é sempre o elemento de CTA: o chamador decide `Link` (rota
 * interna) ou `<a>` (link externo, como o Santo Guardião) — o banner não
 * precisa saber a diferença.
 */
export function PhotoBanner({
  image,
  imagePosition,
  kicker,
  title,
  description,
  children,
}: {
  image: string;
  /** `object-position` do CSS, ex.: "top", "center 30%". Padrão "center". */
  imagePosition?: string;
  kicker: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-edge border border-gold">
      <Image
        src={image}
        alt=""
        aria-hidden="true"
        fill
        sizes="(min-width: 1024px) 950px, 100vw"
        style={imagePosition ? { objectPosition: imagePosition } : undefined}
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-bordeaux-deep/90 via-bordeaux-deep/70 to-bordeaux-deep/40"
      />

      <div className="relative flex min-h-[220px] flex-col items-start justify-center gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-measure">
          <p className="kicker text-gold-bright">{kicker}</p>
          <h2 className="mt-2 font-display text-title-sm text-parchment-raised">{title}</h2>
          <p className="mt-2 text-meta text-parchment-raised/85">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
