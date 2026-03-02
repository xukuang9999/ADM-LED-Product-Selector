import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 400 150" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="ADM Logo"
  >
    <path 
      d="M 10 75 L 200 15 L 390 75 L 200 135 Z M 70 75 L 200 45 L 330 75 L 200 105 Z" 
      fill="#462e84" 
      fillRule="evenodd" 
    />
    <text 
      x="200" 
      y="96" 
      fontFamily="'Arial Black', Impact, Arial, sans-serif" 
      fontSize="58" 
      fontWeight="900" 
      fontStyle="italic" 
      fill="#462e84" 
      textAnchor="middle"
      letterSpacing="-1"
    >
      ADM
    </text>
  </svg>
);
