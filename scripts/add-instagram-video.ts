#!/usr/bin/env node
/**
 * Adiciona vídeos do perfil ao feed de `/videos`: baixa a capa para
 * `public/videos/` e põe legenda e formato no topo de `lib/instagramVideos.json`.
 *
 *   node scripts/add-instagram-video.ts URL [URL...]   (do mais novo para o mais antigo)
 *
 * shortcut: usa o oEmbed público do Instagram, que não é API documentada; se parar
 * de responder, trocar pela Graph API com token do perfil.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const PROFILE = "compendiocatolico";
const DATA_FILE = "lib/instagramVideos.json";

export function shortcodeFromUrl(url: string): string | null {
  return url.match(/^https:\/\/(?:www\.)?instagram\.com\/(?:[\w.]+\/)?(?:p|reel|reels)\/([\w-]+)/)?.[1] ?? null;
}

export function firstParagraph(caption: string): string {
  return caption.trim().split(/\n\s*\n/)[0] ?? "";
}

async function fetchVideo(url: string) {
  const id = shortcodeFromUrl(url);
  if (!id) throw new Error(`não é um post do Instagram: ${url}`);

  const postUrl = `https://www.instagram.com/p/${id}/`;
  const response = await fetch(`https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(postUrl)}`);
  if (!response.ok) throw new Error(`oEmbed respondeu ${response.status} para ${url}`);
  const post = await response.json();
  if (post.author_name !== PROFILE) throw new Error(`${url} é de @${post.author_name}, não de @${PROFILE}`);

  const cover = await fetch(post.thumbnail_url);
  if (!cover.ok) throw new Error(`capa respondeu ${cover.status} para ${url}`);
  writeFileSync(`public/videos/${id}.jpg`, Buffer.from(await cover.arrayBuffer()));

  return {
    id,
    caption: firstParagraph(post.title ?? "") || "Vídeo do Compêndio Católico",
    width: post.thumbnail_width,
    height: post.thumbnail_height,
  };
}

async function main(urls: string[]) {
  if (urls.length === 0) throw new Error("uso: node scripts/add-instagram-video.ts URL [URL...]");

  const current: { id: string }[] = JSON.parse(readFileSync(DATA_FILE, "utf8"));
  const added = [];
  for (const url of urls) {
    const video = await fetchVideo(url);
    if (current.some(({ id }) => id === video.id)) {
      console.log(`já estava no feed: ${video.id}`);
    } else {
      added.push(video);
      console.log(`adicionado: ${video.id}`);
    }
  }
  writeFileSync(DATA_FILE, `${JSON.stringify([...added, ...current], null, 2)}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
