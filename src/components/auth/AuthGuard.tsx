'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Loader from '@/components/ui/loader';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, user } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Check if route is protected (inside dashboard route group)
  const isProtectedRoute = pathname?.includes('/dashboard') || 
                          pathname?.includes('/events') || 
                          pathname?.includes('/profile') ||
                          pathname?.includes('/subscription');

  // Check if route is auth route (login or signup)
  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    const syncSession = async () => {
      console.log('AuthGuard: syncSession called, isLoading:', isLoading, 'user:', user ? `${user.uid} (${user.email})` : 'null');
      
      // If we have a user in Firebase Auth
      if (user && user.getIdToken) {
        try {
          const token = await user.getIdToken();
          console.log('AuthGuard: Got user token, syncing with session API');
          
          // Sync with our session API
          const response = await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: token }),
          });
          
          // Handle non-200 responses better
          if (!response.ok) {
            console.error('AuthGuard: Session API error:', response.status, response.statusText);
            try {
              // Try to parse the error response for more details
              const errorData = await response.json();
              console.error('AuthGuard: Session API error details:', errorData);
              
              // Check for common error patterns
              if (response.status === 401) {
                console.warn(
                  'AuthGuard: This 401 error often happens when Firebase Admin SDK is not initialized correctly. ' +
                  'Check your FIREBASE_SERVICE_ACCOUNT_KEY environment variable and make sure it matches ' +
                  'the Firebase project used by your client-side config.'
                );
              }
            } catch (parseError) {
              console.error('AuthGuard: Could not parse error response', parseError);
            }
            
            // Even if session API fails, we still have a Firebase auth user
            // so we'll continue with the flow rather than showing an error
          } else {
            try {
              const data = await response.json();
              console.log('AuthGuard: Session API response:', data);
            } catch (jsonError) {
              console.error('AuthGuard: Failed to parse session response', jsonError);
            }
          }
          
          setIsVerified(true);
          
          // Redirect from auth routes if already logged in
          if (isAuthRoute) {
            console.log('AuthGuard: Redirecting to dashboard from auth route');
            router.replace('/dashboard');
          }
        } catch (error) {
          console.error('AuthGuard: Error syncing session:', error);
          setIsVerified(true); // Still set verified to avoid infinite loading
        }
      } else {
        // No user, check if we need to redirect
        console.log('AuthGuard: No user, checking protected route');
        setIsVerified(true);
        
        if (isProtectedRoute) {
          console.log('AuthGuard: Redirecting to login from protected route');
          router.replace('/login');
        }
      }
    };

    if (!isLoading) {
      syncSession();
    }
  }, [isLoading, user, router, isProtectedRoute, isAuthRoute]);

  // Show loading state with our beautiful loader
  if (isLoading || !isVerified) {
    return <Loader message={isLoading ? "Checking authentication" : "Preparing your experience"} />;
  }
  
  return children;
}