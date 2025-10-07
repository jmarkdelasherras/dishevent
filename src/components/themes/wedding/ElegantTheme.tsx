import BaseTheme, { EventThemeProps } from '../BaseTheme';
import Image from 'next/image';
import Link from 'next/link';

export interface WeddingElegantThemeProps extends EventThemeProps {
  extraFields: {
    brideName: string;
    groomName: string;
    ceremonyLocation: string;
    receptionLocation: string;
    dressCode: string;
  };
}

const WeddingElegant = ({
  eventId,
  title,
  date,
  time,
  location,
  description,
  coverImage,
  primaryColor = '#97714A',
  secondaryColor = '#B29161',
  accentColor = '#D5B88F',
  extraFields,
  isPremium,
}: WeddingElegantThemeProps) => {
  return (
    <BaseTheme
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      accentColor={accentColor}
      className="wedding-elegant"
    >
      <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Floating flowers decoration */}
        <div className="absolute top-0 left-0 w-40 h-40 opacity-20">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill={primaryColor}>
            <path d="M37.3,-59.1C48.8,-53.1,58.8,-43,65.1,-30.9C71.4,-18.8,73.9,-4.7,70.7,7.8C67.5,20.3,58.6,31.1,48.8,39.3C38.9,47.5,28,53.1,16.3,57.5C4.5,61.9,-8.2,65.2,-20.3,63.1C-32.5,61.1,-44.2,53.8,-51.9,43.4C-59.7,33,-63.6,19.5,-65.1,5.8C-66.6,-8,-65.8,-22.1,-59.5,-33C-53.2,-44,-41.4,-51.9,-29.5,-57.7C-17.6,-63.4,-5.6,-67.1,6.5,-67C18.5,-66.9,25.8,-65.2,37.3,-59.1Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-60 h-60 opacity-20 rotate-45">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill={secondaryColor}>
            <path d="M37.3,-59.1C48.8,-53.1,58.8,-43,65.1,-30.9C71.4,-18.8,73.9,-4.7,70.7,7.8C67.5,20.3,58.6,31.1,48.8,39.3C38.9,47.5,28,53.1,16.3,57.5C4.5,61.9,-8.2,65.2,-20.3,63.1C-32.5,61.1,-44.2,53.8,-51.9,43.4C-59.7,33,-63.6,19.5,-65.1,5.8C-66.6,-8,-65.8,-22.1,-59.5,-33C-53.2,-44,-41.4,-51.9,-29.5,-57.7C-17.6,-63.4,-5.6,-67.1,6.5,-67C18.5,-66.9,25.8,-65.2,37.3,-59.1Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        {!isPremium && (
          <div className="absolute top-4 right-4 px-2 py-1 bg-gray-800 text-white text-xs uppercase tracking-wider rounded opacity-50">
            DiShEvent Watermark
          </div>
        )}

        <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-lg max-w-3xl w-full p-8 z-10">
          <div className="text-center">
            <h1 className="text-5xl font-serif mb-4" style={{ color: primaryColor }}>
              {extraFields.brideName} <span className="italic">&</span> {extraFields.groomName}
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-serif italic">Request the honor of your presence</p>
            
            {coverImage && (
              <div className="relative h-80 w-full my-8 overflow-hidden rounded-lg">
                <Image
                  src={coverImage}
                  alt="Wedding"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            )}
            
            <div className="my-10 font-serif">
              <p className="text-xl mb-1">{date}</p>
              <p className="text-lg mb-4">{time}</p>
              <div className="h-0.5 w-24 mx-auto bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}></div>
              <div className="mt-4 space-y-2">
                <p className="text-xl">Ceremony</p>
                <p className="text-gray-700">{extraFields.ceremonyLocation}</p>
                <p className="text-xl mt-4">Reception</p>
                <p className="text-gray-700">{extraFields.receptionLocation}</p>
              </div>
            </div>
            
            <div className="my-8">
              <h3 className="text-xl font-serif" style={{ color: primaryColor }}>Dress Code</h3>
              <p className="text-gray-700">{extraFields.dressCode}</p>
            </div>
            
            <div className="mt-8">
              <p className="text-gray-600 mb-6">{description}</p>
              <Link 
                href={`/invite/${eventId}/rsvp`} 
                className="inline-block px-8 py-3 text-lg font-serif text-white rounded-md transition duration-300"
                style={{ backgroundColor: primaryColor, boxShadow: `0 4px 14px 0 ${primaryColor}50` }}
              >
                RSVP
              </Link>
            </div>
          </div>
        </div>
      </div>
    </BaseTheme>
  );
};

export default WeddingElegant;