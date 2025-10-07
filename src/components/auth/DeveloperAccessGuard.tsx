'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Button from '@/components/ui/button';

// Developer access key - this would be your hardcoded credential
// In a real system, you might want to use an environment variable instead of hardcoding
const DEVELOPER_ACCESS_KEY = 'DISHEVENT_DEV_2025';

// Routes that should be protected with developer access
const PROTECTED_ROUTES = ['/login', '/signup', '/forgot-password'];

// Cookie name to store the developer access token
const DEV_ACCESS_COOKIE = 'dishevent_dev_access';

export default function DeveloperAccessGuard({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const pathname = usePathname();
  
  // Check if the current route should be protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname?.startsWith(route));
  
  useEffect(() => {
    // Check if developer has already been authorized
    const storedAuth = localStorage.getItem(DEV_ACCESS_COOKIE);
    if (storedAuth === DEVELOPER_ACCESS_KEY) {
      setIsAuthorized(true);
    }
    setIsChecking(false);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (accessKey === DEVELOPER_ACCESS_KEY) {
      // Store the authentication in local storage
      localStorage.setItem(DEV_ACCESS_COOKIE, DEVELOPER_ACCESS_KEY);
      setIsAuthorized(true);
    } else {
      alert('Invalid developer access key');
    }
  };
  
  // If not checking and route is not protected, or user is authorized, render children
  if (!isChecking && (!isProtectedRoute || isAuthorized)) {
    return <>{children}</>;
  }
  
  // Show loading while checking authorization
  if (isChecking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }
  
  // Show developer access form if not authorized and route is protected
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Developer Access Required</h2>
          <p className="text-gray-600 mt-2">
            This is a development environment. Please enter the developer access key to continue.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="accessKey" className="block text-gray-700 text-sm font-bold mb-2">
              Developer Access Key
            </label>
            <input
              type="password"
              id="accessKey"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter access key"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Button 
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Authenticate
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-gray-500 text-center">
            <p>This lock is for development purposes only.</p>
            <p>Unauthorized access attempts will be logged.</p>
          </div>
        </form>
      </div>
    </div>
  );
}