#!/bin/bash

echo "🚀 Starting Vercel deployment build..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf build/
rm -rf dist/

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build for Vercel
echo "🔨 Building for Vercel..."
pnpm run build:vercel

# Check if build was successful
if [ -d "build/client" ]; then
    echo "✅ Build successful!"
    echo "📁 Build output directory: build/client"
    
    # List build contents
    echo "📋 Build contents:"
    ls -la build/client/
    
    if [ -f "build/client/index.html" ]; then
        echo "✅ index.html found"
    else
        echo "❌ index.html not found"
    fi
    
    if [ -d "build/client/assets" ]; then
        echo "✅ Assets directory found"
        echo "📋 Assets:"
        ls -la build/client/assets/ | head -10
    else
        echo "❌ Assets directory not found"
    fi
else
    echo "❌ Build failed - build/client directory not found"
    exit 1
fi

echo "🎉 Ready for Vercel deployment!"
echo "💡 Run 'vercel --prod' to deploy"