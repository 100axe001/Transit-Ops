#!/usr/bin/env bash
#
# TransitOps — fresh start.
#
# Gives this machine a completely clean slate: removes old containers and the
# database volume, rebuilds the image from scratch, and boots the app. On first
# boot the container automatically applies all migrations and seeds demo data,
# so you end up with a fully working app — nothing to set up by hand.
#
# Usage:  ./fresh-start.sh
#
set -euo pipefail

cd "$(dirname "$0")"

echo "==> TransitOps: fresh start"

# 0. Docker must be available (this project runs entirely in Docker).
if ! command -v docker >/dev/null 2>&1; then
  echo "!! Docker isn't installed or isn't on your PATH." >&2
  echo "   Install Docker Desktop (https://docker.com), start it, then re-run this script." >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "!! Docker is installed but not running. Start Docker Desktop and re-run this script." >&2
  exit 1
fi

# 1. Grab the latest code (non-fatal — keep going if it can't fast-forward).
if [ -d .git ]; then
  echo "==> Pulling latest code..."
  git pull --ff-only || echo "   (couldn't fast-forward — continuing with the code you have)"
fi

# 2. Tear down old containers AND the database volume. This wipes any stale /
#    half-migrated database so we truly start from zero.
echo "==> Removing old containers and the database volume (clean slate)..."
docker compose down -v --remove-orphans

# 3. Rebuild the image with no cache so all code + Dockerfile changes are applied.
echo "==> Rebuilding the app image from scratch (no cache)... this can take a minute."
docker compose build --no-cache

# 4. Start everything. The entrypoint runs migrations + seed automatically.
echo ""
echo "==> Starting TransitOps."
echo "    Migrations and demo data run automatically on first boot."
echo "    When you see the server is ready, open:  http://localhost:3000"
echo ""
echo "    Demo login:  fleet@transitops.com  /  password123"
echo "    (Ctrl-C to stop.)"
echo ""
docker compose up
