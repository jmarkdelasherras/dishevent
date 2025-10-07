import BaseTheme, { EventThemeProps } from '../BaseTheme';
import Image from 'next/image';
import Link from 'next/link';

export interface CorporateMinimalThemeProps extends EventThemeProps {
  extraFields: {
    organizationName: string;
    agenda: string;
    speakerList?: string[];
    sponsorList?: string[];
  };
}

const CorporateMinimal = ({
  eventId,
  title,
  date,
  time,
  location,
  description,
  coverImage,
  primaryColor = '#1F2937',
  secondaryColor = '#374151',
  accentColor = '#4B5563',
  extraFields,
  isPremium,
}: CorporateMinimalThemeProps) => {
  const primaryColorStyle = { color: primaryColor };
  const primaryBgStyle = { backgroundColor: primaryColor };
  
  return (
    <BaseTheme
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      accentColor={accentColor}
      className="corporate-minimal"
    >
      <div className="min-h-screen bg-white">
        {!isPremium && (
          <div className="absolute top-4 right-4 px-2 py-1 bg-gray-800 text-white text-xs uppercase tracking-wider rounded opacity-50">
            DiShEvent Watermark
          </div>
        )}
        
        <header className="bg-gray-50 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              {coverImage ? (
                <div className="w-24 h-24 relative">
                  <Image
                    src={coverImage}
                    alt={extraFields.organizationName}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-500">
                    {extraFields.organizationName.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold" style={primaryColorStyle}>{title}</h1>
            <p className="mt-2 text-xl text-gray-600">Presented by {extraFields.organizationName}</p>
            <div className="mt-6 inline-flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-700">{date} at {time}</span>
            </div>
            <div className="mt-2 inline-flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-700">{location}</span>
            </div>
          </div>
        </header>
        
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold mb-4" style={primaryColorStyle}>About the Event</h2>
                <p>{description}</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4" style={primaryColorStyle}>Agenda</h2>
                <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-gray-50 p-4 rounded-md">
                  {extraFields.agenda}
                </pre>
                
                {extraFields.speakerList && extraFields.speakerList.length > 0 && (
                  <>
                    <h2 className="text-2xl font-bold mt-8 mb-4" style={primaryColorStyle}>Speakers</h2>
                    <ul className="list-disc pl-5">
                      {extraFields.speakerList.map((speaker, index) => (
                        <li key={index} className="text-gray-700 mb-1">{speaker}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4" style={primaryColorStyle}>Event Details</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">Date & Time</div>
                    <div className="text-gray-700">{date} at {time}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Location</div>
                    <div className="text-gray-700">{location}</div>
                  </div>
                  {extraFields.sponsorList && extraFields.sponsorList.length > 0 && (
                    <div>
                      <div className="font-medium text-gray-900">Sponsors</div>
                      <div className="text-gray-700">
                        {extraFields.sponsorList.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-8">
                  <Link 
                    href={`/invite/${eventId}/rsvp`} 
                    className="block w-full py-3 px-4 text-center text-white font-medium rounded-md transition-opacity hover:opacity-90"
                    style={primaryBgStyle}
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </BaseTheme>
  );
};

export default CorporateMinimal;