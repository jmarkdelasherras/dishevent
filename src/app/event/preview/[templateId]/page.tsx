'use client';

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ThemeColors } from "@/components/template/wedding/Traditional/TraditionalElegance/ThemeSetter";
import dynamic from "next/dynamic";
import PreviewToolbar from "@/components/ui/PreviewToolbar";
import Link from "next/link";

// Define available templates
const AVAILABLE_TEMPLATES = {
  'traditional-elegance': dynamic(() => import("@/components/template/wedding/Traditional/TraditionalElegance")),
  // Add other templates here as they become available
  // 'classic-elegance': dynamic(() => import("@/components/template/wedding/Classic/ClassicElegance")),
  // ...
};

export default function TemplatePreview() {
  const params = useParams();
  const templateId = params.templateId as string;
  const [isLoading, setIsLoading] = React.useState(true);
  const [templateExists, setTemplateExists] = React.useState(false);
  
  // Check if the template exists
  React.useEffect(() => {
    // Set loading state and check if template exists
    setIsLoading(true);
    
    // Check if the template exists in our available templates
    if (AVAILABLE_TEMPLATES[templateId as keyof typeof AVAILABLE_TEMPLATES]) {
      setTemplateExists(true);
    } else {
      setTemplateExists(false);
    }
    
    setIsLoading(false);
  }, [templateId]);

  // Default theme for preview
  const defaultTheme: ThemeColors = {
    'primary-color': '#5A86AD',
    'primary-color-light': '#7EA0C1',
    'primary-color-lighter': '#C6D4E1',
    'primary-color-dark': '#3A5B7A',
    'primary-color-rgb': '90, 134, 173',
    
    'secondary-color': '#C08081',
    'secondary-color-light': '#D6ACAD',
    'secondary-color-lighter': '#EBD4D4',
    'secondary-color-dark': '#9A6566',
    'secondary-color-rgb': '192, 128, 129',
    
    'accent-color': '#F5F2ED',
    'accent-color-light': '#FFFFFF',
    'accent-color-dark': '#E5E0D8',
    'accent-color-rgb': '245, 242, 237',
  };

  // Define sample wedding props
  const sampleWeddingProps = {
    // Basic wedding information
    brideFullName: "Jane Smith",
    groomFullName: "John Doe",
    brideNameDisplay: "Jane",
    groomNameDisplay: "John",
    date: "April 25, 2026",
    venue: "The Grand Palace",
    timeStart: "7:00 AM",
    timeEnd: "3:00 PM",
    mainImage1: "/wedding/couple-right.jpg",
    mainImage2: "/wedding/couple-left.jpg",
    galleryImage: [
      "/wedding/couple-left.jpg",
      "/wedding/couple-right.jpg",
      "/wedding/background.jpg"
    ],
    rsvp: {
      isEnabled: false,
      deadline: "January 30, 2026",
    },
    
    // Theme configuration
    theme: defaultTheme,
    
    // Venue details and directions
    venueName: "The Grand Palace",
    venueAddress: "123 Wedding Boulevard",
    venueCity: "Springfield",
    venueMapCoordinates: "37.7749,-122.4194", // Example coordinates
    parkingInfo: "Complimentary valet parking is available for all guests.",
    
    // Couple Story and Welcome Message
    messages: {
      messageWelcome: "We are excited to celebrate our special day with you.",
      messageTagline: "Our journey continues with you by our side.",
      messageStory: "We can't wait to celebrate with our favorite people in the world!",
      image1: "/wedding/couple-left.jpg",
      image2: "/wedding/couple-right.jpg",
    },
    
    // Gallery items
    galleryItems: [
      {
        title: "Our Journey",
        date: "Our Love Story",
        text: "From our first date to our wedding day."
      }
    ],
    
    // Wedding Motif and Dress Code
    weddingMotif: {
      primaryColor: "#5A86AD", // Blue
      secondaryColor: "#C08081", // Rose
      accentColor: "#F5F2ED", // Cream
      theme: "Traditional Elegance",
      description: "Our wedding celebrates the timeless beauty of romance."
    },
    dressCode: {
      men: "Semi-formal attire",
      women: "Cocktail or semi-formal dresses",
      generalGuidelines: "Please dress for the occasion.",
      additionalNotes: ""
    },
    
    // Wedding Entourage
    entourage: {
      // Default values for entourage
      officiant: {
        name: "",
        title: "",
        organization: "",
        description: ""
      },
      parents: { bride: [], groom: [] },
      principalSponsors: { men: [], women: [] },
      bestMan: { name: "", relation: "" },
      maidOfHonor: { name: "", relation: "" },
      bridalParty: [],
      groomsmen: [],
      secondarySponsors: {
        candle: [],
        veil: [],
        cord: []
      },
      bearers: {},
      flowerGirls: []
    }
  };
  
  // If loading, show loading message
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700">Loading template preview...</h2>
        </div>
      </div>
    );
  }
  
  // If template doesn't exist, show placeholder message
  if (!templateExists) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-6">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-8 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Template Preview Not Available</h1>
          <p className="text-lg text-gray-600 mb-6">
            The template &quot;{templateId}&quot; is currently under development or does not exist.
          </p>
          <p className="text-md text-gray-500 mb-8">
            We&apos;re working on creating amazing wedding templates. Please check back later or try another template.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/events/create/wedding" 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-white font-medium"
            >
              Browse Other Templates
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // If template exists, render it with the preview toolbar
  const TemplateComponent = AVAILABLE_TEMPLATES[templateId as keyof typeof AVAILABLE_TEMPLATES];
  return (
    <>
      <PreviewToolbar />
      <TemplateComponent {...sampleWeddingProps} />
    </>
  );
}
