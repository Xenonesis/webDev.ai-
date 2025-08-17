import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

startTransition(() => {
  const root = document.getElementById('root');
  if (!root) {
    throw new Error('Root element not found');
  }
  
  // Simple environment detection: check if we're in development or production
  // In development, we use SSR. In production (Netlify), we use SPA mode.
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    // Development mode with SSR - use hydrateRoot
    hydrateRoot(
      root,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>
    );
  } else {
    // Production SPA mode - use createRoot and clear loading content
    root.innerHTML = '';
    createRoot(root).render(
      <StrictMode>
        <RemixBrowser />
      </StrictMode>
    );
  }
});
