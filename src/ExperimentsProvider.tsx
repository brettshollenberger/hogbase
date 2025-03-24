import React, { createContext, useContext, useEffect, useState, ReactNode, ChangeEvent } from 'react';
import { ExperimentsContextType, ExperimentsProviderProps, Experiment } from './types';
import { isLovableEnvironment, isAdminMode } from './utils/environment';
import { parseExperimentParams, updateUrlWithExperiment } from './utils/url';
import { trackExperimentView } from './utils/tracking';

const ExperimentsContext = createContext<ExperimentsContextType | undefined>(undefined);

export const ExperimentsProvider: React.FC<ExperimentsProviderProps> = ({
  experiments,
  posthogClient,
  children,
  defaultValues = {},
  showAdminPanel = false,
}) => {
  const [activeExperiments, setActiveExperiments] = useState<Record<string, string>>({});
  const [adminPanelVisible, setAdminPanelVisible] = useState(false);
  const lovableEnvironment = isLovableEnvironment();

  useEffect(() => {
    // Initialize from URL parameters
    const urlExperiments = parseExperimentParams();
    setActiveExperiments((prev: Record<string, string>) => ({
      ...defaultValues,
      ...prev,
      ...urlExperiments
    }));

    // Initialize admin panel visibility
    setAdminPanelVisible(showAdminPanel || isAdminMode());
  }, []);

  useEffect(() => {
    // Track experiments in PostHog
    Object.entries(activeExperiments).forEach(([experiment, variant]) => {
      if (typeof variant === 'string') {
        trackExperimentView(posthogClient, experiment, variant);
      }
    });
  }, [activeExperiments, posthogClient]);

  const setExperimentVariant = (experimentName: string, value: string) => {
    setActiveExperiments((prev: Record<string, string>) => ({
      ...prev,
      [experimentName]: value
    }));
    updateUrlWithExperiment(experimentName, value);
  };

  const getExperimentVariant = (experimentName: string): string | null => {
    return activeExperiments[experimentName] || null;
  };

  const getExperimentConfig = (experimentName: string): Experiment | null => {
    return experiments.find((exp: Experiment) => exp.name === experimentName) || null;
  };

  const toggleAdminPanel = () => {
    setAdminPanelVisible((prev: boolean) => !prev);
  };

  const value: ExperimentsContextType = {
    experiments,
    activeExperiments,
    isLovableEnvironment: lovableEnvironment,
    adminPanelVisible,
    setExperimentVariant,
    getExperimentVariant,
    getExperimentConfig,
    toggleAdminPanel
  };

  return (
    <ExperimentsContext.Provider value={value}>
      {children}
      {adminPanelVisible && <AdminPanel />}
    </ExperimentsContext.Provider>
  );
};

const AdminPanel: React.FC = () => {
  const context = useContext(ExperimentsContext);
  if (!context) throw new Error('AdminPanel must be used within ExperimentsProvider');

  const {
    experiments,
    activeExperiments,
    setExperimentVariant,
    toggleAdminPanel,
    isLovableEnvironment
  } = context;

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 10000,
    maxWidth: '300px'
  };

  return (
    <div style={panelStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <h3 style={{ margin: 0 }}>Experiment Controls</h3>
        <button
          onClick={toggleAdminPanel}
          style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '20px'
          }}
        >
          ×
        </button>
      </div>
      {experiments.map((experiment: Experiment) => {
        const selectId = `experiment-${experiment.name}`;
        return (
          <div key={experiment.name} style={{ marginBottom: '10px' }}>
            <label
              htmlFor={selectId}
              style={{ display: 'block', marginBottom: '5px' }}
            >
              {experiment.label}
            </label>
            <select
              id={selectId}
              value={activeExperiments[experiment.name] || ''}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setExperimentVariant(experiment.name, e.target.value)}
              style={{
                width: '100%',
                padding: '5px',
                backgroundColor: '#2a2a2a',
                color: '#ffffff',
                border: '1px solid #3a3a3a',
                borderRadius: '4px'
              }}
            >
              <option value="">Default</option>
              {experiment.possibleValues.map((value: string) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        );
      })}
      <div style={{ marginTop: '15px', fontSize: '12px', color: '#888' }}>
        Environment: {isLovableEnvironment ? 'Lovable' : 'Production'}
      </div>
    </div>
  );
};

export const useExperimentsContext = (): ExperimentsContextType => {
  const context = useContext(ExperimentsContext);
  if (!context) {
    throw new Error('useExperimentsContext must be used within ExperimentsProvider');
  }
  return context;
};
