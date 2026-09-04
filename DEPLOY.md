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
   API_URL=https://SUA-URL-DO-RENDER.onrender.com/api
   ```
   (a URL pública do backend, com `/api` no final — é o que
   `getApiBaseUrl()` espera, ver `lib/api.ts`).
4. Deploy. Anote a URL pública, algo como
   `https://acervo-catolico-web.vercel.app`.
5. Volte no backend (`Compendio-Catolico-API`, `DEPLOY.md`) e trave o
   `CORS_ORIGINS` nessa URL real.

## Checklist antes de considerar o deploy "pronto"

- [ ] Site no Vercel carrega a home e pelo menos uma categoria sem erro
      no console (rede/CORS).
- [ ] `API_URL` aponta para o backend de produção, não
      `localhost`.
- [ ] CORS do backend está travado nessa URL do Vercel — ver checklist em
      `Compendio-Catolico-API/DEPLOY.md`.
