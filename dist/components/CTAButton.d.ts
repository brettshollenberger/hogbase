import React from 'react';
interface CTAButtonProps {
    text: string;
    className?: string;
    onClick?: () => void;
    variant?: 'default' | 'outline';
    size?: 'default' | 'lg' | 'sm';
    href?: string;
    section?: string;
    children?: React.ReactNode;
}
declare const CTAButton: React.FC<CTAButtonProps>;
export default CTAButton;
