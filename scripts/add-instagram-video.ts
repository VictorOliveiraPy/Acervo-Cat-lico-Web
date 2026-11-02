#!/usr/bin/env node
/**
 * Adiciona vídeos do perfil ao feed de `/reels`: baixa a capa para
 * `public/videos/` e põe legenda e formato no topo de `lib/instagramVideos.json`.
 *
 *   node scripts/add-instagram-video.ts URL [URL...]   (do mais novo para o mais antigo)
 *   INSTAGRAM_TOKEN=... node scripts/add-instagram-video.ts --novos
 *
 * `--novos` pega pela API oficial os vídeos publicados depois do mais novo do feed
 * (é o que o job `.github/workflows/reels.yml` roda).
 *
 * shortcut: com URL, usa o oEmbed público do Instagram, que não é API documentada;
 * se parar de responder, trocar pela API oficial como no `--novos`.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const PROFILE = "compendiocatolico";
const DATA_FILE = "lib/instagramVideos.json";

type Media = { media_type?: string; permalink?: string; thumbnail_url?: string; caption?: string };

export function shortcodeFromUrl(url: string): string | null {
  return url.match(/^https:\/\/(?:www\.)?instagram\.com\/(?:[\w.]+\/)?(?:p|reel|reels)\/([\w-]+)/)?.[1] ?? null;
}

export function firstParagraph(caption: string): string {
  return caption.trim().split(/\n\s*\n/)[0] ?? "";
}

/** Largura e altura lidas do cabeçalho do JPEG (marcador SOF). */
export function jpegSize(bytes: Uint8Array): { width: number; height: number } | null {
  let i = 2;
  while (i + 8 < bytes.length && bytes[i] === 0xff) {
    const marker = bytes[i + 1]!;
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: (bytes[i + 5]! << 8) | bytes[i + 6]!, width: (bytes[i + 7]! << 8) | bytes[i + 8]! };
    }
    i += 2 + ((bytes[i + 2]! << 8) | bytes[i + 3]!);
  }
  return null;
}

/** Vídeos da lista da API (do mais novo para o mais antigo) até o primeiro que o feed já tem. */
export function pickNewVideos(media: Media[], knownIds: Set<string>) {
  const picked = [];
  for (const item of media) {
    const id = item.permalink ? shortcodeFromUrl(item.permalink) : null;
    if (id && knownIds.has(id)) break;
    if (id && item.media_type === "VIDEO" && item.thumbnail_url) {
      picked.push({ id, coverUrl: item.thumbnail_url, caption: item.caption ?? "" });
    }
  }
  return picked;
}

async function saveVideo(id: string, coverUrl: string, caption: string) {
  const cover = await fetch(coverUrl);
  if (!cover.ok) throw new Error(`capa respondeu ${cover.status} para ${id}`);
  const bytes = new Uint8Array(await cover.arrayBuffer());
  const size = jpegSize(bytes);
  if (!size) throw new Error(`a capa de ${id} não é um JPEG`);
  writeFileSync(`public/videos/${id}.jpg`, bytes);

  return { id, caption: firstParagraph(caption) || "Vídeo do Compêndio Católico", ...size };
}

async function fetchVideo(url: string) {
  const id = shortcodeFromUrl(url);
  if (!id) throw new Error(`não é um post do Instagram: ${url}`);

  const postUrl = `https://www.instagram.com/p/${id}/`;
  const response = await fetch(`https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(postUrl)}`);
  if (!response.ok) throw new Error(`oEmbed respondeu ${response.status} para ${url}`);
  const post = await response.json();
  if (post.author_name !== PROFILE) throw new Error(`${url} é de @${post.author_name}, não de @${PROFILE}`);

  return saveVideo(id, post.thumbnail_url, post.title ?? "");
}

async function fetchNewVideos(knownIds: Set<string>) {
  const token = process.env.INSTAGRAM_TOKEN;
  if (!token) throw new Error("--novos precisa de INSTAGRAM_TOKEN");

  const fields = "media_type,permalink,thumbnail_url,caption";
  const response = await fetch(`https://graph.instagram.com/me/media?fields=${fields}&access_token=${encodeURIComponent(token)}`);
  if (!response.ok) throw new Error(`API do Instagram respondeu ${response.status}: ${await response.text()}`);
  const { data } = (await response.json()) as { data: Media[] };

  const videos = [];
  for (const { id, coverUrl, caption } of pickNewVideos(data, knownIds)) {
    videos.push(await saveVideo(id, coverUrl, caption));
  }
  return videos;
}

async function main(args: string[]) {
  if (args.length === 0) {
    throw new Error("uso: node scripts/add-instagram-video.ts URL [URL...] | --novos");
  }

  const current: { id: string }[] = JSON.parse(readFileSync(DATA_FILE, "utf8"));
  const knownIds = new Set(current.map(({ id }) => id));
  const added = [];
  if (args[0] === "--novos") {
    added.push(...(await fetchNewVideos(knownIds)));
  } else {
    for (const url of args) {
      const video = await fetchVideo(url);
      if (knownIds.has(video.id)) {
        console.log(`já estava no feed: ${video.id}`);
      } else {
        added.push(video);
      }
    }
  }
  for (const { id } of added) console.log(`adicionado: ${id}`);
  writeFileSync(DATA_FILE, `${JSON.stringify([...added, ...current], null, 2)}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
