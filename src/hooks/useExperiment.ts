import { useContext } from 'react';
import { ExperimentsContext } from '../components/ExperimentsProvider';

export function useExperiment<T = string>(experimentName: string, defaultValue: T): T {
  const { getExperimentVariant } = useContext(ExperimentsContext);
  const variant = getExperimentVariant(experimentName);
  return (variant as T) || defaultValue;
}
