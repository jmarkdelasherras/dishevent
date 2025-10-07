/**
 * This script helps format your Firebase service account key for use in .env.local
 * 
 * Usage: 
 * 1. Save your Firebase service account JSON to 'service-account.json'
 * 2. Run: node scripts/format-service-account.mjs
 * 3. Copy the output to your .env.local file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  // Read the service account JSON file
  const serviceAccountPath = path.join(__dirname, '..', 'service-account.json');
  const serviceAccountRaw = fs.readFileSync(serviceAccountPath, 'utf8');
  const serviceAccount = JSON.parse(serviceAccountRaw);
  
  // Convert to a string with proper escaping for .env file
  const formattedKey = JSON.stringify(serviceAccount)
    // Ensure newlines in private_key are properly escaped for JSON
    .replace(/\\n/g, "\\\\n");
  
  console.log('\n=== Copy this line to your .env.local file ===\n');
  console.log(`FIREBASE_SERVICE_ACCOUNT_KEY='${formattedKey}'`);
  console.log('\n=== End of service account key ===\n');
  
  console.log('Make sure to:');
  console.log('1. Include the single quotes around the value');
  console.log('2. Copy the ENTIRE string without line breaks');
  
} catch (error) {
  console.error('Error formatting service account key:', error);
  console.error('\nPlease ensure service-account.json exists in the project root.');
}