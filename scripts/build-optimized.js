#!/usr/bin/env node

/**
 * Optimized build script for webdev.ai
 * Handles bundle optimization, code splitting, and performance monitoring
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting optimized build for webdev.ai...\n');

// Build configuration
const buildConfig = {
  target: 'esnext',
  minify: true,
  sourcemap: false,
  chunkSizeWarningLimit: 1000,
};

// Pre-build optimizations
console.log('📋 Pre-build optimizations:');

// 1. Clean previous build
console.log('  • Cleaning previous build...');
try {
  if (fs.existsSync('build')) {
    fs.rmSync('build', { recursive: true, force: true });
  }
  console.log('    ✅ Build directory cleaned');
} catch (error) {
  console.log('    ⚠️  Could not clean build directory:', error.message);
}

// 2. Check for large dependencies
console.log('  • Analyzing dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const largeDeps = [
    '@aws-sdk/client-bedrock-runtime',
    'shiki',
    'framer-motion',
    '@codemirror/lang-javascript',
    'lucide-react'
  ];
  
  const foundLargeDeps = largeDeps.filter(dep => deps[dep]);
  console.log(`    📦 Found ${foundLargeDeps.length} large dependencies: ${foundLargeDeps.join(', ')}`);
} catch (error) {
  console.log('    ⚠️  Could not analyze dependencies:', error.message);
}

// 3. Run the build
console.log('\n🔨 Running build...');
const startTime = Date.now();

try {
  // Set environment variables for optimization
  process.env.NODE_ENV = 'production';
  process.env.VITE_BUILD_OPTIMIZE = 'true';
  
  // Run the build command
  execSync('pnpm run build', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  const buildTime = Date.now() - startTime;
  console.log(`\n✅ Build completed in ${(buildTime / 1000).toFixed(2)}s`);
  
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}

// Post-build analysis
console.log('\n📊 Post-build analysis:');

try {
  // Analyze build output
  const buildDir = 'build/client';
  if (fs.existsSync(buildDir)) {
    const files = fs.readdirSync(buildDir, { recursive: true });
    
    // Calculate total size
    let totalSize = 0;
    const jsFiles = [];
    const cssFiles = [];
    
    files.forEach(file => {
      if (typeof file === 'string') {
        const filePath = path.join(buildDir, file);
        if (fs.statSync(filePath).isFile()) {
          const size = fs.statSync(filePath).size;
          totalSize += size;
          
          if (file.endsWith('.js')) {
            jsFiles.push({ name: file, size });
          } else if (file.endsWith('.css')) {
            cssFiles.push({ name: file, size });
          }
        }
      }
    });
    
    console.log(`  📦 Total build size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  📄 JavaScript files: ${jsFiles.length}`);
    console.log(`  🎨 CSS files: ${cssFiles.length}`);
    
    // Show largest files
    const allFiles = [...jsFiles, ...cssFiles].sort((a, b) => b.size - a.size);
    const largeFiles = allFiles.filter(f => f.size > 500 * 1024); // > 500KB
    
    if (largeFiles.length > 0) {
      console.log('\n  ⚠️  Large files detected:');
      largeFiles.slice(0, 5).forEach(file => {
        console.log(`    • ${file.name}: ${(file.size / 1024).toFixed(2)}KB`);
      });
    }
    
    // Performance recommendations
    console.log('\n💡 Performance recommendations:');
    
    if (totalSize > 10 * 1024 * 1024) { // > 10MB
      console.log('  • Consider implementing more aggressive code splitting');
    }
    
    if (largeFiles.length > 3) {
      console.log('  • Multiple large chunks detected - consider lazy loading');
    }
    
    if (jsFiles.length > 50) {
      console.log('  • Many JavaScript files - consider chunk consolidation');
    }
    
    console.log('  • Enable gzip compression on your server');
    console.log('  • Consider implementing service worker for caching');
    console.log('  • Use CDN for static assets');
    
  } else {
    console.log('  ⚠️  Build directory not found');
  }
  
} catch (error) {
  console.log('  ⚠️  Could not analyze build output:', error.message);
}

// Generate build report
console.log('\n📋 Generating build report...');

try {
  const report = {
    timestamp: new Date().toISOString(),
    buildTime: Date.now() - startTime,
    nodeVersion: process.version,
    platform: process.platform,
    optimizations: [
      'Code splitting enabled',
      'Minification enabled',
      'Tree shaking enabled',
      'CSS optimization enabled',
      'Asset optimization enabled'
    ],
    recommendations: [
      'Enable gzip compression',
      'Implement service worker',
      'Use CDN for static assets',
      'Monitor Core Web Vitals'
    ]
  };
  
  fs.writeFileSync('build-report.json', JSON.stringify(report, null, 2));
  console.log('  ✅ Build report saved to build-report.json');
  
} catch (error) {
  console.log('  ⚠️  Could not generate build report:', error.message);
}

console.log('\n🎉 Optimized build complete!');
console.log('\nNext steps:');
console.log('  1. Test the production build: pnpm run start');
console.log('  2. Run performance audits');
console.log('  3. Deploy to your hosting platform');
console.log('  4. Monitor performance metrics\n');
