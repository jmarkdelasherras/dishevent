import Link from 'next/link';
import Image from 'next/image';
import MobileMenuButton from '../components/MobileMenuButton';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <header className="fixed w-full z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <Image 
                src="/assets/logo.png" 
                alt="DiShEvent Logo" 
                width={40} 
                height={40}
                className="mr-2"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#143F7E] to-[#297B46] text-transparent bg-clip-text bg-white/95">DiShEvent</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-700 hover:text-[#143F7E] font-medium transition-colors">
                Features
              </Link>
              <Link href="#event-types" className="text-gray-700 hover:text-[#297B46] font-medium transition-colors">
                Events
              </Link>
              <Link href="#pricing" className="text-gray-700 hover:text-[#143F7E] font-medium transition-colors">
                Pricing
              </Link>
              <Link href="#testimonials" className="text-gray-700 hover:text-[#297B46] font-medium transition-colors">
                Testimonials
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-[#143F7E] font-medium hidden md:block">
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-[#143F7E] to-[#297B46] hover:from-[#0d2c59] hover:to-[#1d6234] text-[#FDFEFD] px-6 py-2 rounded-full font-medium transition-colors"
              >
                Sign Up
              </Link>
              <MobileMenuButton />
            </div>
          </div>
          
          {/* Mobile Menu */}
          <div id="mobile-menu" className="hidden md:hidden py-4 bg-white border-t border-gray-100">
            <nav className="flex flex-col space-y-3 px-4">
              <Link href="#features" className="text-gray-700 hover:text-[#143F7E] font-medium transition-colors py-2">
                Features
              </Link>
              <Link href="#event-types" className="text-gray-700 hover:text-[#297B46] font-medium transition-colors py-2">
                Events
              </Link>
              <Link href="#pricing" className="text-gray-700 hover:text-[#143F7E] font-medium transition-colors py-2">
                Pricing
              </Link>
              <Link href="#testimonials" className="text-gray-700 hover:text-[#297B46] font-medium transition-colors py-2">
                Testimonials
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-[#143F7E] font-medium py-2">
                Log in
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main>
        {/* Hero Section */}
        <section className="h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-blue-50 to-green-50">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#297B46" strokeWidth="0.5" opacity="0.3" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 pt-16">
            <div className="flex flex-col-reverse md:flex-row items-center">
              <div className="md:w-1/2 mt-10 md:mt-0 md:pr-8">
                <div className="inline-block px-4 py-1 rounded-full bg-[#143F7E]/10 text-[#143F7E] text-sm font-medium mb-4">
                  Make your events memorable
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#143F7E] to-[#297B46] text-transparent bg-clip-text bg-white/95 drop-shadow-sm">
                  Digital Invitations & RSVP Made Simple
                </h1>
                <p className="text-lg text-gray-700 mb-8">
                  Create beautiful digital invitations in minutes. Share with a link, collect RSVPs, and manage your guests all in one place. No more spreadsheets or missed responses!
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/events/create"
                    className="bg-gradient-to-r from-[#143F7E] to-[#297B46] hover:from-[#0d2c59] hover:to-[#1d6234] text-[#FDFEFD] px-8 py-3 rounded-full font-medium transition-colors shadow-md hover:shadow-lg"
                  >
                    Create Your Invitation
                  </Link>
                  <Link
                    href="#features"
                    className="border border-[#297B46]/30 hover:border-[#297B46] text-[#143F7E] px-8 py-3 rounded-full font-medium transition-colors"
                  >
                    See How It Works
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="relative w-full h-[300px] md:h-[400px] rounded-xl shadow-xl overflow-hidden border-8 border-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#143F7E] to-[#297B46] opacity-90"></div>
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <div className="bg-white w-full max-w-sm rounded-xl shadow-lg p-6 transform rotate-2">
                        <div className="text-center mb-4">
                          <h3 className="text-2xl font-bold text-[#143F7E]">Sarah & Michael</h3>
                          <p className="text-gray-500">invite you to their wedding</p>
                        </div>
                        <div className="text-center my-6">
                          <div className="text-3xl font-light">June 12, 2025</div>
                          <div className="text-gray-500">4:00 PM</div>
                          <div className="mt-2">Crystal Garden Venue</div>
                        </div>
                        <div className="mt-6 flex justify-center space-x-4">
                          <button className="px-6 py-2 bg-[#297B46] text-white rounded-full">RSVP Yes</button>
                          <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full">RSVP No</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-[#297B46] rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-[#FDFEFD] font-bold text-xl">Simple</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="min-h-screen flex items-center bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#143F7E] to-[#297B46] text-transparent bg-clip-text bg-white/95 drop-shadow-sm">
                Beautiful Digital Invitations Made Simple
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Create stunning event invitations, collect RSVPs, and manage your guest list all in one place
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 - Beautiful Invitations */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 hover:border-[#143F7E]/30 group">
                <div className="w-16 h-16 bg-[#143F7E]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#143F7E]/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#143F7E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Beautiful Invitations</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  Choose from dozens of professionally designed templates for any event type. Customize colors, fonts, and images to match your event theme.
                </p>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-[#297B46] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Themed templates for all occasions</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-[#297B46] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Custom colors and font options</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-[#297B46] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Photo uploads and galleries</span>
                  </li>
                </ul>
              </div>
              
              {/* Feature 2 - RSVP Management */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 hover:border-[#297B46]/30 group">
                <div className="w-16 h-16 bg-[#297B46]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#297B46]/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#297B46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">RSVP Management</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  Collect RSVPs online with custom questions. Get real-time updates when guests respond and manage your attendee list effortlessly.
                </p>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-[#297B46] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>One-click RSVP responses</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-[#297B46] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Custom questions (meal choices, etc.)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-[#297B46] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Real-time response notifications</span>
                  </li>
                </ul>
              </div>
              
              {/* Feature 3 - Guest List Management */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 hover:border-[#143F7E]/30 group">
                <div className="w-16 h-16 bg-[#143F7E]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#143F7E]/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#143F7E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Guest List Management</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  Organize your guests by groups, track responses, and communicate with attendees all from one dashboard.
                </p>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-[#297B46] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Organize guests into groups</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-[#297B46] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Export guest list as spreadsheet</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-[#297B46] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Send updates to all guests</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Event Types Section */}
        <section id="event-types" className="min-h-screen flex items-center bg-white relative overflow-hidden py-12">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="confetti" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="2" fill="#143F7E" />
                    <circle cx="30" cy="20" r="1.5" fill="#297B46" />
                    <circle cx="15" cy="30" r="1" fill="#143F7E" />
                    <path d="M25,5 L27,9 L23,9 Z" fill="#297B46" />
                    <path d="M35,25 L37,29 L33,29 Z" fill="#143F7E" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#confetti)" />
              </svg>
            </div>
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#143F7E] to-[#297B46] text-transparent bg-clip-text bg-white/95 drop-shadow-sm">
                Perfect for Any Occasion
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Stunning invitation templates designed specifically for your event type
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Event Type 1 */}
              <div className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#143F7E]/30">
                <div className="absolute inset-0 bg-gradient-to-t from-[#143F7E]/90 to-[#143F7E]/20 z-10 group-hover:opacity-95 transition-opacity"></div>
                <div className="h-60 md:h-64 bg-blue-50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 w-2/3 h-2/3 rounded-lg shadow-lg flex flex-col items-center justify-center p-4 transform -rotate-3">
                      <h4 className="text-sm md:text-base font-serif text-[#143F7E]">Save the Date</h4>
                      <h3 className="text-xl md:text-2xl font-bold mt-1">Sarah & Michael</h3>
                      <p className="my-1 text-xs md:text-sm">June 12, 2025</p>
                      <div className="w-12 h-0.5 bg-[#143F7E] my-1"></div>
                      <p className="text-xs md:text-sm italic">Formal invitation to follow</p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-lg font-bold text-white mb-1">Wedding Invitations</h3>
                  <p className="text-white/90 mb-2 text-sm">Elegant designs for your special day</p>
                  <ul className="text-white/90 mb-4 text-xs space-y-1">
                    <li className="flex items-center">
                      <svg className="w-3 h-3 text-white mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span>Save the dates</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-3 h-3 text-white mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span>RSVP with meal choices</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-3 h-3 text-white mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span>Registry information</span>
                    </li>
                  </ul>
                  <Link 
                    href="/events/create/wedding"
                    className="inline-flex items-center justify-center w-full text-center bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Create Wedding Invitation
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </Link>
                </div>
              </div>
              
              {/* Event Type 2 */}
              <div className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#297B46]/30">
                <div className="absolute inset-0 bg-gradient-to-t from-[#297B46]/90 to-[#297B46]/20 z-10 group-hover:opacity-95 transition-opacity"></div>
                <div className="h-60 md:h-64 bg-green-50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 w-2/3 h-2/3 rounded-lg shadow-lg flex flex-col items-center justify-center p-4 transform rotate-2">
                      <h3 className="text-lg md:text-xl font-bold text-[#297B46] mb-1">Birthday Party!</h3>
                      <h4 className="text-xl md:text-2xl font-bold">Emma is turning 8</h4>
                      <div className="my-1 flex">
                        <span className="text-lg mx-1">🎁</span>
                        <span className="text-lg mx-1">🎂</span>
                        <span className="text-lg mx-1">🎈</span>
                      </div>
                      <p className="text-xs md:text-sm">Saturday, October 15th @ 2PM</p>
                      <p className="text-xs md:text-sm mt-1">123 Fun Street</p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-lg font-bold text-white mb-1">Birthday Invitations</h3>
                  <p className="text-white/90 mb-2 text-sm">Fun designs for all ages</p>
                  <ul className="text-white/90 mb-4 text-xs space-y-1">
                    <li className="flex items-center">
                      <svg className="w-3 h-3 text-white mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span>Themed designs for kids & adults</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-3 h-3 text-white mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span>Gift preferences</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-3 h-3 text-white mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span>Allergy & special needs notes</span>
                    </li>
                  </ul>
                  <Link 
                    href="/events/create/birthday"
                    className="inline-flex items-center justify-center w-full text-center bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Create Birthday Invitation
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </Link>
                </div>
              </div>
              
              {/* Event Type 3 */}
              <div className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#143F7E]/30">
                <div className="absolute inset-0 bg-gradient-to-t from-[#143F7E]/90 to-[#143F7E]/20 z-10 group-hover:opacity-95 transition-opacity"></div>
                <div className="h-60 md:h-64 bg-blue-50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 w-2/3 h-2/3 rounded-lg shadow-lg flex flex-col items-center justify-center p-4">
                      <h4 className="text-xs uppercase tracking-wider text-gray-500">TechCorp Presents</h4>
                      <h3 className="text-lg md:text-xl font-bold text-[#143F7E] mt-1">Q3 Product Launch</h3>
                      <div className="w-10 h-0.5 bg-[#143F7E] my-1"></div>
                      <p className="text-xs md:text-sm">August 22, 2025 • 10:00 AM</p>
                      <p className="text-xs md:text-sm mt-1">Virtual & In-Person</p>
                      <button className="mt-2 px-3 py-0.5 bg-[#143F7E]/10 text-[#143F7E] text-xs rounded-full">RSVP Required</button>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-lg font-bold text-white mb-1">Business Invitations</h3>
                  <p className="text-white/90 mb-2 text-sm">Professional designs for work events</p>
                  <ul className="text-white/90 mb-4 text-xs space-y-1">
                    <li className="flex items-center">
                      <svg className="w-3 h-3 text-white mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span>Corporate branding options</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-3 h-3 text-white mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span>Calendar integration</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-3 h-3 text-white mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span>Virtual meeting links</span>
                    </li>
                  </ul>
                  <Link 
                    href="/events/create/corporate"
                    className="inline-flex items-center justify-center w-full text-center bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Create Business Invitation
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="min-h-screen flex items-center py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#143F7E] to-[#297B46] text-transparent bg-clip-text bg-white/95 drop-shadow-sm">
                Pay Only For What You Need
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our simple pay-per-event pricing gives you flexibility without monthly commitments.
              </p>
              
              <div className="flex justify-center mt-6 mb-4 space-x-4">
                <button className="px-5 py-2 rounded-full bg-gradient-to-r from-[#143F7E] to-[#297B46] text-white font-medium text-sm">Pay Per Event</button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Free</h3>
                  <div className="text-3xl font-bold mb-2">$0</div>
                  <p className="text-gray-600 text-sm">Perfect for trying out</p>
                </div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#297B46] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>1 event at a time</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#297B46] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>Up to 30 RSVPs</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#297B46] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>Basic theme (1 per type)</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-gray-300 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    <span className="text-gray-400">DiShEvent watermark included</span>
                  </li>
                </ul>
                <Link
                  href="/signup"
                  className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-6 rounded-lg transition-colors w-full text-sm"
                >
                  Get Started Free
                </Link>
              </div>
              
              {/* Basic Plan */}
              <div className="bg-gradient-to-br from-[#143F7E] to-[#297B46] rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 transform scale-105">
                <div className="text-center mb-4">
                  <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-2">Most Popular</div>
                  <h3 className="text-xl font-bold mb-2 text-white">Basic</h3>
                  <div className="text-3xl font-bold mb-2 text-white">$9<span className="text-white/70 text-lg font-normal">/event</span></div>
                  <p className="text-white/90 text-sm">Perfect for special occasions</p>
                </div>
                <ul className="space-y-2 mb-6 text-sm text-white">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-white mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>Single event purchase</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-white mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>Up to 100 RSVPs</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-white mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>All themes (2 per type)</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-white mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>No DiShEvent watermark</span>
                  </li>
                </ul>
                <Link
                  href="/signup?plan=basic"
                  className="block text-center bg-white hover:bg-gray-100 text-[#143F7E] font-medium py-2.5 px-6 rounded-lg transition-colors w-full text-sm"
                >
                  Choose Basic
                </Link>
              </div>
              
              {/* Premium Plan */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Premium</h3>
                  <div className="text-3xl font-bold mb-2">$29<span className="text-gray-500 text-lg font-normal">/event</span></div>
                  <p className="text-gray-600 text-sm">For luxury events & weddings</p>
                </div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#297B46] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>Single event purchase</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#297B46] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>Unlimited RSVPs</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#297B46] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>All themes + custom themes</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#297B46] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>Priority support & analytics</span>
                  </li>
                </ul>
                <Link
                  href="/signup?plan=premium"
                  className="block text-center bg-gradient-to-r from-[#143F7E]/90 to-[#297B46]/90 hover:from-[#143F7E] hover:to-[#297B46] text-white font-medium py-2.5 px-6 rounded-lg transition-colors w-full text-sm"
                >
                  Choose Premium
                </Link>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link href="/subscription" className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-[#143F7E] to-[#297B46] hover:opacity-90">
                View Full Pricing Details
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50"></div>
          <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2720%27%20height%3D%2720%27%20viewBox%3D%270%200%2020%2020%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cg%20fill%3D%27%23143F7E%27%20fill-opacity%3D%270.2%27%20fill-rule%3D%27evenodd%27%3E%3Ccircle%20cx%3D%273%27%20cy%3D%273%27%20r%3D%273%27%2F%3E%3Ccircle%20cx%3D%2713%27%20cy%3D%2713%27%20r%3D%273%27%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] opacity-20"></div>
            <svg className="absolute left-10 top-10 w-96 h-96 text-[#143F7E]/5" fill="currentColor" viewBox="0 0 100 100">
              <path d="M50 0 L100 50 L50 100 L0 50 Z"></path>
            </svg>
            <svg className="absolute right-10 bottom-10 w-96 h-96 text-[#297B46]/5" fill="currentColor" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="50"></circle>
            </svg>
            <svg className="absolute top-1/4 right-1/4 w-64 h-64 text-[#143F7E]/5 rotate-45" fill="currentColor" viewBox="0 0 100 100">
              <path d="M50 0 L100 50 L50 100 L0 50 Z"></path>
            </svg>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#143F7E] to-[#297B46] text-transparent bg-clip-text bg-white/95 drop-shadow-sm">
                What Our Users Are Saying
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of people who have simplified their event invitations with DiShEvent
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100 group hover:border-[#143F7E]/40 transform hover:-translate-y-1">
                <div className="flex flex-col items-center mb-8 relative">
                  <div className="w-24 h-24 overflow-hidden rounded-full border-4 border-[#143F7E]/20 mb-4 shadow-md group-hover:border-[#143F7E]/40 transition-all duration-300">
                    <div className="w-full h-full bg-gradient-to-br from-[#143F7E]/20 to-[#143F7E]/10 flex items-center justify-center">
                      <span className="text-[#143F7E] font-bold text-2xl">JM</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-lg">Jessica Martinez</h4>
                    <p className="text-sm text-gray-500">Wedding Bride</p>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#143F7E] to-[#143F7E]/80 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
                <div className="relative mb-8">
                  <svg className="absolute -top-6 -left-2 h-10 w-10 text-[#143F7E]/10" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path>
                  </svg>
                  <p className="text-gray-700 italic text-center px-4">
                    I was so stressed about our wedding invitations until I found DiShEvent. We created beautiful digital invitations in minutes, and tracking RSVPs was effortless! Our guests loved being able to respond right from their phones.
                  </p>
                  <svg className="absolute -bottom-6 -right-2 h-10 w-10 text-[#143F7E]/10 transform rotate-180" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path>
                  </svg>
                </div>
                <div className="mt-4 flex justify-center">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                </div>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100 group hover:border-[#297B46]/40 transform hover:-translate-y-1">
                <div className="flex flex-col items-center mb-8 relative">
                  <div className="w-24 h-24 overflow-hidden rounded-full border-4 border-[#297B46]/20 mb-4 shadow-md group-hover:border-[#297B46]/40 transition-all duration-300">
                    <div className="w-full h-full bg-gradient-to-br from-[#297B46]/20 to-[#297B46]/10 flex items-center justify-center">
                      <span className="text-[#297B46] font-bold text-2xl">RJ</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-lg">Robert Jackson</h4>
                    <p className="text-sm text-gray-500">Birthday Party Host</p>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#297B46] to-[#297B46]/80 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                    </svg>
                  </div>
                </div>
                <div className="relative mb-8">
                  <svg className="absolute -top-6 -left-2 h-10 w-10 text-[#297B46]/10" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path>
                  </svg>
                  <p className="text-gray-700 italic text-center px-4">
                    Planning my 40th birthday was so much easier with DiShEvent. I chose a template, added my details, and sent digital invites to everyone in minutes. The RSVP tracking saved me from countless &apos;are you coming?&apos; texts!
                  </p>
                  <svg className="absolute -bottom-6 -right-2 h-10 w-10 text-[#297B46]/10 transform rotate-180" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path>
                  </svg>
                </div>
                <div className="mt-4 flex justify-center">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                </div>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100 group hover:border-[#143F7E]/40 transform hover:-translate-y-1">
                <div className="flex flex-col items-center mb-8 relative">
                  <div className="w-24 h-24 overflow-hidden rounded-full border-4 border-[#143F7E]/20 mb-4 shadow-md group-hover:border-[#143F7E]/40 transition-all duration-300">
                    <div className="w-full h-full bg-gradient-to-br from-[#143F7E]/20 to-[#143F7E]/10 flex items-center justify-center">
                      <span className="text-[#143F7E] font-bold text-2xl">AL</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-lg">Amanda Lee</h4>
                    <p className="text-sm text-gray-500">Team Lead, Marketing Agency</p>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#143F7E] to-[#143F7E]/80 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
                <div className="relative mb-8">
                  <svg className="absolute -top-6 -left-2 h-10 w-10 text-[#143F7E]/10" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path>
                  </svg>
                  <p className="text-gray-700 italic text-center px-4">
                    Our quarterly team meetings are so much easier to organize with DiShEvent. The digital invitations look professional, and the attendance tracking feature helps us plan catering perfectly. Well worth the small upgrade fee.
                  </p>
                  <svg className="absolute -bottom-6 -right-2 h-10 w-10 text-[#143F7E]/10 transform rotate-180" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path>
                  </svg>
                </div>
                <div className="mt-4 flex justify-center">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#143F7E]/90 to-[#297B46]/90"></div>
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="envelopes" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M10,10 L20,5 L20,15 L10,10 L0,15 L0,5 L10,10" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#envelopes)" />
            </svg>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20">
              <span className="inline-block px-4 py-1 bg-white/20 text-white text-sm font-medium rounded-full mb-4 drop-shadow">
                Say goodbye to paper invitations
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-md">Create Your First Digital Invitation</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow">
                Start with a free invitation today. Pay only when you need premium features for your important events.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/signup"
                  className="bg-white hover:bg-gray-100 text-[#143F7E] px-8 py-3 rounded-full font-medium transition-colors shadow-md hover:shadow-lg"
                >
                  Create Free Invitation
                </Link>
                <Link
                  href="/templates"
                  className="border-2 border-white hover:bg-white/10 text-white px-8 py-3 rounded-full font-medium transition-colors"
                >
                  Browse Templates
                </Link>
              </div>
              <p className="text-white/80 mt-8 text-sm drop-shadow">
                No credit card required for free invitations • Upgrade anytime
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center mb-4">
                <Image 
                  src="/assets/logo.png" 
                  alt="DiShEvent Logo" 
                  width={40} 
                  height={40}
                  className="mr-2"
                />
                <span className="text-2xl font-bold bg-gradient-to-r from-[#FDFEFD] to-[#FDFEFD] text-transparent bg-clip-text">DiShEvent</span>
              </Link>
              <p className="text-gray-400">
                Beautiful digital invitations and effortless RSVP management for all your events.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/tutorials" className="text-gray-400 hover:text-white transition-colors">Tutorials</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors">Support Center</Link></li>
                <li><Link href="/api" className="text-gray-400 hover:text-white transition-colors">API Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <span className="text-gray-400">support@dishevent.com</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </li>
              </ul>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors" title="Twitter">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-labelledby="twitterTitle">
                    <title id="twitterTitle">Twitter</title>
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" title="Instagram">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-labelledby="instagramTitle">
                    <title id="instagramTitle">Instagram</title>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" title="Facebook">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-labelledby="facebookTitle">
                    <title id="facebookTitle">Facebook</title>
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} DiShEvent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
