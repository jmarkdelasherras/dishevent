import React, { useEffect } from 'react';
import BaseTheme from '../BaseTheme';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ConfigurableWeddingTemplate.module.css';

export interface ConfigurableWeddingTemplateProps {
  eventId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  
  // Couple Information
  brideName: string;
  groomName: string;
  ceremonyLocation: string;
  receptionLocation: string;
  dressCode: string;
  
  // Design Configuration
  colorPalette: {
    primary: string;   // Main color
    secondary: string; // Secondary/complementary color
    accent: string;    // Accent/highlight color
    text: string;      // Text color
    background: string; // Background color or light shade
  };
  
  // Image Configuration
  images: {
    hero?: {
      url: string;
      position: 'top' | 'center' | 'bottom' | 'custom';
      customPosition?: { x: number; y: number };
    };
    couple?: {
      url: string;
      position: 'left' | 'right' | 'center';
    };
    additionalImages?: Array<{
      url: string;
      caption?: string;
    }>;
  };
  
  // Layout Configuration
  layout: {
    style: 'classic' | 'modern' | 'elegant' | 'minimalist';
    imageCount: number;  // 1, 2, 3 etc.
    headerStyle: 'centered' | 'banner' | 'overlay';
    detailsLayout: 'stacked' | 'sideBySide' | 'timeline';
  };
  
  // Typography
  typography: {
    titleFont: string;
    bodyFont: string;
    titleSize: string;
    bodySize: string;
  };
  
  // Additional Settings
  isPremium?: boolean;
  hasAnimation?: boolean;
  rsvpEnabled?: boolean;
}

// Default configuration values
const defaultConfig: Partial<ConfigurableWeddingTemplateProps> = {
  colorPalette: {
    primary: '#97714A',    // Elegant gold/brown
    secondary: '#B29161',  // Lighter gold
    accent: '#D5B88F',     // Warm beige
    text: '#333333',       // Dark text
    background: '#FFFFFF', // White background
  },
  layout: {
    style: 'elegant',
    imageCount: 1,
    headerStyle: 'centered',
    detailsLayout: 'stacked',
  },
  typography: {
    titleFont: 'Playfair Display, serif',
    bodyFont: 'Raleway, sans-serif',
    titleSize: '2.5rem',
    bodySize: '1rem',
  }
};

const ConfigurableWeddingTemplate: React.FC<ConfigurableWeddingTemplateProps> = ({
  eventId,
  title,
  date,
  time,
  location,
  description,
  brideName,
  groomName,
  ceremonyLocation,
  receptionLocation,
  dressCode,
  colorPalette = defaultConfig.colorPalette!,
  images,
  layout = defaultConfig.layout!,
  typography = defaultConfig.typography!,
  isPremium = false,
  hasAnimation = false,
  rsvpEnabled = true,
}) => {
  // Helper function for getting style based on layout
  const getLayoutClass = () => {
    switch (layout.style) {
      case 'modern':
        return 'wedding-modern';
      case 'minimalist':
        return 'wedding-minimalist';
      case 'elegant':
      default:
        return 'wedding-elegant';
    }
  };

  // Apply custom styles dynamically by setting CSS variables on the root element
  React.useEffect(() => {
    const root = document.documentElement;
    
    root.style.setProperty('--primary-color', colorPalette.primary);
    root.style.setProperty('--secondary-color', colorPalette.secondary);
    root.style.setProperty('--accent-color', colorPalette.accent);
    root.style.setProperty('--text-color', colorPalette.text);
    root.style.setProperty('--background-color', colorPalette.background);
    root.style.setProperty('--title-font', typography.titleFont);
    root.style.setProperty('--body-font', typography.bodyFont);
    root.style.setProperty('--title-size', typography.titleSize);
    root.style.setProperty('--body-size', typography.bodySize);
    
    // Clean up
    return () => {
      root.style.removeProperty('--primary-color');
      root.style.removeProperty('--secondary-color');
      root.style.removeProperty('--accent-color');
      root.style.removeProperty('--text-color');
      root.style.removeProperty('--background-color');
      root.style.removeProperty('--title-font');
      root.style.removeProperty('--body-font');
      root.style.removeProperty('--title-size');
      root.style.removeProperty('--body-size');
    };
  }, [colorPalette, typography]);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <BaseTheme
      primaryColor={colorPalette.primary}
      secondaryColor={colorPalette.secondary}
      accentColor={colorPalette.accent}
      className={`${styles.configurableWeddingTemplate} ${getLayoutClass()}`}
    >
      <div 
        className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative"
      >
        {/* Decorative elements */}
        {layout.style === 'elegant' && (
          <>
            <div className="absolute top-0 left-0 w-40 h-40 opacity-20">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill={colorPalette.primary}>
                <path d="M37.3,-59.1C48.8,-53.1,58.8,-43,65.1,-30.9C71.4,-18.8,73.9,-4.7,70.7,7.8C67.5,20.3,58.6,31.1,48.8,39.3C38.9,47.5,28,53.1,16.3,57.5C4.5,61.9,-8.2,65.2,-20.3,63.1C-32.5,61.1,-44.2,53.8,-51.9,43.4C-59.7,33,-63.6,19.5,-65.1,5.8C-66.6,-8,-65.8,-22.1,-59.5,-33C-53.2,-44,-41.4,-51.9,-29.5,-57.7C-17.6,-63.4,-5.6,-67.1,6.5,-67C18.5,-66.9,25.8,-65.2,37.3,-59.1Z" transform="translate(100 100)" />
              </svg>
            </div>
            <div className="absolute bottom-0 right-0 w-60 h-60 opacity-20 rotate-45">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill={colorPalette.secondary}>
                <path d="M37.3,-59.1C48.8,-53.1,58.8,-43,65.1,-30.9C71.4,-18.8,73.9,-4.7,70.7,7.8C67.5,20.3,58.6,31.1,48.8,39.3C38.9,47.5,28,53.1,16.3,57.5C4.5,61.9,-8.2,65.2,-20.3,63.1C-32.5,61.1,-44.2,53.8,-51.9,43.4C-59.7,33,-63.6,19.5,-65.1,5.8C-66.6,-8,-65.8,-22.1,-59.5,-33C-53.2,-44,-41.4,-51.9,-29.5,-57.7C-17.6,-63.4,-5.6,-67.1,6.5,-67C18.5,-66.9,25.8,-65.2,37.3,-59.1Z" transform="translate(100 100)" />
              </svg>
            </div>
          </>
        )}
        
        {/* Watermark for free version */}
        {!isPremium && (
          <div className="absolute top-4 right-4 px-2 py-1 bg-gray-800 text-white text-xs uppercase tracking-wider rounded opacity-50">
            Free Version
          </div>
        )}

        {/* Hero section */}
        <div className={`w-full max-w-4xl mx-auto ${layout.headerStyle === 'overlay' ? 'relative' : ''}`}>
          {/* Hero Image */}
          {images?.hero && (
            <div className="w-full h-80 sm:h-96 md:h-[28rem] relative rounded-lg overflow-hidden mb-8">
              <Image 
                src={images.hero.url} 
                fill
                style={{ objectFit: 'cover', objectPosition: images.hero.position }}
                alt="Wedding"
                className={hasAnimation ? 'animate-fade-in' : ''}
              />
              
              {/* Overlay header style places text on the image */}
              {layout.headerStyle === 'overlay' && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-white p-6">
                  <h1 className={`text-4xl md:text-5xl font-bold mb-2 ${styles.title}`}>
                    {brideName} & {groomName}
                  </h1>
                  <p className={`text-xl md:text-2xl ${styles.subtitle}`}>
                    {formatDate(date)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Header content (when not overlay) */}
          {layout.headerStyle !== 'overlay' && (
            <div className={`text-center mb-12 ${hasAnimation ? 'animate-fade-in' : ''}`}>
              <h1 className={`text-4xl md:text-5xl font-bold mb-2 ${styles.title}`}>
                {brideName} & {groomName}
              </h1>
              <p className={`text-xl md:text-2xl ${styles.subtitle}`}>
                {formatDate(date)}
              </p>
            </div>
          )}
        </div>

        {/* Main content */}
        <div 
          className={`w-full max-w-4xl mx-auto ${
            layout.detailsLayout === 'sideBySide' ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'space-y-12'
          }`}
        >
          {/* Event Details Section */}
          <div className={`bg-white bg-opacity-90 p-8 rounded-lg shadow-md ${hasAnimation ? 'animate-fade-in-up delay-300' : ''}`}>
            <h2 className={`text-2xl font-bold mb-6 text-center ${styles.sectionTitle}`}>
              You Are Invited
            </h2>
            
            <div className="mb-6">
              <p className="text-center mb-4">{description}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <span className={`text-sm uppercase tracking-wider ${styles.sectionLabel}`}>Ceremony</span>
                <p className="font-bold">{ceremonyLocation}</p>
                <p>{time}</p>
              </div>
              
              {receptionLocation && (
                <div className="flex flex-col items-center">
                  <span className={`text-sm uppercase tracking-wider ${styles.sectionLabel}`}>Reception</span>
                  <p className="font-bold">{receptionLocation}</p>
                </div>
              )}
              
              {dressCode && (
                <div className="flex flex-col items-center">
                  <span className={`text-sm uppercase tracking-wider ${styles.sectionLabel}`}>Dress Code</span>
                  <p>{dressCode}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Secondary Image(s) Section */}
          {images?.couple && layout.imageCount > 1 && (
            <div className={`${hasAnimation ? 'animate-fade-in-up delay-500' : ''}`}>
              <div className="w-full h-64 md:h-80 relative rounded-lg overflow-hidden">
                <Image 
                  src={images.couple.url}
                  fill
                  style={{ objectFit: 'cover' }}
                  alt="Couple"
                />
              </div>
            </div>
          )}
          
          {/* Additional Images Grid */}
          {images?.additionalImages && layout.imageCount > 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {images.additionalImages.slice(0, layout.imageCount - 2).map((img, index) => (
                <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                  <Image 
                    src={img.url} 
                    fill
                    style={{ objectFit: 'cover' }}
                    alt={img.caption || `Additional image ${index + 1}`}
                  />
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RSVP Section */}
        {rsvpEnabled && (
          <div className={`mt-12 text-center ${hasAnimation ? 'animate-fade-in-up delay-700' : ''}`}>
            <Link href={`/invite/${eventId}/rsvp`}>
              <button className={`px-8 py-3 rounded-full text-white font-medium transition-all hover:shadow-lg ${styles.primaryButton}`}>
                RSVP Now
              </button>
            </Link>
          </div>
        )}
      </div>
    </BaseTheme>
  );
};

export default ConfigurableWeddingTemplate;