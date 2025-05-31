import { cloudflareDevProxyVitePlugin as remixCloudflareDevProxy, vitePlugin as remixVitePlugin } from '@remix-run/dev';
import UnoCSS from 'unocss/vite';
import { defineConfig, type ViteDevServer } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules';
import tsconfigPaths from 'vite-tsconfig-paths';
import * as dotenv from 'dotenv';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

dotenv.config();

// Get detailed git info with fallbacks
const getGitInfo = () => {
  try {
    return {
      commitHash: execSync('git rev-parse --short HEAD').toString().trim(),
      branch: execSync('git rev-parse --abbrev-ref HEAD').toString().trim(),
      commitTime: execSync('git log -1 --format=%cd').toString().trim(),
      author: execSync('git log -1 --format=%an').toString().trim(),
      email: execSync('git log -1 --format=%ae').toString().trim(),
      remoteUrl: execSync('git config --get remote.origin.url').toString().trim(),
      repoName: execSync('git config --get remote.origin.url')
        .toString()
        .trim()
        .replace(/^.*github.com[:/]/, '')
        .replace(/\.git$/, ''),
    };
  } catch {
    return {
      commitHash: 'no-git-info',
      branch: 'unknown',
      commitTime: 'unknown',
      author: 'unknown',
      email: 'unknown',
      remoteUrl: 'unknown',
      repoName: 'unknown',
    };
  }
};

// Read package.json with detailed dependency info
const getPackageJson = () => {
  try {
    const pkgPath = join(process.cwd(), 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

    return {
      name: pkg.name,
      description: pkg.description,
      license: pkg.license,
      dependencies: pkg.dependencies || {},
      devDependencies: pkg.devDependencies || {},
      peerDependencies: pkg.peerDependencies || {},
      optionalDependencies: pkg.optionalDependencies || {},
    };
  } catch {
    return {
      name: 'webdev.ai',
      description: 'AI-Powered Web Development Assistant',
      license: 'MIT',
      dependencies: {},
      devDependencies: {},
      peerDependencies: {},
      optionalDependencies: {},
    };
  }
};

const pkg = getPackageJson();
const gitInfo = getGitInfo();

export default defineConfig((config) => {
  return {
    define: {
      __COMMIT_HASH: JSON.stringify(gitInfo.commitHash),
      __GIT_BRANCH: JSON.stringify(gitInfo.branch),
      __GIT_COMMIT_TIME: JSON.stringify(gitInfo.commitTime),
      __GIT_AUTHOR: JSON.stringify(gitInfo.author),
      __GIT_EMAIL: JSON.stringify(gitInfo.email),
      __GIT_REMOTE_URL: JSON.stringify(gitInfo.remoteUrl),
      __GIT_REPO_NAME: JSON.stringify(gitInfo.repoName),
      __APP_VERSION: JSON.stringify(process.env.npm_package_version),
      __PKG_NAME: JSON.stringify(pkg.name),
      __PKG_DESCRIPTION: JSON.stringify(pkg.description),
      __PKG_LICENSE: JSON.stringify(pkg.license),
      __PKG_DEPENDENCIES: JSON.stringify(pkg.dependencies),
      __PKG_DEV_DEPENDENCIES: JSON.stringify(pkg.devDependencies),
      __PKG_PEER_DEPENDENCIES: JSON.stringify(pkg.peerDependencies),
      __PKG_OPTIONAL_DEPENDENCIES: JSON.stringify(pkg.optionalDependencies),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    },
    build: {
      target: 'esnext',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Core React and framework
            if (id.includes('react') || id.includes('@remix-run')) {
              return 'react-vendor';
            }

            // Syntax highlighting languages - split by language groups
            if (id.includes('shiki') || id.includes('@shikijs')) {
              if (id.includes('emacs-lisp') || id.includes('lisp')) {
                return 'lang-lisp';
              }
              if (id.includes('cpp') || id.includes('c++') || id.includes('objective-c')) {
                return 'lang-cpp';
              }
              if (id.includes('wasm') || id.includes('webassembly')) {
                return 'lang-wasm';
              }
              if (id.includes('javascript') || id.includes('typescript') || id.includes('jsx') || id.includes('tsx')) {
                return 'lang-js';
              }
              if (id.includes('python') || id.includes('ruby') || id.includes('php')) {
                return 'lang-dynamic';
              }
              if (id.includes('html') || id.includes('css') || id.includes('scss') || id.includes('less')) {
                return 'lang-web';
              }
              return 'lang-other';
            }

            // UI Libraries
            if (id.includes('@radix-ui') || id.includes('@headlessui') || id.includes('framer-motion')) {
              return 'ui-vendor';
            }

            // Code Editor
            if (id.includes('@codemirror') || id.includes('@uiw/codemirror')) {
              return 'editor-vendor';
            }

            // AI and LLM providers
            if (id.includes('@ai-sdk') || id.includes('@google/generative-ai') || id.includes('@anthropic-ai') || id.includes('openai')) {
              return 'ai-vendor';
            }

            // WebContainer
            if (id.includes('@webcontainer')) {
              return 'webcontainer-vendor';
            }

            // AWS and Cloud Services
            if (id.includes('@aws-sdk') || id.includes('@octokit')) {
              return 'cloud-vendor';
            }

            // Large utilities
            if (id.includes('html2canvas') || id.includes('jspdf') || id.includes('marked') || id.includes('dompurify')) {
              return 'utils-heavy';
            }

            // Other utilities
            if (id.includes('date-fns') || id.includes('zustand') || id.includes('nanostores')) {
              return 'utils-vendor';
            }

            // Icons
            if (id.includes('lucide-react') || id.includes('@heroicons')) {
              return 'icons-vendor';
            }

            // Node modules that are large
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
        external: (id) => {
          // Externalize problematic polyfill imports
          if (id.includes('vite-plugin-node-polyfills/shims/')) {
            return true;
          }
          return false;
        }
      },
      sourcemap: false,
      minify: 'esbuild',
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
    },
    resolve: {
      alias: {
        buffer: 'buffer',
      },
    },
    plugins: [
      nodePolyfills({
        include: ['buffer', 'process', 'util', 'stream'],
        globals: {
          Buffer: true,
          process: true,
          global: true,
        },
        protocolImports: false, // Disable protocol imports to avoid the buffer shim issue
        exclude: ['child_process', 'fs', 'path'],

      }),
      {
        name: 'buffer-polyfill',
        transform(code, id) {
          if (id.includes('env.mjs')) {
            return {
              code: `import { Buffer } from 'buffer';\n${code}`,
              map: null,
            };
          }

          return null;
        },
      },
      config.mode !== 'test' && remixCloudflareDevProxy(),
      remixVitePlugin({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_lazyRouteDiscovery: true,
        },
      }),
      UnoCSS(),
      tsconfigPaths(),
      chrome129IssuePlugin(),
      config.mode === 'production' && optimizeCssModules({ apply: 'build' }),

      // Performance optimization plugin
      {
        name: 'performance-optimization',
        generateBundle(options, bundle) {
          // Log bundle analysis in production
          if (config.mode === 'production') {
            const chunks = Object.values(bundle).filter(chunk => chunk.type === 'chunk');
            const totalSize = chunks.reduce((acc, chunk) => acc + (chunk.code?.length || 0), 0);
            console.log(`📦 Total bundle size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);

            // Log largest chunks
            const largeChunks = chunks
              .filter(chunk => (chunk.code?.length || 0) > 500 * 1024)
              .sort((a, b) => (b.code?.length || 0) - (a.code?.length || 0));

            if (largeChunks.length > 0) {
              console.log('⚠️  Large chunks detected:');
              largeChunks.forEach(chunk => {
                const size = ((chunk.code?.length || 0) / 1024).toFixed(2);
                console.log(`   ${chunk.fileName}: ${size}KB`);
              });
            }
          }
        }
      },
    ],
    envPrefix: [
      'VITE_',
      'OPENAI_LIKE_API_BASE_URL',
      'OLLAMA_API_BASE_URL',
      'LMSTUDIO_API_BASE_URL',
      'TOGETHER_API_BASE_URL',
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  };
});

function chrome129IssuePlugin() {
  return {
    name: 'chrome129IssuePlugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        const raw = req.headers['user-agent']?.match(/Chrom(e|ium)\/([0-9]+)\./);

        if (raw) {
          const version = parseInt(raw[2], 10);

          if (version === 129) {
            res.setHeader('content-type', 'text/html');
            res.end(
              '<body><h1>Please use Chrome Canary for testing.</h1><p>Chrome 129 has an issue with JavaScript modules & Vite local development, see <a href="https://github.com/stackblitz/bolt.new/issues/86#issuecomment-2395519258">for more information.</a></p><p><b>Note:</b> This only impacts <u>local development</u>. `pnpm run build` and `pnpm run start` will work fine in this browser.</p></body>',
            );

            return;
          }
        }

        next();
      });
    },
  };
}