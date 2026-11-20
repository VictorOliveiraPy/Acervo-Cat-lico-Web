import { isAdmin } from "@/lib/auth";
import { listarReelsAdmin } from "@/lib/services/estudioService";

/**
 * Baixa o MP4 com o nome do vídeo, para postar no Instagram. Passa pelo site porque o
 * navegador ignora o "baixar" em link de outro domínio e só abriria o vídeo.
 */
export async function GET(_request: Request, { params }: { params: { slug: string } }): Promise<Response> {
  if (!(await isAdmin())) return new Response("Não encontrado.", { status: 404 });

  const reel = (await listarReelsAdmin()).find((item) => item.slug === params.slug);
  if (!reel) return new Response("Não encontrado.", { status: 404 });

  const origem = new URL(reel.video_url, "https://compendio-catolico.com");
  const video = await fetch(origem, { cache: "no-store" });
  if (!video.ok || !video.body) return new Response("O vídeo não respondeu.", { status: 502 });

  return new Response(video.body, {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Disposition": `attachment; filename="${reel.slug}.mp4"`,
      ...(video.headers.get("content-length") ? { "Content-Length": video.headers.get("content-length")! } : {}),
    },
  });
}
