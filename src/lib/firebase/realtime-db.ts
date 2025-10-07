import { database } from './config';
import {
  ref,
  set,
  get,
  update,
  remove,
  push,
  onValue,
  off,
  DatabaseReference
} from 'firebase/database';
import { Event, Guest } from '@/types';
import { 
  RealtimeData, 
  RealtimeUpdates, 
  RealtimeEvent, 
  RealtimeEventWithId,
  RealtimeGuest,
  RealtimeGuestWithId
} from './realtime-types';

/**
 * Creates or updates data at the specified path in the Realtime Database
 * @param path - The path to the location you want to write to
 * @param data - The data you want to write
 */
export const setData = async (path: string, data: RealtimeData): Promise<void> => {
  try {
    const dbRef = ref(database, path);
    await set(dbRef, data);
  } catch (error) {
    console.error('Error setting data:', error);
    throw error;
  }
};

/**
 * Creates a new entry with an auto-generated ID
 * @param path - The path to the location you want to push to
 * @param data - The data you want to write
 * @returns The auto-generated ID of the new entry
 */
export const pushData = async (path: string, data: RealtimeData): Promise<string> => {
  try {
    const dbRef = ref(database, path);
    const newRef = push(dbRef);
    await set(newRef, data);
    return newRef.key || '';
  } catch (error) {
    console.error('Error pushing data:', error);
    throw error;
  }
};

/**
 * Updates specific fields at the specified path without overwriting the entire object
 * @param path - The path to the location you want to update
 * @param updates - An object containing the fields to update
 */
export const updateData = async (path: string, updates: RealtimeUpdates): Promise<void> => {
  try {
    const dbRef = ref(database, path);
    await update(dbRef, updates);
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};

/**
 * Retrieves data from the specified path once
 * @param path - The path to the location you want to read from
 * @returns The data at the specified path
 */
export const getData = async (path: string): Promise<RealtimeData | null> => {
  try {
    const dbRef = ref(database, path);
    const snapshot = await get(dbRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting data:', error);
    throw error;
  }
};

/**
 * Removes data at the specified path
 * @param path - The path to the location you want to delete
 */
export const removeData = async (path: string): Promise<void> => {
  try {
    const dbRef = ref(database, path);
    await remove(dbRef);
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
};

/**
 * Sets up a listener for real-time updates at a specified path
 * @param path - The path to listen to
 * @param callback - Function to call when the data changes
 * @returns A reference that can be used to unsubscribe
 */
export const subscribeToData = (
  path: string, 
  callback: (data: RealtimeData | null) => void
): DatabaseReference => {
  const dbRef = ref(database, path);
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
  return dbRef;
};

/**
 * Unsubscribes from real-time updates
 * @param reference - The reference returned by subscribeToData
 */
export const unsubscribeFromData = (reference: DatabaseReference): void => {
  off(reference);
};

// Event-specific functions using the Realtime Database

/**
 * Creates a new event in the Realtime Database
 * @param event - The event data to save
 * @returns The ID of the created event
 */
export const createRealtimeEvent = async (event: Event): Promise<string> => {
  try {
    const now = new Date().toISOString();
    const eventWithTimestamps = {
      ...event,
      createdAt: now,
      updatedAt: now
    };
    
    return await pushData('events', eventWithTimestamps);
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

/**
 * Gets an event by its ID
 * @param eventId - The ID of the event to retrieve
 * @returns The event data or null if not found
 */
export const getRealtimeEvent = async (eventId: string): Promise<RealtimeEventWithId | null> => {
  try {
    const eventData = await getData(`events/${eventId}`) as RealtimeEvent | null;
    
    if (!eventData) {
      return null;
    }
    
    return {
      ...eventData,
      id: eventId
    };
  } catch (error) {
    console.error('Error getting event:', error);
    throw error;
  }
};

/**
 * Updates an existing event
 * @param eventId - The ID of the event to update
 * @param updates - The fields to update
 */
export const updateRealtimeEvent = async (eventId: string, updates: Partial<Event>): Promise<void> => {
  try {
    const updatesWithTimestamp = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await updateData(`events/${eventId}`, updatesWithTimestamp);
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

/**
 * Deletes an event and all its associated data
 * @param eventId - The ID of the event to delete
 */
export const deleteRealtimeEvent = async (eventId: string): Promise<void> => {
  try {
    await removeData(`events/${eventId}`);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

/**
 * Creates or updates a guest RSVP for an event
 * @param eventId - The ID of the event
 * @param guest - The guest data
 * @returns The ID of the guest record
 */
export const setRealtimeGuest = async (eventId: string, guest: Guest): Promise<string> => {
  try {
    const guestId = guest.email.replace(/[.#$[\]]/g, '_'); // Create a safe ID from email
    const now = new Date().toISOString();
    
    const guestWithTimestamps = {
      ...guest,
      respondedAt: now
    };
    
    await setData(`events/${eventId}/guests/${guestId}`, guestWithTimestamps);
    return guestId;
  } catch (error) {
    console.error('Error setting guest:', error);
    throw error;
  }
};

/**
 * Gets the guest list for an event
 * @param eventId - The ID of the event
 * @returns Array of guests with their IDs
 */
export const getRealtimeGuests = async (eventId: string): Promise<RealtimeGuestWithId[]> => {
  try {
    const guestsData = await getData(`events/${eventId}/guests`) as Record<string, RealtimeGuest> | null;
    
    if (!guestsData) {
      return [];
    }
    
    return Object.entries(guestsData).map(([id, data]) => ({
      ...data,
      id
    }));
  } catch (error) {
    console.error('Error getting guests:', error);
    throw error;
  }
};

/**
 * Subscribe to guest list updates for an event
 * @param eventId - The ID of the event
 * @param callback - Function to call when the guest list changes
 * @returns A reference to unsubscribe later
 */
export const subscribeToGuests = (
  eventId: string, 
  callback: (guests: RealtimeGuestWithId[]) => void
): DatabaseReference => {
  const guestsRef = ref(database, `events/${eventId}/guests`);
  
  onValue(guestsRef, (snapshot) => {
    const guestsData = snapshot.val() as Record<string, RealtimeGuest> | null || {};
    
    const guestsArray = Object.entries(guestsData).map(([id, data]) => ({
      ...data,
      id
    }));
    
    callback(guestsArray);
  });
  
  return guestsRef;
};