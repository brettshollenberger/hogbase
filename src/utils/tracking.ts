export const trackExperimentView = (
  posthogClient: any,
  experiment: string,
  variant: string,
  source: string = 'url'
): void => {
  if (!posthogClient) return;

  posthogClient.capture('experiment_view', {
    experiment,
    variant,
    source
  });
};
