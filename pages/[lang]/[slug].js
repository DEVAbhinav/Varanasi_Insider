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

export default function Post({ postData, relatedPosts, jsonLdData, allPosts, pageLang, pageSlug }) {
  return (
    <>
      {/* Centralized SEO Head */}
      <HeadForBlogs postData={postData} pageLang={pageLang} pageSlug={pageSlug} jsonLdData={jsonLdData} />

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
              <ArticleSection contentHtml={postData.contentHtml} />
            </div>
            
            {/* Sidebar booking widget - takes 4 columns on desktop, hidden on mobile initially */}
            <aside className="lg:col-span-4">
              <div className="hidden lg:block">
                <SidebarBookingWidget />
              </div>
            </aside>
          </div>
        </div>

        {/* Mobile: Fixed bottom booking widget */}
        <div className="lg:hidden">
          <SidebarBookingWidget />
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
  const postData = await getPostData(params.lang, params.slug);
  const jsonLdData = await getJsonLdData(params.lang, params.slug);
  const relatedPosts = getRelatedPosts(params.lang, params.slug);

  // Get organized post metadata for Footer
  const allPosts = getAllPostsMeta();
  return {
    props: {
      postData,
      relatedPosts,
      jsonLdData,
      allPosts, // now contains organized metadata
      pageLang: params.lang,
      pageSlug: params.slug,
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
