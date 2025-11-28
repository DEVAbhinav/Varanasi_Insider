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

export default function Post({ postData, relatedPosts, jsonLdData, allPosts, pageLang, pageSlug, alternateLanguages = [] }) {
  const contentHtmlBefore = postData?.contentHtmlBefore ?? postData?.contentHtml ?? '';
  const contentHtmlAfter = postData?.contentHtmlAfter ?? null;
  const itinerary = postData?.itinerary || null;
  const itinerarySections = Array.isArray(postData?.itinerarySections) ? postData.itinerarySections : [];
  const itineraryDays = Array.isArray(itinerary?.days) ? itinerary.days : [];
  const hasSegmentHtml = itinerarySections.length === itineraryDays.length && itinerarySections.length > 0;

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
              {contentHtmlBefore?.trim() && (
                <ArticleSection contentHtml={contentHtmlBefore} />
              )}

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
