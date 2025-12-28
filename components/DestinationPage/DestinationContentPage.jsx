import Head from 'next/head';
import NavBar from '@/components/NavBar/NavBar';
import Footer from '@/components/Footer/Footer';
import ArticleSection from '@/components/ArticleSection/ArticleSection';
import ItineraryTimeline from '@/components/DestinationPage/ItineraryTimeline';
import CTASection from '@/components/CTA/CTASection';
import StickyContactBar from '@/components/ServicePage/StickyContactBar';
import SidebarBookingWidget from '@/components/BookingWidget/SidebarBookingWidget';
import HreflangTags from '@/components/SEO/HreflangTags';
import MapWidget from '@/components/Map/MapWidget';

const DEFAULT_SITE_BASE = 'https://www.kashitaxi.in';
const DEFAULT_PHONE = '9935474730';

const CATEGORY_TITLE_MAP = {
  'tour-packages': 'Tour Package',
  taxi: 'Taxi Service',
  sightseeing: 'Sightseeing Guide',
  'travel-guide': 'Travel Guide',
};

const toAbsoluteUrl = (url, siteBase = DEFAULT_SITE_BASE) => {
  if (!url) {
    return `${siteBase}https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/varanasi-hero.png`;
  }
  return url.startsWith('http') ? url : `${siteBase}${url}`;
};

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
