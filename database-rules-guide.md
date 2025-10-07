# Firebase Realtime Database Rules

This document explains the security rules for the DisheEvent Firebase Realtime Database in the development environment.

## Overview

The database rules follow these general principles:
- Authentication is required for most operations
- Users can only read/write their own data
- Event creators have full access to their events
- Event guests have limited access based on their permissions
- Public events are readable by everyone
- Templates are readable by all authenticated users but only writeable by admins

## Rule Structure

### Top-level Rules
```
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    ...
  }
}
```
For development, we're allowing any authenticated user to have basic read/write access, but with specific restrictions on individual paths.

### User Data

Each user's data is protected:
```
"users": {
  "$uid": {
    ".read": "$uid === auth.uid || auth.token.admin === true",
    ".write": "$uid === auth.uid || auth.token.admin === true",
    ...
  }
}
```
This ensures users can only access their own data unless they have admin privileges.

### Events

Events have complex permissions based on visibility and guest status:
```
"events": {
  "$eventId": {
    ".read": "data.child('visibility').val() === 'public' || (auth != null && (data.child('creatorUid').val() === auth.uid || root.child('events/' + $eventId + '/guests/' + auth.uid).exists()))",
    ".write": "auth != null && (!data.exists() || data.child('creatorUid').val() === auth.uid)",
    ...
  }
}
```
This allows:
- Public events to be visible to everyone
- Private events to be visible only to the creator and invited guests
- Only the creator can modify event details

### Invites

Invites are publicly readable to allow anyone with an invite link to view basic information:
```
"invites": {
  "$inviteId": {
    ".read": true,
    ".write": "auth != null && (!data.exists() || data.child('creatorUid').val() === auth.uid)"
  }
}
```

### Templates

Templates for events are readable by all authenticated users but only administrators can modify them:
```
"templates": {
  ".read": "auth != null",
  ".write": "auth != null && auth.token.admin === true"
}
```

## Development vs. Production

These rules are optimized for the development environment. For production, you would want to:
- Further restrict top-level access
- Add more validation rules
- Possibly add rate limiting
- Consider implementing more granular permissions

## Deploying Rules

To deploy these rules to your development environment:
```bash
npm run deploy:rules:dev
```