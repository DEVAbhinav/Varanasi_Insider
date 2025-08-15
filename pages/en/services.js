import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';

export default function ServicesPage() {
  const items = [
    { href: '/en/varanasi-airport-taxi-guide', title: 'Varanasi Airport Taxi Guide', desc: 'Fixed fares, tips, and the safest options from VNS airport.' },
    { href: '/en/varanasi-airport-taxi-price-guide', title: 'Airport Taxi Price Guide', desc: 'Transparent pricing and how to avoid overcharges.' },
    { href: '/en/varanasi-day-tour-cab-charges', title: 'Varanasi Day Tour Cab Charges', desc: 'Full-day and half-day cab pricing with inclusions.' },
    { href: '/en/lucknow-to-varanasi-taxi-fare', title: 'Lucknow to Varanasi Taxi Fare', desc: 'Outstation fares and travel tips.' },
    { href: '/en/bike-rentals-varanasi', title: 'Bike Rentals in Varanasi', desc: 'Scooty and bike rentals with documents checklist.' }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://www.kashitaxi.in/en/services/',
        name: 'Taxi & Travel Services in Varanasi',
        description: 'Curated list of taxi services, fares, airport transfers, and rentals in Varanasi.',
        url: 'https://www.kashitaxi.in/en/services/',
        isPartOf: { '@id': 'https://www.kashitaxi.in#website' },
        breadcrumb: { '@id': 'https://www.kashitaxi.in/en/services/#breadcrumbs' },
        about: items.map(i => ({ '@type': 'Thing', name: i.title, url: `https://www.kashitaxi.in${i.href}` })),
        publisher: { '@type': 'Organization', '@id': 'https://www.kashitaxi.in#organization' }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.kashitaxi.in/en/services/#breadcrumbs',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.kashitaxi.in/' },
          { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.kashitaxi.in/en/services/' }
        ]
      }
    ]
  };

  return (
    <>
      <Head>
        <title>Taxi & Travel Services in Varanasi | Kashi Taxi</title>
        <meta name="description" content="Taxi services, airport transfers, fares and rentals in Varanasi. Trusted, transparent, and safe for solo and female travellers." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <NavBar />
      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <h1 className="text-4xl font-bold mb-8 font-serif">Taxi & Travel Services</h1>
        <p className="text-gray-700 mb-8">Browse our most requested services with transparent fares and safety-first options.</p>
        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((i) => (
            <Link key={i.href} href={i.href} className="block border rounded-lg p-5 hover:shadow-md transition">
              <h2 className="text-xl font-semibold">{i.title}</h2>
              <p className="text-gray-600 mt-1">{i.desc}</p>
              <span className="text-yellow-700 font-semibold inline-block mt-2">View →</span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
