'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Loader from '@/components/ui/loader';

type PageTransitionProps = {
  children: React.ReactNode;
};

export default function PageTransition({ children }: PageTransitionProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a small delay for the loading effect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Adjust time as needed for your UX preference
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <Loader key="loader" message="Loading page" fullScreen={false} showLogo={false} />
      ) : (
        <motion.div
          key="page"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}