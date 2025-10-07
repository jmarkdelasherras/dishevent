'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

type LoaderProps = {
  fullScreen?: boolean;
  message?: string;
  showLogo?: boolean;
};

export default function Loader({
  fullScreen = true,
  message = 'Loading',
  showLogo = true,
}: LoaderProps) {
  const [dots, setDots] = useState('.');
  
  // Animate the loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === '...') return '.';
        return prev + '.';
      });
    }, 400);
    
    return () => clearInterval(interval);
  }, []);

  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 bg-gradient-to-br from-white to-gray-50'
    : 'w-full h-full';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`${containerClasses} flex flex-col items-center justify-center`}
      >
        {showLogo && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: 'spring', 
              stiffness: 260, 
              damping: 20, 
              delay: 0.1 
            }}
            className="mb-6"
          >
            <Image
              src="/assets/logo.png"
              alt="DiShEvent Logo"
              width={80}
              height={80}
              priority
              className="animate-pulse"
            />
          </motion.div>
        )}

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="flex items-center space-x-2">
            {/* Spinner */}
            <div className="relative">
              <motion.div 
                animate={{ 
                  rotate: 360,
                }} 
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "linear" 
                }}
                className="h-6 w-6"
              >
                <div className="absolute h-6 w-6 rounded-full border-2 border-t-[#143F7E] border-r-[#297B46] border-b-[#143F7E] border-l-[#297B46] border-opacity-50"></div>
              </motion.div>
            </div>
            
            {/* Text */}
            <div className="flex">
              <span className="font-medium text-gray-700">{message}</span>
              <motion.span 
                className="w-7 text-left text-[#143F7E]"
                aria-hidden="true"
              >
                {dots}
              </motion.span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}