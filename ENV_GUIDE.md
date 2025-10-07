# DisheEvent Environment Variables Guide

This guide explains how to set up environment variables for both development and production environments.

## Environment Structure

DisheEvent uses multiple environment files:

1. **Committed to repository (placeholder values only)**:
   - `.env.development` - Default development environment variables
   - `.env.production` - Default production environment variables

2. **Not committed (contain actual secrets)**:
   - `.env.development.local` - Development secrets and overrides
   - `.env.production.local` - Production secrets and overrides
   - `.env.local` - Local overrides for all environments

## Development Environment

For local development:

1. Copy `.env.development.local.example` to `.env.development.local`
2. Fill in your actual development Firebase configuration
3. Run the app in development mode: `npm run dev`

```bash
# Firebase Configuration (Development)
NEXT_PUBLIC_FIREBASE_API_KEY=your-dev-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-dev-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-dev-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-dev-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-dev-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-dev-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-dev-measurement-id

# Firebase Admin (for server-side authentication)
FIREBASE_SERVICE_ACCOUNT_KEY=your-dev-formatted-service-account-key
```

## Production Environment

For production testing:

1. Copy `.env.production.local.example` to `.env.production.local`
2. Fill in your actual production Firebase configuration
3. Run the app in production mode: `npm run build && npm start`

## Creating Service Account Keys

1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Format it using our script:

   ```bash
   node scripts/format-service-account.mjs
   ```

5. Copy the formatted output to your `.env.local` file

## Deployment Configuration

### Development Deployment

For the development environment deployment:

1. Create a Firebase App Hosting instance for development
2. Update `apphosting.yaml` for the development environment:

```yaml
# Development environment deployment configuration
runConfig:
  minInstances: 0
  maxInstances: 2  # Lower for dev environment
  
env:
  # Firebase Configuration (Dev)
  - variable: "NEXT_PUBLIC_FIREBASE_API_KEY"
    value: "your-dev-api-key"
  # ... other Firebase variables ...
  
  # Firebase Admin (secret)
  - variable: "FIREBASE_SERVICE_ACCOUNT_KEY"
    secret: "firebase_service_account_dev"
```

### Production Deployment

For the production environment deployment:

1. Client-side variables are set in `apphosting.yaml`
2. The service account key is stored in Google Cloud Secret Manager
3. No environment variables are included in the repository

```yaml
# Production environment deployment configuration
runConfig:
  minInstances: 1  # Keep at least one instance warm
  maxInstances: 10
  
env:
  # Firebase Configuration (Production)
  - variable: "NEXT_PUBLIC_FIREBASE_API_KEY"
    value: "your-prod-api-key"
  # ... other Firebase variables ...
  
  # Firebase Admin (secret)
  - variable: "FIREBASE_SERVICE_ACCOUNT_KEY"
    secret: "firebase_service_account_prod"
```

Ask a team lead for access to production environment variables and secrets.

## Switching Between Environments

- For local development: `npm run dev`
- For production build testing: `npm run build && npm start`

## Deployment Process

We've set up separate deployment scripts for development and production:

### Development Environment Deployment

```bash
npm run deploy:dev
```

This will:

1. Copy the dev configuration files into place
2. Deploy to the development Firebase project

### Production Environment Deployment

```bash
npm run deploy:prod
```

This will:

1. Copy the production configuration files into place
2. Deploy to the production Firebase project

### Manual Deployment Process

If you need to manually deploy:

```bash
# For development
cp firebase.dev.json firebase.json
cp apphosting.dev.yaml apphosting.yaml
firebase deploy --only apphosting --project dishevent-dev

# For production
cp firebase.prod.json firebase.json
cp apphosting.prod.yaml apphosting.yaml
firebase deploy --only apphosting --project dishevent-prod
```
