// components/JsonLd/varanasiTaxiSchema.js
// Dedicated LocalBusiness + TaxiService Schema for the "Varanasi Taxi Service" Brand
import { CONTACT } from '@/lib/contact';
import { BUSINESS } from '../../config/business';
import { outstationFaqAnswer } from '../../lib/outstationFares';
import { airportTaxiFaqAnswer, taxiCostFaqAnswer } from '../../lib/taxiRates';

const getVaranasiTaxiSchema = (site) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${site}/varanasi-taxi-service/#website`,
      url: `${site}/varanasi-taxi-service`,
      name: 'Varanasi Taxi Service | Official 24×7 Cab Booking & Stand Fleet',
      inLanguage: 'en',
      publisher: { '@id': `${site}/varanasi-taxi-service/#org` },
    },
    {
      '@type': ['LocalBusiness', 'TaxiService'],
      '@id': `${site}/varanasi-taxi-service/#org`,
      name: 'Varanasi Taxi Service',
      legalName: 'Varanasi Taxi Service (operated by Vinayak Travels)',
      alternateName: [
        'Varanasi Taxi Services',
        'Varanasi Taxi',
        'Varanasi Cab Service',
        'Varanasi Cab',
        'Varanasi Taxi Booking',
        'Varanasi Airport Taxi Service',
      ],
      url: `${site}/varanasi-taxi-service`,
      logo: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/logo.jpeg',
      image: [
        'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png',
        'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/taxi-varanasi.jpg',
        'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/kashi-taxi-service.jpg'
      ],
      description:
        'Varanasi Taxi Service is the official 24×7 local city cab and taxi stand network operated by Vinayak Travels (Est. 1982). Fast point-to-point dispatch across all ghats, Babatpur airport fixed transfers from ₹899, Cantt station pickups, and verified chauffeurs.',
      slogan: 'Your official 24×7 Varanasi city taxi & cab dispatch fleet',
      telephone: CONTACT.callNumberE164,
      email: BUSINESS.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Vinayak Travels, Shastri Nagar, Sigra',
        addressLocality: 'Varanasi',
        addressRegion: 'Uttar Pradesh',
        postalCode: '221010',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: BUSINESS.geo.latitude,
        longitude: BUSINESS.geo.longitude,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
          ],
          opens: '00:00',
          closes: '23:59',
        },
      ],
      priceRange: '₹₹',
      currenciesAccepted: 'INR',
      paymentAccepted: ['Cash', 'UPI', 'Digital Payment', 'Cards'],
      areaServed: [
        { '@type': 'City', name: 'Varanasi' },
        { '@type': 'AdministrativeArea', name: 'Uttar Pradesh' },
      ],
      parentOrganization: {
        '@type': 'LocalBusiness',
        '@id': `${site}/#org`,
        name: 'Kashi Taxi (Vinayak Travels)',
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: CONTACT.callNumberE164,
          contactType: 'customer service',
          availableLanguage: ['en', 'hi'],
        },
        {
          '@type': 'ContactPoint',
          telephone: CONTACT.whatsappNumberDisplay,
          contactType: 'WhatsApp Dispatch',
          availableLanguage: ['en', 'hi'],
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${site}/varanasi-taxi-service/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does a taxi or cab cost with Varanasi Taxi Service?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: taxiCostFaqAnswer()
          }
        },
        {
          '@type': 'Question',
          name: 'What is the taxi fare from Varanasi Airport to the city or ghats?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: airportTaxiFaqAnswer()
          }
        },
        {
          '@type': 'Question',
          name: 'Do you provide outstation taxi service from Varanasi?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: outstationFaqAnswer()
          }
        },
        {
          '@type': 'Question',
          name: 'How do I book a cab with Varanasi Taxi Service?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can book instantly using our on-page quote widget, or call our 24×7 dispatch at +91 99354 74730 or message via WhatsApp. We confirm your driver and car number in minutes.'
          }
        },
        {
          '@type': 'Question',
          name: 'Are your Varanasi taxi drivers verified and safe for families?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, 100% of our drivers are police-verified local professionals with deep knowledge of Varanasi traffic, ghat walking access zones, and parking corridors.'
          }
        },
        {
          '@type': 'Question',
          name: 'Can Varanasi Taxi Service pick up from Cantt Railway Station?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, our dispatch team actively tracks train arrival times (via PNR or train number) and coordinates seamless meet-and-greet pickups at Varanasi Junction (Cantt), Banaras (Manduadih), and DDU Junction.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is 24×7 taxi service available for midnight or early-morning travel in Varanasi?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, our city cabs operate 24 hours a day, 7 days a week. For late-night or pre-dawn 3:00 AM pickups (e.g., Subah-e-Banaras or morning flights), we recommend pre-booking so a dedicated cab is stationed ahead of time.'
          }
        },
        {
          '@type': 'Question',
          name: 'How close can a taxi get to Dashashwamedh Ghat or Kashi Vishwanath Temple?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Due to city traffic barricades, 4-wheelers cannot enter beyond Godowlia Chowk, Maidagin, or Sonarpura (especially 4 PM–10 PM). Our drivers drop you at the closest accessible checkpoint (approx. 300m away) and help coordinate licensed luggage porters or e-rickshaws directly to your riverside hotel.'
          }
        },
        {
          '@type': 'Question',
          name: 'What happens if my flight or train to Varanasi is delayed?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We provide complimentary live tracking for all flight numbers and railway PNRs. If your flight or train is delayed, your cab waits up to 45 minutes free of charge with zero cancellation penalty or surge fees.'
          }
        },
        {
          '@type': 'Question',
          name: 'Do you guarantee no forced shopping or commission detours?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Varanasi Taxi Service operates under a strict Scam Shield Policy: 100% direct point-to-point transit. Drivers are strictly prohibited from making unscheduled detours to silk saree emporiums or overpriced boat docks.'
          }
        },
        {
          '@type': 'Question',
          name: 'How much luggage fits in your Varanasi taxi fleet?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sedans (Dzire/Aura) accommodate 4 passengers with 2 large check-in bags and 2 cabin bags in a clean, dedicated trunk. Ertiga SUVs fit 5-6 passengers with 3 large bags. Innova Crysta comfortably holds 6-7 passengers with 4-5 large suitcases plus an optional roof rack. Tempo Travellers accommodate 9-26 passengers with a dedicated rear luggage compartment.'
          }
        }
      ]
    }
  ],
});

export default getVaranasiTaxiSchema;
