// Service worker mínimo — existe só para o site passar no critério de
// "instalável" do Chrome/Android (manifest + HTTPS + service worker
// registrado com um handler de fetch). De propósito sem cache agressivo:
// o acervo muda com frequência (novas categorias/entradas), e conteúdo
// desatualizado servido do cache seria pior do que não ter PWA nenhuma.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Sem `respondWith`: deixa a rede responder normalmente. O handler só
// precisa existir para satisfazer o critério de instalabilidade acima.
self.addEventListener("fetch", () => {});
