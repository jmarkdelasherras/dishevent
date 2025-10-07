import { z } from 'zod';

// Authentication Schemas
export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must include uppercase, lowercase, number and special character'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Basic Event Schema
const baseEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.date(),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  theme: z.string(),
  visibility: z.enum(['public', 'private']),
  maxGuests: z.number().min(1, 'Must have at least 1 guest'),
  coverImage: z.any().optional(), // Allow File object for form submission
});

// Wedding Event Schema
export const weddingEventSchema = baseEventSchema.extend({
  eventType: z.literal('wedding'),
  extraFields: z.object({
    brideName: z.string().min(2, 'Bride name must be at least 2 characters'),
    groomName: z.string().min(2, 'Groom name must be at least 2 characters'),
    ceremonyLocation: z.string().min(3, 'Ceremony location must be at least 3 characters'),
    receptionLocation: z.string().min(3, 'Reception location must be at least 3 characters'),
    dressCode: z.string(),
  }),
});

// Birthday Event Schema
export const birthdayEventSchema = baseEventSchema.extend({
  eventType: z.literal('birthday'),
  extraFields: z.object({
    celebrantName: z.string().min(2, 'Celebrant name must be at least 2 characters'),
    age: z.number().min(0, 'Age must be positive'),
    theme: z.string(),
    giftPreferences: z.string().optional(),
  }),
});

// Corporate Event Schema
export const corporateEventSchema = baseEventSchema.extend({
  eventType: z.literal('corporate'),
  extraFields: z.object({
    organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
    agenda: z.string().min(10, 'Agenda must be at least 10 characters'),
    speakerList: z.array(z.string()).optional(),
    sponsorList: z.array(z.string()).optional(),
  }),
});

// Combined Event Schema
export const eventSchema = z.discriminatedUnion('eventType', [
  weddingEventSchema,
  birthdayEventSchema,
  corporateEventSchema,
]);

// Guest Schema
export const guestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
});

// RSVP Schema
export const rsvpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  response: z.enum(['yes', 'no', 'maybe']),
  numOfAttendees: z.number().min(0, 'Number of attendees must be positive'),
  note: z.string().optional(),
});