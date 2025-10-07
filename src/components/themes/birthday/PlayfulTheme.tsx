import BaseTheme, { EventThemeProps } from '../BaseTheme';
import Image from 'next/image';
import Link from 'next/link';

export interface BirthdayPlayfulThemeProps extends EventThemeProps {
  extraFields: {
    celebrantName: string;
    age: number;
    theme: string;
    giftPreferences?: string;
  };
}

const BirthdayPlayful = ({
  eventId,
  title,
  date,
  time,
  location,
  description,
  coverImage,
  primaryColor = '#F472B6',
  secondaryColor = '#EC4899',
  accentColor = '#DB2777',
  extraFields,
  isPremium,
}: BirthdayPlayfulThemeProps) => {
  const primaryColorStyle = { color: primaryColor };
  const primaryBgStyle = { backgroundColor: primaryColor };
  
  return (
    <BaseTheme
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      accentColor={accentColor}
      className="birthday-playful"
    >
      <div className="min-h-screen bg-purple-50 py-12 px-4">
        {!isPremium && (
          <div className="absolute top-4 right-4 px-2 py-1 bg-gray-800 text-white text-xs uppercase tracking-wider rounded opacity-50">
            DiShEvent Watermark
          </div>
        )}

        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="relative h-60 sm:h-80">
            {coverImage ? (
              <Image
                src={coverImage}
                alt="Birthday Celebration"
                fill
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500"></div>
            )}
            
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl sm:text-5xl font-bold">{extraFields.celebrantName}&apos;s</h1>
                <div className="text-4xl sm:text-6xl font-bold flex items-center">
                  <span>{extraFields.age}</span>
                  <span className="text-2xl sm:text-4xl ml-2">th</span>
                  <span className="ml-2">Birthday!</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 sm:p-10">
            <div className="mb-8">
              <div className="inline-block py-1 px-3 rounded-full mb-3" style={primaryBgStyle}>
                <span className="text-white font-medium">Theme: {extraFields.theme}</span>
              </div>
              <p className="text-gray-600">{description}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-pink-50 p-4 rounded-xl">
                <h3 className="text-xl font-bold mb-2" style={primaryColorStyle}>When</h3>
                <p className="text-gray-700 text-lg">{date}</p>
                <p className="text-gray-700">{time}</p>
              </div>
              <div className="bg-pink-50 p-4 rounded-xl">
                <h3 className="text-xl font-bold mb-2" style={primaryColorStyle}>Where</h3>
                <p className="text-gray-700">{location}</p>
              </div>
            </div>
            
            {extraFields.giftPreferences && (
              <div className="mb-8 p-4 border border-dashed border-pink-300 rounded-xl">
                <h3 className="text-xl font-bold mb-2" style={primaryColorStyle}>Gift Ideas</h3>
                <p className="text-gray-700">{extraFields.giftPreferences}</p>
              </div>
            )}
            
            <div className="text-center mt-10">
              <Link 
                href={`/invite/${eventId}/rsvp`} 
                className="inline-block px-8 py-3 rounded-full text-white font-bold transition-transform hover:scale-105 shadow-lg"
                style={primaryBgStyle}
              >
                RSVP Now!
              </Link>
              
              <div className="mt-6 flex justify-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-pink-300"></div>
                <div className="w-3 h-3 rounded-full" style={primaryBgStyle}></div>
                <div className="w-3 h-3 rounded-full bg-purple-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseTheme>
  );
};

export default BirthdayPlayful;