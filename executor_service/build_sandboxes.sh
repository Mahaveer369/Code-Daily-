#!/bin/bash
# Script to build all sandbox images

set -e

echo "🔨 Building sandbox images..."

# Build Python sandbox
echo "Building Python sandbox..."
docker build -t code-sandbox-python:latest -f sandboxes/Dockerfile.python sandboxes/

# Build JavaScript sandbox
echo "Building JavaScript sandbox..."
docker build -t code-sandbox-javascript:latest -f sandboxes/Dockerfile.javascript sandboxes/

# Build SQL sandbox
echo "Building SQL sandbox..."
docker build -t code-sandbox-sql:latest -f sandboxes/Dockerfile.sql sandboxes/

echo ""
echo "✅ All sandbox images built successfully!"
echo ""
echo "Images:"
docker images | grep code-sandbox
