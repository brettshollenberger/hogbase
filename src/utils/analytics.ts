import posthog from "posthog-js";

const posthog_key = import.meta.env.VITE_POSTHOG_KEY!;
const posthog_local_storage_key = `ph_${posthog_key}_posthog`;
posthog.init(posthog_key, {
  api_host: "https://us.i.posthog.com",
  ui_host: "https://us.posthog.com",
  person_profiles: "always",
});

// Extend Window interface to include __user
declare global {
  interface Window {
    __user?: {
      id: string;
      email?: string;
      name?: string;
      [key: string]: any;
    };
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Identify a user with PostHog.
 *
 * If no user ID is provided, it will use the current distinct ID.
 * If the provided user ID is different from the current distinct ID, it will call PostHog's identify method.
 *
 * @param userId The ID of the user to identify.
 * @param traits Additional traits to identify the user with.
 */
export const identify = (userId?: string, traits?: Record<string, any>) => {
  const currentDistinctId = posthog.get_distinct_id();

  if (!userId) {
    const storedUser = localStorage.getItem(posthog_local_storage_key) || '';
    const parsedId = JSON.parse(storedUser)?.distinct_id;
    if (parsedId && typeof parsedId === 'string') {
      userId = parsedId;
      window.__user = {
        id: userId,
      };
    }
  }

  if (currentDistinctId !== userId || window.__user?.email !== traits?.email) {
    if (userId) {
      posthog.identify(userId, traits);
      window.__user = {
        id: userId,
        ...traits,
      };
    }
  }
};

export const initializeAnalytics = (user?: {
  id?: string;
  email?: string;
  name?: string;
  [key: string]: any;
}) => {
  identify(user?.id, user);
};

export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  posthog.capture(eventName, properties);
};

export const trackPageView = (pageName: string, section?: string) => {
  trackEvent("page_view", {
    page_name: pageName,
    section,
  });
};

export const trackLinkClick = (linkText: string, section?: string) => {
  trackEvent("link_clicked", {
    link_text: linkText,
    section,
  });
};

export const trackCTAClick = (buttonText: string, section?: string) => {
  trackEvent("cta_clicked", {
    button_text: buttonText,
    section,
  });
};

export const trackTierSelection = (tier: {
  id: string;
  name: string;
  price: number;
}) => {
  trackEvent("tier_selected", {
    tier_id: tier.id,
    tier_name: tier.name,
    price: tier.price,
  });
};

export const trackSignupAttempt = (tier: {
  id: string;
  name: string;
  price: number;
}) => {
  trackEvent("signup_attempt", {
    tier_id: tier.id,
    tier_name: tier.name,
    price: tier.price,
  });
};

export const trackSignupSuccess = (tier: {
  id: string;
  name: string;
  price: number;
  email: string;
}) => {
  const product = window.location.hostname.split(".")[0];

  if (window.__user?.id) {
    identify(window.__user.id, {
      email: window.__user.email || tier.email,
      name: window.__user.name || tier.name,
      signup_date: new Date().toISOString(),
      initial_tier: tier.name,
      initial_price: tier.price,
    });
  }

  trackEvent("signup_success", {
    tier_id: tier.id,
    tier_name: tier.name,
    price: tier.price,
    product: product,
  });

  window.gtag &&
    window.gtag("event", "signup_success", {
      value: tier.price,
      currency: "USD",
      tier_name: tier.name,
      product: product,
    });
};

export const trackSignupError = (
  error: string,
  tier?: { id: string; name: string }
) => {
  trackEvent("signup_error", {
    error,
    ...(tier && {
      tier_id: tier.id,
      tier_name: tier.name,
    }),
  });
};

export const trackExperimentView = (
  posthogClient: any,
  experiment: string,
  variant: string,
  source: string = 'url'
): void => {
  if (!posthogClient) return;

  posthogClient.capture('experiment_view', {
    experiment,
    variant,
    source
  });
};