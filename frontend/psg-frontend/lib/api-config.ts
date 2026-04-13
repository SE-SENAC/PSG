const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use relative path so Nginx handles it
    return ''; 
  }
  // Server-side (if any SSR): use internal docker network name or env var
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

export const API_BASE_URL = `${getBaseUrl()}/api`;
