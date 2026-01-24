#!/bin/bash
# Quick start script for Code-Daily- Docker deployment

set -e

echo "🚀 Starting Code-Daily- Docker Deployment..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Step 1: Build sandbox images
echo "📦 Building sandbox images (Python, JavaScript, SQL)..."
cd executor_service
bash build_sandboxes.sh
cd ..
echo ""

# Step 2: Build and start all services
echo "🏗️ Building and starting all services..."
docker-compose up --build -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Step 3: Check service health
echo ""
echo "🔍 Checking service health..."
echo ""

# Check backend
if curl -s http://localhost:8000/admin/ > /dev/null 2>&1; then
    echo "✅ Backend is running at http://localhost:8000"
else
    echo "⚠️  Backend may still be starting..."
fi

# Check executor
if curl -s http://localhost:8001/health > /dev/null 2>&1; then
    echo "✅ Executor is running at http://localhost:8001"
else
    echo "⚠️  Executor may still be starting..."
fi

# Check frontend
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend is running at http://localhost:5173"
else
    echo "⚠️  Frontend may still be starting..."
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo "🎉 Code-Daily- is now running!"
echo ""
echo "   📱 Frontend:  http://localhost:5173"
echo "   🔧 Backend:   http://localhost:8000"
echo "   ⚡ Executor:  http://localhost:8001"
echo "   📊 Admin:     http://localhost:8000/admin/"
echo ""
echo "   Run 'docker-compose logs -f' to view logs"
echo "   Run 'docker-compose down' to stop services"
echo "════════════════════════════════════════════════════════"
