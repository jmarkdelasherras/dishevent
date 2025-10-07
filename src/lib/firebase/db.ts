import { db, storage } from './config';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { Event, EventWithId, Guest, GuestWithId, EventTemplate } from '@/types';

// Events

export const createEvent = async (event: Event): Promise<string> => {
  try {
    const eventRef = doc(collection(db, 'events'));
    const eventId = eventRef.id;
    
    await setDoc(eventRef, {
      ...event,
      id: eventId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return eventId;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const getEvent = async (eventId: string): Promise<EventWithId | null> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (eventSnap.exists()) {
      return { id: eventSnap.id, ...eventSnap.data() } as EventWithId;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting event:', error);
    throw error;
  }
};

export const getUserEvents = async (userId: string): Promise<EventWithId[]> => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, where('ownerId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const events: EventWithId[] = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as EventWithId);
    });
    
    return events;
  } catch (error) {
    console.error('Error getting user events:', error);
    throw error;
  }
};

export const updateEvent = async (
  eventId: string,
  eventData: Partial<Event>
): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      ...eventData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await deleteDoc(eventRef);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Guests

export const addGuest = async (
  eventId: string,
  guest: Guest
): Promise<string> => {
  try {
    const guestRef = doc(collection(db, 'events', eventId, 'guests'));
    const guestId = guestRef.id;
    
    await setDoc(guestRef, {
      ...guest,
      id: guestId,
      invitedAt: serverTimestamp(),
    });
    
    return guestId;
  } catch (error) {
    console.error('Error adding guest:', error);
    throw error;
  }
};

export const getEventGuests = async (eventId: string): Promise<GuestWithId[]> => {
  try {
    const guestsRef = collection(db, 'events', eventId, 'guests');
    const querySnapshot = await getDocs(guestsRef);
    
    const guests: GuestWithId[] = [];
    querySnapshot.forEach((doc) => {
      guests.push({ id: doc.id, ...doc.data() } as GuestWithId);
    });
    
    return guests;
  } catch (error) {
    console.error('Error getting event guests:', error);
    throw error;
  }
};

export const updateGuestResponse = async (
  eventId: string,
  guestId: string,
  response: 'yes' | 'no' | 'maybe',
  numOfAttendees: number,
  note?: string
): Promise<void> => {
  try {
    const guestRef = doc(db, 'events', eventId, 'guests', guestId);
    await updateDoc(guestRef, {
      response,
      numOfAttendees,
      note,
      respondedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating guest response:', error);
    throw error;
  }
};

// Templates

export const getEventTemplates = async (eventType: string): Promise<EventTemplate[]> => {
  try {
    const templatesRef = collection(db, 'eventTemplates');
    const q = query(
      templatesRef,
      where('eventType', '==', eventType),
      where('isActive', '==', true)
    );
    const querySnapshot = await getDocs(q);
    
    const templates: EventTemplate[] = [];
    querySnapshot.forEach((doc) => {
      templates.push({ id: doc.id, ...doc.data() } as EventTemplate);
    });
    
    return templates;
  } catch (error) {
    console.error('Error getting event templates:', error);
    throw error;
  }
};

// File Upload

export const uploadEventImage = async (
  file: File,
  eventId: string
): Promise<string> => {
  try {
    const fileId = uuidv4();
    const fileExtension = file.name.split('.').pop();
    const fileName = `events/${eventId}/images/${fileId}.${fileExtension}`;
    
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, file);
    
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading event image:', error);
    throw error;
  }
};