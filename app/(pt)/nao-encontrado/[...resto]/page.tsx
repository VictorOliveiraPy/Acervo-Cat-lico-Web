import { notFound } from "next/navigation";

/**
 * Destino do `middleware.ts` para URL que não existe. Com um layout raiz por idioma
 * não há `not-found` global: passar por esta rota garante a página 404 do site.
 */
export default function NaoEncontrado() {
  notFound();
}
