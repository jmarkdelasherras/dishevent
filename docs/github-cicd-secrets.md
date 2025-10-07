# GitHub CI/CD Secrets Setup Guide

This guide explains how to set up GitHub repository secrets for the DisheEvent CI/CD pipeline.

## Overview

The CI/CD pipeline uses GitHub Actions to automate building, testing, and deploying your application to Firebase App Hosting. The workflow is branch-based:

- Push or merge to `dev` branch → Automatic deployment to the development environment
- Push or merge to `master`/`main` branch → Automatic deployment to the production environment

To keep your sensitive credentials secure, you need to set up secrets in your GitHub repository.

## Required Secrets

### Development Environment Secrets

These secrets are used when deploying to the development environment:

| Secret Name | Description |
|-------------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key for development environment |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain for development environment |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID for development environment |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket for development environment |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID for development environment |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID for development environment |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase Measurement ID for development environment |
| `FIREBASE_SERVICE_ACCOUNT_DEV` | Firebase Service Account JSON for development environment |
| `GCP_PROJECT_ID` | Google Cloud Project ID for development environment |
| `GCP_SA_KEY` | Google Cloud Service Account key with permissions to access secrets |
| `FIREBASE_PROJECT_ID_DEV` | Firebase Project ID for development environment |
| `FIREBASE_TOKEN` | Firebase CI token obtained via `firebase login:ci` |

### Production Environment Secrets

These secrets are used when deploying to the production environment:

| Secret Name | Description |
|-------------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY_PROD` | Firebase API Key for production environment |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_PROD` | Firebase Auth Domain for production environment |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID_PROD` | Firebase Project ID for production environment |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_PROD` | Firebase Storage Bucket for production environment |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_PROD` | Firebase Messaging Sender ID for production environment |
| `NEXT_PUBLIC_FIREBASE_APP_ID_PROD` | Firebase App ID for production environment |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_PROD` | Firebase Measurement ID for production environment |
| `FIREBASE_SERVICE_ACCOUNT_PROD` | Firebase Service Account JSON for production environment |
| `GCP_PROJECT_ID_PROD` | Google Cloud Project ID for production environment |
| `FIREBASE_PROJECT_ID_PROD` | Firebase Project ID for production environment |

## Setting Up GitHub Secrets

1. Navigate to your GitHub repository.
2. Click on **Settings** > **Secrets and variables** > **Actions**.
3. Click **New repository secret**.
4. Add each secret with its name and value.

## Creating Environment-Specific Secrets

For better organization, create two environments (development and production) and add the appropriate secrets to each:

1. Go to **Settings** > **Environments**.
2. Click **New environment**.
3. Create a `development` environment and add all development-related secrets.
4. Create a `production` environment and add all production-related secrets.

## Obtaining Firebase Service Account

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. Go to **Project settings** > **Service accounts**.
4. Click **Generate new private key**.
5. Download the JSON file.
6. Use the contents of this file as the value for `FIREBASE_SERVICE_ACCOUNT_DEV` or `FIREBASE_SERVICE_ACCOUNT_PROD`.

## Getting Firebase Token for CI

Run the following command:

```bash
firebase login:ci
```

This will open a browser window for authentication and then display a token that you should use as the value for `FIREBASE_TOKEN`.

## Google Cloud Service Account

To use Google Cloud services:

1. Create a service account in the [Google Cloud Console](https://console.cloud.google.com/).
2. Grant it the necessary permissions:
   - `secretmanager.secretAccessor` for accessing secrets
   - `apphosting.admin` for deploying to App Hosting
   - `firebase.admin` for Firebase management
3. Generate and download a key for this service account.
4. Use the contents of the key file as the value for `GCP_SA_KEY`.

## Security Considerations

- Never commit these secrets to your repository.
- Regularly rotate your credentials, especially if team members leave the project.
- Use the principle of least privilege when granting permissions to service accounts.

## Updating GitHub Actions Workflow

If you add or rename any secrets, remember to update the corresponding references in the GitHub Actions workflow files in the `.github/workflows` directory.

## Testing Your Setup

After setting up all secrets, you can manually trigger a workflow from the **Actions** tab in your GitHub repository to test if everything is configured correctly.

## Local Environment Cleanup

To clean up sensitive environment files before committing to Git, use the provided cleanup script:

```bash
./scripts/cleanup-env.sh
```

This script removes all environment files and service account files that shouldn't be committed to your repository.