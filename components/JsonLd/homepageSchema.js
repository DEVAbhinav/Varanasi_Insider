// components/JsonLd/homepageSchema.js
// Returns JSON-LD for the homepage (WebSite + LocalBusiness + TaxiService + FAQPage)

const getHomeSchema = (site) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${site}/#website`,
      url: `${site}/`,
      name: 'Kashi Taxi',
      inLanguage: 'en',
      publisher: { '@id': `${site}/#org` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${site}/en?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': ['LocalBusiness', 'TaxiService'],
      '@id': `${site}/#org`,
      name: 'Vinayak Travels',
      alternateName: ['Kashi Taxi', 'Varanasi Taxi Service', 'Vinayak Travels Tour'],
      url: `${site}/`,
      logo: `${site}/images/logo.jpeg`,
      image: [
        `${site}/images/varanasi-hero.png`,
        `${site}/images/taxi-varanasi.jpg`,
        `${site}/images/kashi-taxi-service.jpg`
      ],
      description:
        '24×7 professional taxi service in Varanasi for airport transfers, local darshan, outstation trips, and city tours. Clean AC vehicles with experienced drivers.',
      slogan: 'Your trusted travel partner in Kashi',
      telephone: '+91-9450301573',
      faxNumber: '+91-9935474730',
      email: 'info@kashitaxi.in',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Vinayak Travels, Varanasi',
        addressLocality: 'Varanasi',
        addressRegion: 'Uttar Pradesh',
        postalCode: '221010',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 25.287133678944816,
        longitude: 82.94264689837131,
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
        name: 'Taxi Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Airport Transfer Service',
              description: 'Varanasi Airport pickup and drop service',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Local Darshan Tours',
              description: 'Varanasi city tours and temple visits',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Outstation Taxi',
              description: 'Long-distance travel to Ayodhya, Prayagraj, Bodhgaya',
            },
          },
        ],
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+91-9450301573',
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
          telephone: '+91-9935474730',
          contactType: 'WhatsApp',
          availableLanguage: ['en', 'hi'],
        },
      ],
      sameAs: [
        'https://wa.me/919935474730',
        'https://maps.app.goo.gl/gbmqXgHE8Nzq5NrbA',
      ],
      foundingDate: '2018',
      numberOfEmployees: '15-25',
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
        ratingValue: '4.8',
        reviewCount: '87',
        bestRating: '5',
        worstRating: '1',
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
          name: 'Are tolls/parking included?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'We state inclusions up-front. Airport parking (first 15 min) is included for pickups; longer waits are billed at actuals.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you operate late nights/early mornings?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes—24×7. Night charges (if any) are shared in the quote before you confirm.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I do Ayodhya as a day trip?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Possible but tight. We recommend 2 days/1 night for unhurried darshan and evening aarti.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you pick from the ghats?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cars can’t reach many ghats. We coordinate the nearest pickup point and help with directions.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do drivers speak English?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most are Hindi + basic English; full English-speaking drivers available on request.',
          },
        },
      ],
    },
  ],
});

export default getHomeSchema;
