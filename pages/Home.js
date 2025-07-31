import Head from "next/head";
import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";

export default function Home() {
  return (
    <>
      <Head>
        <title>Kashi Taxi | Best Outstation Taxi & Varanasi Travel Guides - 2025</title>
        <meta
          name="description"
          content="Book reliable outstation taxis and explore detailed Varanasi travel guides for 2025. Trusted by thousands of travelers."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <Hero />
    </>
  );
}
