'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back to DiShEvent</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Events</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">3</h3>
            </div>
            <div className="p-3 bg-gradient-to-br from-[#143F7E]/20 to-[#297B46]/10 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#143F7E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex space-x-2 items-center text-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-gray-600">1 active</span>
              <span className="inline-block w-2 h-2 rounded-full bg-gray-400 ml-2"></span>
              <span className="text-gray-600">2 past</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total RSVPs</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">45</h3>
            </div>
            <div className="p-3 bg-gradient-to-br from-[#297B46]/20 to-[#143F7E]/10 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#297B46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex space-x-2 items-center text-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-gray-600">32 yes</span>
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 ml-2"></span>
              <span className="text-gray-600">8 no</span>
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 ml-2"></span>
              <span className="text-gray-600">5 maybe</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Page Views</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">218</h3>
            </div>
            <div className="p-3 bg-gradient-to-br from-[#143F7E]/20 to-[#297B46]/5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#143F7E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-[#143F7E] to-[#297B46] h-2 rounded-full" style={{ width: '36%' }}></div>
            </div>
            <span className="ml-2 text-sm text-gray-600">78 unique</span>
          </div>
        </div>
      </div>

      {/* Recent Events with Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="flex justify-between items-center px-6 pt-5 pb-0">
          <div className="flex space-x-4 border-b border-gray-200 w-full">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`pb-3 px-1 ${
                activeTab === 'upcoming' 
                ? 'border-b-2 border-[#143F7E] text-[#143F7E] font-medium' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`pb-3 px-1 ${
                activeTab === 'past' 
                ? 'border-b-2 border-[#143F7E] text-[#143F7E] font-medium' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Past Events
            </button>
            <div className="flex-grow border-b border-gray-200"></div>
            <div className="pb-3">
              <Link href="/events" className="text-[#143F7E] hover:text-[#143F7E]/80 text-sm font-medium">
                View All
              </Link>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RSVPs
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeTab === 'upcoming' ? (
                <>
                  {/* Event 1 */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-[#297B46]/10 to-[#297B46]/5 rounded-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#297B46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Wedding Reception</div>
                          <div className="text-xs text-gray-500">wedding</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Oct 15, 2025</div>
                      <div className="text-xs text-gray-500">5:00 PM</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                          </div>
                          <span>24/100</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      125
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href="/events/1" className="text-[#143F7E] hover:text-[#143F7E]/80 mr-4">View</Link>
                      <Link href="/events/1/edit" className="text-gray-600 hover:text-gray-900">Edit</Link>
                    </td>
                  </tr>
                  
                  {/* Event 2 */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-[#143F7E]/10 to-[#143F7E]/5 rounded-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#143F7E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">30th Birthday Party</div>
                          <div className="text-xs text-gray-500">birthday</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Nov 5, 2025</div>
                      <div className="text-xs text-gray-500">8:00 PM</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '36%' }}></div>
                          </div>
                          <span>18/50</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      43
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href="/events/2" className="text-[#143F7E] hover:text-[#143F7E]/80 mr-4">View</Link>
                      <Link href="/events/2/edit" className="text-gray-600 hover:text-gray-900">Edit</Link>
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  {/* Event 3 (Past) */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Q3 Planning Meeting</div>
                          <div className="text-xs text-gray-500">corporate</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Sep 10, 2025</div>
                      <div className="text-xs text-gray-500">10:00 AM</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Past
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-gray-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                          </div>
                          <span>12/30</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      50
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href="/events/3" className="text-[#143F7E] hover:text-[#143F7E]/80 mr-4">View</Link>
                      <Link href="/events/3/edit" className="text-gray-600 hover:text-gray-900">Edit</Link>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/events/create" className="bg-white overflow-hidden shadow-sm rounded-xl p-6 hover:shadow-md transition-all border border-gray-100 flex items-center group">
            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-[#143F7E]/20 to-[#297B46]/20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-gradient-to-br group-hover:from-[#143F7E] group-hover:to-[#297B46] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#143F7E] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Create New Event</h3>
              <p className="text-sm text-gray-500">Wedding, Birthday, Corporate</p>
            </div>
          </Link>
          
          <Link href="/profile" className="bg-white overflow-hidden shadow-sm rounded-xl p-6 hover:shadow-md transition-all border border-gray-100 flex items-center group">
            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-[#143F7E]/20 to-[#297B46]/20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-gradient-to-br group-hover:from-[#143F7E] group-hover:to-[#297B46] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#143F7E] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Edit Profile</h3>
              <p className="text-sm text-gray-500">Update your information</p>
            </div>
          </Link>
          
          <Link href="/subscription" className="bg-white overflow-hidden shadow-sm rounded-xl p-6 hover:shadow-md transition-all border border-gray-100 flex items-center group">
            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-[#143F7E]/20 to-[#297B46]/20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-gradient-to-br group-hover:from-[#143F7E] group-hover:to-[#297B46] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#143F7E] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Manage Subscription</h3>
              <p className="text-sm text-gray-500">Upgrade your plan</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}