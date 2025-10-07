'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // Initialize state in useEffect to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { logout, userProfile } = useAuth(); // Get the logout function and user profile from useAuth hook
  
  // Add state for logout loading
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Handle sign out button click
  const handleSignOut = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    setIsLoggingOut(true);
    try {
      await logout();
      // Navigation will be handled by the logout function
    } catch (error) {
      console.error('Failed to sign out:', error);
      setIsLoggingOut(false); // Reset in case of error
    }
  };

  // Use useEffect to set mounted state to true and load sidebar state
  useEffect(() => {
    setMounted(true);
    
    // Load sidebar state from localStorage
    try {
      const savedSidebarState = localStorage.getItem('sidebarCollapsed');
      if (savedSidebarState !== null) {
        setSidebarCollapsed(savedSidebarState === 'true');
      }
    } catch (error) {
      // Ignore localStorage errors (may happen in SSR or if cookies disabled)
      console.error('Error accessing localStorage:', error);
    }
  }, []);
  
  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed));
      } catch (error) {
        // Ignore localStorage errors
        console.error('Error writing to localStorage:', error);
      }
    }
  }, [sidebarCollapsed, mounted]);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);
  
  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Only apply dynamic classes after client-side hydration */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 transform bg-white border-r border-gray-100 transition-all duration-300 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative ${mounted && sidebarCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex h-16 items-center justify-center border-b border-gray-100 bg-gradient-to-r from-[#143F7E]/5 to-[#297B46]/5">
          <Link href="/dashboard" className="flex items-center space-x-2 font-bold text-xl">
            <Image 
              src="/assets/logo.png" 
              alt="DiShEvent" 
              width={36} 
              height={36} 
              className="rounded-md"
            />
            <span className={`bg-gradient-to-r from-[#143F7E] to-[#297B46] bg-clip-text text-transparent ${
              mounted && sidebarCollapsed ? 'hidden' : 'block'
            }`}>
              DiShEvent
            </span>
          </Link>
        </div>
        
        <div className="overflow-y-auto py-4 h-[calc(100vh-4rem)]">
          <nav className="mt-2 px-3">
            <div className={`px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider ${
              mounted && sidebarCollapsed ? 'text-center' : ''
            }`}>
              {mounted && sidebarCollapsed ? 'Menu' : 'Main'}
            </div>
            
            <Link 
              href="/dashboard" 
              className={`flex items-center ${mounted && sidebarCollapsed ? 'justify-center' : ''} px-4 py-3 my-1 rounded-lg transition-all ${
                pathname === '/dashboard' 
                  ? 'bg-gradient-to-r from-[#143F7E] to-[#297B46] text-white font-medium shadow-sm' 
                  : 'text-gray-700 hover:bg-[#143F7E]/5 hover:text-[#143F7E]'
              }`}
              title="Dashboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${mounted && sidebarCollapsed ? '' : 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              {(!mounted || !sidebarCollapsed) && <span>Dashboard</span>}
            </Link>
            
            <Link 
              href="/events" 
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-4 py-3 my-1 rounded-lg transition-all ${
                pathname.startsWith('/events') && !pathname.startsWith('/events/create')
                  ? 'bg-gradient-to-r from-[#143F7E] to-[#297B46] text-white font-medium shadow-sm' 
                  : 'text-gray-700 hover:bg-[#143F7E]/5 hover:text-[#143F7E]'
              }`}
              title="My Events"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {!sidebarCollapsed && <span>My Events</span>}
            </Link>
            
            <Link 
              href="/events/create" 
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-4 py-3 my-1 rounded-lg transition-all ${
                pathname.startsWith('/events/create')
                  ? 'bg-gradient-to-r from-[#143F7E] to-[#297B46] text-white font-medium shadow-sm' 
                  : 'text-gray-700 hover:bg-[#143F7E]/5 hover:text-[#143F7E]'
              }`}
              title="Create Event"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {(!mounted || !sidebarCollapsed) && <span>Create Event</span>}
            </Link>
            
            <div className={`px-3 py-2 mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider ${
              mounted && sidebarCollapsed ? 'text-center' : ''
            }`}>
              {mounted && sidebarCollapsed ? 'Acc' : 'Account'}
            </div>
            
            <Link 
              href="/profile" 
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-4 py-3 my-1 rounded-lg transition-all ${
                pathname === '/profile'
                  ? 'bg-gradient-to-r from-[#143F7E] to-[#297B46] text-white font-medium shadow-sm'
                  : 'text-gray-700 hover:bg-[#143F7E]/5 hover:text-[#143F7E]'
              }`}
              title="Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {(!mounted || !sidebarCollapsed) && <span>Profile</span>}
            </Link>

            <Link 
              href="/subscription" 
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-4 py-3 my-1 rounded-lg transition-all ${
                pathname === '/subscription'
                  ? 'bg-gradient-to-r from-[#143F7E] to-[#297B46] text-white font-medium shadow-sm'
                  : 'text-gray-700 hover:bg-[#143F7E]/5 hover:text-[#143F7E]'
              }`}
              title="Subscription"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {!sidebarCollapsed && <span>Subscription</span>}
            </Link>
            
            {/* Help Section - hide when collapsed */}
            {(!mounted || !sidebarCollapsed) && (
              <div className="mt-6 px-3">
                <div className="bg-gradient-to-r from-[#143F7E]/10 to-[#297B46]/10 rounded-lg p-4">
                  <h4 className="font-medium text-sm text-gray-800">Need help?</h4>
                  <p className="text-xs text-gray-600 mt-1">Contact our support team for assistance with your events.</p>
                  <Link 
                    href="#" 
                    className="mt-3 text-xs inline-flex items-center font-medium text-[#143F7E] hover:underline"
                  >
                    <span>Get Support</span>
                    <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-6 px-3">
              <button 
                className={`flex w-full items-center justify-center px-4 py-2 text-white bg-gradient-to-r from-[#143F7E] to-[#297B46] rounded-md hover:opacity-90 transition-opacity ${isLoggingOut ? 'opacity-70 cursor-not-allowed' : ''}`}
                aria-label="Sign out"
                title="Sign out"
                onClick={handleSignOut}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {(!mounted || !sidebarCollapsed) && <span>Signing out...</span>}
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${mounted && sidebarCollapsed ? '' : 'mr-2'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {(!mounted || !sidebarCollapsed) && <span>Sign Out</span>}
                  </>
                )}
              </button>
            </div>
          </nav>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        {/* Topbar */}
        <header className="z-10 bg-white shadow-sm sticky top-0">
          <div className="flex h-16 items-center justify-end px-4 md:px-6">
            {/* Menu buttons - aligned to the start */}
            <div className="flex-1 flex items-center">
              {/* Mobile menu button (visible only on mobile) */}
              <button 
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100 md:hidden" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
              
              {/* Sidebar toggle button (visible only on desktop) */}
              <button 
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100 hidden md:flex" 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                )}
              </button>

              {/* Logo for mobile only */}
              <div className="md:hidden ml-2">
                <Link href="/dashboard" className="flex items-center space-x-2 font-bold">
                  <span className="bg-gradient-to-r from-[#143F7E] to-[#297B46] bg-clip-text text-transparent text-lg">
                    DiShEvent
                  </span>
                </Link>
              </div>
            </div>
            
            {/* User controls - aligned to the end */}
            <div className="flex items-center space-x-4">
              <button 
                className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Notifications"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="relative">
                <button 
                  className="flex items-center text-gray-700 hover:text-[#143F7E] transition-colors"
                  aria-label="User menu"
                >
                  <span className="mr-2 text-sm hidden sm:block">
                    {userProfile?.displayName || userProfile?.email?.split('@')[0] || 'Guest User'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#143F7E] to-[#297B46] text-white flex items-center justify-center">
                    {userProfile?.photoURL ? (
                      <Image 
                        src={userProfile.photoURL} 
                        alt="Profile" 
                        width={32} 
                        height={32} 
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {userProfile?.displayName 
                          ? `${userProfile.displayName.split(' ')[0]?.[0] || ''}${userProfile.displayName.split(' ')[1]?.[0] || ''}` 
                          : userProfile?.email?.[0] || 'G'}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[#F8FAFC] p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}