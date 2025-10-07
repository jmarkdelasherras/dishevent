import { auth } from './config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  confirmPasswordReset,
  onAuthStateChanged,
  UserCredential,
  User,
  Auth,
} from 'firebase/auth';
// Firestore imports temporarily removed
// import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Check if auth is available
const isAuthAvailable = (): boolean => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. This could be because the app is running in a server environment or during build time.');
  }
  return true;
};

// Create a simple user profile (stub since Firestore is disabled)
export const createUserProfile = async (user: User): Promise<void> => {
  console.log('Would create user profile for:', user.uid);
  // Implementation would normally store user data in Firestore
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  try {
    isAuthAvailable();
    
    const userCredential = await createUserWithEmailAndPassword(
      auth as Auth,
      email,
      password
    );
    
    // Update profile with display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName,
      });
      
      // Create user profile
      await createUserProfile(userCredential.user);
    }
    
    return userCredential.user;
  } catch (error) {
    console.error('Error signing up with email:', error);
    throw error;
  }
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    isAuthAvailable();
    const userCredential = await signInWithEmailAndPassword(auth as Auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in with email and password:', error);
    throw error;
  }
};

export const signInWithGoogle = async (): Promise<User> => {
  try {
    isAuthAvailable();
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth as Auth, provider);
    
    // Check if it's a new user and create a profile if needed
    if (userCredential.user) {
      await createUserProfile(userCredential.user);
    }
    
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const logOut = async (): Promise<void> => {
  try {
    isAuthAvailable();
    return await signOut(auth as Auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    isAuthAvailable();
    await sendPasswordResetEmail(auth as Auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

export const confirmPasswordResetAndUpdate = async (
  oobCode: string,
  newPassword: string
): Promise<void> => {
  try {
    isAuthAvailable();
    await confirmPasswordReset(auth as Auth, oobCode, newPassword);
  } catch (error) {
    console.error('Error confirming password reset:', error);
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  if (!auth) return null;
  return auth.currentUser;
};