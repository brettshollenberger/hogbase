# Experiment Library: Technical Specification

## Overview

This document provides the technical specifications for the experiment library that powers A/B testing across our application. It covers the core components, APIs, implementation details, and integration points.

## Library Structure

```
experiments-library/
├── index.js               # Main exports
├── ExperimentsProvider.js # Core provider component
├── useExperiment.js       # React hook for accessing experiment values
├── types.js               # TypeScript definitions
└── utils/
    ├── environment.js     # Environment detection utilities
    ├── url.js             # URL parameter parsing
    └── tracking.js        # PostHog tracking helpers
```

## Core Components

### ExperimentsProvider

The main provider component that manages experiment state and provides context to the rest of the application.

#### Props

| Prop             | Type                | Required | Description                          |
| ---------------- | ------------------- | -------- | ------------------------------------ |
| `experiments`    | `Array<Experiment>` | Yes      | Array of experiment definitions      |
| `posthogClient`  | `Object`            | No       | PostHog client instance              |
| `children`       | `ReactNode`         | Yes      | Child components                     |
| `defaultValues`  | `Object`            | No       | Default values for experiments       |
| `showAdminPanel` | `boolean`           | No       | Force showing/hiding the admin panel |

#### Experiment Definition Object

```typescript
interface Experiment {
  name: string; // Experiment identifier (used in URL parameters)
  label: string; // Human-readable name
  possibleValues: string[]; // Array of possible variant values
  defaultValue?: string; // Optional default value
}
```

#### Context Value

The provider exposes the following context:

```typescript
interface ExperimentsContextValue {
  experiments: Array<Experiment>;
  activeExperiments: Record<string, string>;
  isLovableEnvironment: boolean;
  adminPanelVisible: boolean;
  setExperimentVariant: (experimentName: string, value: string) => void;
  getExperimentVariant: (experimentName: string) => string | null;
  getExperimentConfig: (experimentName: string) => Experiment | null;
  toggleAdminPanel: () => void;
}
```

### useExperiment Hook

A React hook that provides access to experiment values.

#### Parameters

| Parameter        | Type     | Required | Description                               |
| ---------------- | -------- | -------- | ----------------------------------------- |
| `experimentName` | `string` | Yes      | Name of the experiment to access          |
| `defaultValue`   | `any`    | No       | Default value if experiment is not active |

#### Return Value

Returns the current value for the specified experiment, or the default value if the experiment is not active.

## URL Parameter Convention

The library uses URL parameters with the `phexp_` prefix to control experiments:

```
?phexp_<experiment_name>=<variant_value>
```

Examples:

- `?phexp_copy=time_savings`
- `?phexp_pricing=low_effort`

Multiple parameters can be combined:

```
?phexp_copy=time_savings&phexp_pricing=low_effort
```

## Integration APIs

### PostHog Integration

The library integrates with PostHog for tracking and feature flags.

#### Events Tracked

| Event Name        | Properties                        | Description                                   |
| ----------------- | --------------------------------- | --------------------------------------------- |
| `experiment_view` | `experiment`, `variant`, `source` | Fired when a user views an experiment variant |

#### Feature Flag Format

PostHog feature flags should follow this naming convention:

```
experiment_<experiment_name>_<variant_value>
```

Examples:

- `experiment_copy_time_savings`
- `experiment_pricing_low_effort`

### Google Ads Integration

The library does not directly integrate with Google Ads. Instead, Google Ads campaigns should be configured to include the appropriate URL parameters.

## Environment Detection

The library automatically detects the current environment:

### Lovable Detection

The code considers it's running in Lovable if any of these are true:

- The hostname includes `lovable.ai`
- There's an element with the class `.lovable-editor` in the DOM
- The URL includes the parameter `lovable_editor=true`

### Admin Mode

Admin mode can be activated by:

- Adding `?admin=true` to the URL
- Being in the Lovable environment (automatically activates)

## Admin Panel Specifications

The admin panel provides a UI for toggling between experiment variants.

### Visibility Rules

The admin panel is visible when:

- The application is running in Lovable
- The URL includes `?admin=true`
- The `showAdminPanel` prop is set to `true`

### UI Components

The panel includes:

- A header with the title "Experiment Controls"
- A close button
- A dropdown for each experiment
- Labels showing the current environment

### Styling

The panel uses inline styles for portability with these characteristics:

- Fixed position in the bottom-right corner
- Dark background with light text
- Z-index of 10000 to ensure visibility
- Rounded corners and drop shadow

## Implementation Details

### URL Parameter Parsing

URL parameters are parsed on component mount and when the URL changes:

```javascript
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const initialExperiments = {};

  urlParams.forEach((value, key) => {
    if (key.startsWith("phexp_")) {
      const experimentName = key.substring(6); // 'phexp_'.length
      initialExperiments[experimentName] = value;
    }
  });

  setActiveExperiments(initialExperiments);
}, []);
```

### PostHog Tracking

When a variant is activated, an event is sent to PostHog:

```javascript
if (posthogClient) {
  posthogClient.capture("experiment_view", {
    experiment: experimentName,
    variant: value,
    source: "url_parameter",
  });
}
```

### Feature Flag Checking

If no URL parameter is present, the library checks PostHog feature flags:

```javascript
if (posthogClient) {
  const possibleValues = experiment.possibleValues || [];

  for (const value of possibleValues) {
    const flagName = `experiment_${experimentName}_${value}`;
    if (posthogClient.isFeatureEnabled(flagName)) {
      // Use this variant
      break;
    }
  }
}
```

## Performance Considerations

1. **Lazy Loading**: The admin panel is only rendered when needed
2. **Memoization**: Context values are memoized to prevent unnecessary re-renders
3. **Lightweight**: The core library avoids heavy dependencies

## Error Handling

The library includes error handling for:

1. Missing PostHog client
2. Invalid experiment names
3. Invalid variant values
4. Context usage outside of provider

Errors are logged to the console but don't crash the application.

## Browser Compatibility

The library is compatible with:

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

It requires these browser features:

- ES6 support
- URLSearchParams API
- React 16.8+ (for hooks)

## Extension Points

The library can be extended in several ways:

1. **Custom Storage**: Override the default localStorage behavior
2. **Additional Tracking**: Add custom tracking beyond PostHog
3. **UI Customization**: Override the admin panel styling

## Configuration Options

Advanced configuration can be done through an optional config object:

```javascript
<ExperimentsProvider
  experiments={experiments}
  posthogClient={posthogClient}
  config={{
    urlPrefix: "phexp_", // Change the URL parameter prefix
    storageKey: "exp_admin_state", // Change the localStorage key
    disableUrlParams: false, // Disable URL parameter parsing
    disableFeatureFlags: false, // Disable PostHog feature flags
    panelPosition: "bottom-right", // Admin panel position
  }}
>
  {/* App content */}
</ExperimentsProvider>
```

## TypeScript Support

The library includes full TypeScript definitions:

```typescript
// Example type usage
import { ExperimentsProvider, useExperiment } from "experiments-library";
import type { Experiment } from "experiments-library";

const experiments: Experiment[] = [
  {
    name: "copy",
    label: "Copy Variations",
    possibleValues: ["time_savings", "customer_focused"],
  },
];

// Type-safe experiment usage
const Component = () => {
  // TypeScript knows this returns one of the possibleValues or the default
  const copy = useExperiment("copy", "default");
  // ...
};
```

## Testing

### Unit Tests

The library includes comprehensive unit tests for:

- URL parameter parsing
- Context provider functionality
- Hook behavior
- Environment detection

### Integration Tests

Integration tests verify:

- PostHog integration
- Admin panel functionality
- Component rendering based on variants

### Mocking

Testing utilities include mocks for:

- PostHog client
- URL manipulation
- Environment detection
