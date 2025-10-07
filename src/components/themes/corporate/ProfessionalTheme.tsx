import BaseTheme, { EventThemeProps } from '../BaseTheme';
import Image from 'next/image';

export interface CorporateProfessionalThemeProps extends EventThemeProps {
  extraFields: {
    organizationName: string;
    agenda: string;
    speakerList?: string[];
    sponsorList?: string[];
  };
}

const CorporateProfessional = ({
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
}: CorporateProfessionalThemeProps) => {
  return (
    <BaseTheme
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      accentColor={accentColor}
      className="corporate-professional"
    >
      <div className="container max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg my-8">
        {!isPremium && (
          <div className="absolute top-4 right-4 px-2 py-1 bg-gray-800 text-white text-xs uppercase tracking-wider rounded opacity-50">
            DiShEvent Free
          </div>
        )}

        <div className="py-8">
          <div className="flex items-center justify-center mb-6">
            {coverImage && (
              <div className="w-16 h-16 relative mr-4">
                <Image
                  src={coverImage}
                  alt="Organization Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}
            <div>
              <p className="text-lg font-medium text-gray-600">{extraFields.organizationName} presents</p>
              <h1 className="text-3xl md:text-4xl font-bold" style={{ color: primaryColor }}>
                {title}
              </h1>
            </div>
          </div>
          
          <div className="my-8 p-6 border-l-4 bg-gray-50" style={{ borderColor: primaryColor }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">{date} • {time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{location}</p>
              </div>
            </div>
          </div>
          
          <div className="my-8">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: primaryColor }}>About</h2>
            <p className="text-gray-700 whitespace-pre-line">{description}</p>
          </div>
          
          {extraFields.agenda && (
            <div className="my-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: primaryColor }}>Agenda</h2>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded">{extraFields.agenda}</pre>
              </div>
            </div>
          )}
          
          {extraFields.speakerList && extraFields.speakerList.length > 0 && (
            <div className="my-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: primaryColor }}>Speakers</h2>
              <ul className="list-disc pl-5">
                {extraFields.speakerList.map((speaker, index) => (
                  <li key={index} className="mb-1">{speaker}</li>
                ))}
              </ul>
            </div>
          )}
          
          {extraFields.sponsorList && extraFields.sponsorList.length > 0 && (
            <div className="my-8">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: primaryColor }}>Sponsors</h2>
              <ul className="list-disc pl-5">
                {extraFields.sponsorList.map((sponsor, index) => (
                  <li key={index} className="mb-1">{sponsor}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-12 mb-8 text-center">
            <h2 className="text-2xl mb-4" style={{ color: primaryColor }}>RSVP</h2>
            <p className="text-gray-600">Please confirm your attendance</p>
            <div className="mt-4">
              <a
                href={`/invite/${eventId}/rsvp`}
                className="inline-block px-8 py-3 rounded-md text-white font-medium transition-colors"
                style={{ backgroundColor: accentColor }}
              >
                Register Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </BaseTheme>
  );
};

export default CorporateProfessional;