'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import Image from 'next/image';
import { useToast } from '@/hooks/useToast';
import { uploadFileWithProgress } from '@/lib/firebase/storage';
import { createRealtimeEvent } from '@/lib/firebase/realtime-db';
import { Event } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import ThemeSelector from './ThemeSelector';

interface BaseEventFormProps {
  eventType: 'wedding' | 'birthday' | 'corporate';
  defaultTheme?: string;
}

interface BaseEventInputs {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  theme: string;
  visibility: 'public' | 'private';
  maxGuests: number;
  coverImage?: FileList;
}

export default function BaseEventForm({ eventType, defaultTheme = '' }: BaseEventFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<BaseEventInputs>({
    defaultValues: {
      theme: defaultTheme,
      visibility: 'public',
      maxGuests: 100
    }
  });
  
  // Watch for theme changes (useful for conditional rendering based on theme)
  watch('theme');
  
  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit: SubmitHandler<BaseEventInputs> = async (data) => {
    if (!user) {
      toast.error('You must be logged in to create an event');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Handle image upload if provided
      let coverImageUrl = '';
      if (data.coverImage && data.coverImage[0]) {
        const file = data.coverImage[0];
        coverImageUrl = await uploadFileWithProgress(
          file,
          `events/${eventType}/${Date.now()}_${file.name}`,
          (progress) => {
            setUploadProgress(progress);
          }
        );
      }
      
      // Create event object
      const newEvent = {
        ownerId: user.uid,
        eventType,
        title: data.title,
        description: data.description,
        date: new Date(data.date), // Pass Date object instead of string
        time: data.time,
        location: data.location,
        theme: data.theme,
        visibility: data.visibility,
        maxGuests: Number(data.maxGuests),
        coverImage: coverImageUrl,
        extraFields: {} // Required by Event type
      };
      
      // Save to Firebase
      // Import and use the Event type from @/types
      const eventId = await createRealtimeEvent(newEvent as import('@/types').Event);
      
      toast.success('Event created successfully!');
      
      // Redirect to the event page
      router.push(`/events/${eventId}`);
      
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(`Failed to create event: ${(error as Error).message}`);
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Event Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Event Title *
        </label>
        <input
          id="title"
          type="text"
          {...register('title', { required: 'Title is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>
      
      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description', { required: 'Description is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>
      
      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date *
          </label>
          <input
            id="date"
            type="date"
            {...register('date', { required: 'Date is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
            Time *
          </label>
          <input
            id="time"
            type="time"
            {...register('time', { required: 'Time is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.time && (
            <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
          )}
        </div>
      </div>
      
      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location *
        </label>
        <input
          id="location"
          type="text"
          {...register('location', { required: 'Location is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>
      
      {/* Cover Image */}
      <div>
        <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
          Cover Image
        </label>
        <div className="mt-1 flex items-center">
          <input
            id="coverImage"
            type="file"
            accept="image/*"
            {...register('coverImage')}
            onChange={handleImageChange}
            className="sr-only"
          />
          <label
            htmlFor="coverImage"
            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {imagePreview ? 'Change Image' : 'Upload Image'}
          </label>
        </div>
        
        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-2 relative h-48 w-full">
            <Image
              src={imagePreview}
              alt="Cover image preview"
              fill
              className="object-cover rounded-md"
            />
          </div>
        )}
        
        {/* Upload Progress */}
        {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-2">
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-2 bg-blue-600 rounded-full w-[${uploadProgress}%]`}
              ></div>
            </div>
            <p className="mt-1 text-xs text-gray-600">Uploading: {uploadProgress}%</p>
          </div>
        )}
      </div>
      
      {/* Max Guests */}
      <div>
        <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700">
          Maximum Guests *
        </label>
        <input
          id="maxGuests"
          type="number"
          min="1"
          {...register('maxGuests', { 
            required: 'Please enter maximum number of guests',
            min: { value: 1, message: 'Minimum guests is 1' }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.maxGuests && (
          <p className="mt-1 text-sm text-red-600">{errors.maxGuests.message}</p>
        )}
      </div>
      
      {/* Visibility */}
      <div>
        <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
          Event Visibility
        </label>
        <select
          id="visibility"
          {...register('visibility')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="public">Public - Anyone with the link can view</option>
          <option value="private">Private - Only invited guests can view</option>
        </select>
      </div>
      
      {/* Submission */}
      <div className="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            isSubmitting 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {isSubmitting ? 'Creating Event...' : 'Create Event'}
        </button>
      </div>
    </form>
  );
}