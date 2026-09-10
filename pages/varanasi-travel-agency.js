import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import NavBar from '../components/NavBar/NavBar';
import StickyContactBar from '../components/ServicePage/StickyContactBar';
import Footer from '../components/Footer/Footer';
import GoogleReviews from '../components/GoogleReviews/GoogleReviews';
import JsonLd from '../components/JsonLd/JsonLd';
import getVaranasiTravelAgencySchema from '../components/JsonLd/varanasiTravelAgencySchema';
import HeroBookingWidget from '../components/HeroBookingWidget/HeroBookingWidget';
import PackageGateway from '../components/PackageGateway/PackageGateway';
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
  Calendar,
  HeartHandshake,
  Check,
  ArrowRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { logClick } from '@/lib/logClick';

// Lightweight skeleton for dynamic sections
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

// Dynamic imports matching site conventions
const CTASectionHome = dynamic(() => import('../components/CTASectionHome/CTASectionHome'), {
  loading: () => <SectionSkeleton title="Book Package" />,
  ssr: false,
});

export default function VaranasiTravelAgencyPage({ allPosts, contentHtml }) {
  const SITE = 'https://www.kashitaxi.in';
  const structuredData = getVaranasiTravelAgencySchema(SITE);
  const guideStripRef = useRef(null);
  const cardRefs = useRef([]);
  const [cardIndex, setCardIndex] = useState(0);

  const scrollToCard = (target) => {
    const el = cardRefs.current[target];
    if (el?.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setCardIndex(target);
    }
  };

  const guideSpotlight = [
    {
      name: 'Pravin Mishra (Senior Shastri Guide)',
      years: '22 yrs Kashi Heritage',
      route: 'Kashi Vishwanath Corridor, Vedic rituals & ancient ghat lore',
      img: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/Tempo%20Traveller%20Mishra%20ji%20with%20germal%20tourist.jpg',
    },
    {
      name: 'Rajan Ji (Pilgrim Tour Chauffeur)',
      years: '15 yrs highway experience',
      route: 'Ayodhya Ram Mandir & Prayagraj Sangam highway expert',
      img: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/Rajan%20Ji%20Citiline%20w%20Customer.jpg',
    },
    {
      name: 'Family Yatra Coordinators',
      years: 'Trusted since 1982',
      route: 'Special care for elderly parents, wheelchair assistance & satvik meals',
      img: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/Tempo%20Traveller%20group.jpg',
    },
    {
      name: 'Solo & Women Travelers Desk',
      years: '100% verified staff',
      route: 'Safe vetted stays, verified drivers & 24×7 live WhatsApp support',
      img: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/solo-femal-traveller-varanasi.jpeg',
    },
    {
      name: 'Luxury Tempo & Urbania Fleet',
      years: 'Joint family yatras',
      route: '9 to 26 seater pushback AC coaches for comfortable regional circuits',
      img: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/Tempo_travellar_Side_Packglass_landscape_zoomed.jpeg',
    },
    {
      name: '4.8★ Verified Google Reviews',
      years: '312+ guest reviews',
      route: '“Honest pricing, zero shopping detours, and wonderful temple guidance”',
      img: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/Tempo%20traveller%20Happy%20Customer.jpg',
    },
  ];

  const packagePricingRows = [
    {
      name: 'Complete Kashi Darshan & Ganga Aarti',
      duration: '2N / 3D',
      inclusions: '3-Star AC Hotel, Breakfast, Private AC Cab, Sunrise Boat, Kashi Vishwanath VIP Darshan, Sarnath Excursion, Dashashwamedh Aarti Boat Seats',
      idealFor: 'Couples, first-timers & nuclear families',
      price: '₹4,999',
      unit: 'per person',
      pageUrl: '/en/packages/varanasi-tour-package',
      whatsappMsg: 'Hi Varanasi Travel Agency, I want to book the 2N/3D Kashi Darshan & Ganga Aarti package (from ₹4,999/pax). Please share details.',
    },
    {
      name: 'Sacred Triangle: Varanasi – Ayodhya – Prayagraj',
      duration: '3N / 4D',
      inclusions: 'Hotels in Varanasi & Ayodhya, Private AC Cab throughout, Prayagraj Triveni Sangam Boat Bath, Ayodhya Ram Janmabhoomi Darshan',
      idealFor: 'Complete spiritual family yatra',
      price: '₹8,999',
      unit: 'per person',
      pageUrl: '/en/services/golden-triangle-varanasi-ayodhya-prayagraj-package',
      whatsappMsg: 'Hi Varanasi Travel Agency, I want to book the 3N/4D Varanasi-Ayodhya-Prayagraj package (from ₹8,999/pax). Please share details.',
    },
    {
      name: 'Kashi to Gaya & Bodhgaya Pind Daan Special',
      duration: '2N / 3D',
      inclusions: 'Hotel, Round-trip AC Sedan/Innova, Teerth Purohit Coordination at Vishnupad & Falgu River, Mahabodhi Temple Visit',
      idealFor: 'Ancestral Shradh / Pind Daan rituals',
      price: '₹6,499',
      unit: 'per person',
      pageUrl: '/en/kashi-gaya-prayag-pind-daan-tour',
      whatsappMsg: 'Hi Varanasi Travel Agency, I want to book the 2N/3D Gaya Pind Daan & Bodhgaya package (from ₹6,499/pax). Please share details.',
    },
    {
      name: 'Senior Citizen & Accessible Kashi Yatra',
      duration: '2N / 3D',
      inclusions: 'Elevator/Ground-floor Hotel, Wheelchair Escort, Battery E-Rickshaw Passes through Pedestrian Zones, Gentle Non-Rushed Pacing',
      idealFor: 'Elderly parents & travelers with knee pain',
      price: '₹5,499',
      unit: 'per person',
      pageUrl: '/en/senior-citizen-varanasi-tour-package',
      whatsappMsg: 'Hi Varanasi Travel Agency, I want to book the Senior Citizen Accessible Kashi Yatra (from ₹5,499/pax). Please share details.',
    },
    {
      name: 'Same-Day Varanasi City & Sarnath Private Tour',
      duration: '8 Hours',
      inclusions: 'Private AC Car, Chauffeur, Licensed Local Historian Guide, Sarnath Stupa & Museum, Kashi Vishwanath & Evening Aarti Transit',
      idealFor: 'Day visitors, business travelers & transit halts',
      price: '₹2,499',
      unit: 'per group (up to 4)',
      pageUrl: '/en/city/varanasi/sightseeing/varanasi-local-sightseeing-package',
      whatsappMsg: 'Hi Varanasi Travel Agency, I want to book the 1-Day Varanasi City & Sarnath Private Tour (from ₹2,499/group). Please share details.',
    },
    {
      name: 'Tempo Traveller Pilgrimage Charter',
      duration: 'Full Day / Outstation',
      inclusions: '12 to 26 Seater AC Pushback Tempo, Dedicated Highway Chauffeur, Fuel, State Taxes & Highway Tolls Included',
      idealFor: 'Large families, samaj & community groups',
      price: 'from ₹4,800',
      unit: 'per day',
      pageUrl: '/en/tempo-traveller-varanasi',
      whatsappMsg: 'Hi Varanasi Travel Agency, I need a Tempo Traveller quote for my group tour. Please share available vehicles and rates.',
    },
    {
      name: 'Babatpur Airport Transfer (Pickup / Drop)',
      duration: 'Direct Point-to-Point',
      inclusions: 'Clean AC Sedan, Highway Tolls, Airport Parking, Name Placard Meet & Greet, Complimentary 45-min Flight Delay Standby',
      idealFor: 'Airport arrivals & departures',
      price: '₹899',
      unit: 'fixed per car',
      pageUrl: '/varanasi-taxi-service',
      whatsappMsg: 'Hi Varanasi Travel Agency, I need a Babatpur Airport cab (from ₹899). Pickup: __, Drop: __, Flight Time: __.',
    },
  ];

  const routingGuides = [
    {
      title: 'Full Trip Packages (Stay + Cab + Darshan + Boat)',
      desc: 'All-inclusive 2 to 4 day plans with hotels, temple coordination, and private vehicle.',
      action: 'Stay on this page',
      href: '#package-rates-table',
      badge: 'You are here',
      isAnchor: true,
    },
    {
      title: 'Airport Cabs & 24×7 City Taxis',
      desc: 'Fixed Babatpur airport transfers from ₹899, station pickups, and instant point-to-point cabs.',
      action: 'Varanasi Taxi Service →',
      href: '/varanasi-taxi-service',
      badge: 'From ₹899',
    },
    {
      title: 'Tempo Traveller & Mini-Coach Hire',
      desc: '12, 17, 20 & 26 seater pushback AC vehicles for joint family yatras and group tours.',
      action: 'Tempo Traveller Rates →',
      href: '/en/tempo-traveller-varanasi',
      badge: 'Group Travel',
    },
    {
      title: 'Outstation Highway Cabs',
      desc: 'Direct private cars to Ayodhya Ram Mandir, Prayagraj Sangam, Vindhyachal, and Gaya.',
      action: 'Outstation Fares →',
      href: '/en/outstation-cabs-from-varanasi',
      badge: 'Interstate',
    },
    {
      title: 'Ganga Boat Ride & Aarti Booking',
      desc: 'Sunrise rowing boats and private motorboats with reserved seats for evening Dashashwamedh Aarti.',
      action: 'Boat Booking →',
      href: '/en/packages/varanasi-boat-ride-booking',
      badge: 'Riverside',
    },
    {
      title: 'Self-Drive Scooty & Bike Rentals',
      desc: 'Economical two-wheelers with helmets and document verification for easy street exploration.',
      action: 'Bike Rentals →',
      href: '/bike-rentals-varanasi',
      badge: 'Self-Drive',
    },
  ];

  return (
    <>
      <Head>
        <title>Best Travel Agency in Varanasi | Local Pilgrimage Desk – Vinayak Travels</title>
        <meta
          name="description"
          content="Official Varanasi Travel Agency operated by Vinayak Travels (Est. 1982) near Mahmoorganj & Sigra. Transparent package rates, temple darshan, hotel stays, verified drivers & 24×7 phone support."
        />
        <meta
          name="keywords"
          content="travel agency in varanasi, varanasi travel agency contact number, varanasi travel agency, best travel agency in varanasi, travel agency in mahmoorganj varanasi with phone number, kashi travel agency, varanasi travel desk"
        />
        <meta name="author" content="Varanasi Travel Agency" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE}/varanasi-travel-agency`} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Best Travel Agency in Varanasi | Local Pilgrimage Desk – Vinayak Travels" />
        <meta
          property="og:description"
          content="Official Varanasi Travel Agency operated by Vinayak Travels (Est. 1982) on Sigra-Mahmoorganj road. All-inclusive Kashi tour packages, temple VIP darshan, Gaya Pind Daan & 24×7 contact desk."
        />
        <meta property="og:image" content="https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png" />
        <meta property="og:url" content={`${SITE}/varanasi-travel-agency`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Varanasi Travel Agency" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Best Travel Agency in Varanasi | Curated Tour Packages – Vinayak Travels" />
        <meta
          name="twitter:description"
          content="Official Varanasi Travel Agency operated by Vinayak Travels (Est. 1982) on Sigra-Mahmoorganj road. Pilgrimage tour packages, verified guides & 24×7 local helpline."
        />
        <meta name="twitter:image" content="https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png" />

        {/* Geo Location Meta Tags */}
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Varanasi" />
        <meta name="geo.position" content="25.3109;82.9830" />
        <meta name="ICBM" content="25.3109, 82.9830" />
      </Head>

      <JsonLd data={structuredData} />
      <NavBar />

      {/* Hero Section */}
      <section className="relative flex items-center justify-center text-white overflow-hidden pt-16 pb-8 md:pt-20 md:pb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-cyan-600 to-teal-500"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/40 via-transparent to-teal-600/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-300/25 via-transparent to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10 py-2">
          <div className="max-w-6xl mx-auto">
            {/* Main Brand Title */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-1.5 mb-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] md:text-xs font-bold border border-white/30 uppercase tracking-widest text-white/95">
                <Sparkles className="h-3 w-3 text-amber-300" />
                Local Pilgrimage & Tour Desk • Vinayak Travels (Est. 1982) • Sigra / Mahmoorganj
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-3 drop-shadow-2xl tracking-tight leading-tight">
                Varanasi Travel Agency — Local Tour Packages, Clear Rates & Real Support
              </h1>
              <h2 className="text-sm md:text-lg font-medium text-white/95 mb-2 drop-shadow-md">
                Trusted Tour Operators in Varanasi Since 1982 • Authentic Kashi Darshan, Ayodhya, Prayagraj & Gaya Circuits
              </h2>
              <p className="text-xs md:text-sm font-light text-white/80 drop-shadow-lg italic max-w-3xl mx-auto">
                "No middleman markups, no commission saree shop detours, and no bargaining. Talk directly to our local Sigra team for honest itinerary advice."
              </p>
            </div>

            {/* Functional Booking Widget (Strictly Reused) */}
            <HeroBookingWidget />

            {/* Call, WhatsApp & Local Office CTAs */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <a
                id="varanasi_agency_call"
                href="tel:+919935474730"
                onClick={() => logClick('CALL')}
                data-cta-id="varanasi_agency_call"
                data-cta-location="varanasi_agency_hero"
                data-page-type="brand_business_page"
                className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-cyan-900 shadow-lg transition hover:bg-cyan-50 flex items-center gap-2"
              >
                <Phone className="h-4 w-4 text-cyan-700" />
                Call Helpline: +91 99354 74730
              </a>
              <a
                id="varanasi_agency_ops_call"
                href="tel:+919450301573"
                onClick={() => logClick('CALL')}
                data-cta-id="varanasi_agency_ops_call"
                data-cta-location="varanasi_agency_hero"
                data-page-type="brand_business_page"
                className="rounded-xl bg-cyan-900/80 backdrop-blur-md px-4 py-3 text-sm font-semibold text-white border border-white/30 shadow-lg transition hover:bg-cyan-900 flex items-center gap-2"
              >
                <Phone className="h-4 w-4 text-amber-300" />
                Operations Desk: +91 94503 01573
              </a>
              <a
                id="varanasi_agency_whatsapp"
                href={getWhatsAppUrl('Hi Varanasi Travel Agency, I want to inquire about tour packages. Travelers: __, Dates: __, Nights: __, Destinations: __ (Varanasi / Ayodhya / Prayagraj / Gaya).')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logClick('WHATSAPP')}
                data-cta-id="varanasi_agency_whatsapp"
                data-cta-location="varanasi_agency_hero"
                data-page-type="brand_business_page"
                className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-600 flex items-center gap-2"
              >
                WhatsApp Custom Plan
              </a>
            </div>

            {/* Mahmoorganj Office Grounding Strip */}
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/30 backdrop-blur-md rounded-full text-xs text-white/90 border border-white/20">
                <MapPin className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                <span><strong>Registered Office:</strong> L 10/125, Shastri Nagar, Sigra-Mahmoorganj Road (800m from Mahmoorganj Crossing)</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-white/90">
              <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                <HeartHandshake className="h-4 w-4 text-cyan-300" />
                <span>Est. 1982 (42+ Years Trust)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                <span>100% Scam Shield (No Forced Shops)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                <Clock className="h-4 w-4 text-cyan-300" />
                <span>24×7 Local On-Trip Support</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                <span>Wheelchair & Senior Friendly</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0 -mb-1">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative w-full h-24 md:h-36">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#f8fafc"></path>
          </svg>
        </div>
      </section>

      {/* Guide & Chauffeur Spotlight */}
      <section className="bg-gradient-to-r from-cyan-50/70 via-white to-teal-50/70 border-y border-cyan-100/70 py-3 md:py-6 mt-4 md:mt-6">
        <div className="container mx-auto px-4 max-w-6xl overflow-visible">
          <div className="mb-4 flex flex-row items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-600 text-sm font-bold text-white shadow-sm">4.8★</span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-700">Varanasi Tour Operators Since 1982</p>
                <h2 className="text-sm font-semibold leading-snug text-slate-900 md:text-lg">Certified Heritage Guides & Pilgrimage Chauffeurs</h2>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="shrink-0 border-cyan-200 text-cyan-800 hover:bg-cyan-50">
              <a href="tel:+919935474730">
                <Phone className="mr-1.5 h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Call +91 99354 74730</span>
                <span className="sm:hidden">Call</span>
              </a>
            </Button>
          </div>
          <div
            className="flex gap-4 overflow-x-auto overflow-y-visible pb-2 md:pb-6 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden justify-start md:justify-center scroll-smooth"
            aria-label="Guide & Driver partners carousel"
            ref={guideStripRef}
          >
            {guideSpotlight.map((guide, idx) => (
              <div
                key={guide.name}
                className="group relative snap-start shrink-0 w-48 rounded-2xl border border-cyan-100 bg-white shadow-md p-4 flex flex-col items-center origin-center transition-transform duration-200 ease-out hover:scale-[1.18] hover:shadow-2xl hover:z-30"
                ref={(el) => {
                  if (el) cardRefs.current[idx] = el;
                }}
              >
                <div className="relative h-32 w-32 overflow-hidden rounded-full border border-cyan-100 bg-cyan-50/60">
                  <Image
                    src={guide.img.replace('/upload/', '/upload/w_128,h_128,c_fill,q_auto,f_auto/')}
                    alt={`${guide.name} - Varanasi Travel Agency guide`}
                    width={128}
                    height={128}
                    quality={95}
                    unoptimized
                    className="h-full w-full object-cover object-center"
                    priority={idx < 2}
                  />
                </div>
                <p className="mt-2 text-[12px] font-semibold text-gray-900 text-center leading-tight">{guide.name}</p>
                <p className="text-[11px] text-gray-600 text-center leading-snug mt-1">{guide.route}</p>
                <p className="text-[11px] font-semibold text-cyan-700 mt-1">{guide.years}</p>
              </div>
            ))}
          </div>

          <div className="mt-1.5 md:mt-3 flex items-center justify-center gap-3 text-[12px] text-gray-600">
            <button
              type="button"
              onClick={() => scrollToCard((cardIndex - 1 + guideSpotlight.length) % guideSpotlight.length)}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-cyan-100 bg-white text-cyan-700 shadow-sm hover:bg-cyan-50"
              aria-label="Scroll guides left"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollToCard((cardIndex + 1) % guideSpotlight.length)}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-cyan-100 bg-white text-cyan-700 shadow-sm hover:bg-cyan-50"
              aria-label="Scroll guides right"
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* Package Gateway - Reused Component */}
      <PackageGateway />

      {/* ========================================================================= */}
      {/* 1. PRICE TABLE BEFORE TEXT (User Explicit Request) */}
      {/* ========================================================================= */}
      <section id="package-rates-table" className="relative py-14 bg-gradient-to-b from-slate-50 via-white to-cyan-50/40 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 mb-2 px-3.5 py-1 bg-cyan-100/90 rounded-full text-xs font-bold text-cyan-800">
              <Calendar className="h-3.5 w-3.5 text-cyan-700" />
              100% Transparent Tariffs • Verified Price Floor
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Varanasi Travel Agency Package Tariffs (2026 Price Table)
            </h2>
            <p className="mt-2 text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
              Clear prices before you pay. Includes verified 3-star AC hotels, private AC car, licensed local guide, sunrise boat rides & VIP temple darshan.
            </p>
          </div>

          {/* Desktop & Tablet Table */}
          <div className="overflow-x-auto rounded-2xl border border-cyan-100 bg-white shadow-xl">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white text-xs uppercase tracking-wider">
                <tr>
                  <th scope="col" className="py-4 px-4 md:px-6">Package Name & Duration</th>
                  <th scope="col" className="py-4 px-4 hidden md:table-cell">Key Inclusions</th>
                  <th scope="col" className="py-4 px-4 hidden lg:table-cell">Best Suited For</th>
                  <th scope="col" className="py-4 px-4 text-right">Starting Price</th>
                  <th scope="col" className="py-4 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {packagePricingRows.map((pkg, idx) => (
                  <tr key={pkg.name} className={idx % 2 === 0 ? 'bg-white hover:bg-cyan-50/40 transition' : 'bg-slate-50/60 hover:bg-cyan-50/40 transition'}>
                    <td className="py-4 px-4 md:px-6">
                      <div className="font-bold text-slate-900 text-sm md:text-base">{pkg.name}</div>
                      <div className="inline-block mt-1 text-[11px] font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                        {pkg.duration}
                      </div>
                      <div className="mt-1">
                        <Link href={pkg.pageUrl} className="text-[11px] font-semibold text-cyan-700 hover:text-cyan-900 underline inline-flex items-center gap-0.5">
                          View Detailed Plan →
                        </Link>
                      </div>
                      <div className="mt-1 text-xs text-slate-500 md:hidden">
                        {pkg.inclusions}
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell text-xs leading-relaxed text-slate-600 max-w-xs">
                      {pkg.inclusions}
                    </td>
                    <td className="py-4 px-4 hidden lg:table-cell text-xs font-medium text-slate-600">
                      {pkg.idealFor}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="text-base md:text-lg font-extrabold text-cyan-800">{pkg.price}</div>
                      <div className="text-[11px] text-slate-500">{pkg.unit}</div>
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <a
                        href={getWhatsAppUrl(pkg.whatsappMsg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                      >
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Trust Guarantees Strip Below Table */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <Shield className="h-5 w-5 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-slate-900">Free Cancellation</p>
                <p className="text-slate-500">Up to 24 hrs before</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <Check className="h-5 w-5 text-cyan-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-slate-900">Zero Forced Shops</p>
                <p className="text-slate-500">100% Scam Shield</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <MapPin className="h-5 w-5 text-amber-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-slate-900">Mahmoorganj Office</p>
                <p className="text-slate-500">Walk-ins welcome</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <Phone className="h-5 w-5 text-indigo-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-slate-900">24×7 Local Support</p>
                <p className="text-slate-500">+91 99354 74730</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DIRECT SERVICE ROUTING GUIDE (Adopted from Top Redirect Pages) */}
      {/* ========================================================================= */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Not sure which service you need? Quick Routing Guide
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Choose your exact requirement to jump directly to the right specialist page
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {routingGuides.map((item) => (
              <div
                key={item.title}
                className="group relative rounded-2xl border border-slate-200 bg-slate-50/50 p-5 hover:bg-white hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-100/70 px-2.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.desc}</p>
                </div>
                {item.isAnchor ? (
                  <a
                    href={item.href}
                    className="inline-flex items-center gap-1 text-xs font-bold text-cyan-700 group-hover:text-cyan-800"
                  >
                    {item.action} ↓
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-xs font-bold text-cyan-700 group-hover:text-cyan-800"
                  >
                    {item.action}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Content Guide - Strictly Reusing ArticleNew */}
      {contentHtml && (
        <ArticleNew
          contentHtml={contentHtml}
          badgeIcon="🕉️"
          badgeText="Local Varanasi Travel Agency Guide"
          title="Local Varanasi Travel Agency Guide: Real Logistics & Fair Rates"
          subtitle="Honest advice on temple queues, pedestrian ghat barricades, fair package pricing, and avoiding street scams—from locals who live here."
          gradientStops="from-white via-cyan-50/30 to-white"
          cardBorder="border-cyan-200/70"
          cardShadow="shadow-xl shadow-cyan-100/50"
          ribbonGradient="from-indigo-600 via-cyan-600 to-teal-500"
          tocItems={[
            { label: 'Honest Advice', anchor: '#honest-advice-for-planning-your-varanasi-trip' },
            { label: 'Package Tariffs', anchor: '#varanasi-travel-agency-package-tariffs-2026-price-table' },
            { label: 'Service Routing', anchor: '#what-you-need-vs-best-page-to-use' },
            { label: 'Mahmoorganj Office & Phones', anchor: '#our-sigra--mahmoorganj-office--direct-phone-numbers' },
            { label: 'Why Book Local', anchor: '#why-book-with-a-local-varanasi-agency-not-an-aggregator-app' },
            { label: 'Day-by-Day Itineraries', anchor: '#realistic-day-by-day-package-itineraries' },
            { label: 'Senior Citizen Care', anchor: '#senior-citizen--wheelchair-care-no-endless-walking' },
            { label: 'Tempo Traveller Rates', anchor: '#tempo-traveller--group-fleet-rates' },
            { label: 'Fair Cancellation Policy', anchor: '#booking-process--fair-cancellation-policy' },
            { label: 'FAQs', anchor: '#frequently-asked-questions' },
          ]}
          stats={[
            { value: '42+ Yrs', label: 'Local Heritage (Est. 1982)' },
            { value: '4.8★', label: 'Verified Google Rating' },
            { value: '₹4,999', label: 'Stay + Tour Packages' },
            { value: '100%', label: 'Scam Shield Guarantee' },
          ]}
        />
      )}

      {/* Google Reviews Section - Strictly Reused */}
      <section className="relative py-16 bg-gradient-to-br from-cyan-100 via-teal-50 to-cyan-50 overflow-hidden">
        <GoogleReviews />
      </section>

      {/* FAQ Section - Specifically Tailored for Varanasi Travel Agency & GSC Target Queries */}
      <section className="py-16 bg-gradient-to-b from-white to-cyan-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-700 to-teal-700 bg-clip-text text-transparent">
              Varanasi Travel Agency – Frequently Asked Questions
            </h2>
            <p className="text-gray-600">Common questions regarding tour packages, booking numbers, and Mahmoorganj office guidance</p>
          </div>

          <div className="space-y-4">
            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>Which is the best travel agency in Varanasi for tour packages?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>
                  <strong>Vinayak Travels (operating as Varanasi Travel Agency since 1982)</strong> is one of the oldest and most trusted agencies in Varanasi. With over 42 years of hospitality experience, 4.8-star customer satisfaction, a registered physical office in Sigra-Mahmoorganj, and an owned fleet of sedans, SUVs, and Tempo Travellers, we guarantee transparent tariffs, vetted local guides, and zero commission shopping detours.
                </p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>What is the Varanasi travel agency contact number for booking and inquiries?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>
                  You can call our 24×7 customer care hotline directly at <strong><a href="tel:+919935474730" className="text-cyan-700 underline font-bold">+91 99354 74730</a></strong> or our central operations desk at <strong><a href="tel:+919450301573" className="text-cyan-700 underline font-bold">+91 94503 01573</a></strong>. For instant customized itinerary plans on WhatsApp, message us anytime at +91 99354 74730.
                </p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>Where is your travel agency located in Mahmoorganj / Sigra Varanasi?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>
                  Our registered operations office is at <strong>L 10/125, Shastri Nagar, Sigra, Varanasi 221010</strong>. We are situated directly on the Sigra–Mahmoorganj main road, approximately 800 meters from Mahmoorganj Crossing and 5 minutes from Varanasi Cantt Railway Station. Devotees and families are welcome to walk in for direct consultations daily between 7:00 AM and 10:00 PM.
                </p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>What tour packages are offered by Varanasi Travel Agency and what are the starting costs?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>
                  We offer transparently priced pilgrimage and holiday packages:
                  <br />• <strong>1-Day Varanasi City & Sarnath Guided Tour:</strong> from ₹2,499 per group
                  <br />• <strong>2N/3D Complete Kashi Darshan with Hotel Stay:</strong> from ₹4,999 per person
                  <br />• <strong>3N/4D Sacred Triangle (Varanasi – Ayodhya – Prayagraj):</strong> from ₹8,999 per person
                  <br />• <strong>2N/3D Gaya & Bodhgaya Pind Daan Special:</strong> from ₹6,499 per person
                  <br />• <strong>Tempo Traveller Charter (9–26 Seater):</strong> from ₹4,800 per day
                  <br />• <strong>Babatpur Airport Transfers:</strong> from ₹899 fixed fare
                </p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>Do you provide wheelchair assistance and VIP darshan for senior citizens?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>
                  Yes. Our specialized Senior Citizen Yatra includes licensed wheelchair escorts at Kashi Vishwanath and Sankat Mochan, battery e-rickshaw permits through Godowlia pedestrian corridors, level ground-floor or elevator-accessible hotels, and gentle, unhurried pacing.
                </p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>Can your travel agency arrange multi-city pilgrimage packages to Ayodhya, Prayagraj, and Gaya?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>
                  Yes. We customize seamless itineraries connecting Varanasi with the Ayodhya Ram Janmabhoomi Mandir, Prayagraj Triveni Sangam, Vindhyachal Shaktipeeth, Bodhgaya, and Chitrakoot. All packages include dedicated interstate AC vehicles, highway toll management, and vetted hotel stays.
                </p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>How do you protect travelers from common Varanasi tourist traps and scams?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>
                  We operate with a strict Scam Shield Policy: zero forced detours to commission silk saree shops, fixed-rate private motorboats equipped with certified life jackets, authentic Vedic Purohits with transparent dakshina agreements, and all-inclusive transparent billing.
                </p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-md border border-cyan-100 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 hover:bg-cyan-50/50">
                <span>What is the booking and cancellation policy?</span>
                <span className="text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>
                  You can finalize your itinerary with our planners on phone or WhatsApp. We take a token 20% advance via UPI, net banking, or card. We offer 100% free cancellation up to 24 hours before your trip. The remaining balance is cleared after you arrive in Varanasi.
                </p>
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
  const { contentHtml } = await loadMarkdownContent('en', 'varanasi-travel-agency');

  return {
    props: {
      allPosts,
      contentHtml: demoteContentHeadings(contentHtml),
    },
  };
}
