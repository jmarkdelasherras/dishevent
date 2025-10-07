import RSVPForm from '@/components/forms/RSVPForm';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { EventType } from '@/types';

// Same mock function as the event page (in real app, this would be shared)
async function getEvent(eventId: string) {
  // Pretend we're fetching from Firebase
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const eventTypes: EventType[] = ['wedding', 'birthday', 'corporate'];
  const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  
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

export default async function RSVPPage({ params }: { params: Promise<{ eventId: string }> | { eventId: string } }) {
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
  
  // Generate theme colors based on event type and specific theme
  const themeConfig = {
    wedding: {
      classic: {
        primary: '#6366F1',
        secondary: '#4F46E5',
        accent: '#EC4899',
        background: 'bg-slate-50',
        textHeader: 'text-indigo-900',
        headerBg: 'bg-indigo-50',
        decorative: '/assets/wedding-classic-decoration.svg',
        font: 'font-serif',
      },
      elegant: {
        primary: '#97714A',
        secondary: '#D5B88F',
        accent: '#8D5524',
        background: 'bg-amber-50',
        textHeader: 'text-amber-900',
        headerBg: 'bg-amber-100',
        decorative: '/assets/wedding-elegant-decoration.svg',
        font: 'font-serif',
      },
      modern: {
        primary: '#2D3748',
        secondary: '#A0AEC0',
        accent: '#4A5568',
        background: 'bg-gray-50',
        textHeader: 'text-gray-900',
        headerBg: 'bg-gray-100',
        decorative: '/assets/wedding-modern-decoration.svg',
        font: 'font-sans',
      }
    },
    birthday: {
      fun: {
        primary: '#EC4899',
        secondary: '#DB2777',
        accent: '#BE185D',
        background: 'bg-pink-50',
        textHeader: 'text-pink-900',
        headerBg: 'bg-pink-100',
        decorative: '/assets/birthday-fun-decoration.svg',
        font: 'font-sans',
      },
      playful: {
        primary: '#F472B6',
        secondary: '#DB2777',
        accent: '#9D174D',
        background: 'bg-pink-50',
        textHeader: 'text-pink-800',
        headerBg: 'bg-pink-100',
        decorative: '/assets/birthday-playful-decoration.svg',
        font: 'font-sans',
      },
      elegant: {
        primary: '#1E40AF',
        secondary: '#60A5FA',
        accent: '#1E3A8A',
        background: 'bg-blue-50',
        textHeader: 'text-blue-900',
        headerBg: 'bg-blue-100',
        decorative: '/assets/birthday-elegant-decoration.svg',
        font: 'font-serif',
      }
    },
    corporate: {
      professional: {
        primary: '#0F172A',
        secondary: '#64748B',
        accent: '#334155',
        background: 'bg-slate-50',
        textHeader: 'text-slate-900',
        headerBg: 'bg-slate-100',
        decorative: '/assets/corporate-professional-decoration.svg',
        font: 'font-sans',
      },
      minimal: {
        primary: '#1F2937',
        secondary: '#4B5563',
        accent: '#374151',
        background: 'bg-gray-50',
        textHeader: 'text-gray-900',
        headerBg: 'bg-gray-100',
        decorative: '/assets/corporate-minimal-decoration.svg',
        font: 'font-sans',
      },
      luxury: {
        primary: '#0F172A',
        secondary: '#CBD5E1',
        accent: '#334155',
        background: 'bg-slate-50',
        textHeader: 'text-slate-900',
        headerBg: 'bg-slate-100 bg-opacity-50',
        decorative: '/assets/corporate-luxury-decoration.svg',
        font: 'font-serif',
      }
    }
  };

  // Get theme settings for the current event
  const theme = themeConfig[event.eventType][event.theme as keyof typeof themeConfig[typeof event.eventType]];

  // Use fallback if theme not found (shouldn't happen, but just in case)
  const themeStyles = theme || themeConfig.wedding.classic;
  
  return (
    <div className={`min-h-screen ${themeStyles.background} py-12 ${themeStyles.font}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/invite/${event.id}`}
          className="inline-flex items-center mb-6 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Return to Invitation
        </Link>
      
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div 
            className={`py-10 px-6 text-white text-center relative overflow-hidden ${themeStyles.headerBg}`}
            style={{ backgroundColor: themeStyles.primary }}
          >
            <div className="relative z-10">
              <h1 className={`text-3xl font-bold ${event.eventType === 'wedding' && event.theme === 'elegant' ? 'font-serif' : ''}`}>
                RSVP to {event.title}
              </h1>
              <p className="mt-2 text-lg opacity-90">
                {displayDate} at {event.time}
              </p>
              <div className="w-24 h-1 bg-white mx-auto my-4 opacity-70"></div>
              <p className="text-lg font-light">
                Please let us know if you can join us
              </p>
            </div>
            
            {/* Decorative elements based on theme */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-0 left-0 w-full h-full" 
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '30px 30px',
                }}
              ></div>
            </div>
          </div>
          
          <div className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:space-x-10">
              <div className="md:w-1/3 mb-8 md:mb-0">
                <div className={`p-6 rounded-xl ${themeStyles.headerBg}`}>
                  <h2 
                    className={`text-xl font-bold mb-4 ${themeStyles.textHeader}`}
                  >
                    Event Details
                  </h2>
                  
                  <div className="space-y-5">
                    <div>
                      <div className="font-medium text-gray-900">Date & Time</div>
                      <div className="text-gray-700">{displayDate} at {event.time}</div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-gray-900">Location</div>
                      <div className="text-gray-700">{event.location}</div>
                    </div>
                    
                    {/* Event-specific details */}
                    {event.eventType === 'wedding' && (
                      <div>
                        <div className="font-medium text-gray-900">Dress Code</div>
                        <div className="text-gray-700">
                          {(event.extraFields as any).dressCode}
                        </div>
                      </div>
                    )}
                    
                    {event.eventType === 'birthday' && (
                      <div>
                        <div className="font-medium text-gray-900">Gift Preferences</div>
                        <div className="text-gray-700">
                          {(event.extraFields as any).giftPreferences || 'No specific preferences'}
                        </div>
                      </div>
                    )}
                    
                    {event.eventType === 'corporate' && (
                      <div>
                        <div className="font-medium text-gray-900">Hosted By</div>
                        <div className="text-gray-700">
                          {(event.extraFields as any).organizationName}
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <div 
                        className="h-0.5 w-12 mb-4"
                        style={{ backgroundColor: themeStyles.primary }}
                      ></div>
                      <p className="text-gray-600">{event.description}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <RSVPForm 
                  eventId={resolvedParams.eventId} 
                  themeColor={themeStyles.primary} 
                  accentColor={themeStyles.accent}
                  eventType={event.eventType}
                  themeName={event.theme}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}