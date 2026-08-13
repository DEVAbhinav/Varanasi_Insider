// components/JsonLd/homepageSchema.js
// Returns JSON-LD for the homepage (WebSite + LocalBusiness + TaxiService + FAQPage)
import { CONTACT } from '@/lib/contact';
import { BUSINESS } from '../../config/business';
import { outstationFaqAnswer } from '../../lib/outstationFares';
import { airportTaxiFaqAnswer, taxiCostFaqAnswer } from '../../lib/taxiRates';

const getHomeSchema = (site) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${site}/#website`,
      url: `${site}/`,
      name: 'Taxi in Varanasi | Varanasi Taxi Service - Kashi Taxi',
      inLanguage: 'en',
      publisher: { '@id': `${site}/#org` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${site}/en?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': ['LocalBusiness', 'TaxiService', 'TouristInformationCenter'],
      '@id': `${site}/#org`,
      name: 'Kashi Taxi | Varanasi Taxi Service (operated by Vinayak Travels)',
      alternateName: ['Taxi in Varanasi', 'Varanasi Taxi Service', 'Varanasi Taxi', 'Cab in Varanasi', 'Varanasi Cab Service', 'Taxi Service in Varanasi', 'Varanasi Travels', 'Vinayak Travels Varanasi', 'Tempo Traveller Varanasi'],
      url: `${site}/`,
      logo: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/logo.jpeg',
      image: [
        'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png',
        'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/taxi-varanasi.jpg',
        'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/kashi-taxi-service.jpg'
      ],
      description:
        'Best taxi in Varanasi for airport pickup, local sightseeing & outstation trips. Trusted Varanasi taxi service offering 24×7 cab booking, tempo traveller hire, and pilgrimage tours with experienced drivers.',
      slogan: 'Your trusted travel partner in Varanasi',
      telephone: CONTACT.callNumberE164,
      faxNumber: CONTACT.callNumberDisplay,
      email: BUSINESS.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: BUSINESS.address.streetAddress,
        addressLocality: BUSINESS.address.addressLocality,
        addressRegion: BUSINESS.address.addressRegion,
        postalCode: BUSINESS.address.postalCode,
        addressCountry: BUSINESS.address.addressCountry,
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
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '00:00',
          closes: '23:59',
        },
      ],
      priceRange: '₹₹',
      currenciesAccepted: 'INR',
      paymentAccepted: ['Cash', 'UPI', 'Digital Payment'],
      serviceArea: [
        {
          '@type': 'City',
          name: 'Varanasi',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Varanasi',
            addressRegion: 'Uttar Pradesh',
            addressCountry: 'IN',
          },
        },
        {
          '@type': 'State',
          name: 'Uttar Pradesh',
          address: {
            '@type': 'PostalAddress',
            addressRegion: 'Uttar Pradesh',
            addressCountry: 'IN',
          },
        },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Varanasi Taxi & Tempo Traveller Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Airport Transfer Service',
              description: 'Varanasi Airport taxi pickup and drop service',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Local Varanasi Tours',
              description: 'Varanasi city tours, temple visits and Ganga Aarti trips',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Tempo Traveller Hire',
              description: 'Group travel with Tempo Traveller for pilgrimage tours',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Outstation Varanasi Travels',
              description: 'Long-distance travel to Ayodhya, Prayagraj, Bodhgaya, Vindhyachal',
            },
          },
        ],
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: CONTACT.callNumberE164,
          contactType: 'customer service',
          availableLanguage: ['en', 'hi'],
          hoursAvailable: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ],
            opens: '00:00',
            closes: '23:59',
          },
        },
        {
          '@type': 'ContactPoint',
          telephone: CONTACT.callNumberDisplay,
          contactType: 'WhatsApp',
          availableLanguage: ['en', 'hi'],
        },
      ],
      sameAs: BUSINESS.socials,
      foundingDate: BUSINESS.foundingDate,
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        minValue: 15,
        maxValue: 25,
      },
      knowsAbout: [
        'Varanasi Tourism',
        'Airport Transfer',
        'Local Transportation',
        'Outstation Travel',
        'Temple Tours',
        'Ganga Aarti',
        'Sarnath Excursion',
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: BUSINESS.rating,
        reviewCount: BUSINESS.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
      review: [
        {
          '@type': 'Review',
          author: {
            '@type': 'Person',
            name: 'Sampath Kumar',
          },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: '5',
            bestRating: '5',
          },
          reviewBody: 'Driver Rajan is very good and gave best service, he is well aware of local roads and because of which we were able to get darshan in Ayodhya even during this heavy traffic during kumbh mela season and he is a soft spoken and humble person. Overall excellent service',
          datePublished: '2024-03-12',
        },
        {
          '@type': 'Review',
          author: {
            '@type': 'Person',
            name: 'Krishnan Iyer',
          },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: '5',
            bestRating: '5',
          },
          reviewBody: 'Absolutely we enjoyed the trip. Driver Prathap was great. Overall the travel was smooth. Car was neat and clean. Keep it up',
          datePublished: '2024-02-07',
        },
        {
          '@type': 'Review',
          author: {
            '@type': 'Person',
            name: 'Dhiraj Choraria',
          },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: '5',
            bestRating: '5',
          },
          reviewBody: 'Had taken a cab for Ayodhya. I must say this was the most economical option of whatever people I had enquired. And there was no compromise on quality. Superb car and excellent driver service.',
          datePublished: '2023-08-14',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${site}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does a taxi cost in Varanasi?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: taxiCostFaqAnswer(),
          },
        },
        {
          '@type': 'Question',
          name: 'Which is the best taxi service in Varanasi?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Kashi Taxi (operated by Vinayak Travels) is rated among the best taxi services in Varanasi with a 4.8★ Google rating from 191 reviews. We offer 24×7 cab booking, experienced local drivers, AC vehicles, and fixed-price packages for airport, local, and outstation trips.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Ola/Uber available in Varanasi?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Ola and Uber have limited availability in Varanasi, especially in old city areas near ghats. Local taxi services like ours provide better coverage, fixed rates, and drivers familiar with narrow ghat lanes and temple routes where app-based cabs often refuse trips.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I book a taxi from Varanasi airport?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: airportTaxiFaqAnswer(),
          },
        },
        {
          '@type': 'Question',
          name: 'Do you provide taxi for outstation from Varanasi?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: outstationFaqAnswer(),
          },
        },
        {
          '@type': 'Question',
          name: 'How to book taxi in Varanasi online?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              `Book a taxi in Varanasi online through our website booking form, WhatsApp (${CONTACT.whatsappNumberDisplay}), or call (${CONTACT.callNumberDisplay}). Share your pickup location, date/time, and trip type. Get instant quote and confirmation. No advance payment required for most bookings.`,
          },
        },
      ],
    },
  ],
});

export default getHomeSchema;
