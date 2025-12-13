import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Top Triangle - Professional Red */}
      <path d="M50 5L95 50H5L50 5Z" fill="#D0021B" />
      
      {/* Bottom Left Triangle - Dark Grey */}
      <path d="M5 50H50V95L5 50Z" fill="#1F2937" />
      
      {/* Bottom Right Triangle - Light Grey */}
      <path d="M50 50H95L50 95V50Z" fill="#9CA3AF" />
    </svg>
  );
};

export default Logo;