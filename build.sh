#!/bin/bash
set -e  # Exit on any error

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

# Check if dependencies installed correctly
echo "Checking node_modules..."
ls -la node_modules/ | head -10

# Build the application
echo "Building application..."
npm run build

# Check if build directory was created
echo "Checking build output..."
ls -la build/
ls -la build/client/

echo "Build completed successfully!"
