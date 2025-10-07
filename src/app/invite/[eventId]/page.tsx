import { notFound } from 'next/navigation';
import WeddingClassic from '@/components/themes/wedding/ClassicTheme';
import WeddingElegant from '@/components/themes/wedding/ElegantTheme';
import WeddingModern from '@/components/themes/wedding/ModernTheme';
import BirthdayFun from '@/components/themes/birthday/FunTheme';
import BirthdayPlayful from '@/components/themes/birthday/PlayfulTheme';
import BirthdayElegant from '@/components/themes/birthday/ElegantTheme';
import CorporateProfessional from '@/components/themes/corporate/ProfessionalTheme';
import CorporateMinimal from '@/components/themes/corporate/MinimalTheme';
import CorporateLuxury from '@/components/themes/corporate/LuxuryTheme';
import { EventType } from '@/types';

// Normally this would fetch data from Firebase using the eventId
async function getEvent(eventId: string) {
  // This is a mock event for demonstration
  // In a real app, we would fetch from Firebase using the eventId
  
  // Pretend we're fetching from Firebase
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Mock data
  const eventTypes: EventType[] = ['wedding', 'birthday', 'corporate'];
  const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  
  // Select a random theme option for the event type
  const weddingThemes = ['classic', 'elegant', 'modern'];
  const birthdayThemes = ['fun', 'playful', 'elegant'];
  const corporateThemes = ['professional', 'minimal', 'luxury'];
  
  const themeOptions = randomType === 'wedding' 
    ? weddingThemes 
    : randomType === 'birthday'
    ? birthdayThemes
    : corporateThemes;
  
  const randomTheme = themeOptions[Math.floor(Math.random() * themeOptions.length)];
  
  return {
    id: eventId,
    ownerId: 'user123',
    eventType: randomType,
    title: randomType === 'wedding' 
      ? 'Emily & Michael\'s Wedding' 
      : randomType === 'birthday'
      ? 'Alex\'s 30th Birthday'
      : 'Annual Tech Conference 2025',
    description: 'Please join us for this special occasion. We look forward to celebrating with you!',
    date: '2025-11-15',
    time: '15:00',
    location: '123 Celebration Avenue, New York',
    theme: randomTheme,
    visibility: 'public',
    maxGuests: 150,
    coverImage: '/event-cover.jpg',
    extraFields: randomType === 'wedding'
      ? {
          brideName: 'Emily Johnson',
          groomName: 'Michael Smith',
          ceremonyLocation: 'Central Park Botanical Garden',
          receptionLocation: 'Grand Plaza Hotel',
          dressCode: 'Formal',
        }
      : randomType === 'birthday'
      ? {
          celebrantName: 'Alex Williams',
          age: 30,
          theme: 'Retro 90s',
          giftPreferences: 'Vinyl records or donations to charity',
        }
      : {
          organizationName: 'TechCorp',
          agenda: '9:00 - Registration\n10:00 - Keynote\n12:00 - Lunch\n13:00 - Workshops\n17:00 - Networking',
          speakerList: ['Jane Doe, CEO', 'John Smith, CTO', 'Sarah Johnson, Product Lead'],
          sponsorList: ['Acme Corp', 'TechGiant', 'StartupX'],
        },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export default async function EventPage({ params }: { params: Promise<{ eventId: string }> | { eventId: string } }) {
  // For server components, we don't need to use React.use() as they are already async
  const resolvedParams = await Promise.resolve(params);
  const event = await getEvent(resolvedParams.eventId);
  
  if (!event) {
    notFound();
  }

  // Convert date string to formatted display date
  const displayDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Common theme props
  const themeProps = {
    eventId: event.id,
    eventType: event.eventType,
    title: event.title,
    date: displayDate,
    time: event.time,
    location: event.location,
    description: event.description,
    coverImage: event.coverImage,
    primaryColor: '#6366F1',  // Default indigo
    secondaryColor: '#4F46E5',
    accentColor: '#EC4899',   // Default pink
    extraFields: event.extraFields,
    isPremium: false, // This would be determined by checking if the event has been upgraded
  };
  
  // Render the appropriate theme based on event type and theme
  return (
    <>
      {event.eventType === 'wedding' && (
        <>
          {event.theme === 'classic' && (
            <WeddingClassic {...themeProps} extraFields={event.extraFields as any} />
          )}
          {event.theme === 'elegant' && (
            <WeddingElegant {...themeProps} extraFields={event.extraFields as any} />
          )}
          {event.theme === 'modern' && (
            <WeddingModern {...themeProps} extraFields={event.extraFields as any} />
          )}
        </>
      )}
      
      {event.eventType === 'birthday' && (
        <>
          {event.theme === 'fun' && (
            <BirthdayFun {...themeProps} extraFields={event.extraFields as any} />
          )}
          {event.theme === 'playful' && (
            <BirthdayPlayful {...themeProps} extraFields={event.extraFields as any} />
          )}
          {event.theme === 'elegant' && (
            <BirthdayElegant {...themeProps} extraFields={event.extraFields as any} />
          )}
        </>
      )}
      
      {event.eventType === 'corporate' && (
        <>
          {event.theme === 'professional' && (
            <CorporateProfessional {...themeProps} extraFields={event.extraFields as any} />
          )}
          {event.theme === 'minimal' && (
            <CorporateMinimal {...themeProps} extraFields={event.extraFields as any} />
          )}
          {event.theme === 'luxury' && (
            <CorporateLuxury {...themeProps} extraFields={event.extraFields as any} />
          )}
        </>
      )}
    </>
  );
}