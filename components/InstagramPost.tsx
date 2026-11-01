"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { BrandMark } from "@/components/BrandMark";
import {
  INSTAGRAM_ORIGIN,
  instagramEmbedHeight,
  instagramPostUrl,
  type InstagramVideo,
} from "@/lib/instagramVideos";
import { INSTAGRAM_URL } from "@/lib/site";

/**
 * Um vídeo do feed. O player do Instagram só carrega depois do clique: até lá a
 * página não fala com nenhum servidor de terceiros, só mostra a capa local.
 */
export function InstagramPost({ video }: { video: InstagramVideo }) {
  const { id, caption, width, height } = video;
  const [playing, setPlaying] = useState(false);
  const [playerHeight, setPlayerHeight] = useState<number | null>(null);
  const player = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!playing) return;
    function onMessage(event: MessageEvent) {
      if (event.origin !== INSTAGRAM_ORIGIN || event.source !== player.current?.contentWindow) return;
      const measured = instagramEmbedHeight(event.data);
      if (measured) setPlayerHeight(measured);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [playing]);

  return (
    <article className="overflow-hidden rounded-edge border border-border bg-raised">
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-3 text-meta font-bold text-ink hover:text-accent"
      >
        <BrandMark className="h-8 w-8" />
        @compendiocatolico
      </a>

      {playing ? (
        <iframe
          ref={player}
          src={`${instagramPostUrl(id)}embed/`}
          title={`Vídeo no Instagram: ${caption}`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="block w-full border-0"
          style={playerHeight ? { height: playerHeight } : { aspectRatio: `${width} / ${height}` }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Assistir ao vídeo: ${caption}`}
          className="group relative block w-full"
        >
          <Image
            src={`/videos/${id}.jpg`}
            alt=""
            width={width}
            height={height}
            sizes="(max-width: 502px) 100vw, 470px"
            className="block h-auto w-full"
          />
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-colors group-hover:bg-accent"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-8 w-8">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}

      <div className="px-4 py-3">
        <p className="text-body text-ink">{caption}</p>
        <a
          href={instagramPostUrl(id)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-tertiary mt-2"
        >
          Ver no Instagram <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}
