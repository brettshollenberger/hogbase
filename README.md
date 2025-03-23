# Hogbase

A powerful A/B testing library for web applications that integrates with Google Analytics, PostHog analytics and Lovable.

## Features

- URL parameter-driven experiments
- PostHog integration for tracking
- Lovable environment detection
- Admin panel for easy variant switching
- TypeScript support
- React hooks for easy component integration

## Installation

```bash
npm install @hogbase/experiment-library
# or
yarn add @hogbase/experiment-library
```

## Basic Usage

1. Define your experiments:

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

2. Wrap your app with the provider:

```javascript
import { ExperimentsProvider } from "@your-org/experiment-library";
import { experiments } from "./experiments-config";

function App() {
  return (
    <ExperimentsProvider experiments={experiments}>
      <YourApp />
    </ExperimentsProvider>
  );
}
```

3. Use experiments in components:

```javascript
import { useExperiment } from "@your-org/experiment-library";

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

## URL Parameters

Control experiments via URL parameters with the `phexp_` prefix:

```
https://your-app.com/?phexp_copy=time_savings&phexp_pricing=low_effort
```

## PostHog Integration

```javascript
import posthog from "posthog-js";

// Initialize PostHog
posthog.init("your-project-api-key", {
  api_host: "https://app.posthog.com",
});

// Pass the client to ExperimentsProvider
<ExperimentsProvider experiments={experiments} posthogClient={posthog}>
  <YourApp />
</ExperimentsProvider>;
```

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

## License

MIT
