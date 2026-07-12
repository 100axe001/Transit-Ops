#!/bin/sh
set -e

echo "→ Applying database migrations..."
npx prisma migrate deploy

echo "→ Seeding demo data (skipped if the database already has data)..."
npx prisma db seed || echo "  Seed skipped — database already seeded."

exec "$@"
