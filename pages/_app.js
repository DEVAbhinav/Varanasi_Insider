// /pages/_app.js
import Script from 'next/script';
import Head from 'next/head';
import { useRouter } from 'next/router';

// 1. Import your global stylesheet
import '../styles/globals.css';

// 2. Import any component CSS that needs to be global (if any)
// For example, if you decide one component's styles must be global.
// import '../components/SomeComponent/SomeComponent.module.css';

const CANONICAL = 'https://www.kashitaxi.in';

function MyApp({ Component, pageProps }) {
  const { asPath } = useRouter();
  const url = `${CANONICAL}${asPath.split('#')[0]}`;
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.jpeg" />
        <link rel="canonical" href={url} />
      </Head>
      <Script
        id="google-fonts"
        src="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap"
        strategy="lazyOnload"
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
