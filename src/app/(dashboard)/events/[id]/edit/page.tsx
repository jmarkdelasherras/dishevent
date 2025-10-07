'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEvents } from '@/hooks/firebase/useEvents';
import { RealtimeEvent, RealtimeEventWithId } from '@/lib/firebase/realtime-types';
import { useToast } from '@/hooks/useToast';
import Loader from '@/components/ui/loader';
import EventEditForm from '@/components/forms/EventEditForm';
import React from 'react';

export default function EventEditPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Unwrap params using React.use()
  const resolvedParams = React.use(params as Promise<{ id: string }>);
  const { id } = resolvedParams;
  const router = useRouter();
  const toast = useToast();
  
  const [event, setEvent] = useState<RealtimeEventWithId | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const eventsHook = useEvents();
  
  // Fetch the specific event by ID on component mount - only run once
  useEffect(() => {
    // Define the fetch function inside the effect to avoid dependencies
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching event with ID:', id);
        
        const eventData = await eventsHook.getEventById(id);
        
        if (eventData) {
          console.log('Event found:', eventData);
          setEvent(eventData);
        } else {
          console.error('Event not found or access denied');
          setError(new Error('Event not found or you do not have permission to access it'));
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
    // Only run this effect when the ID changes or on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  
  // Handle event update
  const handleUpdateEvent = async (eventId: string, eventData: Partial<RealtimeEvent>) => {
    try {
      console.log('Updating event with ID:', eventId);
      console.log('Update payload:', eventData);
      
      setIsSubmitting(true);
      await eventsHook.updateEvent(eventId, eventData);
      toast.success('Event updated successfully');
      router.push('/events');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error(`Error updating event: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel action
  const handleCancel = () => {
    router.push('/events');
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
        <Loader fullScreen={false} message="Loading event" />
      </div>
    );
  }
  
  // Show error state
  if (error || !event) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 border border-red-300 rounded-md text-red-700">
          <h3 className="font-bold">Error loading event</h3>
          <p>{error?.message || 'Event not found'}</p>
          <button 
            onClick={() => router.push('/events')}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Return to Events
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-950">Edit Event</h1>
        <p className="text-gray-600 mt-1">Update the details for {event.name}</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <EventEditForm 
          event={event}
          onSubmit={handleUpdateEvent}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}