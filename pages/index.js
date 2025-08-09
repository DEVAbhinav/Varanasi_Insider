// This is the main landing page for the entire site.
import NavBar from '../components/NavBar/NavBar';
import HeroSection from '../components/HeroSection/HeroSection';
import CTASection from '../components/CTASection/CTASection';
import Footer from '../components/Footer/Footer';
import Head from 'next/head';
import PinkTaxiSection1 from '../components/PinkTaxiSection/PinkTaxiSection1';
import { getSortedPostsData } from '../lib/posts';
import BikeRentalFlash from '../components/BikeRentalFlash/BikeRentalFlash';
import JsonLd from '../components/JsonLd/JsonLd';
import getHomeSchema from '../components/JsonLd/homepageSchema';
import KashiTaxiIntro from '../components/KashiTaxiIntro/KashiTaxiIntro';

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
        <BikeRentalFlash />
        <HeroSection />
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
  const enPosts = getSortedPostsData('en').map(post => ({
    params: { lang: 'en', slug: post.slug, title: post.title || post.slug }
  }));
  const hiPosts = getSortedPostsData('hi').map(post => ({
    params: { lang: 'hi', slug: post.slug, title: post.title || post.slug }
  }));
  const allPosts = [...enPosts, ...hiPosts];
  return {
    props: {
      allPosts,
    },
  };
}
