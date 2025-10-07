'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useEvents } from '@/hooks/firebase/useEvents';
import { RealtimeEvent } from '@/lib/firebase/realtime-types';
import Button from '@/components/ui/button';

// Define the schema for the form matching EventCreationForm
const weddingEventSchema = z.object({
  title: z.string().min(1, 'Event name is required'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  maxGuests: z.coerce.number().int().min(0, 'Max guests must be 0 or more'),
  visibility: z.enum(['public', 'private']),
  theme: z.string().default('traditional-elegance'),
  passwordProtected: z.boolean().default(false),
  password: z.string().optional(),
  // System fields (not visible in the form)
  status: z.enum(['active', 'draft', 'completed']).default('draft'),
  planType: z.enum(['free', 'premium']).default('free'),
});

// Infer type from schema
type WeddingFormData = z.infer<typeof weddingEventSchema>;

export default function CreateWeddingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const { createEvent } = useEvents();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use React Hook Form with Zod validation
  const { 
    register, 
    handleSubmit: formHandleSubmit,
    watch,
    formState: { errors } 
  } = useForm<WeddingFormData>({
    resolver: zodResolver(weddingEventSchema),
    defaultValues: {
      visibility: 'private',
      maxGuests: 0,
      theme: 'default',
      date: new Date().toISOString().split('T')[0],
      passwordProtected: false,
      status: 'draft',
      planType: 'free',
    }
  });
  
  // Create a properly typed version of handleSubmit
  const handleSubmit = formHandleSubmit as unknown as (
    callback: (data: WeddingFormData) => Promise<void>
  ) => (e: React.FormEvent) => void;

  // Handle form submission
  const onSubmit = async (data: WeddingFormData) => {
    if (!user) {
      toast.error('You must be logged in to create an event');
      return;
    }
    
    // Start form submission - this will first save the event and then redirect to the config page
    setIsSubmitting(true);
    
    try {
      // Format event data for Firebase
      const eventData: Partial<RealtimeEvent> = {
        name: data.title, // Map 'title' from form to 'name' in RealtimeEvent
        description: data.description,
        eventType: 'wedding', // Using wedding as the fixed event type
        date: data.date,
        maxGuests: data.maxGuests,
        visibility: data.visibility,
        theme: data.theme,
        status: data.status,
        planType: data.planType,
        ownerId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add password protection if enabled
      if (data.passwordProtected && data.password) {
        eventData.extraFields = {
          ...eventData.extraFields,
          passwordProtected: true,
          password: data.password,
        };
      }

      // Wedding-specific data will be stored separately in your database
      // Not including any extraFields to keep the structure exactly as specified
      
      // Create the event in Firebase
      const eventId = await createEvent(eventData);
      toast.success('Wedding event created! Now configure the details.');
      
      // Redirect to the detailed configuration page for this event
      router.push(`/events/create/wedding/${eventId.id}`);
    } catch (error) {
      console.error('Error creating wedding event:', error);
      toast.error('Failed to create wedding event');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Create Your Wedding Event</h1>
        <p className="text-gray-600 mt-2">Let&apos;s start planning your special day</p>
      </div>
      
      <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Event Name */}
            <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg shadow-sm">
              <label htmlFor="title" className="block text-base font-semibold text-gray-800">
                Name*
              </label>
              <input
                id="title"
                type="text"
                {...register('title')}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#143F7E] focus:ring-[#143F7E] bg-white"
                placeholder="Wedding event name"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg shadow-sm">
              <label htmlFor="description" className="block text-base font-semibold text-gray-800">
                Description
              </label>
              <textarea
                id="description"
                {...register('description')}
                rows={3}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#143F7E] focus:ring-[#143F7E] bg-white"
                placeholder="Describe your wedding event"
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Date */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <label htmlFor="date" className="block text-base font-semibold text-gray-800">
                Date*
              </label>
              <div className="mt-2 flex items-center">
                <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <input
                  id="date"
                  type="date"
                  {...register('date')}
                  className="block w-full border-none shadow-none focus:ring-0 focus:outline-none bg-transparent"
                />
              </div>
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            {/* Max Guests */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <label htmlFor="maxGuests" className="block text-base font-semibold text-gray-800">
                Max Guests
              </label>
              <div className="mt-2 flex items-center">
                <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <input
                  id="maxGuests"
                  type="number"
                  min="0"
                  {...register('maxGuests')}
                  className="block w-full border-none shadow-none focus:ring-0 focus:outline-none bg-transparent"
                  placeholder="0 (no limit)"
                />
              </div>
              <div className="mt-1 text-xs text-gray-500">
                Set to 0 for unlimited guests
              </div>
              {errors.maxGuests && (
                <p className="mt-1 text-sm text-red-600">{errors.maxGuests.message}</p>
              )}
            </div>

            {/* Visibility and Password Protection */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <label htmlFor="visibility" className="block text-base font-semibold text-gray-800">
                  Privacy Settings
                </label>
                <div className="mt-2 space-y-3">
                  <div className="flex items-center">
                    <input
                      id="public"
                      type="radio"
                      value="public"
                      {...register('visibility')}
                      className="h-5 w-5 text-[#143F7E] focus:ring-[#143F7E]"
                    />
                    <label htmlFor="public" className="ml-3 flex items-center">
                      <svg className="h-4 w-4 mr-1 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Public</span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="private"
                      type="radio"
                      value="private"
                      {...register('visibility')}
                      className="h-5 w-5 text-[#143F7E] focus:ring-[#143F7E]"
                    />
                    <label htmlFor="private" className="ml-3 flex items-center">
                      <svg className="h-4 w-4 mr-1 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Private</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center">
                  <input
                    id="passwordProtected"
                    type="checkbox"
                    {...register('passwordProtected')}
                    className="h-5 w-5 text-[#143F7E] focus:ring-[#143F7E] border-gray-300 rounded"
                  />
                  <label htmlFor="passwordProtected" className="ml-2 flex items-center">
                    <svg className="h-4 w-4 mr-1 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Password Protected</span>
                  </label>
                </div>

                {/* Password (conditional) */}
                {watch('passwordProtected') && (
                  <div className="mt-3 pl-7">
                    <input
                      id="password"
                      type="text"
                      {...register('password')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#143F7E] focus:ring-[#143F7E]"
                      placeholder="Event password"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Theme Selection - wedding-specific themes */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <label htmlFor="theme" className="block text-base font-semibold text-gray-800">
                Wedding Theme <span className="text-sm text-gray-500">(can be changed later)</span>
              </label>
              <select
                id="theme"
                {...register('theme')}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#143F7E] focus:ring-[#143F7E]"
              >
                <option value="default">Default</option>
                <option value="traditional-elegance">Traditional Elegance</option>
                <option value="rustic-charm">Rustic Charm</option>
                <option value="modern-minimal">Modern Minimal</option>
                <option value="garden-romance">Garden Romance</option>
                <option value="beach-destination">Beach Destination</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/events')}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText="Saving and Configuring..."
              className="px-8 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create and Configure
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
