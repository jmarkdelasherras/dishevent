// CheckIcon component
const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const tiers = [
  {
    name: 'Free',
    id: 'tier-free',
    price: '$0',
    frequency: '',
    description: 'Perfect for trying out',
    features: [
      '1 event at a time',
      'Basic theme (1 per event type)',
      'Limited analytics',
      'Email support',
      '30 RSVPs per event',
      'DiShEvent subdomain',
      '30 day event duration',
    ],
    limitations: [
      'DiShEvent watermark on invitations',
      'Limited customization options',
      'Only one active event',
    ],
    mostPopular: false,
    buttonText: 'Current Plan',
    buttonColor: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300',
  },
  {
    name: 'Basic',
    id: 'tier-basic',
    price: '$9',
    frequency: '/event',
    description: 'Perfect for special occasions',
    features: [
      'Single event purchase',
      'All standard themes',
      'Standard analytics',
      'Priority email support',
      'Up to 100 RSVPs',
      'Custom URL options',
      'No DiShEvent watermark',
      '90 day event duration',
    ],
    limitations: [],
    mostPopular: true,
    buttonText: 'Purchase',
    buttonColor: 'bg-gradient-to-r from-[#143F7E] to-[#297B46] hover:opacity-90 text-white border-transparent',
  },
  {
    name: 'Premium',
    id: 'tier-premium',
    price: '$29',
    frequency: '/event',
    description: 'For luxury events & weddings',
    features: [
      'Single event purchase',
      'All themes + custom themes',
      'Advanced analytics & reporting',
      'Dedicated support',
      'Unlimited RSVPs',
      'Custom domains',
      'Priority customer service',
      'Photo/video galleries',
      '1 year event duration',
    ],
    limitations: [],
    mostPopular: false,
    buttonText: 'Purchase',
    buttonColor: 'bg-gradient-to-r from-[#143F7E]/90 to-[#297B46]/90 hover:from-[#143F7E] hover:to-[#297B46] text-white border-transparent',
  },
];

export default function SubscriptionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Event Pricing</h1>
        <p className="text-gray-600 mt-1">Choose the right option for your event</p>
      </div>
      
      {/* Current Active Event */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#143F7E]/5 to-[#297B46]/5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Current Active Event: Birthday Party</h2>
              <p className="mt-1 text-sm text-gray-600">Free tier - Expires on October 15, 2025</p>
            </div>
            <div className="px-3 py-1 bg-gradient-to-r from-[#143F7E]/10 to-[#297B46]/10 text-[#143F7E] text-sm font-medium rounded-md">
              Active
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">Event URL</p>
              <p className="text-lg font-medium text-gray-900">https://dishevent.com/event/birthday-party</p>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                View Event
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Edit Event
              </button>
            </div>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900">Event Usage</h3>
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">RSVPs</div>
                  <div className="text-sm font-medium text-gray-900">22 / 30</div>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-[#143F7E] to-[#297B46] h-2 rounded-full w-[73%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">Time Remaining</div>
                  <div className="text-sm font-medium text-gray-900">19 days</div>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-[#143F7E] to-[#297B46] h-2 rounded-full w-[60%]"></div>
                </div>
                <div className="mt-2">
                  <button className="text-sm text-[#143F7E] hover:text-[#143F7E]/80 font-medium">
                    Upgrade this event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Available Event Options */}
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900">Event Pricing Options</h2>
        <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-lg shadow-sm divide-y divide-gray-200 bg-white border ${
                tier.mostPopular ? 'border-[#143F7E] relative' : 'border-gray-200'
              }`}
            >
              {tier.mostPopular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-0 transform px-4 py-1 bg-gradient-to-r from-[#143F7E] to-[#297B46] rounded-full text-white text-xs font-medium">
                  Most popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{tier.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{tier.description}</p>
                <p className="mt-4">
                  <span className={`text-3xl font-extrabold ${tier.id === 'tier-free' ? 'text-[#297B46]' : 'text-gray-900'}`}>{tier.price}</span>
                  <span className="text-base font-medium text-gray-500">{tier.frequency}</span>
                </p>
                <button
                  className={`mt-6 w-full border rounded-md py-2 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#143F7E] shadow-sm ${tier.buttonColor}`}
                >
                  {tier.buttonText}
                </button>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h4 className="text-sm font-medium text-gray-900">What&apos;s included</h4>
                <ul className="mt-6 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckIcon className={`h-5 w-5 ${tier.id === 'tier-free' ? 'text-[#297B46]' : tier.id === 'tier-basic' ? 'text-[#143F7E]' : 'text-[#143F7E]'}`} aria-hidden="true" />
                      </div>
                      <p className="ml-3 text-sm text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
                
                {tier.limitations && tier.limitations.length > 0 && (
                  <>
                    <h4 className="text-sm font-medium text-gray-900 mt-6">Limitations</h4>
                    <ul className="mt-4 space-y-4">
                      {tier.limitations.map((limitation) => (
                        <li key={limitation} className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                          <p className="ml-3 text-sm text-gray-500">{limitation}</p>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* FAQs */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#143F7E]/5 to-[#297B46]/5">
          <h2 className="text-lg font-medium text-gray-900">Frequently Asked Questions</h2>
        </div>
        
        <div className="px-6 py-4 divide-y divide-gray-200">
          <div className="py-4">
            <h3 className="text-base font-medium text-gray-900">How does pay-per-event pricing work?</h3>
            <p className="mt-2 text-sm text-gray-500">
              With our pay-per-event model, you only pay for the events you create. Each purchase gives you one event with the features of the selected tier. No monthly subscriptions or recurring payments.
            </p>
          </div>
          
          <div className="py-4">
            <h3 className="text-base font-medium text-gray-900">How long does my event stay active?</h3>
            <p className="mt-2 text-sm text-gray-500">
              Free events stay active for 30 days, Basic events for 90 days, and Premium events for 1 year. After this period, the event page remains accessible but can&apos;t accept new RSVPs.
            </p>
          </div>
          
          <div className="py-4">
            <h3 className="text-base font-medium text-gray-900">Can I upgrade my existing event?</h3>
            <p className="mt-2 text-sm text-gray-500">
              Yes, you can upgrade your event at any time by paying the difference between your current tier and the desired tier. This will immediately unlock additional features and extend the event&apos;s duration.
            </p>
          </div>
          
          <div className="py-4">
            <h3 className="text-base font-medium text-gray-900">Do you offer bulk discounts?</h3>
            <p className="mt-2 text-sm text-gray-500">
              Yes, if you need to create multiple events, we offer special packages with discounted pricing. Contact our sales team to learn about our bulk event packages.
            </p>
          </div>
          
          <div className="py-4">
            <h3 className="text-base font-medium text-gray-900">Do you offer refunds?</h3>
            <p className="mt-2 text-sm text-gray-500">
              We offer a full refund if requested within 24 hours of purchase and before the event page has received any RSVPs. Contact our support team for assistance.
            </p>
          </div>
          
          <div className="py-4">
            <h3 className="text-base font-medium text-gray-900">What is the DiShEvent watermark?</h3>
            <p className="mt-2 text-sm text-gray-500">
              Free events include our DiShEvent watermark on invitations and the event page. This small logo indicates that the event was created with our platform. Basic and Premium events do not include this watermark.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// With the layout.tsx file, we no longer need to specify the layout here