import Script from "next/script";

import { ChatWidget } from "@/components/ChatWidget";
import { NotOnPrivatePages } from "@/components/NotOnPrivatePages";
import { PtOnly } from "@/components/PtOnly";
import { PwaRegister } from "@/components/PwaRegister";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

/** O `<body>` do site, igual nos layouts raiz de cada idioma. */
export function SiteShell({
  skipLabel,
  children,
}: {
  skipLabel: string;
  children: React.ReactNode;
}) {
  return (
    <body className="flex min-h-screen flex-col">
      {/* Aplica o modo leitura salvo (lib/readingSize.ts) antes da
          primeira pintura — sem isso, quem escolheu "A++" veria o texto
          no tamanho normal por um instante a cada carregamento novo. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{var s=localStorage.getItem("compendio:reading-size");if(s==="larger"||s==="largest"){document.documentElement.dataset.readingSize=s;}}catch(e){}`,
        }}
      />
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-edge focus:bg-accent focus:px-4 focus:py-2 focus:text-meta focus:text-canvas"
      >
        {skipLabel}
      </a>
      <SiteHeader />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <PtOnly>
        <ChatWidget />
      </PtOnly>
      <PwaRegister />
      {/* Himetrica é um tracker client-side (a chave é feita pra rodar no
          navegador — não é segredo, é padrão deles mesmos, igual site ID
          do Plausible/PostHog). Só carrega se a env var estiver configurada
          (Vercel → NEXT_PUBLIC_HIMETRICA_API_KEY) — sem ela, undefined
          viraria a string "undefined" no atributo. */}
      {process.env.NEXT_PUBLIC_HIMETRICA_API_KEY && (
        <NotOnPrivatePages>
          <Script
            src="https://cdn.himetrica.com/tracker.js"
            strategy="afterInteractive"
            data-api-key={process.env.NEXT_PUBLIC_HIMETRICA_API_KEY}
          />
        </NotOnPrivatePages>
      )}
    </body>
  );
}
