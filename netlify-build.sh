#!/bin/bash

# Netlify build script for webdev.ai
# This script handles the build process with proper error handling

set -e  # Exit on any error

echo "🚀 Starting Netlify build for webdev.ai v0.45.2-fixed"

# Check Node.js version and enable pnpm
echo "📋 Node.js version: $(node --version)"
corepack enable
echo "📋 pnpm version: $(pnpm --version)"

# Clean install with pnpm
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile --silent

# Verify critical dependencies
echo "🔍 Verifying Vite installation..."
if ! pnpm exec vite --version > /dev/null 2>&1; then
    echo "❌ Vite not found, installing vite..."
    pnpm add vite --save-dev --silent
fi

# Build the application
echo "🏗️ Building application..."
pnpm run build:netlify

# Verify build output
echo "✅ Verifying build output..."
if [ ! -f "build/client/index.html" ]; then
    echo "❌ index.html not found in build output"
    exit 1
fi

if [ ! -d "build/client/assets" ]; then
    echo "❌ Assets directory not found in build output"
    exit 1
fi

echo "🎉 Build completed successfully!"
echo "📁 Build output directory: build/client"
echo "📄 Entry point: build/client/index.html"

# List key files for debugging
echo "📋 Key build files:"
ls -la build/client/index.html
ls -la build/client/assets/ | head -5
