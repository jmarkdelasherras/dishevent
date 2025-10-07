import Link from 'next/link';
import { EventType } from '@/types';

interface RSVPButtonProps {
  eventId: string;
  eventType: EventType;
  themeName: string;
  primaryColor: string;
  accentColor: string;
  size?: 'small' | 'medium' | 'large';
}

const RSVPButton = ({
  eventId,
  eventType,
  themeName,
  primaryColor,
  accentColor,
  size = 'medium'
}: RSVPButtonProps) => {
  // Get button styling based on event type and theme
  const getBgColor = () => {
    switch (eventType) {
      case 'wedding':
        return themeName === 'elegant' ? accentColor : primaryColor;
      case 'birthday':
        return accentColor;
      case 'corporate':
        return themeName === 'luxury' ? accentColor : primaryColor;
      default:
        return primaryColor;
    }
  };

  // Size-based styles
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-4 py-2 text-sm';
      case 'large':
        return 'px-10 py-4 text-lg';
      default:
        return 'px-8 py-3';
    }
  };
  
  // Get font based on theme
  const getFont = () => {
    if (eventType === 'wedding' && (themeName === 'elegant' || themeName === 'classic')) {
      return 'font-serif';
    }
    return 'font-medium';
  };
  
  // Get hover effect based on event type
  const getHoverEffect = () => {
    switch (eventType) {
      case 'wedding':
        return themeName === 'modern' ? 'hover:opacity-80' : 'hover:brightness-110';
      case 'birthday':
        return 'hover:brightness-110';
      case 'corporate':
        return 'hover:opacity-90';
      default:
        return 'hover:brightness-110';
    }
  };
  
  // Get animation based on event type
  const getAnimation = () => {
    if (eventType === 'birthday' && themeName === 'fun') {
      return 'animate-pulse';
    }
    return '';
  };
  
  return (
    <Link
      href={`/invite/${eventId}/rsvp`}
      className={`
        inline-block ${getSizeClasses()} rounded-full text-white 
        ${getFont()} ${getHoverEffect()} ${getAnimation()}
        transition-all shadow-md
      `}
      style={{ 
        backgroundColor: getBgColor(),
        boxShadow: eventType === 'corporate' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.15)'
      }}
    >
      {eventType === 'wedding' ? 'RSVP Now' : 
       eventType === 'birthday' ? 'Respond' : 'Register Now'}
    </Link>
  );
};

export default RSVPButton;