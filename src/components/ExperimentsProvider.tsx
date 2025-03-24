import React, { createContext, useEffect, useState } from 'react';
import posthog from 'posthog-js';
import type { Experiment, ExperimentsContextType } from '../types';

interface ExperimentsProviderProps {
  experiments: Experiment[];
  showAdminPanel?: boolean;
  children: React.ReactNode;
}

export const ExperimentsContext = createContext<ExperimentsContextType>({
  experiments: [],
  getExperimentVariant: () => null,
  setExperimentVariant: () => {},
});

export const ExperimentsProvider: React.FC<ExperimentsProviderProps> = ({
  experiments,
  showAdminPanel = false,
  children,
}) => {
  const [variants, setVariants] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load variants from URL parameters
    const params = new URLSearchParams(window.location.search);
    const newVariants: Record<string, string> = {};
    
    experiments.forEach((experiment) => {
      const variantFromUrl = params.get(experiment.name);
      if (variantFromUrl && experiment.possibleValues.includes(variantFromUrl)) {
        newVariants[experiment.name] = variantFromUrl;
      } else {
        // Randomly assign a variant if not specified in URL
        const randomVariant = experiment.possibleValues[Math.floor(Math.random() * experiment.possibleValues.length)];
        newVariants[experiment.name] = randomVariant;
      }
    });

    setVariants(newVariants);

    // Track experiment assignments in PostHog
    Object.entries(newVariants).forEach(([experimentName, variant]) => {
      posthog.capture('$experiment_started', {
        experiment: experimentName,
        variant: variant,
      });
    });
  }, [experiments]);

  const getExperimentVariant = (experimentName: string): string | null => {
    return variants[experimentName] || null;
  };

  const setExperimentVariant = (experimentName: string, variant: string) => {
    const experiment = experiments.find((e) => e.name === experimentName);
    if (experiment && experiment.possibleValues.includes(variant)) {
      setVariants((prev) => ({
        ...prev,
        [experimentName]: variant,
      }));
      
      // Track variant change in PostHog
      posthog.capture('$experiment_variant_changed', {
        experiment: experimentName,
        variant: variant,
      });
    }
  };

  return (
    <ExperimentsContext.Provider
      value={{
        experiments,
        getExperimentVariant,
        setExperimentVariant,
      }}
    >
      {children}
      {showAdminPanel && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            background: '#fff',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 9999,
          }}
        >
          <h3 style={{ margin: '0 0 0.5rem' }}>Experiment Controls</h3>
          {experiments.map((experiment) => (
            <div key={experiment.name} style={{ marginBottom: '0.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                {experiment.label}:
              </label>
              <select
                value={variants[experiment.name] || ''}
                onChange={(e) => setExperimentVariant(experiment.name, e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.25rem',
                  borderRadius: '4px',
                }}
              >
                {experiment.possibleValues.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </ExperimentsContext.Provider>
  );
};
