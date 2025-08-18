import { RemixBrowser } from '@remix-run/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Clean initialization tracker
let isInitialized = false;

// Simplified error boundary
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function initializeApp() {
  // Prevent multiple initializations
  if (isInitialized) {
    return;
  }

  isInitialized = true;

  console.log('🚀 Initializing WebDev.ai SPA...');

  // Simple route structure for SPA
  const basicRoute = {
    id: 'root',
    path: '',
    hasAction: false,
    hasLoader: false,
    hasClientAction: false,
    hasClientLoader: false,
    hasErrorBoundary: false,
    module: '',
    imports: [],
  };

  // Set up minimal Remix context for SPA
  if (!window.__remixContext) {
    window.__remixContext = {
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_singleFetch: false,
        v3_lazyRouteDiscovery: false,
      },
      isSpaMode: true,
      basename: '',
      routes: {
        root: basicRoute,
      },
      manifest: {
        routes: {
          root: basicRoute,
        },
        entry: { imports: [], module: '' },
        url: '',
        version: '1',
      },
      url: window.location.pathname + window.location.search,
      state: {
        loaderData: {},
        actionData: null,
        errors: null,
      },
    } as any;
  }

  // Set up route modules
  if (!window.__remixRouteModules) {
    window.__remixRouteModules = {};
  }

  if (!window.__remixManifest) {
    window.__remixManifest = (window.__remixContext as any).manifest;
  }

  // Get root container
  const container = document.getElementById('root');

  if (!container) {
    console.error('❌ Root container not found');
    return;
  }

  // Initialize React app
  try {
    const root = createRoot(container);

    root.render(
      <StrictMode>
        <ErrorBoundary>
          <RemixBrowser />
        </ErrorBoundary>
      </StrictMode>,
    );

    console.log('✅ WebDev.ai SPA initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize app:', error);
    
    // Fallback UI
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #0f0f0f; color: #ffffff; font-family: system-ui;">
        <h1>WebDev.ai</h1>
        <p>Loading application...</p>
        <p style="opacity: 0.7; font-size: 14px;">If this persists, please refresh the page</p>
      </div>
    `;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM already ready
  setTimeout(initializeApp, 0);
}
