import * as admin from 'firebase-admin';

// Check if Firebase Admin has already been initialized and if we're in a browser environment
// This avoids initialization during build time
const isBrowser = typeof window !== 'undefined';

// Check for build-time vs runtime
// NEXT_PHASE is set during Next.js build process
const isBuildTime = 
  process.env.NEXT_PHASE === 'phase-production-build' || 
  process.env.NEXT_PHASE === 'phase-production-prebuild' ||
  process.env.SKIP_FIREBASE_INIT === 'true';

console.log('Firebase Admin SDK initialization status:', !isBrowser && !isBuildTime ? 'INITIALIZING' : 'NOT INITIALIZED');

// Skip Firebase Admin initialization during build or in browser
if (!admin.apps.length && !isBrowser && !isBuildTime) {
  try {
    // Get service account credentials from environment variable
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (!serviceAccountKey) {
      console.warn('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is missing - Firebase Admin SDK will not be initialized');
      // Don't throw error immediately, as this might just be a build-time issue
    } else {
      // Parse the service account key, handling potential JSON format issues
      let serviceAccount;
      try {
        serviceAccount = JSON.parse(serviceAccountKey);
        
        // Fix private_key if it has escaped newlines
        if (serviceAccount.private_key && serviceAccount.private_key.includes("\\n")) {
          serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
        }
        
        // Dynamically construct the databaseURL based on the project ID from the service account
        const projectId = serviceAccount.project_id;
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: `https://${projectId}-default-rtdb.firebaseio.com`
        });
        
        console.log('Firebase Admin SDK initialized successfully');
      } catch (error) {
        const parseError = error instanceof Error ? error : new Error(String(error));
        console.error(`Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY: ${parseError.message}`);
        // Continue without Firebase Admin in case of error during build
      }
    }
  } catch (error) {
    // More detailed error logging for debugging
    console.error('Failed to initialize Firebase Admin SDK:', error);
    
    if (error instanceof Error && error.message.includes('Failed to parse private key')) {
      console.error('PRIVATE KEY FORMAT ERROR: The private_key in your service account is malformed.');
      console.error('SOLUTION: Ensure private_key contains actual newlines, not "\\n" escape sequences.');
    }
    
    // Only throw in development to aid debugging, but not in production
    if (process.env.NODE_ENV === 'development') {
      console.error(`Firebase Admin initialization error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// Safe exports that check for Firebase Admin initialization
export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminFirestore = admin.apps.length ? admin.firestore() : null;

// Log admin initialization status at export time for debugging
console.log(`Firebase Admin SDK initialization status: ${admin.apps.length ? 'INITIALIZED' : 'NOT INITIALIZED'}`);
if (!admin.apps.length) {
  console.warn('WARNING: Firebase Admin SDK is not initialized. Auth verification will fail!');
  // Check if we're in local environment and print environment variables (without sensitive data)
  if (process.env.NODE_ENV === 'development') {
    console.log('Environment variables check:');
    console.log('- FIREBASE_SERVICE_ACCOUNT_KEY present:', !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      try {
        const parsedKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        console.log('- Service account project_id:', parsedKey.project_id);
        console.log('- Service account has private_key:', !!parsedKey.private_key);
        console.log('- Service account has client_email:', !!parsedKey.client_email);
      } catch (e) {
        console.error('- Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', e);
      }
    }
  }
}

// Helper function to check if Firebase Admin is initialized
export const isFirebaseAdminInitialized = () => admin.apps.length > 0;

export default admin;