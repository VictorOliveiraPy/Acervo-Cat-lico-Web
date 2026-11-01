import type { Metadata } from "next";

import { PageHeader } from "@/components/Editorial";
import { InstagramPost } from "@/components/InstagramPost";
import { INSTAGRAM_VIDEOS } from "@/lib/instagramVideos";
import { INSTAGRAM_URL } from "@/lib/site";

const DESCRIPTION =
  "Santos, Catecismo e história da Igreja em vídeos curtos, os mesmos que publicamos no Instagram do Compêndio Católico.";

export const metadata: Metadata = {
  title: "Vídeos",
  description: DESCRIPTION,
  alternates: { canonical: "/videos" },
};

function FollowLink() {
  return (
    <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
      Seguir no Instagram <span aria-hidden="true">→</span>
    </a>
  );
}

export default function VideosPage() {
  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <PageHeader kicker="Instagram" title="Vídeos" description={DESCRIPTION} />
      <div className="mt-6">
        <FollowLink />
      </div>
      <div className="mx-auto mt-10 flex max-w-[470px] flex-col gap-8">
        {INSTAGRAM_VIDEOS.map((video) => (
          <InstagramPost key={video.id} video={video} />
        ))}
        <div className="text-center">
          <p className="mb-4 text-body text-ink-muted">Tem mais vídeos no nosso perfil.</p>
          <FollowLink />
        </div>
      </div>
    </div>
  );
}
