#!/bin/bash

# Netlify build script for webdev.ai
# This script handles the build process with proper error handling

set -e  # Exit on any error

echo "🚀 Starting Netlify build for webdev.ai v0.35.0-beta"

# Check Node.js version
echo "📋 Node.js version: $(node --version)"
echo "📋 npm version: $(npm --version)"

# Clean install with modern npm flags
echo "📦 Installing dependencies..."
npm install --omit=optional --silent

# Verify critical dependencies
echo "🔍 Verifying Remix installation..."
if ! npx remix --version > /dev/null 2>&1; then
    echo "❌ Remix CLI not found, installing @remix-run/dev..."
    npm install @remix-run/dev --save-dev --silent
fi

# Build the application
echo "🏗️ Building application..."
npm run build

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
