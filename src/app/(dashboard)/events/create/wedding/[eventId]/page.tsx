'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ExtendedWeddingFormData } from '@/types/wedding';
import { useToast } from '@/hooks/useToast';
import FormSelector from '@/components/forms/FormSelector';
import { useEvents } from '@/hooks/firebase/useEvents';

// Define available template categories and their templates
const WEDDING_TEMPLATE_CATEGORIES = [
  { 
    id: 'classic',
    name: 'Classic',
    description: 'Timeless and elegant wedding designs',
    templates: [
      { id: 'classic-elegance', name: 'Classic Elegance' },
      { id: 'classic-romance', name: 'Classic Romance' },
      { id: 'classic-vintage', name: 'Classic Vintage' },
    ]
  },
  { 
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary and minimalist designs',
    templates: [
      { id: 'modern-minimalist', name: 'Modern Minimalist' },
      { id: 'modern-chic', name: 'Modern Chic' },
      { id: 'modern-bold', name: 'Modern Bold' },
    ]
  },
  { 
    id: 'traditional',
    name: 'Traditional',
    description: 'Culturally rich and traditional designs',
    templates: [
      { id: 'traditional-elegance', name: 'Traditional Elegance' },
      { id: 'traditional-002', name: 'Traditional Heritage' },
      { id: 'traditional-003', name: 'Traditional Formal' },
    ]
  },
  { 
    id: 'rustic',
    name: 'Rustic',
    description: 'Warm and nature-inspired designs',
    templates: [
      { id: 'rustic-charm', name: 'Rustic Charm' },
      { id: 'rustic-farmhouse', name: 'Rustic Farmhouse' },
      { id: 'rustic-botanical', name: 'Rustic Botanical' },
    ]
  },
  { 
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated and refined designs',
    templates: [
      { id: 'elegant-gold', name: 'Elegant Gold' },
      { id: 'elegant-silver', name: 'Elegant Silver' },
      { id: 'elegant-luxe', name: 'Elegant Luxe' },
    ]
  },
  { 
    id: 'aesthetic',
    name: 'Aesthetic',
    description: 'Visually stunning and artistic designs',
    templates: [
      { id: 'aesthetic-bohemian', name: 'Aesthetic Bohemian' },
      { id: 'aesthetic-floral', name: 'Aesthetic Floral' },
      { id: 'aesthetic-celestial', name: 'Aesthetic Celestial' },
    ]
  },
];

export default function CreateWeddingEventPage() {
  const router = useRouter();
  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState('traditional');
  const [selectedTemplate, setSelectedTemplate] = useState('traditional-elegance');
  const [selectedTemplateName, setSelectedTemplateName] = useState('Traditional Elegance');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const params = useParams();
  const eventIdFromPath = params.eventId as string;
  const eventsHook = useEvents(); // Store the entire hook result
  
  // Verify that event exists - use a ref to track if verification has been done
  const hasVerifiedRef = React.useRef(false);
  
  useEffect(() => {
    // Prevent multiple verification attempts
    if (hasVerifiedRef.current) return;
    
    async function verifyEvent() {
      if (!eventIdFromPath) {
        router.push('/events');
        return;
      }

      try {
        // Use the stable function from the hook object
        const event = await eventsHook.getEventById(eventIdFromPath);
        if (!event) {
          router.push('/events');
          return;
        }
        setIsLoading(false);
        hasVerifiedRef.current = true;
      } catch (error) {
        console.error('Error verifying event:', error);
        router.push('/events');
      }
    }

    verifyEvent();
  // Removing getEventById from dependencies to avoid re-running the effect
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventIdFromPath, router]);
  
  const onSubmit = async (data: ExtendedWeddingFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Form data submitted:', data);
      // toast.success('Wedding event created successfully!');
      // In a real implementation, you would save this data to your backend
      
      // Redirect to events page after successful creation
      // router.push('/dashboard/events');
    } catch (error) {
      console.error('Error creating wedding event:', error);
      toast.error('Failed to create wedding event');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    // Find the first template in the selected category and select it by default
    const category = WEDDING_TEMPLATE_CATEGORIES.find(cat => cat.id === categoryId);
    if (category && category.templates.length > 0) {
      handleTemplateChange(category.templates[0].id, category.templates[0].name);
    }
  };
  
  // Handle template change
  const handleTemplateChange = (templateId: string, templateName: string) => {
    setSelectedTemplate(templateId);
    setSelectedTemplateName(templateName);
    
    // Update the category based on the selected template
    for (const category of WEDDING_TEMPLATE_CATEGORIES) {
      if (category.templates.some(template => template.id === templateId)) {
        setSelectedCategory(category.id);
        break;
      }
    }
  };
  
  // Show loading state while verifying event
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto pb-12 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-medium text-gray-700">Loading event details...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configure Wedding Event Details</h1>
        <p className="text-gray-600 mt-1 ml-1">Customize your wedding event with all the details</p>
      </div>
      
      <div className="bg-white shadow-lg rounded-xl border border-gray-200">
        {/* Template Selector at the top */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select a Wedding Template</h2>
          
          {/* Category Selection */}
          <div className="mb-6">
            <div className="flex overflow-x-auto py-2 pl-1 space-x-4 hide-scrollbar">
              {WEDDING_TEMPLATE_CATEGORIES.map((category) => (
                <div 
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex-none px-4 py-2 rounded-full cursor-pointer transition-all duration-200 ${
                    selectedCategory === category.id 
                      ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-400'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-sm font-medium whitespace-nowrap">{category.name}</span>
                </div>
              ))}
            </div>
            
            {/* Category Description */}
            <div className="mt-2 text-sm text-gray-600">
              {WEDDING_TEMPLATE_CATEGORIES.find(cat => cat.id === selectedCategory)?.description || 'Select a template category to begin'}
            </div>
          </div>
          
          {/* Templates within selected category */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WEDDING_TEMPLATE_CATEGORIES
              .find(cat => cat.id === selectedCategory)
              ?.templates.map((template) => (
                <div 
                  key={template.id} 
                  className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                    selectedTemplate === template.id ? 'border-blue-500 shadow-lg bg-blue-50' : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                  onClick={() => handleTemplateChange(template.id, template.name)}
                >
                  <div className="p-5">
                    {/* Selected template indicator */}
                    <div className="flex justify-between items-center mb-3">
                      <h3 className={`font-medium text-lg ${selectedTemplate === template.id ? 'text-blue-600' : 'text-gray-800'}`}>
                        {template.name}
                      </h3>
                      
                      {selectedTemplate === template.id && (
                        <div className="bg-blue-600 text-white rounded-full p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Template ID display */}
                    <div className="text-sm text-gray-500 mb-4">
                      Template ID: {template.id}
                    </div>
                    
                    {/* Preview link */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {template.id.includes('classic') ? 'Classic style' : 
                          template.id.includes('modern') ? 'Modern style' : 
                          template.id.includes('traditional') ? 'Traditional style' :
                          template.id.includes('rustic') ? 'Rustic style' :
                          template.id.includes('elegant') ? 'Elegant style' :
                          template.id.includes('aesthetic') ? 'Aesthetic style' : 'Stylish design'}
                      </span>
                      
                      <a 
                        href={`/event/preview/${template.id}?preview=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm px-3 py-1.5 bg-blue-100 hover:bg-blue-200 rounded text-blue-700 transition font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        View Preview
                      </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        {/* Form Selector Component */}
        <FormSelector
          eventId={eventIdFromPath}
          selectedTemplate={selectedTemplate}
          selectedTemplateName={selectedTemplateName}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
