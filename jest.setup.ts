// Mock Vite's import.meta.env
global.import = {
  meta: {
    env: {
      VITE_POSTHOG_KEY: 'test-key',
      // Add any other environment variables you need for tests
    }
  }
} as any;
