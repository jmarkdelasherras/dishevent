'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rsvpSchema } from '@/lib/validation/schemas';
import { useState } from 'react';
import { EventType } from '@/types';

interface RSVPFormProps {
  eventId: string; 
  themeColor?: string;
  accentColor?: string;
  eventType?: EventType;
  themeName?: string;
}

export default function RSVPForm({ 
  eventId, 
  themeColor = '#6366F1',
  accentColor,
  eventType,
  themeName
}: RSVPFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      response: 'yes',
      numOfAttendees: 1,
      note: '',
    },
  });

  const onSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    try {
      // This would be connected to Firebase to save RSVP response
      console.log('RSVP data submitted:', { eventId, ...data });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success state
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // CSS styles based on the theme color
  const buttonStyle = { backgroundColor: themeColor };
  const focusRingStyle = { 
    '--tw-ring-color': `${themeColor}80`, // 50% opacity version of the theme color
  } as React.CSSProperties;

  // Helper functions to get theme-specific styles
  const getSuccessBg = () => {
    if (!eventType || !themeName) return 'bg-green-100';
    
    if (eventType === 'wedding') {
      return themeName === 'elegant' ? 'bg-amber-100' : 
             themeName === 'modern' ? 'bg-gray-100' : 'bg-indigo-100';
    } else if (eventType === 'birthday') {
      return themeName === 'elegant' ? 'bg-blue-100' : 'bg-pink-100';
    } else {
      return themeName === 'luxury' ? 'bg-slate-100' : 'bg-gray-100';
    }
  };

  const getSuccessTextColor = () => {
    if (!eventType || !themeName) return 'text-green-600';
    
    if (eventType === 'wedding') {
      return themeName === 'elegant' ? 'text-amber-800' : 
             themeName === 'modern' ? 'text-gray-800' : 'text-indigo-600';
    } else if (eventType === 'birthday') {
      return themeName === 'elegant' ? 'text-blue-800' : 'text-pink-600';
    } else {
      return themeName === 'luxury' ? 'text-slate-800' : 'text-gray-800';
    }
  };
  
  const getButtonHoverColor = () => {
    if (!eventType || !themeName) return themeColor;
    
    if (eventType === 'wedding') {
      return themeName === 'elegant' ? '#8D5524' : 
             themeName === 'modern' ? '#4A5568' : '#4F46E5';
    } else if (eventType === 'birthday') {
      return themeName === 'elegant' ? '#1E3A8A' : '#BE185D';
    } else {
      return themeName === 'luxury' ? '#334155' : '#1F2937';
    }
  };
  
  const successBgColor = getSuccessBg();
  const successTextColor = getSuccessTextColor();
  const accentButtonColor = accentColor || getButtonHoverColor();

  if (submitted) {
    return (
      <div className="p-8 bg-white rounded-lg text-center shadow-sm">
        <div className={`mx-auto w-20 h-20 ${successBgColor} rounded-full flex items-center justify-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${successTextColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className={`mt-6 text-3xl font-bold ${successTextColor}`}>Thank You!</h2>
        
        {eventType === 'wedding' && (
          <p className="mt-3 text-gray-600">
            We&apos;re delighted you&apos;ll be joining us for our special day!
          </p>
        )}
        
        {eventType === 'birthday' && (
          <p className="mt-3 text-gray-600">
            Can&apos;t wait to celebrate with you! Thanks for RSVPing.
          </p>
        )}
        
        {eventType === 'corporate' && (
          <p className="mt-3 text-gray-600">
            Your registration is confirmed. We look forward to your participation.
          </p>
        )}
        
        {(!eventType || (eventType !== 'wedding' && eventType !== 'birthday' && eventType !== 'corporate')) && (
          <p className="mt-3 text-gray-600">
            Your RSVP has been successfully submitted. We look forward to seeing you!
          </p>
        )}
        
        <div className="mt-6 mb-2 flex justify-center">
          <div className="w-16 h-0.5" style={{ backgroundColor: themeColor }}></div>
        </div>
        
        <button
          className="mt-6 px-8 py-3 text-white rounded-md hover:opacity-90 transition-opacity"
          style={{ backgroundColor: accentButtonColor }}
          onClick={() => setSubmitted(false)}
        >
          Return to RSVP Form
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6" style={{ color: themeColor }}>Your RSVP</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            {...register('name')}
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm text-gray-800"
            style={focusRingStyle}
            placeholder="Enter your full name"
          />
          {errors.name?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full rounded-md border-gray-300 shadow-sm text-gray-800"
            style={focusRingStyle}
            placeholder="Enter your email"
          />
          {errors.email?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (Optional)
          </label>
          <input
            {...register('phone')}
            type="tel"
            className="w-full rounded-md border-gray-300 shadow-sm text-gray-800"
            style={focusRingStyle}
            placeholder="Enter your phone number"
          />
          {errors.phone?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message as string}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Will you be attending?
          </label>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <input
                {...register('response')}
                id="yes-response"
                type="radio"
                value="yes"
                className="sr-only"
              />
              <label
                htmlFor="yes-response"
                className="flex p-3 bg-white border rounded-lg items-center justify-center cursor-pointer focus:outline-none"
                style={{ borderColor: themeColor }}
              >
                <span className="text-sm font-medium">
                  Yes, I&apos;ll be there
                </span>
              </label>
            </div>
            <div className="relative">
              <input
                {...register('response')}
                id="maybe-response"
                type="radio"
                value="maybe"
                className="sr-only"
              />
              <label
                htmlFor="maybe-response"
                className="flex p-3 bg-white border rounded-lg items-center justify-center cursor-pointer focus:outline-none"
                style={{ borderColor: themeColor }}
              >
                <span className="text-sm font-medium">Maybe</span>
              </label>
            </div>
            <div className="relative">
              <input
                {...register('response')}
                id="no-response"
                type="radio"
                value="no"
                className="sr-only"
              />
              <label
                htmlFor="no-response"
                className="flex p-3 bg-white border rounded-lg items-center justify-center cursor-pointer focus:outline-none"
                style={{ borderColor: themeColor }}
              >
                <span className="text-sm font-medium">
                  No, I can&apos;t make it
                </span>
              </label>
            </div>
          </div>
          {errors.response?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.response.message as string}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Guests
          </label>
          <input
            {...register('numOfAttendees', { valueAsNumber: true })}
            type="number"
            min="0"
            className="w-full rounded-md border-gray-300 shadow-sm"
            style={focusRingStyle}
          />
          {errors.numOfAttendees?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.numOfAttendees.message as string}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            {...register('note')}
            rows={3}
            className="w-full rounded-md border-gray-300 shadow-sm"
            style={focusRingStyle}
            placeholder="Any dietary restrictions or special requests?"
          ></textarea>
          {errors.note?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.note.message as string}</p>
          )}
        </div>
        
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            style={{ 
              backgroundColor: themeColor,
              boxShadow: eventType === 'corporate' ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </div>
            ) : 'Submit RSVP'}
          </button>
        </div>
      </form>
    </div>
  );
}