// Environment configuration
const REQUIRED_POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;

if (!REQUIRED_POSTHOG_KEY) {
  console.error('PostHog key is not configured. Please set VITE_POSTHOG_KEY in your .env file.');
}

export const config = {
  posthogKey: REQUIRED_POSTHOG_KEY || '',
  posthogApiHost: "https://us.i.posthog.com",
  posthogUiHost: "https://us.posthog.com",
} as const;
