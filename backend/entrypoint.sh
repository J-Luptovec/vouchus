#!/bin/sh
set -e

echo "Pushing schema to database..."
npx prisma db push --skip-generate

echo "Seeding database..."
npx ts-node --transpile-only prisma/seed.ts

echo "Starting server..."
exec node dist/index.js
