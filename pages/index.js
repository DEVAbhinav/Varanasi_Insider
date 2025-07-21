// This is the main landing page for the entire site.
import NavBar from '../components/NavBar/NavBar';
import HeroSection from '../components/HeroSection/HeroSection';
import WhyUs from '../components/WhyUs/WhyUs';
import PopularPackages from '../components/PopularPackages/PopularPackages';
import CTASection from '../components/CTASection/CTASection';
import Footer from '../components/Footer/Footer';
import Head from 'next/head';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Banaras Insider - Trusted Taxi Service & Travel Guides</title>
        <meta name="description" content="Your trusted partner for taxi services in Varanasi. Airport pickups, local sightseeing, and outstation tours combined with in-depth travel guides." />
      </Head>
      <NavBar />
      <main>
        <HeroSection />
        <WhyUs />
        <PopularPackages />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
