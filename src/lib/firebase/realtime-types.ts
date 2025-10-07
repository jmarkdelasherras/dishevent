// Extended types for Realtime Database usage
// These are similar to the types in src/types/index.ts but adapted for Realtime Database

export interface RealtimeGuest {
  name: string;
  email: string;
  phone?: string;
  response?: 'yes' | 'no' | 'maybe';
  numOfAttendees?: number;
  note?: string;
  respondedAt?: string; // ISO string date format
  invitedAt?: string; // ISO string date format
}

export interface RealtimeGuestWithId extends RealtimeGuest {
  id: string;
}

export interface RealtimeEvent {
  ownerId: string;
  eventType: 'wedding' | 'birthday' | 'corporate';
  name: string;
  description: string;
  date: string; // ISO string date format
  theme: string;
  visibility: 'public' | 'private';
  shareUrl?: string;
  planType: 'free' | 'premium';
  status?: 'active' | 'draft' | 'completed';
  maxGuests: number;
  extraFields?: Record<string, unknown>;
  createdAt: string; // ISO string date format
  updatedAt: string; // ISO string date format
}

export interface RealtimeEventWithId extends RealtimeEvent {
  id: string;
}

// Generic data types
export type RealtimeData = Record<string, unknown>;
export type RealtimeUpdates = Record<string, unknown>;