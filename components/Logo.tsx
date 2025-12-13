import React from 'react';
// @ts-ignore
import logoUrl from '../assets/logo.svg';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <img 
      src={logoUrl} 
      alt="ThinkLab Logo" 
      className={`object-contain ${className}`}
    />
  );
};

export default Logo;