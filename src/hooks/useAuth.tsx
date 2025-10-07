'use client';

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
// Firestore imports temporarily removed
// import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmail, signInWithGoogle, signUpWithEmail, logOut, resetPassword } from '@/lib/firebase/auth';

interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  createdAt?: Date | { seconds: number; nanoseconds: number } | null;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, displayName: string) => Promise<User>;
  signInWithGoogleProvider: () => Promise<User>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Skip auth state listener if auth is null (during build or SSR)
    if (!auth) {
      setIsLoading(false);
      return () => {};
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsLoading(true);
      setUser(currentUser);
      
      if (currentUser) {
        console.log('User authenticated:', currentUser.uid);
        // Firestore is disabled, so we'll just use the Firebase Auth user data
        setUserProfile({
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          // Default values for fields that would normally come from Firestore
          subscriptionPlan: 'free',
          subscriptionStatus: 'active',
        });
      } else {
        setUserProfile(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Auth methods
  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmail(email, password);
    return result.user;
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    return await signUpWithEmail(email, password, displayName);
  };

  const signInWithGoogleProvider = async () => {
    const result = await signInWithGoogle();
    return result.user;
  };

  const logout = async () => {
    try {
      // First sign out from Firebase Auth
      await logOut();
      
      // Then remove the session cookie via API
      const response = await fetch('/api/auth/session', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        console.error('Error removing session cookie:', await response.text());
      }
      
      // Force a hard refresh of the page to clear any cached state
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, try to redirect to login
      window.location.href = '/login';
    }
  };

  const forgotPassword = async (email: string) => {
    await resetPassword(email);
  };

  const value = {
    user,
    userProfile,
    isLoading,
    signIn,
    signUp,
    signInWithGoogleProvider,
    logout,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};