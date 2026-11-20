import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { EnviarVideo } from "@/components/painel/EnviarVideo";
import { PainelAbas } from "@/components/painel/PainelAbas";
import { PedidosVideo } from "@/components/painel/PedidosVideo";
import { ReelsAdmin } from "@/components/painel/ReelsAdmin";
import { ApiError } from "@/lib/api";
import { currentEmail, isAdmin } from "@/lib/auth";
import { LOGIN_ENABLED } from "@/lib/auth-public";
import { listarPedidos, listarReelsAdmin, type Pedido } from "@/lib/services/estudioService";
import type { Reel } from "@/lib/reels";

export const metadata: Metadata = {
  title: "Vídeos · Painel",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Estúdio de vídeos: pedir vídeo novo ao gerador (no computador de quem administra),
 * acompanhar, revisar, publicar em /reels, baixar para o Instagram, editar e apagar.
 * Só para os e-mails de `ADMIN_EMAILS`; para os outros, a página não existe.
 */
export default async function VideosPage() {
  if (!LOGIN_ENABLED) notFound();
  if (!(await currentEmail())) redirect("/api/auth/signin?callbackUrl=/painel/videos");
  if (!(await isAdmin())) notFound();

  let pedidos: Pedido[] = [];
  let reels: Reel[] = [];
  let erro = "";
  try {
    [pedidos, reels] = await Promise.all([listarPedidos(), listarReelsAdmin()]);
  } catch (error: unknown) {
    if (!(error instanceof ApiError)) throw error;
    erro = error.message;
  }

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <p className="eyebrow">Painel</p>
      <h1 className="mt-2 font-display text-title-lg text-ink">Estúdio de vídeos</h1>
      <div className="mt-4">
        <PainelAbas atual="/painel/videos" />
      </div>
      {erro ? (
        <p role="alert" className="mt-6 rounded-panel border border-danger p-4 text-meta text-danger">
          {erro}
        </p>
      ) : null}
      <div className="mt-6 flex flex-col gap-8">
        <PedidosVideo pedidos={pedidos} />
        <EnviarVideo />
        <ReelsAdmin reels={reels} />
      </div>
    </div>
  );
}
