import { EventVisibility } from './index';

export interface WeddingThemeColors {
  'primary-color': string;
  'primary-color-light': string;
  'primary-color-lighter': string;
  'primary-color-dark': string;
  'primary-color-rgb': string;
  
  'secondary-color': string;
  'secondary-color-light': string;
  'secondary-color-lighter': string;
  'secondary-color-dark': string;
  'secondary-color-rgb': string;
  
  'accent-color': string;
  'accent-color-light': string;
  'accent-color-dark': string;
  'accent-color-rgb': string;
}

export interface WeddingEntourage {
  officiant: {
    name: string;
    title: string;
    organization: string;
    description: string;
  };
  parents: {
    bride: Array<{
      name: string;
      relation: string;
    }>;
    groom: Array<{
      name: string;
      relation: string;
    }>;
  };
  principalSponsors: {
    men: Array<{
      name: string;
      relation: string;
    }>;
    women: Array<{
      name: string;
      relation: string;
    }>;
  };
  bestMan: {
    name: string;
    relation: string;
  };
  maidOfHonor: {
    name: string;
    relation: string;
  };
  bridalParty: Array<{
    name: string;
    role: string;
    relation: string;
  }>;
  groomsmen: Array<{
    name: string;
    role: string;
    relation: string;
  }>;
  secondarySponsors: {
    candle: Array<{
      name: string;
      relation: string;
    }>;
    veil: Array<{
      name: string;
      relation: string;
    }>;
    cord: Array<{
      name: string;
      relation: string;
    }>;
  };
  bearers: {
    bible: {
      name: string;
      age: number;
      relation: string;
    };
    ring: {
      name: string;
      age: number;
      relation: string;
    };
    coin: {
      name: string;
      age: number;
      relation: string;
    };
  };
  flowerGirls: Array<{
    name: string;
    age: number;
    relation: string;
  }>;
}

export interface WeddingProps {
  // Basic wedding information
  brideFullName: string;
  groomFullName: string;
  groomNameDisplay: string;
  brideNameDisplay: string;
  date: string;
  venue: string;
  timeStart: string;
  timeEnd: string;
  mainImage1: string;
  mainImage2: string;
  galleryImage: string[];
  rsvp: {
    isEnabled: boolean;
    deadline?: string;
  };
  
  // Theme configuration
  theme: WeddingThemeColors;
  
  // Venue details and directions
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venueMapCoordinates: string;
  parkingInfo: string;
  
  // Couple Story and Welcome Message
  messages: {
    messageWelcome: string;
    messageTagline: string;
    messageStory: string;
    image1: string;
    image2: string;
  };
  
  // Gallery items for "Our Moments" section
  galleryItems: {
    title: string;
    date: string;
    text: string;
    image: string;
  }[];
  
  // Wedding Motif and Dress Code
  weddingMotif: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    theme: string;
    description: string;
  };
  dressCode: {
    men: string;
    women: string;
    generalGuidelines: string;
    additionalNotes: string;
  };
  
  // Wedding Entourage
  entourage: {
    // Wedding officiant
    officiant: {
      name: string;
      title: string;
      organization: string;
      description: string;
    };
    
    // Parents
    parents: {
      bride: {
        name: string;
        relation: string;
      }[];
      groom: {
        name: string;
        relation: string;
      }[];
    };
    
    // Principal Sponsors
    principalSponsors: {
      men: {
        name: string;
        relation: string;
      }[];
      women: {
        name: string;
        relation: string;
      }[];
    };
    
    // Best Man and Maid of Honor
    bestMan: {
      name: string;
      relation: string;
    };
    maidOfHonor: {
      name: string;
      relation: string;
    };
    
    // Wedding Party
    bridalParty: {
      name: string;
      role: string;
      relation: string;
    }[];
    groomsmen: {
      name: string;
      role: string;
      relation: string;
    }[];
    
    // Second Sponsors
    secondarySponsors: {
      candle: {
        name: string;
        relation: string;
      }[];
      veil: {
        name: string;
        relation: string;
      }[];
      cord: {
        name: string;
        relation: string;
      }[];
    };
    
    // Bearers
    bearers: {
      bible?: {
        name: string;
        age: number;
        relation: string;
      };
      ring?: {
        name: string;
        age: number;
        relation: string;
      };
      coin?: {
        name: string;
        age: number;
        relation: string;
      };
    };
    
    // Flower Girls
    flowerGirls: {
      name: string;
      age: number;
      relation: string;
    }[];
  };
}

export interface WeddingTemplateProps {
  weddingProps: WeddingProps;
}

export interface WeddingFormData {
  eventId: string;
  template: string;
  mainImage1?: File | null;
  mainImage2?: File | null;
  templateProps: WeddingTemplateProps;
}

export interface ExtendedWeddingFormData extends WeddingFormData {
  id?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
}