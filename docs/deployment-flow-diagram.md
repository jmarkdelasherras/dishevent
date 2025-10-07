# DisheEvent Deployment Flow Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Local Code    │────▶│  GitHub Repo    │────▶│ GitHub Actions  │
│   Development   │     │  (Push/Merge)   │     │  Workflow       │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Firebase      │◀────│  Firebase App   │◀────│  Build & Test   │
│   App Hosting   │     │  Hosting Deploy │     │  Application    │
│   (Live Site)   │     │                 │     │                 │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Detailed Flow

1. **Developer creates or updates code locally**
   - Makes changes to the codebase
   - Tests locally with `npm run dev`
   - Runs `npm run clean` to remove sensitive files

2. **Code pushed to GitHub repository**
   - `git push origin dev` for development environment
   - `git push origin main` for production environment
   - OR merges a pull request to these branches

3. **GitHub Actions workflow triggered automatically**
   - Checks out the latest code
   - Installs dependencies
   - Runs linting and tests

4. **Environment determination**
   - `dev` branch → Development environment
   - `main`/`master` branch → Production environment
   - Sets appropriate configurations and secrets

5. **Application build**
   - Creates environment file from GitHub secrets
   - Builds Next.js application
   - Prepares for deployment

6. **Authentication with Google Cloud & Firebase**
   - Sets up Google Cloud SDK
   - Configures Firebase CLI
   - Uses service account credentials

7. **Firebase App Hosting deployment**
   - Deploys server-side rendering to Cloud Run
   - Deploys static assets to Firebase CDN
   - Routes traffic to new version

8. **Live site updated**
   - New version goes live
   - Zero-downtime deployment
   - Users see the updated application

## Environment-Specific Paths

### Development Environment (`dev` branch)

```
Code Push to 'dev' → GitHub Actions → Build with Dev Secrets →
Update Google Cloud Secrets → Prepare firebase.dev.json & apphosting.dev.yaml →
Deploy to Firebase Dev Project → Development Site Live
```

### Production Environment (`main`/`master` branch)

```
Code Push to 'main'/'master' → GitHub Actions → Build with Prod Secrets →
Update Google Cloud Secrets → Prepare firebase.prod.json & apphosting.prod.yaml →
Deploy to Firebase Prod Project → Production Site Live
```

This visual representation complements the detailed deployment guide and provides a quick reference for understanding the entire workflow.