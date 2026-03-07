import Link from 'next/link';
import CategoryPageLayout from '../../components/CategoryPage/CategoryPageLayout';
import { getSortedPostsData } from '../../lib/posts';
import { listByCategory, getBreadcrumbConfig } from '../../lib/categories';
import { CONTACT, getCallTelHref } from '@/lib/contact';

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
        name: 'Taxi, Group Travel & Pilgrimage Services in Varanasi',
        description: 'Curated list of taxi services, airport transfers, group transport, tempo travellers, and pilgrimage-planning support in Varanasi.',
        url: `${cfg.baseUrl}/en/services/`,
        isPartOf: { '@id': `${cfg.baseUrl}#website` },
        breadcrumb: { '@id': `${cfg.baseUrl}/en/services/#breadcrumbs` },
        about: services.map(p => ({ '@type': 'Thing', name: p.title || p.slug, url: `${cfg.baseUrl}${p.routePath || `/en/${p.slug}`}` })),
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

  // Add icons and CTA text to services
  const servicesWithIcons = services.map(service => ({
    ...service,
    icon: '🚕',
    ctaText: 'View Service Details'
  }));

  return { props: { services: servicesWithIcons, jsonLd } };
}

export default function ServicesPage({ services, jsonLd }) {
  return (
    <CategoryPageLayout
      title="Explore Our Full Range of Varanasi Taxi, Group Travel & Pilgrimage Services"
      metaTitle="Varanasi Taxi Service Directory | Cabs, Group Transport & Pilgrimage Support"
      metaDescription="Browse airport transfers, local sightseeing cabs, tempo travellers, group transport and pilgrimage planning services in Varanasi. Compare rates and book 24/7."
      heroTitle="Varanasi Taxi & Group Travel Directory"
      heroSubtitle="Browse cabs, tempo travellers, airport transfers, and pilgrimage-planning support from one Kashi travel desk"
      heroBadge="🚕 SERVICE DIRECTORY"
      items={services}
      jsonLd={jsonLd}
    >
      {/* Custom Content Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-cyan-100 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
          Complete Varanasi Travel Desk – Airport, Local & Outstation
        </h2>

        <div className="space-y-5 text-gray-700 leading-relaxed">
          <p>
            From first hello to final drop, our dispatcher stays on WhatsApp{' '}
            <a className="text-cyan-600 hover:text-teal-600 font-semibold underline transition-colors" href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer">{CONTACT.whatsappNumberDisplay}</a>
            {' '}and phone{' '}
            <a className="text-cyan-600 hover:text-teal-600 font-semibold underline transition-colors" href={getCallTelHref()}>{CONTACT.callNumberDisplay}</a>
            . We arrange airport taxis, Pink Taxi (women-only) rides,{' '}
            <Link className="text-cyan-600 hover:text-teal-600 font-semibold underline" href="/en/varanasi-day-tour-cab-charges">local sightseeing cabs</Link>,{' '}
            <Link className="text-cyan-600 hover:text-teal-600 font-semibold underline" href="/en/varanasi-tour-package-for-families">family-ready Varanasi packages</Link>,{' '}
            <Link className="text-cyan-600 hover:text-teal-600 font-semibold underline" href="/en/varanasi-tour-package-with-hotel">hotel + cab packages</Link>,{' '}
            <Link className="text-cyan-600 hover:text-teal-600 font-semibold underline" href="/en/kashi-vishwanath-darshan-ganga-aarti-package">Kashi Vishwanath + Ganga Aarti planning</Link>,{' '}
            <Link className="text-cyan-600 hover:text-teal-600 font-semibold underline" href="/en/varanasi-group-tour-package">Varanasi group tour packages</Link>,{' '}
            <Link className="text-cyan-600 hover:text-teal-600 font-semibold underline" href="/en/ayodhya-varanasi-prayagraj-group-tour-package">Ayodhya / Prayagraj pilgrim circuits</Link>,{' '}
            <Link className="text-cyan-600 hover:text-teal-600 font-semibold underline" href="/en/varanasi-to-gaya-bodh-gaya-tour-package">Bodh Gaya spiritual tours</Link>, staff transport shuttles and 12–26 seater tempo travellers.
          </p>

          <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-r-lg">
            <p className="text-sm">
              <strong className="text-cyan-700">💰 Transparent Pricing:</strong> Every service listing includes transparent fare grids, kilometre limits and add-ons (parking, tolls, night allowance) so you know exactly what you pay.
            </p>
          </div>

          <p>
            Combine multiple services into one itinerary, request English-speaking drivers or certified guides, and sync private boats or hotel pickups across family groups. If the buying decision starts outside Varanasi, begin with{' '}
            <Link className="text-cyan-600 hover:text-teal-600 font-semibold underline" href="/en/varanasi-tour-package-from-delhi">Varanasi Tour Package from Delhi</Link>
            {' '}before narrowing the transport layer. If the main question is where to stay, begin with{' '}
            <Link className="text-cyan-600 hover:text-teal-600 font-semibold underline" href="/en/varanasi-tour-package-with-hotel">Varanasi Tour Package with Hotel</Link>.
          </p>

          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg">
            <p className="text-sm">
              <strong className="text-teal-700">🎉 Festival Planning:</strong> Planning during peak festivals? Start with our{' '}
              <Link className="text-teal-600 hover:text-teal-700 font-semibold underline" href="/en/dashashwamedh-ghat-ganga-aarti-timing">Ganga Aarti guide</Link>
              {' '}or{' '}
              <Link className="text-teal-600 hover:text-teal-700 font-semibold underline" href="/en/dev-deepawali-2025-varanasi-ultimate-guide">Dev Deepawali plan</Link>
              {' '}and we will layer the logistics—cabs, boats, darshan assistance and hotel coordination—into a single confirmation thread. If temple plus Aarti is the actual buying question, use{' '}
              <Link className="text-teal-600 hover:text-teal-700 font-semibold underline" href="/en/kashi-vishwanath-darshan-ganga-aarti-package">the dedicated darshan package page</Link>.
            </p>
          </div>

          <p>
            One team, one payment trail, zero surprises.
          </p>
        </div>
      </div>
    </CategoryPageLayout>
  );
}
