#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."
git pull --ff-only origin main
docker compose -p compendio-web --project-directory deploy -f deploy/docker-compose.yml up -d --build
docker compose -p compendio-web --project-directory deploy -f deploy/docker-compose.yml ps
