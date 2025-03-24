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
export declare function useToast(): {
    toasts: Toast[];
    addToast: (props: ToastProps) => string;
    removeToast: (id: string) => void;
};
export declare const toast: {
    show: (props: ToastProps) => void;
};
export {};
