# Firebase Database Schema

## Overview
This schema is designed to work with Firebase Realtime Database and Firebase Storage. It follows a relational-like structure adapted for NoSQL databases.

## Main Tables

### 1. events
Primary table for event information

```json
{
  "events": {
    "event_id_1": {
      "id": "event_id_1",
      "userId": "user123",
      "title": "Jane and John's Wedding",
      "description": "Join us as we celebrate our special day",
      "date": "2023-12-31T18:00:00Z",
      "time": "18:00",
      "location": "123 Wedding Venue Ln",
      "themeId": "theme_id_1",
      "visibility": "public",
      "maxGuests": 100,
      "coverImageUrl": "https://storage.url/image.jpg", 
      "eventType": "wedding",
      "createdAt": "2023-09-25T14:00:00Z",
      "updatedAt": "2023-09-25T16:00:00Z",
      "status": "active"
    }
  }
}
```

### 2. event_resources
Contains specific details for each event type

```json
{
  "event_resources": {
    "resource_id_1": {
      "id": "resource_id_1",
      "eventId": "event_id_1",
      "type": "wedding",
      "details": {
        "brideName": "Jane Doe",
        "groomName": "John Doe",
        "ceremonyLocation": "St. Mary's Church",
        "receptionLocation": "Grand Ballroom",
        "dressCode": "Formal"
      },
      "customFields": {
        "field1": "value1",
        "field2": "value2"
      },
      "customizations": {
        "headerImage": "https://storage.url/header.jpg",
        "fontFamily": "Roboto",
        "colorScheme": {
          "primary": "#7c3aed",
          "secondary": "#d1d5db",
          "accent": "#10b981"
        }
      }
    }
  }
}
```

For birthday events:
```json
{
  "details": {
    "celebrantName": "Emma Smith",
    "age": 30,
    "theme": "Vintage",
    "giftPreferences": "Books and art supplies"
  }
}
```

For corporate events:
```json
{
  "details": {
    "organizationName": "TechCorp Inc",
    "agenda": "Annual company retreat and team building",
    "speakerList": ["John Smith", "Sarah Johnson"],
    "sponsorList": ["SponsorA", "SponsorB"]
  }
}
```

### 3. themes
Contains theme templates that can be selected for events

```json
{
  "themes": {
    "theme_id_1": {
      "id": "theme_id_1",
      "name": "Classic Wedding",
      "type": "wedding",
      "previewImage": "https://storage.url/theme-preview.jpg",
      "components": {
        "header": {
          "style": "centered",
          "showNames": true,
          "showDate": true
        },
        "gallery": {
          "enabled": true,
          "maxImages": 6,
          "style": "grid"
        },
        "schedule": {
          "style": "timeline"
        },
        "rsvp": {
          "style": "formal",
          "fields": ["name", "email", "plusOne", "dietaryRestrictions"]
        }
      },
      "colors": {
        "primary": "#7c3aed",
        "secondary": "#d1d5db",
        "accent": "#10b981",
        "background": "#ffffff",
        "text": "#111827"
      },
      "fonts": {
        "heading": "Playfair Display",
        "body": "Roboto"
      },
      "isPremium": false
    }
  }
}
```

### 4. guests
Contains guest information and RSVPs

```json
{
  "guests": {
    "event_id_1": {
      "guest_id_1": {
        "id": "guest_id_1",
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "phone": "+12345678901",
        "response": "yes",
        "numOfAttendees": 2,
        "note": "Looking forward to it!",
        "invitedAt": "2023-09-20T12:00:00Z",
        "respondedAt": "2023-09-22T15:30:00Z"
      }
    }
  }
}
```

### 5. users
Contains user information

```json
{
  "users": {
    "user123": {
      "id": "user123",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "subscriptionPlan": "free",
      "subscriptionStatus": "active",
      "createdAt": "2023-08-01T10:00:00Z"
    }
  }
}
```

## Storage Structure

For Firebase Storage, we'll use the following structure:

```
/users/{userId}/profile/{filename}  - User profile images
/events/{eventId}/cover/{filename}  - Event cover images
/events/{eventId}/gallery/{filename}  - Event gallery images
/themes/{themeId}/{filename}  - Theme images and assets
```