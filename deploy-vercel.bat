@echo off
echo 🚀 Starting Vercel deployment build...

REM Clean previous builds
echo 🧹 Cleaning previous builds...
if exist build rmdir /s /q build
if exist dist rmdir /s /q dist

REM Install dependencies
echo 📦 Installing dependencies...
pnpm install

REM Build for Vercel
echo 🔨 Building for Vercel...
pnpm run build:vercel

REM Check if build was successful
if exist "build\client" (
    echo ✅ Build successful!
    echo 📁 Build output directory: build\client
    
    REM List build contents
    echo 📋 Build contents:
    dir build\client
    
    if exist "build\client\index.html" (
        echo ✅ index.html found
    ) else (
        echo ❌ index.html not found
    )
    
    if exist "build\client\assets" (
        echo ✅ Assets directory found
        echo 📋 Assets:
        dir build\client\assets
    ) else (
        echo ❌ Assets directory not found
    )
) else (
    echo ❌ Build failed - build\client directory not found
    exit /b 1
)

echo 🎉 Ready for Vercel deployment!
echo 💡 Run 'vercel --prod' to deploy