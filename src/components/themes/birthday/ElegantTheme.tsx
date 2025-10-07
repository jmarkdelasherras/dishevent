import BaseTheme, { EventThemeProps } from '../BaseTheme';
import Image from 'next/image';
import Link from 'next/link';

export interface BirthdayElegantThemeProps extends EventThemeProps {
  extraFields: {
    celebrantName: string;
    age: number;
    theme: string;
    giftPreferences?: string;
  };
}

const BirthdayElegant = ({
  eventId,
  title,
  date,
  time,
  location,
  description,
  coverImage,
  primaryColor = '#1E40AF',
  secondaryColor = '#3B82F6',
  accentColor = '#60A5FA',
  extraFields,
  isPremium,
}: BirthdayElegantThemeProps) => {
  const primaryColorStyle = { color: primaryColor };
  const primaryBgStyle = { backgroundColor: primaryColor };
  
  return (
    <BaseTheme
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      accentColor={accentColor}
      className="birthday-elegant"
    >
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        {!isPremium && (
          <div className="absolute top-4 right-4 px-2 py-1 bg-gray-800 text-white text-xs uppercase tracking-wider rounded opacity-50">
            DiShEvent Watermark
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="relative h-64 md:h-full">
                  {coverImage ? (
                    <Image
                      src={coverImage}
                      alt="Celebration"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600"></div>
                  )}
                </div>
              </div>
              
              <div className="md:w-1/2 p-8">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-1" style={primaryColorStyle}>
                    {extraFields.celebrantName}
                  </h1>
                  <p className="text-xl text-gray-600">Celebrates {extraFields.age} Years</p>
                  
                  <div className="my-6 h-0.5 w-16 mx-auto" style={primaryBgStyle}></div>
                  
                  <div className="mb-6 text-lg text-gray-700">
                    <p>{description}</p>
                  </div>
                  
                  <div className="mt-8 space-y-4">
                    <div>
                      <h3 className="font-bold" style={primaryColorStyle}>Date & Time</h3>
                      <p className="text-gray-600">{date} at {time}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-bold" style={primaryColorStyle}>Location</h3>
                      <p className="text-gray-600">{location}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-bold" style={primaryColorStyle}>Theme</h3>
                      <p className="text-gray-600">{extraFields.theme}</p>
                    </div>
                    
                    {extraFields.giftPreferences && (
                      <div>
                        <h3 className="font-bold" style={primaryColorStyle}>Gift Preferences</h3>
                        <p className="text-gray-600">{extraFields.giftPreferences}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="py-6 px-8 bg-gray-50 text-center">
              <Link 
                href={`/invite/${eventId}/rsvp`} 
                className="inline-block px-8 py-3 text-white font-medium rounded-lg transition-all hover:shadow-lg"
                style={primaryBgStyle}
              >
                RSVP to the Celebration
              </Link>
            </div>
          </div>
          
          <div className="mt-8 text-center text-gray-500 text-sm">
            We&apos;re excited to celebrate this special day with you!
          </div>
        </div>
      </div>
    </BaseTheme>
  );
};

export default BirthdayElegant;