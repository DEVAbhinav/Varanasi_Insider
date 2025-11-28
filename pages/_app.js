// /pages/_app.js
import { useEffect } from 'react';
import Script from 'next/script';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MobileLeadPopup from '../components/MobileLeadPopup/MobileLeadPopup';
import { SOCIAL_PROFILE_URLS } from '../config/socials';

import { generateOrganizationSchema } from '../lib/schemaGenerator';

// 1. Import your global stylesheet
import '../styles/globals.css';

// 2. Import any component CSS that needs to be global (if any)
// For example, if you decide one component's styles must be global.
// import '../components/SomeComponent/SomeComponent.module.css';

const CANONICAL = 'https://www.kashitaxi.in';
const DEFAULT_GA_ID = 'G-57P08K8G17';
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || DEFAULT_GA_ID;
const ORGANIZATION_JSON_LD = generateOrganizationSchema();

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { asPath } = router;
  const url = `${CANONICAL}${asPath.split('#')[0].split('?')[0]}`;

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return undefined;
    const handleRouteChange = (path) => {
      window.gtag?.('config', GA_MEASUREMENT_ID, {
        page_path: path,
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.jpeg" />
        <link rel="canonical" href={url} />
        <script
          id="organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
      </Head>
      <Script
        id="google-fonts"
        src="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap"
        strategy="lazyOnload"
      />
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            id="ga-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}
      {/* Ahrefs Analytics */}
      <Script
        id="ahrefs-analytics"
        src="https://analytics.ahrefs.com/analytics.js"
        data-key="cX0oTWGk+R3vy5vu+yxoCw"
        strategy="afterInteractive"
      />
      <Component {...pageProps} />
      <MobileLeadPopup delay={30000} />
    </>
  );
}

export default MyApp;
