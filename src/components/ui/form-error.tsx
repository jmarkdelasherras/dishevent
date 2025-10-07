'use client';


import { motion, AnimatePresence } from 'framer-motion';
import { XCircleIcon } from '@heroicons/react/24/solid';

interface FormErrorProps {
  error?: string;
  showIcon?: boolean;
}

export default function FormError({ error, showIcon = true }: FormErrorProps) {
  if (!error) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="mt-1 flex items-center text-xs text-red-600"
      >
        {showIcon && (
          <XCircleIcon className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
        )}
        <span>{error}</span>
      </motion.div>
    </AnimatePresence>
  );
}