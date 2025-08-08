// components/JsonLd/homepageSchema.js
// Returns JSON-LD for the homepage (WebSite + LocalBusiness)

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
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${site}/#org`,
      name: 'Kashi Taxi (Vinayak Travels Tour)',
      url: `${site}/`,
      logo: `${site}/logo.jpeg`,
      image: `${site}/images/varanasi-hero.png`,
      description:
        '24×7 taxi service in Varanasi for airport transfers, local darshan and outstation trips.',
      telephone: '+91-9450301573',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Shastri Nagar (near IP Mall), Sigra/Chetganj',
        addressLocality: 'Varanasi',
        addressRegion: 'Uttar Pradesh',
        postalCode: '221002',
        addressCountry: 'IN',
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
          opens: '06:00',
          closes: '22:00',
        },
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+91-9450301573',
          contactType: 'customer service',
          availableLanguage: ['en', 'hi'],
        },
        {
          '@type': 'ContactPoint',
          telephone: '+91-9935474730',
          contactType: 'WhatsApp',
          availableLanguage: ['en', 'hi'],
        },
      ],
    },
  ],
});

export default getHomeSchema;
