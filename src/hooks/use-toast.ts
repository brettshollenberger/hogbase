import { useState, useCallback } from 'react';

export type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  duration?: number;
};

type Toast = ToastProps & {
  createdAt: number;
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((props: ToastProps) => {
    const id = props.id || Math.random().toString(36).substr(2, 9);
    const toast: Toast = {
      ...props,
      id,
      createdAt: Date.now(),
    };

    setToasts((currentToasts) => [...currentToasts, toast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
  };
}

export const toast = {
  show: (props: ToastProps) => {
    // This is just a placeholder. The actual implementation will be handled by the Toaster component
    console.log('Toast shown:', props);
  },
};
