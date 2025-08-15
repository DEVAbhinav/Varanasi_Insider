import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';

export default function PackagesPage() {
  const items = [
    { href: '/en/tour-package-from-varanasi', title: 'Varanasi Tour Packages', desc: 'Handpicked itineraries with pricing and inclusions.' },
    { href: '/en/varanasi-day-tour-cab-charges', title: 'Varanasi Day Tour (Cab)', desc: 'Private day tour with trusted drivers.' },
    { href: '/en/evening-boat-ride-varanasi-ganga-aarti', title: 'Evening Ganga Aarti Boat Ride', desc: 'Best seats, timings and booking help.' }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://www.kashitaxi.in/en/packages/',
        name: 'Varanasi Packages & Tours',
        description: 'Curated packages and tours in Varanasi with transparent pricing and safety-first operations.',
        url: 'https://www.kashitaxi.in/en/packages/',
        isPartOf: { '@id': 'https://www.kashitaxi.in#website' },
        breadcrumb: { '@id': 'https://www.kashitaxi.in/en/packages/#breadcrumbs' },
        about: items.map(i => ({ '@type': 'Thing', name: i.title, url: `https://www.kashitaxi.in${i.href}` })),
        publisher: { '@type': 'Organization', '@id': 'https://www.kashitaxi.in#organization' }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.kashitaxi.in/en/packages/#breadcrumbs',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.kashitaxi.in/' },
          { '@type': 'ListItem', position: 2, name: 'Packages', item: 'https://www.kashitaxi.in/en/packages/' }
        ]
      }
    ]
  };

  return (
    <>
      <Head>
        <title>Varanasi Packages & Tours | Kashi Taxi</title>
        <meta name="description" content="Browse Varanasi tour packages, day trips and boat rides. Transparent pricing with trusted operators." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <NavBar />
      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <h1 className="text-4xl font-bold mb-8 font-serif">Varanasi Packages & Tours</h1>
        <p className="text-gray-700 mb-8">Discover our most-loved packages and experiences.</p>
        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((i) => (
            <Link key={i.href} href={i.href} className="block border rounded-lg p-5 hover:shadow-md transition">
              <h2 className="text-xl font-semibold">{i.title}</h2>
              <p className="text-gray-600 mt-1">{i.desc}</p>
              <span className="text-yellow-700 font-semibold inline-block mt-2">Explore →</span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
