import posthog from "posthog-js";

// Mock PostHog initialization
const mockPosthogInit = jest.fn();
posthog.init = mockPosthogInit;

// Mock all analytics functions
export const identify = jest.fn();
export const initializeAnalytics = jest.fn();
export const trackEvent = jest.fn();
export const trackPageView = jest.fn();
export const trackLinkClick = jest.fn();
export const trackCTAClick = jest.fn();
export const trackTierSelection = jest.fn();
export const trackSignupAttempt = jest.fn();
export const trackSignupSuccess = jest.fn();
export const trackSignupError = jest.fn();
export const trackExperimentView = jest.fn();

// Export mocked posthog instance
export default posthog;
