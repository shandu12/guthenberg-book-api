'use client';
import React, { ReactNode } from 'react';

interface ButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
}) => {
  return (
    <button 
      onClick={onClick}
      className="shadow-lg bg-gradient-secondary hover:cursor-pointer text-neutral-100 text-shadow-sm text-shadow-gray-500 font-bold rounded-xl px-4 py-1 transition-opacity duration-200 ease-in-out hover:opacity-90 w-fit"
      onMouseEnter={(e) => {
        (e.target as HTMLButtonElement).style.opacity = '0.9';
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLButtonElement).style.opacity = '1';
      }}
    >
      {children}
    </button>
  );
};

export default Button;