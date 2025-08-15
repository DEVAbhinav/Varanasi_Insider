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
      </main>
      <Footer />
    </>
  );
}
