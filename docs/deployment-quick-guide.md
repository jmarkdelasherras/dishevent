# DisheEvent Deployment Quick Guide

## Automated Branch-Based Deployments

The DisheEvent application uses GitHub Actions for automated deployments:

| Branch Action | Deployment Result |
|--------------|------------------|
| Push to `dev` branch | Deploys to **Development** environment |
| Push to `master` branch | Deploys to **Production** environment |
| Merged PR to `dev` | Deploys to **Development** environment |
| Merged PR to `master` | Deploys to **Production** environment |

## Local Environment Setup

For local development only:

1. Copy the appropriate example file:
   ```bash
   cp .env.development.local.example .env.development.local
   ```

2. Fill in your Firebase configuration values in `.env.development.local`

## Before Committing Code

Always run the cleanup script to remove sensitive files:

```bash
./scripts/cleanup-env.sh
```

## Manual Deployment Trigger

To manually trigger a deployment:

1. Go to GitHub Actions tab
2. Select "DisheEvent CI/CD Pipeline"
3. Click "Run workflow"
4. Choose branch and environment

## Key Benefits of This Workflow

- No CLI commands needed for deployment
- Secrets automatically synchronized with Google Cloud
- Branch-based deployments for clear environment separation
- All sensitive files excluded from repository
- Clean deployment pipeline with proper testing
