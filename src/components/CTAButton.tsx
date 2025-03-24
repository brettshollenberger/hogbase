import React from 'react';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackCTAClick } from '../utils/analytics';

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

const CTAButton: React.FC<CTAButtonProps> = ({ 
  text, 
  className = '', 
  onClick,
  variant = 'default',
  size = 'default',
  href,
  section = 'general',
  children
}) => {
  const handleClick = () => {
    trackCTAClick(text, section);
    onClick?.();
  };

  const ButtonContent = () => (
    <>
      {text}
      {children ? children : <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />}
    </>
  );

  const classes = className ? className : `group ${size === 'lg' ? 'text-lg py-5 px-8' : ''}`;

  const buttonProps = {
    className: classes,
    variant,
    onClick: handleClick
  };

  if (href) {
    return (
      <Link to={href}>
        <Button {...buttonProps}>
          <ButtonContent />
        </Button>
      </Link>
    );
  }

  return (
    <Button {...buttonProps}>
      <ButtonContent />
    </Button>
  );
};

export default CTAButton;
