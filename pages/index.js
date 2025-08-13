// This is the main landing page for the entire site.
import NavBar from '../components/NavBar/NavBar';
import HeroSection from '../components/HeroSection/HeroSection';
import Footer from '../components/Footer/Footer';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import JsonLd from '../components/JsonLd/JsonLd';
import getHomeSchema from '../components/JsonLd/homepageSchema';

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
  loading: () => <SectionSkeleton title="Kashi Taxi Intro" />,
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
        <title>Kashi Taxi – 24×7 Varanasi Taxi Service (Airport, Local & Outstation)</title>
        <meta
          name="description"
          content="24×7 Varanasi taxi for airport, local darshan & outstation. Clean AC cars, polite drivers, transparent fares. WhatsApp +91-99354-74730 | Call +91-94503-01573."
        />
        <meta name="keywords" content="Varanasi taxi, Kashi taxi, airport pickup, local darshan, outstation taxi in varanasi, Kashi taxi outstation" />
        <meta name="author" content="Vinayak Travels" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Kashi Taxi – 24×7 Varanasi Taxi Service (Airport, Local & Outstation)" />
        <meta property="og:description" content="24×7 Varanasi taxi for airport, local darshan & outstation. Clean AC cars, polite drivers, transparent fares." />
        <meta property="og:image" content="https://www.kashitaxi.in/images/varanasi-hero.png" />
        <meta property="og:url" content="https://www.kashitaxi.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Kashi Taxi" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Varanasi" />
        <meta name="geo.position" content="25.3176;82.9739" />
        <meta name="ICBM" content="25.3176, 82.9739" />
      </Head>
      <JsonLd data={structuredData} />
      <NavBar />
      <main className="pb-24 md:pb-0">
        {/* Keep above-the-fold lean: Hero first */}
        <HeroSection />
        {/* Code-split sections below */}
        <PinkTaxiSection1 />
        <KashiTaxiIntro />
        <BikeRentalFlash />
        <CTASection />
      </main>
      {/* Mobile sticky CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white p-3 md:hidden">
        <div className="mx-auto flex max-w-4xl gap-3">
          <a href="https://wa.me/919935474730" target="_blank" rel="noopener noreferrer" className="flex-1 rounded-md bg-green-600 px-4 py-3 text-center font-medium text-white shadow hover:bg-green-700">WhatsApp</a>
          <a href="tel:+919450301573" className="flex-1 rounded-md bg-blue-600 px-4 py-3 text-center font-medium text-white shadow hover:bg-blue-700">Call</a>
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
