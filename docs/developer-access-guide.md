# Developer Access Guard

This document describes the Developer Access Guard feature implemented in the DisheEvent application for the development environment.

## Overview

The Developer Access Guard is a security feature that restricts access to sensitive parts of the application during development. It requires entering a special access key before users can reach login, signup, or password reset pages.

This ensures that only authorized developers can access these features in the development environment, reducing the risk of unauthorized access or testing.

## Protected Routes

The following routes are protected by the Developer Access Guard:
- `/login`
- `/signup`
- `/forgot-password`

## How It Works

1. When a user attempts to access a protected route, they're presented with an access key input form
2. The user must enter the correct developer access key to proceed
3. Once authenticated, the access is stored in local storage, so the user won't need to re-enter the key during the same session
4. If an incorrect key is entered, an error message is displayed and access is denied

## Access Key

The developer access key is set to:

```
DISHEVENT_DEV_2025
```

## Customizing the Access Key

To change the access key, modify the `DEVELOPER_ACCESS_KEY` constant in the `DeveloperAccessGuard.tsx` file:

```tsx
// Developer access key - this would be your hardcoded credential
const DEVELOPER_ACCESS_KEY = 'YOUR_NEW_ACCESS_KEY';
```

## Security Considerations

This implementation provides basic access control for development purposes only. It is not meant to replace proper authentication and authorization in production.

For production environments, consider:
- Using a proper authentication service
- Implementing rate limiting
- Using HTTPS
- Storing keys in environment variables rather than hardcoding them

## Disabling the Guard

To temporarily disable the developer access guard, you can modify the `PROTECTED_ROUTES` array in `DeveloperAccessGuard.tsx` to be empty:

```tsx
const PROTECTED_ROUTES = [];
```

Alternatively, you can remove the `<DeveloperAccessGuard>` wrapper from the `Providers.tsx` file.