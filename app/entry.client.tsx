import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

startTransition(() => {
  const root = document.getElementById('root');
  if (!root) {
    throw new Error('Root element not found');
  }
  
  // Check if we're in development or production
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    // Development mode - use hydrateRoot for SSR
    hydrateRoot(
      root,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>
    );
  } else {
    // Production SPA mode - use createRoot
    root.innerHTML = '';
    createRoot(root).render(
      <StrictMode>
        <RemixBrowser />
      </StrictMode>
    );
  }
});
