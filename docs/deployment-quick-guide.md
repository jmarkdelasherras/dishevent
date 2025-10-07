# GitHub Actions Deployment Quick Guide

This document provides a quick reference for the GitHub Actions deployment workflow used in the DisheEvent application.

## Automated Deployments

The DisheEvent application uses GitHub Actions for fully automated deployments to Firebase App Hosting:

1. **Development Environment**: Deployed automatically when pushing to the `dev` branch
2. **Production Environment**: Deployed automatically when pushing to the `main` or `master` branch

## Key Features

- **Fully Automated**: No manual commands needed for deployment
- **Environment-Specific**: Separate builds and configurations for dev and prod
- **Secret Management**: Automatically synchronizes GitHub secrets with Google Cloud Secret Manager
- **Zero Downtime**: Deploys without interrupting service
- **Consistent Environments**: Same build process for all environments

## How It Works

1. Code changes are pushed to GitHub
2. GitHub Actions detects changes and triggers the workflow
3. The code is linted and tested
4. The application is built with environment-specific variables
5. Google Cloud Secrets are updated from GitHub secrets
6. The application is deployed to Firebase App Hosting

## Required Setup

To make this work, you need:

1. GitHub repository secrets configured (see [GitHub CI/CD Secrets Guide](./github-cicd-secrets.md))
2. Google Cloud projects set up for dev and prod
3. Firebase App Hosting configured in both projects
4. Google Cloud Secret Manager set up with appropriate secrets

## Common Tasks

### Updating Environment Variables

1. Update the corresponding GitHub secret in repository settings
2. The CI/CD pipeline will automatically sync it to Google Cloud Secret Manager
3. Next deployment will use the updated values

### Testing Locally Before Deployment

```bash
# 1. Install dependencies
npm ci

# 2. Create .env.local with your local dev values
# (See .env.local.example)

# 3. Run development server
npm run dev

# 4. Before pushing, clean sensitive files
npm run clean
```

### Viewing Deployment Status

1. Go to the "Actions" tab in your GitHub repository
2. Find the latest workflow run
3. Click to see detailed logs and status

### Manual Deployment Trigger

1. Go to the "Actions" tab in your GitHub repository
2. Select "DisheEvent CI/CD Pipeline"
3. Click "Run workflow"
4. Select the branch and environment
5. Click "Run workflow"

## Troubleshooting

If deployment fails:

1. Check GitHub Actions logs for error messages
2. Verify that all required secrets are properly configured
3. Ensure Google Cloud service accounts have necessary permissions
4. Check Firebase App Hosting configuration
5. Test the build locally to identify issues
