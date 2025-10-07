import { notFound } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';

// This will be replaced with actual data fetching
async function getEventDetails(id: string) {
  // Mock data for demonstration
  const events = {
    '1': {
      id: '1',
      title: 'Wedding Reception',
      type: 'wedding',
      date: 'October 15, 2025',
      time: '5:00 PM',
      location: 'Grand Ballroom, 123 Event St, City',
      description: 'Join us to celebrate our special day with dinner, dancing, and joy.',
      totalInvited: 100,
      accepted: 24,
      declined: 8,
      pending: 68,
      viewCount: 125,
      createdAt: '2023-05-10',
      theme: 'Classic',
      status: 'active'
    },
    '2': {
      id: '2',
      title: '30th Birthday Party',
      type: 'birthday',
      date: 'November 5, 2025',
      time: '8:00 PM',
      location: 'Rooftop Bar, 456 Party Ave, City',
      description: 'Help me celebrate turning 30 with drinks, food, and great company!',
      totalInvited: 50,
      accepted: 18,
      declined: 5,
      pending: 27,
      viewCount: 43,
      createdAt: '2023-06-15',
      theme: 'Fun',
      status: 'active'
    },
    '3': {
      id: '3',
      title: 'Q3 Planning Meeting',
      type: 'corporate',
      date: 'September 10, 2025',
      time: '10:00 AM',
      location: 'Conference Room B, 789 Business Pkwy, City',
      description: 'Quarterly planning meeting to discuss goals and strategy for Q3.',
      totalInvited: 30,
      accepted: 12,
      declined: 3,
      pending: 15,
      viewCount: 50,
      createdAt: '2023-04-20',
      theme: 'Professional',
      status: 'past'
    }
  };
  
  return events[id as keyof typeof events] || null;
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // For server components, we don't need to use React.use() as they are already async
  // and will properly await the params promise
  const { id } = await Promise.resolve(params);
  const event = await getEventDetails(id);
  
  if (!event) {
    notFound();
  }
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{event.title}</h1>
          <p className="text-gray-600 mt-1">{event.type.charAt(0).toUpperCase() + event.type.slice(1)} Event</p>
        </div>
        
        <div className="flex space-x-3">
          <a 
            href={`/events/${id}/edit`} 
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Edit
          </a>
          <a 
            href={`/invite/${id}`} 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            View Public Page
          </a>
        </div>
      </div>
      
      {/* Event Status Banner */}
      <div className={`p-4 rounded-lg ${
        event.status === 'active' ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'
      }`}>
        <div className="flex">
          <div className={`flex-shrink-0 ${
            event.status === 'active' ? 'text-green-400' : 'text-gray-400'
          }`}>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className={`text-sm font-medium ${
              event.status === 'active' ? 'text-green-800' : 'text-gray-800'
            }`}>
              {event.status === 'active' 
                ? 'This event is active and accepting RSVPs' 
                : 'This event has passed'}
            </h3>
            <div className={`mt-2 text-sm ${
              event.status === 'active' ? 'text-green-700' : 'text-gray-700'
            }`}>
              <p>
                {event.status === 'active' 
                  ? `Event scheduled for ${event.date} at ${event.time}` 
                  : `This event took place on ${event.date} at ${event.time}`}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Event Details and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Event Details</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Date & Time</dt>
                <dd className="mt-1 text-sm text-gray-900">{event.date} at {event.time}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900">{event.location}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Event Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Theme</dt>
                <dd className="mt-1 text-sm text-gray-900">{event.theme}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{event.description}</dd>
              </div>
            </dl>
          </div>
          
          {/* Guest List */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Guest List</h2>
              <a href={`/events/${id}/guests`} className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                Manage Guests
              </a>
            </div>
            
            {/* Guest Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-sm font-medium text-green-800">Accepted</p>
                <p className="text-2xl font-bold text-green-900">{event.accepted}</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-md">
                <p className="text-sm font-medium text-red-800">Declined</p>
                <p className="text-2xl font-bold text-red-900">{event.declined}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-800">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{event.pending}</p>
              </div>
            </div>
            
            {/* Recent RSVPs */}
            <h3 className="text-sm font-medium text-gray-900 mb-2">Recent Responses</h3>
            <div className="overflow-hidden rounded-md border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      Jane Cooper
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Accepted
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      Yesterday
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      Mike Smith
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Declined
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      2 days ago
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      Sarah Johnson
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Accepted
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      3 days ago
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      Robert Lee
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Accepted
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      4 days ago
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      Emily Davis
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Declined
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      5 days ago
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Event Stats */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Statistics</h2>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Total Invited</dt>
                <dd className="text-sm font-medium text-gray-900">{event.totalInvited}</dd>
              </div>
              
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Response Rate</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {Math.round(((event.accepted + event.declined) / event.totalInvited) * 100)}%
                </dd>
              </div>
              
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Page Views</dt>
                <dd className="text-sm font-medium text-gray-900">{event.viewCount}</dd>
              </div>
              
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Created On</dt>
                <dd className="text-sm font-medium text-gray-900">{event.createdAt}</dd>
              </div>
            </dl>
          </div>
          
          {/* Share Options */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Share Your Event</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="event-link" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Link
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="event-link"
                    id="event-link"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md sm:text-sm border border-gray-300"
                    value={`https://dishevent.com/invite/${id}`}
                    readOnly
                  />
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ml-2"
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">
                  Share via
                </p>
                <div className="flex space-x-2">
                  <button 
                    type="button" 
                    className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Share on Facebook"
                    title="Share on Facebook"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                    </svg>
                  </button>
                  
                  <button 
                    type="button" 
                    className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Share on Twitter"
                    title="Share on Twitter"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </button>
                  
                  <button 
                    type="button" 
                    className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    aria-label="Share on LinkedIn"
                    title="Share on LinkedIn"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </button>
                  
                  <button 
                    type="button" 
                    className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    aria-label="Share on YouTube"
                    title="Share on YouTube"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z" />
                    </svg>
                  </button>
                  
                  <button 
                    type="button" 
                    className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    aria-label="Share on Instagram"
                    title="Share on Instagram"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
            <div className="space-y-3">
              <button
                type="button"
                className="w-full inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Send Reminders
              </button>
              
              <button
                type="button"
                className="w-full inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                Export Guest List
              </button>
              
              <button
                type="button"
                className="w-full inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Duplicate Event
              </button>
              
              <button
                type="button"
                className="w-full inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Use the DashboardLayout for this page
EventDetailsPage.getLayout = function getLayout(page: React.ReactNode) {
  return <DashboardLayout>{page}</DashboardLayout>;
};