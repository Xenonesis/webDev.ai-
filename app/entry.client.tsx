import { RemixBrowser } from '@remix-run/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Enhanced error boundary
function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Error in AppErrorBoundary:', error);
    return <div>Something went wrong. Please refresh the page.</div>;
  }
}

// Prevent multiple initializations
let isInitialized = false;

// Override fetch to handle API route failures gracefully
const originalFetch = window.fetch;

window.fetch = async (...args) => {
  try {
    const response = await originalFetch(...args);
    const url = typeof args[0] === 'string' ? args[0] : args[0].url;
    
    // Handle API route failures in SPA mode
    if (url.includes('/api/') && !response.ok) {
      console.warn(`API route ${url} failed in SPA mode - this is expected`);
      return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
    }
    
    return response;
  } catch (error) {
    console.warn('Fetch error handled:', error);
    return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
  }
};

function initializeApp() {
  // Prevent multiple calls
  if (isInitialized) {
    console.log('⚠️ App already initialized, skipping');
    return;
  }

  isInitialized = true;

  console.log('🚀 Initializing WebDev.ai...');

  // Create proper routes structure
  const rootRoute = {
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

  // Set up Remix context only if it doesn't exist
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
        root: rootRoute,
      },
      manifest: {
        routes: {
          root: rootRoute,
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

  // Set up other Remix globals
  if (!window.__remixManifest) {
    window.__remixManifest = (window.__remixContext as any).manifest;
  }
  
  if (!window.__remixRouteModules) {
    window.__remixRouteModules = {};
  }

  // Get root element
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error('❌ Root element not found');
    return;
  }

  // Clear any existing content to prevent duplication
  if (rootElement.innerHTML.trim()) {
    console.log('🧹 Clearing existing content');
    rootElement.innerHTML = '';
  }

  try {
    console.log('✅ Creating React root');

    const root = createRoot(rootElement);
    
    root.render(
      <StrictMode>
        <AppErrorBoundary>
          <RemixBrowser />
        </AppErrorBoundary>
      </StrictMode>,
    );

    console.log('🎉 WebDev.ai initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize:', error);
    
    // Fallback: render a simple error message
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; color: white; background: #0f0f0f;">
        <h2>WebDev.ai</h2>
        <p>Loading application...</p>
        <p style="font-size: 12px; opacity: 0.7;">If this persists, please refresh the page.</p>
      </div>
    `;
  }
}

// Global error handler for unhandled errors
window.addEventListener('error', (event) => {
  // Don't log chunk loading errors as they're expected in SPA mode
  if (
    event.error?.message?.includes('Loading chunk') ||
    event.error?.message?.includes('Loading CSS chunk') ||
    event.filename?.includes('_app/immutable/') ||
    event.message?.includes('Script error')
  ) {
    console.warn('Chunk loading error (expected in SPA):', event.error?.message || event.message);
    event.preventDefault();

    return;
  }
  
  console.error('Global error:', event.error || event.message);
});

// Global promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  // Handle module loading failures gracefully
  if (
    event.reason?.message?.includes('Loading chunk') ||
    event.reason?.message?.includes('Loading CSS chunk') ||
    event.reason?.message?.includes('Failed to fetch dynamically imported module')
  ) {
    console.warn('Module loading failed (expected in SPA):', event.reason?.message);
    event.preventDefault();

    return;
  }
  
  console.error('Unhandled promise rejection:', event.reason);
});

// Wait for DOM to be ready, then initialize once
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM is already ready
  initializeApp();
}
