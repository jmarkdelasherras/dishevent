'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { ExtendedWeddingFormData } from '@/types/wedding';
import { SafeImage } from '@/components/ui/safe-image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import { useFirebaseStorage } from '@/hooks/firebase/useFirebaseStorage';
import { useAuth } from '@/hooks/useAuth';
import { database } from '@/lib/firebase/config';
import { ref, set, push, get, onValue } from 'firebase/database';
import { RealtimeEvent } from '@/lib/firebase/realtime-types';

// Custom loader for Image component to fix empty string issues
const customLoader = ({ src, width, quality }: { src: string, width: number, quality?: number }) => {
  // If it's a data URL or absolute URL (http/https), return as is
  if (!src || src === '') return '/assets/image-placeholder.svg';
  if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // Otherwise, handle as a relative path - add width and quality params if needed
  return `${src}${src.includes('?') ? '&' : '?'}w=${width}&q=${quality || 75}`;
};

// Utility function to generate color variations
const generateColorVariations = (baseColor: string) => {
  // Convert hex to RGB
  const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  // RGB to hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  };

  // Lighten color
  const lighten = (hex: string, amount: number): string => {
    const [r, g, b] = hexToRgb(hex);
    return rgbToHex(
      r + (255 - r) * amount,
      g + (255 - g) * amount,
      b + (255 - b) * amount
    );
  };

  // Darken color
  const darken = (hex: string, amount: number): string => {
    const [r, g, b] = hexToRgb(hex);
    return rgbToHex(
      r * (1 - amount),
      g * (1 - amount),
      b * (1 - amount)
    );
  };

  const rgb = hexToRgb(baseColor);
  
  return {
    main: baseColor,
    light: lighten(baseColor, 0.3),
    lighter: lighten(baseColor, 0.6),
    dark: darken(baseColor, 0.3),
    rgb: `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`
  };
};

// Interface for component props
interface TraditionalFormProps {
  eventId: string;
  selectedTemplate: string;
  onSubmit?: (data: ExtendedWeddingFormData) => Promise<void>;
}

// Define constants for file size limits
const MAX_FILE_SIZE_MB = 5; // 5MB max file size
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert to bytes

// Utility function to validate file size
const validateFileSize = (file: File): { valid: boolean; message: string } => {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      message: `File size exceeds maximum limit of ${MAX_FILE_SIZE_MB}MB. Please select a smaller image.`
    };
  }
  return { valid: true, message: '' };
};

export default function TraditionalEleganceForm({
  eventId,
  selectedTemplate,
  onSubmit: formSubmitHandler
}: TraditionalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Start as false and only set to true when actually loading data
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({});
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});
  const [fileSelected, setFileSelected] = useState<Record<string, boolean>>({});
  const [galleryFiles, setGalleryFiles] = useState<Record<string, File>>({});
  const [galleryFileSelected, setGalleryFileSelected] = useState<Record<string, boolean>>({});
  const [galleryImageUrls, setGalleryImageUrls] = useState<Record<string, string>>({});
  const { uploadFile, deleteFile, isUploading } = useFirebaseStorage();
  const { user } = useAuth();
  const toast = useToast();
  // Reference to track if we've loaded the data to prevent multiple fetches
  const dataLoadedRef = React.useRef(false);
  const router = useRouter();
  const [hasExistingData, setHasExistingData] = useState(false);
  
  const onSubmit = async (data: ExtendedWeddingFormData) => {
    setIsSubmitting(true);
    try {
      if (!user) {
        throw new Error('You must be logged in to create an event');
      }
      
      // We'll do one thorough check for both React Hook Form validation errors
      // and our own required field validation
      let hasErrors = false;
      
      // Check if there are any errors from React Hook Form's validation
      const formErrors = methods.formState.errors;
      if (Object.keys(formErrors).length > 0) {
        hasErrors = true;
      }
      
      // Check for specific required fields
      const requiredFields = [
        { name: 'bride', value: data.templateProps.weddingProps.brideFullName },
        { name: 'groom', value: data.templateProps.weddingProps.groomFullName },
        { name: 'venue', value: data.templateProps.weddingProps.venueName },
        { name: 'date', value: data.templateProps.weddingProps.date },
        { name: 'time', value: data.templateProps.weddingProps.timeStart },
      ];

      // Check for any missing required fields
      const missingFields = requiredFields.filter(field => !field.value);
      if (missingFields.length > 0) {
        hasErrors = true;
      }
      
      // Show a single toast message if any validation failed
      if (hasErrors) {
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }
      
      // Handle image paths - apply more strict replacement logic
      // ONLY use existing image URLs when no new files are selected
      // This ensures complete replacement of images rather than preserving unused ones
      
      // Explicitly handle mainImage1
      if (selectedFiles['mainImage1']) {
        // If new file selected, it will be uploaded and replace existing one
        // The URL will be set during the upload process below
      } else if (imageUrls['mainImage1']) {
        // Only preserve existing URL if no new file is selected
        data.templateProps.weddingProps.mainImage1 = imageUrls['mainImage1'];
      } else {
        // Ensure field is empty if no image exists or was selected
        data.templateProps.weddingProps.mainImage1 = '';
      }
      
      // Explicitly handle mainImage2
      if (selectedFiles['mainImage2']) {
        // If new file selected, it will be uploaded and replace existing one
        // The URL will be set during the upload process below
      } else if (imageUrls['mainImage2']) {
        // Only preserve existing URL if no new file is selected
        data.templateProps.weddingProps.mainImage2 = imageUrls['mainImage2'];
      } else {
        // Ensure field is empty if no image exists or was selected
        data.templateProps.weddingProps.mainImage2 = '';
      }
      
      // Explicitly handle storyImage1
      if (selectedFiles['storyImage1']) {
        // If new file selected, it will be uploaded and replace existing one
        // The URL will be set during the upload process below
      } else if (imageUrls['storyImage1']) {
        // Only preserve existing URL if no new file is selected
        data.templateProps.weddingProps.messages.image1 = imageUrls['storyImage1'];
      } else {
        // Ensure field is empty if no image exists or was selected
        data.templateProps.weddingProps.messages.image1 = '';
      }
      
      // Explicitly handle storyImage2
      if (selectedFiles['storyImage2']) {
        // If new file selected, it will be uploaded and replace existing one
        // The URL will be set during the upload process below
      } else if (imageUrls['storyImage2']) {
        // Only preserve existing URL if no new file is selected
        data.templateProps.weddingProps.messages.image2 = imageUrls['storyImage2'];
      } else {
        // Ensure field is empty if no image exists or was selected
        data.templateProps.weddingProps.messages.image2 = '';
      }
      
      // Process gallery images
      // Check each gallery item for new images that need to be uploaded
      const galleryUploadPromises: Promise<void>[] = [];
      
      // This processes gallery images selected for upload
      if (Object.keys(galleryFiles).length > 0) {
        console.log('Starting gallery image uploads with replacement:', {
          galleryFiles: Object.keys(galleryFiles)
        });
        
        // Mark gallery images as uploading
        setUploadingImages(prev => {
          const newState = { ...prev };
          Object.keys(galleryFiles).forEach(key => {
            newState[key] = true;
          });
          return newState;
        });
        
        // Process each gallery item with a new image
        Object.entries(galleryFiles).forEach(([galleryKey, file]) => {
          // Extract the index from the key (format: "gallery-{index}")
          const index = parseInt(galleryKey.split('-')[1], 10);
          if (isNaN(index)) return;
          
      // Create an upload promise for this gallery image
      const uploadPromise = (async () => {
        try {
          // Show visual feedback in UI for this specific gallery image
          setUploadingImages(prev => ({
            ...prev,
            [`gallery-${index}`]: true
          }));
          
          const path = `events/${eventId}/gallery`;
          const fileExtension = file.name.split('.').pop();
          
          // Generate a unique filename
          const uniqueFileName = `gallery-${index}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExtension}`;
          
          // Get the existing image URL from both form data and our galleryImageUrls state
          // This ensures we catch any image URLs that might be in different states
          const existingFormUrl = data.templateProps.weddingProps.galleryItems[index]?.image;
          const existingStateUrl = galleryImageUrls[`gallery-${index}`];
          
          // Use either URL that exists
          const existingImageUrl = existingFormUrl || existingStateUrl;
          
          // Delete the old file if it exists
          if (existingImageUrl) {
            try {
              console.log(`Deleting old gallery image for index ${index}:`, existingImageUrl);
              await deleteFile(existingImageUrl);
              // Also clear from our state right after successful deletion
              setGalleryImageUrls(prev => {
                const newUrls = { ...prev };
                delete newUrls[`gallery-${index}`];
                return newUrls;
              });
            } catch (error) {
              console.error(`Error deleting old gallery image for index ${index}:`, error);
              // Continue with upload even if delete fails
            }
          }
          
          // Upload the new file with a slight delay to ensure UI feedback is visible
          await new Promise(resolve => setTimeout(resolve, 300)); // Small delay for visual feedback
          const downloadURL = await uploadFile(file, path, uniqueFileName);
          
          // Update the form data with the new URL - this ensures it's saved to Firebase
          data.templateProps.weddingProps.galleryItems[index].image = downloadURL;
          
          // Also update the form field directly so it's reflected in the UI
          methods.setValue(`templateProps.weddingProps.galleryItems.${index}.image`, downloadURL);
          
          // Store the URL in state for reference and display
          // Use the gallery key format for consistency
          setGalleryImageUrls(prev => ({
            ...prev,
            [galleryKey]: downloadURL
          }));
          
          // Clear the preview since we now have the uploaded URL
          setGalleryPreviews(prev => {
            const newPreviews = { ...prev };
            delete newPreviews[index];
            return newPreviews;
          });
              
          console.log(`Updated gallery image ${index} with new URL:`, downloadURL);
            } catch (error) {
              console.error(`Error processing gallery image ${index}:`, error);
              throw error; // Re-throw to be caught by the Promise.all
            } finally {
              // Mark this gallery image as no longer uploading
              setUploadingImages(prev => ({
                ...prev,
                [galleryKey]: false
              }));
            }
          })();
          
          galleryUploadPromises.push(uploadPromise);
        });
      }
      
      // Upload main images (mainImage1, mainImage2)
      if (Object.keys(selectedFiles).length > 0) {
        console.log('Starting main image uploads with replacement:', {
          selectedFiles: Object.keys(selectedFiles),
          existingUrls: imageUrls
        });
        
        try {
          setUploadingImages(prev => {
            const newState = { ...prev };
            Object.keys(selectedFiles).forEach(field => {
              newState[field] = true;
            });
            return newState;
          });
          
          // Upload each file and update the data object
          await Promise.all(
            Object.entries(selectedFiles).map(async ([field, file]) => {
              const path = `events/${eventId}/images`;
              const fileExtension = file.name.split('.').pop();
              
              // Generate a unique filename to avoid any caching issues and ensure complete replacement
              const uniqueFileName = `${field}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExtension}`;
              
              // Delete the old file from Firebase Storage if it exists
              const existingImageUrl = imageUrls[field];
              if (existingImageUrl) {
                try {
                  console.log(`Deleting old image for ${field}:`, existingImageUrl);
                  await deleteFile(existingImageUrl);
                } catch (error) {
                  console.error(`Error deleting old image for ${field}:`, error);
                  // Continue with upload even if delete fails
                }
              }
              
              // Upload the new file
              const downloadURL = await uploadFile(file, path, uniqueFileName);
              
              // Completely replace any existing URL in form data with the new one
              if (field === 'mainImage1' || field === 'mainImage2') {
                data.templateProps.weddingProps[field] = downloadURL;
              } else if (field === 'storyImage1') {
                data.templateProps.weddingProps.messages.image1 = downloadURL;
              } else if (field === 'storyImage2') {
                data.templateProps.weddingProps.messages.image2 = downloadURL;
              }
              
              // Store the URL for future reference and clear out any old URLs
              setImageUrls(prev => ({ 
                ...prev, 
                [field]: downloadURL 
              }));
              
              console.log(`Updated image ${field} with new URL: ${downloadURL}`);
            })
          );
          
          // Reset all relevant states since files are now uploaded
          setFileSelected({});
          setSelectedFiles({});
          
          // Clear image previews to show uploaded versions instead
          setImagePreview({});
          
          toast.success('Main images uploaded successfully');
        } catch (error) {
          console.error('Error uploading main images:', error);
          toast.error(`Failed to upload one or more main images: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
          setUploadingImages(prev => {
            const newState = { ...prev };
            Object.keys(selectedFiles).forEach(field => {
              newState[field] = false;
            });
            return newState;
          });
        }
      }
      
      // Wait for all gallery uploads to complete
      if (galleryUploadPromises.length > 0) {
        try {
          // Show processing message for gallery uploads
          toast.success('Processing gallery images...');
          
          await Promise.all(galleryUploadPromises);
          
          // Reset gallery states - similar to what we do for main images
          setGalleryFileSelected({});
          setGalleryFiles({});
          setGalleryPreviews({});
          
          // Update galleryImageUrls with the latest values from the form data
          // This ensures our state is in sync with what was just saved
          const updatedGalleryUrls: Record<string, string> = {};
          data.templateProps.weddingProps.galleryItems.forEach((item, idx) => {
            if (item.image) {
              updatedGalleryUrls[`gallery-${idx}`] = item.image;
            }
          });
          
          // Replace the galleryImageUrls with fresh data from the form
          setGalleryImageUrls(updatedGalleryUrls);
          
          toast.success(`${galleryUploadPromises.length} gallery image${galleryUploadPromises.length > 1 ? 's' : ''} uploaded successfully`);
        } catch (error) {
          console.error('Error uploading gallery images:', error);
          toast.error(`Failed to upload one or more gallery images: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      // Log the complete form data with image paths
      console.log('Final form data with image paths:', {
        mainImage1: data.templateProps.weddingProps.mainImage1,
        mainImage2: data.templateProps.weddingProps.mainImage2
      });
      
      console.log('Form data submitted with images:', data);
      
      // Check if we're updating an existing event or creating a new one
      const currentEventId = eventId;
      
      // Create a reference to the wedding details node in Firebase Database
      const weddingDetailsRef = ref(database, `weddingDetails/${currentEventId}`);
      
      // Check if this is an update or a new creation
      const isUpdate = hasExistingData;
      
      // Prepare data to be saved in Firebase
      const weddingDetailsData = {
        ...data.templateProps.weddingProps,
        ownerId: user.uid,
        eventId: currentEventId,
        updatedAt: new Date().toISOString(),
        template: selectedTemplate,
      } as Record<string, unknown>;
      
      // Handle timestamps and event updates
      // Preserve creation date if available, or set it for new events
      if (data.templateProps.weddingProps && 'createdAt' in data.templateProps.weddingProps) {
        weddingDetailsData.createdAt = data.templateProps.weddingProps.createdAt as string;
      } else {
        weddingDetailsData.createdAt = new Date().toISOString();
      }
      
      // Trigger when adding a new details only if event is still draft
      if (isUpdate) {
        try {
        const eventRef = ref(database, `events/${currentEventId}`);
        const eventSnapshot = await get(eventRef);
        if (eventSnapshot.exists()) {
          const eventData = eventSnapshot.val() as RealtimeEvent;
          
          // Get the theme from weddingMotif if available
          const weddingMotifTheme = data.templateProps.weddingProps.weddingMotif?.theme || selectedTemplate;
          
          // Always update the event with active status and theme
          // This ensures that both new and updated events have the correct status
          await set(eventRef, {
            ...eventData,
            status: 'active', // Always set status to active for both new and updated events
            theme: weddingMotifTheme, // Update theme to match weddingMotif theme
            updatedAt: new Date().toISOString()
          });
          console.log(`Event status set to active and theme updated to ${weddingMotifTheme}`);
        }
      } catch (error) {
        console.error('Error updating event data:', error);
        // Continue with saving wedding details even if this fails
      } 
      }
      
      // Save wedding details to Firebase
      await set(weddingDetailsRef, weddingDetailsData);
      
      // Call the parent component's onSubmit if it exists
      if (formSubmitHandler) {
        await formSubmitHandler(data);
      }

      // Show success message
      const message = isUpdate 
        ? 'Wedding details updated successfully!' 
        : 'Wedding details saved successfully!';
      toast.success(message);

      // Refresh the page to reflect updated data after 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.refresh();
    } catch (error) {
      console.error('Error saving wedding details:', error);
      toast.error(`Failed to save wedding details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const methods = useForm<ExtendedWeddingFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      eventId: eventId,
      templateProps: {
        weddingProps: {
          brideFullName: '',
          groomFullName: '',
          brideNameDisplay: '',
          groomNameDisplay: '',
          date: '',
          venue: '',
          timeStart: '',
          timeEnd: '',
          mainImage1: '',
          mainImage2: '',
          galleryImage: [],
          rsvp: {
            isEnabled: true,
            deadline: ''
          },
          
          theme: {
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
          
          venueName: '',
          venueAddress: '',
          venueCity: '',
          venueMapCoordinates: '',
          parkingInfo: '',
          
          messages: {
            messageWelcome: 'We are excited to celebrate our special day with you.',
            messageTagline: '',
            messageStory: '',
            image1: '',
            image2: ''
          },
          
          galleryItems: [],
          
          weddingMotif: {
            primaryColor: '#5A86AD',
            secondaryColor: '#C08081',
            accentColor: '#F5F2ED',
            theme: 'Traditional Elegance',
            description: ''
          },
          
          dressCode: {
            men: '',
            women: '',
            generalGuidelines: '',
            additionalNotes: ''
          },
          
          entourage: {
            officiant: {
              name: '',
              title: '',
              organization: '',
              description: ''
            },
            parents: {
              bride: [],
              groom: []
            },
            principalSponsors: {
              men: [],
              women: []
            },
            bestMan: {
              name: '',
              relation: ''
            },
            maidOfHonor: {
              name: '',
              relation: ''
            },
            bridalParty: [],
            groomsmen: [],
            secondarySponsors: {
              candle: [],
              veil: [],
              cord: []
            },
            bearers: {
              bible: { name: '', age: 0, relation: '' },
              ring: { name: '', age: 0, relation: '' },
              coin: { name: '', age: 0, relation: '' }
            },
            flowerGirls: []
          }
        }
      }
    }
  });
  
  const { register, formState: { errors }, control } = methods;
  // Define field arrays for dynamic sections
  const menSponsorsFields = useFieldArray({
    control,
    name: 'templateProps.weddingProps.entourage.principalSponsors.men',
  });

  const womenSponsorsFields = useFieldArray({
    control,
    name: 'templateProps.weddingProps.entourage.principalSponsors.women',
  });
  
  // Secondary sponsors field arrays
  const candleSponsorsFields = useFieldArray({
    control,
    name: 'templateProps.weddingProps.entourage.secondarySponsors.candle',
  });
  
  const veilSponsorsFields = useFieldArray({
    control,
    name: 'templateProps.weddingProps.entourage.secondarySponsors.veil',
  });
  
  const cordSponsorsFields = useFieldArray({
    control,
    name: 'templateProps.weddingProps.entourage.secondarySponsors.cord',
  });

  const bridalPartyFields = useFieldArray({
    control,
    name: 'templateProps.weddingProps.entourage.bridalParty',
  });

  const groomsmenFields = useFieldArray({
    control,
    name: 'templateProps.weddingProps.entourage.groomsmen',
  });

  const flowerGirlsFields = useFieldArray({
    control,
    name: 'templateProps.weddingProps.entourage.flowerGirls',
  });

  const brideParentsFields = useFieldArray({
    control,
    name: 'templateProps.weddingProps.entourage.parents.bride',
  });

  const groomParentsFields = useFieldArray({
    control,
    name: 'templateProps.weddingProps.entourage.parents.groom',
  });
  
  const galleryItemsFields = useFieldArray({
    control,
    name: 'templateProps.weddingProps.galleryItems',
  });

  const [imagePreview, setImagePreview] = useState<{
    mainImage1?: string;
    mainImage2?: string;
    storyImage1?: string;
    storyImage2?: string;
  }>({});
  const [galleryPreviews, setGalleryPreviews] = useState<{[key: number]: string}>({});
  const [fileNames, setFileNames] = useState<{
    mainImage1?: string;
    mainImage2?: string;
    storyImage1?: string;
    storyImage2?: string;
  }>({});
  const [bibleBearer, setBibleBearer] = useState<boolean>(true);
  const [ringBearer, setRingBearer] = useState<boolean>(true);
  const [coinBearer, setCoinBearer] = useState<boolean>(true);
  
  // Reset the dataLoadedRef when the component unmounts
  useEffect(() => {
    return () => {
      dataLoadedRef.current = false;
    };
  }, []);
  
  // Load existing event data if event_id is provided in URL
  useEffect(() => {
    // Prevent repeated data fetching due to dependency changes
    if (dataLoadedRef.current) return;
    
    // Only proceed if there's an event_id in the URL
    const event_id = eventId
    if (!event_id) {
      setIsLoading(false);
      return;
    }
    
    const loadExistingEventData = async () => {
      try {
        // Check if we have an event_id in the URL
        const event_id = eventId
        
        if (event_id && user) {
          setIsLoading(true);
          
          // Reference to the wedding details in Firebase
          const weddingDetailsRef = ref(database, `weddingDetails/${event_id}`);
          
          // Get the data once
          const snapshot = await get(weddingDetailsRef);
          
          if (snapshot.exists()) {
            const eventData = snapshot.val();
            
            // Check if the event belongs to the current user
            if (eventData.ownerId === user.uid) {
              // Update form with existing data
              const formData = {
                eventId: event_id,
                templateProps: {
                  weddingProps: {
                    ...eventData
                  }
                }
              };
              
              // Reset form with the loaded data
              methods.reset(formData);
              
              // Update image URLs for preview
              const imageURLs = {
                mainImage1: eventData.mainImage1 || '',
                mainImage2: eventData.mainImage2 || '',
                storyImage1: eventData.messages?.image1 || '',
                storyImage2: eventData.messages?.image2 || '',
              };
              
              setImageUrls(imageURLs);
              
              // Store gallery image URLs if they exist
              if (eventData.galleryItems && Array.isArray(eventData.galleryItems)) {
                const galleryURLs: Record<string, string> = {};
                
                // Process each gallery item's image URL
                eventData.galleryItems.forEach((item: { image?: string }, index: number) => {
                  if (item && item.image) {
                    // Store with gallery-{index} format for consistency
                    galleryURLs[`gallery-${index}`] = item.image;
                  }
                });
                
                // Set gallery URLs state if we found any
                if (Object.keys(galleryURLs).length > 0) {
                  setGalleryImageUrls(galleryURLs);
                }
              }
              
              // Explicitly set the image paths in the form values
              // This ensures they'll be included in the submission even if no new images are selected
              if (imageURLs.mainImage1) {
                methods.setValue('templateProps.weddingProps.mainImage1', imageURLs.mainImage1);
              }
              if (imageURLs.mainImage2) {
                methods.setValue('templateProps.weddingProps.mainImage2', imageURLs.mainImage2);
              }
              
              // Display success message only once
              // toast.success('Event data loaded successfully');
            } else {
              // If event doesn't belong to current user
              toast.error('You do not have permission to edit this event');
            }
          } else {
            // No data found for this event ID
            // toast.error('Event not found');
          }
          
          // Mark data as loaded to prevent repeated fetches
          dataLoadedRef.current = true;
          setHasExistingData(true);
        }
      } catch (error) {
        console.error('Error loading event data:', error);
        toast.error(`Failed to load event data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Run the load function
    loadExistingEventData();
    // We're including methods and toast as dependencies but using the ref to prevent repeats
  }, [eventId, user, methods, toast]);

  // Initialize color variations when the form loads
  useEffect(() => {
    const primaryColor = methods.getValues('templateProps.weddingProps.weddingMotif.primaryColor');
    const secondaryColor = methods.getValues('templateProps.weddingProps.weddingMotif.secondaryColor');
    const accentColor = methods.getValues('templateProps.weddingProps.weddingMotif.accentColor');
    
    if (primaryColor) {
      const variations = generateColorVariations(primaryColor);
      methods.setValue('templateProps.weddingProps.theme.primary-color', primaryColor);
      methods.setValue('templateProps.weddingProps.theme.primary-color-light', variations.light);
      methods.setValue('templateProps.weddingProps.theme.primary-color-lighter', variations.lighter);
      methods.setValue('templateProps.weddingProps.theme.primary-color-dark', variations.dark);
      methods.setValue('templateProps.weddingProps.theme.primary-color-rgb', variations.rgb);
    }
    
    if (secondaryColor) {
      const variations = generateColorVariations(secondaryColor);
      methods.setValue('templateProps.weddingProps.theme.secondary-color', secondaryColor);
      methods.setValue('templateProps.weddingProps.theme.secondary-color-light', variations.light);
      methods.setValue('templateProps.weddingProps.theme.secondary-color-lighter', variations.lighter);
      methods.setValue('templateProps.weddingProps.theme.secondary-color-dark', variations.dark);
      methods.setValue('templateProps.weddingProps.theme.secondary-color-rgb', variations.rgb);
    }
    
    if (accentColor) {
      const variations = generateColorVariations(accentColor);
      methods.setValue('templateProps.weddingProps.theme.accent-color', accentColor);
      methods.setValue('templateProps.weddingProps.theme.accent-color-light', variations.light);
      methods.setValue('templateProps.weddingProps.theme.accent-color-dark', variations.dark);
      methods.setValue('templateProps.weddingProps.theme.accent-color-rgb', variations.rgb);
    }
  }, [methods]);
  
  // Handle image selection and preview only (no upload yet)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageField: 'mainImage1' | 'mainImage2' | 'storyImage1' | 'storyImage2') => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    // Validate file size before processing
    const fileValidation = validateFileSize(file);
    if (!fileValidation.valid) {
      toast.error(fileValidation.message);
      // Reset the input to allow the user to try again
      e.target.value = '';
      return;
    }

    // Create preview for immediate visual feedback
    const reader = new FileReader();
    reader.onloadend = () => {
      // Set the new image preview, completely replacing any previous one
      setImagePreview(prev => ({
        ...prev,
        [imageField]: reader.result as string
      }));
      
      // Store the file reference for later upload during form submission
      const filesObj = { ...selectedFiles };
      filesObj[imageField] = file;
      setSelectedFiles(filesObj);
      
      // Mark this field as having a file selected but not yet uploaded
      setFileSelected(prev => ({
        ...prev,
        [imageField]: true
      }));
      
      // Keep track of the original file name for better UX
      const fileNameObj = { ...fileNames };
      fileNameObj[imageField] = file.name;
      setFileNames(fileNameObj);
      
      // Store the old URL for later deletion (but don't remove it from imageUrls yet)
      // We'll handle the deletion when actually uploading
      
      // Clear any previously set form value to ensure old image is not preserved
      if (imageField === 'mainImage1' || imageField === 'mainImage2') {
        methods.setValue(`templateProps.weddingProps.${imageField}`, '');
      } else if (imageField === 'storyImage1') {
        methods.setValue('templateProps.weddingProps.messages.image1', '');
      } else if (imageField === 'storyImage2') {
        methods.setValue('templateProps.weddingProps.messages.image2', '');
      }
      
      // We no longer clear imageUrls here - we'll keep the reference until we're ready to delete
      // This ensures we have the URL to delete the old image when we upload the new one
    };
    reader.readAsDataURL(file);
  };
  
  // Handle gallery image selection with preview (no immediate upload)
  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    // Validate file size before processing
    const fileValidation = validateFileSize(file);
    if (!fileValidation.valid) {
      toast.error(fileValidation.message);
      // Reset the input to allow the user to try again
      e.target.value = '';
      return;
    }
    
    // Create a unique key for this gallery item
    const galleryKey = `gallery-${index}`;
    
    // Create preview for immediate visual feedback
    const reader = new FileReader();
    reader.onloadend = () => {
      // Get the existing image URL before setting the preview
      const existingImageUrl = methods.getValues(`templateProps.weddingProps.galleryItems.${index}.image`) || galleryImageUrls[galleryKey];
      
      // Keep track that there's a new image pending to replace the old one
      if (existingImageUrl) {
        console.log(`Gallery image ${index} will replace existing image:`, existingImageUrl);
      }
      
      // Set the preview
      setGalleryPreviews(prev => ({
        ...prev,
        [index]: reader.result as string
      }));
      
      // Store the file reference for later upload during form submission
      setGalleryFiles(prev => ({
        ...prev,
        [galleryKey]: file
      }));
      
      // Mark this gallery item as having a file selected but not yet uploaded
      setGalleryFileSelected(prev => ({
        ...prev,
        [galleryKey]: true
      }));
      
      // Clear the current image path in the form data to ensure old image is not preserved
      // during submission, but we keep the galleryImageUrls for deletion reference
      methods.setValue(`templateProps.weddingProps.galleryItems.${index}.image`, '');
    };
    reader.readAsDataURL(file);
  };

  // This section previously contained handleGalleryImageChange function
  // It's been replaced with inline image handling in the gallery items
  
  return (
    <FormProvider {...methods}>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-10">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading event data...</p>
        </div>
      ) : (
        <form onSubmit={methods.handleSubmit(onSubmit, errors => {
          // This will be called when form validation fails
          if (Object.keys(errors).length > 0) {
            toast.error('Please fill in all required fields');
          }
        })} className="space-y-8">
        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="w-full grid grid-cols-3 md:grid-cols-6 mb-8 gap-1 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="basics" className="font-medium text-sm">Basic Info</TabsTrigger>
            <TabsTrigger value="details" className="font-medium text-sm">Details</TabsTrigger>
            <TabsTrigger value="appearance" className="font-medium text-sm">Appearance</TabsTrigger>
            <TabsTrigger value="messages" className="font-medium text-sm">Messages</TabsTrigger>
            <TabsTrigger value="entourage" className="font-medium text-sm">Entourage</TabsTrigger>
            <TabsTrigger value="gallery" className="font-medium text-sm">Gallery</TabsTrigger>
          </TabsList>
          
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            {/* Basic Info Tab */}
            <TabsContent value="basics" className="space-y-6">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Wedding Details</h2>
                <p className="text-gray-500">Enter basic information about the couple and event</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                {/* Information banner about image uploads */}
                <div className="bg-blue-50 p-4 mb-6 rounded-lg border border-blue-100 flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Image Upload Information</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Selected images will be uploaded only when you submit the form. <strong>Blue &quot;Pending Upload&quot;</strong> indicators show new selections that will be 
                      uploaded when you save, and <strong>green &quot;Uploaded&quot;</strong> indicators show existing images. 
                      There&apos;s no need to reupload existing images unless you want to replace them. After successful upload, all indicators will turn green.
                    </p>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-5 text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-blue-600">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                  Couple Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Groom Information */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Groom&apos;s Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('templateProps.weddingProps.groomFullName', { required: "Groom's name is required" })}
                        className={`w-full p-2 border ${errors.templateProps?.weddingProps?.groomFullName ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-800`}
                        placeholder="Enter groom's full name"
                        aria-label="Groom's Full Name"
                      />
                      {errors.templateProps?.weddingProps?.groomFullName && (
                        <p className="text-xs text-red-500 mt-1">{errors.templateProps.weddingProps.groomFullName.message}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Full legal name</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Groom&apos;s Display Name <span className="text-blue-600 text-xs font-normal">(for invitation)</span>
                      </label>
                      <input
                        type="text"
                        {...register('templateProps.weddingProps.groomNameDisplay')}
                        className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-800"
                        placeholder="How groom's name will display (e.g., John)"
                        aria-label="Groom Name Display"
                      />
                      <p className="text-xs text-gray-500 mt-1">Name as it appears on invitation</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Cover Image 1 <span className="text-blue-600 text-xs font-normal">(background1)</span>
                      </label>
                      <p className="text-xs text-gray-500 mb-1">Max file size: {MAX_FILE_SIZE_MB}MB</p>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          title={`Upload cover image 1 (max ${MAX_FILE_SIZE_MB}MB)`}
                          aria-label="Upload cover image 1"
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors cursor-pointer border border-gray-300 rounded-lg p-1.5"
                          {...register('templateProps.weddingProps.mainImage1')}
                          onChange={(e) => handleImageChange(e, 'mainImage1')}
                          disabled={isSubmitting || uploadingImages['mainImage1']}
                        />
                        {uploadingImages['mainImage1'] && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Loader2 className="h-5 w-5 animate-spin text-blue-700" />
                          </div>
                        )}
                        {fileSelected['mainImage1'] && !uploadingImages['mainImage1'] && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium mr-1">
                              Pending Upload
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                        )}
                        {imageUrls['mainImage1'] && !fileSelected['mainImage1'] && !uploadingImages['mainImage1'] && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium mr-1">
                              Uploaded
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {(imagePreview?.mainImage1 || imageUrls['mainImage1']) && (
                        <div className="mt-2 relative">
                          <SafeImage 
                            loader={customLoader}
                            src={imagePreview?.mainImage1 || imageUrls['mainImage1']} 
                            alt="Preview" 
                            width={150} 
                            height={100}
                            loading="eager"
                            priority={true}
                            onImageError={(error) => {
                              console.log(`Failed to load mainImage1:`, imageUrls['mainImage1'], error);
                            }}
                            className={`h-28 object-cover rounded-md border-2 ${
                              uploadingImages['mainImage1'] ? 'border-yellow-300' :
                              imagePreview?.mainImage1 ? 'border-blue-300' : 'border-green-200'
                            }`} 
                          />
                          
                          {/* Show upload overlay */}
                          {uploadingImages['mainImage1'] && (
                            <div className="absolute inset-0 flex items-center justify-center bg-yellow-100 bg-opacity-60 rounded-md">
                              <div className="flex flex-col items-center bg-white p-2 rounded-md shadow-sm">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-yellow-500"></div>
                                <span className="text-xs font-medium text-yellow-700 mt-1">Uploading...</span>
                              </div>
                            </div>
                          )}
                          
                          {imagePreview?.mainImage1 && !uploadingImages['mainImage1'] && (
                            <div className="mt-1 bg-blue-50 rounded-md p-1 border border-blue-100">
                              <p className="text-xs text-blue-600 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {imageUrls['mainImage1'] ? 
                                  "New image will replace current image on save" : 
                                  "New image selected (will be uploaded on save)"}
                              </p>
                            </div>
                          )}
                          
                          {imageUrls['mainImage1'] && !imagePreview?.mainImage1 && !uploadingImages['mainImage1'] && (
                            <div className="mt-1 bg-green-50 rounded-md p-1 border border-green-100">
                              <p className="text-xs text-green-600 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Current uploaded image (path preserved)
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Right Column - Bride Information */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Bride&apos;s Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('templateProps.weddingProps.brideFullName', { required: "Bride's name is required" })}
                        className={`w-full p-2 border ${errors.templateProps?.weddingProps?.brideFullName ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-800`}
                        placeholder="Enter bride's full name"
                        aria-label="Bride's Full Name"
                      />
                      {errors.templateProps?.weddingProps?.brideFullName && (
                        <p className="text-xs text-red-500 mt-1">{errors.templateProps.weddingProps.brideFullName.message}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Full legal name</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Bride&apos;s Display Name <span className="text-blue-600 text-xs font-normal">(for invitation)</span>
                      </label>
                      <input
                        type="text"
                        {...register('templateProps.weddingProps.brideNameDisplay')}
                        className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-800"
                        placeholder="How bride's name will display (e.g., Jane)"
                        aria-label="Bride Name Display"
                      />
                      <p className="text-xs text-gray-500 mt-1">Name as it appears on invitation</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Cover Image 2 <span className="text-blue-600 text-xs font-normal">(background2)</span>
                      </label>
                      <p className="text-xs text-gray-500 mb-1">Max file size: {MAX_FILE_SIZE_MB}MB</p>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          title={`Upload cover image 2 (max ${MAX_FILE_SIZE_MB}MB)`}
                          aria-label="Upload cover image 2"
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors cursor-pointer border border-gray-300 rounded-lg p-1.5"
                          {...register('templateProps.weddingProps.mainImage2')}
                          onChange={(e) => handleImageChange(e, 'mainImage2')}
                          disabled={isSubmitting || uploadingImages['mainImage2']}
                        />
                        {uploadingImages['mainImage2'] && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Loader2 className="h-5 w-5 animate-spin text-blue-700" />
                          </div>
                        )}
                        {fileSelected['mainImage2'] && !uploadingImages['mainImage2'] && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium mr-1">
                              Pending Upload
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                        )}
                        {imageUrls['mainImage2'] && !fileSelected['mainImage2'] && !uploadingImages['mainImage2'] && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium mr-1">
                              Uploaded
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {(imagePreview?.mainImage2 || imageUrls['mainImage2']) && (
                        <div className="mt-2 relative">
                          <SafeImage 
                            loader={customLoader}
                            src={imagePreview?.mainImage2 || imageUrls['mainImage2']} 
                            alt="Preview" 
                            width={150} 
                            height={100}
                            loading="eager"
                            priority
                            onImageError={(error) => {
                              console.log(`Failed to load mainImage2:`, imageUrls['mainImage2'], error);
                            }}
                            className={`h-28 object-cover rounded-md border-2 ${
                              uploadingImages['mainImage2'] ? 'border-yellow-300' :
                              imagePreview?.mainImage2 ? 'border-blue-300' : 'border-green-200'
                            }`} 
                          />
                          
                          {/* Show upload overlay */}
                          {uploadingImages['mainImage2'] && (
                            <div className="absolute inset-0 flex items-center justify-center bg-yellow-100 bg-opacity-60 rounded-md">
                              <div className="flex flex-col items-center bg-white p-2 rounded-md shadow-sm">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-yellow-500"></div>
                                <span className="text-xs font-medium text-yellow-700 mt-1">Uploading...</span>
                              </div>
                            </div>
                          )}
                          
                          {imagePreview?.mainImage2 && !uploadingImages['mainImage2'] && (
                            <div className="mt-1 bg-blue-50 rounded-md p-1 border border-blue-100">
                              <p className="text-xs text-blue-600 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {imageUrls['mainImage2'] ? 
                                  "New image will replace current image on save" : 
                                  "New image selected (will be uploaded on save)"}
                              </p>
                            </div>
                          )}
                          
                          {imageUrls['mainImage2'] && !imagePreview?.mainImage2 && !uploadingImages['mainImage2'] && (
                            <div className="mt-1 bg-green-50 rounded-md p-1 border border-green-100">
                              <p className="text-xs text-green-600 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Current uploaded image (path preserved)
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Venue & Schedule</h2>
                <p className="text-gray-500">Enter details about the wedding location and timing</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="text-xl font-semibold mb-5 text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-blue-600">
                      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    Venue Information
                  </h4>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Venue Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('templateProps.weddingProps.venueName', { required: "Venue name is required" })}
                        className={`w-full p-3 border ${errors.templateProps?.weddingProps?.venueName ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-800`}
                        placeholder="Wedding venue name"
                      />
                      {errors.templateProps?.weddingProps?.venueName && (
                        <p className="text-xs text-red-500 mt-1">{errors.templateProps.weddingProps.venueName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('templateProps.weddingProps.venueAddress')}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-800"
                        placeholder="Street address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City & State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('templateProps.weddingProps.venueCity')}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-800"
                        placeholder="City, State"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Map Coordinates <span className="text-blue-600 text-xs font-normal">(optional)</span>
                      </label>
                      <input
                        type="text"
                        {...register('templateProps.weddingProps.venueMapCoordinates')}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-800"
                        placeholder="E.g., 40.7128° N, 74.0060° W"
                      />
                      <p className="text-xs text-gray-500 mt-1">For accurate map placement on the invitation</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Parking Information <span className="text-blue-600 text-xs font-normal">(optional)</span>
                      </label>
                      <textarea
                        {...register('templateProps.weddingProps.parkingInfo')}
                        className="w-full min-h-[80px] p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-800"
                        placeholder="Details about parking arrangements..."
                      ></textarea>
                      <p className="text-xs text-gray-500 mt-1">Helpful information about parking for guests</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="text-xl font-semibold mb-5 text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-blue-600">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                    </svg>
                    Schedule
                  </h4>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Wedding Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        {...register('templateProps.weddingProps.date', { required: "Wedding date is required" })}
                        className={`w-full p-3 border ${errors.templateProps?.weddingProps?.date ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-800`}
                      />
                      {errors.templateProps?.weddingProps?.date && (
                        <p className="text-xs text-red-500 mt-1">{errors.templateProps.weddingProps.date.message}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Start Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          {...register('templateProps.weddingProps.timeStart', { required: "Start time is required" })}
                          className={`w-full p-3 border ${errors.templateProps?.weddingProps?.timeStart ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-800`}
                        />
                        {errors.templateProps?.weddingProps?.timeStart && (
                          <p className="text-xs text-red-500 mt-1">{errors.templateProps.weddingProps.timeStart.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          End Time <span className="text-blue-600 text-xs font-normal">(optional)</span>
                        </label>
                        <input
                          type="time"
                          {...register('templateProps.weddingProps.timeEnd')}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-800"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        RSVP Deadline <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        {...register('templateProps.weddingProps.rsvp.deadline', { required: "RSVP deadline is required" })}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-800"
                      />
                      <p className="text-xs text-gray-500 mt-1">Last date for guests to confirm attendance</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Design & Appearance</h2>
                <p className="text-gray-500">Customize colors, themes, and visual elements for your wedding invitation</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-xl font-semibold mb-5 text-gray-800 flex items-center border-b border-gray-200 pb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-blue-600">
                      <path fillRule="evenodd" d="M2.25 4.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875V17.25a4.5 4.5 0 11-9 0V4.125zm4.5 14.25a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" clipRule="evenodd" />
                      <path d="M10.719 21.75h9.156c1.036 0 1.875-.84 1.875-1.875v-5.25c0-1.036-.84-1.875-1.875-1.875h-.14l-8.742 8.743c-.426.425-.66.996-.66 1.597v-1.34a1.125 1.125 0 01.322-.795l8.743-8.742v-1.34c0-.601-.236-1.171-.66-1.595L10.719 7.5c-.424.424-.66.995-.66 1.596v12.654z" />
                    </svg>
                    Color Theme
                  </h4>
                  
                  <div className="space-y-6">
                    {/* Color Selection with Auto-generation */}
                    <div>
                      <h5 className="text-sm font-semibold text-gray-700 mb-4 border-b border-gray-200 pb-2">Color Scheme</h5>
                      <p className="text-xs text-gray-500 mb-4">Select your three main colors. The system will automatically generate lighter and darker shades for each color.</p>
                      
                      <div className="space-y-5">
                        {/* Primary Color */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Primary Color <span className="text-blue-600 text-xs font-normal">(main theme color)</span>
                          </label>
                          <div className="flex items-center space-x-3">
                            <input
                              type="color"
                              {...register('templateProps.weddingProps.weddingMotif.primaryColor')}
                              defaultValue="#5A86AD"
                              className="h-10 w-10 rounded-md border border-gray-300 cursor-pointer"
                              onChange={(e) => {
                                const variations = generateColorVariations(e.target.value);
                                methods.setValue('templateProps.weddingProps.weddingMotif.primaryColor', e.target.value);
                                methods.setValue('templateProps.weddingProps.theme.primary-color', e.target.value);
                                methods.setValue('templateProps.weddingProps.theme.primary-color-light', variations.light);
                                methods.setValue('templateProps.weddingProps.theme.primary-color-lighter', variations.lighter);
                                methods.setValue('templateProps.weddingProps.theme.primary-color-dark', variations.dark);
                                methods.setValue('templateProps.weddingProps.theme.primary-color-rgb', variations.rgb);
                              }}
                            />
                            <div className="flex-1">
                              <input
                                type="text"
                                {...register('templateProps.weddingProps.weddingMotif.primaryColor')}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="#5A86AD"
                                onChange={(e) => {
                                  if(/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                                    const variations = generateColorVariations(e.target.value);
                                    methods.setValue('templateProps.weddingProps.weddingMotif.primaryColor', e.target.value);
                                    methods.setValue('templateProps.weddingProps.theme.primary-color', e.target.value);
                                    methods.setValue('templateProps.weddingProps.theme.primary-color-light', variations.light);
                                    methods.setValue('templateProps.weddingProps.theme.primary-color-lighter', variations.lighter);
                                    methods.setValue('templateProps.weddingProps.theme.primary-color-dark', variations.dark);
                                    methods.setValue('templateProps.weddingProps.theme.primary-color-rgb', variations.rgb);
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex mt-2">
                            <div className="h-4 flex-1 rounded-l-sm" style={{backgroundColor: methods.watch('templateProps.weddingProps.theme.primary-color-dark') || '#3A5B7A'}}></div>
                            <div className="h-4 flex-1" style={{backgroundColor: methods.watch('templateProps.weddingProps.weddingMotif.primaryColor') || '#5A86AD'}}></div>
                            <div className="h-4 flex-1" style={{backgroundColor: methods.watch('templateProps.weddingProps.theme.primary-color-light') || '#7EA0C1'}}></div>
                            <div className="h-4 flex-1 rounded-r-sm" style={{backgroundColor: methods.watch('templateProps.weddingProps.theme.primary-color-lighter') || '#C6D4E1'}}></div>
                          </div>
                        </div>
                        
                        {/* Secondary Color */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Secondary Color <span className="text-blue-600 text-xs font-normal">(complementary color)</span>
                          </label>
                          <div className="flex items-center space-x-3">
                            <input
                              type="color"
                              {...register('templateProps.weddingProps.weddingMotif.secondaryColor')}
                              defaultValue="#C08081"
                              className="h-10 w-10 rounded-md border border-gray-300 cursor-pointer"
                              onChange={(e) => {
                                const variations = generateColorVariations(e.target.value);
                                methods.setValue('templateProps.weddingProps.weddingMotif.secondaryColor', e.target.value);
                                methods.setValue('templateProps.weddingProps.theme.secondary-color', e.target.value);
                                methods.setValue('templateProps.weddingProps.theme.secondary-color-light', variations.light);
                                methods.setValue('templateProps.weddingProps.theme.secondary-color-lighter', variations.lighter);
                                methods.setValue('templateProps.weddingProps.theme.secondary-color-dark', variations.dark);
                                methods.setValue('templateProps.weddingProps.theme.secondary-color-rgb', variations.rgb);
                              }}
                            />
                            <div className="flex-1">
                              <input
                                type="text"
                                {...register('templateProps.weddingProps.weddingMotif.secondaryColor')}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="#C08081"
                                onChange={(e) => {
                                  if(/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                                    const variations = generateColorVariations(e.target.value);
                                    methods.setValue('templateProps.weddingProps.weddingMotif.secondaryColor', e.target.value);
                                    methods.setValue('templateProps.weddingProps.theme.secondary-color', e.target.value);
                                    methods.setValue('templateProps.weddingProps.theme.secondary-color-light', variations.light);
                                    methods.setValue('templateProps.weddingProps.theme.secondary-color-lighter', variations.lighter);
                                    methods.setValue('templateProps.weddingProps.theme.secondary-color-dark', variations.dark);
                                    methods.setValue('templateProps.weddingProps.theme.secondary-color-rgb', variations.rgb);
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex mt-2">
                            <div className="h-4 flex-1 rounded-l-sm" style={{backgroundColor: methods.watch('templateProps.weddingProps.theme.secondary-color-dark') || '#9A6566'}}></div>
                            <div className="h-4 flex-1" style={{backgroundColor: methods.watch('templateProps.weddingProps.weddingMotif.secondaryColor') || '#C08081'}}></div>
                            <div className="h-4 flex-1" style={{backgroundColor: methods.watch('templateProps.weddingProps.theme.secondary-color-light') || '#D6ACAD'}}></div>
                            <div className="h-4 flex-1 rounded-r-sm" style={{backgroundColor: methods.watch('templateProps.weddingProps.theme.secondary-color-lighter') || '#EBD4D4'}}></div>
                          </div>
                        </div>
                        
                        {/* Accent Color */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Accent Color <span className="text-blue-600 text-xs font-normal">(highlight color)</span>
                          </label>
                          <div className="flex items-center space-x-3">
                            <input
                              type="color"
                              {...register('templateProps.weddingProps.weddingMotif.accentColor')}
                              defaultValue="#F5F2ED"
                              className="h-10 w-10 rounded-md border border-gray-300 cursor-pointer"
                              onChange={(e) => {
                                const variations = generateColorVariations(e.target.value);
                                methods.setValue('templateProps.weddingProps.weddingMotif.accentColor', e.target.value);
                                methods.setValue('templateProps.weddingProps.theme.accent-color', e.target.value);
                                methods.setValue('templateProps.weddingProps.theme.accent-color-light', variations.light);
                                methods.setValue('templateProps.weddingProps.theme.accent-color-dark', variations.dark);
                                methods.setValue('templateProps.weddingProps.theme.accent-color-rgb', variations.rgb);
                              }}
                            />
                            <div className="flex-1">
                              <input
                                type="text"
                                {...register('templateProps.weddingProps.weddingMotif.accentColor')}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="#F5F2ED"
                                onChange={(e) => {
                                  if(/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                                    const variations = generateColorVariations(e.target.value);
                                    methods.setValue('templateProps.weddingProps.weddingMotif.accentColor', e.target.value);
                                    methods.setValue('templateProps.weddingProps.theme.accent-color', e.target.value);
                                    methods.setValue('templateProps.weddingProps.theme.accent-color-light', variations.light);
                                    methods.setValue('templateProps.weddingProps.theme.accent-color-dark', variations.dark);
                                    methods.setValue('templateProps.weddingProps.theme.accent-color-rgb', variations.rgb);
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex mt-2">
                            <div className="h-4 flex-1 rounded-l-sm" style={{backgroundColor: methods.watch('templateProps.weddingProps.theme.accent-color-dark') || '#E5E0D8'}}></div>
                            <div className="h-4 flex-1" style={{backgroundColor: methods.watch('templateProps.weddingProps.weddingMotif.accentColor') || '#F5F2ED'}}></div>
                            <div className="h-4 flex-1 rounded-r-sm" style={{backgroundColor: methods.watch('templateProps.weddingProps.theme.accent-color-light') || '#FFFFFF'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-xl font-semibold mb-4 text-gray-800 flex items-center border-b border-gray-200 pb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-purple-600">
                      <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
                    </svg>
                    Wedding Motif
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Theme Name
                      </label>
                      <input
                        type="text"
                        {...register('templateProps.weddingProps.weddingMotif.theme')}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Traditional Elegance"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        {...register('templateProps.weddingProps.weddingMotif.description')}
                        className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md"
                        placeholder="Describe your wedding theme or motif..."
                      ></textarea>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Primary Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            {...register('templateProps.weddingProps.weddingMotif.primaryColor')}
                            className="h-10 w-12 rounded-md border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            {...register('templateProps.weddingProps.weddingMotif.primaryColor')}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="#5A86AD"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Secondary Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            {...register('templateProps.weddingProps.weddingMotif.secondaryColor')}
                            className="h-10 w-12 rounded-md border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            {...register('templateProps.weddingProps.weddingMotif.secondaryColor')}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="#C08081"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Accent Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            {...register('templateProps.weddingProps.weddingMotif.accentColor')}
                            className="h-10 w-12 rounded-md border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            {...register('templateProps.weddingProps.weddingMotif.accentColor')}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="#F5F2ED"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Dress Code Section */}
              <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-xl font-semibold mb-5 text-gray-800 flex items-center border-b border-gray-200 pb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-purple-600">
                    <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z" clipRule="evenodd" />
                  </svg>
                  Dress Code
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Men&apos;s Attire
                    </label>
                    <textarea
                      {...register('templateProps.weddingProps.dressCode.men')}
                      className="w-full min-h-[80px] p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Attire suggestions for men..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Women&apos;s Attire
                    </label>
                    <textarea
                      {...register('templateProps.weddingProps.dressCode.women')}
                      className="w-full min-h-[80px] p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Attire suggestions for women..."
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-5 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      General Guidelines
                    </label>
                    <textarea
                      {...register('templateProps.weddingProps.dressCode.generalGuidelines')}
                      className="w-full min-h-[80px] p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="General dress code guidelines..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Additional Notes
                    </label>
                    <textarea
                      {...register('templateProps.weddingProps.dressCode.additionalNotes')}
                      className="w-full min-h-[80px] p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Any additional notes about attire..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="messages" className="space-y-6">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Messages & Story</h2>
                <p className="text-gray-500">Add welcome messages, your story, and other text content for your invitation</p>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="text-xl font-semibold mb-5 text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-blue-600">
                    <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-7.152.52c-2.43 0-4.817-.178-7.152-.52C2.87 16.438 1.5 14.706 1.5 12.76V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
                    <path d="M19.812 17.99l-3.853-3.853v-1.385c0-.563.232-1.082.61-1.459l3.853-3.853a.75.75 0 011.118.998l-3.903 3.903v1.499l3.903 3.903a.744.744 0 01-.56 1.247.749.749 0 01-.55-.247z" />
                  </svg>
                  Invitation Messages
                </h4>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Welcome Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register('templateProps.weddingProps.messages.messageWelcome')}
                      className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-800"
                      placeholder="Welcome message for your guests..."
                      defaultValue="We are excited to celebrate our special day with you."
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">This message will be displayed prominently on the invitation</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tagline <span className="text-blue-600 text-xs font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      {...register('templateProps.weddingProps.messages.messageTagline')}
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-800"
                      placeholder="A short, memorable phrase (e.g., 'Forever Begins Today')"
                    />
                    <p className="text-xs text-gray-500 mt-1">A brief tagline or phrase that captures the spirit of your wedding</p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Our Story <span className="text-blue-600 text-xs font-normal">(optional)</span>
                    </label>
                    <textarea
                      {...register('templateProps.weddingProps.messages.messageStory')}
                      className="w-full min-h-[200px] p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-800"
                      placeholder="Share your love story with your guests..."
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">Tell your guests about how you met, your journey together, and what led to this special day</p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Story Images <span className="text-blue-600 text-xs font-normal">(optional)</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Image 1 <span className="text-blue-600 text-xs font-normal">(story image)</span>
                        </label>
                        <p className="text-xs text-gray-500 mb-1">Max file size: {MAX_FILE_SIZE_MB}MB</p>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            title={`Upload story image 1 (max ${MAX_FILE_SIZE_MB}MB)`}
                            aria-label="Upload story image 1"
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors cursor-pointer border border-gray-300 rounded-lg p-1.5"
                            id="storyImage1"
                            onChange={(e) => handleImageChange(e, 'storyImage1')}
                            disabled={isSubmitting || uploadingImages['storyImage1']}
                          />
                          {uploadingImages['storyImage1'] && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <Loader2 className="h-5 w-5 animate-spin text-blue-700" />
                            </div>
                          )}
                          {fileSelected['storyImage1'] && !uploadingImages['storyImage1'] && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium mr-1">
                                Pending Upload
                              </span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                          )}
                          {imageUrls['storyImage1'] && !fileSelected['storyImage1'] && !uploadingImages['storyImage1'] && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium mr-1">
                                Uploaded
                              </span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        {(imagePreview?.storyImage1 || imageUrls['storyImage1']) && (
                          <div className="mt-2 relative">
                            <SafeImage 
                              loader={customLoader}
                              src={imagePreview?.storyImage1 || imageUrls['storyImage1']} 
                              alt="Story Image 1 Preview" 
                              width={150} 
                              height={100}
                              loading="eager"
                              priority={true}
                              onImageError={(error) => {
                                console.log(`Failed to load storyImage1:`, imageUrls['storyImage1'], error);
                              }}
                              className={`h-28 object-cover rounded-md border-2 ${
                                uploadingImages['storyImage1'] ? 'border-yellow-300' :
                                imagePreview?.storyImage1 ? 'border-blue-300' : 'border-green-200'
                              }`} 
                            />
                            
                            {/* Show upload overlay */}
                            {uploadingImages['storyImage1'] && (
                              <div className="absolute inset-0 flex items-center justify-center bg-yellow-100 bg-opacity-60 rounded-md">
                                <div className="flex flex-col items-center bg-white p-2 rounded-md shadow-sm">
                                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-yellow-500"></div>
                                  <span className="text-xs font-medium text-yellow-700 mt-1">Uploading...</span>
                                </div>
                              </div>
                            )}
                            
                            {imagePreview?.storyImage1 && !uploadingImages['storyImage1'] && (
                              <div className="mt-1 bg-blue-50 rounded-md p-1 border border-blue-100">
                                <p className="text-xs text-blue-600 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {imageUrls['storyImage1'] ? 
                                    "New image will replace current image on save" : 
                                    "New image selected (will be uploaded on save)"}
                                </p>
                              </div>
                            )}
                            
                            {imageUrls['storyImage1'] && !imagePreview?.storyImage1 && !uploadingImages['storyImage1'] && (
                              <div className="mt-1 bg-green-50 rounded-md p-1 border border-green-100">
                                <p className="text-xs text-green-600 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Current uploaded image (path preserved)
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Image 2 <span className="text-blue-600 text-xs font-normal">(story image)</span>
                        </label>
                        <p className="text-xs text-gray-500 mb-1">Max file size: {MAX_FILE_SIZE_MB}MB</p>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            title={`Upload story image 2 (max ${MAX_FILE_SIZE_MB}MB)`}
                            aria-label="Upload story image 2"
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors cursor-pointer border border-gray-300 rounded-lg p-1.5"
                            id="storyImage2"
                            onChange={(e) => handleImageChange(e, 'storyImage2')}
                            disabled={isSubmitting || uploadingImages['storyImage2']}
                          />
                          {uploadingImages['storyImage2'] && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <Loader2 className="h-5 w-5 animate-spin text-blue-700" />
                            </div>
                          )}
                          {fileSelected['storyImage2'] && !uploadingImages['storyImage2'] && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium mr-1">
                                Pending Upload
                              </span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                          )}
                          {imageUrls['storyImage2'] && !fileSelected['storyImage2'] && !uploadingImages['storyImage2'] && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium mr-1">
                                Uploaded
                              </span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        {(imagePreview?.storyImage2 || imageUrls['storyImage2']) && (
                          <div className="mt-2 relative">
                            <SafeImage 
                              loader={customLoader}
                              src={imagePreview?.storyImage2 || imageUrls['storyImage2']} 
                              alt="Story Image 2 Preview" 
                              width={150} 
                              height={100}
                              loading="eager"
                              priority={true}
                              onImageError={(error) => {
                                console.log(`Failed to load storyImage2:`, imageUrls['storyImage2'], error);
                              }}
                              className={`h-28 object-cover rounded-md border-2 ${
                                uploadingImages['storyImage2'] ? 'border-yellow-300' :
                                imagePreview?.storyImage2 ? 'border-blue-300' : 'border-green-200'
                              }`} 
                            />
                            
                            {/* Show upload overlay */}
                            {uploadingImages['storyImage2'] && (
                              <div className="absolute inset-0 flex items-center justify-center bg-yellow-100 bg-opacity-60 rounded-md">
                                <div className="flex flex-col items-center bg-white p-2 rounded-md shadow-sm">
                                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-yellow-500"></div>
                                  <span className="text-xs font-medium text-yellow-700 mt-1">Uploading...</span>
                                </div>
                              </div>
                            )}
                            
                            {imagePreview?.storyImage2 && !uploadingImages['storyImage2'] && (
                              <div className="mt-1 bg-blue-50 rounded-md p-1 border border-blue-100">
                                <p className="text-xs text-blue-600 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {imageUrls['storyImage2'] ? 
                                    "New image will replace current image on save" : 
                                    "New image selected (will be uploaded on save)"}
                                </p>
                              </div>
                            )}
                            
                            {imageUrls['storyImage2'] && !imagePreview?.storyImage2 && !uploadingImages['storyImage2'] && (
                              <div className="mt-1 bg-green-50 rounded-md p-1 border border-green-100">
                                <p className="text-xs text-green-600 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Current uploaded image (path preserved)
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="entourage" className="space-y-6">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Wedding Party</h2>
                <p className="text-gray-500">Add details about your wedding party, family members, and other participants</p>
              </div>
              
              {/* Officiant */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-xl font-semibold mb-5 text-gray-800 flex items-center border-b border-gray-200 pb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-blue-600">
                    <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                    <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                  </svg>
                  Officiant
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('templateProps.weddingProps.entourage.officiant.name')}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Officiant's name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Title <span className="text-blue-600 text-xs font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      {...register('templateProps.weddingProps.entourage.officiant.title')}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="E.g., Reverend, Father, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Organization <span className="text-blue-600 text-xs font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      {...register('templateProps.weddingProps.entourage.officiant.organization')}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Church or organization name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Description <span className="text-blue-600 text-xs font-normal">(optional)</span>
                    </label>
                    <textarea
                      {...register('templateProps.weddingProps.entourage.officiant.description')}
                      className="w-full min-h-[80px] p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Brief description"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Parents Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                {/* Groom's Parents */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-5 border-b border-gray-200 pb-3">
                    <h4 className="text-xl font-semibold text-gray-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-blue-600">
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      </svg>
                      Groom&apos;s Parents
                    </h4>
                    <button
                      type="button"
                      onClick={() => groomParentsFields.append({ name: '', relation: '' })}
                      className="flex items-center text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 py-2 px-3 rounded-md transition-colors"
                      title="Add groom's parent"
                    >
                      <PlusCircle className="w-4 h-4 mr-1" />
                      Add
                    </button>
                  </div>
                  
                  {groomParentsFields.fields.map((field, index) => (
                    <div key={field.id} className="p-3 border border-gray-200 rounded-md mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Parent {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => groomParentsFields.remove(index)}
                          className="text-red-500 hover:text-red-700"
                          title="Remove parent"
                          aria-label={`Remove groom's parent ${index + 1}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            {...register(`templateProps.weddingProps.entourage.parents.groom.${index}.name`)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Parent's name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Relation
                          </label>
                          <input
                            type="text"
                            {...register(`templateProps.weddingProps.entourage.parents.groom.${index}.relation`)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Mother/Father/Guardian"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {groomParentsFields.fields.length === 0 && (
                    <button
                      type="button"
                      onClick={() => groomParentsFields.append({ name: '', relation: '' })}
                      className="w-full p-3 border border-dashed border-gray-300 rounded-md text-center text-gray-500 hover:text-gray-700 hover:border-gray-400"
                    >
                      + Add Groom&apos;s Parent
                    </button>
                  )}
                </div>
                {/* Bride's Parents */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-5 border-b border-gray-200 pb-3">
                    <h4 className="text-xl font-semibold text-gray-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-pink-500">
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      </svg>
                      Bride&apos;s Parents
                    </h4>
                    <button
                      type="button"
                      onClick={() => brideParentsFields.append({ name: '', relation: '' })}
                      className="flex items-center text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 py-2 px-3 rounded-md transition-colors"
                      title="Add bride's parent"
                    >
                      <PlusCircle className="w-4 h-4 mr-1" />
                      Add
                    </button>
                  </div>
                  
                  {brideParentsFields.fields.map((field, index) => (
                    <div key={field.id} className="p-3 border border-gray-200 rounded-md mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Parent {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => brideParentsFields.remove(index)}
                          className="text-red-500 hover:text-red-700"
                          title="Remove parent"
                          aria-label={`Remove bride's parent ${index + 1}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            {...register(`templateProps.weddingProps.entourage.parents.bride.${index}.name`)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Parent's name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Relation
                          </label>
                          <input
                            type="text"
                            {...register(`templateProps.weddingProps.entourage.parents.bride.${index}.relation`)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Mother/Father/Guardian"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {brideParentsFields.fields.length === 0 && (
                    <button
                      type="button"
                      onClick={() => brideParentsFields.append({ name: '', relation: '' })}
                      className="w-full p-3 border border-dashed border-gray-300 rounded-md text-center text-gray-500 hover:text-gray-700 hover:border-gray-400"
                    >
                      + Add Bride&apos;s Parent
                    </button>
                  )}
                </div>
              </div>
              
              {/* Principal Sponsors */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-5 border-b border-gray-200 pb-3">
                  <h4 className="text-xl font-semibold text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-blue-600">
                      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                    </svg>
                    Principal Sponsors (Pairs)
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      menSponsorsFields.append({ name: '', relation: '' });
                      womenSponsorsFields.append({ name: '', relation: '' });
                    }}
                    className="flex items-center text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 py-2 px-3 rounded-md transition-colors"
                    title="Add sponsor pair"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Add Sponsor Pair
                  </button>
                </div>
                
                {/* Sponsor Pairs */}
                {Array.from({ length: Math.max(menSponsorsFields.fields.length, womenSponsorsFields.fields.length) }).map((_, index) => (
                  <div key={`pair-${index}`} className="p-3 border border-gray-200 rounded-md mb-3">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium">Principal Sponsor Pair {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          menSponsorsFields.remove(index);
                          womenSponsorsFields.remove(index);
                        }}
                        className="text-red-500 hover:text-red-700"
                        title="Remove sponsor pair"
                        aria-label={`Remove principal sponsor pair ${index + 1}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Male Sponsor (Ninong) */}
                      <div className="border border-gray-200 rounded-md p-3 bg-white">
                        <h6 className="text-sm font-medium text-gray-700 mb-3">Male Sponsor (Ninong)</h6>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              {...register(`templateProps.weddingProps.entourage.principalSponsors.men.${index}.name`, 
                                { value: menSponsorsFields.fields[index]?.name || '' })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="Male sponsor's name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Relation
                            </label>
                            <input
                              type="text"
                              {...register(`templateProps.weddingProps.entourage.principalSponsors.men.${index}.relation`, 
                                { value: menSponsorsFields.fields[index]?.relation || '' })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="Relation to couple"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Female Sponsor (Ninang) */}
                      <div className="border border-gray-200 rounded-md p-3 bg-white">
                        <h6 className="text-sm font-medium text-gray-700 mb-3">Female Sponsor (Ninang)</h6>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              {...register(`templateProps.weddingProps.entourage.principalSponsors.women.${index}.name`, 
                                { value: womenSponsorsFields.fields[index]?.name || '' })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="Female sponsor's name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Relation
                            </label>
                            <input
                              type="text"
                              {...register(`templateProps.weddingProps.entourage.principalSponsors.women.${index}.relation`, 
                                { value: womenSponsorsFields.fields[index]?.relation || '' })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="Relation to couple"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {menSponsorsFields.fields.length === 0 && womenSponsorsFields.fields.length === 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      menSponsorsFields.append({ name: '', relation: '' });
                      womenSponsorsFields.append({ name: '', relation: '' });
                    }}
                    className="w-full p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
                  >
                    <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Add Principal Sponsor Pair
                    </span>
                  </button>
                )}
              </div>
              
              {/* Best Man & Maid of Honor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-xl font-semibold mb-5 text-gray-800 flex items-center border-b border-gray-200 pb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-blue-600">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                    Best Man
                  </h4>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Name
                      </label>
                      <input
                        type="text"
                        {...register('templateProps.weddingProps.entourage.bestMan.name')}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Best man's name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Relation
                      </label>
                      <input
                        type="text"
                        {...register('templateProps.weddingProps.entourage.bestMan.relation')}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Relation to groom"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-xl font-semibold mb-5 text-gray-800 flex items-center border-b border-gray-200 pb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-pink-500">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                    Maid of Honor
                  </h4>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Name
                      </label>
                      <input
                        type="text"
                        {...register('templateProps.weddingProps.entourage.maidOfHonor.name')}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Maid of honor's name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Relation
                      </label>
                      <input
                        type="text"
                        {...register('templateProps.weddingProps.entourage.maidOfHonor.relation')}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Relation to bride"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bridesmaids & Groomsmen as Pairs */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-5 border-b border-gray-200 pb-3">
                  <h4 className="text-xl font-semibold text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-purple-600">
                      <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                      <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                    </svg>
                    Bridal Party Pairs
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      bridalPartyFields.append({ name: '', role: '', relation: '' });
                      groomsmenFields.append({ name: '', role: '', relation: '' });
                    }}
                    className="flex items-center text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 py-2 px-3 rounded-md transition-colors"
                    title="Add pair"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Add Pair
                  </button>
                </div>
                
                {Array.from({ length: Math.max(bridalPartyFields.fields.length, groomsmenFields.fields.length) }).map((_, index) => (
                  <div key={`pair-${index}`} className="p-4 border border-gray-200 rounded-lg mb-4 bg-gray-50/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
                      <span className="text-sm font-medium flex items-center text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-1.5 text-purple-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        Bridal Party Pair {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          bridalPartyFields.remove(index);
                          groomsmenFields.remove(index);
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors flex items-center"
                        title="Remove pair"
                        aria-label={`Remove bridal party pair ${index + 1}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Bridesmaid */}
                      <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                        <h6 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5 text-pink-500">
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                          </svg>
                          Bridesmaid
                        </h6>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Name
                            </label>
                            <input
                              type="text"
                              {...register(`templateProps.weddingProps.entourage.bridalParty.${index}.name`, 
                                { value: bridalPartyFields.fields[index]?.name || '' })}
                              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Bridesmaid's name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Role
                            </label>
                            <input
                              type="text"
                              {...register(`templateProps.weddingProps.entourage.bridalParty.${index}.role`, 
                                { value: bridalPartyFields.fields[index]?.role || '' })}
                              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="E.g., Bridesmaid, Maid of Honor"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Relation
                            </label>
                            <input
                              type="text"
                              {...register(`templateProps.weddingProps.entourage.bridalParty.${index}.relation`, 
                                { value: bridalPartyFields.fields[index]?.relation || '' })}
                              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Relation to bride"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Groomsman */}
                      <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                        <h6 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5 text-blue-500">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                          </svg>
                          Groomsman
                        </h6>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Name
                            </label>
                            <input
                              type="text"
                              {...register(`templateProps.weddingProps.entourage.groomsmen.${index}.name`, 
                                { value: groomsmenFields.fields[index]?.name || '' })}
                              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Groomsman's name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Role
                            </label>
                            <input
                              type="text"
                              {...register(`templateProps.weddingProps.entourage.groomsmen.${index}.role`, 
                                { value: groomsmenFields.fields[index]?.role || '' })}
                              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="E.g., Groomsman, Best Man"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Relation
                            </label>
                            <input
                              type="text"
                              {...register(`templateProps.weddingProps.entourage.groomsmen.${index}.relation`, 
                                { value: groomsmenFields.fields[index]?.relation || '' })}
                              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Relation to groom"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {bridalPartyFields.fields.length === 0 && groomsmenFields.fields.length === 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      bridalPartyFields.append({ name: '', role: '', relation: '' });
                      groomsmenFields.append({ name: '', role: '', relation: '' });
                    }}
                    className="w-full p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
                  >
                    <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Add Bridal Party Pair
                    </span>
                  </button>
                )}
              </div>

              {/* Secondary Sponsors */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center border-b border-gray-200 pb-3 mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-blue-600">
                    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-gray-800">Secondary Sponsors</h4>
                </div>
                
                {/* Candle Sponsors */}
                <div className="mb-6 mt-8">
                  <div className="flex items-center mb-4">
                    <h5 className="text-base font-medium text-gray-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-amber-500">
                        <rect x="10" y="7" width="4" height="10" rx="1" fill="currentColor" />
                        <rect x="9" y="17" width="6" height="2" rx="1" fill="currentColor" opacity="0.7" />
                        <path d="M12 4.5c.828 0 1.5 1.12 1.5 2.5S12.828 9.5 12 9.5s-1.5-1.12-1.5-2.5S11.172 4.5 12 4.5z" fill="#FBBF24" />
                        <path d="M12 3c.3 0 .5.2.5.5V5a.5.5 0 01-1 0V3.5c0-.3.2-.5.5-.5z" fill="#F59E42" />
                        </svg>
                      Candle Sponsors (Pair)
                    </h5>
                  </div>
                  
                  {/* We'll group them in pairs */}
                  {Array.from({ length: Math.ceil(candleSponsorsFields.fields.length / 2) }).map((_, pairIndex) => {
                    const firstIndex = pairIndex * 2;
                    const secondIndex = firstIndex + 1;
                    const hasSecond = secondIndex < candleSponsorsFields.fields.length;
                    
                    return (
                      <div key={`candle-pair-${pairIndex}`} className="p-4 border border-gray-200 rounded-lg mb-3 bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                          <span className="text-sm font-medium text-gray-700 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5 text-amber-500">
                              <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 01.82.311l5.228 7.917a.75.75 0 01-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 01-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 01-1.247-.606l.569-9.47a.75.75 0 01.554-.68zM3 10.5a.75.75 0 01.75-.75H6a.75.75 0 010 1.5H3.75A.75.75 0 013 10.5zm14.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H18a.75.75 0 01-.75-.75zm-8.962 3.712a.75.75 0 010 1.061l-1.591 1.591a.75.75 0 11-1.061-1.06l1.591-1.592a.75.75 0 011.06 0z" clipRule="evenodd" />
                            </svg>
                            Candle Sponsor Pair {pairIndex + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              // Remove both sponsors in the pair
                              candleSponsorsFields.remove(firstIndex);
                              if (hasSecond) candleSponsorsFields.remove(firstIndex); // After first removal, second becomes first
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors flex items-center"
                            title="Remove candle sponsor pair"
                            aria-label={`Remove candle sponsor pair ${pairIndex + 1}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            Remove
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* First Sponsor */}
                          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow transition-shadow">
                            <h6 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5 text-blue-500">
                                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                              </svg>
                              Sponsor 1
                            </h6>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                  Name
                                </label>
                                <input
                                  type="text"
                                  {...register(`templateProps.weddingProps.entourage.secondarySponsors.candle.${firstIndex}.name`)}
                                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-100 focus:border-amber-400 transition-colors"
                                  placeholder="Sponsor's name"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                  Relation
                                </label>
                                <input
                                  type="text"
                                  {...register(`templateProps.weddingProps.entourage.secondarySponsors.candle.${firstIndex}.relation`)}
                                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-100 focus:border-amber-400 transition-colors"
                                  placeholder="Relation to couple"
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Second Sponsor */}
                          <div className={`border border-gray-200 rounded-lg p-4 bg-white shadow-sm ${hasSecond ? 'hover:shadow' : 'opacity-75'} transition-all`}>
                            <h6 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5 text-pink-500">
                                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                              </svg>
                              Sponsor 2
                            </h6>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                  Name
                                </label>
                                <input
                                  type="text"
                                  {...register(`templateProps.weddingProps.entourage.secondarySponsors.candle.${secondIndex}.name`)}
                                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-100 focus:border-amber-400 transition-colors"
                                  placeholder="Sponsor's name"
                                  disabled={!hasSecond}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                  Relation
                                </label>
                                <input
                                  type="text"
                                  {...register(`templateProps.weddingProps.entourage.secondarySponsors.candle.${secondIndex}.relation`)}
                                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-100 focus:border-amber-400 transition-colors"
                                  placeholder="Relation to couple"
                                  disabled={!hasSecond}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {candleSponsorsFields.fields.length === 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        candleSponsorsFields.append([
                          { name: '', relation: '' },
                          { name: '', relation: '' }
                        ]);
                      }}
                      className="w-full p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-600 hover:text-gray-800 hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Add Candle Sponsor Pair
                    </button>
                  )}
                </div>
                
                {/* Veil Sponsors */}
                <div className="mb-6 mt-8">
                  <div className="flex items-center mb-4">
                    <h5 className="text-base font-medium text-gray-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-indigo-500">
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      </svg>
                      Veil Sponsors (Pair)
                    </h5>
                  </div>
                  
                  {/* We'll group them in pairs */}
                  {Array.from({ length: Math.ceil(veilSponsorsFields.fields.length / 2) }).map((_, pairIndex) => {
                    const firstIndex = pairIndex * 2;
                    const secondIndex = firstIndex + 1;
                    const hasSecond = secondIndex < veilSponsorsFields.fields.length;
                    
                    return (
                      <div key={`veil-pair-${pairIndex}`} className="p-4 border border-gray-200 rounded-lg mb-3 bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                          <span className="text-sm font-medium text-gray-700 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5 text-purple-500">
                              <path fillRule="evenodd" d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.03l5.31 5.31a.75.75 0 01-1.03 1.09L12.5 9.436l-4.47 4.47a.75.75 0 01-1.06-1.06l5.31-5.31a.75.75 0 01.03-.03z" clipRule="evenodd" />
                              <path d="M4.902 12.098a3.75 3.75 0 005.304 0l4.5-4.5a3.75 3.75 0 10-5.304-5.304l.97-.97a.75.75 0 011.06 1.06l-.97.97a2.25 2.25 0 013.184 3.184l-4.5 4.5a2.25 2.25 0 01-3.184 0 .75.75 0 00-1.06 1.06z" />
                            </svg>
                            Veil Sponsor Pair {pairIndex + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              // Remove both sponsors in the pair
                              veilSponsorsFields.remove(firstIndex);
                              if (hasSecond) veilSponsorsFields.remove(firstIndex); // After first removal, second becomes first
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors flex items-center"
                            title="Remove veil sponsor pair"
                            aria-label={`Remove veil sponsor pair ${pairIndex + 1}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            Remove
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* First Sponsor */}
                          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow transition-shadow">
                            <h6 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5 text-blue-500">
                                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                              </svg>
                              Sponsor 1
                            </h6>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                  Name
                                </label>
                                <input
                                  type="text"
                                  {...register(`templateProps.weddingProps.entourage.secondarySponsors.veil.${firstIndex}.name`)}
                                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-colors"
                                  placeholder="Sponsor's name"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                  Relation
                                </label>
                                <input
                                  type="text"
                                  {...register(`templateProps.weddingProps.entourage.secondarySponsors.veil.${firstIndex}.relation`)}
                                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-colors"
                                  placeholder="Relation to couple"
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Second Sponsor */}
                          <div className={`border border-gray-200 rounded-lg p-4 bg-white shadow-sm ${hasSecond ? 'hover:shadow' : 'opacity-75'} transition-all`}>
                            <h6 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5 text-pink-500">
                                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                              </svg>
                              Sponsor 2
                            </h6>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                  Name
                                </label>
                                <input
                                  type="text"
                                  {...register(`templateProps.weddingProps.entourage.secondarySponsors.veil.${secondIndex}.name`)}
                                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-colors"
                                  placeholder="Sponsor's name"
                                  disabled={!hasSecond}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                  Relation
                                </label>
                                <input
                                  type="text"
                                  {...register(`templateProps.weddingProps.entourage.secondarySponsors.veil.${secondIndex}.relation`)}
                                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-colors"
                                  placeholder="Relation to couple"
                                  disabled={!hasSecond}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {veilSponsorsFields.fields.length === 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        veilSponsorsFields.append([
                          { name: '', relation: '' },
                          { name: '', relation: '' }
                        ]);
                      }}
                      className="w-full p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-600 hover:text-gray-800 hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Add Veil Sponsor Pair
                    </button>
                  )}
                </div>
                
                {/* Cord Sponsors */}
                <div className="mb-6 mt-8">
                  <div className="flex items-center mb-4">
                    <h5 className="text-base font-medium text-gray-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-amber-500">
                        <path fillRule="evenodd" d="M15 3.75a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0V5.56l-3.97 3.97a.75.75 0 11-1.06-1.06l3.97-3.97h-2.69a.75.75 0 01-.75-.75zm-12 0A.75.75 0 013.75 3h4.5a.75.75 0 010 1.5H5.56l3.97 3.97a.75.75 0 01-1.06 1.06L4.5 5.56v2.69a.75.75 0 01-1.5 0v-4.5zm11.47 11.78a.75.75 0 111.06-1.06l3.97 3.97v-2.69a.75.75 0 011.5 0v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 010-1.5h2.69l-3.97-3.97zm-4.94-1.06a.75.75 0 010 1.06L5.56 19.5h2.69a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75v-4.5a.75.75 0 011.5 0v2.69l3.97-3.97a.75.75 0 011.06 0z" clipRule="evenodd" />
                      </svg>
                      Cord Sponsors (Pair)
                    </h5>
                  </div>
                  
                  {/* We'll group them in pairs */}
                  {Array.from({ length: Math.ceil(cordSponsorsFields.fields.length / 2) }).map((_, pairIndex) => {
                    const firstIndex = pairIndex * 2;
                    const secondIndex = firstIndex + 1;
                    const hasSecond = secondIndex < cordSponsorsFields.fields.length;
                    
                    return (
                      <div key={`cord-pair-${pairIndex}`} className="p-4 border border-gray-200 rounded-lg mb-3 bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                          <span className="text-sm font-medium text-gray-700 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5 text-amber-500">
                              <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
                            </svg>
                            Cord Sponsor Pair {pairIndex + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              // Remove both sponsors in the pair
                              cordSponsorsFields.remove(firstIndex);
                              if (hasSecond) cordSponsorsFields.remove(firstIndex); // After first removal, second becomes first
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors flex items-center"
                            title="Remove cord sponsor pair"
                            aria-label={`Remove cord sponsor pair ${pairIndex + 1}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            Remove
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* First Sponsor */}
                          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow transition-shadow">
                            <h6 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5 text-blue-500">
                                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                              </svg>
                              Sponsor 1
                            </h6>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                  Name
                                </label>
                                <input
                                  type="text"
                                  {...register(`templateProps.weddingProps.entourage.secondarySponsors.cord.${firstIndex}.name`)}
                                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-100 focus:border-amber-400 transition-colors"
                                  placeholder="Sponsor's name"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                  Relation
                                </label>
                                <input
                                  type="text"
                                  {...register(`templateProps.weddingProps.entourage.secondarySponsors.cord.${firstIndex}.relation`)}
                                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-100 focus:border-amber-400 transition-colors"
                                  placeholder="Relation to couple"
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Second Sponsor */}
                          <div className={`border border-gray-200 rounded-lg p-4 bg-white shadow-sm ${hasSecond ? 'hover:shadow' : 'opacity-75'} transition-all`}>
                            <h6 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5 text-pink-500">
                                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                              </svg>
                              Sponsor 2
                            </h6>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                  Name
                                </label>
                                <input
                                  type="text"
                                  {...register(`templateProps.weddingProps.entourage.secondarySponsors.cord.${secondIndex}.name`)}
                                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-100 focus:border-amber-400 transition-colors"
                                  placeholder="Sponsor's name"
                                  disabled={!hasSecond}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                  Relation
                                </label>
                                <input
                                  type="text"
                                  {...register(`templateProps.weddingProps.entourage.secondarySponsors.cord.${secondIndex}.relation`)}
                                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-100 focus:border-amber-400 transition-colors"
                                  placeholder="Relation to couple"
                                  disabled={!hasSecond}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {cordSponsorsFields.fields.length === 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        cordSponsorsFields.append([
                          { name: '', relation: '' },
                          { name: '', relation: '' }
                        ]);
                      }}
                      className="w-full p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-600 hover:text-gray-800 hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Add Cord Sponsor Pair
                    </button>
                  )}
                </div>
              </div>
              
              {/* Bearers Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center border-b border-gray-200 pb-3 mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-blue-600">
                    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-gray-800">Bearers</h4>
                </div>
                <div className="space-y-6">
                  {/* Bible Bearer */}
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/70 hover:bg-gray-50 transition-colors shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                      <h5 className="text-md font-medium text-gray-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1.5 text-blue-600">
                          <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                        </svg>
                        Bible Bearer
                      </h5>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={bibleBearer}
                          onChange={() => setBibleBearer(!bibleBearer)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">Include</span>
                      </label>
                    </div>
                    {bibleBearer && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Name
                          </label>
                          <input
                            type="text"
                            {...register('templateProps.weddingProps.entourage.bearers.bible.name')}
                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Bearer's name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Age
                          </label>
                          <input
                            type="number"
                            {...register('templateProps.weddingProps.entourage.bearers.bible.age', { valueAsNumber: true })}
                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Age"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Relation
                          </label>
                          <input
                            type="text"
                            {...register('templateProps.weddingProps.entourage.bearers.bible.relation')}
                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Relation to couple"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Ring Bearer */}
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/70 hover:bg-gray-50 transition-colors shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                      <h5 className="text-md font-medium text-gray-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1.5 text-blue-600">
                          <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                          <path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z" clipRule="evenodd" />
                          <path d="M12 7.875a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
                        </svg>
                        Ring Bearer
                      </h5>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={ringBearer}
                          onChange={() => setRingBearer(!ringBearer)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">Include</span>
                      </label>
                    </div>
                    {ringBearer && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Name
                          </label>
                          <input
                            type="text"
                            {...register('templateProps.weddingProps.entourage.bearers.ring.name')}
                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Bearer's name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Age
                          </label>
                          <input
                            type="number"
                            {...register('templateProps.weddingProps.entourage.bearers.ring.age', { valueAsNumber: true })}
                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Age"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Relation
                          </label>
                          <input
                            type="text"
                            {...register('templateProps.weddingProps.entourage.bearers.ring.relation')}
                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Relation to couple"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Coin Bearer */}
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/70 hover:bg-gray-50 transition-colors shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                      <h5 className="text-md font-medium text-gray-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1.5 text-amber-500">
                          <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z" clipRule="evenodd" />
                        </svg>
                        Coin Bearer
                      </h5>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={coinBearer}
                          onChange={() => setCoinBearer(!coinBearer)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">Include</span>
                      </label>
                    </div>
                    {coinBearer && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Name
                          </label>
                          <input
                            type="text"
                            {...register('templateProps.weddingProps.entourage.bearers.coin.name')}
                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Bearer's name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Age
                          </label>
                          <input
                            type="number"
                            {...register('templateProps.weddingProps.entourage.bearers.coin.age', { valueAsNumber: true })}
                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Age"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Relation
                          </label>
                          <input
                            type="text"
                            {...register('templateProps.weddingProps.entourage.bearers.coin.relation')}
                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Relation to couple"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Flower Girls */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-5 border-b border-gray-200 pb-3">
                  <h4 className="text-lg font-medium text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-pink-500">
                      <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
                    </svg>
                    Flower Girls
                  </h4>
                  <button
                    type="button"
                    onClick={() => flowerGirlsFields.append({ name: '', age: 0, relation: '' })}
                    className="flex items-center text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 py-1.5 px-3 rounded-md transition-colors"
                    title="Add flower girl"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Flower Girl
                  </button>
                </div>
                
                {flowerGirlsFields.fields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-gray-200 rounded-lg mb-4 bg-gray-50/80 hover:bg-gray-50 transition-colors shadow-sm">
                    <div className="flex justify-between items-center mb-3 border-b border-gray-200 pb-2">
                      <span className="text-sm font-medium text-gray-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5 text-pink-500">
                          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                        Flower Girl {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => flowerGirlsFields.remove(index)}
                        className="text-red-500 hover:text-red-700 transition-colors flex items-center"
                        title="Remove flower girl"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Name
                        </label>
                        <input
                          type="text"
                          {...register(`templateProps.weddingProps.entourage.flowerGirls.${index}.name`)}
                          className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Flower girl's name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Age
                        </label>
                        <input
                          type="number"
                          {...register(`templateProps.weddingProps.entourage.flowerGirls.${index}.age`, { valueAsNumber: true })}
                          className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Age"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Relation
                        </label>
                        <input
                          type="text"
                          {...register(`templateProps.weddingProps.entourage.flowerGirls.${index}.relation`)}
                          className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Relation to couple"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {flowerGirlsFields.fields.length === 0 && (
                  <button
                    type="button"
                    onClick={() => flowerGirlsFields.append({ name: '', age: 0, relation: '' })}
                    className="w-full p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
                  >
                    <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Add Flower Girl
                    </span>
                  </button>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="gallery" className="space-y-6">
              <div className="flex items-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">Photo Gallery</h3>
              </div>
              <div className="pl-8 mb-6">
                <p className="text-gray-600 mb-3">
                  Upload photos to be displayed in your invitation gallery. These images will give your guests a glimpse of your journey together.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex flex-col gap-2">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                    <span className="text-sm text-blue-800">
                      Selected images will only be uploaded when you click &ldquo;{hasExistingData ? 'Update' : 'Save'} Wedding Details&rdquo; at the bottom of the form.
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <span className="text-sm text-amber-800">
                      Maximum file size: <strong>{MAX_FILE_SIZE_MB}MB</strong> per image. Larger files will be rejected.
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 mt-6 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2 text-blue-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <h4 className="text-lg font-medium text-gray-800">Gallery Items</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      galleryItemsFields.append({
                        title: '',
                        date: '',
                        text: '',
                        image: ''
                      });
                    }}
                    className="flex items-center text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 py-1.5 px-3 rounded-md transition-colors"
                    title="Add new gallery item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Gallery Item
                  </button>
                </div>

                <div className="space-y-6">
                  {galleryItemsFields.fields.length > 0 ? (
                    galleryItemsFields.fields.map((field, index) => (
                      <div key={field.id} className="p-5 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-50/80 transition-colors shadow-sm">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
                          <h5 className="font-medium text-gray-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-1.5 text-blue-500">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            Gallery Item {index + 1}
                          </h5>
                          <button
                            type="button"
                            onClick={() => galleryItemsFields.remove(index)}
                            className="text-red-500 hover:text-red-700 transition-colors flex items-center"
                            title="Remove gallery item"
                            aria-label={`Remove gallery item ${index + 1}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            Remove
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Title
                              </label>
                              <input
                                type="text"
                                {...register(`templateProps.weddingProps.galleryItems.${index}.title`)}
                                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Memory Title"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Date
                              </label>
                              <input
                                type="date"
                                {...register(`templateProps.weddingProps.galleryItems.${index}.date`)}
                                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Description
                              </label>
                              <textarea
                                {...register(`templateProps.weddingProps.galleryItems.${index}.text`)}
                                className="w-full min-h-[120px] p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Share the story behind this memory..."
                              ></textarea>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={`gallery-image-${index}`}>
                                Upload Image
                              </label>
                              <div className={`relative border-2 rounded-md p-4 flex flex-col items-center 
                                ${uploadingImages[`gallery-${index}`] ? 'border-yellow-300 bg-yellow-50' :
                                  galleryFileSelected[`gallery-${index}`] ? 'border-blue-300 bg-blue-50' :
                                  methods.getValues(`templateProps.weddingProps.galleryItems.${index}.image`) ? 'border-green-300 bg-green-50' :
                                  'border-gray-200'}`}>
                                
                                {/* Status indicators */}
                                {uploadingImages[`gallery-${index}`] && (
                                  <div className="mb-2 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-yellow-500 mr-2"></div>
                                    <p className="text-sm text-yellow-700 font-medium">Uploading...</p>
                                  </div>
                                )}
                                
                                {/* Show overlay when uploading */}
                                {uploadingImages[`gallery-${index}`] && galleryPreviews[index] && (
                                  <div className="absolute inset-0 bg-yellow-100 bg-opacity-50 flex items-center justify-center rounded-md">
                                    <div className="bg-white p-3 rounded-lg shadow-md flex flex-col items-center">
                                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-600 mb-2"></div>
                                      <p className="text-sm font-medium text-yellow-700">Uploading image...</p>
                                    </div>
                                  </div>
                                )}
                                
                                {!uploadingImages[`gallery-${index}`] && galleryFileSelected[`gallery-${index}`] && (
                                  <div className="mb-2 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm text-blue-700 font-medium">Image selected</p>
                                  </div>
                                )}
                                
                                {!uploadingImages[`gallery-${index}`] && !galleryFileSelected[`gallery-${index}`] && methods.getValues(`templateProps.weddingProps.galleryItems.${index}.image`) && (
                                  <div className="mb-2 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm text-green-700 font-medium">Image uploaded</p>
                                  </div>
                                )}
                                
                                <input
                                  id={`gallery-image-${index}`}
                                  type="file"
                                  accept="image/*"
                                  disabled={uploadingImages[`gallery-${index}`]}
                                  title={`Upload gallery image ${index + 1} (max ${MAX_FILE_SIZE_MB}MB)`}
                                  onChange={(e) => handleGalleryImageChange(e, index)}
                                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                                />
                                
                                {methods.getValues(`templateProps.weddingProps.galleryItems.${index}.image`) && (
                                  <p className="text-xs text-gray-500 mt-2">
                                    {galleryFileSelected[`gallery-${index}`] ? 'This will replace the current image' : 'Click browse to replace this image'}
                                  </p>
                                )}
                                
                                {(galleryPreviews[index] || methods.getValues(`templateProps.weddingProps.galleryItems.${index}.image`) || galleryImageUrls[`gallery-${index}`]) && (
                                  <div className="mt-3 border border-gray-200 rounded-lg p-2 bg-white relative">
                                    <SafeImage
                                      loader={customLoader}
                                      src={galleryPreviews[index] || methods.getValues(`templateProps.weddingProps.galleryItems.${index}.image`) || galleryImageUrls[`gallery-${index}`]}
                                      alt={`Gallery preview ${index + 1}`}
                                      width={200}
                                      height={150}
                                      loading="eager"
                                      priority={index < 3}
                                      key={`gallery-img-${index}-${galleryFileSelected[`gallery-${index}`] ? 'preview' : 'uploaded'}-${Date.now()}`}
                                      onImageError={(error) => {
                                        console.log(`Failed to load gallery image ${index}:`, methods.getValues(`templateProps.weddingProps.galleryItems.${index}.image`), error);
                                      }}
                                      className={`h-48 w-full object-cover rounded-md ${
                                        uploadingImages[`gallery-${index}`] ? 'border-2 border-yellow-300' :
                                        galleryPreviews[index] ? 'border-2 border-blue-300' : 
                                        'border border-green-200'
                                      }`}
                                    />
                                    
                                    {/* Show upload overlay when uploading */}
                                    {uploadingImages[`gallery-${index}`] && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-yellow-100 bg-opacity-60 rounded-md">
                                        <div className="flex flex-col items-center bg-white p-2 rounded-md shadow-md">
                                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-yellow-500"></div>
                                          <span className="text-xs font-medium text-yellow-700 mt-1">Uploading...</span>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Display different status indicators based on whether it's a new or existing image */}
                                    {!uploadingImages[`gallery-${index}`] && galleryPreviews[index] && (
                                      <div className="mt-1 bg-blue-50 rounded-md p-1 border border-blue-100">
                                        <p className="text-xs text-blue-600 flex items-center">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          {methods.getValues(`templateProps.weddingProps.galleryItems.${index}.image`) || galleryImageUrls[`gallery-${index}`] ? 
                                            "New image will replace current image on save" : 
                                            "New image selected (will be uploaded on save)"}
                                        </p>
                                      </div>
                                    )}
                                    
                                    {!uploadingImages[`gallery-${index}`] && !galleryPreviews[index] && (
                                      <div className="mt-1 bg-green-50 rounded-md p-1 border border-green-100">
                                        <p className="text-xs text-green-600 flex items-center">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                          Current uploaded image
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        galleryItemsFields.append({
                          title: 'Our Journey',
                          date: '',
                          text: '',
                          image: ''
                        });
                      }}
                      className="w-full p-8 border border-dashed border-gray-300 rounded-lg text-center text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
                      title="Add your first gallery item"
                    >
                      <span className="flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 mb-2 text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <span className="text-base font-medium">Add First Gallery Item</span>
                        <span className="text-sm mt-1">Each gallery item includes a title, date, description, and image</span>
                      </span>
                    </button>
                  )}
                  
                  {/* Add another gallery item button - shown when there are already items */}
                  {galleryItemsFields.fields.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        galleryItemsFields.append({
                          title: '',
                          date: '',
                          text: '',
                          image: ''
                        });
                      }}
                      className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg mt-6 text-center text-gray-500 hover:text-gray-700 hover:border-blue-400 transition-colors bg-white hover:bg-blue-50/30"
                      title="Add another gallery item"
                    >
                      <span className="flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 mb-2 text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <span className="text-base font-medium">Add Another Gallery Item</span>
                        <span className="text-sm mt-1">Each gallery item includes a title, date, description, and image</span>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 mb-5 mr-5">
          <button 
            type="button"
            onClick={() => router.push('/events')} 
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all font-medium flex items-center justify-center min-w-[120px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center min-w-[160px] transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2.5 h-5 w-5 text-white" />
                {hasExistingData ? 'Updating Wedding Details...' : 'Saving Wedding Details...'}
              </>
            ) : (
              <>
                {hasExistingData ? 'Update Wedding Details' : 'Save Wedding Details'}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-2">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
      )}
    </FormProvider>
  );
}
