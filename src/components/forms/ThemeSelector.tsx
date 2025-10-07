'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// Wedding themes
import WeddingClassic from '@/components/themes/wedding/ClassicTheme';
import WeddingElegant from '@/components/themes/wedding/ElegantTheme';
import WeddingModern from '@/components/themes/wedding/ModernTheme';

// Birthday themes
import BirthdayElegant from '@/components/themes/birthday/ElegantTheme';
import BirthdayFun from '@/components/themes/birthday/FunTheme';
import BirthdayPlayful from '@/components/themes/birthday/PlayfulTheme';

// Corporate themes
import CorporateLuxury from '@/components/themes/corporate/LuxuryTheme';
import CorporateMinimal from '@/components/themes/corporate/MinimalTheme';
import CorporateProfessional from '@/components/themes/corporate/ProfessionalTheme';

type EventType = 'wedding' | 'birthday' | 'corporate';

interface ThemeOption {
  name: string;
  displayName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  preview: string;
}

interface ThemePreviewProps {
  selectedTheme: string;
  eventType: EventType;
}

interface ThemeSelectorProps {
  eventType: EventType;
  value: string;
  onChange: (theme: string) => void;
}

// Theme previews for each event type
const WEDDING_THEMES: ThemeOption[] = [
  {
    name: 'Classic',
    displayName: 'Classic Elegance',
    primaryColor: '#7c3aed',
    secondaryColor: '#c4b5fd',
    accentColor: '#a78bfa',
    preview: '/assets/themes/wedding-classic.jpg'
  },
  {
    name: 'Modern',
    displayName: 'Modern Minimalist',
    primaryColor: '#0f172a',
    secondaryColor: '#94a3b8',
    accentColor: '#64748b',
    preview: '/assets/themes/wedding-modern.jpg'
  },
  {
    name: 'Elegant',
    displayName: 'Romantic Elegance',
    primaryColor: '#be185d',
    secondaryColor: '#fbcfe8',
    accentColor: '#f472b6',
    preview: '/assets/themes/wedding-elegant.jpg'
  }
];

const BIRTHDAY_THEMES: ThemeOption[] = [
  {
    name: 'Fun',
    displayName: 'Fun & Festive',
    primaryColor: '#f97316',
    secondaryColor: '#fed7aa',
    accentColor: '#fb923c',
    preview: '/assets/themes/birthday-fun.jpg'
  },
  {
    name: 'Elegant',
    displayName: 'Sophisticated Celebration',
    primaryColor: '#1e40af',
    secondaryColor: '#bfdbfe',
    accentColor: '#3b82f6',
    preview: '/assets/themes/birthday-elegant.jpg'
  },
  {
    name: 'Playful',
    displayName: 'Playful Party',
    primaryColor: '#4338ca',
    secondaryColor: '#c7d2fe',
    accentColor: '#818cf8',
    preview: '/assets/themes/birthday-playful.jpg'
  }
];

const CORPORATE_THEMES: ThemeOption[] = [
  {
    name: 'Professional',
    displayName: 'Professional Business',
    primaryColor: '#0f766e',
    secondaryColor: '#99f6e4',
    accentColor: '#2dd4bf',
    preview: '/assets/themes/corporate-professional.jpg'
  },
  {
    name: 'Minimal',
    displayName: 'Minimal & Clean',
    primaryColor: '#404040',
    secondaryColor: '#e5e5e5',
    accentColor: '#a3a3a3',
    preview: '/assets/themes/corporate-minimal.jpg'
  },
  {
    name: 'Luxury',
    displayName: 'Executive Luxury',
    primaryColor: '#9f1239',
    secondaryColor: '#fecdd3',
    accentColor: '#fb7185',
    preview: '/assets/themes/corporate-luxury.jpg'
  }
];

// Function to get themes based on event type
const getThemesForEventType = (eventType: EventType): ThemeOption[] => {
  switch (eventType) {
    case 'wedding':
      return WEDDING_THEMES;
    case 'birthday':
      return BIRTHDAY_THEMES;
    case 'corporate':
      return CORPORATE_THEMES;
    default:
      return [];
  }
};

// Placeholder image component
const PlaceholderImage = ({ themeName }: { themeName: string }) => (
  <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-md">
    <p className="text-gray-500 text-sm">{themeName} Preview</p>
  </div>
);

export const ThemePreview: React.FC<ThemePreviewProps> = ({ selectedTheme, eventType }) => {
  // You can render a simplified version of the actual theme component here
  // For simplicity, we're just showing a placeholder or an image
  
  // Find the theme option by name
  const themes = getThemesForEventType(eventType);
  const theme = themes.find(t => t.name === selectedTheme);
  
  if (!theme) {
    return <div className="h-40 bg-gray-100 rounded-md">Theme preview not available</div>;
  }

  return (
    <div className="relative w-full h-60 rounded-md overflow-hidden border border-gray-300">
      {theme.preview ? (
        <Image
          src={theme.preview}
          alt={`${theme.displayName} preview`}
          fill
          className="object-cover"
        />
      ) : (
        <PlaceholderImage themeName={theme.displayName} />
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
        {theme.displayName}
      </div>
    </div>
  );
};

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ eventType, value, onChange }) => {
  const themes = getThemesForEventType(eventType);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <div key={theme.name} className="relative">
            <input
              type="radio"
              id={`theme-${theme.name}`}
              name="theme"
              value={theme.name}
              checked={value === theme.name}
              onChange={() => onChange(theme.name)}
              className="absolute opacity-0 w-full h-full cursor-pointer"
            />
            <label
              htmlFor={`theme-${theme.name}`}
              className={`
                block border-2 rounded-md p-3 cursor-pointer transition-all
                ${value === theme.name ? `border-blue-500 bg-blue-50` : `border-gray-200 hover:border-gray-300`}
              `}
            >
              <div className="relative h-28 w-full mb-2 overflow-hidden rounded">
                {theme.preview ? (
                  <Image
                    src={theme.preview}
                    alt={theme.displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-md">
                    <span className="text-gray-500">{theme.name}</span>
                  </div>
                )}
              </div>
              <h4 className="font-medium text-sm">{theme.displayName}</h4>
              <div className="flex items-center mt-2 space-x-2">
                <span 
                  className="inline-block w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.primaryColor }}
                ></span>
                <span 
                  className="inline-block w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.secondaryColor }}
                ></span>
                <span 
                  className="inline-block w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.accentColor }}
                ></span>
              </div>
            </label>
          </div>
        ))}
      </div>

      {value && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Theme Preview</h3>
          <ThemePreview selectedTheme={value} eventType={eventType} />
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;