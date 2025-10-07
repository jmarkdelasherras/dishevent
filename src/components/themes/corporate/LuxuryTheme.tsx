import BaseTheme, { EventThemeProps } from '../BaseTheme';
import Image from 'next/image';
import Link from 'next/link';

export interface CorporateLuxuryThemeProps extends EventThemeProps {
  extraFields: {
    organizationName: string;
    agenda: string;
    speakerList?: string[];
    sponsorList?: string[];
  };
}

const CorporateLuxury = ({
  eventId,
  title,
  date,
  time,
  location,
  description,
  coverImage,
  primaryColor = '#0F172A',
  secondaryColor = '#1E293B',
  accentColor = '#CBD5E1',
  extraFields,
  isPremium,
}: CorporateLuxuryThemeProps) => {
  const primaryColorStyle = { color: primaryColor };
  const primaryBgStyle = { backgroundColor: primaryColor };
  const accentBgStyle = { backgroundColor: accentColor };
  
  return (
    <BaseTheme
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      accentColor={accentColor}
      className="corporate-luxury"
    >
      <div className="min-h-screen bg-gray-50">
        {!isPremium && (
          <div className="absolute top-4 right-4 px-2 py-1 bg-gray-800 text-white text-xs uppercase tracking-wider rounded opacity-50">
            DiShEvent Watermark
          </div>
        )}
        
        <div className="relative bg-slate-900 text-white py-16">
          <div className="absolute inset-0 opacity-30">
            {coverImage && (
              <Image
                src={coverImage}
                alt="Event Background"
                fill
                style={{ objectFit: 'cover' }}
              />
            )}
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{title}</h1>
              <p className="mt-4 text-xl text-slate-300">Hosted by {extraFields.organizationName}</p>
              
              <div className="mt-10 inline-flex items-center space-x-1 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{date} • {time}</span>
                <span className="mx-2">|</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{location}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="px-6 py-8 md:p-10">
              <div className="max-w-3xl mx-auto">
                <div className="prose max-w-none">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="h-0.5 flex-1" style={primaryBgStyle}></div>
                    <h2 className="text-2xl font-bold m-0 px-4" style={primaryColorStyle}>About</h2>
                    <div className="h-0.5 flex-1" style={primaryBgStyle}></div>
                  </div>
                  
                  <p className="text-slate-700">{description}</p>
                  
                  <div className="flex items-center space-x-2 my-6">
                    <div className="h-0.5 flex-1" style={primaryBgStyle}></div>
                    <h2 className="text-2xl font-bold m-0 px-4" style={primaryColorStyle}>Agenda</h2>
                    <div className="h-0.5 flex-1" style={primaryBgStyle}></div>
                  </div>
                  
                  <div className="bg-slate-50 p-6 rounded-lg mb-8">
                    <pre className="whitespace-pre-wrap font-sans text-slate-700">
                      {extraFields.agenda}
                    </pre>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                  {extraFields.speakerList && extraFields.speakerList.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold mb-4" style={primaryColorStyle}>Featured Speakers</h3>
                      <ul className="space-y-2">
                        {extraFields.speakerList.map((speaker, index) => (
                          <li key={index} className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 rounded-full mr-2" style={accentBgStyle}></div>
                            <span className="text-slate-700">{speaker}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {extraFields.sponsorList && extraFields.sponsorList.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold mb-4" style={primaryColorStyle}>Sponsors</h3>
                      <ul className="space-y-2">
                        {extraFields.sponsorList.map((sponsor, index) => (
                          <li key={index} className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 rounded-full mr-2" style={accentBgStyle}></div>
                            <span className="text-slate-700">{sponsor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="mt-12 text-center">
                  <Link 
                    href={`/invite/${eventId}/rsvp`} 
                    className="inline-flex items-center px-8 py-3 text-lg font-medium text-white rounded-md shadow-md transition-all hover:shadow-lg"
                    style={primaryBgStyle}
                  >
                    Register Your Attendance
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseTheme>
  );
};

export default CorporateLuxury;