#!/bin/bash

echo "🔄 Resetting PostgreSQL container..."

echo "📦 Stopping and removing existing containers..."
docker-compose down

echo "🗑️ Removing postgres_data volume..."
docker volume rm postgres_postgres_data 2>/dev/null || echo "Volume not found or already removed"

echo "🧹 Cleaning up unused volumes..."
docker volume prune -f

echo "🚀 Starting PostgreSQL container..."
docker-compose up -d

echo "⏳ Waiting for PostgreSQL to start..."
sleep 5

echo "✅ Checking container status..."
docker-compose ps

echo "🎉 Reset completed! PostgreSQL is ready."

