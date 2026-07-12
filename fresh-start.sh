#!/usr/bin/env bash
#
# TransitOps — fresh start.
#
# Gives this machine a completely clean slate and boots a fully working app.
# On first boot the container auto-applies all migrations and seeds demo data,
# so there's nothing to set up by hand.
#
#   ./fresh-start.sh          Pull latest (fast-forward only), wipe DB + image, rebuild, run.
#   ./fresh-start.sh --hard   Also DISCARD local code changes and reset to origin/main.
#                             Use this when the checkout has messed-up / uncommitted changes.
#
set -euo pipefail

cd "$(dirname "$0")"

HARD=false
[ "${1:-}" = "--hard" ] && HARD=true

echo "==> TransitOps: fresh start"
[ "$HARD" = true ] && echo "    --hard: local code changes will be discarded and reset to origin/main"

# 0. Docker must be installed and running (this project runs entirely in Docker).
if ! command -v docker >/dev/null 2>&1; then
  echo "!! Docker isn't installed or isn't on your PATH." >&2
  echo "   Install Docker Desktop (https://docker.com), start it, then re-run." >&2
  exit 1
fi
if ! docker info >/dev/null 2>&1; then
  echo "!! Docker is installed but not running. Start Docker Desktop and re-run." >&2
  exit 1
fi

# Pick the compose command (v2 "docker compose" or legacy "docker-compose").
if docker compose version >/dev/null 2>&1; then
  COMPOSE="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE="docker-compose"
else
  echo "!! Neither 'docker compose' nor 'docker-compose' is available." >&2
  exit 1
fi

# 1. Get the code into a known-good state.
if [ -d .git ]; then
  if [ "$HARD" = true ]; then
    echo "==> Resetting code to origin/main (discarding local changes)..."
    git fetch origin
    git reset --hard origin/main
    git clean -fd            # remove untracked files (keeps gitignored .env)
  else
    echo "==> Pulling latest code..."
    git pull --ff-only || {
      echo "   Couldn't fast-forward — this checkout has local changes or a diverged branch."
      echo "   Continuing with the code you have. To force a clean reset, run:"
      echo "       ./fresh-start.sh --hard"
    }
  fi
fi

# 2. Tear down old containers AND the database volume — a true clean slate,
#    wiping any stale or half-migrated database.
echo "==> Removing old containers and the database volume..."
$COMPOSE down -v --remove-orphans

# 3. Rebuild from scratch (no cache) so all code + Dockerfile changes apply.
echo "==> Rebuilding the app image from scratch (no cache)... this can take a minute."
$COMPOSE build --no-cache

# 4. Start everything. The entrypoint runs migrations + seed automatically.
echo ""
echo "==> Starting TransitOps."
echo "    Migrations and demo data run automatically on first boot."
echo "    When the server is ready, open:  http://localhost:3000"
echo ""
echo "    Demo login:  fleet@transitops.com  /  password123"
echo "    (Ctrl-C to stop.)"
echo ""
$COMPOSE up
