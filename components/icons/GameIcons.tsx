
import React from 'react';

// Simplified/stylized icons for demonstration

export const BGMIIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2L3 5V11C3 16.5 7 21.5 12 22C17 21.5 21 16.5 21 11V5L12 2Z" fill="#FBBF24"/>
    <path d="M12 15L9 12H15L12 15Z" fill="#4B5563"/>
    <path d="M12 6V12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const ValorantIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3 3L21 21L12 16L3 3Z" fill="#EF4444"/>
    <path d="M12 8L21 3L3 21L12 8Z" fill="#F87171"/>
  </svg>
);

export const FreeFireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 21.35L1.65 12.25L4.5 3.3L12 6.85L19.5 3.3L22.35 12.25L12 21.35Z" fill="#F97316"/>
    <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" fill="white"/>
  </svg>
);

export const CODIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3 7L12 3L21 7V17L12 21L3 17V7Z" stroke="#A8A29E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 9L12 12L17 9" stroke="#A8A29E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12V21" stroke="#A8A29E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
