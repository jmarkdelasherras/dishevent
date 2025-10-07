'use client';

import { useState } from 'react';
import ConfigurableWeddingTemplate from '@/components/themes/wedding/ConfigurableWeddingTemplate';

type TemplateConfig = {
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  layout: {
    style: 'classic' | 'modern' | 'elegant' | 'minimalist';
    imageCount: number;
    headerStyle: 'centered' | 'banner' | 'overlay';
    detailsLayout: 'stacked' | 'sideBySide' | 'timeline';
  };
  typography: {
    titleFont: string;
    bodyFont: string;
    titleSize: string;
    bodySize: string;
  };
};

export default function WeddingInvitationDemo() {
  const [config, setConfig] = useState<TemplateConfig>({
    colorPalette: {
      primary: '#97714A',    // Elegant gold/brown
      secondary: '#B29161',  // Lighter gold
      accent: '#D5B88F',     // Warm beige
      text: '#333333',       // Dark text
      background: '#FFFFFF', // White background
    },
    layout: {
      style: 'elegant',
      imageCount: 2,
      headerStyle: 'overlay',
      detailsLayout: 'stacked',
    },
    typography: {
      titleFont: 'Playfair Display, serif',
      bodyFont: 'Raleway, sans-serif',
      titleSize: '2.5rem',
      bodySize: '1rem',
    },
  });

  const sampleEventData = {
    eventId: 'demo-event-123',
    title: 'Jane & John Wedding',
    date: '2025-12-31',
    time: '4:00 PM',
    location: 'Crystal Gardens',
    description: 'We are delighted to invite you to celebrate our wedding. Join us for an evening of love, laughter, and memories that will last a lifetime.',
    brideName: 'Jane Doe',
    groomName: 'John Smith',
    ceremonyLocation: 'Crystal Gardens, Main Hall',
    receptionLocation: 'Crystal Gardens, Grand Ballroom',
    dressCode: 'Formal Attire',
    images: {
      hero: {
        url: '/assets/themes/wedding-elegant.jpg', 
        position: 'center' as const,
      },
      couple: {
        url: '/assets/themes/wedding-classic.jpg',
        position: 'center' as const,
      },
      additionalImages: [
        { url: '/assets/themes/wedding-modern.jpg', caption: 'Our Engagement' },
      ]
    },
    isPremium: false,
    hasAnimation: true,
    rsvpEnabled: true,
  };

  return (
    <div className="min-h-screen">
      <ConfigurableWeddingTemplate
        {...sampleEventData}
        colorPalette={config.colorPalette}
        layout={config.layout}
        typography={config.typography}
      />
      
      <div className="fixed bottom-0 right-0 mb-4 mr-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          onClick={() => {
            // Toggle between different configurations as a demo
            setConfig(prev => {
              const newConfig: TemplateConfig = {
                ...prev,
                colorPalette: {
                  ...prev.colorPalette,
                  primary: prev.colorPalette.primary === '#97714A' ? '#8B5CF6' : '#97714A',
                  secondary: prev.colorPalette.primary === '#97714A' ? '#A78BFA' : '#B29161',
                },
                layout: {
                  ...prev.layout,
                  headerStyle: prev.layout.headerStyle === 'overlay' ? 'centered' : 'overlay',
                }
              };
              return newConfig;
            });
          }}
        >
          Change Style
        </button>
      </div>
    </div>
  );
}