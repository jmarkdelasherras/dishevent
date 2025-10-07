import { EventType } from '@/types';
import { ReactNode } from 'react';

export interface ThemeProps {
  children: ReactNode;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundImage?: string;
  className?: string;
}

export interface EventThemeProps {
  eventId: string;
  eventType: EventType;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  coverImage?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  extraFields: Record<string, unknown>;
  isPremium?: boolean;
}

const BaseTheme = ({
  children,
  primaryColor,
  secondaryColor,
  accentColor,
  backgroundImage,
  className,
}: ThemeProps) => {
  const style = {
    '--primary-color': primaryColor,
    '--secondary-color': secondaryColor,
    '--accent-color': accentColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
  } as React.CSSProperties;

  return (
    <div
      className={`theme-container min-h-screen bg-no-repeat bg-cover ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default BaseTheme;