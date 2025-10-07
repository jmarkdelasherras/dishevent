# Firebase App Hosting Secrets Configuration Guide

This guide explains how to set up your Firebase secrets in Google Cloud Secret Manager for secure deployment with App Hosting.

## Why Use Secrets?

Storing Firebase configuration values as secrets is the recommended approach for:

1. **Security**: Prevents API keys and credentials from being exposed in source code
2. **Separation of Concerns**: Keeps application code separate from environment-specific configurations
3. **Compliance**: Helps meet security requirements and best practices

## Secret Setup Process

### 1. Create Secrets in Google Cloud Secret Manager

For **Development** environment, create the following secrets:

```bash
# Firebase Client SDK Secrets
gcloud secrets create firebase_api_key_dev --replication-policy="automatic"
gcloud secrets create firebase_auth_domain_dev --replication-policy="automatic"
gcloud secrets create firebase_project_id_dev --replication-policy="automatic"
gcloud secrets create firebase_storage_bucket_dev --replication-policy="automatic"
gcloud secrets create firebase_messaging_sender_id_dev --replication-policy="automatic"
gcloud secrets create firebase_app_id_dev --replication-policy="automatic"
gcloud secrets create firebase_measurement_id_dev --replication-policy="automatic"

# Firebase Admin SDK Secret
gcloud secrets create firebase_service_account_dev --replication-policy="automatic"
```

For **Production** environment, create the following secrets:

```bash
# Firebase Client SDK Secrets
gcloud secrets create firebase_api_key_prod --replication-policy="automatic"
gcloud secrets create firebase_auth_domain_prod --replication-policy="automatic"
gcloud secrets create firebase_project_id_prod --replication-policy="automatic"
gcloud secrets create firebase_storage_bucket_prod --replication-policy="automatic"
gcloud secrets create firebase_messaging_sender_id_prod --replication-policy="automatic"
gcloud secrets create firebase_app_id_prod --replication-policy="automatic"
gcloud secrets create firebase_measurement_id_prod --replication-policy="automatic"

# Firebase Admin SDK Secret
gcloud secrets create firebase_service_account_prod --replication-policy="automatic"
```

### 2. Add Values to Secrets

Add your Firebase configuration values to the secrets:

```bash
# Example for development environment
echo "AIzaSyCBU7vqLyCmBnS_FCJg0NY67j2f1IzBU2o" | gcloud secrets versions add firebase_api_key_dev --data-file=-
echo "dishevent-dev.firebaseapp.com" | gcloud secrets versions add firebase_auth_domain_dev --data-file=-
echo "dishevent-dev" | gcloud secrets versions add firebase_project_id_dev --data-file=-
echo "dishevent-dev.firebasestorage.app" | gcloud secrets versions add firebase_storage_bucket_dev --data-file=-
echo "1045959860457" | gcloud secrets versions add firebase_messaging_sender_id_dev --data-file=-
echo "1:1045959860457:web:3aac2866fe56b3afdf1078" | gcloud secrets versions add firebase_app_id_dev --data-file=-
echo "G-YOUR-MEASUREMENT-ID" | gcloud secrets versions add firebase_measurement_id_dev --data-file=-

# For the service account, you need to provide the entire JSON file
gcloud secrets versions add firebase_service_account_dev --data-file=/path/to/service-account-dev.json
```

Repeat the same process for the production secrets with the appropriate values.

### 3. Grant Access to App Hosting Service Account

Give the Firebase App Hosting service account access to these secrets:

```bash
# Get your App Hosting service account
SERVICE_ACCOUNT=$(gcloud firebase app-hosting get-app-hosting-service-agent --format="value(email)")

# Grant access to all secrets
for SECRET_NAME in firebase_api_key_dev firebase_auth_domain_dev firebase_project_id_dev firebase_storage_bucket_dev firebase_messaging_sender_id_dev firebase_app_id_dev firebase_measurement_id_dev firebase_service_account_dev
do
  gcloud secrets add-iam-policy-binding $SECRET_NAME \
    --member="serviceAccount:$SERVICE_ACCOUNT" \
    --role="roles/secretmanager.secretAccessor"
done

# Repeat for production secrets
for SECRET_NAME in firebase_api_key_prod firebase_auth_domain_prod firebase_project_id_prod firebase_storage_bucket_prod firebase_messaging_sender_id_prod firebase_app_id_prod firebase_measurement_id_prod firebase_service_account_prod
do
  gcloud secrets add-iam-policy-binding $SECRET_NAME \
    --member="serviceAccount:$SERVICE_ACCOUNT" \
    --role="roles/secretmanager.secretAccessor"
done
```

### 4. Local Development Setup

For local development, create a `.env.local` file in your project root with your development environment values:

```
# Firebase Client SDK Config
NEXT_PUBLIC_FIREBASE_API_KEY=your-dev-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-dev-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-dev-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-dev-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-dev-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-dev-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-dev-measurement-id

# Firebase Admin SDK Config (service account as JSON string)
FIREBASE_SERVICE_ACCOUNT_KEY='{...}' 
```

**Important**: Make sure `.env.local` is added to `.gitignore` to prevent accidentally committing these values to your repository.

## Deployment Process

### Development Deployment

```bash
firebase hosting:deploy --only app-hosting --config firebase.dev.json
```

### Production Deployment

```bash
firebase hosting:deploy --only app-hosting --config firebase.prod.json
```

## Troubleshooting

If you encounter authentication issues:

1. **Check Secret Access**: Make sure the App Hosting service account has access to all secrets.
2. **Verify Secret Values**: Double-check that the secret values match your Firebase configuration.
3. **Secret Versioning**: Ensure you're using the latest version of each secret.
4. **Logs**: Check Cloud Run logs for any errors related to accessing secrets.