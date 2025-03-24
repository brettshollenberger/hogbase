// PostHog User type
interface PostHogUser {
  id: string;
  email?: string;
  name?: string;
  signup_date?: string;
  initial_tier?: string;
  initial_price?: number;
  [key: string]: any;
}

// Window interface extension
declare global {
  interface Window {
    __user?: PostHogUser;
    gtag?: (...args: any[]) => void;
  }
}

// Analytics Event Types
interface BaseEventProperties {
  [key: string]: any;
}

type AnalyticsEvent = {
  page_view: {
    page_name: string;
    section?: string;
  };
  cta_clicked: {
    button_text: string;
    section: string;
  };
  tier_selected: {
    tier_id: string;
    tier_name: string;
    price: number;
  };
  signup_attempt: {
    tier_id: string;
    tier_name: string;
    price: number;
  };
  signup_success: {
    tier_id: string;
    tier_name: string;
    price: number;
    product: string;
  };
  signup_error: {
    error: string;
    tier_id?: string;
    tier_name?: string;
  };
};

// Tier Types
interface BaseTier {
  id: string;
  name: string;
  price: number;
}

interface SignupTier extends BaseTier {
  email: string;
}

// Analytics Function Types
type IdentifyTraits = Record<string, any>;
type EventProperties = Record<string, any>;

declare module "posthog-js" {
  const posthog: {
    init(key: string, config?: any): void;
    identify(userId: string, traits?: IdentifyTraits): void;
    capture(eventName: string, properties?: EventProperties): void;
    get_distinct_id(): string;
  };
  export default posthog;
}
