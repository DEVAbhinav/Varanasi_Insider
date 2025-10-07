// pages/[lang]/services/[slug].js
import NavBar from '../../../components/NavBar/NavBar';
import Footer from '../../../components/Footer/Footer';
import HeadForBlogs from '../../../components/SEO/HeadForBlogs';
import ServiceHero from '../../../components/ServicePage/ServiceHero';
import ServiceContent from '../../../components/ServicePage/ServiceContent';
import StickyContactBar from '../../../components/ServicePage/StickyContactBar';
import CTASection from '../../../components/CTA/CTASection';

export default function ServicePage({ postData, jsonLdData, allPosts, pageLang, pageSlug }) {
  return (
    <>
      {/* SEO Head */}
      <HeadForBlogs 
        postData={postData} 
        pageLang={pageLang} 
        pageSlug={pageSlug} 
        jsonLdData={jsonLdData} 
      />

      <NavBar />
      
      {/* Sticky Contact Bar - Shows on Scroll */}
      <StickyContactBar 
        phone={postData.phone}
      />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section with CTA */}
        <ServiceHero 
          title={postData.title}
          subtitle={postData.subtitle}
          heroImage={postData.featuredImage || postData.heroImage}
          phone={postData.phone}
        />

        {/* Service Content */}
        <ServiceContent contentHtml={postData.contentHtml} />

        {/* Modular Bottom CTA Bar */}
        {postData.phone && (
          <CTASection 
            phone={postData.phone}
            title="Ready to book?"
            subtitle="Get instant confirmation and transparent pricing"
            variant="service"
          />
        )}
      </main>

      <Footer allPosts={allPosts} />
    </>
  );
}

export async function getStaticProps({ params }) {
  const { getPostData, getJsonLdData, getAllPostsMeta } = await import('../../../lib/posts');
  const fs = await import('fs');
  const path = await import('path');

  const lookupOrder = ['services', 'landing', 'guides'];
  let postData;
  let jsonLdData;

  for (const folder of lookupOrder) {
    const candidatePath = path.join(process.cwd(), 'content', params.lang, folder, `${params.slug}.md`);

    if (fs.existsSync(candidatePath)) {
      const scopedSlug = `${folder}/${params.slug}`;
      postData = await getPostData(params.lang, scopedSlug);
      jsonLdData = await getJsonLdData(params.lang, scopedSlug);
      break;
    }
  }

  if (!postData) {
    return { notFound: true };
  }

  const allPosts = getAllPostsMeta();

  return {
    props: {
      postData,
      jsonLdData,
      allPosts,
      pageLang: params.lang,
      pageSlug: params.slug,
    },
  };
}

export async function getStaticPaths() {
  const fs = await import('fs');
  const path = await import('path');
  
  const contentDir = path.join(process.cwd(), 'content');
  const paths = [];
  
  // Get all service/landing/guide pages
  const folders = ['services', 'landing', 'guides'];
  const langs = ['en', 'hi'];
  
  for (const lang of langs) {
    for (const folder of folders) {
      const folderPath = path.join(contentDir, lang, folder);
      
      if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath);
        
        files
          .filter(file => file.endsWith('.md'))
          .forEach(file => {
            paths.push({
              params: {
                lang,
                slug: file.replace(/\.md$/, ''),
              },
            });
          });
      }
    }
  }
  
  return {
    paths,
    fallback: false,
  };
}
