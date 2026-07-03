import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import Image from 'next/image';
import { markdownToHtml } from '../lib/markdown';
import LandingPageLayout from '../components/layouts/LandingPageLayout';
import HeroBookingWidget from '../components/HeroBookingWidget/HeroBookingWidget';
import JsonLd from '../components/JsonLd/JsonLd';
import { SOCIAL_PROFILE_URLS } from '../config/socials';
import ArticleNew from '../components/ArticleNew/ArticleNew';
import { CONTACT } from '@/lib/contact';

export default function BanarasTourPackagePage({ contentHtml }) {
  const site = 'https://www.kashitaxi.in';
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'TravelAgency'],
        '@id': `${site}/banaras-tour-package/#org`,
        name: 'Banaras Tour Package | Kashi Taxi',
        alternateName: ['Varanasi Tour Package', 'Kashi Tour Package', 'Banaras Pilgrimage Package'],
        url: `${site}/banaras-tour-package`,
        logo: `https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/logo.jpeg`,
        image: [`https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png`, `https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/tempo-travellar-side-l.jpeg`],
        description:
          'Banaras tour packages with expert guides. 3-7 day spiritual journeys, transparent pricing, ghatside stays, airport transfers, and 24/7 support.',
        slogan: 'Authentic Banaras tours with local experts',
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
          'Banaras Tour Packages',
          'Ganga Aarti Guided Visits',
          'Tempo Traveller Hire',
          'Prayagraj and Gaya Circuits',
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
        '@id': `${site}/banaras-tour-package/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
          { '@type': 'ListItem', position: 2, name: 'Banaras Tour Package', item: `${site}/banaras-tour-package` },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${site}/banaras-tour-package/#faq`,
        name: 'Banaras Tour Package FAQs',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is a Banaras tour package worth the cost?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "Yes. You'll save on hotel negotiation, avoid tourist traps, optimize your time, and get authentic experiences worth more than the package cost.",
            },
          },
          {
            '@type': 'Question',
            name: 'Can we customize a Banaras tour package?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. We build packages around your interests--spiritual, cultural, photographic, or wellness-focused.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are Banaras tour packages safe for solo female travelers?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. We assign female guides on request, recommend female-friendly hotels, discourage late solo wandering, and provide 24/7 support.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can we add Gaya or Allahabad to a Banaras tour package?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Multi-city options include Banaras + Prayagraj, Banaras + Gaya, or Banaras + Prayagraj + Gaya.',
            },
          },
          {
            '@type': 'Question',
            name: 'How many days is ideal for a Banaras tour package?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '3 days minimum, 5 days ideal, 7+ days for deep transformation.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do Banaras tour packages include meals?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Breakfast is included daily; lunch and dinner are separate. Special meal arrangements are available.',
            },
          },
          {
            '@type': 'Question',
            name: "What's the best time to visit Banaras?",
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'October-March is ideal; April-June is hot; July-September is monsoon. Book early for Dev Deepawali and Maha Shivaratri.',
            },
          },
        ],
      },
    ],
  };

  const seoHead = (
    <>
      <Head>
        <title>Banaras Tour Package 2026 | Budget to Premium Packages | Kashi Taxi</title>
        <meta
          name="description"
          content="Best Banaras tour packages with expert guides. 3-7 day spiritual journeys with transparent pricing, accommodation near ghats, and 24/7 support."
        />
        <meta
          name="keywords"
          content="banaras tour package, varanasi tour package, kashi tour package, banaras pilgrimage, banaras travel agency"
        />
        <meta property="og:title" content="Banaras Tour Package 2026 | Budget to Premium Packages | Kashi Taxi" />
        <meta
          property="og:description"
          content="Best Banaras tour packages with expert guides. 3-7 day spiritual journeys with transparent pricing, accommodation near ghats, and 24/7 support."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.kashitaxi.in/banaras-tour-package" />
        <meta property="og:image" content="https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Banaras Tour Package 2026 | Budget to Premium Packages | Kashi Taxi" />
        <meta
          name="twitter:description"
          content="Best Banaras tour packages with expert guides. 3-7 day spiritual journeys with transparent pricing, accommodation near ghats, and 24/7 support."
        />
        <meta name="twitter:image" content="https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png" />
        <link rel="canonical" href="https://www.kashitaxi.in/banaras-tour-package" />
      </Head>
      <JsonLd data={structuredData} />
    </>
  );

  return (
    <LandingPageLayout head={seoHead}>

      <section className="relative flex items-center justify-center text-white overflow-hidden pt-16 pb-8 md:pt-20 md:pb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-blue-500 to-teal-500" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/40 via-transparent to-teal-500/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-200/25 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10 py-2">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-block mb-1.5 px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold border border-white/30">
              BANARAS TOUR PACKAGE • AUTHENTIC PILGRIMAGE
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-2xl tracking-tight leading-tight">
              Banaras Tour Package | Book Authentic Banaras Pilgrimage Packages Online
            </h1>
            <p className="text-sm md:text-base font-light text-white/95 drop-shadow-lg">
              Guided Banaras itineraries, ghatside stays, Ganga Aarti access, and multi-day spiritual circuits with trusted local experts.
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
              fill="#e0f2fe"
              transform="translate(0, 10)"
            />
          </svg>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute w-full h-24 md:h-36 opacity-70">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#e0f2fe"
              transform="translate(0, 5)"
            />
          </svg>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative w-full h-24 md:h-36">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#e0f2fe"
            />
          </svg>
        </div>
      </section>

      <section className="relative py-16 bg-gradient-to-b from-cyan-50 via-white to-blue-50 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Banaras Tour Highlights
            </h2>
            <p className="text-gray-600 text-lg">Authentic Banaras immersion: Aarti access, temple circuits, and seasoned local guides.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: 'Ganga Aarti Dawn',
                href: '/en/varanasi-sightseeing-complete-guide',
                desc: '5:30 AM Dashashwamedh Ghat Aarti with guided rituals and timing.',
                image: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-kashi-vishwanath-l.jpeg',
              },
              {
                title: 'Sarnath Extension',
                href: '/en/sarnath-attractions-guide',
                desc: 'Buddhist circuit add-on for classic and 5-day packages.',
                image: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/airport-taxi-600x400.jpeg',
              },
              {
                title: 'Tempo Traveller Groups',
                href: '/en/kashi-darshan-tempo-traveller',
                desc: 'Comfortable 12-17 seater options for family pilgrimages.',
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

      <section className="relative py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Everything You Need for Banaras
            </h2>
            <p className="text-gray-600 text-lg">From ghatside stays to multi-city circuits, all coordinated end to end.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              { icon: '🛕', title: 'Temple Circuits', desc: 'Timed darshan, priest coordination, respectful guidance.', href: '/en/varanasi-sightseeing-complete-guide' },
              { icon: '🚐', title: 'Tempo Travellers', desc: '12-17 seater AC vehicles for groups and families.', href: '/en/kashi-darshan-tempo-traveller' },
              { icon: '✈️', title: 'Airport Transfers', desc: 'Fixed-price pickups to ghats and hotels.', href: '/en/varanasi-airport-taxi-price-guide' },
              { icon: '🛣️', title: 'Prayagraj/Gaya Add-ons', desc: 'Pind Daan and Sangam circuits with vetted drivers.', href: '/en/kashi-gaya-prayag-pind-daan-tour' },
              { icon: '🏨', title: 'Ghatside Stays', desc: 'Mid-range, clean, close-to-ceremony hotels.', href: '/en/varanasi-travel-agent' },
              { icon: '📿', title: 'Festival Packages', desc: 'Dev Deepawali, Maha Shivaratri, Magh Mela specials.', href: '/en/kashi-gaya-prayag-pind-daan-tour' },
              { icon: '📸', title: 'Heritage & Food', desc: 'Lanes, weaving quarters, and street food walks.', href: '/en/tourist-spots-varanasi' },
              { icon: '📞', title: '24/7 Support', desc: 'WhatsApp-first help, backup vehicles, on-trip changes.', href: '/en/privacy-policy' },
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
        badgeIcon="🌊"
        badgeText="Banaras Tour Package"
        title="Banaras Tour Package Guide"
        subtitle="Authentic Banaras pilgrimage plans with ghatside stays, Ganga Aarti timing, and transparent pricing."
        tocItems={[
          { label: 'Why Banaras', anchor: '#experience-the-magic-of-banaras---one-package-at-a-time' },
          { label: 'Difference', anchor: '#the-banaras-tour-package-difference' },
          { label: 'Packages', anchor: '#our-banaras-tour-package-options' },
          { label: 'Pricing', anchor: '#banaras-tour-package-pricing-breakdown-april-2026' },
          { label: 'What\'s Inside', anchor: '#whats-inside-every-banaras-tour-package' },
          { label: 'Stories', anchor: '#real-banaras-tour-package-stories' },
          { label: 'FAQs', anchor: '#faq---banaras-tour-package-questions' },
          { label: 'How to Book', anchor: '#how-to-book-your-banaras-tour-package' },
          { label: 'Book Now', anchor: '#book-your-banaras-tour-package-now' },
        ]}
      />

    </LandingPageLayout>
  );
}

export async function getStaticProps() {
  const markdownPath = path.join(process.cwd(), 'content', 'en', 'banaras-tour-package.md');
  const fileContents = fs.readFileSync(markdownPath, 'utf8');
  const contentHtml = await markdownToHtml(fileContents);

  return { props: { contentHtml } };
}
