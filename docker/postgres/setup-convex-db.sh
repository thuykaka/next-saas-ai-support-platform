#!/bin/bash

echo "🗄️ Setting up Convex database..."

if ! docker ps | grep -q postgres; then
    echo "❌ PostgreSQL container is not running!"
    echo "🚀 Starting PostgreSQL..."
    docker-compose up -d
    sleep 5
fi

echo "📦 Creating convex_self_hosted database..."
docker exec postgres psql -U postgres -c "CREATE DATABASE convex_self_hosted;" 2>/dev/null || echo "Database already exists"

echo "👤 Creating convex_user..."
docker exec postgres psql -U postgres -c "CREATE USER convex_user WITH PASSWORD 'convex_password';" 2>/dev/null || echo "User already exists"

echo "🔐 Granting privileges..."
docker exec postgres psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE convex_self_hosted TO convex_user;"

echo "🔐 Granting schema privileges..."
docker exec postgres psql -U postgres -d convex_self_hosted -c "GRANT ALL ON SCHEMA public TO convex_user;"
docker exec postgres psql -U postgres -d convex_self_hosted -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO convex_user;"
docker exec postgres psql -U postgres -d convex_self_hosted -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO convex_user;"
docker exec postgres psql -U postgres -d convex_self_hosted -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO convex_user;"
docker exec postgres psql -U postgres -d convex_self_hosted -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO convex_user;"

echo "✅ Database setup completed!"
echo ""
echo "📊 Database information:"
docker exec postgres psql -U postgres -c "\l" | grep -E "^ convex_self_hosted" | head -1

echo ""
echo "🔗 Connection strings:"
echo "   PostgreSQL: postgresql://postgres:postgres@localhost:5432/convex_self_hosted"
echo "   Convex User: postgresql://convex_user:convex_password@localhost:5432/convex_self_hosted"
