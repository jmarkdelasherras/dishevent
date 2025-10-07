# DisheEvent Deployment Guide: GitHub CI/CD to Firebase App Hosting

This guide provides a comprehensive explanation of how the automated deployment process works for the DisheEvent application, from code changes to successful deployment in Firebase App Hosting environments.

## Table of Contents

1. [Overview](#overview)
2. [GitHub Actions Workflow Architecture](#github-actions-workflow-architecture)
3. [Deployment Process Step by Step](#deployment-process-step-by-step)
4. [Environment Setup](#environment-setup)
5. [Triggering Deployments](#triggering-deployments)
6. [Monitoring Deployments](#monitoring-deployments)
7. [Troubleshooting](#troubleshooting)
8. [Security Best Practices](#security-best-practices)
9. [Manual Deployment Options](#manual-deployment-options)
10. [Appendix: CI/CD File Reference](#appendix-cicd-file-reference)

## Overview

The DisheEvent application uses a Git branch-based continuous deployment strategy, where:

- **Development Environment**: Automatically deployed when changes are pushed to the `dev` branch
- **Production Environment**: Automatically deployed when changes are pushed to the `master` branch (or `main`)

This automation is powered by GitHub Actions and Firebase App Hosting, which together create a seamless deployment pipeline.

## GitHub Actions Workflow Architecture

The CI/CD pipeline consists of two main jobs:

1. **Lint and Test**: Validates the code quality and runs automated tests
2. **Build and Deploy**: Builds the application and deploys it to the appropriate environment

The workflow is defined in `.github/workflows/firebase-deploy.yml` and is triggered by:
- Push events to `dev`, `master`, or `main` branches
- Merged pull requests to these branches
- Manual workflow dispatch events

## Deployment Process Step by Step

### 1. Code Changes and Git Push

When you push changes to a branch or merge a pull request, the GitHub Actions workflow is triggered:

```bash
# Make your changes
git add .
git commit -m "Your commit message"
git push origin dev  # For development deployment
# OR
git push origin main  # For production deployment
```

### 2. GitHub Actions Workflow Execution

The workflow automatically:

1. **Sets up the environment**:
   - Checks out the code
   - Installs Node.js
   - Installs project dependencies

2. **Lints and tests the code**:
   - Runs ESLint
   - Executes any test suites

3. **Determines the target environment**:
   - Based on the branch (`dev` → development, `main`/`master` → production)
   - Sets appropriate configuration variables

4. **Builds the application**:
   - Creates a `.env.local` file with environment-specific variables from GitHub Secrets
   - Runs `npm run build` to build the Next.js application

5. **Authenticates with Google Cloud & Firebase**:
   - Sets up Google Cloud SDK
   - Configures Firebase CLI
   - Creates temporary service account credentials

6. **Prepares deployment files**:
   - Copies the appropriate Firebase configuration file:
     - `dev` branch: `firebase.dev.json` → `firebase.json`
     - `main`/`master` branch: `firebase.prod.json` → `firebase.json`
   - Copies the appropriate App Hosting configuration:
     - `dev` branch: `apphosting.dev.yaml` → `apphosting.yaml`
     - `main`/`master` branch: `apphosting.prod.yaml` → `apphosting.yaml`

7. **Deploys to Firebase App Hosting**:
   - Executes `firebase deploy --only apphosting` with the appropriate project ID
   - Uses Firebase token from secrets for authentication

8. **Cleans up sensitive files**:
   - Removes temporary service account files
   - Removes environment files

### 3. Firebase App Hosting Deployment

When Firebase App Hosting receives the deployment:

1. **Cloud Run Backend Setup**:
   - Containerizes the server-side rendering (SSR) component using `Dockerfile`
   - Deploys it as a Cloud Run service
   - Configures environment variables from `apphosting.yaml`

2. **Static Assets Deployment**:
   - Uploads static assets (JS, CSS, images) to Firebase Hosting CDN
   - Configures caching and optimization

3. **Domain Configuration**:
   - Connects to the configured domain(s)
   - Sets up SSL certificates

4. **Secrets Access**:
   - Fetches secrets from Google Cloud Secret Manager
   - Injects them into the environment

5. **Service Activation**:
   - Routes traffic to the new version
   - Maintains zero-downtime deployment

## Environment Setup

### Development Environment (`dev` branch)

Configuration sources:
- **Firebase Config**: `firebase.dev.json`
- **App Hosting Config**: `apphosting.dev.yaml`
- **Project ID**: Value from `FIREBASE_PROJECT_ID_DEV` secret
- **Environment Variables**: Development-specific secrets

This environment is intended for testing new features and changes before promoting to production.

### Production Environment (`main`/`master` branch)

Configuration sources:
- **Firebase Config**: `firebase.prod.json`
- **App Hosting Config**: `apphosting.prod.yaml`
- **Project ID**: Value from `FIREBASE_PROJECT_ID_PROD` secret
- **Environment Variables**: Production-specific secrets

This environment hosts the live application used by end users.

## Triggering Deployments

Deployments can be triggered in three ways:

### 1. Git Push to Tracked Branches

Pushing directly to `dev`, `main`, or `master` branches:

```bash
git push origin dev    # Triggers development deployment
git push origin main   # Triggers production deployment
```

### 2. Pull Request Merges

When a pull request is merged into a tracked branch, it triggers a deployment:

1. Create a PR from your feature branch to `dev` (for development) or `main`/`master` (for production)
2. Review and merge the PR
3. The workflow automatically triggers deployment

### 3. Manual Workflow Dispatch

You can manually trigger a deployment from the GitHub UI:

1. Go to your repository on GitHub
2. Navigate to Actions > DisheEvent CI/CD Pipeline
3. Click "Run workflow"
4. Select the branch and environment
5. Click "Run workflow"

## Monitoring Deployments

### GitHub Actions Logs

To monitor the deployment progress:

1. Go to your GitHub repository
2. Click on the "Actions" tab
3. Find the latest workflow run
4. Click on it to see detailed logs

### Firebase Console

To verify the deployment status and details:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to "Hosting" section
4. View deployment history and status

### Google Cloud Console

For more detailed logs and monitoring:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "Cloud Run" to check the backend service
3. View logs, metrics, and deployment history

## Troubleshooting

### Common Issues and Solutions

1. **Deployment Failure**:
   - Check GitHub Actions logs for errors
   - Verify that all required secrets are properly set
   - Ensure service accounts have necessary permissions

2. **Environment Variables Issues**:
   - Verify GitHub Secrets are correctly set
   - Check that secrets are being correctly passed to the environment

3. **Build Errors**:
   - Look for compilation errors in the build step
   - Ensure dependencies are correctly installed

4. **Authentication Failures**:
   - Verify Firebase token is valid
   - Check service account permissions
   - Ensure Google Cloud credentials are correct

5. **Missing Environment Configuration**:
   - Verify that Firebase project IDs are correctly set
   - Check that App Hosting configuration files exist and are valid

### Support Resources

- [Firebase App Hosting Documentation](https://firebase.google.com/docs/hosting)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)

## Security Best Practices

### Credential Management

1. **Store credentials in GitHub Secrets**:
   - Never commit credentials to the repository
   - Use GitHub Environments for environment-specific secrets

2. **Use service accounts with least privilege**:
   - Create dedicated service accounts for deployments
   - Grant only necessary permissions

3. **Rotate credentials regularly**:
   - Update Firebase tokens and service account keys
   - Especially after team members leave the project

### Sensitive Information

1. **Use the cleanup script** before committing:
   ```bash
   npm run cleanup
   # or
   npm run prepare-commit
   ```

2. **Keep `.env` files in `.gitignore`**:
   - Ensure all environment files are excluded from Git
   - Use `.env.local.example` as a template

## Manual Deployment Options

While automated deployments are preferred, you can still deploy manually if needed:

### Development Environment

```bash
# Deploy to development
npm run deploy:dev
```

### Production Environment

```bash
# Deploy to production
npm run deploy:prod
```

### Database Rules Deployment

```bash
# Deploy database rules to development
npm run deploy:rules:dev
```

## Appendix: CI/CD File Reference

### Key Files for CI/CD Process

1. **GitHub Actions Workflow**: `.github/workflows/firebase-deploy.yml`
   - Defines the complete CI/CD pipeline

2. **Firebase Configuration**:
   - Development: `firebase.dev.json`
   - Production: `firebase.prod.json`

3. **App Hosting Configuration**:
   - Development: `apphosting.dev.yaml`
   - Production: `apphosting.prod.yaml`

4. **Environment Cleanup Script**: `scripts/cleanup-env.sh`
   - Removes sensitive files before committing

5. **Next.js Configuration**: `next.config.ts`
   - Configures output for server-side rendering

6. **Dockerfile**:
   - Defines container for Cloud Run backend

7. **Package Scripts**: `package.json`
   - Contains deployment and utility scripts

### Sample GitHub Workflow Explained

```yaml
name: DisheEvent CI/CD Pipeline

on:
  push:
    branches: [ master, main, dev ]
  pull_request:
    types: [ closed ]
    branches: [ master, main, dev ]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'development'
        type: choice
        options:
          - development
          - production

jobs:
  lint-and-test:
    # Job that runs linting and tests
    
  build-and-deploy:
    needs: lint-and-test
    runs-on: ubuntu-latest
    steps:
      # Checkout code, setup Node.js, install dependencies
      
      # Determine environment based on branch
      - name: Set environment variables
        id: set-env
        run: |
          if [[ "${{ github.ref }}" == "refs/heads/dev" ]]; then
            # Development environment setup
          elif [[ "${{ github.ref }}" == "refs/heads/master" || "${{ github.ref }}" == "refs/heads/main" ]]; then
            # Production environment setup
          elif [[ "${{ github.event_name }}" == "workflow_dispatch" ]]; then
            # Manual trigger environment setup
          fi
      
      # Create environment file, build application
      
      # Set up Google Cloud SDK and Firebase CLI
      
      # Create service account file, prepare deployment files
      
      # Deploy to Firebase App Hosting
      - name: Deploy to Firebase App Hosting
        run: firebase deploy --only apphosting --project ${{ steps.set-env.outputs.FIREBASE_PROJECT_ID }} --non-interactive
        
      # Clean up sensitive files
```

---

By following this guide, you should have a clear understanding of how the DisheEvent application deployment process works through GitHub Actions and Firebase App Hosting, from code changes to successful deployment.