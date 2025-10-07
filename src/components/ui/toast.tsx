'use client';

import React from 'react';
import { useToast } from '@/hooks/useToast';
import { XCircleIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();
  
  if (toasts.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => {
        let bgColor, icon;
        
        switch (toast.type) {
          case 'success':
            bgColor = 'bg-green-50 border-green-500 text-green-800';
            icon = <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            break;
          case 'error':
            bgColor = 'bg-red-50 border-red-500 text-red-800';
            icon = <XCircleIcon className="h-5 w-5 text-red-500" />;
            break;
          case 'warning':
            bgColor = 'bg-yellow-50 border-yellow-500 text-yellow-800';
            icon = <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />;
            break;
          case 'info':
          default:
            bgColor = 'bg-blue-50 border-blue-500 text-blue-800';
            icon = <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
        }
        
        return (
          <div 
            key={toast.id} 
            className={`p-3 rounded-md shadow-md border ${bgColor} flex items-start animate-fade-in`}
          >
            <div className="flex-shrink-0 mr-2">
              {icon}
            </div>
            <div className="flex-grow pr-6">
              {toast.message}
            </div>
            <button 
              type="button" 
              className="flex-shrink-0 ml-1"
              onClick={() => removeToast(toast.id)}
              aria-label="Close toast"
            >
              <XCircleIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        );
      })}
    </div>
  );
}