# Hogbase Higher Level API

The higher-level API provides lightweight wrappers around common UI patterns to ensure consistent analytics tracking while giving developers complete control over their UI implementation.

First, we define `analytics.ts` which provides the shared analytics functionality:

```typescript
import posthog from "posthog-js";

// Initialize PostHog
const posthog_key = process.env.POSTHOG_KEY!;
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
    const storedUser = localStorage.getItem(posthog_local_storage_key);
    userId = JSON.parse(storedUser)?.distinct_id;
    window.__user = {
      id: userId,
    };
  }

  if (currentDistinctId !== userId || window.__user?.email !== traits?.email) {
    posthog.identify(userId, traits);
    window.__user = {
      id: userId,
      ...traits,
    };
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

export const trackCTAClick = (buttonText: string, section: string) => {
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
```

Next, we'll define lightweight hooks that handle analytics while letting developers maintain complete control over their UI:

```typescript
import { useEffect } from "react";
import {
  trackPageView,
  trackCTAClick,
  trackTierSelection,
  initializeAnalytics,
} from "./analytics";

// Hook to track page views
export const usePageTracking = (pageName: string, section?: string) => {
  useEffect(() => {
    trackPageView(pageName, section);
  }, [pageName, section]);
};

// Hook to initialize analytics
export const useAnalyticsInit = (user?: {
  id?: string;
  email?: string;
  name?: string;
  [key: string]: any;
}) => {
  useEffect(() => {
    initializeAnalytics(user);
  }, [user]);
};

// Hook to create CTA click handlers
export const useCTATracking = (buttonText: string, section: string) => {
  return () => trackCTAClick(buttonText, section);
};

// Hook to create tier selection handlers
export const useTierTracking = (tier: {
  id: string;
  name: string;
  price: number;
}) => {
  return () => trackTierSelection(tier);
};
```

Usage example showing how developers maintain complete control over their UI while ensuring analytics are tracked:

```typescript
import {
  usePageTracking,
  useAnalyticsInit,
  useCTATracking,
  useTierTracking,
} from "@hogbase/analytics";

// Developer defines their own UI components
const Button = ({ children, onClick, className }) => (
  <button onClick={onClick} className={className}>
    {children}
  </button>
);

const PricingTier = ({ tier, className, buttonClassName }) => {
  const handleSelect = useTierTracking(tier);

  return (
    <div className={className}>
      <h3>{tier.name}</h3>
      <div>${tier.price}/mo</div>
      <ul>
        {tier.features.map((feature, i) => (
          <li key={i}>{feature}</li>
        ))}
      </ul>
      <Button onClick={handleSelect} className={buttonClassName}>
        Select {tier.name}
      </Button>
    </div>
  );
};

// Example page component with analytics
export default function HomePage() {
  // Track page view
  usePageTracking("Home");

  // Initialize analytics if user is known
  useAnalyticsInit({ id: "user123", email: "user@example.com" });

  // Create tracked click handler
  const handleGetStarted = useCTATracking("Get Started", "hero");

  const tiers = [
    {
      id: "basic",
      name: "Basic",
      price: 9,
      features: ["Feature 1", "Feature 2"],
    },
    {
      id: "pro",
      name: "Pro",
      price: 29,
      features: ["All Basic features", "Feature 3", "Feature 4"],
    },
  ];

  return (
    <div>
      <h1>Welcome to Our Product</h1>

      {/* Developer has complete control over button styling */}
      <Button onClick={handleGetStarted} className="my-custom-button-class">
        Get Started
      </Button>

      {/* Developer controls grid layout */}
      <div className="pricing-grid">
        {tiers.map((tier) => (
          <PricingTier
            key={tier.id}
            tier={tier}
            className="my-custom-tier-class"
            buttonClassName="my-custom-button-class"
          />
        ))}
      </div>
    </div>
  );
}
```

The higher-level API focuses on:

1. Providing hooks that handle analytics tracking while letting developers maintain complete control over their UI components
2. Ensuring consistent event tracking across the application
3. TypeScript support for better developer experience
4. Zero opinions about UI implementation - developers can use any styling solution or component library they prefer
