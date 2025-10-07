# Required GitHub Secrets for CI/CD

The project's GitHub Actions workflow requires certain secrets to be configured in your repository settings for successful deployment.

## Google Cloud Platform (GCP) Secrets

These secrets are required for deployment to Firebase App Hosting:

| Secret Name | Description |
|-------------|-------------|
| `GCP_PROJECT_ID` | The Google Cloud Project ID for your development environment |
| `GCP_SA_KEY` | A JSON service account key with proper permissions for your GCP project |

## Setup Instructions

1. Create a GCP Service Account:
   - Go to your Google Cloud Console > IAM & Admin > Service Accounts
   - Create a new service account with the following roles:
     - Firebase Admin
     - Secret Manager Admin
     - Cloud Run Admin
     - Storage Admin

2. Generate a JSON key for this service account:
   - In the service account details, go to the Keys tab
   - Add a new key and select JSON format
   - Download the key file

3. Add the secrets to GitHub:
   - Go to your GitHub repository > Settings > Secrets > Actions
   - Add a new repository secret named `GCP_PROJECT_ID` with your project ID
   - Add a new repository secret named `GCP_SA_KEY` with the entire JSON content of the key file

4. Optional Firebase Secrets:
   If you want to update your Firebase configuration during deployment, also add these secrets:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
   - `FIREBASE_SERVICE_ACCOUNT_DEV`