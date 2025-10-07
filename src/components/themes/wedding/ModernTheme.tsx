import BaseTheme, { EventThemeProps } from '../BaseTheme';
import Image from 'next/image';
import Link from 'next/link';

export interface WeddingModernThemeProps extends EventThemeProps {
  extraFields: {
    brideName: string;
    groomName: string;
    ceremonyLocation: string;
    receptionLocation: string;
    dressCode: string;
  };
}

const WeddingModern = ({
  eventId,
  title,
  date,
  time,
  location,
  description,
  coverImage,
  primaryColor = '#2D3748',
  secondaryColor = '#4A5568',
  accentColor = '#A0AEC0',
  extraFields,
  isPremium,
}: WeddingModernThemeProps) => {
  const primaryColorStyle = { color: primaryColor };
  const backgroundGradient = { backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` };
  
  return (
    <BaseTheme
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      accentColor={accentColor}
      className="wedding-modern"
    >
      <div className="min-h-screen bg-gray-50">
        {!isPremium && (
          <div className="absolute top-4 right-4 px-2 py-1 bg-gray-800 text-white text-xs uppercase tracking-wider rounded opacity-50">
            DiShEvent Watermark
          </div>
        )}
        
        {coverImage && (
          <div className="w-full h-96 relative">
            <Image
              src={coverImage}
              alt="Wedding Cover"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 flex items-end justify-center pb-10">
              <div className="text-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  {extraFields.brideName} & {extraFields.groomName}
                </h1>
                <div className="mt-4 text-xl">We&apos;re getting married!</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="container max-w-4xl mx-auto p-8 -mt-24 relative z-10">
          <div className="bg-white shadow-xl rounded-lg p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between mb-10">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2" style={primaryColorStyle}>When & Where</h2>
                <div className="text-xl mb-1">{date}</div>
                <div className="text-lg text-gray-600 mb-4">{time}</div>
              </div>
              
              <div className="h-px w-full md:h-16 md:w-px bg-gray-200"></div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2" style={primaryColorStyle}>Location</h2>
                <div>
                  <div className="font-medium">Ceremony</div>
                  <div className="text-gray-600">{extraFields.ceremonyLocation}</div>
                  <div className="font-medium mt-3">Reception</div>
                  <div className="text-gray-600">{extraFields.receptionLocation}</div>
                </div>
              </div>
            </div>
            
            <div className="my-12">
              <div className="h-px w-full" style={backgroundGradient}></div>
              <div className="my-8 text-center">
                <p className="text-xl italic">{description}</p>
              </div>
              <div className="h-px w-full" style={backgroundGradient}></div>
            </div>
            
            <div className="mt-8 text-center">
              <h3 className="text-xl font-bold mb-2" style={primaryColorStyle}>Dress Code</h3>
              <p className="text-gray-700 mb-10">{extraFields.dressCode}</p>
              
              <Link 
                href={`/invite/${eventId}/rsvp`} 
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white border border-transparent rounded-md shadow-sm"
                style={backgroundGradient}
              >
                RSVP Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </BaseTheme>
  );
};

export default WeddingModern;