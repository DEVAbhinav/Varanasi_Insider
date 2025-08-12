// /pages/[lang]/[slug].js

// Removed direct import of lib/posts to prevent client bundle fs resolution issues

// Import your page components
import NavBar from '../../components/NavBar/NavBar';
import Header from '../../components/Header/Header';
import ArticleSection from '../../components/ArticleSection/ArticleSection';
import Footer from '../../components/Footer/Footer';
import HeadForBlogs from '../../components/SEO/HeadForBlogs';
import RelatedPostsGrid from '../../components/RelatedPosts/RelatedPostsGrid';

export default function Post({ postData, relatedPosts, jsonLdData, allPosts, pageLang, pageSlug }) {
  return (
    <>
      {/* Centralized SEO Head */}
      <HeadForBlogs postData={postData} pageLang={pageLang} pageSlug={pageSlug} jsonLdData={jsonLdData} />

      <NavBar />
      <main>
        <Header title={postData.title} featuredImage={postData.featuredImage} />
        <ArticleSection contentHtml={postData.contentHtml} />
        {/* Related posts grid */}
        <RelatedPostsGrid items={relatedPosts} lang={pageLang} />
      </main>
      <Footer allPosts={allPosts} />
    </>
  );
}

export async function getStaticProps({ params }) {
  const { getPostData, getJsonLdData, getRelatedPosts, getAllPostPaths } = await import('../../lib/posts');
  const postData = await getPostData(params.lang, params.slug);
  const jsonLdData = getJsonLdData(params.lang, params.slug);
  const relatedPosts = getRelatedPosts(params.lang, params.slug);

  // Add a new prop with links to all posts
  const allPosts = getAllPostPaths();
  return {
    props: {
      postData,
      relatedPosts,
      jsonLdData,
      allPosts, // new prop for Footer links
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
