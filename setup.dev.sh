#!/bin/bash

echo "🚀 Starting DEV environment..."

# Create .env automatically
if [ ! -f .env ]; then
  echo "📄 Creating .env file from template..."
  cp .env.example .env
fi

docker compose -f docker-compose.dev.yml up --build -d

echo "⏳ Waiting for database..."

until docker exec wallet-db-dev pg_isready -U postgres > /dev/null 2>&1; do
  sleep 1
done

echo "📦 Running migrations..."
docker exec wallet-api-dev npx prisma migrate deploy

echo "✅ DEV ready at http://localhost:8080"