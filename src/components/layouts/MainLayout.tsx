import Link from 'next/link';
import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-purple-600">
            DiShEvent
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/#features" className="text-gray-600 hover:text-purple-600">
              Features
            </Link>
            <Link href="/#pricing" className="text-gray-600 hover:text-purple-600">
              Pricing
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-purple-600">
              Login
            </Link>
            <Link 
              href="/signup" 
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Sign Up
            </Link>
          </nav>
          
          {/* Mobile menu button - would need JavaScript to toggle menu */}
          <button className="md:hidden p-2" title="Open mobile menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">DiShEvent</h3>
              <p className="text-gray-300">
                Create beautiful digital invitations for all your special events.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/#features" className="text-gray-300 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/#pricing" className="text-gray-300 hover:text-white">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Account</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/login" className="text-gray-300 hover:text-white">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-gray-300 hover:text-white">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-gray-300 hover:text-white">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} DiShEvent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}