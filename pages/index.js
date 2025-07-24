// This is the main landing page for the entire site.
import NavBar from '../components/NavBar/NavBar';
import HeroSection from '../components/HeroSection/HeroSection';
import WhyUs from '../components/WhyUs/WhyUs';
import PopularPackages from '../components/PopularPackages/PopularPackages';
import CTASection from '../components/CTASection/CTASection';
import Footer from '../components/Footer/Footer';
import Head from 'next/head';
import PinkTaxiSection from '../components/PinkTaxiSection/PinkTaxiSection';
import { getSortedPostsData } from '../lib/posts';

export default function HomePage({ allPosts }) {
  return (
    <>
      <Head>
        <title>Banaras Insider - Trusted Taxi Service & Travel Guides</title>
        <meta name="description" content="Your trusted partner for taxi services in Varanasi. Airport pickups, local sightseeing, and outstation tours combined with in-depth travel guides." />
      </Head>
      <NavBar />
      <main>
        <HeroSection />
        <PinkTaxiSection />
        <WhyUs />
        <PopularPackages />
        <CTASection />
      </main>
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
