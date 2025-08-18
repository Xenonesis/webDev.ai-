import { vitePlugin as remixVitePlugin } from '@remix-run/dev';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tsconfigPaths from 'vite-tsconfig-paths';

// Remix configuration for SPA mode on Vercel
const remixConfig = {
  ssr: false,
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
  },
  // Ignore API routes that have server-side loaders
  ignoredRouteFiles: [
    '**/api.models.ts',
    '**/api.models.$provider.ts',
    '**/api.*.ts'
  ],
};

export default defineConfig({
  plugins: [
    nodePolyfills({
      include: ['buffer', 'process', 'util', 'stream'],
      globals: {
        Buffer: true,
        process: true,
        global: true,
      },
      protocolImports: true,
      exclude: ['child_process', 'fs', 'path'],
    }),
    remixVitePlugin(remixConfig),
    UnoCSS(),
    tsconfigPaths(),
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false, // Disable source maps for production
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
