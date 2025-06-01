#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate index.html for static deployment
function generateIndexHtml() {
  try {
    const buildDir = path.join(process.cwd(), 'build', 'client');
    const assetsDir = path.join(buildDir, 'assets');

    if (!fs.existsSync(buildDir)) {
      console.warn('Build directory not found. Skipping index.html generation.');
      return;
    }

    // First, try to copy the public/index.html as a fallback
    const publicIndexPath = path.join(process.cwd(), 'public', 'index.html');
    const targetIndexPath = path.join(buildDir, 'index.html');

    if (fs.existsSync(publicIndexPath)) {
      fs.copyFileSync(publicIndexPath, targetIndexPath);
      console.log('✅ Copied public/index.html to build directory');
    }

  // Find the main JS and CSS files
  let mainJs = '';
  let mainCss = '';
  
  if (fs.existsSync(assetsDir)) {
    try {
      const assets = fs.readdirSync(assetsDir);

      // Find entry client JS file
      const entryJs = assets.find(file => file && file.startsWith('entry.client-') && file.endsWith('.js'));
      if (entryJs) {
        mainJs = `/assets/${entryJs}`;
      }

      // Find main CSS file
      const entryCss = assets.find(file => file && file.startsWith('entry.client-') && file.endsWith('.css'));
      if (entryCss) {
        mainCss = `/assets/${entryCss}`;
      }
    } catch (error) {
      console.warn('Warning: Could not read assets directory:', error.message);
    }
  }

  const html = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>webdev.ai - AI-Powered Web Development</title>
  <meta name="description" content="Revolutionary AI-powered web development assistant that transforms how you build web applications">
  
  <!-- Favicon -->
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://webdevai.netlify.app/">
  <meta property="og:title" content="webdev.ai - AI-Powered Web Development">
  <meta property="og:description" content="Revolutionary AI-powered web development assistant that transforms how you build web applications">
  <meta property="og:image" content="/social_preview_index.png">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://webdevai.netlify.app/">
  <meta property="twitter:title" content="webdev.ai - AI-Powered Web Development">
  <meta property="twitter:description" content="Revolutionary AI-powered web development assistant that transforms how you build web applications">
  <meta property="twitter:image" content="/social_preview_index.png">
  
  ${mainCss ? `<link rel="stylesheet" href="${mainCss}">` : ''}
  
  <style>
    /* Basic reset and theme setup */
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f0f0f;
      color: #ffffff;
    }
    
    #root {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    /* Loading spinner */
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      flex-direction: column;
      gap: 1rem;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #333;
      border-top: 4px solid #007acc;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .loading-text {
      color: #888;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div id="root">
    <div class="loading">
      <div class="spinner"></div>
      <div class="loading-text">Loading webdev.ai...</div>
    </div>
  </div>
  
  ${mainJs ? `<script type="module" src="${mainJs}"></script>` : ''}
  
  <script>
    // Fallback error handling
    window.addEventListener('error', (e) => {
      console.error('Application error:', e.error);
      const loadingText = document.querySelector('.loading-text');
      if (loadingText) {
        loadingText.textContent = 'Error loading application. Please refresh the page.';
      }
    });
  </script>
</body>
</html>`;

    const indexPath = path.join(buildDir, 'index.html');
    fs.writeFileSync(indexPath, html);

    console.log('✅ Generated index.html for static deployment');
    console.log(`📁 Location: ${indexPath}`);
    if (mainJs) console.log(`🔗 Main JS: ${mainJs}`);
    if (mainCss) console.log(`🎨 Main CSS: ${mainCss}`);
  } catch (error) {
    console.error('❌ Error generating index.html:', error.message);
    // Don't exit with error code to avoid breaking the build
    console.warn('⚠️ Continuing build without index.html generation');
  }
}

// Run the script
generateIndexHtml();
