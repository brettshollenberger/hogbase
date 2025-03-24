import { toast } from "sonner";
import {
  trackTierSelection,
  trackSignupAttempt,
  trackSignupSuccess,
  trackSignupError,
} from "@/utils/analytics";

interface PricingPlan {
  id: number;
  name: string;
  price: number;
  // ... other properties not needed for actions
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const handlePlanClick = (plan: PricingPlan): void => {
  trackTierSelection({
    id: plan.id.toString(),
    name: plan.name,
    price: plan.price,
  });
};

export const handleSubmit = async (
  email: string,
  selectedTier: PricingPlan | null
): Promise<[boolean, string | null]> => {
  if (!email || !validateEmail(email)) {
    return [false, "Please enter a valid email address"];
  }

  if (!selectedTier) {
    return [false, "Please select a plan"];
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
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(",").map((email) =>
    email.trim()
  ) || [];

  if (subdomainCount >= MAX_SIGNUPS_PER_PAGE && !adminEmails.includes(email)) {
    return [true, "You're on the list! We'll let you know when a spot opens up!"];
  }

  trackSignupAttempt({
    id: selectedTier.id.toString(),
    name: selectedTier.name,
    price: selectedTier.price,
  });

  try {
    const response = await fetch(
      "https://cprlzjigtonyooedikbe.supabase.co/functions/v1/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          tier: selectedTier.name,
          price: selectedTier.price,
          subdomain,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to sign up");
    }

    // Update signup count in localStorage
    signupCounts[subdomain] = (signupCounts[subdomain] || 0) + 1;
    localStorage.setItem("signupCounts", JSON.stringify(signupCounts));

    trackSignupSuccess({
      id: selectedTier.id.toString(),
      name: selectedTier.name,
      price: selectedTier.price,
    });

    return [true, null];
  } catch (error) {
    trackSignupError({
      id: selectedTier.id.toString(),
      name: selectedTier.name,
      price: selectedTier.price,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return [false, "Failed to sign up. Please try again."];
  }
};
