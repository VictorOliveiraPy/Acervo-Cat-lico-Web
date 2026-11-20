#!/usr/bin/env bash
# Publica o front e a API na VPS Micro da Oracle (1 GB de RAM). O build do Next não cabe
# lá, então as imagens são montadas nesta máquina (x86, como a VPS), enviadas por SSH e só
# rodam na VPS. Usa a árvore de trabalho local dos dois repositórios, como ela está.
#
#   deploy/publicar.sh            # API e front
#   deploy/publicar.sh web        # só o front
#   deploy/publicar.sh api        # só a API
set -euo pipefail

VPS="${VPS:-ubuntu@168.138.150.171}"
WEB_DIR="$(cd "$(dirname "$0")/.." && pwd)"
API_DIR="${API_DIR:-$WEB_DIR/../Acervo-Cat-lico-API}"
ALVO="${1:-tudo}"

# Os valores de build ficam só no .env da VPS: uma fonte só, nada de segredo nesta máquina.
env_vps() {
  ssh "$VPS" "grep -E '^$1=' /opt/compendio-web/deploy/.env | tail -1 | cut -d= -f2-"
}

imagens=()
if [[ "$ALVO" == tudo || "$ALVO" == api ]]; then
  docker build --platform linux/amd64 -t acervo-catolico-api:latest "$API_DIR"
  imagens+=(acervo-catolico-api:latest)
fi
if [[ "$ALVO" == tudo || "$ALVO" == web ]]; then
  docker build --platform linux/amd64 -t compendio-web:latest \
    --build-arg API_URL="$(env_vps API_URL_PUBLICA)" \
    --build-arg AUTH_GOOGLE_ID="$(env_vps AUTH_GOOGLE_ID)" \
    "$WEB_DIR"
  imagens+=(compendio-web:latest)
fi

echo "Enviando ${imagens[*]} para $VPS…"
docker save "${imagens[@]}" | gzip -1 | ssh "$VPS" 'gunzip | docker load'

ssh "$VPS" ALVO="$ALVO" 'sh -s' <<'REMOTO'
set -eu
git -C /opt/compendio-web pull -q --ff-only origin main
git -C /opt/acervo-catolico-api pull -q --ff-only origin main
# Proxy primeiro: cria a rede deploy_default; reload aplica mudanças no Caddyfile.
docker compose -f /opt/compendio-web/deploy/proxy/docker-compose.yml up -d
docker compose -f /opt/compendio-web/deploy/proxy/docker-compose.yml exec -T caddy caddy reload --config /etc/caddy/Caddyfile
if [ "$ALVO" = tudo ] || [ "$ALVO" = api ]; then
  docker compose -p acervo-catolico --project-directory /opt/acervo-catolico-api/deploy \
    -f /opt/acervo-catolico-api/deploy/docker-compose.yml up -d --no-build
fi
if [ "$ALVO" = tudo ] || [ "$ALVO" = web ]; then
  docker compose -p compendio-web --project-directory /opt/compendio-web/deploy \
    -f /opt/compendio-web/deploy/docker-compose.yml up -d --no-build
fi
docker image prune -f >/dev/null
docker ps --format 'table {{.Names}}\t{{.Status}}'
free -m | sed -n 1,3p
REMOTO

# Avisa o Bing (IndexNow) das URLs do sitemap: o Google não tem aviso equivalente.
if [[ "$ALVO" == tudo || "$ALVO" == web ]]; then
  # O container novo leva alguns segundos para subir; antes disso o sitemap dá 502.
  for _ in $(seq 1 30); do
    curl -sf -o /dev/null https://compendio-catolico.com/sitemap.xml && break
    sleep 4
  done
  INDEXNOW=1 node "$WEB_DIR/scripts/submit-indexnow.mjs" || true
fi
