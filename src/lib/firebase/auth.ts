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
} from 'firebase/auth';
// Firestore imports temporarily removed
// import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    // Update profile with display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName,
      });
      
      // Create user profile in Firestore
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
): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing in with email:', error);
    throw error;
  }
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Create/update user profile in Firestore
    if (userCredential.user) {
      await createUserProfile(userCredential.user);
    }
    
    return userCredential;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const logOut = async (): Promise<void> => {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
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
    await confirmPasswordReset(auth, oobCode, newPassword);
  } catch (error) {
    console.error('Error confirming password reset:', error);
    throw error;
  }
};

// Creates or updates user profile in Firestore after authentication
export interface UserProfileData {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  [key: string]: unknown; // Allow for flexible additional fields
}

export const createUserProfile = async (user: User, additionalData?: UserProfileData): Promise<void> => {
  if (!user) return;
  
  console.log('Firestore disabled - Creating user profile skipped for:', user.uid, user.email);
  
  // Extract user information for logging only
  const { displayName, email, photoURL } = user;
  
  // Log what would be stored when Firestore is enabled
  console.log('User profile data (not stored in Firestore yet):', {
    uid: user.uid,
    displayName,
    email,
    photoURL,
    subscriptionPlan: 'free',
    subscriptionStatus: 'active',
    ...additionalData
  });
  
  // Simply return a resolved promise since Firestore is disabled
  return Promise.resolve();
};