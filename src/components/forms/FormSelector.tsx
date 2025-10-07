'use client';

import React from 'react';
import { ExtendedWeddingFormData } from '@/types/wedding';
import TraditionalEleganceForm from './wedding/Traditional/TraditionalElegance';

// Import other form components as needed
// import ModernMinimalistForm from './wedding/Modern/ModernMinimalist';
// import ElegantGoldForm from './wedding/Elegant/ElegantGold';

// Interface for the component props
interface FormSelectorProps {
  eventId: string;
  selectedTemplate: string;
  selectedTemplateName: string;
  onSubmit: (data: ExtendedWeddingFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function FormSelector({
  eventId,
  selectedTemplate,
  selectedTemplateName,
  onSubmit,
  isSubmitting
}: FormSelectorProps) {
  
  // Select the appropriate form based on the template ID
  switch (selectedTemplate) {
    // Traditional templates
    case 'traditional-elegance':
      return (
        <TraditionalEleganceForm
          eventId={eventId}
          selectedTemplate={selectedTemplate}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      );
      
    // Generic category-based fallbacks  
    default:
      // Display "Coming Soon" UI for templates that aren't yet implemented
      console.log(`No specific form component for template: ${selectedTemplateName}, showing coming soon message`);
      return (
        <div className="p-6 space-y-8">
          <div className="text-center py-12 px-4">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Template Coming Soon</h2>
              <p className="text-gray-600 mb-6">
                The {selectedTemplateName} template is currently under development.
                Our designers are working hard to bring you this beautiful template soon!
              </p>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              In the meantime, you can try our ready-to-use templates.
            </p>
          </div>
        </div>
      );
  }
}
