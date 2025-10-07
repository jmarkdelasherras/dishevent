import BaseTheme, { EventThemeProps } from '../BaseTheme';
import Image from 'next/image';

export interface BirthdayFunThemeProps extends EventThemeProps {
  extraFields: {
    celebrantName: string;
    age: number;
    theme: string;
    giftPreferences?: string;
  };
}

const BirthdayFun = ({
  eventId,
  title,
  date,
  time,
  location,
  description,
  coverImage,
  primaryColor,
  secondaryColor,
  accentColor,
  extraFields,
  isPremium,
}: BirthdayFunThemeProps) => {
  return (
    <BaseTheme
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      accentColor={accentColor}
      backgroundImage={coverImage}
      className="birthday-fun"
    >
      <div className="container max-w-4xl mx-auto p-6 bg-white/90 shadow-xl rounded-lg my-8">
        {!isPremium && (
          <div className="absolute top-4 right-4 px-2 py-1 bg-gray-800 text-white text-xs uppercase tracking-wider rounded opacity-50">
            DiShEvent Free
          </div>
        )}

        <div className="text-center py-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: primaryColor }}>
            {extraFields.celebrantName}'s {extraFields.age}th Birthday!
          </h1>
          
          <div className="my-10 relative">
            {coverImage && (
              <div className="w-full h-64 md:h-96 relative my-8 rounded-lg overflow-hidden">
                <Image
                  src={coverImage}
                  alt="Birthday"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
          </div>
          
          <div className="my-8 p-6 border-2 rounded-lg mx-auto max-w-lg" style={{ borderColor: secondaryColor }}>
            <h3 className="text-xl font-semibold mb-2">Party Details</h3>
            <p className="text-lg font-bold my-2">{date} • {time}</p>
            <p className="text-lg">{location}</p>
            {extraFields.theme && (
              <p className="mt-4"><span className="font-semibold">Theme:</span> {extraFields.theme}</p>
            )}
          </div>
          
          <div className="my-8 px-4">
            <h2 className="text-2xl font-semibold mb-4">Let's Celebrate!</h2>
            <p className="text-gray-700 whitespace-pre-line">{description}</p>
          </div>
          
          {extraFields.giftPreferences && (
            <div className="my-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-xl mb-2">Gift Ideas</h3>
              <p className="text-gray-700 whitespace-pre-line">{extraFields.giftPreferences}</p>
            </div>
          )}
          
          <div className="mt-12 mb-8">
            <h2 className="text-2xl mb-4" style={{ color: primaryColor }}>RSVP</h2>
            <p className="text-gray-600">Will you join the party?</p>
            <div className="mt-4">
              <a
                href={`/invite/${eventId}/rsvp`}
                className="inline-block px-8 py-3 rounded-full text-white font-medium transition-colors"
                style={{ backgroundColor: accentColor }}
              >
                Respond
              </a>
            </div>
          </div>
        </div>
      </div>
    </BaseTheme>
  );
};

export default BirthdayFun;