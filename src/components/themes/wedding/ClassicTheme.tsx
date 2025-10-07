import BaseTheme, { EventThemeProps } from '../BaseTheme';
import Image from 'next/image';
import RSVPButton from '../../ui/RSVPButton';

export interface WeddingClassicThemeProps extends EventThemeProps {
  extraFields: {
    brideName: string;
    groomName: string;
    ceremonyLocation: string;
    receptionLocation: string;
    dressCode: string;
  };
}

const WeddingClassic = ({
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
}: WeddingClassicThemeProps) => {
  return (
    <BaseTheme
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      accentColor={accentColor}
      backgroundImage={coverImage}
      className="wedding-classic"
    >
      <div className="container max-w-4xl mx-auto p-6 bg-white/90 shadow-xl rounded-lg my-8">
        {!isPremium && (
          <div className="absolute top-4 right-4 px-2 py-1 bg-gray-800 text-white text-xs uppercase tracking-wider rounded opacity-50">
            DiShEvent Free
          </div>
        )}

        <div className="text-center py-8">
          <h1 className="text-4xl md:text-6xl font-serif mb-4" style={{ color: primaryColor }}>
            {extraFields.brideName} & {extraFields.groomName}
          </h1>
          <p className="text-xl text-gray-600">are getting married</p>
          
          <div className="my-10 relative">
            {coverImage && (
              <div className="w-full h-64 md:h-96 relative my-8 rounded-lg overflow-hidden">
                <Image
                  src={coverImage}
                  alt="Wedding"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center my-12 gap-8">
            <div className="flex-1 p-6 border-2 rounded-lg" style={{ borderColor: secondaryColor }}>
              <h3 className="text-xl font-semibold mb-2">Ceremony</h3>
              <p className="text-lg">{extraFields.ceremonyLocation}</p>
              <p className="text-lg mt-2">{date} • {time}</p>
            </div>
            
            <div className="flex-1 p-6 border-2 rounded-lg" style={{ borderColor: secondaryColor }}>
              <h3 className="text-xl font-semibold mb-2">Reception</h3>
              <p className="text-lg">{extraFields.receptionLocation}</p>
              <p className="text-lg mt-2">{date} • {time}</p>
            </div>
          </div>
          
          <div className="my-8 px-4">
            <h2 className="text-2xl font-semibold mb-4">Our Special Day</h2>
            <p className="text-gray-700 whitespace-pre-line">{description}</p>
          </div>
          
          <div className="my-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-xl mb-2">Details</h3>
            {extraFields.dressCode && (
              <p className="mb-2"><span className="font-semibold">Dress Code:</span> {extraFields.dressCode}</p>
            )}
          </div>
          
          <div className="mt-12 mb-8">
            <h2 className="text-2xl mb-4" style={{ color: primaryColor }}>RSVP</h2>
            <p className="text-gray-600">Please let us know if you can make it!</p>
            <div className="mt-6">
              <RSVPButton
                eventId={eventId}
                eventType="wedding"
                themeName="classic"
                primaryColor={primaryColor}
                accentColor={accentColor}
                size="large"
              />
            </div>
          </div>
        </div>
      </div>
    </BaseTheme>
  );
};

export default WeddingClassic;