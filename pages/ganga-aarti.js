import Head from 'next/head';
import GangaAartiScene from '../components/GangaAartiScene/GangaAartiScene';
import VaranasiScrollJourney from '../components/VaranasiScrollJourney/VaranasiScrollJourney';
import VaranasiExperienceSeo, { JOURNEY_FAQS, JOURNEY_STOPS } from '../components/VaranasiExperienceSeo/VaranasiExperienceSeo';
import Footer from '../components/Footer/Footer';
import StickyContactBar from '../components/ServicePage/StickyContactBar';
import JsonLd from '../components/JsonLd/JsonLd';
import { generateBreadcrumbSchema, generateFAQSchema } from '../lib/schemaGenerator';
import { SOCIAL_PROFILE_URLS } from '../config/socials';
import { CONTACT } from '../lib/contact';

const SITE = 'https://www.kashitaxi.in';
const PAGE_URL = `${SITE}/ganga-aarti`;
const OG_IMAGE = 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/dashashwamedh-aarti-platforms-2025.jpg';

const TITLE = 'Ganga Aarti Varanasi: An Immersive One-Day Kashi Experience';
const DESCRIPTION = 'Scroll a cinematic day in Varanasi — sunrise on the Ganges, Kashi Vishwanath, the old-city galis, Sarnath and the 5:45 PM Ganga Aarti at Dashashwamedh — with real timings and planning help.';

// Attractions are declared once and reused by both the TouristTrip itinerary
// and the standalone TouristAttraction nodes, so the two can never drift apart.
const ATTRACTIONS = [
  {
    name: 'Dashashwamedh Ghat',
    description: 'The principal ghat of Varanasi and the site of the nightly Ganga Aarti, performed by priests on tiered platforms facing the river.',
    geo: { latitude: 25.3072, longitude: 83.0106 },
  },
  {
    name: 'Kashi Vishwanath Temple',
    description: 'One of the twelve Jyotirlingas, reached through the Kashi Vishwanath Dham corridor that now connects the temple to the river.',
    geo: { latitude: 25.3109, longitude: 83.0107 },
  },
  {
    name: 'Vishwanath Gali',
    description: 'The narrow old-city lane leading to the temple, lined with Banarasi silk shops, sweet stalls, wall shrines and kulhad chai.',
    geo: { latitude: 25.3105, longitude: 83.0102 },
  },
  {
    name: 'Sarnath',
    description: 'The deer park ten kilometres from Varanasi where the Buddha gave his first sermon, dominated by the Dhamek Stupa.',
    geo: { latitude: 25.3811, longitude: 83.0244 },
  },
  {
    name: 'Assi Ghat',
    description: 'The southern ghat where the Subah-e-Banaras morning aarti, chanting and yoga begin before sunrise.',
    geo: { latitude: 25.2877, longitude: 83.0056 },
  },
];

const VARANASI_ADDRESS = {
  '@type': 'PostalAddress',
  addressLocality: 'Varanasi',
  addressRegion: 'Uttar Pradesh',
  postalCode: '221001',
  addressCountry: 'IN',
};

export default function GangaAartiPage({ aartiSchedule }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${PAGE_URL}/#webpage`,
        url: PAGE_URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: 'en-IN',
        primaryImageOfPage: OG_IMAGE,
        isPartOf: { '@id': `${SITE}/#website` },
        about: { '@id': `${PAGE_URL}/#trip` },
        breadcrumb: { '@id': `${PAGE_URL}/#breadcrumb` },
      },
      {
        ...generateBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Ganga Aarti & the Varanasi Day Experience', url: '/ganga-aarti' },
        ]),
        '@id': `${PAGE_URL}/#breadcrumb`,
      },
      {
        '@type': 'TouristTrip',
        '@id': `${PAGE_URL}/#trip`,
        name: 'One Day in Varanasi: Sunrise Boat, Kashi Vishwanath, Sarnath and the Ganga Aarti',
        description: 'A single-day Varanasi itinerary that runs from the sunrise boat ride and Subah-e-Banaras at Assi Ghat through Kashi Vishwanath darshan and the old-city lanes to Sarnath, closing with the evening Ganga Aarti at Dashashwamedh Ghat.',
        url: PAGE_URL,
        image: OG_IMAGE,
        touristType: ['Spiritual travellers', 'Cultural travellers', 'First-time visitors to Varanasi'],
        itinerary: {
          '@type': 'ItemList',
          numberOfItems: JOURNEY_STOPS.length,
          itemListElement: JOURNEY_STOPS.map((stop, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'TouristAttraction',
              name: stop.title,
              description: stop.copy,
              address: VARANASI_ADDRESS,
            },
          })),
        },
        provider: { '@id': `${SITE}/#organization` },
      },
      ...ATTRACTIONS.map((attraction) => ({
        '@type': 'TouristAttraction',
        '@id': `${PAGE_URL}/#${attraction.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: attraction.name,
        description: attraction.description,
        address: VARANASI_ADDRESS,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: attraction.geo.latitude,
          longitude: attraction.geo.longitude,
        },
        isAccessibleForFree: true,
        touristType: ['Spiritual travellers', 'Cultural travellers'],
      })),
      {
        '@type': 'Event',
        '@id': `${PAGE_URL}/#ganga-aarti`,
        name: 'Ganga Aarti at Dashashwamedh Ghat, Varanasi',
        description: 'The nightly Ganga Aarti at Dashashwamedh Ghat: priests on tiered platforms offer fire, incense and conch to the river. It begins around 5:45 PM from October to March and around 6:45 PM from April to September, and lasts about forty-five minutes.',
        url: PAGE_URL,
        image: OG_IMAGE,
        startDate: aartiSchedule.startDate,
        endDate: aartiSchedule.endDate,
        eventSchedule: aartiSchedule.schedules.map((schedule) => ({
          '@type': 'Schedule',
          startDate: schedule.from,
          endDate: schedule.to,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          repeatFrequency: 'P1D',
          scheduleTimezone: 'Asia/Kolkata',
        })),
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        isAccessibleForFree: true,
        location: {
          '@type': 'Place',
          name: 'Dashashwamedh Ghat',
          address: VARANASI_ADDRESS,
          geo: { '@type': 'GeoCoordinates', latitude: 25.3072, longitude: 83.0106 },
        },
        organizer: {
          '@type': 'Organization',
          name: 'Ganga Seva Nidhi',
        },
      },
      {
        ...generateFAQSchema(JOURNEY_FAQS),
        '@id': `${PAGE_URL}/#faq`,
      },
      {
        '@type': ['LocalBusiness', 'TravelAgency'],
        '@id': `${SITE}/#organization`,
        name: 'Kashi Taxi',
        url: SITE,
        telephone: CONTACT.callNumberE164,
        address: VARANASI_ADDRESS,
        areaServed: [
          { '@type': 'City', name: 'Varanasi' },
          { '@type': 'State', name: 'Uttar Pradesh' },
        ],
        priceRange: '₹₹',
        sameAs: SOCIAL_PROFILE_URLS,
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta
          name="keywords"
          content="ganga aarti varanasi, ganga aarti timing, dashashwamedh ghat aarti, varanasi one day itinerary, kashi vishwanath darshan, sarnath, varanasi sunrise boat ride"
        />
        <meta name="theme-color" content="#09071b" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <link rel="canonical" href={PAGE_URL} />
        <link rel="alternate" hrefLang="en" href={PAGE_URL} />
        <link rel="alternate" hrefLang="en-IN" href={PAGE_URL} />
        <link rel="alternate" hrefLang="x-default" href={PAGE_URL} />
        <meta property="og:site_name" content="Kashi Taxi" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:title" content="One Day in Eternal Varanasi — An Immersive Ganga Aarti Journey" />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content="Priests performing the evening Ganga Aarti on the platforms at Dashashwamedh Ghat, Varanasi" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="One Day in Eternal Varanasi — An Immersive Ganga Aarti Journey" />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Head>
      <JsonLd data={structuredData} />
      <main>
        <GangaAartiScene />
        <VaranasiScrollJourney />
        <VaranasiExperienceSeo />
      </main>
      <Footer />
      <StickyContactBar phone={CONTACT.callNumberRaw} floatingOnly />
    </>
  );
}

// The aarti is a daily ceremony with two seasonal timings. Deriving the schedule
// window at build time keeps the Event node from going stale every January
// without making the markup churn on every request.
export function getStaticProps() {
  const year = new Date().getUTCFullYear();
  const schedules = [
    { from: `${year}-04-01`, to: `${year}-09-30`, startTime: '18:45', endTime: '19:30' },
    { from: `${year}-10-01`, to: `${year + 1}-03-31`, startTime: '17:45', endTime: '18:30' },
  ];

  return {
    props: {
      aartiSchedule: {
        startDate: `${year}-04-01T18:45:00+05:30`,
        endDate: `${year + 1}-03-31T18:30:00+05:30`,
        schedules,
      },
    },
  };
}
