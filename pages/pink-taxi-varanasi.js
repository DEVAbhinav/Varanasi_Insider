// pages/pink-taxi-varanasi.js
import Head from 'next/head';
import NavBar from '../components/NavBar/NavBar';
import Footer from '../components/Footer/Footer';
import PinkHero from '../components/Pink/PinkHero';
import KeyBenefits from '../components/Pink/KeyBenefits';
import FareEstimator from '../components/Pink/FareEstimator';
import TourPackages from '../components/Pink/TourPackages';
import SafetyBlock from '../components/Pink/SafetyBlock';

export default function PinkPage() {
  return (
    <>
      <Head>
        <title>Pink Taxi Service - Safe Cabs for Women in Varanasi by Vinayak Travels</title>
        <meta name="description" content="Vinayak Travels introduces Pink Taxi, a dedicated taxi service for women in Varanasi, ensuring safe and reliable travel with female drivers." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
      </Head>
      <NavBar />
      <main>
        <PinkHero />
        <KeyBenefits />
        <FareEstimator />
        <TourPackages />
        <SafetyBlock />
        {/* Placeholder for other sections */}
      </main>
      <Footer />
    </>
  );
}
