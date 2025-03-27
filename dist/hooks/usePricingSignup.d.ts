export interface Feature {
    name: string;
    description: string;
}
export interface PricingPlan {
    id: number;
    name: string;
    description: string;
    price: number;
    billing?: string;
    icon?: React.ReactNode;
    features?: Array<Feature | string>;
    cta?: string;
    color?: string;
    highlighted?: boolean;
    included?: boolean;
}
export interface UseSignupResult {
    email: string;
    setEmail: (email: string) => void;
    selectedTier: PricingPlan | null;
    isSubmitting: boolean;
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    handlePlanClick: (plan: PricingPlan) => void;
    handleSubmit: (e: React.FormEvent) => Promise<boolean>;
    validateEmail: (email: string) => boolean;
}
/**
 * Custom hook to manage pricing plan selection and signup process
 */
export declare function usePricingSignup(): UseSignupResult;
