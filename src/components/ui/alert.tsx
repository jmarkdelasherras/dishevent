'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { ReactNode } from 'react';

type AlertType = 'error' | 'warning' | 'info';

interface AlertProps {
  type?: AlertType;
  title?: string;
  message: ReactNode;
  onDismiss?: () => void;
  showIcon?: boolean;
}

export default function Alert({
  type = 'error',
  title,
  message,
  onDismiss,
  showIcon = true,
}: AlertProps) {
  const configs = {
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-700',
      icon: XCircleIcon,
      iconColor: 'text-red-500',
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-800',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-yellow-500',
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-700',
      icon: InformationCircleIcon,
      iconColor: 'text-blue-500',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`${config.bgColor} border-l-4 ${config.borderColor} p-4 rounded-md relative`}
      >
        <div className="flex">
          {showIcon && (
            <div className="flex-shrink-0">
              <Icon className={`h-5 w-5 ${config.iconColor}`} aria-hidden="true" />
            </div>
          )}
          <div className={`${showIcon ? 'ml-3' : ''} flex-1`}>
            {title && <h3 className={`text-sm font-medium ${config.textColor}`}>{title}</h3>}
            <div className={`text-sm ${config.textColor} ${title ? 'mt-1' : ''}`}>
              {typeof message === 'string' ? (
                <p>{message}</p>
              ) : (
                message
              )}
            </div>
          </div>
          {onDismiss && (
            <div className="flex-shrink-0 ml-auto">
              <button
                type="button"
                className={`rounded-md inline-flex ${config.textColor} focus:outline-none`}
                onClick={onDismiss}
              >
                <span className="sr-only">Dismiss</span>
                <XCircleIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
