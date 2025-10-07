// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'dummy-api-key-for-build',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'dummy-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dummy-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'dummy-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcd1234',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-ABCD1234',
};

// Check if Firebase config is missing (in development environment)
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                   process.env.NEXT_PHASE === 'phase-production-prebuild' ||
                   process.env.SKIP_FIREBASE_INIT === 'true';

if (!isBuildTime && (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'dummy-api-key-for-build')) {
  console.error(
    'Firebase configuration error: Environment variables are missing.\n' +
    'Create a .env.local file with your Firebase config.\n' +
    'See .env.local.example for the required variables.'
  );
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Initialize Firebase services
const db = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { app, auth, db, storage, database };