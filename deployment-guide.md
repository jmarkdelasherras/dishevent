# DisheEvent Deployment Guide: Firebase App Hosting with Dev & Prod Environments

This guide will walk you through deploying your Next.js-based DisheEvent application to Firebase App Hosting with separate development and production environments.

---

## 1. Prerequisites and Setup

Before you begin, ensure you have the following:

### Required Tools

1. **Node.js and npm**: Make sure you have Node.js (v18.x or later) and npm installed
   ```bash
   node --version
   npm --version
   ```

2. **Firebase CLI**: Install the Firebase Command Line Interface
   ```bash
   npm install -g firebase-tools
   ```

3. **Google Cloud CLI**: Install the Google Cloud CLI for managing secrets
   ```bash
   # For macOS
   brew install --cask google-cloud-sdk
   # For other platforms, see: https://cloud.google.com/sdk/docs/install
   ```

### Account Requirements

1. **Firebase Account**: You'll need a Firebase account with access to create projects
2. **Google Cloud Account**: Your Firebase account will be linked to Google Cloud

### Local Repository Setup

1. Make sure your DisheEvent project is ready for deployment:
   ```bash
   cd /Users/rexxar/Personal/projects/web/dishevent
   npm install
   ```

2. Ensure you're on the correct branch:
   ```bash
   git checkout dev
   ```

## 2. Firebase Project Configuration

You'll need to set up two separate Firebase projects for your development and production environments.

### 2.1. Create Firebase Projects

1. **Log in to Firebase**:
   ```bash
   firebase login
   ```

2. **Create Development Project** (if you haven't already):
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project"
   - Name it "dishevent-dev" or similar
   - Follow the setup wizard (enable Google Analytics if desired)
   - Make note of your project ID (e.g., `dishevent-dev-12345`)

3. **Create Production Project**:
   - Return to the Firebase Console
   - Click "Add Project" again
   - Name it "dishevent-prod" or similar
   - Follow the setup wizard
   - Make note of your project ID (e.g., `dishevent-prod-67890`)

### 2.2. Configure Firebase Services

For **EACH** project (development and production), configure the following:

1. **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable the authentication providers you need (Email/Password, Google, etc.)
   - Add any authorized domains

2. **Firestore Database**:
   - Create a Firestore database
   - Start in production mode with appropriate rules
   - Set up your initial collection structure or import data

3. **Storage**:
   - Set up Firebase Storage
   - Configure appropriate security rules

### 2.3. Generate Service Account Keys

For server-side Firebase Admin functionality, you need service account keys:

1. **Development Service Account Key**:
   - Go to Project Settings > Service Accounts in your dev project
   - Click "Generate new private key"
   - Save the JSON file as `service-account-dev.json`

2. **Production Service Account Key**:
   - Go to Project Settings > Service Accounts in your prod project
   - Click "Generate new private key"
   - Save the JSON file as `service-account-prod.json`

3. **Format Service Account Keys** (don't commit these to git):
   ```bash
   # Format the development key
   node scripts/format-service-account.mjs < service-account-dev.json > formatted-dev-key.txt
   
   # Format the production key
   node scripts/format-service-account.mjs < service-account-prod.json > formatted-prod-key.txt
   ```

## 3. Environment Configurations

Now you'll set up the environment-specific configuration files needed for your deployment.

### 3.1. Create Local Environment Files

1. **Development Environment Variables**:
   
   Create or update `.env.development.local`:
   
   ```bash
   # Development Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your-dev-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-dev-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-dev-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-dev-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-dev-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-dev-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-dev-measurement-id
   
   # Development Firebase Admin (server-side)
   FIREBASE_SERVICE_ACCOUNT_KEY=paste-your-formatted-dev-key-here
   
   # Application Settings
   NEXT_PUBLIC_APP_ENV=development
   ```

2. **Production Environment Variables**:
   
   Create or update `.env.production.local`:
   
   ```bash
   # Production Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your-prod-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-prod-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-prod-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-prod-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-prod-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-prod-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-prod-measurement-id
   
   # Production Firebase Admin (server-side)
   FIREBASE_SERVICE_ACCOUNT_KEY=paste-your-formatted-prod-key-here
   
   # Application Settings
   NEXT_PUBLIC_APP_ENV=production
   ```

### 3.2. Store Secrets in Google Cloud Secret Manager

For a secure deployment, store all your Firebase configuration values in Secret Manager:

1. **Enable the Secret Manager API**:
   
   ```bash
   # For Development Project
   gcloud config set project your-dev-project-id
   gcloud services enable secretmanager.googleapis.com
   
   # For Production Project
   gcloud config set project your-prod-project-id
   gcloud services enable secretmanager.googleapis.com
   ```

2. **Create Secrets for Development Environment**:
   
   ```bash
   # Set the project
   gcloud config set project your-dev-project-id
   
   # Firebase Admin SDK Secret
   gcloud secrets create firebase_service_account_dev --replication-policy="automatic"
   cat formatted-dev-key.txt | gcloud secrets versions add firebase_service_account_dev --data-file=-
   
   # Firebase Client Configuration Secrets
   gcloud secrets create firebase_api_key_dev --replication-policy="automatic"
   echo "YOUR_API_KEY" | gcloud secrets versions add firebase_api_key_dev --data-file=-
   
   gcloud secrets create firebase_auth_domain_dev --replication-policy="automatic"
   echo "your-project-id.firebaseapp.com" | gcloud secrets versions add firebase_auth_domain_dev --data-file=-
   
   gcloud secrets create firebase_project_id_dev --replication-policy="automatic"
   echo "your-project-id" | gcloud secrets versions add firebase_project_id_dev --data-file=-
   
   gcloud secrets create firebase_storage_bucket_dev --replication-policy="automatic"
   echo "your-project-id.appspot.com" | gcloud secrets versions add firebase_storage_bucket_dev --data-file=-
   
   gcloud secrets create firebase_messaging_sender_id_dev --replication-policy="automatic"
   echo "YOUR_MESSAGING_SENDER_ID" | gcloud secrets versions add firebase_messaging_sender_id_dev --data-file=-
   
   gcloud secrets create firebase_app_id_dev --replication-policy="automatic"
   echo "YOUR_APP_ID" | gcloud secrets versions add firebase_app_id_dev --data-file=-
   
   gcloud secrets create firebase_measurement_id_dev --replication-policy="automatic"
   echo "YOUR_MEASUREMENT_ID" | gcloud secrets versions add firebase_measurement_id_dev --data-file=-
   ```

3. **Create Secrets for Production Environment**:
   
   ```bash
   # Set the project
   gcloud config set project your-prod-project-id
   
   # Firebase Admin SDK Secret
   gcloud secrets create firebase_service_account_prod --replication-policy="automatic"
   cat formatted-prod-key.txt | gcloud secrets versions add firebase_service_account_prod --data-file=-
   
   # Firebase Client Configuration Secrets
   gcloud secrets create firebase_api_key_prod --replication-policy="automatic"
   echo "YOUR_API_KEY" | gcloud secrets versions add firebase_api_key_prod --data-file=-
   
   gcloud secrets create firebase_auth_domain_prod --replication-policy="automatic"
   echo "your-project-id.firebaseapp.com" | gcloud secrets versions add firebase_auth_domain_prod --data-file=-
   
   gcloud secrets create firebase_project_id_prod --replication-policy="automatic"
   echo "your-project-id" | gcloud secrets versions add firebase_project_id_prod --data-file=-
   
   gcloud secrets create firebase_storage_bucket_prod --replication-policy="automatic"
   echo "your-project-id.appspot.com" | gcloud secrets versions add firebase_storage_bucket_prod --data-file=-
   
   gcloud secrets create firebase_messaging_sender_id_prod --replication-policy="automatic"
   echo "YOUR_MESSAGING_SENDER_ID" | gcloud secrets versions add firebase_messaging_sender_id_prod --data-file=-
   
   gcloud secrets create firebase_app_id_prod --replication-policy="automatic"
   echo "YOUR_APP_ID" | gcloud secrets versions add firebase_app_id_prod --data-file=-
   
   gcloud secrets create firebase_measurement_id_prod --replication-policy="automatic"
   echo "YOUR_MEASUREMENT_ID" | gcloud secrets versions add firebase_measurement_id_prod --data-file=-
   ```

### 3.3. Set Up Firebase App Hosting Configuration Files

1. **Firebase Configuration Files**:

   Verify that your project has the following configuration files (they should already exist):
   - `firebase.dev.json` for development
   - `firebase.prod.json` for production

2. **App Hosting Configuration Files**:

   Verify that your project has the following configuration files:
   - `apphosting.dev.yaml` for development
   - `apphosting.prod.yaml` for production

3. **Server Entry Point**:

   Ensure your `server.js` file is properly configured for Next.js server-side rendering:

   ```javascript
   import { createServer } from 'http';
   import { parse } from 'url';
   import next from 'next';
   
   const dev = process.env.NODE_ENV !== 'production';
   const hostname = process.env.HOSTNAME || 'localhost';
   const port = process.env.PORT || 3000;
   
   const app = next({ dev });
   const handle = app.getRequestHandler();
   
   app.prepare().then(() => {
     createServer(async (req, res) => {
       try {
         const parsedUrl = parse(req.url, true);
         await handle(req, res, parsedUrl);
       } catch (err) {
         console.error('Error occurred handling', req.url, err);
         res.statusCode = 500;
         res.end('Internal Server Error');
       }
     })
     .once('error', (err) => {
       console.error(err);
       process.exit(1);
     })
     .listen(port, () => {
       console.log(`> Ready on http://${hostname}:${port}`);
     });
   });
   ```

## 4. Deployment Process

Now you'll deploy your application to both development and production environments.

### 4.1. Initialize Firebase for Each Project

1. **Development Project**:
   ```bash
   # Set the active Firebase project to development
   firebase use --add
   # Select your dev project when prompted
   # Give it an alias, e.g. "dev"
   ```

2. **Production Project**:
   ```bash
   # Add your production project
   firebase use --add
   # Select your prod project when prompted
   # Give it an alias, e.g. "prod"
   ```

### 4.2. Deploy to Development Environment

1. **Test Your Development Configuration**:
   ```bash
   # Switch to development environment
   firebase use dev
   
   # Run a local build to test
   npm run build
   ```

2. **Deploy to Development**:
   
   Using the deployment script:
   ```bash
   npm run deploy:dev
   ```
   
   Or manually:
   ```bash
   # Copy dev configuration files
   cp firebase.dev.json firebase.json
   cp apphosting.dev.yaml apphosting.yaml
   
   # Deploy to Firebase App Hosting
   firebase deploy --only apphosting
   ```

3. **Verify Access to Secrets**:
   - After deployment, check if your Cloud Run service has access to all secrets
   - If you encounter issues, grant access to all secrets:
   
   ```bash
   # Get your service account
   DEV_SERVICE_ACCOUNT=$(gcloud app-hosting backends describe dishevent-dev --format="value(serviceConfig.serviceAccount)")
   
   # Grant access to all secrets
   for SECRET_NAME in firebase_api_key_dev firebase_auth_domain_dev firebase_project_id_dev firebase_storage_bucket_dev firebase_messaging_sender_id_dev firebase_app_id_dev firebase_measurement_id_dev firebase_service_account_dev
   do
     gcloud secrets add-iam-policy-binding $SECRET_NAME \
       --member="serviceAccount:$DEV_SERVICE_ACCOUNT" \
       --role="roles/secretmanager.secretAccessor" \
       --project=your-dev-project-id
   done
   ```

### 4.3. Deploy to Production Environment

1. **Test Your Production Configuration**:
   ```bash
   # Switch to production environment
   firebase use prod
   
   # Run a production build to test
   NODE_ENV=production npm run build
   ```

2. **Deploy to Production**:
   
   Using the deployment script:
   ```bash
   npm run deploy:prod
   ```
   
   Or manually:
   ```bash
   # Copy prod configuration files
   cp firebase.prod.json firebase.json
   cp apphosting.prod.yaml apphosting.yaml
   
   # Deploy to Firebase App Hosting
   firebase deploy --only apphosting
   ```

3. **Verify Access to Secrets**:
   - After deployment, check if your Cloud Run service has access to all secrets
   - If you encounter issues, grant access to all secrets:
   
   ```bash
   # Get your service account
   PROD_SERVICE_ACCOUNT=$(gcloud app-hosting backends describe dishevent-prod --format="value(serviceConfig.serviceAccount)")
   
   # Grant access to all secrets
   for SECRET_NAME in firebase_api_key_prod firebase_auth_domain_prod firebase_project_id_prod firebase_storage_bucket_prod firebase_messaging_sender_id_prod firebase_app_id_prod firebase_measurement_id_prod firebase_service_account_prod
   do
     gcloud secrets add-iam-policy-binding $SECRET_NAME \
       --member="serviceAccount:$PROD_SERVICE_ACCOUNT" \
       --role="roles/secretmanager.secretAccessor" \
       --project=your-prod-project-id
   done
   gcloud secrets add-iam-policy-binding firebase_service_account_prod \
       --member="serviceAccount:$PROD_SERVICE_ACCOUNT" \
       --role="roles/secretmanager.secretAccessor" \
       --project=your-prod-project-id
   ```

### 4.4. Set Up Custom Domains (Optional)

1. **For Development Environment**:
   ```bash
   # Switch to development project
   firebase use dev
   
   # Add custom domain
   firebase hosting:channel:deploy dev --expires 30d
   ```

2. **For Production Environment**:
   ```bash
   # Switch to production project
   firebase use prod
   
   # Add your custom domain
   firebase hosting:sites:add your-domain-name
   ```
   
   Then follow the domain verification steps in the Firebase console.

## 5. Post-Deployment Steps

After deploying your application, perform these verification and configuration steps.

### 5.1. Verify Your Deployments

1. **Check Development Deployment**:
   - Visit your development URL (shown after deployment)
   - Usually: `https://dishevent-dev-xxxxx.web.app`
   - Verify that the app loads correctly
   - Check that Firebase authentication and data access work
   - Confirm the environment is displayed as "development"

2. **Check Production Deployment**:
   - Visit your production URL (shown after deployment)
   - Usually: `https://dishevent-prod-xxxxx.web.app`
   - Verify that the app loads correctly with production data
   - Test all critical functionality
   - Confirm the environment is displayed as "production"

### 5.2. Set Up Monitoring and Logging

1. **Enable Firebase Performance Monitoring**:
   ```bash
   # For development
   firebase use dev
   firebase experiments:enable webframeworks
   
   # For production
   firebase use prod
   firebase experiments:enable webframeworks
   ```

2. **Set Up Error Logging**:
   - Go to the Firebase console
   - Navigate to Crashlytics
   - Set up alerts for critical errors

3. **Configure Cloud Monitoring (recommended for production)**:
   ```bash
   # For production project
   gcloud config set project your-prod-project-id
   gcloud monitoring dashboards create --config-from-file=monitoring-dashboard.json
   ```

### 5.3. Configure Security Rules

1. **Update Firestore Rules**:
   
   Create or update `firestore.rules`:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Your security rules here
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
   
   Deploy the rules:
   ```bash
   # For development
   firebase use dev
   firebase deploy --only firestore:rules
   
   # For production
   firebase use prod
   firebase deploy --only firestore:rules
   ```

2. **Update Storage Rules**:
   
   Create or update `storage.rules`:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
   
   Deploy the rules:
   ```bash
   # For development
   firebase use dev
   firebase deploy --only storage:rules
   
   # For production
   firebase use prod
   firebase deploy --only storage:rules
   ```

### 5.4. Set Up Continuous Integration/Deployment (Optional)

1. **Create GitHub Actions Workflow**:
   
   Create `.github/workflows/firebase-deploy.yml`:
   
   ```yaml
   name: Deploy to Firebase App Hosting
   
   on:
     push:
       branches:
         - dev
         - main
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '20'
             
         - name: Install dependencies
           run: npm ci
           
         - name: Deploy to dev
           if: github.ref == 'refs/heads/dev'
           run: |
             cp firebase.dev.json firebase.json
             cp apphosting.dev.yaml apphosting.yaml
             npx firebase-tools deploy --token "${{ secrets.FIREBASE_TOKEN }}" --only apphosting --project your-dev-project-id
         
         - name: Deploy to prod
           if: github.ref == 'refs/heads/main'
           run: |
             cp firebase.prod.json firebase.json
             cp apphosting.prod.yaml apphosting.yaml
             npx firebase-tools deploy --token "${{ secrets.FIREBASE_TOKEN }}" --only apphosting --project your-prod-project-id
   ```
   
   Generate a Firebase token for CI/CD:
   ```bash
   firebase login:ci
   # Save the token as a GitHub secret named FIREBASE_TOKEN
   ```

### 5.5. Troubleshooting Common Issues

1. **Missing Environment Variables**:
   - Check that all required environment variables are set in `apphosting.*.yaml`
   - Verify that the service account keys are properly formatted and stored in Secret Manager

2. **Access Denied to Secrets**:
   - Ensure your Cloud Run service account has Secret Manager Secret Accessor role
   - Check for any permission issues in Google Cloud IAM

3. **Build Failures**:
   - Check your `next.config.ts` to ensure it's configured for SSR with `output: 'standalone'`
   - Verify that your dependencies are properly installed

4. **Deployment Errors**:
   - Check Firebase deployment logs:
   ```bash
   firebase deploy:log --project your-project-id
   ```
   
   - View Cloud Run logs:
   ```bash
   gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=dishevent" --project your-project-id
   ```

## 6. Maintenance and Updates

### 6.1. Updating Your Application

1. **Development Updates**:
   ```bash
   # Make your changes
   git checkout dev
   
   # Test locally
   npm run dev
   
   # Deploy to development
   npm run deploy:dev
   
   # Or manually
   cp firebase.dev.json firebase.json
   cp apphosting.dev.yaml apphosting.yaml
   firebase deploy --only apphosting --project your-dev-project-id
   ```

2. **Production Updates**:
   ```bash
   # After testing in development, merge to main
   git checkout main
   git merge dev
   
   # Deploy to production
   npm run deploy:prod
   
   # Or manually
   cp firebase.prod.json firebase.json
   cp apphosting.prod.yaml apphosting.yaml
   firebase deploy --only apphosting --project your-prod-project-id
   ```

### 6.2. Monitoring Usage and Costs

1. **View Firebase Usage**:
   - Go to Firebase Console > Usage and Billing
   - Monitor App Hosting usage
   - Set up budget alerts in Google Cloud Console

2. **Optimize Costs**:
   - Set `minInstances: 0` for development to scale to zero when not in use
   - Adjust `maxInstances` based on traffic needs
   - Consider upgrading to Blaze plan for more flexible pricing

### 6.3. Updating Configuration

If you need to update your environment configuration:

1. **Update Environment Variables**:
   - Edit the appropriate `apphosting.*.yaml` file
   - Redeploy with:
   ```bash
   npm run deploy:dev  # For development
   # or
   npm run deploy:prod # For production
   ```

2. **Update Secrets**:
   ```bash
   # For development
   gcloud config set project your-dev-project-id
   echo "new-secret-value" | gcloud secrets versions add firebase_service_account_dev --data-file=-
   
   # For production
   gcloud config set project your-prod-project-id
   echo "new-secret-value" | gcloud secrets versions add firebase_service_account_prod --data-file=-
   ```

## Quick Reference Commands

### Development Environment

```bash
# Deploy to development
npm run deploy:dev

# Check logs
firebase functions:log --project your-dev-project-id

# Test locally with dev environment
npm run dev

# View development app
firebase hosting:open --project your-dev-project-id
```

### Production Environment

```bash
# Deploy to production
npm run deploy:prod

# Check logs
firebase functions:log --project your-prod-project-id

# Test production build locally
NODE_ENV=production npm run build && npm start

# View production app
firebase hosting:open --project your-prod-project-id
```

## Conclusion

Congratulations! You've now set up a complete deployment pipeline for your DisheEvent application with separate development and production environments on Firebase App Hosting.

This separation allows you to:
- Test changes safely in development before promoting to production
- Keep production data isolated from development experiments
- Maintain different scaling configurations for each environment
- Deploy quickly and reliably to both environments

Remember to monitor your application performance and costs regularly, and follow security best practices for managing your environment variables and service account keys.

Happy deploying!