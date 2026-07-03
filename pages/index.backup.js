// This is the main landing page for the entire site.
import NavBar from '../components/NavBar/NavBar';
import HeroSection from '../components/HeroSection/HeroSection';
import GoogleReviews from '../components/GoogleReviews/GoogleReviews';
import Footer from '../components/Footer/Footer';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import JsonLd from '../components/JsonLd/JsonLd';
import getHomeSchema from '../components/JsonLd/homepageSchema';
import { CONTACT, getCallTelHref } from '@/lib/contact';

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

const PinkTaxiSection1 = dynamic(() => import('../components/PinkTaxiSection/PinkTaxiSection1'), {
  loading: () => <SectionSkeleton title="Pink Taxi" />,
});
const KashiTaxiIntro = dynamic(() => import('../components/KashiTaxiIntro/KashiTaxiIntro'), {
  loading: () => <SectionSkeleton title="Varanasi Taxi Intro" />,
});
const CTASection = dynamic(() => import('../components/CTASection/CTASection'), {
  loading: () => <SectionSkeleton title="Get in touch" />,
});
// Only one BikeRentalFlash, loaded dynamically and below-the-fold
const BikeRentalFlash = dynamic(() => import('../components/BikeRentalFlash/BikeRentalFlash'), {
  loading: () => <SectionSkeleton title="Bike Rentals" />,
  ssr: false,
});

export default function HomePage({ allPosts }) {
  const SITE = 'https://www.kashitaxi.in';
  const structuredData = getHomeSchema(SITE);

  return (
    <>
      <Head>
        <title>{`Varanasi Taxi & Tempo Traveller | Tour Packages ☎ ${CONTACT.callNumberDisplay.replace('+91 ', '')} - Vinayak Travels`}</title>
        <meta
          name="description"
          content="Varanasi Taxi, Tempo Traveller & Tour Packages by Vinayak Travels. Airport cab ₹800, Local tours ₹2,500, Tempo traveller hire. 24×7 Varanasi travels service. Book now!"
        />
        <meta name="keywords" content="varanasi taxi, varanasi tempo traveller, varanasi tour, varanasi travels, airport taxi varanasi, tempo traveller hire varanasi, varanasi tour packages, varanasi cab service, varanasi local sightseeing, outstation taxi varanasi" />
        <meta name="author" content="Vinayak Travels" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Varanasi Taxi & Tempo Traveller Service | Tour Packages - Vinayak Travels" />
        <meta property="og:description" content="Book Varanasi Taxi, Tempo Traveller & Tour Packages. Airport transfer, Local sightseeing, Outstation tours. 24×7 Varanasi travels service." />
        <meta property="og:image" content="https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png" />
        <meta property="og:url" content="https://www.kashitaxi.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Varanasi Taxi & Tempo Traveller - Vinayak Travels" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Varanasi" />
        <meta name="geo.position" content="25.287133678944816;82.94264689837131" />
        <meta name="ICBM" content="25.287133678944816, 82.94264689837131" />
      </Head>
      <JsonLd data={structuredData} />
      <NavBar />
      <main className="pb-24 md:pb-0">
        {/* Keep above-the-fold lean: Hero first */}
        <HeroSection
          calculatorProps={{
            cardClassName: 'bg-white/10 backdrop-blur-md border-white/20 text-white shadow-lg',
            contentClassName: '[&_label]:text-white/85',
            inputClassName: 'bg-white/95 text-slate-900 placeholder-slate-600',
            headerTitleClassName: 'text-white font-semibold tracking-tight',
            leftSummaryClassName: 'text-sm text-white/85',
            totalLabelClassName: 'text-white/80',
            totalValueClassName: 'text-white',
            totalEffClassName: 'text-white/70',
          }}
        />
        
        {/* Google Reviews Widget - Above the fold for social proof */}
        <GoogleReviews />
        
        <PinkTaxiSection1 />
        <KashiTaxiIntro />
        <BikeRentalFlash />
        <CTASection />
      </main>
      {/* Mobile sticky CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white p-3 md:hidden">
        <div className="mx-auto flex max-w-4xl gap-3">
          <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-md bg-green-600 px-4 py-3 text-center font-medium text-white shadow hover:bg-green-700">WhatsApp</a>
          <a href={getCallTelHref()} className="flex-1 rounded-md bg-blue-600 px-4 py-3 text-center font-medium text-white shadow hover:bg-blue-700">Call</a>
        </div>
      </div>
      <Footer allPosts={allPosts} />
    </>
  );
}

export async function getStaticProps() {
  const { getAllPostsMeta } = await import('../lib/posts');
  const allPosts = getAllPostsMeta();
  return {
    props: {
      allPosts,
    },
  };
}
