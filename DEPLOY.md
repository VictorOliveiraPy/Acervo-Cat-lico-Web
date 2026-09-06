# Deploy — frontend no Vercel

> Preparado sem gastar token de API — é configuração de infraestrutura,
> não geração de código.

Este é o repositório do **frontend** (`Compendio-Catolico-Web`). O backend
mora no repositório irmão
[`Compendio-Catolico-API`](https://github.com/VictorOliveiraPy/Compendio-Catolico-API),
deploy no Render — ver `DEPLOY.md` de lá, incluindo por que o backend deve
subir primeiro.

## Deploy no Vercel

1. No Vercel: **Add New > Project**, importe este repositório
   (`Compendio-Catolico-Web`).
2. **Root Directory**: deixe a raiz (`.`) — o Vercel detecta Next.js
   automaticamente, não precisa de `vercel.json`.
3. Em **Environment Variables**, adicione:
   ```
   API_URL=https://api.compendio-catolico.com/api
   ```
   (a URL pública do backend, com `/api` no final — é o que
   `getApiBaseUrl()` espera, ver `lib/api.ts`).
4. Deploy.
5. Configure o domínio próprio: Settings → Domains → adicione
   `compendio-catolico.com` marcando "Include apex and www variants" →
   Connect to an Environment: Production. O Vercel mostra os registros
   pendentes (A `76.76.21.21` na raiz, CNAME `cname.vercel-dns.com` no
   `www`) — crie/edite esses registros na Cloudflare (DNS only) e
   aguarde o certificado ser emitido.
6. Volte no backend (`Compendio-Catolico-API`, `DEPLOY.md`) e confirme
   que o `CORS_ORIGINS` está travado em `https://compendio-catolico.com`
   e `https://www.compendio-catolico.com`.

## Domínio e DNS

Ver a seção "Domínio de produção" em `Compendio-Catolico-API/DEPLOY.md` —
é lá que está documentado o desenho completo (HostGator como registrador,
Cloudflare como DNS, e-mail Titan preservado).

## SEO

- `app/robots.ts` e `app/sitemap.ts` geram `/robots.txt` e `/sitemap.xml`
  dinamicamente (o sitemap busca todas as categorias e entradas na API —
  ver `lib/site.ts` para a URL base usada nesses arquivos e nos metadados).
- Cada categoria e cada entrada define seu próprio `title`/`description`/
  `openGraph`/`canonical` via `generateMetadata` (ver
  `app/[categoria]/page.tsx` e `app/[categoria]/[slug]/page.tsx`).
- `app/opengraph-image.tsx` e `app/icon.tsx` geram a prévia de
  compartilhamento e o favicon (sem depender de arquivo de imagem
  estático — `next/og` desenha na hora, na paleta do site).
- Página de entrada também injeta dados estruturados (`CreativeWork` +
  `BreadcrumbList`); a home injeta `WebSite` com `SearchAction` (habilita
  a caixa de busca nos resultados do Google, quando indexado).
- **IndexNow** (`scripts/submit-indexnow.mjs`): a cada build de produção de
  verdade na Vercel (`postbuild`, guardado por `VERCEL_ENV === "production"`
  — não dispara em preview nem em build local), o script lê `/sitemap.xml`
  e avisa o Bing/Yandex direto, sem esperar o rastreador natural passar. A
  chave (`public/<chave>.txt`) não é segredo, só prova posse do domínio.
- **Cadastro manual** (fora do código, precisa de login):
  [Google Search Console](https://search.google.com/search-console)
  (propriedade de domínio, verificação por TXT no DNS da Cloudflare) e
  [Bing Webmaster Tools](https://www.bing.com/webmasters) (tem import
  direto do Google Search Console) — depois de verificado, submeter
  `https://compendio-catolico.com/sitemap.xml` em cada um.

## Checklist antes de considerar o deploy "pronto"

- [ ] Site no Vercel carrega a home e pelo menos uma categoria sem erro
      no console (rede/CORS).
- [ ] `API_URL` aponta para o backend de produção, não
      `localhost`.
- [ ] CORS do backend está travado nesse domínio — ver checklist em
      `Compendio-Catolico-API/DEPLOY.md`.
- [ ] `https://compendio-catolico.com/robots.txt` e
      `/sitemap.xml` respondem 200 com o domínio de produção nas URLs.
