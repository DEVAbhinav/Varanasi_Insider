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
        <title>Varanasi Tour Packages & Day Trips | Fixed Pricing | Varanasi Taxi</title>
        <meta name="description" content="Browse Varanasi tour packages with transparent pricing. Airport transfers, local darshan, outstation trips to Prayagraj, Ayodhya & Bodhgaya. Book online or call 80621 82380" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-500 via-teal-500 to-cyan-600 text-white py-16 overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20px 20px, white 2%, transparent 0%), radial-gradient(circle at 60px 60px, white 2%, transparent 0%)',
            backgroundSize: '80px 80px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-3 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold border border-white/30">
              📦 TOUR PACKAGES & DEALS
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              Varanasi Tour Packages with Fixed Pricing
            </h1>
            <p className="text-lg md:text-xl text-cyan-50 max-w-2xl mx-auto">
              Curated travel packages for pilgrimage tours, sightseeing & outstation trips. No hidden charges.
            </p>
          </div>
        </div>
        
        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0 -mb-1">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-20">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>

      <main className="bg-gradient-to-b from-white via-cyan-50/30 to-white py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Packages Grid */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Popular Tour Packages
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Discover our most-loved packages and experiences
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((p) => (
                <Link 
                  key={p.slug} 
                  href={`/en/${p.slug}`}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-cyan-100 hover:border-cyan-300 hover:-translate-y-1"
                >
                  {/* Card Header with Gradient */}
                  <div className="h-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500"></div>
                  
                  <div className="p-6">
                    {/* Package Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">📦</span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors line-clamp-2 leading-snug">
                      {p.title || p.slug}
                    </h3>
                    
                    {/* Description */}
                    {p.description && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                        {p.description}
                      </p>
                    )}
                    
                    {/* CTA */}
                    <div className="flex items-center text-cyan-600 font-semibold text-sm group-hover:text-teal-600 group-hover:translate-x-1 transition-all">
                      View Package Details →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Information Section */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-cyan-100">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Design a Custom Varanasi Package
            </h2>
            
            <div className="space-y-5 text-gray-700 leading-relaxed">
              <p>
                Every itinerary begins with a quick call or WhatsApp on{' '}
                <a className="text-cyan-600 hover:text-teal-600 font-semibold underline transition-colors" href="tel:+918062182380">+91-80621-82380</a>
                {' / '}
                <a className="text-cyan-600 hover:text-teal-600 font-semibold underline transition-colors" href="https://wa.me/919935474730" target="_blank" rel="noopener noreferrer">+91-99354-74730</a>
                . Tell us your arrival details, headcount and must-visit temples; we assemble cab, boat and guide options within minutes.
              </p>
              
              <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-r-lg">
                <p className="text-sm">
                  <strong className="text-cyan-700">💡 Popular Combinations:</strong> Short stays often pair the{' '}
                  <Link className="text-cyan-600 hover:text-teal-600 font-semibold underline" href="/en/varanasi-day-tour-cab-charges">8 hr / 80 km city tour</Link>
                  {' '}with sunrise Subah-e-Banaras, while longer circuits stretch to{' '}
                  <Link className="text-cyan-600 hover:text-teal-600 font-semibold underline" href="/en/varanasi-to-ayodhya">Ayodhya</Link>,{' '}
                  <Link className="text-cyan-600 hover:text-teal-600 font-semibold underline" href="/en/varanasi-to-prayagraj">Prayagraj</Link>,{' '}
                  <Link className="text-cyan-600 hover:text-teal-600 font-semibold underline" href="/en/varanasi-to-gaya-bodh-gaya-tour-package">Bodh Gaya</Link>
                  {' '}and Vindhyachal Shakti Peeth.
                </p>
              </div>

              <p>
                Each package clearly lists inclusions (vehicle category, kilometre limits, tolls, parking, night allowances) so you can budget upfront. Need a women-only chauffeur? We can weave in our{' '}
                <Link className="text-cyan-600 hover:text-teal-600 font-semibold underline" href="/pink-taxi-varanasi">Pink Taxi service</Link>
                {' '}for airport arrivals or late-night darshan runs.
              </p>

              <p>
                Families often request private boats for Dashashwamedh Aarti—check the updated pricing in our{' '}
                <Link className="text-cyan-600 hover:text-teal-600 font-semibold underline" href="/en/evening-boat-ride-varanasi-ganga-aarti">Evening Boat Ride guide</Link>
                {' '}and ask the team to sync boat timings with your cab schedule.
              </p>

              <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg">
                <p className="text-sm">
                  <strong className="text-teal-700">🎉 Festival Bookings:</strong> Travelling during Dev Deepawali, Mahashivratri or Kartik Purnima? Slots sell out early. Share your festival dates and we will lock accommodations, darshan assistance and buffer hours for traffic diversions.
                </p>
              </div>

              <p>
                All confirmations arrive via WhatsApp with driver and vehicle details the evening before each leg so you stay informed without chasing the dispatcher.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center bg-gradient-to-br from-cyan-50 to-teal-50 rounded-3xl p-8 md:p-12 border-2 border-cyan-200/50 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Ready to Book Your Varanasi Package?
            </h2>
            <p className="text-gray-700 text-lg mb-6 max-w-2xl mx-auto">
              Get instant confirmation with transparent pricing. No hidden charges, no surprises.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a 
                href="tel:+918062182380"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                📞 Call: 80621 82380
              </a>
              <a 
                href="https://wa.me/919935474730"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                💚 WhatsApp Booking
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
