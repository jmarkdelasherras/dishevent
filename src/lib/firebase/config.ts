// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getDatabase, Database } from 'firebase/database';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase config is missing (in development environment)
if ((!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') && 
    process.env.NODE_ENV === 'development' && 
    typeof window !== 'undefined') {
  console.error(
    'Firebase configuration error: Environment variables are missing.\n' +
    'Create a .env.local file with your Firebase config.\n' +
    'See .env.local.example for the required variables.'
  );
}

// Check for build-time vs runtime
// NEXT_PHASE is set during Next.js build process
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                  process.env.NEXT_PHASE === 'phase-production-prebuild';
const skipFirebaseInit = process.env.NEXT_PUBLIC_SKIP_FIREBASE_INIT === 'true';
const isBrowser = typeof window !== 'undefined';
const hasValidConfig = firebaseConfig.apiKey && firebaseConfig.apiKey !== 'undefined';

// Initialize Firebase only in browser environment or when we have valid config and not in build time
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let database: Database | null = null;

// Only initialize if we're not in build time or we're in a browser, and not skipping initialization
if (!skipFirebaseInit && ((hasValidConfig && !isBuildTime) || isBrowser)) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    
    // Initialize Firebase services
    db = getFirestore(app);
    storage = getStorage(app);
    database = getDatabase(app);
  } catch (error) {
    // Only log in development and browser
    if (process.env.NODE_ENV === 'development' && isBrowser) {
      console.error('Firebase initialization error:', error);
    }
    
    // Provide dummy objects for SSR/build
    app = null;
    auth = null;
    db = null;
    storage = null;
    database = null;
  }
} else {
  // Provide dummy objects for SSR/build
  app = null;
  auth = null;
  db = null;
  storage = null;
  database = null;
}

export { app, auth, db, storage, database };