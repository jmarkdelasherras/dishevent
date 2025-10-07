import { FirebaseError } from 'firebase/app';

/**
 * Format Firebase authentication errors into user-friendly messages
 */
export function formatAuthError(error: unknown): {
  title: string;
  message: string;
  actionType?: 'RESET_PASSWORD' | 'CONTACT_SUPPORT';
} {
  // Default error message
  const defaultError = {
    title: 'Authentication Error',
    message: 'An unexpected error occurred. Please try again.',
  };
  
  // If not a Firebase error, return default
  if (!(error instanceof FirebaseError)) {
    return defaultError;
  }
  
  // Map Firebase auth error codes to user-friendly messages
  switch (error.code) {
    // Email/password related errors
    case 'auth/user-not-found':
      return {
        title: 'Account Not Found',
        message: 'No account found with this email address. Please check your email or create a new account.',
      };
      
    case 'auth/wrong-password':
      return {
        title: 'Incorrect Password',
        message: 'The password you entered is incorrect. Please try again or reset your password.',
        actionType: 'RESET_PASSWORD',
      };
      
    case 'auth/invalid-credential':
      return {
        title: 'Invalid Credentials',
        message: 'The email or password you entered is incorrect. Please try again.',
      };
      
    case 'auth/invalid-email':
      return {
        title: 'Invalid Email',
        message: 'Please enter a valid email address.',
      };
      
    case 'auth/email-already-in-use':
      return {
        title: 'Email Already in Use',
        message: 'This email is already registered. Try signing in instead or use a different email.',
      };
      
    // Account state errors
    case 'auth/account-exists-with-different-credential':
      return {
        title: 'Account Already Exists',
        message: 'An account already exists with the same email but different sign-in credentials. Try signing in using a different method.',
      };
      
    case 'auth/user-disabled':
      return {
        title: 'Account Disabled',
        message: 'Your account has been disabled. Please contact support for assistance.',
        actionType: 'CONTACT_SUPPORT',
      };
      
    // Rate limiting and security errors
    case 'auth/too-many-requests':
      return {
        title: 'Too Many Attempts',
        message: 'Access has been temporarily disabled due to many failed login attempts. You can restore it by resetting your password or try again later.',
        actionType: 'RESET_PASSWORD',
      };
      
    case 'auth/network-request-failed':
      return {
        title: 'Network Error',
        message: 'A network error occurred. Please check your internet connection and try again.',
      };
      
    case 'auth/operation-not-allowed':
      return {
        title: 'Sign-in Method Disabled',
        message: 'This sign-in method is not enabled. Please contact support.',
        actionType: 'CONTACT_SUPPORT',
      };
      
    // Default fallback
    default:
      console.error('Unhandled Firebase auth error:', error.code, error.message);
      return defaultError;
  }
}