import { Timestamp } from 'firebase/firestore';

// User Model
export interface User {
  id: string;
  name: string;
  email: string;
  subscriptionPlan: 'free' | 'basic' | 'premium';
  subscriptionStatus: 'active' | 'inactive';
  createdAt: Timestamp | string;
}

// Event Type Enum
export type EventType = 'wedding' | 'birthday' | 'corporate';
export type EventVisibility = 'public' | 'private';
export type EventStatus = 'active' | 'draft' | 'archived';

// Core Event Model
export interface Event {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: Date | string | Timestamp;
  time: string;
  location: string;
  themeId: string;
  visibility: EventVisibility;
  maxGuests: number;
  coverImageUrl?: string;
  eventType: EventType;
  createdAt: string | Timestamp;
  updatedAt: string | Timestamp;
  status: EventStatus;
}

// Event Resources Model - Common properties
export interface EventResource {
  id: string;
  eventId: string;
  type: EventType;
  details: WeddingDetails | BirthdayDetails | CorporateDetails;
  customFields?: Record<string, string | number | boolean | string[]>;
  customizations?: {
    headerImage?: string;
    fontFamily?: string;
    colorScheme?: {
      primary: string;
      secondary: string;
      accent: string;
    }
  };
}

// Type-specific details
export interface WeddingDetails {
  brideName: string;
  groomName: string;
  ceremonyLocation: string;
  receptionLocation: string;
  dressCode: string;
}

export interface BirthdayDetails {
  celebrantName: string;
  age: number;
  theme: string;
  giftPreferences?: string;
}

export interface CorporateDetails {
  organizationName: string;
  agenda: string;
  speakerList?: string[];
  sponsorList?: string[];
}

// Type guards for resources
export function isWeddingDetails(details: unknown): details is WeddingDetails {
  return details !== null && 
         typeof details === 'object' && 
         'brideName' in details && 
         'groomName' in details;
}

export function isBirthdayDetails(details: unknown): details is BirthdayDetails {
  return details !== null && 
         typeof details === 'object' && 
         'celebrantName' in details && 
         'age' in details;
}

export function isCorporateDetails(details: unknown): details is CorporateDetails {
  return details !== null && 
         typeof details === 'object' && 
         'organizationName' in details && 
         'agenda' in details;
}

// Theme Model
export interface Theme {
  id: string;
  name: string;
  type: EventType;
  previewImage: string;
  components: {
    header?: {
      style: string;
      showNames: boolean;
      showDate: boolean;
    };
    gallery?: {
      enabled: boolean;
      maxImages: number;
      style: string;
    };
    schedule?: {
      style: string;
    };
    rsvp?: {
      style: string;
      fields: string[];
    };
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  isPremium: boolean;
}

// Guest Model
export interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  response?: 'yes' | 'no' | 'maybe';
  numOfAttendees?: number;
  note?: string;
  invitedAt: string | Timestamp;
  respondedAt?: string | Timestamp;
}

// Analytics Model
export interface EventAnalytics {
  date: string;
  views: number;
  uniqueVisitors: number;
  rsvpCount: {
    yes: number;
    no: number;
    maybe: number;
  };
}

// Subscription Model
export interface SubscriptionPlan {
  name: 'free' | 'basic' | 'premium';
  maxEvents: number;
  maxGuests: number;
  hasWatermark: boolean;
  availableTemplates: 'basic' | 'all';
  price: number;
}

// Event Upgrade Model
export interface EventUpgrade {
  eventId: string;
  upgradeType: 'basic' | 'premium';
  price: number;
  maxGuests: number;
  purchaseDate: string | Timestamp;
}

// Form Submission Types
export interface WeddingFormData {
  eventType: 'wedding';
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  theme: string;
  visibility: EventVisibility;
  maxGuests: number;
  coverImage?: File;
  extraFields: {
    brideName: string;
    groomName: string;
    ceremonyLocation: string;
    receptionLocation: string;
    dressCode: string;
  };
}

export interface BirthdayFormData {
  eventType: 'birthday';
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  theme: string;
  visibility: EventVisibility;
  maxGuests: number;
  coverImage?: File;
  extraFields: {
    celebrantName: string;
    age: number;
    theme: string;
    giftPreferences?: string;
  };
}

export interface CorporateFormData {
  eventType: 'corporate';
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  theme: string;
  visibility: EventVisibility;
  maxGuests: number;
  coverImage?: File;
  extraFields: {
    organizationName: string;
    agenda: string;
    speakerList?: string[];
    sponsorList?: string[];
  };
}

export type EventFormData = WeddingFormData | BirthdayFormData | CorporateFormData;