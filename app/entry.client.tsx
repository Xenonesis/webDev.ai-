import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

startTransition(() => {
  const root = document.getElementById('root');
  if (!root) {
    throw new Error('Root element not found');
  }
  
  // Check if we're in SSR mode (development) or SPA mode (production)
  const isSSR = root.innerHTML.trim() !== '';
  
  if (isSSR) {
    // Development mode with SSR - use hydrateRoot
    hydrateRoot(
      root,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>
    );
  } else {
    // SPA mode (production) - use createRoot
    createRoot(root).render(
      <StrictMode>
        <RemixBrowser />
      </StrictMode>
    );
  }
});
