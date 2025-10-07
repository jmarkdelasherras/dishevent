'use client';

import { useState, useRef } from 'react';
import { createRealtimeEvent, updateRealtimeEvent, deleteRealtimeEvent, setRealtimeGuest } from '@/lib/firebase/realtime-db';
import { uploadEventCoverImage } from '@/lib/firebase/storage';
import { useRealtimeEvent, useRealtimeGuests, useFirebaseStorage } from '@/hooks/firebase';
import Image from 'next/image';

export default function FirebaseTestComponent() {
  const [eventId, setEventId] = useState<string>('');
  const [testStatus, setTestStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Real-time data hooks
  const { event, loading: eventLoading } = useRealtimeEvent(eventId || null);
  const { guests, loading: guestsLoading } = useRealtimeGuests(eventId || null);
  const { uploadFile: uploadFileWithProgress, progress, downloadURL, isUploading } = useFirebaseStorage();

  // Test creating a new event
  const handleCreateEvent = async () => {
    try {
      setError(null);
      setTestStatus('Creating new event...');
      
      const newEventId = await createRealtimeEvent({
        ownerId: 'test-user-id',
        eventType: 'birthday',
        title: 'Test Event',
        description: 'This is a test event created to verify Firebase functionality',
        date: new Date(),
        time: '18:00',
        location: 'Test Location',
        theme: 'default',
        visibility: 'private',
        maxGuests: 50,
        extraFields: {
          celebrantName: 'Test User',
          age: 30,
          theme: 'Classic'
        }
      });
      
      setEventId(newEventId);
      setTestStatus(`Event created with ID: ${newEventId}`);
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // Test updating an event
  const handleUpdateEvent = async () => {
    if (!eventId) {
      setError('No event ID provided. Create an event first.');
      return;
    }
    
    try {
      setError(null);
      setTestStatus('Updating event...');
      
      await updateRealtimeEvent(eventId, {
        title: `Updated Test Event ${new Date().toLocaleTimeString()}`,
        description: 'This event was updated through the test component'
      });
      
      setTestStatus('Event updated successfully!');
    } catch (err) {
      console.error('Error updating event:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // Test adding a guest
  const handleAddGuest = async () => {
    if (!eventId) {
      setError('No event ID provided. Create an event first.');
      return;
    }
    
    try {
      setError(null);
      setTestStatus('Adding guest...');
      
      const randomEmail = `guest${Date.now()}@example.com`;
      
      await setRealtimeGuest(eventId, {
        name: `Test Guest ${new Date().toLocaleTimeString()}`,
        email: randomEmail,
        response: 'yes',
        numOfAttendees: 2,
        note: 'This is a test RSVP'
      });
      
      setTestStatus('Guest added successfully!');
    } catch (err) {
      console.error('Error adding guest:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // Test uploading a file
  const handleUploadFile = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      setError('Please select a file to upload');
      return;
    }
    
    try {
      setError(null);
      setTestStatus('Uploading file...');
      
      const file = fileInputRef.current.files[0];
      const filePath = `test-uploads`;
      
      const url = await uploadFileWithProgress(file, filePath);
      
      setTestStatus(`File uploaded successfully! URL: ${url}`);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // Test uploading an event cover image
  const handleUploadEventImage = async () => {
    if (!eventId) {
      setError('No event ID provided. Create an event first.');
      return;
    }
    
    if (!fileInputRef.current?.files?.[0]) {
      setError('Please select a file to upload');
      return;
    }
    
    try {
      setError(null);
      setTestStatus('Uploading event cover image...');
      
      const file = fileInputRef.current.files[0];
      
      const url = await uploadEventCoverImage(file, eventId);
      
      // Update the event with the cover image URL
      await updateRealtimeEvent(eventId, {
        coverImage: url
      });
      
      setTestStatus('Event cover image uploaded successfully!');
    } catch (err) {
      console.error('Error uploading event cover image:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // Test deleting an event
  const handleDeleteEvent = async () => {
    if (!eventId) {
      setError('No event ID provided. Create an event first.');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }
    
    try {
      setError(null);
      setTestStatus('Deleting event...');
      
      await deleteRealtimeEvent(eventId);
      
      setTestStatus('Event deleted successfully!');
      setEventId('');
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-white shadow-md max-w-3xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6">Firebase Test Component</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Test Status</h3>
        <div className="p-3 bg-gray-100 rounded">{testStatus || 'No tests run yet'}</div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Event ID</h3>
        <input
          type="text"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          placeholder="Enter event ID or create new event"
          className="firebase-test-input"
        />
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">File Upload</h3>
        <input
          type="file"
          ref={fileInputRef}
          className="mb-2 text-black"
          aria-label="File upload"
        />
        {isUploading && (
          <div className="firebase-test-progress-container">
            <div 
              className="firebase-test-progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
            <p className="text-sm text-gray-600">{Math.round(progress)}% uploaded</p>
          </div>
        )}
        {downloadURL && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">File URL: {downloadURL}</p>
            {downloadURL.match(/\.(jpeg|jpg|gif|png)$/i) && (
              <div className="mt-2 h-32 relative">
                <Image 
                  src={downloadURL} 
                  alt="Uploaded preview" 
                  width={128} 
                  height={128} 
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <button
          onClick={handleCreateEvent}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Create New Event
        </button>
        
        <button
          onClick={handleUpdateEvent}
          disabled={!eventId}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Update Event
        </button>
        
        <button
          onClick={handleAddGuest}
          disabled={!eventId}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Add Guest
        </button>
        
        <button
          onClick={handleUploadFile}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
        >
          Upload File
        </button>
        
        <button
          onClick={handleUploadEventImage}
          disabled={!eventId}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Upload Event Image
        </button>
        
        <button
          onClick={handleDeleteEvent}
          disabled={!eventId}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Delete Event
        </button>
      </div>
      
      {eventId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Real-time Event Data</h3>
          {eventLoading ? (
            <p>Loading event data...</p>
          ) : event ? (
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60 text-black">
              {JSON.stringify(event, null, 2)}
            </pre>
          ) : (
            <p>No event found with ID: {eventId}</p>
          )}
          
          <h3 className="text-lg font-semibold mb-2 mt-4">Real-time Guest List</h3>
          {guestsLoading ? (
            <p>Loading guests...</p>
          ) : guests && guests.length > 0 ? (
            <div className="bg-gray-100 p-4 rounded overflow-auto max-h-60 text-black">
              <p>Total guests: {guests.length}</p>
              <pre>
                {JSON.stringify(guests, null, 2)}
              </pre>
            </div>
          ) : (
            <p>No guests found for this event</p>
          )}
        </div>
      )}
    </div>
  );
}