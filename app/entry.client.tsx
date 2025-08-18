import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Simple error boundary
function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Initialize app
startTransition(() => {
  // Ensure minimal Remix context for SPA mode
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
      routes: {},
      manifest: {
        routes: {},
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

  // Get or create root element
  let rootElement = document.getElementById('root');
  
  if (!rootElement) {
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
  }

  // Create React root and render
  const root = createRoot(rootElement);
  
  root.render(
    <StrictMode>
      <AppErrorBoundary>
        <RemixBrowser />
      </AppErrorBoundary>
    </StrictMode>,
  );
});
