'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useEvents } from '@/hooks/firebase/useEvents';
import { format } from 'date-fns';
import { useToast } from '@/hooks/useToast';
import Loader from '@/components/ui/loader';
import Dialog from '@/components/ui/dialog';
import EventCreationForm from '@/components/forms/EventCreationForm';
import { RealtimeEvent } from '@/lib/firebase/realtime-types';
import { CheckCircleIcon, FileWarningIcon, NotebookIcon } from 'lucide-react';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const toast = useToast();
  const { events, loading, error, deleteEvent, createEvent } = useEvents({
    searchTerm,
    filterStatus: statusFilter === 'all' ? undefined : statusFilter as 'active' | 'draft' | 'past'
  });
  
  // Filter events by type
  const filteredEvents = events.filter(event => {
    if (eventType === 'all') return true;
    return event.eventType === eventType;
  });
  
  // Handle event deletion
  const handleDeleteEvent = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the event "${name}"?`)) {
      try {
        await deleteEvent(id);
        toast.success(`Event "${name}" deleted successfully`);
      } catch (error) {
        toast.error(`Error deleting event: ${(error as Error).message}`);
      }
    }
  };
  
  // Handle opening/closing the create event modal
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  
  // Handle event creation
  const handleCreateEvent = async (eventData: Partial<RealtimeEvent>) => {
    try {
      setIsSubmitting(true);
      await createEvent(eventData);
      toast.success('Event created successfully');
      closeCreateModal();
    } catch (error) {
      toast.error(`Error creating event: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
        <Loader fullScreen={false} message="Loading events" />
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 border border-red-300 rounded-md text-red-700">
          <h3 className="font-bold">Error loading events</h3>
          <p>{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-950">My Events</h1>
          <p className="text-gray-600 mt-1">Manage all your events</p>
        </div>
        
        <button 
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#143F7E] to-[#297B46] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#143F7E]"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create New Event
        </button>
      </div>
      
      {/* Event Filters */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-grow">
            <label htmlFor="search" className="sr-only">Search events</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#143F7E] focus:border-[#143F7E] sm:text-sm"
                placeholder="Search events"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center space-x-2">
              <label htmlFor="status" className="text-sm font-medium text-gray-700">Status:</label>
              <select
                id="status"
                name="status"
                className="block w-32 py-2 pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-[#143F7E] focus:border-[#143F7E] sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="past">Past</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label htmlFor="type" className="text-sm font-medium text-gray-700">Type:</label>
              <select
                id="type"
                name="type"
                className="block w-36 py-2 pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-[#143F7E] focus:border-[#143F7E] sm:text-sm rounded-md"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
              >
                <option value="all">All</option>
                <option value="wedding">Wedding</option>
                <option value="birthday">Birthday</option>
                <option value="corporate">Corporate</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
              <div className="h-48 w-full relative bg-gray-100">
                <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium uppercase">
                  {event.eventType}
                </div>
                {event.coverImage ? (
                  <img src={event.coverImage} alt={event.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#e0e7ff] via-[#f0fdfa] to-[#fef9c3] relative">
                  {event.eventType === 'wedding' ? (
                    // Wedding SVG: rings and flowers
                    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                    <circle cx="45" cy="45" r="40" fill="#f3f4f6" />
                    <ellipse cx="60" cy="60" rx="12" ry="12" fill="#fde68a" stroke="#fca5a5" strokeWidth="2"/>
                    <ellipse cx="40" cy="60" rx="12" ry="12" fill="#fff" stroke="#fca5a5" strokeWidth="2"/>
                    <circle cx="50" cy="55" r="4" fill="#fca5a5" />
                    <circle cx="50" cy="55" r="2" fill="#fff" />
                    <path d="M35 40 Q45 30 55 40" stroke="#a7f3d0" strokeWidth="2" fill="none"/>
                    <circle cx="45" cy="38" r="3" fill="#fca5a5" />
                    <circle cx="38" cy="42" r="2" fill="#fef9c3" />
                    <circle cx="52" cy="42" r="2" fill="#fef9c3" />
                    </svg>
                  ) : event.eventType === 'birthday' ? (
                    // Birthday SVG: cake and balloons
                    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                    <circle cx="45" cy="45" r="40" fill="#f3f4f6" />
                    <rect x="30" y="55" width="30" height="12" rx="6" fill="#fde68a" />
                    <rect x="35" y="48" width="20" height="10" rx="5" fill="#fca5a5" />
                    <rect x="43" y="42" width="4" height="8" rx="2" fill="#a7f3d0" />
                    <circle cx="45" cy="41" r="2" fill="#fbbf24" />
                    <path d="M45 41 V37" stroke="#fbbf24" strokeWidth="2" />
                    {/* Balloons */}
                    <ellipse cx="60" cy="38" rx="5" ry="7" fill="#a7f3d0" />
                    <ellipse cx="30" cy="38" rx="5" ry="7" fill="#c7d2fe" />
                    <path d="M60 45 Q60 48 58 50" stroke="#a7f3d0" strokeWidth="1.5" />
                    <path d="M30 45 Q30 48 32 50" stroke="#c7d2fe" strokeWidth="1.5" />
                    </svg>
                  ) : event.eventType === 'corporate' ? (
                    // Corporate SVG: buildings and briefcase
                    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                    <circle cx="45" cy="45" r="40" fill="#f3f4f6" />
                    {/* Buildings */}
                    <rect x="25" y="50" width="12" height="18" rx="2" fill="#c7d2fe" />
                    <rect x="39" y="44" width="12" height="24" rx="2" fill="#818cf8" />
                    <rect x="53" y="56" width="12" height="12" rx="2" fill="#a7f3d0" />
                    {/* Briefcase */}
                    <rect x="38" y="62" width="14" height="8" rx="2" fill="#fde68a" stroke="#fca5a5" strokeWidth="1.5"/>
                    <rect x="42" y="60" width="6" height="4" rx="1" fill="#fca5a5" />
                    <rect x="44" y="66" width="2" height="2" rx="1" fill="#fff" />
                    </svg>
                  ) : (
                    // Default SVG: abstract shapes
                    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                    <circle cx="45" cy="45" r="40" fill="#f3f4f6" />
                    <circle cx="45" cy="45" r="28" fill="#c7d2fe" />
                    <rect x="30" y="30" width="30" height="30" rx="8" fill="#fef9c3" />
                    <circle cx="45" cy="45" r="10" fill="#bbf7d0" />
                    <path d="M35 55 Q45 35 55 55" stroke="#818cf8" strokeWidth="2" fill="none" />
                    </svg>
                  )}
                  <span className="absolute bottom-2 left-5 text-xs text-gray-400">{event.theme.toUpperCase()}</span>
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{event.name}</h3>
                
                <div className="mt-2 flex items-center space-x-2">
                  {event.status === 'active' ? (
                  <>
                    <span className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
                    <span className="text-green-700 text-sm font-medium">Active</span>
                    </span>
                  </>
                  ) : event.status === 'draft' ? (
                  <>
                    <span className="flex items-center">
                    <NotebookIcon className="w-5 pb-0.5 text-yellow-500 mr-1" />
                    <span className="text-yellow-700 text-sm font-medium">Draft</span>
                    </span>
                  </>
                  ) : event.status === 'completed' ? (
                  <>
                    <span className="flex items-center">
                    <CheckBadgeIcon className="h-5 w-5 text-gray-400 mr-1" />
                    <span className="text-gray-500 text-sm font-medium">Completed</span>
                    </span>
                  </>
                  ) : (
                  <>
                    <span className="flex items-center">
                    <FileWarningIcon className="h-5 w-5 text-gray-400 mr-1" />
                    <span className="text-gray-500 text-sm font-medium capitalize">{event.status || 'Unknown'}</span>
                    </span>
                  </>
                  )}
                </div>
                
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-600">
                      Max Guests: {event.maxGuests}
                    </div>
                    <div className="text-gray-600">
                      {event.visibility === 'public' ? (
                        <span className="inline-flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Public
                        </span>
                      ) : (
                        <span className="inline-flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                          Private
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-1 text-xs text-gray-500">
                  Event Date: {format(new Date(event.date), 'PP')}
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  Created: {format(new Date(event.createdAt), 'PP')}
                </div>
                
                <div className="mt-5 flex justify-between">
                  <div className="flex space-x-2">
                    <Link 
                      href={`/events/create/${event.eventType}/${event.id}`} 
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#143F7E] hover:bg-[#143F7E]/90"
                    >
                      Configure Template
                    </Link>
                    
                    {/* View button - only shown when status is not draft */}
                    {event.status !== 'draft' && (
                      <Link 
                        href={`/event/${event.eventType}/${event.theme.toLowerCase().replace(/ /g, '-')}/${event.id}`}
                        target='_blank'
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gradient-to-r from-[#297B46] to-[#143F7E] hover:opacity-90 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </Link>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link 
                      href={`/events/${event.id}/edit`} 
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      title="Edit event"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDeleteEvent(event.id, event.name)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                      aria-label={`Delete event ${event.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filteredEvents.length === 0 && events.length > 0
                ? "No events match your filter criteria."
                : "Get started by creating a new event."}
            </p>
            <div className="mt-6">
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#143F7E] to-[#297B46] hover:opacity-90"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create New Event
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Create Event Modal */}
      <Dialog
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        name="Create New Event"
        description="Fill in the details to create a new event"
        size="lg"
      >
        <EventCreationForm
          onSubmit={handleCreateEvent}
          onCancel={closeCreateModal}
          isSubmitting={isSubmitting}
        />
      </Dialog>
    </div>
  );
}