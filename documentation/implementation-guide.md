# Implementation Guide: Integrating the Experiment System

This guide provides step-by-step instructions for implementing the experiment system in your application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Basic Setup](#basic-setup)
4. [Defining Experiments](#defining-experiments)
5. [Adding Experiment Components](#adding-experiment-components)
6. [Setting Up PostHog](#setting-up-posthog)
7. [Configuring Google Ads](#configuring-google-ads)
8. [Lovable Integration](#lovable-integration)
9. [Testing Your Implementation](#testing-your-implementation)
10. [Deployment Checklist](#deployment-checklist)

## Prerequisites

Before beginning implementation, ensure you have:

- React application (v16.8+ for hooks support)
- PostHog account (for production)
- Google Ads account (for driving traffic)
- Lovable account (for design iterations)

## Installation

### 1. Install the Library

```bash
# If using npm
npm install @your-org/experiment-library

# If using yarn
yarn add @your-org/experiment-library
```

### 2. Install PostHog (if not already installed)

```bash
npm install posthog-js
# or
yarn add posthog-js
```

## Basic Setup

### 1. Create Experiment Configuration

Create a file called `experiments-config.js` in your project:

```javascript
// experiments-config.js
export const experiments = [
  {
    name: 'copy',
    label: 'Copy Variations',
    possibleValues: ['time_savings', 'customer_focused', 'cost_reduction']
  },
  {
    name: 'pricing',
    label: 'Pricing CTA',
    possibleValues: ['low_effort', 'high_effort', 'free_trial']
  },
  // Add more experiments as needed
];
```

### 2. Add Provider to Your App

Wrap your application with the `ExperimentsProvider`:

```javascript
// App.js or index.js
import React from 'react';
import { ExperimentsProvider } from '@your-org/experiment-library';
import { experiments } from './experiments-config';
import posthog from 'posthog-js';

// Initialize PostHog (only in production)
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
      <Header />
      <HeroSection />
      <FeaturesList />
      <Footer />
    </ExperimentsProvider>
  );
}

export default App;
```

## Defining Experiments

For each area of your application you want to test, define an experiment in the configuration file:

### Example: Adding a New Experiment

```javascript
// experiments-config.js
export const experiments = [
  // Existing experiments...
  
  {
    name: 'feature_list',
    label: 'Feature List Layout',
    possibleValues: ['grid', 'list', 'carousel']
  }
];
```

### Best Practices for Defining Experiments

1. **Use clear, descriptive names**: Make the experiment purpose obvious
2. **Keep values simple**: Use lowercase, no spaces, underscores instead of dashes
3. **Group related variations**: Multiple aspects of the same component should use the same experiment name
4. **Document potential conflicts**: Note if certain experiments shouldn't be combined

## Adding Experiment Components

### 1. Basic Component Integration

Modify your components to use the `useExperiment` hook:

```javascript
// HeroSection.js
import React from 'react';
import { useExperiment } from '@your-org/experiment-library';

const HeroSection = () => {
  const copyVariant = useExperiment('copy', 'default');
  
  // Simple conditional rendering
  if (copyVariant === 'time_savings') {
    return (
      <div className="hero">
        <h1>Save Hours Every Week!</h1>
        <p>Our customers save 10+ hours on average</p>
        <button>Start Saving Time</button>
      </div>
    );
  }
  
  if (copyVariant === 'customer_focused') {
    return (
      <div className="hero">
        <h1>Attract More Customers</h1>
        <p>Increase customer acquisition by up to 40%</p>
        <button>Grow Your Business</button>
      </div>
    );
  }
  
  // Default variant
  return (
    <div className="hero">
      <h1>Welcome to Our Platform</h1>
      <p>The solution for modern businesses</p>
      <button>Get Started</button>
    </div>
  );
};

export default HeroSection;
```

### 2. Advanced Component Integration

For more complex components, use object mappings:

```javascript
// HeroSection.js
import React from 'react';
import { useExperiment } from '@your-org/experiment-library';

// Define all copy variations
const copyVariants = {
  time_savings: {
    headline: "Save Hours Every Week!",
    subheadline: "Our customers save 10+ hours weekly with our solution",
    buttonText: "Start Saving Time"
  },
  customer_focused: {
    headline: "Attract More Customers",
    subheadline: "Increase customer acquisition by up to 40%",
    buttonText: "Grow Your Business"
  },
  cost_reduction: {
    headline: "Reduce Costs by 35%",
    subheadline: "Lower your operational expenses dramatically",
    buttonText: "Start Saving Money"
  },
  default: {
    headline: "Welcome to Our Platform",
    subheadline: "The solution for modern businesses",
    buttonText: "Get Started"
  }
};

// Hero component
const HeroSection = () => {
  const copyVariant = useExperiment('copy', 'default');
  const layoutVariant = useExperiment('layout', 'default');
  
  // Get copy for the active variant
  const copy = copyVariants[copyVariant] || copyVariants.default;
  
  // Determine layout class based on the layout variant
  let layoutClass = '';
  if (layoutVariant === 'compact') {
    layoutClass = 'hero-compact';
  } else if (layoutVariant === 'centered') {
    layoutClass = 'hero-centered';
  }
  
  return (
    <div className={`hero ${layoutClass}`}>
      <div className="hero-content">
        <h1>{copy.headline}</h1>
        <p>{copy.subheadline}</p>
        <button>{copy.buttonText}</button>
      </div>
    </div>
  );
};

export default HeroSection;
```

### 3. Component with Multiple Experiment Aspects

When combining multiple experiment aspects:

```javascript
// PricingSection.js
import React from 'react';
import { useExperiment } from '@your-org/experiment-library';

const PricingSection = () => {
  const pricingModel = useExperiment('pricing_model', 'monthly');
  const featureHighlight = useExperiment('feature_highlight', 'default');
  const ctaStyle = useExperiment('pricing_cta', 'default');
  
  // Calculate prices based on model
  const prices = pricingModel === 'annual' 
    ? { starter: 29, pro: 79, enterprise: 199 }
    : { starter: 39, pro: 99, enterprise: 249 };
  
  // Determine which feature to highlight
  const highlightedFeatures = {
    support: 'Priority 24/7 Support',
    api: 'Unlimited API Access',
    users: 'Unlimited Users',
    default: 'All Features Included'
  };
  
  const highlight = highlightedFeatures[featureHighlight] || highlightedFeatures.default;
  
  // CTA button style
  const ctaClasses = {
    urgent: 'cta-button cta-urgent',
    subtle: 'cta-button cta-subtle',
    default: 'cta-button'
  };
  
  const buttonClass = ctaClasses[ctaStyle] || ctaClasses.default;
  
  return (
    <div className="pricing-section">
      <h2>Pricing Plans</h2>
      <div className="pricing-toggle">
        <span className={pricingModel === 'monthly' ? 'active' : ''}>Monthly</span>
        <span className={pricingModel === 'annual' ? 'active' : ''}>Annual (Save 20%)</span>
      </div>
      
      <div className="pricing-cards">
        <div className="pricing-card">
          <h3>Starter</h3>
          <div className="price">${prices.starter}/mo</div>
          <ul>
            <li>Basic Features</li>
            <li>5 Users</li>
            <li>5GB Storage</li>
            <li className={featureHighlight === 'default' ? 'highlighted' : ''}>
              {highlight}
            </li>
          </ul>
          <button className={buttonClass}>Choose Starter