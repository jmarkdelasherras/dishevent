import Link from 'next/link';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function CreateEventPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
        <p className="text-gray-600 mt-1">Select the type of event you want to create</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wedding Event Card */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-purple-100 hover:border-purple-300 transition-colors">
          <div className="bg-purple-50 px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-purple-800">Wedding Event</h2>
              <div className="rounded-full bg-purple-100 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="text-gray-600 mb-6">Create an elegant wedding event with all the features needed for your special day. Includes RSVP management, guest lists, and more.</p>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Available Themes:</h3>
            <ul className="list-disc list-inside mb-6 text-gray-600">
              <li>Classic Elegance</li>
              <li>Modern Minimalist</li>
              <li>Rustic Romance</li>
            </ul>
            <Link
              href="/events/create/wedding"
              className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Create Wedding Event
            </Link>
          </div>
        </div>
        
        {/* Birthday Event Card */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-blue-100 hover:border-blue-300 transition-colors">
          <div className="bg-blue-50 px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-blue-800">Birthday Event</h2>
              <div className="rounded-full bg-blue-100 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="text-gray-600 mb-6">Perfect for birthdays, baby showers, and other celebrations. Features colorful designs, party planning tools, and gift registries.</p>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Available Themes:</h3>
            <ul className="list-disc list-inside mb-6 text-gray-600">
              <li>Fun & Festive</li>
              <li>Colorful Celebration</li>
              <li>Milestone Moment</li>
            </ul>
            <Link
              href="/events/create/birthday"
              className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Birthday Event
            </Link>
          </div>
        </div>
        
        {/* Corporate Event Card */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 hover:border-gray-300 transition-colors">
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">Corporate Event</h2>
              <div className="rounded-full bg-gray-100 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="text-gray-600 mb-6">Ideal for business meetings, conferences, and professional gatherings. Includes attendance tracking, scheduling, and presentation support.</p>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Available Themes:</h3>
            <ul className="list-disc list-inside mb-6 text-gray-600">
              <li>Professional Business</li>
              <li>Modern Conference</li>
              <li>Executive Summit</li>
            </ul>
            <Link
              href="/events/create/corporate"
              className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Create Corporate Event
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">All Events Include</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Custom Invitation Link</h3>
              <p className="text-sm text-gray-500">Shareable link to send to guests</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">RSVP Management</h3>
              <p className="text-sm text-gray-500">Track guest responses</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Customizable Design</h3>
              <p className="text-sm text-gray-500">Select from multiple themes</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Detailed Analytics</h3>
              <p className="text-sm text-gray-500">Track views and engagement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Use the DashboardLayout for this page
CreateEventPage.getLayout = function getLayout(page: React.ReactNode) {
  return <DashboardLayout>{page}</DashboardLayout>;
};