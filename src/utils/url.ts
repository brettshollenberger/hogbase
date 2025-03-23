export const EXPERIMENT_PARAM_PREFIX = 'phexp_';

export const parseExperimentParams = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};

  const urlParams = new URLSearchParams(window.location.search);
  const experiments: Record<string, string> = {};

  urlParams.forEach((value, key) => {
    if (key.startsWith(EXPERIMENT_PARAM_PREFIX)) {
      const experimentName = key.substring(EXPERIMENT_PARAM_PREFIX.length);
      experiments[experimentName] = value;
    }
  });

  return experiments;
};

export const updateUrlWithExperiment = (
  experimentName: string,
  value: string
): void => {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  url.searchParams.set(`${EXPERIMENT_PARAM_PREFIX}${experimentName}`, value);
  window.history.replaceState({}, '', url.toString());
};
