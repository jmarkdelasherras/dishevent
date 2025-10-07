#!/bin/bash

# Cleanup script for DisheEvent project
# Removes sensitive and unnecessary files before deployment or commit

echo "🧹 Starting cleanup process..."

# Remove service account files and keys
echo "Removing service account files..."
rm -f service-account*.json
rm -f *-service-account*.json
rm -f *-key.txt
rm -f formatted-*-key.txt

# Remove temporary Firebase files
echo "Removing Firebase temporary files..."
rm -f firebase-debug.log
rm -f firebase-debug.*.log
rm -f ui-debug.log
rm -rf .firebase/

# Remove build artifacts that should be generated fresh
echo "Removing build artifacts..."
rm -rf .next/
rm -rf out/
rm -rf build/

# Remove temporary files
echo "Removing temporary files..."
rm -f *.tmp
rm -rf .temp/
rm -rf .tmp/
rm -rf .cache/

# Remove any backup files
echo "Removing backup files..."
rm -f *.bak
rm -f *~

echo "✅ Cleanup complete!"
