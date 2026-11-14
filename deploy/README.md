# Front e API numa VPS

Três projetos Docker Compose na mesma máquina, ligados pela rede `deploy_default`:

| Projeto | Onde está | O que faz |
|---|---|---|
| `deploy` (Caddy) | `deploy/proxy/` deste repo | Único com portas abertas (80/443), HTTPS automático |
| `compendio-web` | `deploy/` deste repo | Next.js na porta interna 3000 |
| `acervo-catolico` | `deploy/` do `Acervo-Cat-lico-API` | FastAPI na porta interna 8000 |

O Postgres continua fora da VPS (Neon, `DATABASE_URL` da API), então não há banco para migrar.

## Hoje (antes da migração)

- Front: Netlify, domínio `compendio-catolico.com`. Variáveis: `API_URL`, `NEXTAUTH_URL`, `AUTH_GOOGLE_ID`,
  `AUTH_GOOGLE_SECRET`, `AUTH_SECRET`, `INTERNAL_API_SECRET`, `NEXT_PUBLIC_HIMETRICA_API_KEY`.
- API: Render, `https://acervo-cat-lico-api-jqtz.onrender.com`. O registro `api.compendio-catolico.com` não existe
  mais no DNS. Variáveis: `CORS_ORIGINS`, `DATABASE_URL`, `INTERNAL_API_SECRET`, `IMAGE_CDN_BASE_URL`,
  `DEEPSEEK_API_KEY`, `VOYAGE_API_KEY` (as demais têm padrão).
- DNS: Cloudflare (registrador HostGator). Registros que apontam para a VPS ficam "DNS only".

## Subir na VPS (Ubuntu, Docker instalado)

```sh
git clone https://github.com/VictorOliveiraPy/Acervo-Cat-lico-Web.git /opt/compendio-web
git clone https://github.com/VictorOliveiraPy/Acervo-Cat-lico-API.git /opt/acervo-catolico-api

# 1. Proxy primeiro: ele cria a rede deploy_default.
docker compose -f /opt/compendio-web/deploy/proxy/docker-compose.yml up -d

# 2. API: copiar as variáveis do Render para o .env.
cp /opt/acervo-catolico-api/.env.example /opt/acervo-catolico-api/deploy/.env   # e preencher
/opt/acervo-catolico-api/deploy/atualizar.sh

# 3. Front: copiar as variáveis da Netlify para o .env.
cp /opt/compendio-web/deploy/.env.example /opt/compendio-web/deploy/.env        # e preencher
/opt/compendio-web/deploy/atualizar.sh
```

## Virada de DNS (Cloudflare)

1. Um dia antes: baixar o TTL de `@` e `www` para 1 min.
2. Criar `api` → A → IP da VPS (DNS only). Testar `curl https://api.compendio-catolico.com/api/health`.
3. Trocar `@` e `www` para A → IP da VPS. O Caddy emite os certificados na primeira visita.
4. No `.env` do front, trocar `API_URL_PUBLICA` para `https://api.compendio-catolico.com/api` e rodar `atualizar.sh`.
5. Só depois de tudo verde: desligar Netlify e Render. O ping `netlify/functions/keep-api-awake.mts` deixa de ser
   necessário e sai junto.
