import { useState, useEffect } from 'react';
import { database, auth } from '@/lib/firebase/config';
import { ref, onValue, get, remove, push, set } from 'firebase/database';
import { RealtimeEventWithId, RealtimeEvent } from '@/lib/firebase/realtime-types';
import { useAuth } from '@/hooks/useAuth';

interface UseEventsOptions {
  orderBy?: 'createdAt' | 'date' | 'name';
  orderDirection?: 'asc' | 'desc';
  filterStatus?: 'active' | 'draft' | 'past' | 'all';
  searchTerm?: string;
}

export function useEvents(options: UseEventsOptions = {}) {
  const [events, setEvents] = useState<RealtimeEventWithId[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<RealtimeEventWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { user } = useAuth();
  
  // Fetch events from Firebase
  useEffect(() => {
    if (!user) {
      setLoading(false);
      setEvents([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const eventsRef = ref(database, 'events');
    
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      try {
        const eventsData = snapshot.val();
        
        if (!eventsData) {
          setEvents([]);
          setLoading(false);
          return;
        }
        
        // Convert the object to an array and filter by the current user's ID
        const eventsArray: RealtimeEventWithId[] = Object.entries(eventsData)
          .filter(([, event]) => {
            const typedEvent = event as RealtimeEvent;
            return typedEvent.ownerId === user.uid;
          })
          .map(([id, event]) => ({
            ...(event as RealtimeEvent),
            id
          }));
        
        setEvents(eventsArray);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setLoading(false);
      }
    }, (err) => {
      console.error('Error in Firebase onValue:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setLoading(false);
    });
    
    return () => {
      // Cleanup subscription on unmount
      unsubscribe();
    };
  }, [user]);
  
  // Apply filters, sorting, and search
  useEffect(() => {
    if (loading || events.length === 0) return;
    
    let result = [...events];
    
    // Apply status filter
    if (options.filterStatus && options.filterStatus !== 'all') {
      const now = new Date();
      
      result = result.filter(event => {
        const eventDate = new Date(event.date);
        
        if (options.filterStatus === 'past') {
          return eventDate < now;
        } else if (options.filterStatus === 'active') {
          return eventDate >= now && event.visibility === 'public';
        } else if (options.filterStatus === 'draft') {
          return event.visibility === 'private';
        }
        
        return true;
      });
    }
    
    // Apply search term
    if (options.searchTerm && options.searchTerm.trim() !== '') {
      const searchLower = options.searchTerm.toLowerCase();
      result = result.filter(event => 
        event.name.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    if (options.orderBy) {
      result.sort((a, b) => {
        let valueA, valueB;
        
        switch (options.orderBy) {
          case 'date':
            valueA = new Date(a.date).getTime();
            valueB = new Date(b.date).getTime();
            break;
          case 'createdAt':
            valueA = new Date(a.createdAt).getTime();
            valueB = new Date(b.createdAt).getTime();
            break;
          case 'name':
          default:
            valueA = a.name.toLowerCase();
            valueB = b.name.toLowerCase();
        }
        
        // Apply direction
        const directionMultiplier = options.orderDirection === 'desc' ? -1 : 1;
        
        if (valueA < valueB) return -1 * directionMultiplier;
        if (valueA > valueB) return 1 * directionMultiplier;
        return 0;
      });
    }
    
    setFilteredEvents(result);
  }, [events, options.filterStatus, options.searchTerm, options.orderBy, options.orderDirection, loading]);
  
  // Delete event function
  const deleteEvent = async (eventId: string) => {
    try {
      const eventRef = ref(database, `events/${eventId}`);
      await get(eventRef);  // Check if the event exists and if user has access
      
      // Delete from the database
      await remove(eventRef);
      return true;
    } catch (err) {
      console.error('Error deleting event:', err);
      throw err;
    }
  };

  // Create event function
  const createEvent = async (eventData: Partial<RealtimeEvent>) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Make sure the ownerId matches the current user
      const event = {
        ...eventData,
        ownerId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Generate a new event entry in the database
      const eventsRef = ref(database, 'events');
      const newEventRef = push(eventsRef);
      await set(newEventRef, event);
      
      return { id: newEventRef.key, ...event };
    } catch (err) {
      console.error('Error creating event:', err);
      throw err;
    }
  };

  // Get a specific event by ID - Create stable function that doesn't rely on closure variables
  const getEventById = async (eventId: string): Promise<RealtimeEventWithId | null> => {
    try {
      // Get the current user directly from auth context to avoid closure issues
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        console.error('User not authenticated when fetching event by ID');
        throw new Error('User not authenticated');
      }

      console.log(`Fetching event with ID: ${eventId} for user: ${currentUser.uid}`);
      const eventRef = ref(database, `events/${eventId}`);
      const snapshot = await get(eventRef);
      
      if (!snapshot.exists()) {
        console.log('Event not found with ID:', eventId);
        return null;
      }
      
      const eventData = snapshot.val() as RealtimeEvent;
      console.log('Found event data:', eventData);
      
      // Make sure the user owns this event
      if (eventData.ownerId !== currentUser.uid) {
        console.error(`User ${currentUser.uid} does not have permission to access event owned by ${eventData.ownerId}`);
        return null;
      }
      
      return { id: eventId, ...eventData };
    } catch (err) {
      console.error('Error getting event by ID:', err);
      throw err;
    }
  };

  // Update event function
  const updateEvent = async (eventId: string, eventData: Partial<RealtimeEvent>) => {
    try {
      console.log('Starting update process for event:', eventId);
      
      if (!user) {
        console.error('No authenticated user found');
        throw new Error('User not authenticated');
      }

      console.log('User authenticated:', user.uid);
      
      // First, get the current event to make sure it exists and belongs to the user
      const eventRef = ref(database, `events/${eventId}`);
      console.log('Fetching event from Firebase path:', `events/${eventId}`);
      
      const snapshot = await get(eventRef);
      
      if (!snapshot.exists()) {
        console.error('Event not found in database:', eventId);
        throw new Error('Event not found');
      }
      
      console.log('Event found in database');
      const currentEvent = snapshot.val() as RealtimeEvent;
      console.log('Current event data:', currentEvent);
      
      // Make sure the user owns this event
      if (currentEvent.ownerId !== user.uid) {
        console.error('User does not own this event. Owner:', currentEvent.ownerId, 'Current user:', user.uid);
        throw new Error('You do not have permission to update this event');
      }
      
      console.log('User has permission to update event');
      
      // Prepare the updated event data
      const updatedEvent = {
        ...currentEvent,
        ...eventData,
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Updated event data to save:', updatedEvent);
      
      // Update the event in the database
      await set(eventRef, updatedEvent);
      console.log('Event successfully updated in Firebase');
      
      return { id: eventId, ...updatedEvent };
    } catch (err) {
      console.error('Error updating event:', err);
      throw err;
    }
  };
  
  return {
    events: filteredEvents,
    loading,
    error,
    deleteEvent,
    createEvent,
    updateEvent,
    getEventById
  };
}