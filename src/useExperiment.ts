import { useExperimentsContext } from './ExperimentsProvider';

export function useExperiment<T = string>(
  experimentName: string,
  defaultValue: T
): T {
  const { getExperimentVariant } = useExperimentsContext();
  const variant = getExperimentVariant(experimentName);
  return (variant as T) || defaultValue;
}
