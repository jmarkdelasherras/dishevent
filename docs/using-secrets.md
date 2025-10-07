# Using Secrets for Firebase Configuration

This document explains the benefits and implementation details of using Google Cloud Secret Manager for all Firebase configuration values in the DisheEvent application.

## Why Use Secrets for All Firebase Configuration?

1. **Enhanced Security**: 
   - Prevents accidental exposure of API keys and credentials in source code
   - Reduces risk of keys being committed to version control systems
   - Protects against unauthorized access to sensitive Firebase resources

2. **Environment Separation**: 
   - Cleanly separates development and production configurations
   - Prevents accidental use of production credentials in development and vice versa
   - Allows for different permission sets across environments

3. **Access Control**:
   - Provides granular control over who can access which Firebase configurations
   - Integrates with Google Cloud IAM for role-based access control
   - Creates audit trails for credential access

4. **Credential Rotation**:
   - Simplifies the process of rotating credentials when needed
   - Updates can be made without modifying code or redeploying
   - Makes it easier to respond to security incidents

## What Has Changed?

The following configuration files have been updated to use secrets instead of hardcoded values:

1. **`apphosting.dev.yaml`**: Development environment configuration
   - All Firebase client configuration values are now stored as secrets
   - References secure values in Google Cloud Secret Manager

2. **`apphosting.prod.yaml`**: Production environment configuration
   - All Firebase client configuration values are now stored as secrets
   - References secure values in Google Cloud Secret Manager

3. **Deployment Documentation**: Updated to include instructions for:
   - Creating and managing secrets for all Firebase configuration values
   - Granting appropriate access to App Hosting service accounts
   - Troubleshooting access issues

## Local Development

For local development:

1. Continue using `.env.local` files for local development
2. Ensure `.env.local` is in your `.gitignore` to prevent accidental commits
3. Reference the `.env.local.example` file for required environment variables

## Secret Management Workflow

1. **Create Secrets**:
   - Create secrets in Google Cloud Secret Manager for all Firebase configuration values
   - Use separate secrets for development and production environments

2. **Grant Access**:
   - Grant access to App Hosting service accounts to read the secrets
   - Use least privilege principles when assigning permissions

3. **Deploy**:
   - Use the existing deployment scripts that reference the correct configuration files

4. **Verify**:
   - Check logs for any secret access issues after deployment
   - Test authentication and other Firebase features to ensure proper configuration

## Benefits

By implementing this change, we've:

1. Improved the security posture of the DisheEvent application
2. Reduced the risk of credential exposure
3. Made the codebase cleaner and safer
4. Followed industry best practices for secret management