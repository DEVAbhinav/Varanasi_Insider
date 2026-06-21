import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../../components/NavBar/NavBar';
import StickyContactBar from '../../components/ServicePage/StickyContactBar';
import Footer from '../../components/Footer/Footer';
import { getSortedPostsData } from '../../lib/posts';
import { listByCategory, getBreadcrumbConfig } from '../../lib/categories';
import { CONTACT, getCallTelHref } from '@/lib/contact';

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
        name: 'Varanasi Packages, Group Tours & Pilgrimage Circuits',
        description: 'Curated Varanasi packages, Delhi-origin pilgrimages, group tours, and sacred circuits with transparent pricing and safety-first operations.',
        url: `${cfg.baseUrl}/en/packages/`,
        isPartOf: { '@id': `${cfg.baseUrl}#website` },
        breadcrumb: { '@id': `${cfg.baseUrl}/en/packages/#breadcrumbs` },
        about: packages.map(p => ({ '@type': 'Thing', name: p.title || p.slug, url: `${cfg.baseUrl}${p.routePath || `/en/${p.slug}`}` })),
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
  const nonPackageLinks = [
    {
      href: '/en/city/ayodhya/taxi/varanasi-to-ayodhya-taxi',
      title: 'Direct Ayodhya taxi booking',
      description: 'Use this when you already know you want a direct sedan or SUV booking, not a bundled pilgrimage package.',
    },
    {
      href: '/en/varanasi-to-ayodhya',
      title: 'Ayodhya route, distance and taxi fare',
      description: 'Use this when the main question is road distance, travel time, one-way fare, tolls, or train-vs-cab planning.',
    },
    {
      href: '/en/city/varanasi/taxi/airport-taxi-service-varanasi',
      title: 'Airport pickup and Babatpur booking',
      description: 'Use this when the traveler is arriving by flight and needs airport pickup rather than a sightseeing or stay package.',
    },
  ];

  const featuredSections = [
    {
      title: 'One-Day & City Darshan',
      description: 'Use these pages when your trip is centered on Varanasi itself: family stays, hotel-inclusive planning, temple plus Aarti flow, and one-day city movement.',
      items: [
        {
          href: '/en/varanasi-tour-package-for-families',
          eyebrow: 'Family owner page',
          title: 'Varanasi Tour Package for Families',
          description: 'The main commercial page for parents, kids and grandparents who need hotel, cab, darshan planning and a calm 2N/3D Kashi flow.',
          stat: '2N/3D best fit',
          cta: 'Open family package',
        },
        {
          href: '/en/kashi-vishwanath-darshan-ganga-aarti-package',
          eyebrow: 'Temple + Aarti owner',
          title: 'Kashi Vishwanath Darshan + Ganga Aarti Package',
          description: 'Use this when the main buying question is temple darshan plus evening Aarti with official-safe planning, pickup, lockers and boat options.',
          stat: 'Same-day or 1N/2D',
          cta: 'View darshan package',
        },
        {
          href: '/en/city/varanasi/sightseeing/varanasi-local-sightseeing-package',
          eyebrow: 'Main city-tour page',
          title: 'Varanasi Local Sightseeing / One-Day Tour',
          description: 'The primary city-tour page for local sightseeing by car. Best for one-day Varanasi itineraries, temple runs, Sarnath, and Ganga Aarti-friendly planning.',
          stat: 'From ₹1,800',
          cta: 'See one-day plans',
        },
        {
          href: '/en/varanasi-tour-package-with-hotel',
          eyebrow: 'Hotel-inclusive owner',
          title: 'Varanasi Tour Package with Hotel',
          description: 'The hotel-first commercial page for travelers choosing between Assi, Cantt, near-ghat and temple-access stays with local cab support.',
          stat: 'Stay + cab planning',
          cta: 'Compare stay options',
        },
      ],
    },
      {
        title: 'Group Tours & Pilgrimage Circuits',
        description: 'Use these pages when you are planning for 6+ pilgrims, mixed-age families, temple committees, or a structured Ayodhya-Prayagraj circuit from one operator.',
        items: [
          {
            href: '/en/varanasi-group-tour-package',
            eyebrow: 'Main group-tour hub',
            title: 'Varanasi Group Tour Packages',
            description: 'The main package page for 6 to 40+ pilgrims, families, temple committees, rooming plans, meals, and realistic Kashi-first itineraries.',
            stat: '6-40+ pilgrims',
            cta: 'Open group hub',
          },
          {
            href: '/en/ayodhya-varanasi-prayagraj-group-tour-package',
            eyebrow: 'Exact 3-city owner',
            title: 'Ayodhya + Varanasi + Prayagraj Group Tour',
            description: 'The exact-match package page for Ram Mandir, Kashi Vishwanath and Sangam group travel with hotel, darshan pacing and vehicle planning.',
            stat: '4N/5D circuit',
            cta: 'See 3-city package',
          },
          {
            href: '/en/city/varanasi/tour-packages/ayodhya-varanasi-3-day-tour',
            eyebrow: '2-city circuit',
            title: 'Ayodhya + Varanasi 3-Day Tour',
            description: 'Use this when your group wants a shorter two-city pilgrimage without expanding to Prayagraj or a longer sacred triangle.',
            stat: '2-city package',
            cta: 'Open 3-day plan',
          },
        ],
      },
      {
        title: 'Family, Senior & Delhi-Origin Planning',
        description: 'These pages work best when elders, larger families, Delhi-origin buyers, or broader multi-city comparison is the main decision point.',
        items: [
          {
            href: '/en/senior-citizen-varanasi-tour-package',
            eyebrow: 'Varanasi-only elder owner',
            title: 'Senior Citizen Varanasi Tour Package',
            description: 'Best when the main question is low-walking Kashi planning, hotel-first comfort, rest windows and easier movement for parents or grandparents.',
            stat: 'Low-walking Kashi',
            cta: 'Open elder package',
          },
          {
            href: '/en/city/varanasi/tour-packages/varanasi-gaya-prayagraj-tour-package-elderly',
            eyebrow: 'Senior-friendly',
            title: 'Fatigue-Free Elderly Pilgrimage Package',
            description: 'Designed for seniors and families needing slower pacing, smoother logistics, and rest-friendly planning across sacred stops.',
            stat: 'Elder-focused',
            cta: 'See elderly package',
          },
          {
            href: '/en/varanasi-tour-package-from-delhi',
            eyebrow: 'Delhi-origin package',
            title: 'Varanasi Tour Package from Delhi',
            description: 'Use this when the buying decision starts in Delhi and you need the right Kashi, Ayodhya or sacred-triangle package before choosing local transport.',
            stat: 'Delhi families & groups',
            cta: 'See Delhi plans',
          },
          {
            href: '/en/tour-package-from-varanasi',
            eyebrow: 'Multi-city comparison',
            title: 'Tour Packages from Varanasi',
            description: 'Use this when you want to compare Ayodhya, Prayagraj, Gaya, Vindhyachal and broader circuits before settling on one group package.',
            stat: 'Circuit overview',
            cta: 'Compare circuits',
          },
        ],
      },
  ];

  const routeOnlyLinks = [
    {
      href: '/en/varanasi-to-ayodhya',
      title: 'Varanasi to Ayodhya route, taxi fare and travel options',
      description: 'Use this when you need road distance, travel time, taxi fare and train-vs-cab planning.',
    },
    {
      href: '/en/varanasi-to-ayodhya-tempo-traveller',
      title: 'Ayodhya tempo traveller fare and seat-size pricing',
      description: 'Use this when your main query is 12/17 seater fare, group travel and all-inclusive Ayodhya pricing.',
    },
    {
      href: '/en/outstation-cabs-from-varanasi',
      title: 'Outstation cab rates from Varanasi',
      description: 'Use this when you want route-only vehicle pricing rather than a bundled pilgrimage package.',
    },
  ];

  const priorityOrder = [
    'varanasi-tour-package-for-families',
    'kashi-vishwanath-darshan-ganga-aarti-package',
    'varanasi-tour-package-with-hotel',
    'senior-citizen-varanasi-tour-package',
    'varanasi-group-tour-package',
    'ayodhya-varanasi-prayagraj-group-tour-package',
    'varanasi-tour-package-from-delhi',
    'varanasi-tour-package',
    'tour-package-from-varanasi',
    'ayodhya-varanasi-3-day-tour',
    'varanasi-gaya-prayagraj-tour-package-elderly',
    'varanasi-2-day-tour',
    'varanasi-3-day-tour',
    'same-day-varanasi-tour',
    'pind-daan-gaya-service-varanasi',
    'varanasi-to-gaya-bodh-gaya-tour-package',
    'kashi-gaya-prayag-pind-daan-tour',
  ];

  const sortedPackages = [...packages].sort((a, b) => {
    const aIndex = priorityOrder.indexOf(a.slug);
    const bIndex = priorityOrder.indexOf(b.slug);
    const safeA = aIndex === -1 ? priorityOrder.length : aIndex;
    const safeB = bIndex === -1 ? priorityOrder.length : bIndex;
    if (safeA !== safeB) return safeA - safeB;
    return (a.title || a.slug).localeCompare(b.title || b.slug);
  });

  return (
    <>
      <Head>
        <title>Varanasi Tour Packages | Family, Group, Delhi & Pilgrimage Packages</title>
        <meta name="description" content={`Compare Varanasi tour packages by actual travel intent: one-day city tours, family stays, Delhi-origin pilgrimages, Ayodhya-Prayagraj circuits, and senior-friendly plans. This page is for packages, not route-only taxi fares. WhatsApp booking on ${CONTACT.callNumberDisplay.replace('+91 ', '')}.`} />
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
              📦 PILGRIMAGE PACKAGES, GROUP TOURS & CIRCUITS
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              Choose the Right Varanasi Tour Package First
            </h1>
            <p className="text-lg md:text-xl text-cyan-50 max-w-2xl mx-auto">
              One-day Kashi tours, family stay packages, 6-40+ group pilgrimages, and Ayodhya-Prayagraj circuits in one package-first hub.
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
          <div className="mb-12 grid gap-4 md:grid-cols-3">
              {[
                { label: 'Main commercial use', value: 'Package-first planning' },
                { label: 'Best starting points', value: 'City tours, group circuits, Delhi-origin plans' },
                { label: 'Wrong page for', value: 'Route-only taxi or tempo fare queries' },
              ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-12 rounded-3xl border border-cyan-200 bg-cyan-50/70 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-cyan-950 mb-3">Not looking for a package?</h2>
            <p className="text-cyan-900/80 mb-5 max-w-3xl">
              Leave this hub when the traveler already knows the transport task. Package pages should own itinerary and stay planning, while direct taxi booking, airport pickup, and route-only fare queries belong on narrower commercial pages.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {nonPackageLinks.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-2xl border border-cyan-200 bg-white p-5 transition hover:border-cyan-300 hover:shadow-md">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {featuredSections.map((section) => (
            <div key={section.title} className="mb-12">
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                  {section.title}
                </h2>
                <p className="text-gray-600 max-w-3xl">
                  {section.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-cyan-100 hover:border-cyan-300 hover:-translate-y-1"
                  >
                    <div className="h-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500"></div>
                    <div className="p-6">
                      <div className="mb-3 inline-flex rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-700">
                        {item.eyebrow}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-5">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-teal-600 font-bold text-sm">{item.stat}</span>
                        <span className="text-sm text-cyan-600 font-semibold group-hover:translate-x-1 transition-transform">
                          {item.cta} →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div className="mb-12 rounded-3xl border border-amber-200 bg-amber-50/80 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-amber-950 mb-3">Need only route fare or vehicle pricing?</h2>
            <p className="text-amber-900/80 mb-5 max-w-3xl">
              This category page is for packages and pilgrimage planning. If your query is route-only taxi fare, tempo traveller pricing, or outstation cab comparison, use one of these intent-specific pages instead.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {routeOnlyLinks.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-2xl border border-amber-200 bg-white p-5 transition hover:border-amber-300 hover:shadow-md">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              All Package Pages
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
              Browse the full package inventory after you identify the right intent: city stay, one-day tour, ritual circuit, or multi-city pilgrimage.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPackages.map((p) => (
                <Link
                  key={p.slug}
                  href={p.routePath || `/en/${p.slug}`}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-cyan-100 hover:border-cyan-300 hover:-translate-y-1"
                >
                  <div className="h-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500"></div>
                  <div className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">📦</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors line-clamp-2 leading-snug">
                      {p.title || p.slug}
                    </h3>
                    {p.description && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                        {p.description}
                      </p>
                    )}
                    <div className="flex items-center text-cyan-600 font-semibold text-sm group-hover:text-teal-600 group-hover:translate-x-1 transition-all">
                      View Package Details →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-cyan-100">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              How to Choose the Right Package
            </h2>
            
            <div className="space-y-5 text-gray-700 leading-relaxed">
              <p>
                Every itinerary begins with a quick call or WhatsApp on{' '}
                <a className="text-cyan-600 hover:text-teal-600 font-semibold underline transition-colors" href={getCallTelHref()}>{CONTACT.callNumberDisplay}</a>
                {' / '}
                <a className="text-cyan-600 hover:text-teal-600 font-semibold underline transition-colors" href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer">{CONTACT.whatsappNumberDisplay}</a>
                . Tell us whether the trip starts in Varanasi or Delhi, whether you need a one-day city tour or a 6-40+ group circuit, and whether the package should stay city-only or expand to Ayodhya and Prayagraj. We will point you to the right page and then refine the itinerary.
              </p>
              
              <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-r-lg">
                <p className="text-sm">
                  <strong className="text-cyan-700">Best fit by intent:</strong> use{' '}
                  <Link className="text-cyan-600 hover:text-teal-600 font-semibold underline" href="/en/city/varanasi/sightseeing/varanasi-local-sightseeing-package">local sightseeing / one-day tour</Link>
                  {' '}for Kashi city coverage,{' '}
                  <Link className="text-cyan-600 hover:text-teal-600 font-semibold underline" href="/en/varanasi-tour-package-from-delhi">Varanasi Tour Package from Delhi</Link>
                  {' '}when the buying decision starts in NCR, and{' '}
                  <Link className="text-cyan-600 hover:text-teal-600 font-semibold underline" href="/en/ayodhya-varanasi-prayagraj-group-tour-package">Ayodhya Varanasi Prayagraj Group Tour Package</Link>
                  {' '}when your group already knows it wants the full sacred triangle.
                </p>
              </div>

              <p>
                Each package page should answer one commercial question cleanly: local city tour, multi-day stay, Delhi-origin package planning, or full group pilgrimage circuit. When route-only taxi fares are the real need, we send users to the fare page instead of forcing them through a generic package page.
              </p>

              <p>
                Families often request private boats for Dashashwamedh Aarti, driver-hotel coordination, and elder-friendly pacing. Those details belong inside the package pages so a traveler can compare plans without bouncing across multiple route and taxi pages.
              </p>

              <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg">
                <p className="text-sm">
                  <strong className="text-teal-700">Festival note:</strong> Dev Deepawali, Mahashivratri, Kartik Purnima, Ram Navami and long weekends need stronger buffers for darshan slots, traffic diversions and hotel choice. Package pages should surface those details early.
                </p>
              </div>

              <p>
                All confirmations arrive via WhatsApp with driver and vehicle details the evening before each leg so travelers do not need to chase multiple vendors for the same itinerary.
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
                href={getCallTelHref()}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                {`📞 Call: ${CONTACT.callNumberDisplay.replace('+91 ', '')}`}
              </a>
              <a 
                href={CONTACT.whatsappUrl}
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
      <StickyContactBar phone={CONTACT.callNumberRaw} />
    </>
  );
}
