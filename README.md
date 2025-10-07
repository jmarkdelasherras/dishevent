# DisheVent - Digital Event Management Platform

![DisheVent Logo](/public/assets/logo.png)

## Overview

DisheVent is a comprehensive event management platform built with Next.js and Firebase, designed to streamline the creation, customization, and management of digital events. From weddings to corporate gatherings, DisheVent provides beautiful templates, real-time RSVP tracking, and responsive design for an exceptional guest experience.

## Features

- **Multiple Event Types**: Support for weddings, birthdays, corporate events, and more
- **Customizable Templates**: Beautiful, responsive themes for each event type
- **Real-time RSVP Management**: Track guest responses instantly
- **User Authentication**: Secure account management with Firebase Authentication
- **Mobile Responsive**: Perfect viewing experience on all devices
- **Event Previews**: See how your event page will look before publishing
- **Guest Management**: Add, remove, and track guests easily

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **State Management**: React Hooks
- **Styling**: Tailwind CSS, CSS Modules
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm/bun
- Firebase account

### Installation

1. Clone the repository:

```bash
git clone https://your-repository-url/dishevent.git
cd dishevent
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Set up Environment Variables

Create a `.env.local` file in the root of the project with your Firebase configuration:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin (for server-side authentication)
# IMPORTANT: The service account key must be properly formatted
# See "Formatting Service Account Key" section below
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"..."}'
```

### Formatting Service Account Key

The `FIREBASE_SERVICE_ACCOUNT_KEY` needs to be properly formatted to work correctly, especially the `private_key` field which contains newlines.

#### Option 1: Use the provided script (Recommended)

1. Download your service account key JSON file from the Firebase Console
1. Save it as `service-account.json` in the project root
1. Run the formatting script:

```bash
node scripts/format-service-account.mjs
```

1. Copy the output to your `.env.local` file

#### Option 2: Manual formatting

If you're formatting the key manually, ensure that:

- The entire JSON is on a single line
- The JSON is wrapped in single quotes
- The `private_key` field has proper newline escaping (`\\n`)

### Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/               # Next.js App Router structure
│   ├── (auth)/        # Authentication related pages
│   ├── (dashboard)/   # Dashboard pages
│   ├── api/           # API routes
│   ├── event/         # Event pages
│   └── invite/        # Event invitation pages
├── components/        # Reusable UI components
│   ├── auth/          # Authentication components
│   ├── events/        # Event type components
│   ├── forms/         # Form components
│   ├── layouts/       # Layout components
│   ├── template/      # Event templates
│   ├── themes/        # Theme components
│   └── ui/            # UI components
├── hooks/             # Custom React hooks
│   └── firebase/      # Firebase-specific hooks
├── lib/               # Utility functions
│   ├── firebase/      # Firebase configurations
│   ├── utils/         # General utilities
│   └── validation/    # Form validation schemas
└── types/             # TypeScript type definitions
```

## Usage

### Creating an Event

1. Log in to your account
1. Navigate to Dashboard > Events > Create New
1. Choose an event type (Wedding, Birthday, etc.)
1. Fill out the event details
1. Select and customize a theme
1. Preview your event
1. Publish and share your event link

### Managing RSVPs

1. Navigate to your event dashboard
1. View the RSVP section to see responses
1. Export guest list if needed

## Deployment

The easiest way to deploy your DisheVent app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
