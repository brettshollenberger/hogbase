// Environment configuration
export const config = {
  posthogKey: import.meta.env.VITE_POSTHOG_KEY || 'test-key',
  posthogApiHost: "https://us.i.posthog.com",
  posthogUiHost: "https://us.posthog.com",
} as const;
