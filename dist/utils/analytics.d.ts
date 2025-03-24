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
export declare const identify: (userId?: string, traits?: Record<string, any>) => void;
export declare const initializeAnalytics: (user?: {
    id?: string;
    email?: string;
    name?: string;
    [key: string]: any;
}) => void;
export declare const trackEvent: (eventName: string, properties?: Record<string, any>) => void;
export declare const trackPageView: (pageName: string, section?: string) => void;
export declare const trackLinkClick: (linkText: string, section?: string) => void;
export declare const trackCTAClick: (buttonText: string, section?: string) => void;
export declare const trackTierSelection: (tier: {
    id: string;
    name: string;
    price: number;
}) => void;
export declare const trackSignupAttempt: (tier: {
    id: string;
    name: string;
    price: number;
}) => void;
export declare const trackSignupSuccess: (tier: {
    id: string;
    name: string;
    price: number;
    email: string;
}) => void;
export declare const trackSignupError: (error: string, tier?: {
    id: string;
    name: string;
}) => void;
export declare const trackExperimentView: (posthogClient: any, experiment: string, variant: string, source?: string) => void;
