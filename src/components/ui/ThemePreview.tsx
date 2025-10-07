import React from 'react';
import Image from 'next/image';
import { EventType } from '@/types';

interface ThemePreviewProps {
  eventType: EventType;
  theme: string;
  name: string;
  description?: string;
  thumbnail?: string;
  selected?: boolean;
  onClick?: () => void;
  isPremium?: boolean;
}

type ThemeOptions = {
  [key: string]: string;
};

type ThemeMap = {
  wedding: ThemeOptions;
  birthday: ThemeOptions;
  corporate: ThemeOptions;
  [key: string]: ThemeOptions;
};

const defaultThumbnails: ThemeMap = {
  wedding: {
    classic: '/assets/themes/wedding-classic.jpg',
    elegant: '/assets/themes/wedding-elegant.jpg',
    modern: '/assets/themes/wedding-modern.jpg',
  },
  birthday: {
    fun: '/assets/themes/birthday-fun.jpg',
    playful: '/assets/themes/birthday-playful.jpg',
    elegant: '/assets/themes/birthday-elegant.jpg',
  },
  corporate: {
    professional: '/assets/themes/corporate-professional.jpg',
    minimal: '/assets/themes/corporate-minimal.jpg',
    luxury: '/assets/themes/corporate-luxury.jpg',
  }
};

const ThemePreview: React.FC<ThemePreviewProps> = ({
  eventType,
  theme,
  name,
  description,
  thumbnail,
  selected = false,
  onClick,
  isPremium = false
}) => {
  // Fallback to default thumbnails if none provided
  const thumbnailSrc = thumbnail || 
    (defaultThumbnails[eventType]?.[theme]) || 
    '/assets/themes/default.jpg';
  
  return (
    <div 
      className={`
        relative rounded-lg overflow-hidden transition-all duration-200
        ${selected ? 'ring-4 ring-purple-500 shadow-lg scale-[1.02]' : 'hover:shadow-md'}
        cursor-pointer transform hover:scale-[1.01]
      `}
      onClick={onClick}
    >
      <div className="aspect-video relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        {isPremium && (
          <div className="absolute top-2 right-2 z-20 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Premium
          </div>
        )}
        <div className="w-full h-full bg-gray-200">
          {thumbnailSrc && (
            <Image 
              src={thumbnailSrc} 
              alt={`${name} theme preview`} 
              fill
              className="object-cover"
            />
          )}
        </div>
      </div>
      
      <div className="p-3 bg-white">
        <h3 className="font-medium text-gray-900">{name}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      
      {selected && (
        <div className="absolute top-3 left-3 z-20 bg-purple-500 text-white p-1 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ThemePreview;