// /pages/[lang]/[slug].js

import Head from 'next/head';
import { getPostData, getAllPostPaths, getJsonLdData } from '../../lib/posts';

// Import your page components
import NavBar from '../../components/NavBar/NavBar';
import Header from '../../components/Header/Header';
import ArticleSection from '../../components/ArticleSection/ArticleSection';
import DynamicFooter from '../../components/DynamicFooter/DynamicFooter';
import Footer from '../../components/Footer/Footer';
// Import the new JsonLd component
import JsonLd from '../../components/JsonLd/JsonLd';

export default function Post({ postData, relatedPosts, jsonLdData }) {
  return (
    <>
      {/* The standard Head component for title, meta description, etc. */}
      <Head>
        <title>{postData.title}</title>
        <meta name="description" content={postData.description} />
      </Head>

      {/* Add your JSON-LD data here */}
      <JsonLd data={jsonLdData} />

      <NavBar />
      <main>
        <Header title={postData.title} featuredImage={postData.featuredImage} />
        <ArticleSection contentHtml={postData.contentHtml} />
      </main>
      <DynamicFooter relatedPosts={relatedPosts} />
      <Footer />
    </>
  );
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.lang, params.slug);
  const relatedPosts = []; // Fetch related posts logic here
  const jsonLdData = getJsonLdData(params.lang, params.slug);

  return {
    props: {
      postData,
      relatedPosts,
      jsonLdData, // Pass the JSON-LD data as a prop
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
