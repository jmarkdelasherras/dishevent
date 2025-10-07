import React, { useMemo } from 'react';
import { EventType } from '@/types';

// Birthday theme components
import BirthdayFun from '@/components/themes/birthday/FunTheme';
import BirthdayPlayful from '@/components/themes/birthday/PlayfulTheme';
import BirthdayElegant from '@/components/themes/birthday/ElegantTheme';

// Wedding theme components
import WeddingClassic from '@/components/themes/wedding/ClassicTheme';
import WeddingElegant from '@/components/themes/wedding/ElegantTheme';
import WeddingModern from '@/components/themes/wedding/ModernTheme';

// Corporate theme components
import CorporateProfessional from '@/components/themes/corporate/ProfessionalTheme';
import CorporateMinimal from '@/components/themes/corporate/MinimalTheme';
import CorporateLuxury from '@/components/themes/corporate/LuxuryTheme';

// Component props with basic event data
interface EventPreviewProps {
  eventData: {
    eventType: EventType;
    theme: string;
    title: string;
    description: string;
    date: Date;
    time: string;
    location: string;
    coverImage?: string;
    extraFields: Record<string, unknown>;
  };
  isPremium?: boolean;
}

const EventPreview: React.FC<EventPreviewProps> = ({ 
  eventData, 
  isPremium = false 
}) => {
  const { eventType, theme } = eventData;
  
  // Format date for display
  const formattedDate = useMemo(() => {
    if (!eventData.date) return '';
    const date = new Date(eventData.date);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [eventData.date]);
  
  // Base theme props
  const baseThemeProps = {
    eventId: 'preview',
    title: eventData.title || 'Event Title',
    date: formattedDate,
    time: eventData.time || '12:00 PM',
    location: eventData.location || 'Event Location',
    description: eventData.description || 'Event Description',
    coverImage: eventData.coverImage,
    isPremium,
    
    // Default colors - would be customizable in a full implementation
    primaryColor: '#6D28D9', // purple-700
    secondaryColor: '#8B5CF6', // purple-500
    accentColor: '#A78BFA', // purple-400
  };
  
  // Birthday themes
  if (eventType === 'birthday') {
    const birthdayExtraFields = {
      celebrantName: String(eventData.extraFields.celebrantName || 'Guest of Honor'),
      age: Number(eventData.extraFields.age) || 0,
      theme: String(eventData.extraFields.theme || ''),
      giftPreferences: String(eventData.extraFields.giftPreferences || ''),
    };
    
    const birthdayProps = {
      ...baseThemeProps,
      eventType: 'birthday' as const,
      extraFields: birthdayExtraFields,
    };
    
    switch (theme) {
      case 'playful': return <BirthdayPlayful {...birthdayProps} />;
      case 'elegant': return <BirthdayElegant {...birthdayProps} />;
      default: return <BirthdayFun {...birthdayProps} />;
    }
  }
  
  // Wedding themes
  if (eventType === 'wedding') {
    const weddingExtraFields = {
      brideName: String(eventData.extraFields.brideName || 'Bride'),
      groomName: String(eventData.extraFields.groomName || 'Groom'),
      ceremonyLocation: String(eventData.extraFields.ceremonyLocation || eventData.location),
      receptionLocation: String(eventData.extraFields.receptionLocation || eventData.location),
      dressCode: String(eventData.extraFields.dressCode || 'Formal'),
    };
    
    const weddingProps = {
      ...baseThemeProps,
      eventType: 'wedding' as const,
      extraFields: weddingExtraFields,
    };
    
    switch (theme) {
      case 'elegant': return <WeddingElegant {...weddingProps} />;
      case 'modern': return <WeddingModern {...weddingProps} />;
      default: return <WeddingClassic {...weddingProps} />;
    }
  }
  
  // Corporate themes
  if (eventType === 'corporate') {
    const corporateExtraFields = {
      organizationName: String(eventData.extraFields.organizationName || 'Organization'),
      agenda: String(eventData.extraFields.agenda || 'TBA'),
      speakerList: Array.isArray(eventData.extraFields.speakerList) ? 
        eventData.extraFields.speakerList.map(s => String(s)) : [],
      sponsorList: Array.isArray(eventData.extraFields.sponsorList) ? 
        eventData.extraFields.sponsorList.map(s => String(s)) : [],
    };
    
    const corporateProps = {
      ...baseThemeProps,
      eventType: 'corporate' as const,
      extraFields: corporateExtraFields,
    };
    
    switch (theme) {
      case 'minimal': return <CorporateMinimal {...corporateProps} />;
      case 'luxury': return <CorporateLuxury {...corporateProps} />;
      default: return <CorporateProfessional {...corporateProps} />;
    }
  }
  
  // Fallback for unknown event types
  return (
    <div className="p-6 border rounded-lg text-center">
      <p>Preview not available for this event type.</p>
    </div>
  );
};

export default EventPreview;