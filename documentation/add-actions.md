# Background

Hogbase is an A/B testing library for web applications. It is used to run experiments and track user behavior in order to optimize the performance of the application.

## Task

We're going to add a set of common `actions` that our landing pages use. These are for the pricing page.

## Implementation

Take a look at this example pricing page, and REFACTOR OUT the shared actions (e.g. handlePlanClick, and handleSubmit).

Create a new folder called `actions`, and add `pricing.ts` to it.

Actions should handle the API and analytics type work, and leave the UI work to the components.

E.g.:

```tsx
handleSubmit() {
  // handle API and analytics work here
  // return [ success, error ]
}
```

The UI would then use like:

```tsx
const [success, error] = handleSubmit();
if (success) {
  toast.success("Success!");
} else if (error) {
  toast.error(error);
}
```

You should include "logic" type things in the shared library, such as validateEmail.

```tsx
import { useState, useEffect } from "react";
import { Check, Rocket, Zap, Star, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import {
  trackPageView,
  trackTierSelection,
  trackSignupAttempt,
  trackSignupSuccess,
  trackSignupError,
} from "@/utils/analytics";

const pricingPlans = [
  {
    id: 17,
    name: "Starter",
    description: "Perfect for solo founders testing the waters",
    price: 49,
    billing: "monthly",
    icon: <Rocket className="w-6 h-6 text-launch-orange" />,
    features: [
      "Test 3 business ideas",
      "Basic analytics",
      "Custom landing pages",
      "Email lead collection",
      "7 days of data",
      "Email support",
    ],
    cta: "Launch Your Ideas",
    color: "border-gray-200",
    highlighted: false,
  },
  {
    id: 18,
    name: "Pro",
    description: "For serious founders ready to validate at scale",
    price: 99,
    billing: "monthly",
    icon: <Zap className="w-6 h-6 text-launch-orange" />,
    features: [
      "Test 10 business ideas",
      "Advanced analytics with heatmaps",
      "A/B testing capabilities",
      "Custom domains",
      "Checkout simulation",
      "14 days of data",
      "Priority email support",
      "Idea optimization reports",
    ],
    cta: "Launch Your Ideas",
    color: "border-launch-orange",
    highlighted: true,
  },
  {
    id: 19,
    name: "Enterprise",
    description: "Maximum validation for teams with multiple ventures",
    price: 249,
    billing: "monthly",
    icon: <Star className="w-6 h-6 text-launch-orange" />,
    features: [
      "Test unlimited business ideas",
      "Enterprise-grade analytics",
      "Full A/B testing suite",
      "Custom domains & branding",
      "Real payment processing",
      "30 days of data",
      "24/7 priority support",
      "Dedicated success manager",
      "API access",
      "White-label option",
    ],
    cta: "Launch Your Ideas",
    color: "border-gray-200",
    highlighted: false,
  },
];

const Pricing = () => {
  const [email, setEmail] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBetaModal, setShowBetaModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<
    (typeof pricingPlans)[0] | null
  >(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView("pricing");
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePlanClick = (plan: (typeof pricingPlans)[0]) => {
    setSelectedTier(plan);
    setShowBetaModal(true);
    trackTierSelection({
      id: plan.id.toString(),
      name: plan.name,
      price: plan.price,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!selectedTier) {
      toast.error("Please select a plan");
      return;
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
      setShowBetaModal(false);
      setSelectedTier(null);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24">
        <section className="py-20 bg-white">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Pick The Perfect Plan For Your
                <span className="text-launch-orange"> Validation Journey</span>
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                All plans include our core idea validation platform. Choose the
                option that best fits your entrepreneurial ambitions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    plan.highlighted
                      ? "border-2 border-launch-orange transform -translate-y-2"
                      : "border border-gray-100"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute top-0 right-0 bg-launch-orange text-white py-1 px-4 text-sm font-medium rounded-bl-lg">
                      Most Popular
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      {plan.icon}
                      <h3 className="text-xl font-bold ml-2">{plan.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-6 h-12">
                      {plan.description}
                    </p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-gray-500">/{plan.billing}</span>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="text-launch-orange mr-2 mt-0.5 flex-shrink-0 w-5 h-5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handlePlanClick(plan)}
                      className={`w-full py-3 px-6 rounded-lg ${
                        plan.highlighted
                          ? "bg-launch-orange text-white hover:bg-orange-600"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                      } font-medium transition-all`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Beta Signup Modal */}
        {showBetaModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <Rocket className="h-6 w-6 text-launch-orange mr-2" />
                  <h3 className="text-xl font-bold">
                    We are in closed private beta.
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowBetaModal(false);
                    setSelectedTier(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Enter your email to be added to the waitlist for the{" "}
                  {selectedTier?.name} plan. We'll let you know as soon as we
                  have a spot available.
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-launch-orange focus:border-transparent"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-launch-orange text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Signing up..." : "Get On The Waitlist"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
```
