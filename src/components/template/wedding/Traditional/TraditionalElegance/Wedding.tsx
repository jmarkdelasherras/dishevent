'use client';

import React from 'react';
import Image from 'next/image';
import styles from './Wedding.module.css';
import { generateWeddingPlaceholder } from './PlaceholderGenerator';
import ThemeSetter, { ThemeColors } from './ThemeSetter';

// Custom loader for Image component to fix display issues
const customLoader = ({ src, width, quality }: { src: string, width: number, quality?: number }) => {
  // If it's a data URL or absolute URL (http/https), return as is
  if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // Otherwise, handle as a relative path - add width and quality params if needed
  return `${src}${src.includes('?') ? '&' : '?'}w=${width}&q=${quality || 75}`;
};

export interface WeddingProps {
  // Basic wedding information
  brideFullName?: string;
  groomFullName?: string;
  groomNameDisplay?: string;
  brideNameDisplay?: string;
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
  
  // Theme configuration - only accepts custom theme from parent page
  theme?: ThemeColors | null;
  
  // Venue details and directions
  venueName?: string;
  venueAddress?: string;
  venueCity?: string;
  venueMapCoordinates?: string;
  parkingInfo?: string;

  // Couple Story and Welcome Message
  messages?: {
    messageWelcome?: string;
    messageTagline?: string;
    messageStory?: string;
    image1?: string;
    image2?: string;
  };
  
  // Gallery items for "Our Moments" section
  galleryItems?: Array<{
    title?: string;
    date?: string;
    text?: string;
    image?: string;
  }>;
  
  // Wedding Motif and Dress Code
  weddingMotif?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    theme?: string;
    description?: string;
  };
  dressCode?: {
    men?: string;
    women?: string;
    generalGuidelines?: string;
    additionalNotes?: string;
  };
  
  // Wedding Entourage
  entourage?: {
    // Wedding officiant
    officiant?: {
      name: string;
      title?: string;
      organization?: string;
      description?: string;
    };
    
    // Parents
    parents?: {
      bride?: Array<{
        name: string;
        relation: "Mother" | "Father" | "Guardian" | string;
      }>;
      groom?: Array<{
        name: string;
        relation: "Mother" | "Father" | "Guardian" | string;
      }>;
    };
    
    // Principal Sponsors
    principalSponsors?: {
      men?: Array<{
        name: string;
        relation?: string;
      }>;
      women?: Array<{
        name: string;
        relation?: string;
      }>;
    };
    
    // Best Man and Maid of Honor
    bestMan?: {
      name: string;
      relation?: string;
    };
    maidOfHonor?: {
      name: string;
      relation?: string;
    };
    
    // Wedding Party
    bridalParty?: Array<{
      name: string;
      role?: string;
      relation?: string;
    }>;
    groomsmen?: Array<{
      name: string;
      role?: string;
      relation?: string;
    }>;
    
    // Second Sponsors
    secondarySponsors?: {
      candle?: Array<{
        name: string;
        relation?: string;
      }>;
      veil?: Array<{
        name: string;
        relation?: string;
      }>;
      cord?: Array<{
        name: string;
        relation?: string;
      }>;
    };
    
    // Bearers
    bearers?: {
      bible?: {
        name: string;
        age?: number;
        relation?: string;
      };
      ring?: {
        name: string;
        age?: number;
        relation?: string;
      };
      coin?: {
        name: string;
        age?: number;
        relation?: string;
      };
    };
    
    // Flower Girls
    flowerGirls?: Array<{
      name: string;
      age?: number;
      relation?: string;
    }>;
    
    // For backward compatibility
    familyMembers?: Array<{
      name: string;
      role: string;
      side: "bride" | "groom";
      relationship?: string;
    }>;
    godparents?: Array<{
      name: string;
      role: "godfather" | "godmother";
      side: "bride" | "groom";
      relationship?: string;
    }>;
    flowergirls?: Array<{
      name: string;
      age?: number;
      relationship: string;
    }>;
    ringbearers?: Array<{
      name: string;
      age?: number;
      relationship: string;
    }>;
  };
}

export const Wedding: React.FC<WeddingProps> = ({
  brideFullName = "Jane Doe",
  groomFullName = "John Smith",
  groomNameDisplay,
  brideNameDisplay,
  date = "October 15, 2025",
  venue = "Grand Palace Wedding Hall",
  timeStart = "3:00 PM",
  timeEnd = "10:00 PM",
  mainImage1,
  mainImage2,
  galleryItems,
  rsvp = {
    isEnabled: true,
    deadline: "2025-09-15"
  },
  
  // Venue details
  venueName = "The Grand Palace",
  venueAddress = "123 Wedding Boulevard",
  venueCity = "Paradise City, CA 90210",
  venueMapCoordinates = "34.052235, -118.243683",
  parkingInfo = "Complimentary valet parking is available for all guests.",
  
  // Couple Story and Welcome Message
  messages = {
    messageWelcome: "We are excited to celebrate our special day with you. Join us as we begin our journey together as husband and wife.",
    messageTagline: "Together we have found a friendship, raised a family of dreams, and built a love that will last a lifetime. Join us as we celebrate the beginning of our forever.",
    messageStory: "From our first meeting to this beautiful moment, every step of our journey has been filled with love. We can&apos;t wait to write the next chapter with all of our family and friends by our side on this magical day.",
    image1: "",
    image2: "",
  },
  
  // Wedding Motif and Dress Code
  weddingMotif = {
    primaryColor: "#8D7B68", // Warm taupe
    secondaryColor: "#A4907C", // Light beige
    accentColor: "#F1DEC9", // Cream
    theme: "Rustic Elegance",
    description: "Our wedding celebrates the beauty of natural elements with a warm, earthy palette complemented by touches of elegance."
  },
  dressCode = {
    men: "Semi-formal attire in earth tones. Tan or brown suits with cream or white shirts.",
    women: "Cocktail dresses in warm neutrals or pastels that complement our color palette.",
    generalGuidelines: "We invite you to embrace our rustic elegant theme with attire in earth tones, warm neutrals, or soft pastels.",
    additionalNotes: "The venue is partially outdoors, so comfortable footwear is recommended."
  },
  
  // Default entourage
  entourage,
  // Theme configuration
  theme
}) => {
  // Generate placeholder images if not provided - handle empty strings and null values
  const mainImageSrc1 = mainImage1 && mainImage1 !== "" ? mainImage1 : generateWeddingPlaceholder('main');
  const mainImageSrc2 = mainImage2 && mainImage2 !== "" ? mainImage2 : generateWeddingPlaceholder('background');
  const storyImage1 = messages.image1 && messages.image1 !== "" ? messages.image1 : generateWeddingPlaceholder('background');
  const storyImage2 = messages.image2 && messages.image2 !== "" ? messages.image2 : generateWeddingPlaceholder('background');
  
  // Generate default gallery images if not provided or handle array with potential empty strings
  const galleryImages = galleryItems 
    ? (Array.isArray(galleryItems) 
        ? galleryItems 
        : [])
    : [1, 2, 3].map(i => generateWeddingPlaceholder('gallery', i));
  
  // Remove unused function
  
  // Default entourage if not provided
  const weddingEntourage = entourage || {
    // Wedding Officiant
    officiant: {
      name: "Rev. James Wilson",
      title: "Pastor",
      organization: "Grace Community Church",
      description: "Serving the community for over 15 years"
    },
    
    // Parents
    parents: {
      bride: [
        {
          name: "Robert Doe",
          relation: "Father"
        },
        {
          name: "Elizabeth Doe",
          relation: "Mother"
        }
      ],
      groom: [
        {
          name: "William Smith",
          relation: "Father"
        },
        {
          name: "Patricia Smith",
          relation: "Mother"
        }
      ]
    },
    
    // Principal Sponsors
    principalSponsors: {
      men: [
        { name: "Thomas Anderson", relation: "Family Friend" },
        { name: "George Wilson", relation: "Uncle" },
        { name: "Robert Johnson", relation: "Mentor" },
        { name: "Edward Thompson", relation: "Family Friend" }
      ],
      women: [
        { name: "Sarah Johnson", relation: "Aunt" },
        { name: "Helen Davis", relation: "Family Friend" },
        { name: "Mary Williams", relation: "Godmother" },
        { name: "Susan Brown", relation: "Family Friend" }
      ]
    },
    
    // Best Man and Maid of Honor
    bestMan: {
      name: "Michael Brown",
      relation: "Brother of the Groom"
    },
    maidOfHonor: {
      name: "Emma Johnson",
      relation: "Sister of the Bride"
    },
    // Wedding Party
    bridalParty: [
      {
        name: "Sophia Martinez",
        role: "Bridesmaid",
        relation: "Best Friend"
      },
      {
        name: "Olivia Williams",
        role: "Bridesmaid",
        relation: "Cousin"
      },
      {
        name: "Isabella Brown",
        role: "Bridesmaid",
        relation: "College Friend"
      }
    ],
    groomsmen: [
      {
        name: "David Wilson",
        role: "Groomsman",
        relation: "Best Friend"
      },
      {
        name: "James Miller",
        role: "Groomsman",
        relation: "College Roommate"
      },
      {
        name: "Richard Thompson",
        role: "Groomsman",
        relation: "Childhood Friend"
      }
    ],
    
    // Secondary Sponsors
    secondarySponsors: {
      candle: [
        { name: "Christopher Lee", relation: "Friend of the Groom" },
        { name: "Amanda Johnson", relation: "Friend of the Bride" }
      ],
      veil: [
        { name: "Daniel Clark", relation: "Cousin of the Groom" },
        { name: "Jennifer Wilson", relation: "Friend of the Bride" }
      ],
      cord: [
        { name: "Benjamin Green", relation: "Brother of the Groom" },
        { name: "Rachel Taylor", relation: "Sister of the Bride" }
      ]
    },
    
    // Bearers
    bearers: {
      bible: {
        name: "Noah Jackson",
        age: 9,
        relation: "Cousin of the Bride"
      },
      ring: {
        name: "Ethan White",
        age: 7,
        relation: "Nephew of the Bride"
      },
      coin: {
        name: "Jacob Roberts",
        age: 8,
        relation: "Nephew of the Groom"
      }
    },
    
    // Flower Girls
    flowerGirls: [
      {
        name: "Lily Davis",
        age: 6,
        relation: "Niece of the Bride"
      },
      {
        name: "Charlotte Thomas",
        age: 5,
        relation: "Niece of the Groom"
      },
      {
        name: "Sophia Martinez",
        age: 4,
        relation: "Cousin of the Bride"
      },
      {
        name: "Emma Wilson",
        age: 6,
        relation: "Family Friend"
      }
    ]
  };
  
  // Default gallery descriptions if not provided
  const defaultGalleryItems = [
    {
      title: "Our First Date",
      date: "June 10, 2022",
      text: "Where it all began - a coffee shop on a rainy afternoon.",
      image: "https://via.placeholder.com/400?text=First+Date" // Placeholder image
    },
    {
      title: "The Proposal",
      date: "December 24, 2024",
      text: "Under the stars at our favorite spot, when he asked and I said yes.",
      image: "https://via.placeholder.com/400?text=Proposal" // Placeholder image
    },
    {
      title: "Engagement Party",
      date: "January 15, 2025",
      text: "Celebrating our engagement with friends and family.",
      image: "https://via.placeholder.com/400?text=Engagement+Party" // Placeholder image
    }
  ];
  
  // Use galleryItems if provided and not empty, otherwise fallback to default descriptions
  const defaultGalleryDescriptions = galleryItems && Array.isArray(galleryItems) && galleryItems.length > 0 
    ? galleryItems 
    : defaultGalleryItems;
  
  // Extract first names for display
  const brideName = brideFullName.split(' ')[0];
  const groomName = groomFullName.split(' ')[0];
  
  // Use display names if provided, otherwise use first names
  const displayBrideName = brideNameDisplay || brideName;
  const displayGroomName = groomNameDisplay || groomName;
  
  const useVerticalLayout = displayBrideName.length > 7 || displayGroomName.length > 7;
  
  // Add ref for auto-scroll interval
  const autoScrollIntervalRef = React.useRef<number | null>(null);
  
  // Initialize auto-scroll and clean up on unmount
  React.useEffect(() => {
    // Start auto-scroll after a delay
    const startAutoScroll = () => {
      const carouselTrack = document.getElementById('gallery-carousel');
      if (carouselTrack && !autoScrollIntervalRef.current) {
        autoScrollIntervalRef.current = window.setInterval(() => {
          // Get current scroll position
          const maxScroll = carouselTrack.scrollWidth - carouselTrack.clientWidth;
          const currentScroll = carouselTrack.scrollLeft;
          
          // If we're at the end, go back to start, otherwise advance
          if (currentScroll >= maxScroll - 20) {
            carouselTrack.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            const slideWidth = Math.max(320, window.innerWidth * 0.25);
            carouselTrack.scrollBy({ left: slideWidth, behavior: 'smooth' });
          }
        }, 4000); // Auto-scroll every 4 seconds
      }
    };
    
    // Start auto-scroll after 2 seconds
    const timer = setTimeout(startAutoScroll, 2000);
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
      const interval = autoScrollIntervalRef.current;
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, []);

  // For dynamic background images, we'll use a CSS class approach
  // Use backgroundImage URL to create a unique class name for this component instance
  const backgroundId = React.useMemo(() => {
    // Make sure mainImageSrc2 is a valid string
    const imagePath = typeof mainImageSrc2 === 'string' && mainImageSrc2 !== '' 
      ? mainImageSrc2 
      : 'default-background';
    return `bg-${imagePath.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 20)}`;
  }, [mainImageSrc2]);
  
  // Add the dynamic background style and color variables to the document on mount
  React.useEffect(() => {
    // Create a style element for this background if it doesn't exist
    if (!document.getElementById(backgroundId)) {
      const styleEl = document.createElement('style');
      styleEl.id = backgroundId;
      
      // Use a default background image if mainImageSrc2 is empty or null
      const backgroundUrl = typeof mainImageSrc2 === 'string' && mainImageSrc2 !== '' 
        ? `url(${mainImageSrc2})` 
        : 'none';
      
      styleEl.innerHTML = `
        .${backgroundId} { background-image: ${backgroundUrl}; }
        .${styles.traditionalElegance} {
          --motif-primary-color: ${weddingMotif.primaryColor || '#8D7B68'};
          --motif-secondary-color: ${weddingMotif.secondaryColor || '#A4907C'};
          --motif-accent-color: ${weddingMotif.accentColor || '#F1DEC9'};
        }
      `;
      document.head.appendChild(styleEl);
    }
    
    // Cleanup on unmount
    return () => {
      const styleEl = document.getElementById(backgroundId);
      if (styleEl) styleEl.remove();
    };
  }, [backgroundId, mainImageSrc2, weddingMotif.primaryColor, weddingMotif.secondaryColor, weddingMotif.accentColor]);
  
  return (
    <>
      {/* Apply theme using ThemeSetter component */}
      <ThemeSetter theme={theme || null} />
      
      <div className={`${styles.container} ${styles.traditionalElegance}`}>
      <div className={`${styles.heroSection}`}>
        <div className={styles.diagonalImageContainer}>
          <Image 
            loader={customLoader}
            src={mainImageSrc1}
            alt="Couple Portrait Left"
            width={800}
            height={1200}
            className={styles.imageLeft}
            priority
          />
          <div className={`${styles.verticalLine} ${styles.leftLine}`}></div>
          
          <div className={styles.centerLine}></div>
          
          <Image 
            loader={customLoader}
            src={mainImageSrc2}
            alt="Couple Portrait Right"
            width={800}
            height={1200}
            className={styles.imageRight}
            priority
          />
          <div className={`${styles.verticalLine} ${styles.rightLine}`}></div>
        </div>
        <div className={styles.overlay}>
          <div className={styles.heroContent}>
            <div className={styles.decorativeBorder}></div>
            <h1 className={styles.title}>
              <span className={`${styles.names} ${useVerticalLayout ? styles.verticalNames : ''}`}>
                <span className={styles.groomName}>{displayGroomName}</span>
                <span className={styles.ampersand}>&</span>
                <span className={styles.brideName}>{displayBrideName}</span>
              </span>
              <span className={styles.subTitle}>are getting married</span>
            </h1>
            <p className={styles.date}>{date}</p>
            <div 
              className={styles.journeyPrompt}
              onClick={() => {
                document.getElementById('details-section')?.scrollIntoView({ 
                  behavior: 'smooth'
                });
              }}
            >
              <span className={styles.journeyText}>Begin The Journey</span>
              <div className={styles.doubleArrow}>
                <div className={styles.arrow}></div>
                <div className={styles.arrow}></div>
              </div>
            </div>
  
          </div>
        </div>
      </div>

      <div id="details-section" className={styles.detailsSection}>
        <div className={styles.coupleSection}>
          <div className={styles.photoWrapper}>
            <div className={styles.photoFrame}>
              <Image 
                loader={customLoader}
                src={storyImage1} 
                alt="Couple" 
                width={500} 
                height={700}
                className={styles.couplePhoto}
                priority
              />
            </div>
            <div className={styles.specialPhotoFrame}>
              <Image 
                loader={customLoader}
                src={storyImage2} 
                alt="Special moment" 
                width={350} 
                height={350}
                className={styles.couplePhoto}
              />
            </div>
            <p className={styles.specialPhotoCaption}>Our favorite memory together</p>
          </div>
          
          <div className={styles.invitationText}>
            <h2 className={styles.names}>{displayGroomName} & {displayBrideName}</h2>
            <p className={styles.message}>{messages.messageWelcome}</p>
            <p className={styles.specialMessage}>
              {messages.messageTagline}
            </p>
            <p>
              {messages.messageStory}
            </p>
            <div className={styles.dateCountdown}>
              {Math.max(0, Math.floor((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days until we say &quot;I do&quot;
            </div>
          </div>
        </div>
        
        <div className={styles.eventDetailsCard}>
          <div className={styles.cardContent}>
            <h3 className={styles.sectionTitle}>Save the Date</h3>
            <div className={styles.dateDisplay}>
              <div className={styles.calendar}>
                <div className={styles.calendarMonth}>
                  {new Date(date).toLocaleString('default', { month: 'short' })}
                </div>
                <div className={styles.calendarDay}>
                  {new Date(date).getDate()}
                </div>
                <div className={styles.calendarYear}>
                  {new Date(date).getFullYear()}
                </div>
              </div>
              <div className={styles.timeVenue}>
                <p className={styles.time}>{timeStart} - {timeEnd}</p>
                <p className={styles.venue}>{venueName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wedding Gallery Carousel */}
      <div className={styles.gallerySection}>
        <h2 className={styles.sectionHeading}>Our Journey Together</h2>
        <p className={styles.sectionSubheading}>
          A glimpse into our beautiful moments that lead to this special day
        </p>
        <div className={styles.galleryCarouselContainer}>
          {/* Carousel Track with Auto-scroll */}
          <div className={styles.carouselWrapper}>
            {/* Left Navigation Button */}
            <button 
              className={`${styles.carouselNavButton} ${styles.carouselNavLeft}`}
              onClick={() => {
                const carouselTrack = document.getElementById('gallery-carousel');
                if (carouselTrack) {
                  // Get approximate slide width
                  let slideWidth = 0;
                  const slides = carouselTrack.getElementsByClassName(styles.gallerySlide);
                  if (slides.length > 0) {
                    slideWidth = (slides[0] as HTMLElement).offsetWidth;
                  } else {
                    slideWidth = Math.max(320, window.innerWidth * 0.25);
                  }
                  carouselTrack.scrollBy({ left: -slideWidth, behavior: 'smooth' });
                }
              }}
              aria-label="Previous photos"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            
            {/* Carousel Track */}
            <div 
              className={styles.carouselTrack} 
              id="gallery-carousel"
              onMouseEnter={() => {
                // Pause auto-scroll on hover
                if (autoScrollIntervalRef.current) {
                  clearInterval(autoScrollIntervalRef.current);
                  autoScrollIntervalRef.current = null;
                }
              }}
              onMouseLeave={() => {
                // Resume auto-scroll on mouse leave
                if (!autoScrollIntervalRef.current) {
                  const carouselTrack = document.getElementById('gallery-carousel');
                  if (carouselTrack) {
                    autoScrollIntervalRef.current = window.setInterval(() => {
                      // Get current scroll position
                      const maxScroll = carouselTrack.scrollWidth - carouselTrack.clientWidth;
                      const currentScroll = carouselTrack.scrollLeft;
                      
                      // If we're at the end, go back to start, otherwise advance
                      if (currentScroll >= maxScroll - 20) {
                        carouselTrack.scrollTo({ left: 0, behavior: 'smooth' });
                      } else {
                        const slideWidth = Math.max(320, window.innerWidth * 0.25);
                        carouselTrack.scrollBy({ left: slideWidth, behavior: 'smooth' });
                      }
                    }, 4000); // Auto-scroll every 4 seconds
                  }
                }
              }}
            >
              {galleryImages.map((item, index) => {
                // Check if we have a description for this image
                const description = defaultGalleryDescriptions[index];
                return (
                  <div key={index} className={styles.gallerySlide}>
                    <div className={styles.galleryCard}>
                      <div className={styles.galleryImageContainer}>
                        <Image 
                          loader={customLoader}
                          src={(() => {
                            // Handle object type with image property
                            if (typeof item === 'object' && item !== null && 'image' in item) {
                              return item.image && item.image !== "" 
                                ? item.image 
                                : generateWeddingPlaceholder('gallery', index);
                            }
                            // Handle string type
                            else if (typeof item === 'string' && item !== "") {
                              return item;
                            }
                            // Default fallback
                            return generateWeddingPlaceholder('gallery', index);
                          })()}
                          alt={description?.title || `Our moment ${index + 1}`}
                          width={400}
                          height={400}
                          className={styles.galleryImage}
                        />
                      </div>
                      {description && (
                        <div className={styles.galleryCaption}>
                          {description.title && description.title !== "" && 
                            <h4 className={styles.galleryTitle}>{description.title}</h4>
                          }
                          {description.date && description.date !== "" && 
                            <span className={styles.galleryDate}>{description.date}</span>
                          }
                          {description.text && description.text !== "" && 
                            <p className={styles.galleryText}>{description.text}</p>
                          }
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Right Navigation Button */}
            <button 
              className={`${styles.carouselNavButton} ${styles.carouselNavRight}`}
              onClick={() => {
                const carouselTrack = document.getElementById('gallery-carousel');
                if (carouselTrack) {
                  // Get approximate slide width
                  let slideWidth = 0;
                  const slides = carouselTrack.getElementsByClassName(styles.gallerySlide);
                  if (slides.length > 0) {
                    slideWidth = (slides[0] as HTMLElement).offsetWidth;
                  } else {
                    slideWidth = Math.max(320, window.innerWidth * 0.25);
                  }
                  carouselTrack.scrollBy({ left: slideWidth, behavior: 'smooth' });
                }
              }}
              aria-label="Next photos"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          
          {/* Carousel Pagination Indicator */}
          <div className={styles.carouselPagination}>
            {galleryImages.map((_, index) => (
              <button 
                key={index}
                className={styles.paginationDot}
                onClick={() => {
                  const carouselTrack = document.getElementById('gallery-carousel');
                  if (carouselTrack) {
                    // Get approximate slide width for more accurate pagination
                    let slideWidth = 0;
                    const slides = carouselTrack.getElementsByClassName(styles.gallerySlide);
                    if (slides.length > 0) {
                      slideWidth = (slides[0] as HTMLElement).offsetWidth;
                      const newPosition = slideWidth * index;
                      carouselTrack.scrollTo({ left: newPosition, behavior: 'smooth' });
                    }
                  }
                }}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>

      {/* Wedding Entourage */}
      <div className={styles.entourageSection}>
        <h2 className={styles.sectionHeading}>Our Wedding Entourage</h2>
        <p className={styles.sectionSubheading}>
          Meet the special people who will be by our side on our big day
        </p>
        
        <div className={styles.entourageContainer}>
          {/* Wedding Officiant - Single Centered */}
          {weddingEntourage.officiant && (
            <div className={styles.entourageCentered}>
              <h3 className={styles.entourageGroupTitle}>Wedding Officiant</h3>
              <div className={styles.entourageSingleMember}>
                <div className={styles.entourageMemberCard}>
                  <h4 className={styles.entourageMemberName}>{weddingEntourage.officiant.name}</h4>
                  <p className={styles.entourageMemberRole}>
                    {weddingEntourage.officiant.title}
                    {weddingEntourage.officiant.organization && `, ${weddingEntourage.officiant.organization}`}
                  </p>
                  {weddingEntourage.officiant.description && (
                    <p className={styles.entourageMemberDesc}>{weddingEntourage.officiant.description}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Parents - Side by Side */}
          {weddingEntourage.parents && (weddingEntourage.parents.groom || weddingEntourage.parents.bride) && (
            <div className={styles.entourageGroup}>
              <h3 className={styles.entourageGroupTitle}>Beloved Parents</h3>
              <div className={styles.entourageTable}>
                {/* Groom's Parents - Left Side */}
                <div className={styles.entourageSide}>
                  <h4 className={styles.entourageSideTitle}>Parents of the Groom</h4>
                  {weddingEntourage.parents.groom && weddingEntourage.parents.groom.length > 0 && (
                    <table className={styles.entourageList}>
                      <tbody>
                        {weddingEntourage.parents.groom.map((parent, index) => (
                          <tr key={`groom-parent-${index}`} className={styles.entourageMemberRow}>
                            <td>
                              <div className={styles.entourageMemberName}>{parent.name}</div>
                              <div className={styles.entourageMemberRole}>{parent.relation}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                
                {/* Bride's Parents - Right Side */}
                <div className={styles.entourageSide}>
                  <h4 className={styles.entourageSideTitle}>Parents of the Bride</h4>
                  {weddingEntourage.parents.bride && weddingEntourage.parents.bride.length > 0 && (
                    <table className={styles.entourageList}>
                      <tbody>
                        {weddingEntourage.parents.bride.map((parent, index) => (
                          <tr key={`bride-parent-${index}`} className={styles.entourageMemberRow}>
                            <td>
                              <div className={styles.entourageMemberName}>{parent.name}</div>
                              <div className={styles.entourageMemberRole}>{parent.relation}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Principal Sponsors - Side by Side */}
          {weddingEntourage.principalSponsors && 
           (weddingEntourage.principalSponsors.men || weddingEntourage.principalSponsors.women) && (
            <div className={styles.entourageGroup}>
              <h3 className={styles.entourageGroupTitle}>Principal Sponsors</h3>
              <div className={styles.entourageTable}>
                {/* Men - Left Side */}
                <div className={styles.entourageSide}>
                  <h4 className={styles.entourageSideTitle}>Gentlemen</h4>
                  {weddingEntourage.principalSponsors.men && weddingEntourage.principalSponsors.men.length > 0 && (
                    <table className={styles.entourageList}>
                      <tbody>
                        {weddingEntourage.principalSponsors.men.map((sponsor, index) => (
                          <tr key={`sponsor-men-${index}`} className={styles.entourageMemberRow}>
                            <td>
                              <div className={styles.entourageMemberName}>{sponsor.name}</div>
                              {sponsor.relation && (
                                <div className={styles.entourageMemberRole}>{sponsor.relation}</div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                
                {/* Women - Right Side */}
                <div className={styles.entourageSide}>
                  <h4 className={styles.entourageSideTitle}>Ladies</h4>
                  {weddingEntourage.principalSponsors.women && weddingEntourage.principalSponsors.women.length > 0 && (
                    <table className={styles.entourageList}>
                      <tbody>
                        {weddingEntourage.principalSponsors.women.map((sponsor, index) => (
                          <tr key={`sponsor-women-${index}`} className={styles.entourageMemberRow}>
                            <td>
                              <div className={styles.entourageMemberName}>{sponsor.name}</div>
                              {sponsor.relation && (
                                <div className={styles.entourageMemberRole}>{sponsor.relation}</div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Best Man & Maid of Honor - Side by Side */}
          {(weddingEntourage.bestMan || weddingEntourage.maidOfHonor) && (
            <div className={styles.entourageGroup}>
              <h3 className={styles.entourageGroupTitle}>Honor Attendants</h3>
              <div className={styles.entourageTable}>
                {/* Best Man - Left Side */}
                <div className={styles.entourageSide}>
                  <h4 className={styles.entourageSideTitle}>Best Man</h4>
                  {weddingEntourage.bestMan && (
                    <table className={styles.entourageList}>
                      <tbody>
                        <tr className={styles.entourageMemberRow}>
                          <td>
                            <div className={styles.entourageMemberName}>{weddingEntourage.bestMan.name}</div>
                            {weddingEntourage.bestMan.relation && (
                              <div className={styles.entourageMemberRole}>{weddingEntourage.bestMan.relation}</div>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
                
                {/* Maid of Honor - Right Side */}
                <div className={styles.entourageSide}>
                  <h4 className={styles.entourageSideTitle}>Maid of Honor</h4>
                  {weddingEntourage.maidOfHonor && (
                    <table className={styles.entourageList}>
                      <tbody>
                        <tr className={styles.entourageMemberRow}>
                          <td>
                            <div className={styles.entourageMemberName}>{weddingEntourage.maidOfHonor.name}</div>
                            {weddingEntourage.maidOfHonor.relation && (
                              <div className={styles.entourageMemberRole}>{weddingEntourage.maidOfHonor.relation}</div>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Groomsmen & Bridesmaids - Side by Side */}
          {(weddingEntourage.groomsmen || weddingEntourage.bridalParty) && (
            <div className={styles.entourageGroup}>
              <h3 className={styles.entourageGroupTitle}>Wedding Party</h3>
              <div className={styles.entourageTable}>
                {/* Groomsmen - Left Side */}
                <div className={styles.entourageSide}>
                  <h4 className={styles.entourageSideTitle}>Groomsmen</h4>
                  {weddingEntourage.groomsmen && weddingEntourage.groomsmen.length > 0 && (
                    <table className={styles.entourageList}>
                      <tbody>
                        {weddingEntourage.groomsmen.map((groomsman, index) => (
                          <tr key={`groomsman-${index}`} className={styles.entourageMemberRow}>
                            <td>
                              <div className={styles.entourageMemberName}>{groomsman.name}</div>
                              <div className={styles.entourageMemberRole}>{groomsman.role}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                
                {/* Bridesmaids - Right Side */}
                <div className={styles.entourageSide}>
                  <h4 className={styles.entourageSideTitle}>Bridesmaids</h4>
                  {weddingEntourage.bridalParty && weddingEntourage.bridalParty.length > 0 && (
                    <table className={styles.entourageList}>
                      <tbody>
                        {weddingEntourage.bridalParty.map((bridesmaid, index) => (
                          <tr key={`bridesmaid-${index}`} className={styles.entourageMemberRow}>
                            <td>
                              <div className={styles.entourageMemberName}>{bridesmaid.name}</div>
                              <div className={styles.entourageMemberRole}>{bridesmaid.role}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Secondary Sponsors - Single Centered with Subsections */}
          {weddingEntourage.secondarySponsors && (
            weddingEntourage.secondarySponsors.candle || 
            weddingEntourage.secondarySponsors.veil || 
            weddingEntourage.secondarySponsors.cord
          ) && (
            <div className={styles.entourageGroup}>
              <h3 className={styles.entourageGroupTitle}>Secondary Sponsors</h3>
              
              <div className={styles.secondarySponsorsWrapper}>
                {/* Candle Sponsors */}
                {weddingEntourage.secondarySponsors?.candle && weddingEntourage.secondarySponsors.candle.length > 0 && (
                  <div className={styles.secondarySponsorSection}>
                    <h4 className={styles.secondarySponsorTitle}>Candle</h4>
                    {/* Group sponsors in pairs (1 man, 1 woman) */}
                    {Array.from({ length: Math.ceil(weddingEntourage.secondarySponsors.candle.length / 2) }).map((_, pairIndex) => {
                      const candleSponsors = weddingEntourage.secondarySponsors?.candle || [];
                      const firstIndex = pairIndex * 2;
                      const secondIndex = firstIndex + 1;
                      const firstSponsor = candleSponsors[firstIndex];
                      const secondSponsor = secondIndex < candleSponsors.length ? candleSponsors[secondIndex] : null;
                      
                      return (
                        <div key={`candle-pair-${pairIndex}`} className={styles.sponsorPartners}>
                          <div className={styles.sponsorPartnerName}>
                            {firstSponsor.name}
                          </div>
                          {secondSponsor && (
                            <>
                              <div className={styles.sponsorPartnerAmpersand}>&amp;</div>
                              <div className={styles.sponsorPartnerName}>
                                {secondSponsor.name}
                              </div>
                            </>
                          )}
                          {(firstSponsor.relation || (secondSponsor && secondSponsor.relation)) && (
                            <div className={styles.sponsorPartnerInfo}>
                              {firstSponsor.relation}
                              {firstSponsor.relation && secondSponsor && secondSponsor.relation && ' & '}
                              {secondSponsor && secondSponsor.relation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Veil Sponsors */}
                {weddingEntourage.secondarySponsors?.veil && weddingEntourage.secondarySponsors.veil.length > 0 && (
                  <div className={styles.secondarySponsorSection}>
                    <h4 className={styles.secondarySponsorTitle}>Veil</h4>
                    {/* Group sponsors in pairs (1 man, 1 woman) */}
                    {Array.from({ length: Math.ceil(weddingEntourage.secondarySponsors.veil.length / 2) }).map((_, pairIndex) => {
                      const veilSponsors = weddingEntourage.secondarySponsors?.veil || [];
                      const firstIndex = pairIndex * 2;
                      const secondIndex = firstIndex + 1;
                      const firstSponsor = veilSponsors[firstIndex];
                      const secondSponsor = secondIndex < veilSponsors.length ? veilSponsors[secondIndex] : null;
                      
                      return (
                        <div key={`veil-pair-${pairIndex}`} className={styles.sponsorPartners}>
                          <div className={styles.sponsorPartnerName}>
                            {firstSponsor.name}
                          </div>
                          {secondSponsor && (
                            <>
                              <div className={styles.sponsorPartnerAmpersand}>&amp;</div>
                              <div className={styles.sponsorPartnerName}>
                                {secondSponsor.name}
                              </div>
                            </>
                          )}
                          {(firstSponsor.relation || (secondSponsor && secondSponsor.relation)) && (
                            <div className={styles.sponsorPartnerInfo}>
                              {firstSponsor.relation}
                              {firstSponsor.relation && secondSponsor && secondSponsor.relation && ' & '}
                              {secondSponsor && secondSponsor.relation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Cord Sponsors */}
                {weddingEntourage.secondarySponsors?.cord && weddingEntourage.secondarySponsors.cord.length > 0 && (
                  <div className={styles.secondarySponsorSection}>
                    <h4 className={styles.secondarySponsorTitle}>Cord</h4>
                    {/* Group sponsors in pairs (1 man, 1 woman) */}
                    {Array.from({ length: Math.ceil(weddingEntourage.secondarySponsors.cord.length / 2) }).map((_, pairIndex) => {
                      const cordSponsors = weddingEntourage.secondarySponsors?.cord || [];
                      const firstIndex = pairIndex * 2;
                      const secondIndex = firstIndex + 1;
                      const firstSponsor = cordSponsors[firstIndex];
                      const secondSponsor = secondIndex < cordSponsors.length ? cordSponsors[secondIndex] : null;
                      
                      return (
                        <div key={`cord-pair-${pairIndex}`} className={styles.sponsorPartners}>
                          <div className={styles.sponsorPartnerName}>
                            {firstSponsor.name}
                          </div>
                          {secondSponsor && (
                            <>
                              <div className={styles.sponsorPartnerAmpersand}>&amp;</div>
                              <div className={styles.sponsorPartnerName}>
                                {secondSponsor.name}
                              </div>
                            </>
                          )}
                          {(firstSponsor.relation || (secondSponsor && secondSponsor.relation)) && (
                            <div className={styles.sponsorPartnerInfo}>
                              {firstSponsor.relation}
                              {firstSponsor.relation && secondSponsor && secondSponsor.relation && ' & '}
                              {secondSponsor && secondSponsor.relation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Bearers - Single Row with Equal Columns */}
          {weddingEntourage.bearers && (
            weddingEntourage.bearers.bible || 
            weddingEntourage.bearers.ring || 
            weddingEntourage.bearers.coin
          ) && (
            <div className={styles.entourageGroup}>
              <h3 className={styles.entourageGroupTitle}>Bearers</h3>
              
              <div className={styles.bearersWrapper}>
                {/* Bible Bearer */}
                {weddingEntourage.bearers.bible && (
                  <div className={styles.bearerSection}>
                    <h4 className={styles.bearerTitle}>Bible Bearer</h4>
                    <div className={styles.bearerDetails}>
                      <p className={styles.bearerName}>{weddingEntourage.bearers.bible.name}</p>
                      <p className={styles.bearerInfo}>
                        {weddingEntourage.bearers.bible.age ? `${weddingEntourage.bearers.bible.age} years old` : ''} 
                        {weddingEntourage.bearers.bible.age && weddingEntourage.bearers.bible.relation ? ' • ' : ''}
                        {weddingEntourage.bearers.bible.relation}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Ring Bearer */}
                {weddingEntourage.bearers.ring && (
                  <div className={styles.bearerSection}>
                    <h4 className={styles.bearerTitle}>Ring Bearer</h4>
                    <div className={styles.bearerDetails}>
                      <p className={styles.bearerName}>{weddingEntourage.bearers.ring.name}</p>
                      <p className={styles.bearerInfo}>
                        {weddingEntourage.bearers.ring.age ? `${weddingEntourage.bearers.ring.age} years old` : ''} 
                        {weddingEntourage.bearers.ring.age && weddingEntourage.bearers.ring.relation ? ' • ' : ''}
                        {weddingEntourage.bearers.ring.relation}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Coin Bearer */}
                {weddingEntourage.bearers.coin && (
                  <div className={styles.bearerSection}>
                    <h4 className={styles.bearerTitle}>Coin Bearer</h4>
                    <div className={styles.bearerDetails}>
                      <p className={styles.bearerName}>{weddingEntourage.bearers.coin.name}</p>
                      <p className={styles.bearerInfo}>
                        {weddingEntourage.bearers.coin.age ? `${weddingEntourage.bearers.coin.age} years old` : ''} 
                        {weddingEntourage.bearers.coin.age && weddingEntourage.bearers.coin.relation ? ' • ' : ''}
                        {weddingEntourage.bearers.coin.relation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Flower Girls - Single Centered */}
          {weddingEntourage.flowerGirls && weddingEntourage.flowerGirls.length > 0 && (
            <div className={styles.entourageGroup}>
              <h3 className={styles.entourageGroupTitle}>Flower Girls</h3>
              <div className={styles.flowergirls}>
                {weddingEntourage.flowerGirls.map((girl, index) => (
                  <div key={`flowergirl-${index}`} className={styles.flowergirlItem}>
                    <p className={styles.flowergirlName}>{girl.name}</p>
                    <p className={styles.flowergirlInfo}>
                      {girl.age ? `${girl.age} years old` : ''} 
                      {girl.age && girl.relation ? ' • ' : ''}
                      {girl.relation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section Divider */}
      <div className={styles.sectionDivider}>
        <div className={styles.sectionDividerIcon}>👗</div>
      </div>

      {/* Wedding Motif and Dress Code Section */}
      <div className={styles.motifSection}>
        <h2 className={styles.sectionHeading}>Colors of Our Love Story</h2>
        <p className={styles.sectionSubheading}>
          The hues and styles that will bring our wedding vision to life
        </p>

        <div className={styles.motifContainer}>
          <div className={styles.motifInfo}>
            <div className={styles.motifDescription}>
              <h3 className={styles.motifTitle}>{weddingMotif.theme}</h3>
              <p className={styles.motifText}>{weddingMotif.description}</p>
            </div>

            <div className={styles.colorPaletteContainer}>
              <h4 className={styles.colorPaletteTitle}>Our Color Motif</h4>
              <div className={styles.colorPalette}>
                <div 
                  className={`${styles.colorSwatch} ${styles.primaryColor}`} 
                >
                  <span className={styles.colorName}>Primary</span>
                </div>
                <div 
                  className={`${styles.colorSwatch} ${styles.secondaryColor}`} 
                >
                  <span className={styles.colorName}>Secondary</span>
                </div>
                <div 
                  className={`${styles.colorSwatch} ${styles.accentColor}`} 
                >
                  <span className={styles.colorName}>Accent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className={styles.sectionDivider}>
        <div className={styles.sectionDividerIcon}>💍</div>
      </div>

      {/* Reception Info */}
      <div className={styles.receptionSection}>
        <h2 className={styles.sectionHeading}>Reception Info</h2>
        <p className={styles.sectionSubheading}>
          Join us for a magical day of celebration at our beautiful reception venue
        </p>
        
        <div className={styles.receptionDetailsWrapper}>
          <div className={styles.receptionDetailsCard}>
            <div className={styles.receptionHeader}>
              <h3 className={styles.receptionTitle}>Our Special Event</h3>
              <p className={styles.receptionSubTitle}>Everything you need to know about our reception</p>
            </div>
            
            <div className={styles.receptionContent}>
              <div className={styles.receptionDetails}>
                <div className={styles.detailCard}>
                  <div className={styles.detailHeader}>
                    <div className={styles.detailIcon}>📍</div>
                    <h3 className={styles.detailTitle}>Reception Venue</h3>
                  </div>
                  <p className={styles.detailText}>
                    {venueName}<br />
                    {venueAddress}<br />
                    {venueCity}
                  </p>
                </div>
                
                <div className={styles.detailCard}>
                  <div className={styles.detailHeader}>
                    <div className={styles.detailIcon}>🅿️</div>
                    <h3 className={styles.detailTitle}>Parking Information</h3>
                  </div>
                  <p className={styles.detailText}>{parkingInfo}</p>
                </div>
              </div>
              
              <div className={styles.mapWrapper}>
                {venueMapCoordinates && venueMapCoordinates !== "" && (
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}=${venueMapCoordinates}`}
                    title="Reception Venue Map"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* RSVP Section */}
      {rsvp.isEnabled && (
        <div className={styles.rsvpSection}>
          <div className={styles.rsvpOverlay}></div>
          <div className={styles.rsvpContent}>
            <div className={styles.rsvpCard}>
              <div className={styles.rsvpHeader}>
                <h2 className={styles.rsvpTitle}>Join Our Celebration</h2>
                <p className={styles.rsvpDeadline}>
                  Kindly RSVP by {rsvp.deadline || new Date(new Date(date).setMonth(new Date(date).getMonth() - 1)).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}
                </p>
              </div>
              
              <div className={styles.rsvpForm}>
                <div className={styles.rsvpNames}>
                  <div className={styles.rsvpBrideName}>{groomNameDisplay}</div>
                  <div className={styles.rsvpAmpersand}>&amp;</div>
                  <div className={styles.rsvpGroomName}>{brideNameDisplay}</div>
                </div>
                
                <div className={styles.rsvpDateLocation}>
                  <div className={styles.rsvpDate}>{date}</div>
                  <div className={styles.rsvpDivider}>at</div>
                  <div className={styles.rsvpLocation}>{venue}</div>
                </div>
                
                <p className={styles.rsvpMessage}>
                  We would be honored by your presence as we begin our journey together
                </p>
                
                <button className={styles.rsvpButton}>
                  <span className={styles.rsvpButtonText}>RSVP Now</span>
                  <span className={styles.rsvpButtonIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
              </div>
              
              <div className={styles.rsvpDecoration}>
                <div className={styles.rsvpDecorationCircle}></div>
                <div className={styles.rsvpDecorationLine}></div>
                <div className={styles.rsvpDecorationCircle}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Wedding;