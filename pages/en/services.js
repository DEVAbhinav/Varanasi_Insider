import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import { getSortedPostsData } from '../../lib/posts';
import { listByCategory, getBreadcrumbConfig } from '../../lib/categories';

export async function getStaticProps() {
  const allEnPosts = getSortedPostsData('en');
  const services = listByCategory(allEnPosts, 'services');
  const cfg = getBreadcrumbConfig();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${cfg.baseUrl}/en/services/`,
        name: 'Taxi & Travel Services in Varanasi',
        description: 'Curated list of taxi services, fares, airport transfers, and rentals in Varanasi.',
        url: `${cfg.baseUrl}/en/services/`,
        isPartOf: { '@id': `${cfg.baseUrl}#website` },
        breadcrumb: { '@id': `${cfg.baseUrl}/en/services/#breadcrumbs` },
        about: services.map(p => ({ '@type': 'Thing', name: p.title || p.slug, url: `${cfg.baseUrl}/en/${p.slug}` })),
        publisher: { '@type': 'Organization', '@id': `${cfg.baseUrl}#organization` }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${cfg.baseUrl}/en/services/#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${cfg.baseUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${cfg.baseUrl}/en/services/` }
        ]
      }
    ]
  };
  return { props: { services, jsonLd } };
}

export default function ServicesPage({ services, jsonLd }) {
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
          {services.map((p) => (
            <Link key={p.slug} href={`/en/${p.slug}`} className="block border rounded-lg p-5 hover:shadow-md transition">
              <h2 className="text-xl font-semibold">{p.title || p.slug}</h2>
              <p className="text-gray-600 mt-1">{p.description || ''}</p>
              <span className="text-yellow-700 font-semibold inline-block mt-2">View →</span>
            </Link>
          ))}
        </div>

        <section className="mt-12 space-y-5 text-gray-700">
          <h2 className="text-2xl font-semibold text-slate-900">Complete Varanasi Travel Desk – Airport, Local &amp; Outstation</h2>
          <p>
            From first hello to final drop, our dispatcher stays on WhatsApp <a className="text-yellow-700 underline" href="https://wa.me/919935474730" target="_blank" rel="noopener noreferrer">+91-99354-74730</a> and phone{' '}
            <a className="text-yellow-700 underline" href="tel:+919450301573">+91-94503-01573</a>. We arrange airport taxis, Pink Taxi (women-only) rides,{' '}
            <Link className="text-yellow-700 underline" href="/en/varanasi-day-tour-cab-charges">local sightseeing cabs</Link>,{' '}
            <Link className="text-yellow-700 underline" href="/en/varanasi-to-ayodhya">Ayodhya / Prayagraj pilgrim circuits</Link>,{' '}
            <Link className="text-yellow-700 underline" href="/en/varanasi-to-gaya-bodh-gaya-tour-package">Bodh Gaya spiritual tours</Link>, staff transport shuttles and 12–26 seater tempo travellers.
          </p>
          <p>
            Every service listing includes transparent fare grids, kilometre limits and add-ons (parking, tolls, night allowance) so you know exactly what you pay. Combine multiple services into one itinerary, request English-speaking drivers or certified guides, and sync private boats or hotel pickups across family groups.
          </p>
          <p>
            Planning during peak festivals? Start with our{' '}
            <Link className="text-yellow-700 underline" href="/en/dashashwamedh-ghat-ganga-aarti-timing">Ganga Aarti guide</Link> or{' '}
            <Link className="text-yellow-700 underline" href="/en/dev-deepawali-2025-varanasi-ultimate-guide">Dev Deepawali plan</Link> and we will layer the logistics—cabs, boats, darshan assistance and hotel coordination—into a single confirmation thread. One team, one payment trail, zero surprises.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
