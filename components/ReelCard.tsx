"use client";

import Image from "next/image";
import { useState } from "react";

import type { Reel } from "@/lib/reels";

/** Um vídeo da grade de `/reels`. O MP4 só começa a baixar depois do clique. */
export function ReelCard({ reel }: { reel: Reel }) {
  const { titulo: title, legenda: caption, largura: width, altura: height, capa_url: cover, video_url: video } = reel;
  const [playing, setPlaying] = useState(false);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-edge border border-border bg-raised">
      {playing ? (
        <video
          src={video}
          poster={cover}
          width={width}
          height={height}
          controls
          autoPlay
          playsInline
          className="block h-auto w-full bg-black"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Assistir ao vídeo: ${title}`}
          className="group relative block w-full"
        >
          <Image
            src={cover}
            alt=""
            width={width}
            height={height}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
            className="block h-auto w-full"
          />
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-colors group-hover:bg-accent"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}

      <div className="flex flex-col gap-1 px-3 py-3">
        <h2 className="text-meta font-bold text-ink">{title}</h2>
        <p className="line-clamp-3 text-meta text-ink-muted">{caption}</p>
      </div>
    </article>
  );
}
