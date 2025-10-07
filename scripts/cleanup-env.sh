#!/bin/bash

# cleanup-env.sh - Remove environment-specific files and keep only examples
# This script is meant to be run before committing code to the repository
# to ensure that no sensitive environment files are checked in

echo "🧹 Cleaning up environment files..."

# Remove actual environment files but keep examples
rm -f .env
rm -f .env.local
rm -f .env.development
rm -f .env.production
rm -f .env.development.local
rm -f .env.production.local

# Remove any service account files
rm -f service-account*.json
rm -f *-service-account*.json
rm -f *-key.txt
rm -f formatted-*-key.txt

# Remove build artifacts
rm -rf .next/
rm -rf out/
rm -rf build/

echo "✅ Environment cleanup complete!"
echo "Reminder: You should still have the .env.*.example files as templates for local development."
