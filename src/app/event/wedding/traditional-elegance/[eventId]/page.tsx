'use client';

import React from "react";
import Wedding from "@/components/template/wedding/Traditional/TraditionalElegance/Wedding";
import { useParams, useRouter } from "next/navigation";
import { useRealtimeEvent, useRealtimeEventDetails } from "@/hooks/firebase/useRealtimeEvent";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/ui/loader";

// Define interfaces for wedding data types
interface WeddingDetails {
  brideFullName?: string;
  groomFullName?: string;
  brideNameDisplay?: string;
  groomNameDisplay?: string;
  date?: string;
  venue?: string;
  timeStart?: string;
  timeEnd?: string;
  mainImage1?: string;
  mainImage2?: string;
  galleryImage?: string[];
  rsvp?: {
    isEnabled: boolean;
    deadline?: string;
  };
  theme?: Record<string, string>;
  venueName?: string;
  venueAddress?: string;
  venueCity?: string;
  venueMapCoordinates?: string;
  parkingInfo?: string;
  messages?: {
    messageWelcome?: string;
    messageTagline?: string;
    messageStory?: string;
    image1?: string;
    image2?: string;
  };
  galleryItems?: Array<{
    title: string;
    date: string;
    text: string;
  }>;
  weddingMotif?: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    theme: string;
    description: string;
  };
  dressCode?: {
    men: string;
    women: string;
    generalGuidelines: string;
    additionalNotes?: string;
  };
  entourage?: {
    officiant?: {
      name: string;
      title: string;
      organization: string;
      description: string;
    };
    parents?: {
      bride: Array<{ name: string; relation: string }>;
      groom: Array<{ name: string; relation: string }>;
    };
    principalSponsors?: {
      men: Array<{ name: string; relation: string }>;
      women: Array<{ name: string; relation: string }>;
    };
    bestMan?: {
      name: string;
      relation: string;
    };
    maidOfHonor?: {
      name: string;
      relation: string;
    };
    bridalParty?: Array<{
      name: string;
      role: string;
      relation: string;
    }>;
    groomsmen?: Array<{
      name: string;
      role: string;
      relation: string;
    }>;
    secondarySponsors?: {
      candle: Array<{ name: string; relation: string }>;
      veil: Array<{ name: string; relation: string }>;
      cord: Array<{ name: string; relation: string }>;
    };
    bearers?: {
      bible?: { name: string; age: number; relation: string };
      ring?: { name: string; age: number; relation: string };
      coin?: { name: string; age: number; relation: string };
    };
    flowerGirls?: Array<{
      name: string;
      age: number;
      relation: string;
    }>;
  };
}

export default function WeddingPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = Array.isArray(params.eventId) ? params.eventId[0] : params.eventId || null;
  const { event, loading, error } = useRealtimeEvent(eventId);
  const { eventDetailsData, loading: detailsLoading, error: detailsError } = useRealtimeEventDetails(eventId);
  const { user, isLoading: authLoading } = useAuth();
  
  // Password protection state
  const [isPasswordProtected, setIsPasswordProtected] = React.useState<boolean>(false);
  const [isPasswordVerified, setIsPasswordVerified] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>('');
  const [passwordError, setPasswordError] = React.useState<string>('');

  // Security check: Redirect if not the event owner
  React.useEffect(() => {
    if (!authLoading && !loading && event && detailsLoading && !detailsError) {
      // If user is not logged in or not the event owner, redirect to login
      if (!user || (event.ownerId !== user.uid)) {
        console.log("Unauthorized access attempt - redirecting to login");
        router.push('/login');
      }
    }
  }, [user, event, loading, authLoading, router, detailsLoading, detailsError]);
  
  // Check if the event is password protected
  React.useEffect(() => {
    if (!loading && !detailsLoading && eventId) {
      // Check for passwordProtected in multiple locations
      let isProtected = false;
      
      // First check event
      if (event && event.extraFields) {
        isProtected = event.extraFields.passwordProtected === true;
      }
      
      // If not found in event, check eventDetailsData
      if (!isProtected && eventDetailsData) {
        if (eventDetailsData.extraFields) {
          isProtected = eventDetailsData.extraFields.passwordProtected === true;
        }
      }
      
      // console.log("Is this event password protected?", isProtected);
      setIsPasswordProtected(isProtected);
      
      // If event owner is viewing or if the event isn't password protected, auto-verify
      if ((user && event && event.ownerId === user.uid) || !isProtected) {
        setIsPasswordVerified(true);
        return;
      }
      
      // Check if the password has been verified in this session
      const sessionKey = `wedding_event_${eventId}_password_verified`;
      const isVerifiedInSession = sessionStorage.getItem(sessionKey) === 'true';
      if (isVerifiedInSession) {
        setIsPasswordVerified(true);
      }
    }
  }, [event, eventDetailsData, loading, detailsLoading, user, eventId]);

  // Handle loading state
  if (loading || authLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="relative flex flex-col items-center p-8">
          <Loader />
          <div className="mt-6 text-center">
            <h3 className="text-xl font-medium text-gray-800 mb-2">Loading Your Wedding Event</h3>
            <p className="text-gray-500">Please wait while we prepare your special day details...</p>
          </div>
          <div className="mt-10 flex space-x-2 justify-center items-center">
            <span className="loading-dot w-3 h-3 bg-blue-400 rounded-full animate-pulse"></span>
            <span className="loading-dot w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="loading-dot w-3 h-3 bg-blue-600 rounded-full animate-pulse"></span>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4 border border-red-100">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4 mx-auto">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center text-red-600 mb-2">Error Loading Event</h2>
          <p className="text-gray-600 text-center mb-6 px-4">{error.message || "There was a problem retrieving your event details. Please try again later."}</p>
          <div className="flex justify-center">
            <button 
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              onClick={() => router.push('/dashboard/events')}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle not found state
  if (!event || event.visibility === 'private') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 p-6">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you are looking for might have been removed or is not available.</p>
        </div>
      </div>
    );
  }
  
  // Handle password protected event
  if (isPasswordProtected && !isPasswordVerified) {
    const handlePasswordSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Try to find the password in different possible locations
      let correctPassword: string | undefined;
      
      // First check event.extraFields
      if (event && event.extraFields) {
        correctPassword = event.extraFields.password as string;
      }
      
      // If not found, check eventDetailsData
      if (!correctPassword && eventDetailsData) {
        if (eventDetailsData.extraFields) {
          correctPassword = eventDetailsData.extraFields.password as string;
        } else {
          // Convert to unknown first, then to Record
          const detailsAsRecord = (eventDetailsData as unknown) as Record<string, unknown>;
          if (detailsAsRecord.password && typeof detailsAsRecord.password === 'string') {
            correctPassword = detailsAsRecord.password;
          }
        }
      }
      
      // console.log("Entered password:", password);
      // console.log("Correct password should be:", correctPassword);
      
      if (password === correctPassword) {
        setIsPasswordVerified(true);
        setPasswordError('');
        
        // Store verification in session storage to persist through refreshes
        if (eventId) {
          const sessionKey = `wedding_event_${eventId}_password_verified`;
          sessionStorage.setItem(sessionKey, 'true');
        }
      } else {
        setPasswordError('Incorrect password. Please try again.');
      }
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center border border-gray-100 password-form-container">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {event.name || "Protected Event"}
          </h2>
          <p className="text-gray-600 mb-6">
            This event is password protected. Please enter the password to view the details.
          </p>
          
          <form onSubmit={handlePasswordSubmit} className="mt-4">
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent password-input"
                required
                autoFocus
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-2">{passwordError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 password-submit-button"
            >
              Access Event
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Define template props based on fetched event data
  // Extract wedding specific data from the appropriate source
  // console.log("Event data:", event);
  // console.log("Event details data:", eventDetailsData);
  
  // Log specific structure details to help debugging
  if (event && event.extraFields) {
    // console.log("Event extraFields:", event.extraFields);
    if (event.extraFields.weddingDetails) {
      // console.log("Event extraFields.weddingDetails:", event.extraFields.weddingDetails);
    }
  }
  
  if (eventDetailsData) {
    // console.log("EventDetails keys:", Object.keys(eventDetailsData));
    if (eventDetailsData.extraFields) {
      // console.log("EventDetails extraFields:", eventDetailsData.extraFields);
    }
  }
  
  // Try to extract wedding details from multiple possible locations
  let weddingDetails: WeddingDetails = {} as WeddingDetails;
  
  // Check if wedding details exist in eventDetailsData
  if (eventDetailsData && typeof eventDetailsData === 'object') {
    if (eventDetailsData.extraFields && typeof eventDetailsData.extraFields === 'object') {
      if (eventDetailsData.extraFields.weddingDetails) {
        weddingDetails = eventDetailsData.extraFields.weddingDetails as WeddingDetails;
      } else {
        // If weddingDetails isn't nested, the extraFields itself might contain wedding details
        weddingDetails = eventDetailsData.extraFields as WeddingDetails;
      }
    } else {
      // eventDetailsData itself might be the wedding details
      weddingDetails = eventDetailsData as unknown as WeddingDetails;
    }
  }
  
  // If nothing found in eventDetailsData, try to get from event.extraFields
  if (Object.keys(weddingDetails).length === 0 && event && event.extraFields) {
    if (event.extraFields.weddingDetails) {
      weddingDetails = event.extraFields.weddingDetails as WeddingDetails;
    } else {
      // The extraFields itself might contain wedding details
      weddingDetails = event.extraFields as WeddingDetails;
    }
  }
  
  // console.log("Wedding details extracted:", weddingDetails);
  // If weddingDetails is empty, attempt to extract information directly from event
  if (Object.keys(weddingDetails).length === 0 && event) {
    // console.log("Using event data directly for wedding details");
    // Try to get as much information as possible from the event object itself
    weddingDetails = {
      date: event.date,
      // Extract names from event name if possible
      brideFullName: event.name ? event.name.split('&')[0]?.trim() : undefined,
      groomFullName: event.name ? event.name.split('&')[1]?.trim() : undefined,
    };
  }

  // console.log("Wedding details", weddingDetails);
  
  // Combine with default values for any missing properties
  const templateProps = {
    weddingProps: {
      // Basic wedding information (use event data with fallbacks)
      brideFullName: weddingDetails.brideFullName || "Bride Name",
      groomFullName: weddingDetails.groomFullName || "Groom Name",
      brideNameDisplay: weddingDetails.brideNameDisplay || weddingDetails.brideFullName?.split(" ")[0] || "Bride",
      groomNameDisplay: weddingDetails.groomNameDisplay || weddingDetails.groomFullName?.split(" ")[0] || "Groom",
      date: weddingDetails.date || event.date || "Wedding Date",
      venue: weddingDetails.venue || event.extraFields?.location as string || "Wedding Venue",
      timeStart: weddingDetails.timeStart || "TBD",
      timeEnd: weddingDetails.timeEnd || "TBD",
      mainImage1: weddingDetails.mainImage1 || "/wedding/couple-right.jpg",
      mainImage2: weddingDetails.mainImage2 || "/wedding/couple-left.jpg",
      galleryImage: weddingDetails.galleryImage || [
        "/wedding/couple-left.jpg",
        "/wedding/couple-right.jpg",
        "/wedding/background.jpg"
      ],
      rsvp: {
        isEnabled: weddingDetails.rsvp?.isEnabled ?? false,
        deadline: weddingDetails.rsvp?.deadline,
      },
      
      // Theme configuration (use event theme data if available)
      theme: weddingDetails.theme || {
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
      },
      
      // Venue details and directions
      venueName: weddingDetails.venueName || "Wedding Venue",
      venueAddress: weddingDetails.venueAddress || "Venue Address",
      venueCity: weddingDetails.venueCity || "City",
      venueMapCoordinates: weddingDetails.venueMapCoordinates || "",
      parkingInfo: weddingDetails.parkingInfo || "Parking information will be available soon.",
      
      // Couple Story and Welcome Message
      messages: {
        messageWelcome: weddingDetails.messages?.messageWelcome || "We are excited to celebrate our special day with you.",
        messageTagline: weddingDetails.messages?.messageTagline || "Our journey continues with you by our side.",
        messageStory: weddingDetails.messages?.messageStory || "We can't wait to celebrate with our favorite people in the world!",
        image1: weddingDetails.messages?.image1,
        image2: weddingDetails.messages?.image2,
      },
      
      // Gallery items
      galleryItems: weddingDetails.galleryItems || [
        {
          title: "Our Journey",
          date: "Our Love Story",
          text: "From our first date to our wedding day."
        }
      ],
      
      // Wedding Motif and Dress Code
      weddingMotif: weddingDetails.weddingMotif || {
        primaryColor: "#5A86AD", // Blue
        secondaryColor: "#C08081", // Rose
        accentColor: "#F5F2ED", // Cream
        theme: "Traditional Elegance",
        description: "Our wedding celebrates the timeless beauty of romance."
      },
      dressCode: weddingDetails.dressCode || {
        men: "Semi-formal attire",
        women: "Cocktail or semi-formal dresses",
        generalGuidelines: "Please dress for the occasion.",
        additionalNotes: ""
      },
      
      // Wedding Entourage
      entourage: weddingDetails.entourage || {
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
    }
  };
  
  // Add inline styles for animations and decorations
  const pageTransitionStyles = `
    .page-transition {
      animation: fadeIn 0.8s ease-in-out;
    }
    
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    .loading-dot:nth-child(1) { animation-delay: 0ms; }
    .loading-dot:nth-child(2) { animation-delay: 300ms; }
    .loading-dot:nth-child(3) { animation-delay: 600ms; }

    .corner-decoration-tl {
      background-image: url(/wedding/corner-decoration.svg);
    }
    .corner-decoration-tr {
      background-image: url(/wedding/corner-decoration.svg);
      transform: rotate(90deg);
    }
    .corner-decoration-bl {
      background-image: url(/wedding/corner-decoration.svg);
      transform: rotate(-90deg);
    }
    .corner-decoration-br {
      background-image: url(/wedding/corner-decoration.svg);
      transform: rotate(180deg);
    }
    
    /* Password protection form styles */
    .password-form-container {
      animation: scaleIn 0.5s ease-out;
    }
    
    @keyframes scaleIn {
      0% { opacity: 0; transform: scale(0.95); }
      100% { opacity: 1; transform: scale(1); }
    }
    
    .password-input:focus {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    }
    
    .password-submit-button:active {
      transform: translateY(0) scale(0.98);
    }
  `;

  // Pass the weddingProps from the templateProps to the Wedding component
  return (
    <>
      <style jsx>{pageTransitionStyles}</style>
      <div className="page-transition">
        <div className="relative">
          {/* Optional decorative elements */}
          <div className="absolute top-0 left-0 w-16 h-16 md:w-24 md:h-24 bg-contain bg-no-repeat opacity-30 corner-decoration-tl"></div>
          <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-contain bg-no-repeat opacity-30 corner-decoration-tr"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 bg-contain bg-no-repeat opacity-30 corner-decoration-bl"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-contain bg-no-repeat opacity-30 corner-decoration-br"></div>
          
          {/* Main wedding component */}
          <Wedding {...templateProps.weddingProps} />
        </div>
      </div>
    </>
  );
}