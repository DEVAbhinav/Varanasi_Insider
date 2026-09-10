import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import NavBar from '../components/NavBar/NavBar';
import StickyContactBar from '../components/ServicePage/StickyContactBar';
import Footer from '../components/Footer/Footer';
import GoogleReviews from '../components/GoogleReviews/GoogleReviews';
import JsonLd from '../components/JsonLd/JsonLd';
import getVaranasiTaxiSchema from '../components/JsonLd/varanasiTaxiSchema';
import HeroBookingWidget from '../components/HeroBookingWidget/HeroBookingWidget';
import ArticleNew from '../components/ArticleNew/ArticleNew';
import { CONTACT, getCallTelHref, getWhatsAppUrl } from '@/lib/contact';
import { Button } from '@/components/ui/button';
import {
  Phone,
  ShieldCheck,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { logClick } from '@/lib/logClick';
import { formatINR } from '../lib/pricing';
import {
  OUTSTATION_FAQ_EMPHASIS,
  OUTSTATION_FAQ_LEAD,
  OUTSTATION_FAQ_TAIL,
  outstationRouteList,
} from '../lib/outstationFares';
import {
  AIRPORT_CITY_SEDAN_FARE,
  TAXI_RATE_CARDS,
  airportTaxiFaqAnswer,
  taxiCostFaqAnswer,
} from '../lib/taxiRates';

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

// Dynamic imports matching homepage structure
const CTASectionHome = dynamic(() => import('../components/CTASectionHome/CTASectionHome'), {
  loading: () => <SectionSkeleton title="Book Now" />,
  ssr: false,
});

const TaxiRatesCheatSheet = dynamic(() => import('../components/TaxiRatesCheatSheet/TaxiRatesCheatSheet'), {
  loading: () => <SectionSkeleton title="Taxi Rates" />,
  ssr: false,
});

export default function VaranasiTaxiServicePage({ allPosts, contentHtml }) {
  const SITE = 'https://www.kashitaxi.in';
  const structuredData = getVaranasiTaxiSchema(SITE);
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
      years: 'Trusted since 1982',
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
      years: 'Verified drivers & live tracking',
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
      name: '4.8★ on Google Reviews',
      years: '312 verified Google reviews',
      route: '“Driver knew secret ghat parking” – hear it from our guests',
      img: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/Tempo%20traveller%20Happy%20Customer.jpg',
    },
  ];

  return (
    <>
      <Head>
        <title>Varanasi Taxi Service™ | Official 24×7 Cab Booking & Rates – Vinayak Travels</title>
        <meta
          name="description"
          content={`Official Varanasi Taxi Service operated by Vinayak Travels & Kashi Taxi. Book 24×7 city cabs, fixed airport transfers from ${formatINR(AIRPORT_CITY_SEDAN_FARE)}, station pickups, temple tours & verified drivers.`}
        />
        <meta
          name="keywords"
          content="varanasi taxi service, varanasi taxi services, varanasi taxi, varanasi cab service, varanasi cab, taxi service in varanasi, varanasi cab booking, best taxi service in varanasi, varanasi taxi contact number"
        />
        <meta name="author" content="Varanasi Taxi Service" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE}/varanasi-taxi-service`} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Varanasi Taxi Service™ | Official 24×7 Cab Booking & Rates" />
        <meta
          property="og:description"
          content="Official Varanasi Taxi Service operated by Vinayak Travels & Kashi Taxi. Reliable 24×7 city cabs, airport pickup ₹899, local sightseeing, and verified drivers."
        />
        <meta property="og:image" content="https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png" />
        <meta property="og:url" content={`${SITE}/varanasi-taxi-service`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Varanasi Taxi Service" />
        <meta property="og:locale" content="en_IN" />

        {/* Geo Location Meta Tags */}
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Varanasi" />
        <meta name="geo.position" content="25.3176;82.9739" />
        <meta name="ICBM" content="25.3176, 82.9739" />
      </Head>

      <JsonLd data={structuredData} />
      <NavBar />

      {/* Hero Section - Matching Homepage Gradient & Quality */}
      <section className="relative flex items-center justify-center text-white overflow-hidden pt-16 pb-8 md:pt-20 md:pb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/40 via-transparent to-teal-600/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-300/20 via-transparent to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10 py-2">
          <div className="max-w-6xl mx-auto">
            {/* Main Brand Title */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-1.5 mb-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] md:text-xs font-bold border border-white/30 uppercase tracking-widest text-white/95">
                <Sparkles className="h-3 w-3 text-amber-300" />
                Official City Dispatch Fleet • Vinayak Travels (Est. 1982)
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-3 drop-shadow-2xl tracking-tight leading-tight">
                Varanasi Taxi Service — 24×7 Local Cabs, Airport Pickup & Outstation
              </h1>
              <h2 className="text-sm md:text-lg font-medium text-white/95 mb-2 drop-shadow-md">
                Official Local Dispatch Fleet by Vinayak Travels & Kashi Taxi • Verified Drivers & Fixed Rates
              </h2>
              <p className="text-xs md:text-sm font-light text-white/80 drop-shadow-lg italic">
                "Fast local city dispatch, transparent pricing with no surge fees, and chauffeurs who know every ghat lane."
              </p>
            </div>

            {/* Functional Booking Widget (Strictly Reused) */}
            <HeroBookingWidget />

            {/* Call and WhatsApp CTA Actions */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <a
                id="varanasi_taxi_call"
                href={getCallTelHref()}
                onClick={() => logClick('CALL')}
                data-cta-id="varanasi_taxi_call"
                data-cta-location="varanasi_taxi_hero"
                data-page-type="brand_business_page"
                className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-cyan-800 shadow-lg transition hover:bg-cyan-50 flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Call Varanasi Taxi: {CONTACT.callNumberDisplay}
              </a>
              <a
                id="varanasi_taxi_whatsapp"
                href={getWhatsAppUrl('Hi Varanasi Taxi Service, I need a cab quote. Pickup: __, Destination: __, Time: __, Passengers: __.')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logClick('WHATSAPP')}
                data-cta-id="varanasi_taxi_whatsapp"
                data-cta-location="varanasi_taxi_hero"
                data-page-type="brand_business_page"
                className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-600 flex items-center gap-2"
              >
                WhatsApp Fast Quote
              </a>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-white/90">
              <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/20">
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                <span>Police-Verified Drivers</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/20">
                <Clock className="h-4 w-4 text-cyan-300" />
                <span>24×7 Local Dispatch Desk</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/20">
                <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                <span>Fixed Fares (No Surge)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/20">
                <MapPin className="h-4 w-4 text-cyan-300" />
                <span>All Ghats & Stands Covered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Separator Matching Homepage */}
        <div className="absolute bottom-0 left-0 right-0 -mb-1">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative w-full h-24 md:h-36">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ecfeff"></path>
          </svg>
        </div>
      </section>

      {/* Driver Spotlight - Strictly Reused from Homepage */}
      <section className="bg-gradient-to-r from-cyan-50/70 via-white to-teal-50/70 border-y border-cyan-100/70 py-3 md:py-6 mt-4 md:mt-6">
        <div className="container mx-auto px-4 max-w-6xl overflow-visible">
          <div className="mb-4 flex flex-row items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 text-sm font-bold text-white shadow-sm">4.8★</span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-700">Serving Varanasi since 1982</p>
                <h2 className="text-sm font-semibold leading-snug text-slate-900 md:text-lg">Varanasi Taxi Service Chauffeurs — Local Experts on Every Lane</h2>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="shrink-0 border-cyan-200 text-cyan-800 hover:bg-cyan-50">
              <a href={getCallTelHref()}>
                <Phone className="mr-1.5 h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Call {CONTACT.callNumberDisplay.replace('+91 ', '')}</span>
                <span className="sm:hidden">Call</span>
              </a>
            </Button>
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
                    alt={`${driver.name} - Varanasi Taxi driver`}
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

      {/* Taxi Rates Cheat Sheet - Strictly Reused from Homepage */}
      <TaxiRatesCheatSheet variant="full" showCTA={true} />

      {/* Services Section - Strictly Reused from Homepage */}
      <section className="relative py-16 bg-gradient-to-b from-white to-cyan-50 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Varanasi Taxi Service Fleet & Booking Options
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              From Babatpur airport pickups and Cantt station transfers to temple sightseeing and outstation cars — 24×7 booking with guaranteed fixed fares.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-cyan-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-4">✈️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Varanasi Airport Taxi Transfer</h3>
              <p className="text-gray-600 text-sm mb-4">
                Fixed-fare Babatpur airport pickup (₹899 sedan) and drop with real-time flight tracking and terminal meet-and-greet.
              </p>
              <a href={getWhatsAppUrl('Hi, I need an Airport Taxi with Varanasi Taxi Service.')} className="font-semibold text-cyan-600 hover:text-cyan-700 text-sm">
                Book Airport Cab →
              </a>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-cyan-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-4">🚉</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Railway Station Cab Pickup</h3>
              <p className="text-gray-600 text-sm mb-4">
                Fast pickups at Varanasi Cantt (BSB), Banaras (Manduadih) & DDU Junction from ₹899. Chauffeur assists with luggage and hotel drop.
              </p>
              <a href={getWhatsAppUrl('Hi, I need a railway station cab with Varanasi Taxi Service.')} className="font-semibold text-cyan-600 hover:text-cyan-700 text-sm">
                Book Station Cab →
              </a>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-cyan-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-4">🕉️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Local City & Temple Darshan</h3>
              <p className="text-gray-600 text-sm mb-4">
                Half-day (4h/40km ₹1,100) and Full-day (8h/80km ₹2,499) AC private cabs for Kashi Vishwanath, Sarnath, and Ganga Aarti.
              </p>
              <a href={getWhatsAppUrl('Hi, I need a city sightseeing cab with Varanasi Taxi Service.')} className="font-semibold text-cyan-600 hover:text-cyan-700 text-sm">
                Book City Tour →
              </a>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-cyan-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-4">🛣️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Outstation & Pilgrimage Cabs</h3>
              <p className="text-gray-600 text-sm mb-4">
                Comfortable AC cabs to Prayagraj (from ₹2,388), Ayodhya (from ₹3,820), Vindhyachal (from ₹1,877) & Gaya (from ₹4,813) from ₹12/km.
              </p>
              <a href={getWhatsAppUrl('Hi, I need an outstation taxi with Varanasi Taxi Service.')} className="font-semibold text-cyan-600 hover:text-cyan-700 text-sm">
                Book Outstation Cab →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Content Guide - Strictly Reusing ArticleNew Component */}
      {contentHtml && (
        <ArticleNew
          contentHtml={contentHtml}
          badgeIcon="🚖"
          badgeText="Official City Dispatch Guide"
          title="Official Varanasi Taxi Service Guide"
          subtitle="Complete rates, airport transfer logistics, temple darshan routes, ghat access rules & driver verification."
          gradientStops="from-white via-cyan-50/30 to-white"
          cardBorder="border-cyan-200/70"
          cardShadow="shadow-xl shadow-cyan-100/50"
          ribbonGradient="from-cyan-500 via-teal-500 to-emerald-400"
          tocItems={[
            { label: 'Overview', anchor: '#overview-of-varanasi-taxi-service' },
            { label: 'Fares & Tariff', anchor: '#varanasi-taxi-service-fare-card--tariff' },
            { label: 'Temple Darshan', anchor: '#local-sightseeing--temple-darshan-cabs' },
            { label: 'Ghat Logistics', anchor: '#navigating-ghat-barricades--hotel-access' },
            { label: 'Outstation Routes', anchor: '#outstation-taxi-service-from-varanasi' },
            { label: 'Scam Shield', anchor: '#the-varanasi-taxi-service-scam-shield' },
            { label: 'Vehicle Fleet', anchor: '#our-fleet--luggage-capacity-guide' },
            { label: 'How to Book', anchor: '#how-to-book-your-varanasi-taxi' },
          ]}
          stats={[
            { value: '24×7', label: 'Local Dispatch Desk' },
            { value: '₹899', label: 'Airport Fixed Fare' },
            { value: '100%', label: 'Police-Verified Drivers' },
            { value: '4.8★', label: 'Google Rating' },
          ]}
        />
      )}

      {/* Google Reviews Section - Strictly Reused */}
      <section className="relative py-16 bg-gradient-to-br from-cyan-100 via-teal-50 to-cyan-50 overflow-hidden">
        <GoogleReviews />
      </section>

      {/* FAQ Section - Tailored specifically for Varanasi Taxi Service */}
      <section className="py-16 bg-gradient-to-b from-white to-cyan-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Varanasi Taxi Service – Frequently Asked Questions
            </h2>
            <p className="text-gray-600">Answers to common booking and fare questions for Varanasi Taxi Service</p>
          </div>

          <div className="space-y-4">
            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>How much does a taxi or cab cost with Varanasi Taxi Service?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>{taxiCostFaqAnswer()}</p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>What is the taxi fare from Varanasi Airport to the city or ghats?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>{airportTaxiFaqAnswer()}</p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>Do you provide outstation taxi service from Varanasi?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>{OUTSTATION_FAQ_LEAD}<strong>{OUTSTATION_FAQ_EMPHASIS}</strong> to {outstationRouteList()}{OUTSTATION_FAQ_TAIL}</p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>How do I book a cab with Varanasi Taxi Service?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>You can book instantly using our on-page quote widget, or call our 24×7 dispatch at {CONTACT.callNumberDisplay} or message via WhatsApp. We confirm your driver and car number in minutes.</p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>Are your Varanasi taxi drivers verified and safe for families?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>Yes, 100% of our drivers are police-verified local professionals with deep knowledge of Varanasi traffic, ghat walking access zones, and parking corridors.</p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>Can Varanasi Taxi Service pick up from Cantt Railway Station?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>Yes, our dispatch team actively tracks train arrival times (via PNR or train number) and coordinates seamless meet-and-greet pickups at Varanasi Junction (Cantt), Banaras (Manduadih), and DDU Junction.</p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>Is 24×7 taxi service available for midnight or early-morning travel in Varanasi?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>Yes, our city cabs operate 24 hours a day, 7 days a week. For late-night or pre-dawn 3:00 AM pickups (e.g., Subah-e-Banaras or morning flights), we recommend pre-booking so a dedicated cab is stationed ahead of time.</p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>How close can a taxi get to Dashashwamedh Ghat or Kashi Vishwanath Temple?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>Because of city police barricades, 4-wheelers cannot enter past Godowlia Chowk, Maidagin, or Sonarpura (especially 4 PM–10 PM). Our drivers drop you at the closest accessible checkpoint (approx. 250–350m away) and coordinate licensed luggage porters or battery e-rickshaws directly to your riverside hotel.</p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>What happens if my flight or train to Varanasi is delayed?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>We provide complimentary live tracking for all flight numbers and railway PNRs. If your flight or train is delayed, your cab waits up to 45 minutes free of charge with zero cancellation penalty or surge fees.</p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>Do you guarantee no forced shopping or commission detours?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>Yes. Varanasi Taxi Service operates under a strict Scam Shield Policy: 100% direct point-to-point transit. Our drivers are strictly prohibited from making unscheduled detours to silk saree emporiums or overpriced boat docks.</p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>How much luggage fits in each Varanasi Taxi vehicle type?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>Sedans (Dzire/Aura) accommodate 4 passengers with 2 large check-in suitcases and 2 cabin bags in a dedicated clean trunk. Ertiga SUVs fit 5-6 passengers with 3 large suitcases. Innova Crysta holds 6-7 passengers with 4-5 large suitcases plus an optional roof rack. Tempo Travellers accommodate 9-26 passengers with a dedicated rear luggage compartment.</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section - Strictly Reused */}
      <CTASectionHome />
      <Footer allPosts={allPosts} />
      <StickyContactBar phone={CONTACT.callNumberRaw} />
    </>
  );
}

export async function getStaticProps() {
  const { getAllPostsMeta, loadMarkdownContent } = await import('@/lib/posts');
  const { demoteContentHeadings } = await import('@/lib/markdown');
  const allPosts = getAllPostsMeta();
  const { contentHtml } = await loadMarkdownContent('en', 'varanasi-taxi-service');

  return {
    props: {
      allPosts,
      contentHtml: demoteContentHeadings(contentHtml),
    },
  };
}
