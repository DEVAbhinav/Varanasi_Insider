import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import NavBar from '../components/NavBar/NavBar';
import Footer from '../components/Footer/Footer';
import GoogleReviews from '../components/GoogleReviews/GoogleReviews';
import JsonLd from '../components/JsonLd/JsonLd';
import getHomeSchema from '../components/JsonLd/homepageSchema';
import HeroBookingWidget from '../components/HeroBookingWidget/HeroBookingWidget';
import { getAllPostsMeta } from '../lib/posts';

// Lightweight skeleton for section placeholders
function SectionSkeleton({ title = 'Loading…' }) {
  return (
    <div className="mx-auto my-8 w-full max-w-5xl animate-pulse rounded-2xl border border-gray-200 bg-white/50 p-6">
      <div className="h-6 w-40 rounded bg-gray-200" aria-hidden />
      <div className="mt-4 h-4 w-full rounded bg-gray-100" aria-hidden />
      <div className="mt-2 h-4 w-5/6 rounded bg-gray-100" aria-hidden />
      <span className="sr-only">{title}</span>
    </div>
  );
}

// Dynamic imports for below-the-fold sections
const BikeRentalsSection = dynamic(() => import('../components/BikeRentalsSection/BikeRentalsSection'), {
  loading: () => <SectionSkeleton title="Bike Rentals" />,
  ssr: false,
});

const CTASectionHome = dynamic(() => import('../components/CTASectionHome/CTASectionHome'), {
  loading: () => <SectionSkeleton title="Book Now" />,
  ssr: false,
});

const TaxiRatesCheatSheet = dynamic(() => import('../components/TaxiRatesCheatSheet/TaxiRatesCheatSheet'), {
  loading: () => <SectionSkeleton title="Taxi Rates" />,
  ssr: false,
});

export default function HomePage({ allPosts }) {
  const SITE = 'https://www.kashitaxi.in';
  const structuredData = getHomeSchema(SITE);
  const driverStripRef = useRef(null);
  const cardRefs = useRef([]);
  const [cardIndex, setCardIndex] = useState(0);
  const scrollToCard = (target) => {
    const el = cardRefs.current[target];
    if (el?.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setCardIndex(target);
    }
  };
  const driverSpotlight = [
    {
      name: 'Family arrives relaxed',
      years: 'Airport to hotel in 30 min',
      route: 'No haggling, no confusion – your driver waits at arrivals with your name',
      img: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/Tempo%20Traveller%20group.jpg',
    },
    {
      name: 'First impression of Kashi',
      years: '22 yrs trusted service',
      route: 'A friendly face at arrivals – your Varanasi adventure begins right here',
      img: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/Tempo%20Traveller%20Mishra%20ji%20with%20germal%20tourist.jpg',
    },
    {
      name: 'Navigate like a local',
      years: '15 yrs guiding pilgrims',
      route: 'Skip the confusion – we know every gali, ghat & shortcut',
      img: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/Rajan%20Ji%20Citiline%20w%20Customer.jpg',
    },
    {
      name: 'Safe travels for her',
      years: 'Women-first fleet',
      route: 'Mom, daughter, solo traveller – travel with complete peace of mind',
      img: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/lady-taxi.jpeg',
    },
    {
      name: 'Solo traveller? Sorted.',
      years: '500+ solo women trust us',
      route: 'Live location sharing, verified drivers, 24×7 helpline – we’ve got your back, always',
      img: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/solo-femal-traveller-varanasi.jpeg',
    },
    {
      name: 'The whole gang together',
      years: '12 yrs group adventures',
      route: 'Friends, family, everyone – travel together, laugh together',
      img: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/Tempo_travellar_Side_Packglass_landscape_zoomed.jpeg',
    },
    {
      name: 'AC comfort, clean seats',
      years: 'Premium Innova & Urbania',
      route: 'Rest between ghats – AC on full, water bottles stocked, WiFi ready',
      img: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/Urbania-front-Square.jpeg',
    },
    {
      name: '4.9★ on Google Reviews',
      years: '2000+ happy guests',
      route: '“Driver knew secret ghat parking” – hear it from our guests',
      img: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/Tempo%20traveller%20Happy%20Customer.jpg',
    }
  ];

  return (
    <>
      <Head>
        <title>Taxi in Varanasi | Varanasi Taxi Service – 24×7 Cabs</title>
        <meta
          name="description"
          content="Taxi in Varanasi from ₹800. Local drivers, airport pickup, outstation cabs to Prayagraj & Ayodhya. 24×7 booking. Safe family travel ✓ 4.9★ rated."
        />
        <meta name="keywords" content="taxi in varanasi, varanasi taxi service, varanasi taxi, cab in varanasi, varanasi cab service, taxi service in varanasi, varanasi taxi booking, varanasi airport taxi, tempo traveller varanasi, varanasi local taxi, outstation taxi varanasi, varanasi to ayodhya taxi, varanasi to prayagraj cab" />
        <meta name="author" content="Varanasi Taxi" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.kashitaxi.in/" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Taxi in Varanasi | Safe & Caring Varanasi Taxi Service" />
        <meta property="og:description" content="Varanasi taxi service with drivers who know secret parking at Dashashwamedh. Safe family travel, 24×7 support. Book your worry-free Kashi ride!" />
        <meta property="og:image" content="https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png" />
        <meta property="og:url" content="https://www.kashitaxi.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Varanasi Taxi & Tempo Traveller" />
        <meta property="og:locale" content="en_IN" />

        {/* Geo Location Meta Tags for Local SEO */}
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Varanasi" />
        <meta name="geo.position" content="25.287133678944816;82.94264689837131" />
        <meta name="ICBM" content="25.287133678944816, 82.94264689837131" />
      </Head>
      <JsonLd data={structuredData} />

      <NavBar />

      {/* Hero Section - Luxurious Rich Gradient with Texture - Compact for Above Fold */}
      <section className="relative flex items-center justify-center text-white overflow-hidden pt-16 pb-8 md:pt-20 md:pb-12">
        {/* Base Gradient Layer 1 - Deep Rich Blue to Cyan */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-400"></div>

        {/* Gradient Layer 2 - Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/40 via-transparent to-teal-500/50"></div>

        {/* Gradient Layer 3 - Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-300/20 via-transparent to-transparent"></div>

        {/* Organic Artistic Dot Pattern - Breaking the Grid - Enhanced 5% */}

        {/* Base Texture Layer - Irregular scattered tiny dots */}
        <div className="absolute inset-0 opacity-[0.17]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 7% 13%, rgba(255,255,255,0.6) 1px, transparent 1px),
              radial-gradient(circle at 23% 8%, rgba(255,255,255,0.7) 0.5px, transparent 0.5px),
              radial-gradient(circle at 41% 21%, rgba(255,255,255,0.5) 1px, transparent 1px),
              radial-gradient(circle at 58% 15%, rgba(255,255,255,0.8) 0.8px, transparent 0.8px),
              radial-gradient(circle at 73% 9%, rgba(255,255,255,0.6) 1.2px, transparent 1.2px),
              radial-gradient(circle at 89% 18%, rgba(255,255,255,0.7) 0.7px, transparent 0.7px)
            `,
            backgroundSize: '400px 400px',
          }}></div>
        </div>

        {/* Medium Organic Scatter Pattern - Increased Count */}
        <div className="absolute inset-0 opacity-[0.25]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 12% 28%, rgba(255,255,255,0.85) 2px, transparent 2px),
              radial-gradient(circle at 34% 42%, rgba(255,255,255,0.75) 1.5px, transparent 1.5px),
              radial-gradient(circle at 51% 19%, rgba(255,255,255,0.9) 2px, transparent 2px),
              radial-gradient(circle at 67% 35%, rgba(255,255,255,0.8) 1.8px, transparent 1.8px),
              radial-gradient(circle at 82% 23%, rgba(255,255,255,0.85) 2.2px, transparent 2.2px),
              radial-gradient(circle at 19% 51%, rgba(255,255,255,0.7) 1.6px, transparent 1.6px),
              radial-gradient(circle at 45% 58%, rgba(255,255,255,0.8) 2px, transparent 2px),
              radial-gradient(circle at 78% 47%, rgba(255,255,255,0.75) 1.7px, transparent 1.7px),
              radial-gradient(circle at 26% 63%, rgba(255,255,255,0.8) 1.9px, transparent 1.9px),
              radial-gradient(circle at 58% 72%, rgba(255,255,255,0.85) 1.8px, transparent 1.8px),
              radial-gradient(circle at 91% 38%, rgba(255,255,255,0.75) 2px, transparent 2px),
              radial-gradient(circle at 8% 85%, rgba(255,255,255,0.8) 1.7px, transparent 1.7px),
              radial-gradient(circle at 43% 11%, rgba(255,255,255,0.85) 1.6px, transparent 1.6px)
            `,
            backgroundSize: '600px 600px',
            backgroundPosition: '50px 80px'
          }}></div>
        </div>

        {/* Large Artistic Accent Dots - Constellation Style */}
        <div className="absolute inset-0 opacity-[0.33]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 15% 22%, rgba(255,255,255,1) 3px, transparent 3px),
              radial-gradient(circle at 38% 67%, rgba(255,255,255,0.95) 3.5px, transparent 3.5px),
              radial-gradient(circle at 62% 31%, rgba(255,255,255,1) 3.2px, transparent 3.2px),
              radial-gradient(circle at 81% 58%, rgba(255,255,255,0.9) 3px, transparent 3px),
              radial-gradient(circle at 28% 79%, rgba(255,255,255,0.95) 3.3px, transparent 3.3px),
              radial-gradient(circle at 71% 88%, rgba(255,255,255,1) 3px, transparent 3px)
            `,
            backgroundSize: '900px 900px',
            backgroundPosition: '120px 150px'
          }}></div>
        </div>

        {/* Extra Large Focal Dots - Sparse Artistic Placement */}
        <div className="absolute inset-0 opacity-[0.37]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 15%, rgba(255,255,255,1) 4px, transparent 4px),
              radial-gradient(circle at 68% 42%, rgba(255,255,255,0.95) 4.5px, transparent 4.5px),
              radial-gradient(circle at 43% 78%, rgba(255,255,255,1) 4.2px, transparent 4.2px),
              radial-gradient(circle at 88% 25%, rgba(255,255,255,0.9) 4px, transparent 4px)
            `,
            backgroundSize: '1200px 1200px',
            backgroundPosition: '200px 250px'
          }}></div>
        </div>

        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent animate-pulse" style={{ animationDuration: '4s' }}></div>

        <div className="container mx-auto px-4 relative z-10 py-2">
          <div className="max-w-6xl mx-auto">
            {/* Main Title */}
            <div className="text-center mb-3">
              <div className="inline-block mb-1.5 px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold border border-white/30">
                #1 VARANASI TAXI SERVICE – 24×7 CAB BOOKING
              </div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-2xl tracking-tight leading-tight">
                Taxi in Varanasi – Your Kashi Journey, Worry-Free
              </h1>
              <p className="text-xs md:text-sm font-medium text-white/90 mb-1">
                Varanasi taxi service for airport pickup, local sightseeing & outstation cabs
              </p>
              <p className="text-sm md:text-base font-light text-white/80 drop-shadow-lg">
                You handle the prayers. We handle the traffic.
              </p>
            </div>

            {/* Functional Booking Widget */}
            <HeroBookingWidget />
          </div>
        </div>

        {/* Wave Separator - Multi-layered for Depth */}
        <div className="absolute bottom-0 left-0 right-0 -mb-1">
          {/* Wave Layer 1 - Back (slightly transparent) */}
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute w-full h-24 md:h-36 opacity-30">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ecfeff" transform="translate(0, 10)"></path>
          </svg>

          {/* Wave Layer 2 - Middle */}
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute w-full h-24 md:h-36 opacity-60">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ecfeff" transform="translate(0, 5)"></path>
          </svg>

          {/* Wave Layer 3 - Front (solid) */}
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative w-full h-24 md:h-36">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ecfeff"></path>
          </svg>
        </div>
      </section>

      {/* Driver Spotlight - ultra-compact horizontal strip */}
      <section className="bg-gradient-to-r from-cyan-50/70 via-white to-teal-50/70 border-y border-cyan-100/70 py-3 md:py-6 mt-4 md:mt-6">
        <div className="container mx-auto px-4 max-w-6xl overflow-visible">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-cyan-100 text-cyan-700 text-xs font-semibold grid place-items-center">✨</span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-700">22 years in Varanasi • 2000+ trips</p>
                <h2 className="text-base font-semibold text-gray-900 leading-snug">Local drivers who know every ghat, gali & shortcut</h2>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <a href="tel:+918062182380" className="inline-flex items-center gap-1 text-cyan-700 font-semibold">Talk to us</a>
            </div>
          </div>
          <div
            className="flex gap-4 overflow-x-auto overflow-y-visible pb-2 md:pb-6 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden justify-start md:justify-center scroll-smooth"
            aria-label="Driver partners carousel"
            ref={driverStripRef}
          >
            {driverSpotlight.map((driver, idx) => (
              <div
                key={driver.name}
                className="group relative snap-start shrink-0 w-44 rounded-2xl border border-cyan-100 bg-white shadow-md p-4 flex flex-col items-center origin-center transition-transform duration-200 ease-out hover:scale-[1.25] hover:shadow-2xl hover:z-30"
                ref={(el) => {
                  if (el) cardRefs.current[idx] = el;
                }}
              >
                <div className="relative h-36 w-36 overflow-hidden rounded-full border border-cyan-100 bg-cyan-50/60">
                  <Image
                    src={driver.img.replace('/upload/', '/upload/w_144,h_144,c_fill,q_auto,f_auto/')}
                    alt={`${driver.name} - KashiTaxi driver`}
                    width={144}
                    height={144}
                    quality={100}
                    unoptimized
                    className="h-full w-full object-cover object-center"
                    priority={idx < 2}
                  />
                </div>
                <p className="mt-2 text-[12px] font-semibold text-gray-900 text-center leading-tight">{driver.name}</p>
                <p className="text-[11px] text-gray-600 text-center leading-snug">{driver.route}</p>
                <p className="text-[11px] font-semibold text-cyan-700 mt-1">{driver.years}</p>
              </div>
            ))}
          </div>

          <div className="mt-1.5 md:mt-3 flex items-center justify-center gap-3 text-[12px] text-gray-600">
            <button
              type="button"
              onClick={() => scrollToCard((cardIndex - 1 + driverSpotlight.length) % driverSpotlight.length)}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-cyan-100 bg-white text-cyan-700 shadow-sm hover:bg-cyan-50"
              aria-label="Scroll drivers left"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollToCard((cardIndex + 1) % driverSpotlight.length)}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-cyan-100 bg-white text-cyan-700 shadow-sm hover:bg-cyan-50"
              aria-label="Scroll drivers right"
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* Popular Packages Section - Light Aqua Background */}
      <section className="relative py-16 bg-gradient-to-b from-cyan-50 via-white to-teal-50 overflow-hidden">
        {/* Subtle Dot Pattern */}
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 15% 25%, rgba(6,182,212,0.4) 2px, transparent 2px),
              radial-gradient(circle at 45% 15%, rgba(20,184,166,0.3) 1.5px, transparent 1.5px),
              radial-gradient(circle at 75% 35%, rgba(6,182,212,0.35) 2.5px, transparent 2.5px),
              radial-gradient(circle at 25% 65%, rgba(20,184,166,0.4) 2px, transparent 2px),
              radial-gradient(circle at 85% 75%, rgba(6,182,212,0.3) 1.8px, transparent 1.8px)
            `,
            backgroundSize: '800px 800px',
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Create Memories, Not Stress
            </h2>
            <p className="text-gray-600 text-lg">
              Your Varanasi story deserves a smooth ride – from the first darshan to the final goodbye
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Local Darshan Card */}
            <a
              href="/en/services/varanasi-full-day-city-tour-winter-2025"
              className="group bg-white rounded-2xl shadow-lg border border-cyan-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-48">
                <Image
                  src="https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-kashi-vishwanath-l.jpeg"
                  alt="Kashi Vishwanath Temple - Local Darshan"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-xl drop-shadow-lg">Experience the Divine Kashi</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 text-sm">
                  Feel the spiritual energy at Kashi Vishwanath, witness the magical Ganga Aarti, and explore ancient Sarnath – all without worrying about traffic or directions
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-teal-600 font-bold text-lg">From ₹2,500</span>
                  <span className="text-sm text-cyan-600 group-hover:translate-x-2 transition-transform">
                    Plan Your Day →
                  </span>
                </div>
              </div>
            </a>

            {/* Airport Taxi Card */}
            <a
              href="/en/varanasi-airport-taxi-price-guide"
              className="group bg-white rounded-2xl shadow-lg border border-cyan-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-48">
                <Image
                  src="https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/airport-taxi-600x400.jpeg"
                  alt="Varanasi Airport Taxi Service"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-xl drop-shadow-lg">Land Relaxed, Not Stressed</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 text-sm">
                  A friendly face waiting with your name – no haggling, no confusion. Your Varanasi welcome starts right at the airport
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-teal-600 font-bold text-lg">From ₹800</span>
                  <span className="text-sm text-cyan-600 group-hover:translate-x-2 transition-transform">
                    Book Pickup →
                  </span>
                </div>
              </div>
            </a>

            {/* Prayagraj Trip Card */}
            <a
              href="/en/varanasi-to-prayagraj"
              className="group bg-white rounded-2xl shadow-lg border border-cyan-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-48">
                <Image
                  src="https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/sangam-600x400.jpeg"
                  alt="Varanasi to Prayagraj Taxi"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-xl drop-shadow-lg">The Sacred Sangam Journey</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 text-sm">
                  Take your family to Triveni Sangam – where three holy rivers meet. A soul-stirring experience, made comfortable with our caring drivers
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-teal-600 font-bold text-lg">From ₹3,500</span>
                  <span className="text-sm text-cyan-600 group-hover:translate-x-2 transition-transform">
                    Plan Trip →
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Wave Separator - Popular Packages to Rates (white) */}
        <div className="absolute bottom-0 left-0 right-0 -mb-1">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ecfeff"></path>
          </svg>
        </div>
      </section>

      {/* Taxi Rates Cheat Sheet - Scannable Pricing Block */}
      <TaxiRatesCheatSheet variant="full" showCTA={true} />

      {/* Services Section - White to Light Teal */}
      <section className="relative py-16 bg-gradient-to-b from-white to-cyan-50 overflow-hidden">
        {/* Subtle Dot Pattern */}
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(6,182,212,0.35) 2px, transparent 2px),
              radial-gradient(circle at 60% 20%, rgba(20,184,166,0.3) 1.5px, transparent 1.5px),
              radial-gradient(circle at 80% 50%, rgba(6,182,212,0.4) 2.2px, transparent 2.2px),
              radial-gradient(circle at 30% 70%, rgba(20,184,166,0.35) 1.8px, transparent 1.8px),
              radial-gradient(circle at 90% 80%, rgba(6,182,212,0.3) 2px, transparent 2px)
            `,
            backgroundSize: '700px 700px',
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Every Journey Deserves Care
            </h2>
            <p className="text-gray-600 text-lg">
              Whether you’re 2 people or 20 – we have the perfect ride for your Varanasi adventure
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Airport Transfer */}
            <a
              href="/en/varanasi-airport-taxi-guide"
              className="group bg-white rounded-2xl shadow-lg p-6 border border-cyan-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">✈️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Stress-Free Airport Welcome</h3>
              <p className="text-gray-600 text-sm mb-4">
                Land tired, leave smiling. We track your flight and wait – no matter what time you arrive
              </p>
              <span className="text-cyan-600 font-semibold text-sm group-hover:translate-x-2 transition-transform inline-block">
                See How It Works →
              </span>
            </a>

            {/* Local Sightseeing */}
            <a
              href="/en/services/varanasi-full-day-city-tour-winter-2025"
              className="group bg-white rounded-2xl shadow-lg p-6 border border-cyan-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏛️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Discover Hidden Kashi</h3>
              <p className="text-gray-600 text-sm mb-4">
                See what most tourists miss. Our drivers know the best-kept secrets of this ancient city
              </p>
              <span className="text-cyan-600 font-semibold text-sm group-hover:translate-x-2 transition-transform inline-block">
                Explore Tours →
              </span>
            </a>

            {/* Tempo Traveller */}
            <a
              href="/en/tempo-traveller-varanasi"
              className="group bg-white rounded-2xl shadow-lg p-6 border border-cyan-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🚐</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">The Whole Family Together</h3>
              <p className="text-gray-600 text-sm mb-4">
                Travel, laugh, share snacks – make memories together in our spacious tempo travellers
              </p>
              <span className="text-cyan-600 font-semibold text-sm group-hover:translate-x-2 transition-transform inline-block">
                View Options →
              </span>
            </a>

            {/* Outstation Cabs */}
            <a
              href="/en/outstation-cabs-from-varanasi"
              className="group bg-white rounded-2xl shadow-lg p-6 border border-cyan-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🛣️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Beyond Varanasi Adventures</h3>
              <p className="text-gray-600 text-sm mb-4">
                Ayodhya, Prayagraj, Bodhgaya – extend your pilgrimage with comfortable long-distance rides
              </p>
              <span className="text-cyan-600 font-semibold text-sm group-hover:translate-x-2 transition-transform inline-block">
                Plan Outstation →
              </span>
            </a>
          </div>
        </div>

        {/* Wave Separator - Services to Reviews */}
        <div className="absolute bottom-0 left-0 right-0 -mb-1">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#cffafe"></path>
          </svg>
        </div>
      </section>

      {/* Google Reviews Section - Rich Cyan Gradient */}
      <section className="relative py-16 bg-gradient-to-br from-cyan-100 via-teal-50 to-cyan-50 overflow-hidden">
        {/* Premium Dot Pattern - More Visible */}
        <div className="absolute inset-0 opacity-[0.12]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 10% 20%, rgba(6,182,212,0.5) 2.5px, transparent 2.5px),
              radial-gradient(circle at 35% 10%, rgba(20,184,166,0.4) 2px, transparent 2px),
              radial-gradient(circle at 65% 30%, rgba(6,182,212,0.45) 3px, transparent 3px),
              radial-gradient(circle at 85% 15%, rgba(20,184,166,0.5) 2.2px, transparent 2.2px),
              radial-gradient(circle at 20% 60%, rgba(6,182,212,0.4) 2.5px, transparent 2.5px),
              radial-gradient(circle at 50% 50%, rgba(20,184,166,0.45) 2px, transparent 2px),
              radial-gradient(circle at 75% 70%, rgba(6,182,212,0.5) 2.8px, transparent 2.8px),
              radial-gradient(circle at 30% 85%, rgba(20,184,166,0.4) 2.3px, transparent 2.3px),
              radial-gradient(circle at 90% 90%, rgba(6,182,212,0.45) 2px, transparent 2px)
            `,
            backgroundSize: '900px 900px',
          }}></div>
        </div>

        <GoogleReviews />

        {/* Wave Separator - Reviews to Bike Rentals */}
        <div className="absolute bottom-0 left-0 right-0 -mb-1">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#fff7ed"></path>
          </svg>
        </div>
      </section>

      {/* Bike Rentals Section - Dynamically Loaded */}
      <BikeRentalsSection />

      {/* FAQ Section - Varanasi Taxi Service */}
      <section className="py-16 bg-gradient-to-b from-white to-cyan-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Varanasi Taxi Service – Frequently Asked Questions
            </h2>
            <p className="text-gray-600">Everything you need to know about booking a taxi in Varanasi</p>
          </div>

          <div className="space-y-4">
            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>How much does a taxi cost in Varanasi?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>Taxi rates in Varanasi start from <strong>₹12/km for sedans</strong> and <strong>₹18/km for SUVs</strong>. Airport pickup costs ₹800-950 (fixed), local full-day tours from ₹2,500, and tempo traveller hire from ₹4,500/day. We offer transparent pricing with no hidden charges.</p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>Which is the best taxi service in Varanasi?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>Vinayak Travels (KashiTaxi) is rated among the <strong>best taxi services in Varanasi</strong> with 4.8★ Google rating from 150+ reviews. We offer 24×7 cab booking, experienced local drivers, AC vehicles, and fixed-price packages for airport, local, and outstation trips.</p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>Is Ola/Uber available in Varanasi?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>Ola and Uber have <strong>limited availability in Varanasi</strong>, especially in old city areas near ghats. Local taxi services like ours provide better coverage, fixed rates, and drivers familiar with narrow ghat lanes and temple routes where app-based cabs often refuse trips.</p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>Can I book a taxi from Varanasi airport?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>Yes! We provide <strong>prepaid Varanasi airport taxi</strong> with meet-and-greet service. Our driver waits at arrivals with a name board. Fixed fare: ₹800 (sedan) to ₹950 (SUV) for city center. Flight tracking included – no waiting charges for delayed flights.</p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>Do you provide taxi for outstation from Varanasi?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>Yes, we offer <strong>outstation taxi from Varanasi</strong> to Prayagraj (₹3,500), Ayodhya (₹5,500), Bodhgaya (₹5,000), Vindhyachal (₹4,000), and all major pilgrimage destinations. One-way and roundtrip options available with driver allowance included.</p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>How to book taxi in Varanasi online?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>Book a <strong>taxi in Varanasi online</strong> through our website booking form, WhatsApp (+91-9935474730), or call (+91-8062182380). Share your pickup location, date/time, and trip type. Get instant quote and confirmation. No advance payment required for most bookings.</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section - Dynamically Loaded */}
      <CTASectionHome />

      <Footer allPosts={allPosts} />
    </>
  );
}

export async function getStaticProps() {
  const allPosts = getAllPostsMeta();
  return {
    props: {
      allPosts,
    },
  };
}
