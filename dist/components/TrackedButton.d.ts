import React from 'react';
import { ButtonProps } from '@/components/ui/button';
interface TrackedButtonProps extends Omit<ButtonProps, 'onClick'> {
    text: string;
    onClick?: () => void;
    href?: string;
    section?: string;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}
export declare const TrackedButton: React.FC<TrackedButtonProps>;
export {};
