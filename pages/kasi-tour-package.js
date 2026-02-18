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

export default function KasiTourPackagePage({ contentHtml }) {
  const site = 'https://www.kashitaxi.in';
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'TravelAgency'],
        '@id': `${site}/kasi-tour-package/#org`,
        name: 'Kasi Tour Package | Kashi Taxi',
        alternateName: ['Kashi Tour Package', 'Varanasi Tour Package', 'Banaras Tour Package'],
        url: `${site}/kasi-tour-package`,
        logo: `${site}https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/logo.jpeg`,
        image: [`${site}https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png`, `${site}https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/tempo-travellar-side-l.jpeg`],
        description:
          'Kasi tour package specialist: Kashi darshan, airport transfers, tempo traveller hire, multi-city spiritual circuits with local guides and 24/7 support.',
        slogan: 'Authentic Kasi darshan with trusted local guides',
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
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
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
          'Kasi Darshan Tours',
          'Airport Transfer Varanasi',
          'Tempo Traveller Hire',
          'Prayagraj and Gaya Pilgrimage Circuits',
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
            telephone: CONTACT.callNumberDisplay,
            contactType: 'WhatsApp',
            availableLanguage: ['en', 'hi'],
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${site}/kasi-tour-package/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
          { '@type': 'ListItem', position: 2, name: 'Kasi Tour Package', item: `${site}/kasi-tour-package` },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${site}/kasi-tour-package/#faq`,
        name: 'Kasi Tour Package FAQs',
        mainEntity: [
          {
            '@type': 'Question',
            name: "What's the difference between 'Kasi' and 'Kashi' spelling?",
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Kasi (कसी) is the Hindi transliteration, Kashi (काशी) is the Sanskrit/English spelling. Both refer to the same ancient city. We accommodate all spelling variants--search for whichever you prefer!',
            },
          },
          {
            '@type': 'Question',
            name: 'Is Kasi safe for female solo travelers?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, with proper precautions. We assign female guides when requested, provide female-friendly accommodations, and discourage nighttime solo wandering.',
            },
          },
          {
            '@type': 'Question',
            name: "Do Kasi tour packages work if I'm not religious?",
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Absolutely. Many non-religious travelers come for history, culture, philosophy, and the unique spiritual energy. You experience Kasi as a seeker, not a believer.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can we customize a Kasi tour package for our group?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. We build packages around your interests: photography-focused, spiritual-focused, cultural-focused, budget-focused.',
            },
          },
          {
            '@type': 'Question',
            name: 'What if I want to add Prayagraj or Gaya to my Kasi tour?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Our multi-city packages (Kasi + Prayagraj, Kasi + Gaya, Kasi + Prayagraj + Gaya) are designed exactly for this.',
            },
          },
          {
            '@type': 'Question',
            name: 'How many days is ideal for a Kasi tour package?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '3 days (minimum, covers main temples), 5 days (ideal with spiritual practices), 7+ days (deep transformation).',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Kasi Tour Package 2025 | Kashi Darshan Spiritual Tours | Kashi Taxi</title>
        <meta
          name="description"
          content="Book authentic Kasi tour packages with expert guides. Spiritual journeys to Kashi (Varanasi) with transparent pricing, airport transfers, and 24/7 support."
        />
        <meta
          name="keywords"
          content="kasi tour package, kashi tour package, varanasi tour package, kashi darshan, banaras pilgrimage, kashi taxi"
        />
        <meta property="og:title" content="Kasi Tour Package 2025 | Kashi Darshan Spiritual Tours | Kashi Taxi" />
        <meta
          property="og:description"
          content="Book authentic Kasi tour packages with expert guides. Spiritual journeys to Kashi (Varanasi) with transparent pricing, airport transfers, and 24/7 support."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.kashitaxi.in/kasi-tour-package" />
        <meta property="og:image" content="https://www.kashitaxi.inhttps://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kasi Tour Package 2025 | Kashi Darshan Spiritual Tours | Kashi Taxi" />
        <meta
          name="twitter:description"
          content="Book authentic Kasi tour packages with expert guides. Spiritual journeys to Kashi (Varanasi) with transparent pricing, airport transfers, and 24/7 support."
        />
        <meta name="twitter:image" content="https://www.kashitaxi.inhttps://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png" />
        <link rel="canonical" href="https://www.kashitaxi.in/kasi-tour-package" />
      </Head>
      <JsonLd data={structuredData} />

      <NavBar />

      <section className="relative flex items-center justify-center text-white overflow-hidden pt-16 pb-8 md:pt-20 md:pb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-400 to-rose-400" />
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/40 via-transparent to-amber-500/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-300/25 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10 py-2">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-block mb-1.5 px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold border border-white/30">
              KASI TOUR PACKAGE • KASHI DARSAN SPECIALIST
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-2xl tracking-tight leading-tight">
              Kasi Tour Package | Book Authentic Kashi Darshan Packages Online
            </h1>
            <p className="text-sm md:text-base font-light text-white/95 drop-shadow-lg">
              Spiritual circuits, airport transfers, tempo traveller hire, and multi-city pilgrimage support with trusted local guides.
            </p>
          </div>

          <div className="max-w-6xl mx-auto mt-4">
            <HeroBookingWidget />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 -mb-1">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute w-full h-24 md:h-36 opacity-40">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#fff7ed"
              transform="translate(0, 10)"
            />
          </svg>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute w-full h-24 md:h-36 opacity-70">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#fff7ed"
              transform="translate(0, 5)"
            />
          </svg>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative w-full h-24 md:h-36">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#fff7ed"
            />
          </svg>
        </div>
      </section>

      <section className="relative py-16 bg-gradient-to-b from-amber-50 via-white to-orange-50 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Kasi Tour Highlights
            </h2>
            <p className="text-gray-600 text-lg">Pilgrim-focused experiences with ritual timing, priest access, and trusted local logistics.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[ 
              {
                title: 'Kashi Vishwanath & Aarti',
                href: '/en/varanasi-sightseeing-complete-guide',
                desc: 'Dawn darshan, Dashashwamedh Ghat Ganga Aarti, guided rituals.',
                image: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-kashi-vishwanath-l.jpeg',
              },
              {
                title: 'Airport to Ghats',
                href: '/en/varanasi-airport-taxi-guide',
                desc: 'Meet-and-greet at VNS, fixed fares, AC sedans/SUVs.',
                image: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/airport-taxi-600x400.jpeg',
              },
              {
                title: 'Tempo Traveller Pilgrimage',
                href: '/en/kashi-darshan-tempo-traveller',
                desc: '12-17 seater tempo travellers for family yatras and group pilgrimages.',
                image: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/tempo-travellar-side-l.jpeg',
              },
            ].map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="group bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
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
                  <span className="text-sm text-amber-600 group-hover:translate-x-2 transition-transform inline-flex items-center">
                    View details →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Complete Services for Your Kasi Yatra
            </h2>
            <p className="text-gray-600 text-lg">Logistics, guides, and support tuned to sacred timing.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[ 
              { icon: '🛕', title: 'Kasi Darshan', desc: 'Timed temple circuits with priest coordination.', href: '/en/varanasi-sightseeing-complete-guide' },
              { icon: '🚐', title: 'Tempo Traveller', desc: '12-17 seater AC tempo travellers for yatras.', href: '/en/kashi-darshan-tempo-traveller' },
              { icon: '✈️', title: 'Airport Transfer', desc: 'Fixed-price pickups to ghats and hotels.', href: '/en/varanasi-airport-taxi-price-guide' },
              { icon: '🛣️', title: 'Prayagraj/Gaya Circuits', desc: 'Multi-city routes for Pind Daan and sangam.', href: '/en/kashi-gaya-prayag-pind-daan-tour' },
              { icon: '🏨', title: 'Stay Near Ghats', desc: 'Mid-range ghatside stays vetted for cleanliness.', href: '/en/varanasi-travel-agent' },
              { icon: '🕉️', title: 'Ritual Support', desc: 'Pind Daan, Shradh, special puja coordination.', href: '/en/kashi-gaya-prayag-pind-daan-tour' },
              { icon: '📸', title: 'Heritage Walks', desc: 'Ghats, lanes, weaving quarters with storytellers.', href: '/en/tourist-spots-varanasi' },
              { icon: '📞', title: '24/7 Assistance', desc: 'WhatsApp-first support with backup vehicles.', href: '/en/privacy-policy' },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="group bg-white rounded-2xl shadow-lg p-6 border border-amber-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.desc}</p>
                <span className="text-amber-600 font-semibold text-sm group-hover:translate-x-2 transition-transform inline-block">
                  Learn more →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <ArticleNew
        contentHtml={contentHtml}
        badgeIcon="🛕"
        badgeText="Kasi Tour Package"
        title="Kasi Tour Package Guide"
        subtitle="Spiritual journeys, authentic rituals, and transparent pricing tailored to every seeker."
        tocItems={[
          { label: 'Kasi Journey', anchor: '#your-sacred-journey-to-kasi---ancient-city-of-light' },
          { label: 'What Makes It Different', anchor: '#what-makes-a-true-kasi-tour-package-different' },
          { label: 'Packages', anchor: '#our-kasi-tour-packages---spiritual-journeys-customized-for-you' },
          { label: 'Solo vs Package', anchor: '#why-book-a-kasi-tour-package-instead-of-solo-travel' },
          { label: 'Inside the Package', anchor: '#whats-inside-every-kasi-tour-package' },
          { label: 'Pricing', anchor: '#kasi-tour-package-pricing---november-2025' },
          { label: 'FAQs', anchor: '#faq---kasi-tour-package-questions' },
          { label: 'How to Book', anchor: '#how-to-book-your-kasi-tour-package' },
          { label: 'Book Today', anchor: '#book-your-kasi-tour-package-today' },
        ]}
      />

      <Footer />
    </>
  );
}

export async function getStaticProps() {
  const markdownPath = path.join(process.cwd(), 'content', 'en', 'kasi-tour-package.md');
  const fileContents = fs.readFileSync(markdownPath, 'utf8');
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(fileContents);
  const contentHtml = processedContent.toString();

  return { props: { contentHtml } };
}
