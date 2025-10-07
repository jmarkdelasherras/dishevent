# DisheEvent Deployment Quick Guide

This is a condensed guide for developers who need to quickly understand how to deploy the DisheEvent application.

## Branch-Based Deployment Strategy

| Branch | Environment | URL | Trigger |
|--------|------------|-----|---------|
| `dev` | Development | [dev.dishevent.com](https://dev.dishevent.com) | Push/merge to `dev` |
| `main`/`master` | Production | [dishevent.com](https://dishevent.com) | Push/merge to `main`/`master` |

## Common Deployment Commands

### Preparing for Deployment

```bash
# Clean up sensitive files (ALWAYS do this before committing)
npm run cleanup
# OR
npm run prepare-commit
```

### Deploying to Development Environment

```bash
# Push to dev branch to trigger automatic deployment
git add .
git commit -m "Your commit message"
git push origin dev
```

### Deploying to Production Environment

```bash
# Option 1: Push directly to main/master
git push origin main

# Option 2: Merge from dev branch
git checkout main
git merge dev
git push origin main
```

### Manual Deployment (if needed)

```bash
# Deploy to development environment
npm run deploy:dev

# Deploy to production environment
npm run deploy:prod

# Deploy database rules to development
npm run deploy:rules:dev
```

## Checking Deployment Status

1. **GitHub Actions**: Go to your repository > Actions tab > Latest workflow run
2. **Firebase Console**: [console.firebase.google.com](https://console.firebase.google.com) > Your project > Hosting

## Common Issues

| Issue | Solution |
|-------|----------|
| Deploy fails at build | Check build logs in GitHub Actions |
| Authentication error | Verify Firebase token and service account permissions |
| Missing environment variables | Check GitHub Secrets are properly configured |
| Deployment successful but site not updated | Check for routing issues or browser cache |
| Node.js version warnings | Add engine overrides in package.json (see Troubleshooting) |
| ESLint errors blocking build | Fix ESLint errors or update eslint.config.mjs rules |

## Troubleshooting

### Node.js Version Compatibility

If you see Firebase package warnings about Node.js versions:

```bash
npm warn EBADENGINE Unsupported engine {
  package: '@firebase/app@0.14.3',
  required: { node: '>=20.0.0' },
  current: { node: 'v18.20.8', npm: '10.8.2' }
}
```

Add the following to your package.json:

```json
"engines": {
  "node": ">=18.0.0"
},
"overrides": {
  "@firebase/app": {
    "engines": {
      "node": ">=18.0.0"
    }
  },
  "@firebase/auth": {
    "engines": {
      "node": ">=18.0.0"
    }
  }
}
```

### ESLint Errors During Build

If ESLint errors are failing your build, either:

1. Fix the specific errors in your code
2. Update eslint.config.mjs to make specific rules warnings instead of errors:

```javascript
{
  rules: {
    "react/no-unescaped-entities": "warn",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

## Need More Help?

For detailed information, refer to:

- [Deployment Process Guide](./deployment-process-guide.md)
- [Deployment Flow Diagram](./deployment-flow-diagram.md)
- [GitHub CI/CD Secrets Setup](./github-cicd-secrets.md)

## Security Reminder

NEVER commit sensitive information like API keys, tokens, or credentials to the repository. Always use GitHub Secrets for storing sensitive information.
