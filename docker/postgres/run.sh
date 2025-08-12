#!/bin/bash

echo "🚀 Starting PostgreSQL container..."

# Check container is running
if docker-compose ps | grep -q "Up"; then
    echo "⚠️ PostgreSQL container is already running!"
    docker-compose ps
    exit 0
fi

# Start container
echo "📦 Starting containers..."
docker-compose up -d

# Wait for container to start
echo "⏳ Waiting for PostgreSQL to start..."
sleep 5

echo "✅ Checking container status..."
docker-compose ps

echo "🎉 PostgreSQL is ready."