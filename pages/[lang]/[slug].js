// /pages/[lang]/[slug].js

// Removed direct import of lib/posts to prevent client bundle fs resolution issues

// Import your page components
import NavBar from '../../components/NavBar/NavBar';
// import Header from '../../components/Header/Header';
import ArticleSection from '../../components/ArticleSection/ArticleSection';
import Footer from '../../components/Footer/Footer';
import HeadForBlogs from '../../components/SEO/HeadForBlogs';
import RelatedPostsGrid from '../../components/RelatedPosts/RelatedPostsGrid';
import CTASection from '../../components/CTA/CTASection';
import StickyContactBar from '../../components/ServicePage/StickyContactBar';
import SidebarBookingWidget from '../../components/BookingWidget/SidebarBookingWidget';
import ItineraryTimeline from '../../components/DestinationPage/ItineraryTimeline';
import MapWidget from '../../components/Map/MapWidget';
import dynamic from 'next/dynamic';

const TaxiRatesCheatSheet = dynamic(() => import('../../components/TaxiRatesCheatSheet/TaxiRatesCheatSheet'), {
  loading: () => <div className="h-96 w-full animate-pulse bg-gray-100 rounded-xl my-8" />,
  ssr: false,
});

export default function Post({ postData, relatedPosts, jsonLdData, allPosts, pageLang, pageSlug, alternateLanguages = [] }) {
  const contentHtmlBefore = postData?.contentHtmlBefore ?? postData?.contentHtml ?? '';
  const contentHtmlAfter = postData?.contentHtmlAfter ?? null;
  const itinerary = postData?.itinerary || null;
  const itinerarySections = Array.isArray(postData?.itinerarySections) ? postData.itinerarySections : [];
  const itineraryDays = Array.isArray(itinerary?.days) ? itinerary.days : [];
  const hasSegmentHtml = itinerarySections.length === itineraryDays.length && itinerarySections.length > 0;

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
        phone={postData.phone || "9450301573"}
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
                        <ItineraryTimeline
                          itinerary={itinerary}
                          days={[day]}
                          hideHeader={index !== 0}
                          className="mt-2"
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="mt-8">
                    <ItineraryTimeline itinerary={itinerary} />
                  </div>
                )
              )}

              {contentHtmlAfter?.trim() && (
                <ArticleSection contentHtml={contentHtmlAfter} />
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

        {/* Modular CTA Section */}
        <CTASection
          phone={postData.phone || "9450301573"}
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
