// /pages/[lang]/[slug].js

// Removed direct import of lib/posts to prevent client bundle fs resolution issues

// Import your page components
import NavBar from '../../components/NavBar/NavBar';
// import Header from '../../components/Header/Header';
import ArticleSection from '../../components/ArticleSection/ArticleSection';
import ContentEnhancements from '../../components/ArticleSection/ContentEnhancements';
import Footer from '../../components/Footer/Footer';
import HeadForBlogs from '../../components/SEO/HeadForBlogs';
import RelatedPostsGrid from '../../components/RelatedPosts/RelatedPostsGrid';
import CTASection from '../../components/CTA/CTASection';
import StickyContactBar from '../../components/ServicePage/StickyContactBar';
import SidebarBookingWidget from '../../components/BookingWidget/SidebarBookingWidget';
import ItineraryTimeline from '../../components/DestinationPage/ItineraryTimeline';
import MapWidget from '../../components/Map/MapWidget';
import dynamic from 'next/dynamic';
import { CONTACT, getCallTelHref, getWhatsAppUrl } from '@/lib/contact';

const TaxiRatesCheatSheet = dynamic(() => import('../../components/TaxiRatesCheatSheet/TaxiRatesCheatSheet'), {
  loading: () => <div className="h-96 w-full animate-pulse bg-gray-100 rounded-xl my-8" />,
  ssr: false,
});

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

function ThinRouteSupportSection({ postData, pageLang = 'en', pageSlug = '' }) {
  const haystack = `${pageSlug} ${postData?.title || ''} ${(postData?.tags || []).join(' ')}`.toLowerCase();
  const isHindi = pageLang === 'hi';
  const isTransport = /tempo|traveller|taxi|airport|varanasi-to-|travel-from-|cab|route|fare|bus|train/.test(haystack);

  if (!isTransport) {
    return null;
  }

  const defaultLinks = [
    { href: `/${pageLang}/tempo-traveller-rates-varanasi`, label: isHindi ? 'Tempo Traveller Rates' : 'Tempo Traveller Rates' },
    { href: `/${pageLang}/packages`, label: isHindi ? 'Packages' : 'Packages' },
    { href: `/${pageLang}/city/varanasi/sightseeing/varanasi-local-sightseeing-package`, label: isHindi ? 'Local Sightseeing' : 'Local Sightseeing' },
  ];

  const whatsappText = isHindi
    ? `${postData?.title || 'Trip'} के लिए तारीख, यात्रियों की संख्या, पिकअप और ड्रॉप भेज रहा/रही हूं।`
    : `Need ${postData?.title || 'trip'} on DATE. Pickup: ____. Drop: ____. Pax: ____.`;

  return (
    <section className="mt-10 rounded-3xl border border-cyan-100 bg-cyan-50/70 p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-slate-900">
        {isHindi ? 'इस रूट पेज के लिए अतिरिक्त योजना विवरण' : 'More Planning Detail for This Route'}
      </h2>
      <p className="mt-3 text-slate-700">
        {isHindi
          ? 'यदि यह पेज छोटा है, तो भी बुकिंग निर्णय छोटा नहीं होना चाहिए। सही वाहन, सही पिकअप बिंदु, बैगेज, बुजुर्ग यात्री, और रूट की वास्तविकता पहले साफ होना जरूरी है।'
          : 'Even when a route page is short, the booking decision should not be. Confirm the real pickup point, vehicle fit, luggage, senior-traveller needs, and the actual route plan before you lock the trip.'}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            {isHindi ? 'बुकिंग से पहले क्या कन्फर्म करें' : 'What To Confirm Before Booking'}
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            {isHindi ? (
              <>
                <li>वन-वे, राउंड-ट्रिप या पैकेज बेसिस में कौन सा मॉडल लागू है, यह साफ करें।</li>
                <li>टोल, पार्किंग, ड्राइवर भत्ता और अतिरिक्त प्रतीक्षा पहले से पूछें।</li>
                <li>यदि बुजुर्ग, बच्चे या ज्यादा बैगेज हैं, तो वाहन श्रेणी उसी अनुसार चुनें।</li>
                <li>पिकअप लोकेशन केवल एरिया नाम से नहीं, सही landmark के साथ भेजें।</li>
              </>
            ) : (
              <>
                <li>Confirm whether the quote is one-way, round-trip, or tied to a package minimum.</li>
                <li>Ask about tolls, parking, driver allowance and extra waiting before paying advance.</li>
                <li>Choose the vehicle based on luggage and elderly passengers, not headcount alone.</li>
                <li>Send the real landmark, not just the area name, when the pickup is inside lanes or near campuses.</li>
              </>
            )}
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            {isHindi ? 'कौन सा वाहन कब बेहतर है' : 'Which Vehicle Usually Fits Best'}
          </h3>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead>
                <tr className="border-b border-slate-200 text-slate-900">
                  <th className="py-2 pr-4 font-semibold">{isHindi ? 'वाहन' : 'Vehicle'}</th>
                  <th className="py-2 pr-4 font-semibold">{isHindi ? 'उपयोग' : 'Best Use'}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium">{isHindi ? 'सेडान' : 'Sedan'}</td>
                  <td className="py-2 pr-4">{isHindi ? 'छोटे परिवार, कम बैगेज, सरल ट्रांसफर' : 'Small groups, moderate luggage, straightforward transfer'}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium">{isHindi ? 'SUV / MUV' : 'SUV / MUV'}</td>
                  <td className="py-2 pr-4">{isHindi ? 'परिवार, बुजुर्ग यात्री, ज्यादा आराम' : 'Families, elders, more luggage, easier entry-exit'}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">{isHindi ? 'Tempo Traveller' : 'Tempo Traveller'}</td>
                  <td className="py-2 pr-4">{isHindi ? 'ग्रुप यात्रा, बहु-स्टॉप दर्शन, एक वाहन में पूरी टोली' : 'Group travel, multi-stop darshan, one-vehicle coordination'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">
          {isHindi ? 'WhatsApp पर यह फॉर्मेट भेजें' : 'Best WhatsApp Message Format'}
        </h3>
        <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-900 p-4 text-sm text-slate-100">
{whatsappText}
        </pre>
        <p className="mt-3 text-sm text-slate-700">
          {isHindi ? 'और विकल्प चाहिए? देखें: ' : 'Need a better-fit page next? Check: '}
          {defaultLinks.map((link, index) => (
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
          {isHindi ? `कॉल करें ${CONTACT.callNumberDisplay}` : `Call ${CONTACT.callNumberDisplay}`}
        </a>
        <a
          href={getWhatsAppUrl(whatsappText)}
          className="rounded-full border border-cyan-300 bg-white px-5 py-3 text-sm font-semibold text-cyan-800 transition hover:border-cyan-500 hover:text-cyan-900"
        >
          {isHindi ? 'WhatsApp भेजें' : 'Open WhatsApp'}
        </a>
      </div>
    </section>
  );
}

export default function Post({ postData, relatedPosts, jsonLdData, allPosts, pageLang, pageSlug, alternateLanguages = [] }) {
  const contentHtmlBefore = postData?.contentHtmlBefore ?? postData?.contentHtml ?? '';
  const contentHtmlAfter = postData?.contentHtmlAfter ?? null;
  const itinerary = postData?.itinerary || null;
  const itinerarySections = Array.isArray(postData?.itinerarySections) ? postData.itinerarySections : [];
  const itineraryDays = Array.isArray(itinerary?.days) ? itinerary.days : [];
  const hasSegmentHtml = itinerarySections.length === itineraryDays.length && itinerarySections.length > 0;
  const routeWordCount = countWords(`${contentHtmlBefore || ''} ${contentHtmlAfter || ''}`);
  const shouldShowThinRouteSupport = routeWordCount < 450;

  const { part1, part2 } = (() => {
    if (postData?.showRatesCheatSheet === false || !contentHtmlBefore) return { part1: contentHtmlBefore, part2: null };

    // Try to split after 2nd paragraph for better flow, fallback to 1st
    const firstP = contentHtmlBefore.indexOf('</p>');
    if (firstP === -1) return { part1: contentHtmlBefore, part2: null };

    const secondP = contentHtmlBefore.indexOf('</p>', firstP + 4);
    const splitIndex = (secondP !== -1) ? secondP + 4 : firstP + 4;

    return {
      part1: contentHtmlBefore.substring(0, splitIndex),
      part2: contentHtmlBefore.substring(splitIndex)
    };
  })();

  return (
    <>
      {/* Centralized SEO Head */}
      <HeadForBlogs postData={postData} pageLang={pageLang} pageSlug={pageSlug} jsonLdData={jsonLdData} alternateLanguages={alternateLanguages} />

      <NavBar />

      {/* Sticky Contact Bar - Appears on Scroll */}
      <StickyContactBar
        phone={postData.phone || CONTACT.callNumberRaw}
      />

      <main>
        {/* <Header title={postData.title} featuredImage={postData.featuredImage} /> */}

        {/* Two-column layout: Article + Sidebar on desktop, stacked on mobile */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main article content - takes 8 columns on desktop */}
            <div className="lg:col-span-8">
              {/* Part 1: First Two Paragraphs */}
              {part1?.trim() && (
                <ArticleSection contentHtml={part1} />
              )}

              {/* Quick Facts + Table of Contents */}
              <ContentEnhancements.Inline
                html={(postData?.contentHtmlBefore ?? postData?.contentHtml ?? '') + (postData?.contentHtmlAfter ?? '')}
                quickFacts={postData?.quickFacts}
              />

              {/* Dynamic Injection: Taxi Rates Cheat Sheet */}
              {(postData?.showRatesCheatSheet !== false) && part2 && (
                <div className="mb-8 mt-4">
                  <TaxiRatesCheatSheet variant="compact" showCTA={true} />
                </div>
              )}

              {/* Part 2: Rest of Content */}
              {part2?.trim() && (
                <ArticleSection contentHtml={part2} />
              )}

              {/* Fallback: if no split was possible but flag is true, render at top (handled by part2 being null logic above? No. If part2 is null, we rendered part1 (full content). We should probably render cheat sheet at top if no p tag found but I'll stick to 'after first paragraph' or nothing for now to be safe, OR renders at top if no P tag? User said 'after first paragraph'. If no paragraph, likely not a standard article. I will fallback to top specific logic if needed, but current logic skips it if no </p>. 
              Actually, if pEnd is -1, part2 is null. So it won't render. 
              Let's adjust: if pEnd == -1, maybe render it at top? 
              The user specifically said "after first paragraph". If the content is weird/one-liner without p tag, maybe we shouldn't force it in middle.
              BUT, wait. I removed the old block. If I don't render it here, it won't show at all for pages without <p>.
              Most pages have <p>. I'll stick to this.
              */}

              {itineraryDays.length > 0 && (
                hasSegmentHtml ? (
                  itineraryDays.map((day, index) => {
                    const sectionHtml = itinerarySections[index]?.html;
                    return (
                      <div key={`${day?.label || index}-section`} className={index === 0 ? 'mt-8 space-y-6' : 'mt-10 space-y-6'}>
                        {sectionHtml?.trim() && (
                          <ArticleSection contentHtml={sectionHtml} />
                        )}
                        {/* Combined timeline visual removed based on user feedback */}
                      </div>
                    );
                  })
                ) : (
                  {/* Combined timeline visual removed based on user feedback */ }
                )
              )}

              {contentHtmlAfter?.trim() && (
                <ArticleSection contentHtml={contentHtmlAfter} />
              )}

              {shouldShowThinRouteSupport && (
                <ThinRouteSupportSection postData={postData} pageLang={pageLang} pageSlug={pageSlug} />
              )}

              {/* Map Section */}
              {(postData?.mapUrl || postData?.location?.placeId || postData?.location?.mapLink || postData?.location?.name) && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900">Location</h2>
                  <MapWidget
                    src={postData?.mapUrl || postData?.location?.mapLink}
                    placeId={postData?.location?.placeId}
                    query={postData?.location?.name || postData?.title}
                    title={`Map of ${postData?.title}`}
                  />
                </div>
              )}
            </div>

            {/* Sidebar booking widget - takes 4 columns on desktop, hidden on mobile initially */}
            <aside className="lg:col-span-4">
              <div className="hidden lg:block">
                <SidebarBookingWidget
                  pageTitle={postData.title}
                  pageUrl={`/${pageLang}/${pageSlug}`}
                />
              </div>
            </aside>
          </div>
        </div>

        {/* Mobile: Fixed bottom booking widget */}
        <div className="lg:hidden">
          <SidebarBookingWidget
            pageTitle={postData.title}
            pageUrl={`/${pageLang}/${pageSlug}`}
          />
        </div>

        {/* Interactive FAQ Accordion */}
        <ContentEnhancements.Bottom
          html={(postData?.contentHtmlBefore ?? postData?.contentHtml ?? '') + (postData?.contentHtmlAfter ?? '')}
          faqSchema={postData?.faqSchema}
        />

        {/* Modular CTA Section */}
        <CTASection
          phone={postData.phone || CONTACT.callNumberRaw}
          title="Need help planning your trip?"
          subtitle="Get personalized assistance for your Varanasi journey"
          variant="default"
        />

        {/* Related posts grid */}
        <RelatedPostsGrid items={relatedPosts} lang={pageLang} />
      </main>
      <Footer allPosts={allPosts} />
    </>
  );
}

export async function getStaticProps({ params }) {
  const { getPostData, getJsonLdData, getRelatedPosts, getAllPostsMeta } = await import('../../lib/posts');
  const { buildAlternateLanguageUrls } = await import('../../lib/hreflang');
  const postData = await getPostData(params.lang, params.slug);
  const jsonLdData = await getJsonLdData(params.lang, params.slug);
  const relatedPosts = getRelatedPosts(params.lang, params.slug);

  // Get organized post metadata for Footer
  const allPosts = getAllPostsMeta();
  const alternateLanguages = buildAlternateLanguageUrls({
    relativeFilePath: `${params.slug}.md`,
    routePath: params.slug,
    fallbackLangs: [params.lang],
  });
  return {
    props: {
      postData,
      relatedPosts,
      jsonLdData,
      allPosts, // now contains organized metadata
      pageLang: params.lang,
      pageSlug: params.slug,
      alternateLanguages,
    },
  };
}

export async function getStaticPaths() {
  const { getAllPostPaths } = await import('../../lib/posts');
  const paths = getAllPostPaths();
  return {
    paths,
    fallback: false,
  };
}
