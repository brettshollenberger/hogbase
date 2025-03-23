export const isLovableEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;

  return (
    window.location.hostname.includes('lovable.ai') ||
    document.querySelector('.lovable-editor') !== null ||
    new URLSearchParams(window.location.search).has('lovable_editor')
  );
};

export const isAdminMode = (): boolean => {
  if (typeof window === 'undefined') return false;

  return (
    isLovableEnvironment() ||
    new URLSearchParams(window.location.search).has('admin')
  );
};
