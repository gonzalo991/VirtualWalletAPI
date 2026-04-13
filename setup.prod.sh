#!/bin/bash

echo "🚀 Starting PROD environment..."

docker compose -f docker-compose.prod.yml up --build -d

echo "⏳ Waiting for database..."

until docker exec wallet-db-prod pg_isready -U postgres > /dev/null 2>&1; do
  sleep 1
done

echo "📦 Running migrations (deploy)..."
docker exec wallet-api-prod npx prisma migrate deploy

echo "✅ PROD ready"