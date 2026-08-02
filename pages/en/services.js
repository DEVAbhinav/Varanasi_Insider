import Link from 'next/link';
import CategoryPageLayout from '../../components/CategoryPage/CategoryPageLayout';
import { getBreadcrumbConfig } from '../../lib/categories';
import { CONTACT, getCallTelHref } from '@/lib/contact';

const CURATED_SERVICES = [
  {
    slug: 'taxi-service-varanasi',
    href: '/',
    title: 'Taxi Service in Varanasi',
    description: 'General taxi booking for airport, station, local and outstation travel.',
    icon: '🚕',
    ctaText: 'Book a taxi',
  },
  {
    slug: 'taxi-route-directory',
    href: '/en/city/varanasi/taxi',
    title: 'Taxi Routes & Fare Guides',
    description: 'Browse focused airport, station, local, one-way and outstation route pages.',
    icon: '🗺️',
    ctaText: 'Browse taxi routes',
  },
  {
    slug: 'airport-taxi',
    href: '/en/varanasi-airport-taxi-guide',
    title: 'Varanasi Airport Taxi',
    description: 'Plan a Babatpur airport pickup or drop with the correct meeting point.',
    icon: '✈️',
    ctaText: 'Plan airport pickup',
  },
  {
    slug: 'outstation-cabs',
    href: '/en/outstation-cabs-from-varanasi',
    title: 'Outstation Cabs from Varanasi',
    description: 'Compare route-specific one-way and round-trip taxi options.',
    icon: '🛣️',
    ctaText: 'View outstation routes',
  },
  {
    slug: 'local-sightseeing',
    href: '/en/services/varanasi-full-day-city-tour-winter-2026',
    title: 'Local Sightseeing by Car',
    description: 'Vehicle-only local sightseeing for temples, ghats, BHU and Sarnath.',
    icon: '🛕',
    ctaText: 'View local sightseeing',
  },
  {
    slug: 'tempo-traveller',
    href: '/en/tempo-traveller-varanasi',
    title: 'Tempo Traveller & Group Vehicles',
    description: 'Choose a suitable group vehicle when one car is not enough.',
    icon: '🚌',
    ctaText: 'Choose a group vehicle',
  },
  {
    slug: 'bike-rental',
    href: '/bike-rentals-varanasi',
    title: 'Bike & Scooty Rental',
    description: 'Self-drive two-wheeler rental for independent local movement.',
    icon: '🛵',
    ctaText: 'View rentals',
  },
  {
    slug: 'boat-rides',
    href: '/en/morning-boat-ride-varanasi-price',
    title: 'Varanasi Boat Rides',
    description: 'Morning and evening boat options with route and timing guidance.',
    icon: '⛵',
    ctaText: 'View boat rides',
  },
  {
    slug: 'hotel-booking',
    href: '/en/services/hotel-booking-in-varanasi',
    title: 'Hotel & Stay Support',
    description: 'Start here when accommodation is the main requirement.',
    icon: '🏨',
    ctaText: 'View stay support',
  },
  {
    slug: 'tour-packages',
    href: '/en/packages/varanasi-tour-package',
    title: 'Tour & Pilgrimage Packages',
    description: 'Use packages for hotels, darshan planning, guides and multi-day itineraries.',
    icon: '🧭',
    ctaText: 'Browse packages',
  },
];

export async function getStaticProps() {
  const cfg = getBreadcrumbConfig();
  const canonicalUrl = `${cfg.baseUrl}/en/services`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonicalUrl}#page`,
        name: 'Varanasi Travel Services Directory',
        description: 'Curated taxi, vehicle, boat, stay and tour-planning services for Varanasi.',
        url: canonicalUrl,
        isPartOf: { '@id': `${cfg.baseUrl}#website` },
        breadcrumb: { '@id': `${canonicalUrl}#breadcrumbs` },
        about: CURATED_SERVICES.map((service) => ({
          '@type': 'Thing',
          name: service.title,
          url: `${cfg.baseUrl}${service.href}`,
        })),
        publisher: { '@type': 'Organization', '@id': `${cfg.baseUrl}#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${cfg.baseUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Services', item: canonicalUrl },
        ],
      },
    ],
  };

  return { props: { services: CURATED_SERVICES, jsonLd, canonicalUrl } };
}

export default function ServicesPage({ services, jsonLd, canonicalUrl }) {
  return (
    <CategoryPageLayout
      title="Choose the Right Varanasi Travel Service"
      metaTitle="Varanasi Travel Services | Taxi, Vehicles, Boats & Stays"
      metaDescription="Choose taxi-only booking, airport transfer, outstation cab, group vehicle, boat, stay support or a complete Varanasi tour package."
      heroTitle="Varanasi Travel Services Directory"
      heroSubtitle="Start with transport when you know the route; choose a package when you need hotels, darshan or itinerary planning"
      heroBadge="SERVICE CHOOSER"
      items={services}
      jsonLd={jsonLd}
      canonicalUrl={canonicalUrl}
      pageLang="en"
    >
      <div className="mx-auto mb-12 grid max-w-5xl gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-cyan-200 bg-white p-7 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900">I Only Need Transport</h2>
          <p className="mt-3 text-slate-700">
            Use this path when you know the pickup, destination, date and passenger count.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/"
              data-cta-id="services_taxi_choice"
              data-cta-location="services_intent_chooser"
              data-intent-cluster="generic_taxi"
              className="rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white hover:bg-cyan-700"
            >
              Book Taxi Only
            </Link>
            <Link
              href="/en/city/varanasi/taxi"
              className="rounded-xl border border-cyan-300 px-5 py-3 font-semibold text-cyan-800 hover:bg-cyan-50"
            >
              Browse Taxi Routes
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-white p-7 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900">I Need Trip Planning</h2>
          <p className="mt-3 text-slate-700">
            Use packages when hotels, darshan timing, guides or a multi-day itinerary are part of the decision.
          </p>
          <Link
            href="/en/packages/varanasi-tour-package"
            data-cta-id="services_package_choice"
            data-cta-location="services_intent_chooser"
            data-intent-cluster="tour_package"
            className="mt-5 inline-flex rounded-xl bg-amber-500 px-5 py-3 font-semibold text-slate-950 hover:bg-amber-400"
          >
            Browse Tour Packages
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl rounded-2xl border border-cyan-100 bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-900">Need Help Choosing?</h2>
        <p className="mt-3 text-slate-700">
          Tell us whether you need only a vehicle or a complete trip plan. We will send you to the correct quotation flow rather than mixing taxi and package pricing.
        </p>
        <p className="mt-4 text-slate-700">
          WhatsApp <a className="font-semibold text-cyan-700 underline" href={CONTACT.whatsappUrl}>{CONTACT.whatsappNumberDisplay}</a>
          {' '}or call <a className="font-semibold text-cyan-700 underline" href={getCallTelHref()}>{CONTACT.callNumberDisplay}</a>.
        </p>
      </div>
    </CategoryPageLayout>
  );
}
