# Hogbase

A powerful A/B testing library for web applications that integrates with Google Analytics, PostHog analytics and Lovable.

## Features

- URL parameter-driven experiments
- Admin panel for easy variant switching
- PostHog integration for tracking
- Default Posthog methods detailed in analytics.ts
- Lovable integration

## Google Ads Setup

## Basic Usage

1. Define URL params in your Google Ads campaigns using the prefix phexp ("posthog experiment")

```tsx
?phexp_copy=time_savings&phexp_pricing=low_effort
```

2. Define your experiments:

```javascript
// experiments-config.js
export const experiments = [
  {
    name: "copy",
    label: "Copy Variations",
    possibleValues: ["time_savings", "customer_focused", "cost_reduction"],
  },
];
```

3. Wrap your app with the provider:

```javascript
import { ExperimentsProvider } from "@hogbase";
import { experiments } from "./experiments-config";

function App() {
  return (
    <ExperimentsProvider experiments={experiments}>
      <YourApp />
    </ExperimentsProvider>
  );
}
```

4. Use experiments in components:

```javascript
import { useExperiment } from "@hogbase";

function HeroSection() {
  const copyVariant = useExperiment("copy", "default");

  return (
    <div>
      {copyVariant === "time_savings" && <h1>Save Hours Every Week!</h1>}
      {copyVariant === "customer_focused" && <h1>Attract More Customers</h1>}
    </div>
  );
}
```

5. Set an environment variable for PostHog

```bash
export POSTHOG_API_KEY=your-project-api-key
```

6. Add important analytics to your codebase:

Your index page should include initializeAnalytics and trackPageView:

```tsx
import { initializeAnalytics, trackPageView } from "hogbase";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    trackPageView("home");
    initializeAnalytics();
  }, []);

  return <YourIndexPage />;
}
```

All other pages should include `trackPageView`:

```tsx
import { trackPageView } from "hogbase";
import { useEffect } from "react";

export default function Pricing() {
  useEffect(() => {
    trackPageView("page");
  }, []);

  return <YourPage />;
}
```

- All CTAs should have `trackCTAClick` when the user clicks the CTA
- All links should have `trackLinkClick` when the user clicks the link
- Any pricing pages should use the `usePricingSignup` hook

```tsx
import { usePricingSignup } from "hogbase";

const {
  email,
  selectedTier,
  isSubmitting,
  showModal,
  handlePlanClick,
  handleSubmit,
} = usePricingSignup();
```

## Environment Configuration

The PostHog key can be configured in several ways:

1. Using Vite environment variables:
```
# .env
VITE_POSTHOG_KEY=your_key_here
```

2. Using Node.js/webpack environment variables:
```javascript
// webpack.config.js
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.VITE_POSTHOG_KEY': JSON.stringify('your_key_here')
    })
  ]
};
```

3. Using runtime environment variables:
```javascript
window._env_ = {
  VITE_POSTHOG_KEY: 'your_key_here'
};
```

Choose the method that best fits your build environment.

## Admin Panel

The admin panel is automatically shown in:

- Lovable environment
- When URL includes `?admin=true`
- When `showAdminPanel` prop is true

## TypeScript Support

The library includes TypeScript definitions for all components and hooks.

## Development

1. Install dependencies:

```bash
npm install
```

2. Build the library:

```bash
npm run build
```

3. Run tests:

```bash
npm test
```

4. Deploy

```bash
npm run release
```

## License

MIT
