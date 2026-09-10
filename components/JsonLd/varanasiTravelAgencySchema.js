// components/JsonLd/varanasiTravelAgencySchema.js
// Structured Data for Varanasi Travel Agency (TravelAgency, LocalBusiness, OfferCatalog, FAQPage, BreadcrumbList)
import { CONTACT } from '@/lib/contact';
import { BUSINESS } from '../../config/business';

const getVaranasiTravelAgencySchema = (site) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${site}/varanasi-travel-agency/#website`,
      url: `${site}/varanasi-travel-agency`,
      name: 'Varanasi Travel Agency | Tour Packages & Local Sightseeing – Vinayak Travels',
      inLanguage: 'en',
      publisher: { '@id': `${site}/varanasi-travel-agency/#agency` },
    },
    {
      '@type': ['LocalBusiness', 'TravelAgency'],
      '@id': `${site}/varanasi-travel-agency/#agency`,
      name: 'Varanasi Travel Agency',
      legalName: 'Varanasi Travel Agency (operated by Vinayak Travels, Est. 1982)',
      alternateName: [
        'Travel Agency in Varanasi',
        'Best Travel Agency in Varanasi',
        'Varanasi Travel Agency Mahmoorganj',
        'Varanasi Tour and Travels',
        'Kashi Tour Agency',
      ],
      url: `${site}/varanasi-travel-agency`,
      logo: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/logo.jpeg',
      image: [
        'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png',
        'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/Ganga-boat-birds-ghats-morning-l.jpg',
        'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/tempo-travellar-side-l.jpeg',
        'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-kashi-vishwanath-l.jpeg',
      ],
      description:
        'Official Varanasi Travel Agency operated by Vinayak Travels (Est. 1982) on the Sigra-Mahmoorganj corridor. Curating premier Kashi pilgrimage packages, 2N/3D Varanasi temple tours, Ayodhya-Prayagraj circuits, Gaya Pind Daan, verified local guides, and 24×7 customer care.',
      slogan: 'Premier pilgrimage & custom tour packages across Varanasi and sacred circuits',
      telephone: '+919935474730',
      email: BUSINESS.email || 'sudhir.vinayaktravels@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'L 10/125, Shastri Nagar, Sigra (Sigra-Mahmoorganj Road, 800m from Mahmoorganj Crossing)',
        addressLocality: 'Varanasi',
        addressRegion: 'Uttar Pradesh',
        postalCode: '221010',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 25.3109,
        longitude: 82.9830,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59',
        },
      ],
      priceRange: '₹₹',
      currenciesAccepted: 'INR',
      paymentAccepted: ['Cash', 'UPI', 'Digital Payment', 'Bank Transfer', 'Cards'],
      areaServed: [
        { '@type': 'City', name: 'Varanasi' },
        { '@type': 'AdministrativeArea', name: 'Uttar Pradesh' },
        { '@type': 'City', name: 'Ayodhya' },
        { '@type': 'City', name: 'Prayagraj' },
        { '@type': 'City', name: 'Gaya' },
      ],
      parentOrganization: {
        '@type': 'LocalBusiness',
        '@id': `${site}/#org`,
        name: 'Vinayak Travels (Est. 1982)',
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+919935474730',
          contactType: 'customer service / tour package desk',
          availableLanguage: ['en', 'hi'],
        },
        {
          '@type': 'ContactPoint',
          telephone: '+919450301573',
          contactType: 'operations & Mahmoorganj office desk',
          availableLanguage: ['en', 'hi'],
        },
        {
          '@type': 'ContactPoint',
          telephone: '+919935474730',
          contactType: 'WhatsApp Fast Quote',
          availableLanguage: ['en', 'hi'],
        },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Varanasi Tour Packages & Pilgrimage Circuits',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'TouristTrip',
              name: 'Complete Kashi Darshan & Ganga Aarti (2N/3D)',
              description:
                'All-inclusive private Varanasi pilgrimage with 3-star hotel stay, airport/railway transfers, sunrise boat ride, VIP Kashi Vishwanath darshan, Sankat Mochan, Sarnath excursion, and Dashashwamedh Aarti reserved seating.',
              offers: {
                '@type': 'Offer',
                price: '4999',
                priceCurrency: 'INR',
                availability: 'https://schema.org/InStock',
              },
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'TouristTrip',
              name: 'Sacred Triangle: Varanasi – Ayodhya – Prayagraj (3N/4D)',
              description:
                'Comprehensive sacred circuit package covering Kashi Vishwanath, Triveni Sangam boat bath in Prayagraj, and Ayodhya Ram Janmabhoomi darshan in private AC sedan or Innova.',
              offers: {
                '@type': 'Offer',
                price: '8999',
                priceCurrency: 'INR',
                availability: 'https://schema.org/InStock',
              },
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'TouristTrip',
              name: 'Kashi to Gaya & Bodhgaya Pind Daan Special (2N/3D)',
              description:
                'Revered Pitru Dosh & Pind Daan pilgrimage to Vishnupad Temple, Falgu River, and Bodhgaya Mahabodhi Temple with vetted Teerth Purohit rituals and private round-trip transport.',
              offers: {
                '@type': 'Offer',
                price: '6499',
                priceCurrency: 'INR',
                availability: 'https://schema.org/InStock',
              },
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'TouristTrip',
              name: 'Senior Citizen & Wheelchair Accessible Kashi Yatra',
              description:
                'Gentle-paced pilgrimage designed specifically for elderly parents with e-rickshaw ghat access, wheelchair assistance at temples, verified elevator hotel rooms, and doorstep darshan.',
              offers: {
                '@type': 'Offer',
                price: '5499',
                priceCurrency: 'INR',
                availability: 'https://schema.org/InStock',
              },
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'TouristTrip',
              name: 'Same-Day Varanasi City & Sarnath Private Guided Tour (8 Hours)',
              description:
                'Private AC car with chauffeur and licensed local historian guide covering Kashi Vishwanath, Annapurna, Kal Bhairav, BHU Vishwanath temple, Manikarnika ghat walk, and Sarnath Deer Park.',
              offers: {
                '@type': 'Offer',
                price: '2499',
                priceCurrency: 'INR',
                availability: 'https://schema.org/InStock',
              },
            },
          },
        ],
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${site}/varanasi-travel-agency/#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${site}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Varanasi Travel Agency',
          item: `${site}/varanasi-travel-agency`,
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${site}/varanasi-travel-agency/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Which is the best travel agency in Varanasi for tour packages?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Varanasi Travel Agency by Vinayak Travels (Est. 1982) is widely regarded as the leading travel agency in Varanasi. With over 42 years of on-ground hospitality experience, 4.8-star verified reviews, registered Sigra-Mahmoorganj offices, and dedicated pilgrimage coordinators, we deliver transparently priced packages with guaranteed zero scam detours.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the Varanasi travel agency contact number for booking and inquiries?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can reach our 24×7 customer care hotline directly at +91 99354 74730, or call our central operations desk at +91 94503 01573. For instant itinerary customization, WhatsApp us anytime at +91 99354 74730.',
          },
        },
        {
          '@type': 'Question',
          name: 'Where is your travel agency located in Mahmoorganj / Sigra Varanasi?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our registered operations hub is located at L 10/125, Shastri Nagar, Sigra, Varanasi 221010, directly on the Sigra–Mahmoorganj main road (approximately 800 meters from Mahmoorganj Crossing and 5 minutes from Varanasi Cantt Railway Station). Walk-ins and itinerary consultations are welcomed daily from 7:00 AM to 10:00 PM.',
          },
        },
        {
          '@type': 'Question',
          name: 'What tour packages does Varanasi Travel Agency provide and what are the starting costs?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We offer all-inclusive pilgrimage and holiday packages: 1-Day Varanasi City & Sarnath Guided Tour from ₹2,499 per group; 2N/3D Complete Kashi Darshan with hotel stay from ₹4,999 per person; 3N/4D Varanasi-Ayodhya-Prayagraj Sacred Triangle from ₹8,999 per person; and Gaya Pind Daan Special from ₹6,499. Airport transfers start from ₹899.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you arrange wheelchair assistance and special VIP darshan for senior citizens?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Our specialized Senior Citizen Yatra includes dedicated ground escorts, licensed wheelchairs at Kashi Vishwanath and Sankat Mochan, battery e-rickshaw coordination through Godowlia pedestrian zones, and hotels with ground-floor or elevator-accessible rooms.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can Varanasi Travel Agency customize combined multi-city pilgrimage circuits?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We customize seamless itineraries connecting Varanasi with Ayodhya Ram Mandir, Prayagraj Triveni Sangam, Vindhyachal Shaktipeeth, Bodhgaya, Chitrakoot, and Naimisharanya with dedicated AC cabs or Tempo Travellers and hotel stays.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does your agency protect travelers against Varanasi tourist traps and scams?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We enforce a strict Scam Shield Guarantee: zero forced stops at commission silk emporiums, fixed-price private motorboats with life jackets, verified Teerth Purohits for temple rituals, and transparent itemized billing without hidden surcharges.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you arrange group travel with Tempo Travellers or Urbania mini-coaches?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, our agency operates an owned fleet of 9-seater, 12-seater, 17-seater, 20-seater, and 26-seater AC Tempo Travellers, as well as luxury 13/17-seater Force Urbania vans, perfect for family reunions and pilgrim groups.',
          },
        },
      ],
    },
  ],
});

export default getVaranasiTravelAgencySchema;
