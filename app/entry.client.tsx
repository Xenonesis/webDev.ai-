import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode, useEffect } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

// Extend window interface for Remix context
declare global {
  interface Window {
    __remixContext: any;
  }
}

// Add error boundary for the entire app
function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Unhandled error:', event.error);
    };
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
  
  return <>{children}</>;
}

// Create a default Remix context for SPA mode
function createDefaultRemixContext() {
  return {
    future: {
      v3_fetcherPersist: true,
      v3_relativeSplatPath: true,
      v3_throwAbortReason: true,
      v3_singleFetch: false,
      v3_lazyRouteDiscovery: false,
    },
    isSpaMode: true,
    basename: '',
    routes: {
      root: {
        id: 'root',
        path: '',
        hasAction: false,
        hasLoader: false,
        hasClientAction: false,
        hasClientLoader: false,
        hasErrorBoundary: false,
        module: '',
        imports: [],
      },
    },
    manifest: {
      routes: {
        root: {
          id: 'root',
          path: '',
          hasAction: false,
          hasLoader: false,
          hasClientAction: false,
          hasClientLoader: false,
          hasErrorBoundary: false,
          module: '',
          imports: [],
        },
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
  };
}

// Safely access window.__remixContext with proper fallbacks
function getRemixContext() {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const context = window.__remixContext;
  
  // For SPA mode, we might not have a context from the server
  if (!context) {
    return createDefaultRemixContext();
  }
  
  // Ensure future object exists with default values
  if (!context.future) {
    context.future = {
      v3_fetcherPersist: true,
      v3_relativeSplatPath: true,
      v3_throwAbortReason: true,
      v3_singleFetch: false,
      v3_lazyRouteDiscovery: false,
    };
  }
  
  // Ensure other required properties exist
  if (context.isSpaMode === undefined) {
    context.isSpaMode = true;
  }

  if (context.basename === undefined) {
    context.basename = '';
  }

  if (!context.routes) {
    context.routes = {};
  }

  if (!context.manifest) {
    context.manifest = {
      routes: {},
      entry: { imports: [], module: '' },
      url: '',
      version: '1',
    };
  }
  
  return context;
}

startTransition(() => {
  const root = document.getElementById('root');

  if (!root) {
    console.error('Root element not found');
    return;
  }
  
  // Initialize Remix context and ensure it's available globally
  const remixContext = getRemixContext();
  
  // Always ensure the context is properly set on window for RemixBrowser
  window.__remixContext = remixContext;
  
  // Additional safety check - ensure routes object exists
  if (!window.__remixContext?.routes) {
    console.warn('Routes not found in context, using default route structure');
    window.__remixContext = window.__remixContext || {};
    window.__remixContext.routes = window.__remixContext.routes || {
      root: {
        id: 'root',
        path: '',
        hasAction: false,
        hasLoader: false,
        hasClientAction: false,
        hasClientLoader: false,
        hasErrorBoundary: false,
        module: '',
        imports: [],
      },
    };
  }
  
  // Check if we're in development or production
  const isDevelopment = import.meta.env.DEV;
  
  try {
    // For production deployment, always use SPA mode
    const isProductionDeployment =
      !isDevelopment ||
      window.location.hostname.includes('vercel.app') ||
      window.location.hostname.includes('vercel.com') ||
      window.location.hostname.includes('netlify.app');

    if (isDevelopment && !isProductionDeployment && remixContext && !remixContext.isSpaMode) {
      // Development mode with SSR - use hydrateRoot
      hydrateRoot(
        root,
        <StrictMode>
          <AppErrorBoundary>
            <RemixBrowser />
          </AppErrorBoundary>
        </StrictMode>,
      );
    } else {
      // SPA mode - clear any existing content and use createRoot
      root.innerHTML = '';
      createRoot(root).render(
        <StrictMode>
          <AppErrorBoundary>
            <RemixBrowser />
          </AppErrorBoundary>
        </StrictMode>,
      );
    }
  } catch (error) {
    console.error('Error during React initialization:', error);

    // Fallback to basic rendering
    try {
      root.innerHTML = '';

      const fallbackRoot = createRoot(root);
      fallbackRoot.render(
        <AppErrorBoundary>
          <RemixBrowser />
        </AppErrorBoundary>,
      );
    } catch (fallbackError) {
      console.error('Fatal error during fallback rendering:', fallbackError);

      // Last resort - show error message
      root.innerHTML =
        '<div style="padding: 20px; color: red;"><h1>Application Error</h1><p>Failed to initialize the application. Please try refreshing the page.</p></div>';
    }
  }
});
