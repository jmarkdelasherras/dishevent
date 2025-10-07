#!/bin/bash

# Script to clean up unnecessary files before pushing to GitHub

# Remove any service account or key files
rm -f service-account*.json
rm -f *-key.txt
rm -f serviceAccountKey*.json
rm -f firebase-adminsdk*.json
rm -f formatted-*-key.txt

# Remove environment files with potential secrets
rm -f .env
rm -f .env.local
rm -f .env.*.local

# Remove any files generated during testing or deployment
rm -f firebase-debug.log
rm -f ui-debug.log
rm -f .firebase/*.cache
rm -f .firebaserc

echo "✅ Cleaned up sensitive and unnecessary files."