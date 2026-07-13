// /pages/_app.js
import { useEffect, useRef } from 'react';
import Script from 'next/script';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Lora, Source_Sans_3 } from 'next/font/google';
import dynamic from 'next/dynamic';
const MobileLeadPopup = dynamic(() => import('../components/MobileLeadPopup/MobileLeadPopup'), { ssr: false });
const ExitIntentPopup = dynamic(() => import('../components/ExitIntentPopup/ExitIntentPopup'), { ssr: false });
import { SOCIAL_PROFILE_URLS } from '../config/socials';
import * as gtag from '../lib/gtag';

import { generateOrganizationSchema } from '../lib/schemaGenerator';

// 1. Import your global stylesheet
import '../styles/globals.css';

// 2. Import any component CSS that needs to be global (if any)
// For example, if you decide one component's styles must be global.
// import '../components/SomeComponent/SomeComponent.module.css';

const ORGANIZATION_JSON_LD = generateOrganizationSchema();

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-sans',
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { asPath } = router;
  const scrollDepthsTracked = useRef(new Set());

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
      // Reset scroll tracking on route change
      scrollDepthsTracked.current.clear();
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // Scroll Tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollPercent = Math.round((scrollTop / (docHeight - winHeight)) * 100);

      const milestones = [25, 50, 75, 90];

      milestones.forEach((milestone) => {
        if (scrollPercent >= milestone && !scrollDepthsTracked.current.has(milestone)) {
          scrollDepthsTracked.current.add(milestone);
          gtag.event({
            action: 'scroll_depth',
            category: 'Engagement',
            label: `${milestone}%`,
            value: milestone,
            non_interaction: true,
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [asPath]); // Re-bind on path change to ensure context is fresh if needed

  // Global Click Tracking (Heatmap proxy)
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest('a, button');
      if (!target) return;

      // Don't track if it's internal React stuff that might cause issues, keep it simple
      const elementText = target.innerText?.slice(0, 50) || target.ariaLabel || 'unknown';
      const elementId = target.id || 'no-id';
      const elementClass = target.className || 'no-class';
      const destination = target.href || 'n/a';
      const tagName = target.tagName.toLowerCase();

      gtag.event({
        action: 'click',
        category: 'UI Interaction',
        label: `${tagName}: ${elementText}`,
        element_text: elementText,
        element_id: elementId,
        element_class: typeof elementClass === 'string' ? elementClass.slice(0, 50) : 'n/a',
        destination_url: destination,
        page_location: window.location.href,
      });

      // High-signal conversion events: WhatsApp / phone-call intent.
      // Fired in addition to the generic click so we can attribute leads to the exact page.
      const href = typeof destination === 'string' ? destination : '';
      if (href.includes('wa.me') || href.includes('api.whatsapp.com') || href.startsWith('whatsapp:')) {
        gtag.event({
          action: 'whatsapp_click',
          category: 'Conversion',
          label: window.location.pathname,
          element_text: elementText,
          destination_url: href,
          page_location: window.location.href,
        });
      } else if (href.startsWith('tel:')) {
        gtag.event({
          action: 'call_click',
          category: 'Conversion',
          label: window.location.pathname,
          element_text: elementText,
          destination_url: href,
          page_location: window.location.href,
        });
      }
    };

    window.addEventListener('click', handleClick, { passive: true });
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // Set HTML lang attribute dynamically based on URL
  useEffect(() => {
    const pathLang = asPath.split('/')[1];
    const lang = pathLang === 'hi' ? 'hi' : 'en';
    document.documentElement.lang = lang;
  }, [asPath]);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.jpeg" />
      </Head>
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
      />
      {gtag.GA_MEASUREMENT_ID && (
        <>
          <Script
            id="ga-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gtag.GA_MEASUREMENT_ID}', {
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
      <div className={`${lora.variable} ${sourceSans.variable} font-sans`}>
        <Component {...pageProps} />
      </div>
      <MobileLeadPopup delay={30000} />
      <ExitIntentPopup />
    </>
  );
}

export default MyApp;
