// pages/[lang]/services/[slug].js
import NavBar from '../../../components/NavBar/NavBar';
import Footer from '../../../components/Footer/Footer';
import HeadForBlogs from '../../../components/SEO/HeadForBlogs';
import ServiceHero from '../../../components/ServicePage/ServiceHero';
import ServiceContent from '../../../components/ServicePage/ServiceContent';
import StickyContactBar from '../../../components/ServicePage/StickyContactBar';
import CTASection from '../../../components/CTA/CTASection';

export default function ServicePage({ postData, jsonLdData, allPosts, pageLang, pageSlug, alternateLanguages = [] }) {
  return (
    <>
      {/* SEO Head */}
      <HeadForBlogs
        postData={postData}
        pageLang={pageLang}
        pageSlug={`services/${pageSlug}`}
        jsonLdData={jsonLdData}
        alternateLanguages={alternateLanguages}
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
        <ServiceContent
          contentHtml={postData.contentHtml}
          pageTitle={postData.title}
          pageUrl={`/${pageLang}/services/${pageSlug}`}
        />

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
  const { buildAlternateLanguageUrls } = await import('../../../lib/hreflang');
  const { generateServiceSchema, generateFAQSchema, generateBreadcrumbSchema, generateArticleSchema } = await import('../../../lib/schemaGenerator');
  const fs = await import('fs');
  const path = await import('path');

  const lookupOrder = ['services', 'landing', 'guides'];
  let postData;
  let jsonLdData;
  let sourceFolder = null;

  for (const folder of lookupOrder) {
    const candidatePath = path.join(process.cwd(), 'content', params.lang, folder, `${params.slug}.md`);

    if (fs.existsSync(candidatePath)) {
      const scopedSlug = `${folder}/${params.slug}`;
      postData = await getPostData(params.lang, scopedSlug);
      // We still fetch existing JSON-LD for backward compatibility or manual overrides
      const existingJsonLd = await getJsonLdData(params.lang, scopedSlug);
      jsonLdData = existingJsonLd || { '@context': 'https://schema.org', '@graph': [] };
      sourceFolder = folder;
      break;
    }
  }

  if (!postData) {
    return { notFound: true };
  }

  // --- Dynamic Schema Generation ---
  const siteUrl = 'https://www.kashitaxi.in';
  const pageUrl = `${siteUrl}/${params.lang}/services/${params.slug}`;

  // 1. Breadcrumbs
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: `/${params.lang}/services/` },
    { name: postData.title, url: pageUrl }
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  jsonLdData['@graph'].push(breadcrumbSchema);

  // 2. Service Schema (if applicable)
  if (postData.schemaType === 'Service' || postData.offers) {
    const serviceSchema = generateServiceSchema({
      title: postData.title,
      description: postData.description,
      url: pageUrl,
      image: postData.featuredImage,
      offers: postData.offers,
      provider: postData.provider, // Optional override from frontmatter
      areaServed: postData.areaServed // Optional override
    });
    jsonLdData['@graph'].push(serviceSchema);
  }

  // 3. FAQ Schema
  if (postData.faq) {
    const faqSchema = generateFAQSchema(postData.faq);
    if (faqSchema) {
      jsonLdData['@graph'].push(faqSchema);
    }
  }

  // 4. Article Schema (fallback if not a service)
  if (!postData.schemaType && !postData.offers) {
    const articleSchema = generateArticleSchema({
      title: postData.title,
      description: postData.description,
      url: pageUrl,
      image: postData.featuredImage,
      datePublished: postData.date,
      dateModified: postData.lastUpdated,
      authorName: postData.author
    });
    jsonLdData['@graph'].push(articleSchema);
  }

  const allPosts = getAllPostsMeta();
  const relativeContentPath = path.join(sourceFolder || 'services', `${params.slug}.md`);
  const routePath = `services/${params.slug}`;
  const alternateLanguages = buildAlternateLanguageUrls({
    relativeFilePath: relativeContentPath,
    routePath,
    fallbackLangs: [params.lang],
  });

  return {
    props: {
      postData,
      jsonLdData,
      allPosts,
      pageLang: params.lang,
      pageSlug: params.slug,
      alternateLanguages,
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
