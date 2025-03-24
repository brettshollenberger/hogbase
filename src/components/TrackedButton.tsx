import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackCTAClick } from '../utils/analytics';
interface TrackedButtonProps extends Omit<ButtonProps, 'onClick'> {
  text: string;
  onClick?: () => void;
  href?: string;
  section?: string;
  // Simplified UI controls
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const TrackedButton: React.FC<TrackedButtonProps> = ({
  text,
  className = '',
  onClick,
  variant = 'default',
  size = 'default',
  href,
  section = 'general',
  icon,
  iconPosition = 'right',
  children,
  ...restProps
}) => {
  const handleClick = () => {
    trackCTAClick(text, section);
    onClick?.();
  };

  // Default icon is ArrowRight if none provided
  const iconElement = icon || <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />;

  const buttonProps = {
    className: `group ${className}`,
    variant,
    size,
    onClick: handleClick,
    ...restProps
  };

  const content = (
    <>
      {iconPosition === 'left' && <span className="mr-2">{iconElement}</span>}
      {text}
      {children}
      {iconPosition === 'right' && <span className="ml-2">{iconElement}</span>}
    </>
  );

  if (href) {
    const isExternal = href.startsWith('http');
    return isExternal ? (
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Button {...buttonProps}>{content}</Button>
      </a>
    ) : (
      <Link to={href}>
        <Button {...buttonProps}>{content}</Button>
      </Link>
    );
  }

  return <Button {...buttonProps}>{content}</Button>;
};

export default TrackedButton;