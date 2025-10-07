import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import { getSortedPostsData } from '../../lib/posts';
import { listByCategory, getBreadcrumbConfig } from '../../lib/categories';

export async function getStaticProps() {
  const allEnPosts = getSortedPostsData('en');
  const packages = listByCategory(allEnPosts, 'packages');
  const cfg = getBreadcrumbConfig();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${cfg.baseUrl}/en/packages/`,
        name: 'Varanasi Packages & Tours',
        description: 'Curated packages and tours in Varanasi with transparent pricing and safety-first operations.',
        url: `${cfg.baseUrl}/en/packages/`,
        isPartOf: { '@id': `${cfg.baseUrl}#website` },
        breadcrumb: { '@id': `${cfg.baseUrl}/en/packages/#breadcrumbs` },
        about: packages.map(p => ({ '@type': 'Thing', name: p.title || p.slug, url: `${cfg.baseUrl}/en/${p.slug}` })),
        publisher: { '@type': 'Organization', '@id': `${cfg.baseUrl}#organization` }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${cfg.baseUrl}/en/packages/#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${cfg.baseUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Packages', item: `${cfg.baseUrl}/en/packages/` }
        ]
      }
    ]
  };
  return { props: { packages, jsonLd } };
}

export default function PackagesPage({ packages, jsonLd }) {
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
          {packages.map((p) => (
            <Link key={p.slug} href={`/en/${p.slug}`} className="block border rounded-lg p-5 hover:shadow-md transition">
              <h2 className="text-xl font-semibold">{p.title || p.slug}</h2>
              <p className="text-gray-600 mt-1">{p.description || ''}</p>
              <span className="text-yellow-700 font-semibold inline-block mt-2">Explore →</span>
            </Link>
          ))}
        </div>

        <section className="mt-12 space-y-5 text-gray-700">
          <h2 className="text-2xl font-semibold text-slate-900">Design a Varanasi Taxi Package That Fits Your Pilgrimage</h2>
          <p>
            Every itinerary begins with a quick call or WhatsApp on <a className="text-yellow-700 underline" href="tel:+919450301573">+91-94503-01573</a> /{' '}
            <a className="text-yellow-700 underline" href="https://wa.me/919935474730" target="_blank" rel="noopener noreferrer">+91-99354-74730</a>. Tell us your arrival details, headcount and must-visit temples; we assemble cab, boat and guide options within
            minutes. Short stays often pair the <Link className="text-yellow-700 underline" href="/en/varanasi-day-tour-cab-charges">8 hr / 80 km city tour</Link> with sunrise Subah-e-Banaras, while longer circuits stretch to{' '}
            <Link className="text-yellow-700 underline" href="/en/varanasi-to-ayodhya">Ayodhya</Link>, <Link className="text-yellow-700 underline" href="/en/varanasi-to-prayagraj">Prayagraj</Link>,{' '}
            <Link className="text-yellow-700 underline" href="/en/varanasi-to-gaya-bodh-gaya-tour-package">Bodh Gaya</Link> and Vindhyachal Shakti Peeth.
          </p>
          <p>
            Each package clearly lists inclusions (vehicle category, kilometre limits, tolls, parking, night allowances) so you can budget upfront. Need a women-only chauffeur? We can weave in our{' '}
            <Link className="text-yellow-700 underline" href="/pink-taxi-varanasi">Pink Taxi service</Link> for airport arrivals or late-night darshan runs. Families often request private boats for Dashashwamedh Aarti—check the updated pricing in our{' '}
            <Link className="text-yellow-700 underline" href="/en/evening-boat-ride-varanasi-ganga-aarti">Evening Boat Ride guide</Link> and ask the team to sync boat timings with your cab schedule.
          </p>
          <p>
            Travelling during Dev Deepawali, Mahashivratri or Kartik Purnima? Slots sell out early. Share your festival dates and we will lock accommodations, darshan assistance and buffer hours for traffic diversions. All confirmations arrive via WhatsApp with driver and vehicle details the evening before each leg so you stay informed without chasing the dispatcher.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
