// Environment configuration
export const config = {
  posthogKey: process.env.VITE_POSTHOG_KEY || 'test-key',
  posthogApiHost: "https://us.i.posthog.com",
  posthogUiHost: "https://us.posthog.com",
} as const;
