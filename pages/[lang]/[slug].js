// /pages/[lang]/[slug].js

import Head from 'next/head';
import { getPostData, getAllPostPaths, getJsonLdData } from '../../lib/posts';

// Import your page components
import NavBar from '../../components/NavBar/NavBar';
import Header from '../../components/Header/Header';
import ArticleSection from '../../components/ArticleSection/ArticleSection';
import DynamicFooter from '../../components/DynamicFooter/DynamicFooter';
import Footer from '../../components/Footer/Footer';

export default function Post({ postData, relatedPosts, jsonLdData, allPosts }) {
  return (
    <>
      {/* The standard Head component for title, meta description, etc. */}
      <Head>
        <title>{postData.title}</title>
        <meta name="description" content={postData.description} />
        {/* Add your JSON-LD data here */}
        {jsonLdData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
          />
        )}
      </Head>

      <NavBar />
      <main>
        <Header title={postData.title} featuredImage={postData.featuredImage} />
        <ArticleSection contentHtml={postData.contentHtml} />
      </main>
      <DynamicFooter relatedPosts={relatedPosts} />
      <Footer allPosts={allPosts} />
    </>
  );
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.lang, params.slug);
  const relatedPosts = []; // Fetch related posts logic here
  const jsonLdData = getJsonLdData(params.lang, params.slug);
  // Add a new prop with links to all posts
  const allPosts = getAllPostPaths();
  return {
    props: {
      postData,
      relatedPosts,
      jsonLdData,
      allPosts, // new prop for Footer links
    },
  };
}

export async function getStaticPaths() {
  const paths = getAllPostPaths();
  return {
    paths,
    fallback: false,
  };
}
