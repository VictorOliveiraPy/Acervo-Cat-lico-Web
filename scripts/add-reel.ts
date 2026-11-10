#!/usr/bin/env node
/**
 * Põe vídeos do estúdio (projeto videos-py) em `/reels`: comprime para 720p, envia
 * ao R2, grava a capa em `public/reels/` e põe título, legenda e tema no topo de
 * `lib/reels.json`. Os temas válidos estão em `REEL_TEMAS` (`lib/reels.ts`).
 *
 *   R2_BUCKET=nome node scripts/add-reel.ts TEMA SLUG [SLUG...]   (do mais novo para o mais antigo)
 *
 * Lê `SLUG.mp4`, `SLUG-capa.jpg` e `SLUG.md` de `ESTUDIO_OUT` (padrão `../videos-py/out`).
 * O envio usa o wrangler (`npx wrangler login` uma vez antes). Sem `R2_BUCKET`, só
 * prepara: o MP4 comprimido fica em `out/reels/` e rodar de novo com o bucket envia
 * sem comprimir outra vez.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const DATA_FILE = "lib/reels.json";
const BUILD_DIR = "out/reels";

/** Título (`# ...`) e primeiro parágrafo da legenda do Instagram do `.md` que o estúdio gera. */
export function parseStudioMd(md: string): { title: string; caption: string } {
  const title = md.match(/^# (.+)$/m)?.[1]?.trim() ?? "";
  const legenda = md.match(/## Legenda para o Instagram\s+```text\n([\s\S]*?)```/)?.[1] ?? "";
  return { title, caption: legenda.trim().split(/\n\s*\n/)[0]?.trim() ?? "" };
}

function run(command: string, args: string[]): string {
  return execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
}

function addReel(studio: string, bucket: string | undefined, tema: string, slug: string) {
  const { title, caption } = parseStudioMd(readFileSync(`${studio}/${slug}.md`, "utf8"));
  if (!title) throw new Error(`${slug}.md não tem título`);

  const video = `${BUILD_DIR}/${slug}.mp4`;
  if (!existsSync(video)) {
    // prettier-ignore
    run("ffmpeg", ["-v", "error", "-y", "-i", `${studio}/${slug}.mp4`, "-vf", "scale='min(720,iw)':-2",
      "-c:v", "libx264", "-crf", "26", "-preset", "medium", "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", video]);
  }
  run("ffmpeg", ["-v", "error", "-y", "-i", `${studio}/${slug}-capa.jpg`, "-vf", "scale=540:-2", "-q:v", "5", `public/reels/${slug}.jpg`]);
  const [width, height] = run("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", video])
    .trim()
    .split(",")
    .map(Number);

  if (bucket) {
    // prettier-ignore
    run("npx", ["--yes", "wrangler@4", "r2", "object", "put", `${bucket}/reels/${slug}.mp4`,
      "--file", video, "--content-type", "video/mp4", "--remote"]);
  }
  return { slug, title, caption, tema, width: width!, height: height! };
}

function main([tema, ...slugs]: string[]) {
  if (!tema || slugs.length === 0) throw new Error("uso: node scripts/add-reel.ts TEMA SLUG [SLUG...]");
  const studio = process.env.ESTUDIO_OUT ?? "../videos-py/out";
  const bucket = process.env.R2_BUCKET;
  if (!bucket) console.log("sem R2_BUCKET: prepara os vídeos, mas não envia");
  mkdirSync(BUILD_DIR, { recursive: true });

  const added = slugs.map((slug) => {
    const reel = addReel(studio, bucket, tema, slug);
    console.log(`${bucket ? "enviado" : "preparado"}: ${slug}`);
    return reel;
  });
  const fresh = new Set(slugs);
  const current: { slug: string }[] = JSON.parse(readFileSync(DATA_FILE, "utf8"));
  writeFileSync(DATA_FILE, `${JSON.stringify([...added, ...current.filter(({ slug }) => !fresh.has(slug))], null, 2)}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
