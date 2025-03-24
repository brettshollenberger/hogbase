# Experiment System: Architecture and Implementation Guide

## Overview

This document outlines the architecture and implementation of our experiment system, which enables efficient A/B testing across our web application. The system integrates Google Ads, PostHog, and Lovable to create a seamless workflow for running, tracking, and iterating on experiments.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Key Components](#key-components)
3. [URL Parameter Convention](#url-parameter-convention)
4. [Setting Up Experiments](#setting-up-experiments)
5. [Component Integration](#component-integration)
6. [Google Ads Configuration](#google-ads-configuration)
7. [PostHog Integration](#posthog-integration)
8. [Lovable Integration](#lovable-integration)
9. [Developer Workflow](#developer-workflow)
10. [Designer Workflow](#designer-workflow)
11. [Troubleshooting](#troubleshooting)
12. [Best Practices](#best-practices)

## System Architecture

The experiment system is built on three pillars:

1. **Parameter-driven experiments**: All experiment variants are controlled via URL parameters that cascade through the application.
2. **Centralized experiment definitions**: Experiments are defined in one place, making them easy to manage.
3. **Environment detection**: The system behaves differently in development, Lovable, and production environments.

### Data Flow

```
Google Ads → URL Parameters → ExperimentsProvider → Components → PostHog Tracking
```

1. Google Ads campaigns send users to the site with specific URL parameters
2. The `ExperimentsProvider` parses these parameters and establishes the active experiments
3. Components use the `useExperiment` hook to render the appropriate variant
4. PostHog records which variants users see and their subsequent behavior

## Key Components

### 1. ExperimentsProvider

The core component that manages experiment state. It:
- Wraps the entire application
- Reads URL parameters
- Integrates with PostHog
- Provides an admin panel in Lovable
- Exposes experiment values via context

```javascript
<ExperimentsProvider 
  experiments={experiments}
  posthogClient={posthogClient}
>
  <App />
</ExperimentsProvider>
```

### 2. useExperiment Hook

A React hook that components use to access experiment values:

```javascript
// Simple usage with a default value if the experiment isn't active
const copyVariant = useExperiment('copy', 'default');
```

### 3. Experiment Configuration

A central configuration object that defines all available experiments:

```javascript
export const experiments = [
  {
    name: 'copy',  // Used in phexp_copy URL parameter
    label: 'Copy Variations',  // Human-readable name
    possibleValues: ['time_savings', 'customer_focused', 'cost_reduction']
  },
  {
    name: 'pricing',
    label: 'Pricing CTA',
    possibleValues: ['low_effort', 'high_effort', 'free_trial']
  }
  // Additional experiments...
];
```

## URL Parameter Convention

All experiment parameters use the `phexp_` prefix followed by the experiment name:

- `?phexp_copy=time_savings` - Sets the "copy" experiment to "time_savings" variant
- `?phexp_pricing=low_effort` - Sets the "pricing" experiment to "low_effort" variant
- `?phexp_layout=compact` - Sets the "layout" experiment to "compact" variant

Multiple parameters can be combined:
```
https://example.com/?phexp_copy=time_savings&phexp_pricing=low_effort
```

### Parameter Hierarchy

When determining which variant to show, the system follows this hierarchy:
1. URL parameters (highest priority)
2. PostHog feature flags (if available)
3. Default values (lowest priority)

## Setting Up Experiments

### 1. Install the Library

```bash
npm install @your-org/experiment-library
```

### 2. Define Experiments

Create a configuration file:

```javascript
// experiments-config.js
export const experiments = [
  {
    name: 'copy',
    label: 'Copy Variations',
    possibleValues: ['time_savings', 'customer_focused', 'cost_reduction']
  },
  // Additional experiments...
];
```

### 3. Initialize the Provider

In your app's entry point:

```javascript
import React from 'react';
import { ExperimentsProvider } from '@your-org/experiment-library';
import { experiments } from './experiments-config';
import posthog from 'posthog-js';

// Initialize PostHog in production only
let posthogClient = null;
if (process.env.NODE_ENV === 'production') {
  posthogClient = posthog;
  posthogClient.init('your-project-api-key', {
    api_host: 'https://app.posthog.com'
  });
}

function App() {
  return (
    <ExperimentsProvider 
      experiments={experiments}
      posthogClient={posthogClient}
    >
      {/* Your app components */}
    </ExperimentsProvider>
  );
}
```

## Component Integration

### Basic Integration Pattern

Components should use the `useExperiment` hook to access experiment values:

```javascript
import React from 'react';
import { useExperiment } from '@your-org/experiment-library';

const Hero = () => {
  const copyVariant = useExperiment('copy', 'default');
  const pricingVariant = useExperiment('pricing', 'default');
  
  // Implement variant-specific logic here...
  
  return (
    <div>
      {/* Render based on variants */}
    </div>
  );
};
```

### Modular Component Pattern

For more complex components, use object mappings to organize variants:

```javascript
// Define variant content or components
const copyVariants = {
  time_savings: { 
    headline: "Save Hours Every Week!", 
    subheadline: "Our customers save 10+ hours weekly"
  },
  customer_focused: { 
    headline: "Attract More Customers", 
    subheadline: "Increase customer acquisition by up to 40%"
  },
  default: { 
    headline: "Welcome to Our Platform", 
    subheadline: "The solution for modern businesses"
  }
};

// For component variants
const ctaButtons = {
  low_effort: LowEffortButton,
  high_effort: HighEffortButton,
  default: DefaultButton
};

// In your component
const Hero = () => {
  const copyVariant = useExperiment('copy', 'default');
  const pricingVariant = useExperiment('pricing', 'default');
  
  // Get copy content
  const copy = copyVariants[copyVariant] || copyVariants.default;
  
  // Get CTA button component
  const CTAButton = ctaButtons[pricingVariant] || ctaButtons.default;
  
  return (
    <section className="hero">
      <h1>{copy.headline}</h1>
      <h2>{copy.subheadline}</h2>
      <CTAButton />
    </section>
  );
};
```

## Google Ads Configuration

### Setting Up Campaign Parameters

1. Create ad groups or campaigns for each experiment combination
2. Add the experiment parameters to the destination URLs

#### Example URL Structures

For a simple test of copy variations:
- Ad Group A: `https://example.com/?phexp_copy=time_savings`
- Ad Group B: `https://example.com/?phexp_copy=customer_focused`

For testing multiple aspects simultaneously:
- Campaign 1: `https://example.com/?phexp_copy=time_savings&phexp_pricing=low_effort`
- Campaign 2: `https://example.com/?phexp_copy=time_savings&phexp_pricing=high_effort`
- Campaign 3: `https://example.com/?phexp_copy=customer_focused&phexp_pricing=low_effort`

### URL Configuration Steps in Google Ads

1. In Google Ads, go to your campaign
2. Select an ad group
3. Edit the ads
4. Modify the "Final URL" to include your parameters
5. Save changes

### Tracking in Google Ads

Use UTM parameters alongside experiment parameters for proper tracking:
```
?utm_source=google&utm_medium=cpc&utm_campaign=test&phexp_copy=time_savings
```

## PostHog Integration

The experiment system automatically tracks experiment views in PostHog:

1. When a user sees an experiment variant, an `experiment_view` event is sent to PostHog
2. The event includes:
   - `experiment`: The name of the experiment (e.g., "copy")
   - `variant`: The active variant (e.g., "time_savings")
   - `source`: Where it came from ("url_parameter" or "posthog_feature_flag")

### Setting Up PostHog Feature Flags

Feature flags provide an alternative way to control experiments:

1. In PostHog, create a feature flag for each variant:
   - `experiment_copy_time_savings`
   - `experiment_copy_customer_focused`
   - etc.

2. Set up targeting rules (% of users, specific cohorts, etc.)

3. The experiment system will check these flags if no URL parameter is present

### Analyzing Results

In PostHog:

1. Create funnels starting with the `experiment_view` event
2. Break down by `variant` to see performance differences
3. Use insights to compare conversion rates across variants

## Lovable Integration

The experiment system includes special handling for Lovable:

1. It automatically detects when running in the Lovable environment
2. It displays an admin panel for toggling between variants
3. It doesn't attempt to use PostHog when in Lovable

### Designer Workflow in Lovable

1. Open the page in Lovable
2. Use the admin panel (automatically displayed in the bottom right)
3. Select different variants for each experiment
4. Design and adjust components based on the active variants
5. The selections persist across page loads within Lovable

### Admin Panel Features

The admin panel in Lovable:
- Shows all available experiments
- Lets you toggle between all possible values
- Only appears in Lovable or when `?admin=true` is added to the URL
- Doesn't appear for regular users

## Developer Workflow

### Adding a New Experiment

1. Add the experiment definition to `experiments-config.js`:
   ```javascript
   {
     name: 'new_experiment',
     label: 'New Experiment Name',
     possibleValues: ['variant_a', 'variant_b', 'variant_c']
   }
   ```

2. Modify components to use the new experiment:
   ```javascript
   const newExperimentValue = useExperiment('new_experiment', 'default');
   ```

3. Create the variant implementations (copy, components, styles)

4. Test in Lovable using the admin panel

5. Update Google Ads campaigns with the new parameters

### Testing Experiments Locally

1. Run the application locally
2. Add parameters to the URL:
   ```
   http://localhost:3000/?phexp_copy=time_savings&phexp_pricing=low_effort
   ```
3. Or use the admin panel by adding `?admin=true` to the URL

## Designer Workflow

1. Access the site through Lovable
2. Use the admin panel to toggle between experiment variants
3. Make design adjustments as needed
4. Preview how different variant combinations look
5. Collaborate with developers on implementing design changes

## Troubleshooting

### Common Issues

1. **Variants not appearing**
   - Check browser console for errors
   - Verify URL parameters are correctly formatted
   - Ensure experiment names match in the URL and configuration

2. **PostHog not tracking experiments**
   - Verify PostHog is initialized correctly
   - Check for errors in the browser console
   - Ensure the experiment configuration matches PostHog feature flags

3. **Admin panel not appearing in Lovable**
   - Check if the Lovable environment detection is working
   - Try adding `?admin=true` to the URL

## Best Practices

### Experiment Design

1. **Focus on one thing at a time**: Test specific hypotheses
2. **Use descriptive names**: Make parameter values clear and self-documenting
3. **Keep variants distinct**: Ensure differences are noticeable enough to matter
4. **Test meaningful changes**: Focus on changes that could impact business metrics

### Code Organization

1. **Centralize variant definitions**: Keep all variants for a component together
2. **Use default fallbacks**: Always provide default options
3. **Separate content from presentation**: Define copy separately from layout
4. **Use type checking**: Add TypeScript for better type safety

### Campaign Management

1. **Document experiment goals**: Define what success looks like before launching
2. **Set expiration dates**: Plan how long each test will run
3. **Allocate traffic properly**: Ensure sufficient volume for statistical significance
4. **Keep track of all running experiments**: Maintain a log of active tests

## Conclusion

This experiment system provides a flexible, maintainable architecture for running A/B tests across our platform. By integrating Google Ads, PostHog, and Lovable, it creates a seamless workflow for marketers, designers, and developers to collaboratively optimize the user experience and conversion rates.
