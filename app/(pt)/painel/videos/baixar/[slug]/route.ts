import { isAdmin } from "@/lib/auth";
import { listarReelsAdmin } from "@/lib/services/estudioService";

/**
 * Baixa o MP4 (ou, com ?tipo=capa, a imagem de capa) com o nome do vídeo, para postar
 * no Instagram. Passa pelo site porque o navegador ignora o "baixar" em link de outro
 * domínio e só abriria o arquivo.
 */
export async function GET(request: Request, { params }: { params: { slug: string } }): Promise<Response> {
  if (!(await isAdmin())) return new Response("Não encontrado.", { status: 404 });

  const reel = (await listarReelsAdmin()).find((item) => item.slug === params.slug);
  if (!reel) return new Response("Não encontrado.", { status: 404 });

  const capa = new URL(request.url).searchParams.get("tipo") === "capa";
  const endereco = capa ? reel.capa_url : reel.video_url;
  if (!endereco) return new Response("Este vídeo não tem capa.", { status: 404 });

  // O "v" fura o cache da CDN: a capa pode ter sido refeita com o mesmo nome.
  const origem = new URL(endereco, "https://compendio-catolico.com");
  origem.searchParams.set("v", String(Date.now()));
  const arquivo = await fetch(origem, { cache: "no-store" });
  if (!arquivo.ok || !arquivo.body) return new Response("O arquivo não respondeu.", { status: 502 });

  const tamanho = arquivo.headers.get("content-length");
  return new Response(arquivo.body, {
    headers: {
      "Content-Type": capa ? "image/jpeg" : "video/mp4",
      "Content-Disposition": `attachment; filename="${reel.slug}${capa ? "-capa.jpg" : ".mp4"}"`,
      ...(tamanho ? { "Content-Length": tamanho } : {}),
    },
  });
}
