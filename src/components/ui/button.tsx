'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  loadingText,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'py-2 px-4 rounded-md shadow-sm font-medium focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200';
  
  const variantClasses = {
    primary: 'text-white bg-gradient-to-r from-[#143F7E] to-[#297B46] hover:from-[#0d2c59] hover:to-[#1d6234] focus:ring-[#143F7E]',
    secondary: 'text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-300',
    outline: 'text-[#143F7E] bg-white border border-[#143F7E] hover:bg-gray-50 focus:ring-[#143F7E]',
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClasses} ${className} relative flex items-center justify-center`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <span className={`${isLoading ? 'opacity-0' : 'opacity-100'} flex items-center justify-center`}>
        {children}
      </span>
      
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center space-x-1.5">
            <motion.span
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0,
              }}
              className={`h-2 w-2 rounded-full ${variant === 'outline' ? 'bg-[#143F7E]' : 'bg-white'}`}
            />
            <motion.span
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
              className={`h-2 w-2 rounded-full ${variant === 'outline' ? 'bg-[#143F7E]' : 'bg-white'}`}
            />
            <motion.span
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
              className={`h-2 w-2 rounded-full ${variant === 'outline' ? 'bg-[#143F7E]' : 'bg-white'}`}
            />
          </div>
          {loadingText && (
            <span className={`ml-2 text-sm ${variant === 'outline' ? 'text-[#143F7E]' : 'text-white'}`}>
              {loadingText}
            </span>
          )}
        </span>
      )}
    </button>
  );
}