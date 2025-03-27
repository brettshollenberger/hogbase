// Type declaration for runtime environment variables
declare global {
  interface Window {
    _env_?: {
      VITE_POSTHOG_KEY?: string;
    };
  }
}

// Environment configuration
const getPosthogKey = () => {
  // Try Vite environment
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_POSTHOG_KEY) {
    return import.meta.env.VITE_POSTHOG_KEY;
  }
  
  // Try process.env (Node.js/webpack environment)
  if (typeof process !== 'undefined' && process.env?.VITE_POSTHOG_KEY) {
    return process.env.VITE_POSTHOG_KEY;
  }
  
  // Try window._env_ (runtime environment variables)
  if (typeof window !== 'undefined' && window._env_?.VITE_POSTHOG_KEY) {
    return window._env_.VITE_POSTHOG_KEY;
  }

  console.warn('PostHog key is not configured. Please set VITE_POSTHOG_KEY in your environment configuration.');
  return '';
};

export const config = {
  posthogKey: getPosthogKey(),
  posthogApiHost: "https://us.i.posthog.com",
  posthogUiHost: "https://us.posthog.com",
} as const;
