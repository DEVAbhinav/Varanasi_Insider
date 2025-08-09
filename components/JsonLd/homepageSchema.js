// components/JsonLd/homepageSchema.js
// Returns JSON-LD for the homepage (WebSite + LocalBusiness + FAQPage)

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
      logo: `${site}/images/logo.jpeg`,
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
          opens: '00:00',
          closes: '23:59',
        },
      ],
      priceRange: '₹₹',
      currenciesAccepted: 'INR',
      paymentAccepted: 'Cash, UPI',
      areaServed: [
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
