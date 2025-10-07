# DisheEvent CI/CD Workflow Guide

This document explains the updated CI/CD workflow for the DisheEvent application, detailing how the automated deployment process works through GitHub Actions.

## Overview

The CI/CD pipeline automatically builds and deploys the DisheEvent application to Firebase App Hosting based on changes to specific branches:

- Push to `dev` branch → Deploy to development environment
- Push to `master`/`main` branch → Deploy to production environment
- Merged PR to `dev` → Deploy to development environment
- Merged PR to `master`/`main` → Deploy to production environment

## Workflow Steps

The CI/CD pipeline consists of the following jobs:

### 1. Lint and Test

- Runs linting checks on the codebase
- Executes tests to verify functionality

### 2. Build

- Cleans up unnecessary files using `scripts/cleanup.sh`
- Builds the Next.js application
- Uploads the build artifacts for deployment

### 3. Deploy to Development

Triggered by:
- Push to `dev` branch
- Merged PR to `dev` branch
- Manual workflow dispatch selecting "development" environment

This job:
- Downloads the build artifacts
- Sets up Google Cloud SDK
- Updates secrets in Google Cloud Secret Manager if needed
- Deploys to Firebase App Hosting development environment

### 4. Deploy to Production

Triggered by:
- Push to `master`/`main` branch
- Merged PR to `master`/`main` branch
- Manual workflow dispatch selecting "production" environment

This job:
- Requires successful development deployment
- Downloads the build artifacts
- Sets up Google Cloud SDK
- Updates secrets in Google Cloud Secret Manager if needed
- Deploys to Firebase App Hosting production environment

## Automatic Secret Management

The workflow automatically updates Google Cloud Secret Manager with any changes to the GitHub secrets. This ensures that:

1. GitHub repository secrets are the source of truth
2. Google Cloud Secret Manager is kept in sync
3. Firebase App Hosting configurations always use the latest values

## Branch-Based Deployment

The deployment process now follows this pattern:

1. Feature branches → PRs to `dev`
2. `dev` branch → development environment deployment
3. `dev` → PRs to `master`/`main`
4. `master`/`main` branch → production environment deployment

## Keeping the Repository Clean

To avoid storing sensitive files in the repository:

1. Use the `scripts/cleanup-env.sh` script before committing:
   ```bash
   ./scripts/cleanup-env.sh
   ```

2. The CI/CD process uses `scripts/cleanup.sh` to clean temporary files before building

## Manual Deployments

You can still trigger manual deployments:

1. Go to the Actions tab in GitHub
2. Select the "DisheEvent CI/CD Pipeline" workflow
3. Click "Run workflow"
4. Select the branch and environment to deploy to

## Required GitHub Secrets

For the workflow to function properly, the following GitHub secrets must be configured:

### Development Environment
- `NEXT_PUBLIC_FIREBASE_*` (all Firebase client configuration values)
- `FIREBASE_SERVICE_ACCOUNT_DEV`
- `FIREBASE_PROJECT_ID_DEV`
- `GCP_PROJECT_ID`
- `GCP_SA_KEY`
- `FIREBASE_TOKEN`

### Production Environment
- `NEXT_PUBLIC_FIREBASE_*_PROD` (all Firebase client configuration values with _PROD suffix)
- `FIREBASE_SERVICE_ACCOUNT_PROD`
- `FIREBASE_PROJECT_ID_PROD`
- `GCP_PROJECT_ID_PROD`
- `GCP_SA_KEY_PROD`
- `FIREBASE_TOKEN`
