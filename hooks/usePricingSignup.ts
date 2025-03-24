import { useState } from "react";
import { toast } from "sonner";
import {
  trackTierSelection,
  trackSignupAttempt,
  trackSignupSuccess,
  trackSignupError,
} from "@/utils/analytics";

// Types
export interface PricingPlan {
  id: number;
  name: string;
  price: number;
  billing: string;
  // Add other properties as needed, but these are the ones used in actions
}

export interface UseSignupResult {
  email: string;
  setEmail: (email: string) => void;
  selectedTier: PricingPlan | null;
  setSelectedTier: (plan: PricingPlan | null) => void;
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
export function usePricingSignup(): UseSignupResult {
  const [email, setEmail] = useState("");
  const [selectedTier, setSelectedTier] = useState<PricingPlan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  /**
   * Validates email format
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Handles plan selection and tracks the selection in analytics
   */
  const handlePlanClick = (plan: PricingPlan): void => {
    setSelectedTier(plan);
    setShowModal(true);
    trackTierSelection({
      id: plan.id.toString(),
      name: plan.name,
      price: plan.price,
    });
  };

  /**
   * Handles the signup form submission
   * Returns true if signup was successful, false otherwise
   */
  const handleSubmit = async (e: React.FormEvent): Promise<boolean> => {
    e.preventDefault();

    if (!email || !validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!selectedTier) {
      toast.error("Please select a plan");
      return false;
    }

    // Extract subdomain from current URL
    const hostname = window.location.hostname;
    const subdomain = hostname.split(".")[0];

    // Get the signup counts object from localStorage
    const signupCountsJSON = localStorage.getItem("signupCounts") || "{}";
    const signupCounts = JSON.parse(signupCountsJSON);

    // Get count for this specific subdomain
    const subdomainCount = signupCounts[subdomain] || 0;

    // Set maximum allowed signups per landing page
    const MAX_SIGNUPS_PER_PAGE = 1;
    const adminEmails =
      import.meta.env.VITE_ADMIN_EMAILS?.split(",").map((email) =>
        email.trim()
      ) || [];

    if (
      subdomainCount >= MAX_SIGNUPS_PER_PAGE &&
      !adminEmails.includes(email)
    ) {
      // Block the signup for this specific landing page
      toast.success(
        "You're on the list! We'll let you know when a spot opens up!"
      );
      return false;
    }

    trackSignupAttempt({
      id: selectedTier.id.toString(),
      name: selectedTier.name,
      price: selectedTier.price,
    });

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://cprlzjigtonyooedikbe.supabase.co/functions/v1/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
          },
          body: JSON.stringify({
            email,
            tierId: selectedTier.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up");
      }

      trackSignupSuccess({
        id: selectedTier.id.toString(),
        name: selectedTier.name,
        price: selectedTier.price,
      });

      // Increment signup count for this subdomain only
      signupCounts[subdomain] = subdomainCount + 1;
      localStorage.setItem("signupCounts", JSON.stringify(signupCounts));

      toast.success("Thank you for signing up. We'll be in touch soon!");
      setEmail("");
      setShowModal(false);
      setSelectedTier(null);
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      trackSignupError(
        error instanceof Error ? error.message : "Failed to sign up",
        selectedTier
          ? {
              id: selectedTier.id.toString(),
              name: selectedTier.name,
            }
          : undefined
      );
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to sign up. Please try again."
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    selectedTier,
    isSubmitting,
    showModal,
    setShowModal,
    handlePlanClick,
    handleSubmit,
    validateEmail,
  };
}
