import { ReactNode } from 'react';

export interface Experiment {
  name: string;
  label: string;
  possibleValues: string[];
  defaultValue?: string;
}

export interface ExperimentsProviderProps {
  experiments: Array<Experiment>;
  posthogClient?: any;
  children: ReactNode;
  defaultValues?: Record<string, string>;
  showAdminPanel?: boolean;
}

export interface ExperimentsContextType {
  experiments: Array<Experiment>;
  activeExperiments: Record<string, string>;
  isLovableEnvironment: boolean;
  adminPanelVisible: boolean;
  setExperimentVariant: (experimentName: string, value: string) => void;
  getExperimentVariant: (experimentName: string) => string | null;
  getExperimentConfig: (experimentName: string) => Experiment | null;
  toggleAdminPanel: () => void;
}
