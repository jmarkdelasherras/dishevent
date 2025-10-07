#!/bin/bash

# This script removes unnecessary environment files before committing to Git
# Prevents accidental commit of sensitive environment variables

echo "Cleaning up sensitive environment files..."

# Remove various environment files
rm -f .env
rm -f .env.local
rm -f .env.development
rm -f .env.production
rm -f .env.development.local
rm -f .env.production.local
rm -f service-account*.json
rm -f formatted-*-key.txt
rm -f *firebase*key*
rm -f firebase-adminsdk*

echo "Environment files cleaned successfully!"