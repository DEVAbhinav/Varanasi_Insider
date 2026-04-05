import Head from 'next/head';
import NavBar from '@/components/NavBar/NavBar';
import Footer from '@/components/Footer/Footer';
import ArticleSection from '@/components/ArticleSection/ArticleSection';
import ContentEnhancements from '@/components/ArticleSection/ContentEnhancements';
import ItineraryTimeline from '@/components/DestinationPage/ItineraryTimeline';
import CTASection from '@/components/CTA/CTASection';
import StickyContactBar from '@/components/ServicePage/StickyContactBar';
import SidebarBookingWidget from '@/components/BookingWidget/SidebarBookingWidget';
import HreflangTags from '@/components/SEO/HreflangTags';
import MapWidget from '@/components/Map/MapWidget';
import { CONTACT, getCallTelHref, getWhatsAppUrl } from '@/lib/contact';

const DEFAULT_SITE_BASE = 'https://www.kashitaxi.in';
const DEFAULT_PHONE = CONTACT.callNumberRaw;

const CATEGORY_TITLE_MAP = {
  'tour-packages': 'Tour Package',
  taxi: 'Taxi Service',
  sightseeing: 'Sightseeing Guide',
  'travel-guide': 'Travel Guide',
};

const toAbsoluteUrl = (url, siteBase = DEFAULT_SITE_BASE) => {
  if (!url) {
    return 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png';
  }
  return url.startsWith('http') ? url : `${siteBase}${url}`;
};

const stripHtml = (html = '') => (
  String(html || '')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
);

const countWords = (text = '') => (
  stripHtml(text).match(/\b[\p{L}\p{N}][\p{L}\p{N}'-]*\b/gu)?.length || 0
);

function ThinTaxiSupportSection({ entry, lang = 'en' }) {
  const haystack = `${entry?.title || ''} ${entry?.slug || ''} ${entry?.destination || ''}`.toLowerCase();
  const localizedLang = lang || entry?.lang || 'en';
  const isAirportRoute = haystack.includes('airport') || haystack.includes('vns') || haystack.includes('babatpur');
  const isRailRoute = /station|junction|cantt|rail/.test(haystack);
  const isCampusRoute = /bhu|campus|hostel|hospital/.test(haystack);
  const isTempleRoute = /ghat|temple|godowlia|assi|dashashwamedh|manikarnika|sarnath|vishwanath/.test(haystack);

  const routeUseCase = isAirportRoute
    ? 'airport arrivals where flight delay, baggage, pickup zone and wait-time clarity matter more than just the kilometre count'
    : isRailRoute
      ? 'station pickups where platform exit, luggage handling and meeting point clarity matter more than a generic city-cab quote'
      : isCampusRoute
        ? 'quick campus-area pickups where gate access, hostel landmarks and short-hop pricing clarity matter most'
        : isTempleRoute
          ? 'old-city temple and ghat transfers where barricades, walking lanes and the final drop point matter more than raw distance'
          : 'city-to-city or point-to-point taxi planning where timing, vehicle fit and fare inclusions need to be clear before you book';

  const pickupNotes = isAirportRoute
    ? [
        'Share airline, flight number and landing time so the driver tracks delays before entering the pickup lane.',
        'Mention checked bags, prams or wheelchairs early. That changes vehicle choice faster than the headcount alone.',
        'If elders are travelling, ask for the least-walking pickup point and buffer 15 to 20 minutes after touchdown.',
      ]
    : isRailRoute
      ? [
          'Confirm the station name and side of exit. Varanasi has multiple railheads and passengers often say “station” without the exact one.',
          'Send coach number or expected platform if you have it; it helps the driver estimate the exit gate and waiting time.',
          'For late-night arrivals, ask the driver to stay reachable on WhatsApp because the final platform announcement can change.',
        ]
      : [
          'Pin the exact pickup landmark, not just the area name, because lanes around ghats, campuses and bazaars often have vehicle restrictions.',
          'If your stop is inside a walking-only zone, ask where the last legal drop point will be and how much walking remains.',
          'When the group has seniors, children or puja material, tell dispatch before the ride is assigned so the driver plans the easier approach.',
        ];

  const internalLinks = [
    { href: `/${localizedLang}/tempo-traveller-rates-varanasi`, label: 'Tempo Traveller Rates' },
    { href: `/${localizedLang}/packages`, label: 'Pilgrimage Packages' },
    { href: `/${localizedLang}/city/varanasi/sightseeing/varanasi-local-sightseeing-package`, label: 'Varanasi Local Sightseeing' },
  ];

  const whatsappText = isAirportRoute
    ? `Need ${entry?.title || 'airport transfer'} on DATE. Flight number: ____. Pax: ____. Bags: ____.`
    : `Need ${entry?.title || 'taxi'} on DATE. Pickup: ____. Drop: ____. Pax: ____. Bags: ____.`;

  return (
    <section className="mt-10 rounded-3xl border border-cyan-100 bg-cyan-50/70 p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-slate-900">More Booking Detail for This Taxi Page</h2>
      <p className="mt-3 text-slate-700">
        Use this page for {routeUseCase}. The goal is not just to know the distance. It is to remove the small operational mistakes that create stress on
        arrival day: wrong meeting point, wrong vehicle size, hidden waiting assumptions, or confusion about the last drivable point.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">What To Confirm Before You Book</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            {pickupNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
            <li>Ask whether the quoted amount is one-way, round-trip, or tied to a package minimum.</li>
            <li>Confirm whether parking, tolls, barricade diversions, and extra waiting are already built into the quote.</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Vehicle Fit Guide</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead>
                <tr className="border-b border-slate-200 text-slate-900">
                  <th className="py-2 pr-4 font-semibold">Vehicle</th>
                  <th className="py-2 pr-4 font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium">Sedan</td>
                  <td className="py-2 pr-4">1 to 3 travellers with moderate luggage and a straightforward point-to-point transfer.</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium">SUV / MUV</td>
                  <td className="py-2 pr-4">Families, elders, or anyone who needs easier entry, extra luggage room, or a smoother long run.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Tempo Traveller</td>
                  <td className="py-2 pr-4">Group pilgrimages, multi-stop darshan plans, or airport and station pickups where one vehicle is better than multiple cabs.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Best WhatsApp Message To Send</h3>
        <p className="mt-2 text-sm text-slate-700">
          A complete first message gets you a better quote faster than back-and-forth haggling. Use this format:
        </p>
        <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-900 p-4 text-sm text-slate-100">
{whatsappText}
        </pre>
        <p className="mt-3 text-sm text-slate-700">
          Need a different option after reading this page? Check{' '}
          {internalLinks.map((link, index) => (
            <span key={link.href}>
              {index > 0 ? ' · ' : ''}
              <a href={link.href} className="font-semibold text-cyan-700 hover:text-cyan-900 hover:underline">
                {link.label}
              </a>
            </span>
          ))}
          .
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={getCallTelHref(CONTACT.callNumberRaw)}
          className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Call {CONTACT.callNumberDisplay}
        </a>
        <a
          href={getWhatsAppUrl(whatsappText)}
          className="rounded-full border border-cyan-300 bg-white px-5 py-3 text-sm font-semibold text-cyan-800 transition hover:border-cyan-500 hover:text-cyan-900"
        >
          WhatsApp Booking Format
        </a>
      </div>
    </section>
  );
}

export default function DestinationContentPage({ entry, category, allPosts, pageLang = 'en', hreflangAlternates = [] }) {
  if (!entry) {
    return null;
  }

  const pageCategory = category || entry.category;
  const siteBase = entry.siteBase || DEFAULT_SITE_BASE;
  const langForPage = entry.lang || pageLang || 'en';
  const slugPath = `/city/${entry.destination}/${pageCategory}/${entry.slug}`;
  const localizedPath = entry.localizedPath || `/${langForPage}${slugPath}`;
  const canonicalUrl = entry.canonicalUrl || `${siteBase}${localizedPath}`;
  // Prefer metaTitle/metaDescription for SERP; fall back to title/description
  const title = entry.metaTitle || entry.title || 'Kashi Taxi | Travel Agent Varanasi';
  const description = entry.metaDescription || entry.description || '';
  const keywords = Array.isArray(entry.keywords)
    ? entry.keywords.join(', ')
    : entry.keywords;
  const published = entry.date || undefined;
  const modified = entry.lastUpdated || entry.date || undefined;
  const ogType = pageCategory === 'travel-guide' ? 'article' : 'website';
  const ogImage = toAbsoluteUrl(entry.featuredImage, siteBase);
  const phoneNumber = entry.phone || DEFAULT_PHONE;
  const headerEyebrow = entry.eyebrow || CATEGORY_TITLE_MAP[pageCategory] || 'Destination Insight';
  const breadcrumbs = Array.isArray(entry.breadcrumbs) ? entry.breadcrumbs : [];

  const breadcrumbJsonLd = breadcrumbs.length >= 2
    ? {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumbs`,
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.item || canonicalUrl,
      })),
    }
    : null;

  // FAQ schema is already injected via entry.jsonLd (built in lib/destinationContent)
  // Avoid duplicating a separate FAQPage script tag here to prevent duplicate structured data warnings.

  const itinerary = entry.itinerary;
  const itinerarySections = Array.isArray(entry.itinerarySections) ? entry.itinerarySections : [];
  const contentHtmlBefore = entry.contentHtmlBefore ?? entry.contentHtml;
  const contentHtmlAfter = entry.contentHtmlAfter;
  const contentWordCount = countWords(`${contentHtmlBefore || ''} ${contentHtmlAfter || ''}`);
  const fullHtml = (contentHtmlBefore || '') + (contentHtmlAfter || '');
  const shouldShowTaxiSupport = pageCategory === 'taxi' && contentWordCount < 500;

  const itineraryDays = Array.isArray(itinerary?.days) ? itinerary.days : [];
  const hasSegmentHtml = itinerarySections.length === itineraryDays.length && itinerarySections.length > 0;

  return (
    <>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <HreflangTags pageLang={langForPage} canonical={canonicalUrl} alternates={hreflangAlternates} />
        <meta property="og:title" content={title} />
        {description && <meta property="og:description" content={description} />}
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="Kashi Taxi" />
        {published && <meta property="article:published_time" content={published} />}
        {modified && <meta property="article:modified_time" content={modified} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        {description && <meta name="twitter:description" content={description} />}
        <meta name="twitter:image" content={ogImage} />
        {entry.jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(entry.jsonLd) }}
          />
        )}
        {breadcrumbJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
          />
        )}
      </Head>

      <NavBar />
      <StickyContactBar phone={phoneNumber} />

      <main>
        <header className="bg-gray-50 py-8">
          <div className="container mx-auto px-4 text-center lg:text-left">
            {headerEyebrow && (
              <p className="text-sm font-semibold uppercase tracking-wide text-pink-600">
                {headerEyebrow}
              </p>
            )}
            <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              {entry.heading || title}
            </h1>
            {description && (
              <p className="mt-4 max-w-2xl text-base text-gray-600">
                {description}
              </p>
            )}
            {breadcrumbs.length > 0 && (
              <nav
                className="mt-4 flex flex-wrap items-center justify-center gap-1 text-xs text-gray-500 sm:text-sm lg:justify-start"
                aria-label="Breadcrumb"
              >
                {breadcrumbs.map((crumb, index) => (
                  <span key={`${crumb.item || index}-${crumb.name}`} className="flex items-center">
                    {index > 0 && <span className="mx-2 text-gray-300">›</span>}
                    {crumb.item ? (
                      <a href={crumb.item} className="text-gray-600 transition hover:text-pink-600 hover:underline">
                        {crumb.name}
                      </a>
                    ) : (
                      <span>{crumb.name}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}
          </div>
        </header>

        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <article className="lg:col-span-8">
              {contentHtmlBefore && contentHtmlBefore.trim() && (
                <ArticleSection contentHtml={contentHtmlBefore} />
              )}

              {/* Quick Facts + Table of Contents */}
              <ContentEnhancements.Inline html={fullHtml} quickFacts={entry?.quickFacts} />

              {hasSegmentHtml ? (
                itineraryDays.map((day, index) => {
                  const sectionHtml = itinerarySections[index]?.html;
                  return (
                    <div key={`${day?.label || index}-section`} className={index === 0 ? 'mt-8 space-y-6' : 'mt-10 space-y-6'}>
                      {sectionHtml && sectionHtml.trim() && (
                        <ArticleSection contentHtml={sectionHtml} />
                      )}
                      <ItineraryTimeline
                        itinerary={itinerary}
                        days={[day]}
                        hideHeader={index !== 0}
                        className={index === 0 ? 'mt-2' : 'mt-2'}
                      />
                    </div>
                  );
                })
              ) : (
                <ItineraryTimeline itinerary={itinerary} />
              )}

              {contentHtmlAfter && contentHtmlAfter.trim() && (
                <ArticleSection contentHtml={contentHtmlAfter} />
              )}

              {shouldShowTaxiSupport && (
                <ThinTaxiSupportSection entry={entry} lang={langForPage} />
              )}

              {/* Map Section */}
              {(entry?.mapUrl || entry?.location?.placeId || entry?.location?.mapLink || entry?.location?.name) && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900">Location</h2>
                  <MapWidget
                    src={entry?.mapUrl || entry?.location?.mapLink}
                    placeId={entry?.location?.placeId}
                    query={entry?.location?.name || entry?.title}
                    title={`Map of ${entry?.title}`}
                  />
                </div>
              )}
            </article>
            <aside className="lg:col-span-4">
              <div className="hidden lg:block">
                <SidebarBookingWidget
                  pageTitle={title}
                  pageUrl={localizedPath}
                />
              </div>
            </aside>
          </div>
        </div>

        <div className="lg:hidden">
          <SidebarBookingWidget
            pageTitle={title}
            pageUrl={localizedPath}
          />
        </div>

        {/* Interactive FAQ Accordion */}
        <ContentEnhancements.Bottom html={fullHtml} faqSchema={entry?.faqSchema} />

        <CTASection
          phone={phoneNumber}
          title={entry.ctaTitle || 'Need help finalising your itinerary?'}
          subtitle={entry.ctaSubtitle || 'Our concierge desk can match the right fleet, timing, and guide support for your group.'}
          variant={entry.ctaVariant || 'default'}
        />
      </main>

      <Footer allPosts={allPosts} />
    </>
  );
}
