import React from 'react';
import ThemePreview from './ThemePreview';
import { EventType } from '@/types';

interface ThemeOption {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  isPremium?: boolean;
}

interface ThemeMapping {
  [eventType: string]: {
    [themeId: string]: ThemeOption;
  };
}

interface ThemeSelectorProps {
  eventType: EventType;
  selectedTheme: string;
  onChange: (theme: string) => void;
}

// Define available themes for each event type
const availableThemes: ThemeMapping = {
  wedding: {
    classic: {
      id: 'classic',
      name: 'Classic',
      description: 'Timeless elegance with traditional elements',
    },
    elegant: {
      id: 'elegant',
      name: 'Elegant',
      description: 'Sophisticated and refined design',
    },
    modern: {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary and sleek look',
      isPremium: true,
    },
  },
  birthday: {
    fun: {
      id: 'fun',
      name: 'Fun',
      description: 'Colorful and playful design',
    },
    playful: {
      id: 'playful',
      name: 'Playful',
      description: 'Bright and energetic theme',
    },
    elegant: {
      id: 'elegant',
      name: 'Elegant',
      description: 'Sophisticated and stylish celebration',
      isPremium: true,
    },
  },
  corporate: {
    professional: {
      id: 'professional',
      name: 'Professional',
      description: 'Clean and business-oriented design',
    },
    minimal: {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and modern aesthetic',
    },
    luxury: {
      id: 'luxury',
      name: 'Luxury',
      description: 'Premium and exclusive appearance',
      isPremium: true,
    },
  },
};

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  eventType,
  selectedTheme,
  onChange
}) => {
  // Get themes for the current event type
  const themes = availableThemes[eventType] || {};
  const themesList = Object.values(themes);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Choose a Theme</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {themesList.map((theme) => (
          <ThemePreview
            key={theme.id}
            eventType={eventType}
            theme={theme.id}
            name={theme.name}
            description={theme.description}
            thumbnail={theme.thumbnail}
            selected={selectedTheme === theme.id}
            onClick={() => onChange(theme.id)}
            isPremium={theme.isPremium}
          />
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;