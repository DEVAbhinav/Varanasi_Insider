import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import Image from 'next/image';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import NavBar from '../components/NavBar/NavBar';
import Footer from '../components/Footer/Footer';
import HeroBookingWidget from '../components/HeroBookingWidget/HeroBookingWidget';
import JsonLd from '../components/JsonLd/JsonLd';
import { SOCIAL_PROFILE_URLS } from '../config/socials';
import ArticleNew from '../components/ArticleNew/ArticleNew';
import { CONTACT } from '@/lib/contact';

export default function BanarasTravelAgencyPage({ contentHtml }) {
  const site = 'https://www.kashitaxi.in';
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'TravelAgency'],
        '@id': `${site}/banaras-travel-agency/#org`,
        name: 'Banaras Travel Agency | Kashi Taxi',
        alternateName: ['Varanasi Travel Agency', 'Banaras Tour Operator', 'Kashi Taxi Tours'],
        url: `${site}/banaras-travel-agency`,
        logo: `${site}https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/logo.jpeg`,
        image: [`${site}https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png`, `${site}https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/tempo-travellar-side-l.jpeg`],
        description:
          'Banaras travel agency for spiritual journeys, airport transfers, tempo traveller hire, and custom pilgrimage packages with local guides and 24/7 support.',
        slogan: 'Your trusted Banaras travel partner',
        telephone: CONTACT.callNumberE164,
        email: 'taxiinvaranasiii@gmail.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Vinayak Travels, Varanasi',
          addressLocality: 'Varanasi',
          addressRegion: 'Uttar Pradesh',
          postalCode: '221010',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 25.287133678944816,
          longitude: 82.94264689837131,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ],
            opens: '00:00',
            closes: '23:59',
          },
        ],
        priceRange: '₹₹',
        currenciesAccepted: 'INR',
        paymentAccepted: ['Cash', 'UPI', 'Digital Payment'],
        areaServed: [
          { '@type': 'City', name: 'Varanasi' },
          { '@type': 'State', name: 'Uttar Pradesh' },
        ],
        sameAs: SOCIAL_PROFILE_URLS,
        serviceType: [
          'Airport Transfer Varanasi',
          'Kashi Darshan Tours',
          'Tempo Traveller Hire Banaras',
          'Outstation Taxi from Varanasi',
        ],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: CONTACT.callNumberE164,
            contactType: 'customer service',
            availableLanguage: ['en', 'hi'],
          },
          {
            '@type': 'ContactPoint',
            telephone: CONTACT.whatsappNumberDisplay,
            contactType: 'WhatsApp',
            availableLanguage: ['en', 'hi'],
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${site}/banaras-travel-agency/#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${site}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Banaras Travel Agency',
            item: `${site}/banaras-travel-agency`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${site}/banaras-travel-agency/#faq`,
        name: 'Banaras Travel Agency FAQs',
        mainEntity: [
          {
            '@type': 'Question',
            name: "What if I'm not religious but interested in Banaras?",
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Absolutely welcome. Many non-religious travelers come for history, culture, photography, and spirituality without religious belief. We customize tours for cultural, heritage, and wellness interests.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you offer Pind Daan (death rituals) and cremation services?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We coordinate with priests and dharamshalas for Pind Daan, Shradh ceremonies, and cremation rites. These are sensitive, personal services handled with utmost respect and cultural understanding.',
            },
          },
          {
            '@type': 'Question',
            name: 'What language support do you provide?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'English, Hindi, Tamil, Telugu, Kannada, Gujarati. Special requests for other languages can be accommodated with advance notice.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I book a full-day city tour without pre-booking my hotel?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. We can suggest accommodations, arrange bookings, or coordinate pickups directly from the airport.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are your prices fixed or negotiable?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Quoted prices are firm and transparent. However, discounts apply for extended stays (5+ days) and group bookings (4+ people).',
            },
          },
          {
            '@type': 'Question',
            name: "What's included in a \"full-day package\"?",
            acceptedAnswer: {
              '@type': 'Answer',
              text: "Transportation, professional guide, entry fees to temples/monuments, breakfast, and driver's gratuity. Meals at restaurants, personal shopping, and optional activities (special ceremonies, extra guides) are separate.",
            },
          },
          {
            '@type': 'Question',
            name: 'Can you arrange trips to nearby cities (Prayagraj, Gaya, Ayodhya)?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, we organize multi-city pilgrimage packages covering Varanasi + Prayagraj + Gaya + Ayodhya circuits.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Best Banaras Travel Agency | Expert Tours & Packages</title>
        <meta
          name="description"
          content="Banaras travel agency for spiritual journeys, airport transfers, tempo traveller rentals, and custom pilgrimage packages. Local guides, vetted hotels, 24/7 support."
        />
        <meta
          name="keywords"
          content="banaras travel agency, varanasi travel agency, kashi taxi, varanasi tours, banaras tour packages, kashi darshan, varanasi airport transfer, tempo traveller varanasi"
        />
        <meta property="og:title" content="Best Banaras Travel Agency | Expert Tours & Packages" />
        <meta
          property="og:description"
          content="Banaras travel agency for spiritual journeys, airport transfers, tempo traveller rentals, and custom pilgrimage packages. Local guides, vetted hotels, 24/7 support."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.kashitaxi.in/banaras-travel-agency" />
        <meta property="og:image" content="https://www.kashitaxi.inhttps://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Best Banaras Travel Agency | Expert Tours & Packages" />
        <meta
          name="twitter:description"
          content="Banaras travel agency for spiritual journeys, airport transfers, tempo traveller rentals, and custom pilgrimage packages. Local guides, vetted hotels, 24/7 support."
        />
        <meta name="twitter:image" content="https://www.kashitaxi.inhttps://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png" />
        <link rel="canonical" href="https://www.kashitaxi.in/banaras-travel-agency" />
      </Head>
      <JsonLd data={structuredData} />

      <NavBar />

      {/* Hero block mirrors home style but tuned to Banaras Travel Agency keyword */}
      <section className="relative flex items-center justify-center text-white overflow-hidden pt-16 pb-8 md:pt-20 md:pb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-400" />
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/40 via-transparent to-teal-500/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-300/20 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-[0.17]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 7% 13%, rgba(255,255,255,0.6) 1px, transparent 1px),\n              radial-gradient(circle at 23% 8%, rgba(255,255,255,0.7) 0.5px, transparent 0.5px),\n              radial-gradient(circle at 41% 21%, rgba(255,255,255,0.5) 1px, transparent 1px),\n              radial-gradient(circle at 58% 15%, rgba(255,255,255,0.8) 0.8px, transparent 0.8px),\n              radial-gradient(circle at 73% 9%, rgba(255,255,255,0.6) 1.2px, transparent 1.2px),\n              radial-gradient(circle at 89% 18%, rgba(255,255,255,0.7) 0.7px, transparent 0.7px)',
              backgroundSize: '400px 400px',
            }}
          />
        </div>
        <div className="absolute inset-0 opacity-[0.25]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 12% 28%, rgba(255,255,255,0.85) 2px, transparent 2px),\n              radial-gradient(circle at 34% 42%, rgba(255,255,255,0.75) 1.5px, transparent 1.5px),\n              radial-gradient(circle at 51% 19%, rgba(255,255,255,0.9) 2px, transparent 2px),\n              radial-gradient(circle at 67% 35%, rgba(255,255,255,0.8) 1.8px, transparent 1.8px),\n              radial-gradient(circle at 82% 23%, rgba(255,255,255,0.85) 2.2px, transparent 2.2px),\n              radial-gradient(circle at 19% 51%, rgba(255,255,255,0.7) 1.6px, transparent 1.6px),\n              radial-gradient(circle at 45% 58%, rgba(255,255,255,0.8) 2px, transparent 2px),\n              radial-gradient(circle at 78% 47%, rgba(255,255,255,0.75) 1.7px, transparent 1.7px),\n              radial-gradient(circle at 26% 63%, rgba(255,255,255,0.8) 1.9px, transparent 1.9px),\n              radial-gradient(circle at 58% 72%, rgba(255,255,255,0.85) 1.8px, transparent 1.8px),\n              radial-gradient(circle at 91% 38%, rgba(255,255,255,0.75) 2px, transparent 2px),\n              radial-gradient(circle at 8% 85%, rgba(255,255,255,0.8) 1.7px, transparent 1.7px),\n              radial-gradient(circle at 43% 11%, rgba(255,255,255,0.85) 1.6px, transparent 1.6px)',
              backgroundSize: '600px 600px',
              backgroundPosition: '50px 80px',
            }}
          />
        </div>
        <div className="absolute inset-0 opacity-[0.33]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 15% 22%, rgba(255,255,255,1) 3px, transparent 3px),\n              radial-gradient(circle at 38% 67%, rgba(255,255,255,0.95) 3.5px, transparent 3.5px),\n              radial-gradient(circle at 62% 31%, rgba(255,255,255,1) 3.2px, transparent 3.2px),\n              radial-gradient(circle at 81% 58%, rgba(255,255,255,0.9) 3px, transparent 3px),\n              radial-gradient(circle at 28% 79%, rgba(255,255,255,0.95) 3.3px, transparent 3.3px),\n              radial-gradient(circle at 71% 88%, rgba(255,255,255,1) 3px, transparent 3px)',
              backgroundSize: '900px 900px',
              backgroundPosition: '120px 150px',
            }}
          />
        </div>
        <div className="absolute inset-0 opacity-[0.37]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 25% 15%, rgba(255,255,255,1) 4px, transparent 4px),\n              radial-gradient(circle at 68% 42%, rgba(255,255,255,0.95) 4.5px, transparent 4.5px),\n              radial-gradient(circle at 43% 78%, rgba(255,255,255,1) 4.2px, transparent 4.2px),\n              radial-gradient(circle at 88% 25%, rgba(255,255,255,0.9) 4px, transparent 4px)',
              backgroundSize: '1200px 1200px',
              backgroundPosition: '200px 250px',
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent animate-pulse" style={{ animationDuration: '4s' }} />

        <div className="container mx-auto px-4 relative z-10 py-2">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-block mb-1.5 px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold border border-white/30">
              BANARAS TRAVEL AGENCY • 24×7 SUPPORT
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-2xl tracking-tight leading-tight">
              Best Banaras Travel Agency | Expert Tours & Packages
            </h1>
            <p className="text-sm md:text-base font-light text-white/95 drop-shadow-lg">
              Kashi darshan tours • Airport transfers • Tempo traveller hire • Custom pilgrimage itineraries
            </p>
          </div>

          <div className="max-w-6xl mx-auto mt-4">
            <HeroBookingWidget />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 -mb-1">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute w-full h-24 md:h-36 opacity-30">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#ecfeff"
              transform="translate(0, 10)"
            />
          </svg>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute w-full h-24 md:h-36 opacity-60">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#ecfeff"
              transform="translate(0, 5)"
            />
          </svg>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative w-full h-24 md:h-36">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#ecfeff"
            />
          </svg>
        </div>
      </section>

      {/* Signature experiences with imagery */}
      <section className="relative py-16 bg-gradient-to-b from-cyan-50 via-white to-teal-50 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 15% 25%, rgba(6,182,212,0.4) 2px, transparent 2px),\n              radial-gradient(circle at 45% 15%, rgba(20,184,166,0.3) 1.5px, transparent 1.5px),\n              radial-gradient(circle at 75% 35%, rgba(6,182,212,0.35) 2.5px, transparent 2.5px),\n              radial-gradient(circle at 25% 65%, rgba(20,184,166,0.4) 2px, transparent 2px),\n              radial-gradient(circle at 85% 75%, rgba(6,182,212,0.3) 1.8px, transparent 1.8px)',
              backgroundSize: '800px 800px',
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Banaras Travel Agency Highlights
            </h2>
            <p className="text-gray-600 text-lg">Curated spiritual, cultural, and family-friendly experiences with local experts.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: 'Kashi Darshan & Ganga Aarti',
                href: '/en/varanasi-sightseeing-complete-guide',
                desc: 'Sunrise ghats, Kashi Vishwanath, Dashashwamedh Ganga Aarti, guided rituals.',
                image: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-kashi-vishwanath-l.jpeg',
              },
              {
                title: 'Airport Transfer to Ghats',
                href: '/en/varanasi-airport-taxi-guide',
                desc: 'Meet-and-greet at VNS, fixed fares, AC sedans/SUVs with local drivers.',
                image: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/airport-taxi-600x400.jpeg',
              },
              {
                title: 'Tempo Traveller for Pilgrims',
                href: '/en/kashi-darshan-tempo-traveller',
                desc: '12–17 seater tempo travellers for family yatras and group pilgrimages.',
                image: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/tempo-travellar-side-l.jpeg',
              },
            ].map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="group bg-white rounded-2xl shadow-lg border border-cyan-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-48">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-xl drop-shadow-lg">{card.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4 text-sm">{card.desc}</p>
                  <span className="text-sm text-cyan-600 group-hover:translate-x-2 transition-transform inline-flex items-center">
                    View details →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Key services as cards */}
      <section className="relative py-16 bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 30%, rgba(6,182,212,0.35) 2px, transparent 2px),\n              radial-gradient(circle at 60% 20%, rgba(20,184,166,0.3) 1.5px, transparent 1.5px),\n              radial-gradient(circle at 80% 50%, rgba(6,182,212,0.4) 2.2px, transparent 2.2px),\n              radial-gradient(circle at 30% 70%, rgba(20,184,166,0.35) 1.8px, transparent 1.8px),\n              radial-gradient(circle at 90% 80%, rgba(6,182,212,0.3) 2px, transparent 2px)',
              backgroundSize: '700px 700px',
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Complete Travel Services in One Place
            </h2>
            <p className="text-gray-600 text-lg">From airport to aarti, every leg is coordinated by our Banaras travel agency experts.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                icon: '✈️',
                title: 'Airport Pickup & Drop',
                desc: 'Fixed fares, meet-and-greet, 24×7 availability from VNS to ghats and hotels.',
                href: '/en/varanasi-airport-taxi-price-guide',
              },
              {
                icon: '🛕',
                title: 'Kashi Darshan Tours',
                desc: 'Guided temple circuits, Ganga Aarti access, and sunrise/sunset boat rides.',
                href: '/en/varanasi-sightseeing-complete-guide',
              },
              {
                icon: '🚐',
                title: 'Tempo Traveller Hire',
                desc: '12–17 seater AC tempo travellers for family yatras and group pilgrimages.',
                href: '/en/tempo-traveller-varanasi',
              },
              {
                icon: '🛣️',
                title: 'Outstation & Circuits',
                desc: 'Prayagraj, Ayodhya, Gaya, Vindhyachal circuits with vetted drivers.',
                href: '/en/outstation-cabs-from-varanasi',
              },
              {
                icon: '🏨',
                title: 'Stay Coordination',
                desc: 'Dharamshala, mid-range, or river-view stays vetted for cleanliness and proximity.',
                href: '/en/varanasi-travel-agent',
              },
              {
                icon: '🕉️',
                title: 'Ritual Assistance',
                desc: 'Pind Daan, Shradh, and special darshan support with local priest network.',
                href: '/en/kashi-gaya-prayag-pind-daan-tour',
              },
              {
                icon: '📸',
                title: 'Photo & Heritage Walks',
                desc: 'Golden-hour ghats, weaving quarters, and heritage lanes with storytellers.',
                href: '/en/tourist-spots-varanasi',
              },
              {
                icon: '📞',
                title: '24/7 Support',
                desc: 'English/Hindi support with backup vehicles and rapid rescheduling.',
                href: '/en/privacy-policy',
              },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="group bg-white rounded-2xl shadow-lg p-6 border border-cyan-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.desc}</p>
                <span className="text-cyan-600 font-semibold text-sm group-hover:translate-x-2 transition-transform inline-block">
                  Learn more →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <ArticleNew
        contentHtml={contentHtml}
        badgeIcon="🕉️"
        badgeText="Complete Banaras Guide"
        title="Your Sacred Journey Starts Here"
        subtitle="Temple circuits, darshan timings, transport options, and insider tips—all curated by locals who've walked every ghat and gali of Kashi."
        tocItems={[
          { label: 'Why Choose Us', anchor: '#why-choose-a-professional-banaras-travel-agency' },
          { label: 'Our Services', anchor: '#our-banaras-travel-agency-services' },
          { label: 'What Makes Us Different', anchor: '#what-makes-our-banaras-travel-agency-different' },
          { label: 'Testimonials', anchor: '#customer-testimonials' },
          { label: 'Planning Guide', anchor: '#planning-your-banaras-journey-heres-what-to-know' },
          { label: 'How to Book', anchor: '#how-to-book-your-banaras-travel-agency-package' },
          { label: 'FAQs', anchor: '#frequently-asked-questions-faq' },
        ]}
      />

      <Footer />
    </>
  );
}

export async function getStaticProps() {
  const markdownPath = path.join(process.cwd(), 'content', 'en', 'banaras-travel-agency.md');
  const fileContents = fs.readFileSync(markdownPath, 'utf8');
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(fileContents);
  const contentHtml = processedContent.toString();

  return {
    props: {
      contentHtml,
    },
  };
}
