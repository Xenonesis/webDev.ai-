#!/bin/bash

# Netlify build script for webdev.ai
echo "Starting webdev.ai build process..."

# Clean up any existing files
echo "Cleaning up existing files..."
rm -rf node_modules package-lock.json

# Clean npm cache
echo "Cleaning npm cache..."
npm cache clean --force

# Install dependencies
echo "Installing dependencies..."
npm install --no-package-lock

# Build the application
echo "Building application..."
npm run build

echo "Build completed successfully!"
