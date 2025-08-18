import { RemixBrowser } from '@remix-run/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Simple error boundary
function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Prevent multiple initializations
let isInitialized = false;

function initializeApp() {
  // Prevent multiple calls
  if (isInitialized) {
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
  }
}

// Wait for DOM to be ready, then initialize once
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM is already ready
  initializeApp();
}
