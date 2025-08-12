#!/bin/bash

echo "🚀 Starting Convex Backend and Dashboard..."

# Check if containers are already running
if docker-compose ps | grep -q "Up"; then
    echo "⚠️ Convex containers are already running!"
    docker-compose ps
    echo ""
    echo "📊 Access URLs:"
    echo "   Dashboard: http://localhost:6791"
    exit 0
fi

# Start containers
echo "📦 Starting Convex containers..."
docker-compose up -d --force-recreate

# Wait for backend to be healthy
echo "⏳ Waiting for Convex backend to be ready..."
for i in {1..30}; do
    if docker-compose ps backend | grep -q "healthy"; then
        echo "✅ Backend is healthy!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Backend failed to become healthy within 30 seconds"
        echo "📋 Backend logs:"
        docker-compose logs backend
        exit 1
    fi
    echo "   Waiting... ($i/30)"
    sleep 2
done

echo "⏳ Waiting for Convex dashboard to start..."
sleep 5

echo "✅ Checking container status..."
docker-compose ps

echo ""
echo "🎉 Convex is ready!"
echo ""
echo "🔗 Connection Information:"
echo "   📊 Dashboard: http://localhost:6791"
echo "   Backend URL: http://127.0.0.1:3210"
echo "   HTTP actions URL: http://127.0.0.1:3211"
echo ""
echo "📋 Recent logs:"
docker-compose logs --tail=10
