#!/bin/sh
set -e

echo "Pushing schema to database..."
npx prisma db push

echo "Seeding database..."
npx tsx prisma/seed.ts

echo "Starting server..."
exec npx tsx src/index.ts
