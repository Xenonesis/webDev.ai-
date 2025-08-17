// Client-side API key export for SPA mode
import { getApiKeysFromCookie } from '~/lib/api/cookies';

export default function ExportApiKeys() {
  // This route is now client-side only for SPA compatibility
  // API keys are exported from cookies and localStorage
  
  if (typeof window !== 'undefined') {
    const apiKeysFromCookie = getApiKeysFromCookie(document.cookie);
    
    // Return JSON response for API compatibility
    return new Response(JSON.stringify(apiKeysFromCookie), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return null;
}
