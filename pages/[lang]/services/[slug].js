// pages/[lang]/services/[slug].js
import NavBar from '../../../components/NavBar/NavBar';
import Footer from '../../../components/Footer/Footer';
import HeadForBlogs from '../../../components/SEO/HeadForBlogs';
import ServiceHero from '../../../components/ServicePage/ServiceHero';
import ServiceContent from '../../../components/ServicePage/ServiceContent';
import StickyContactBar from '../../../components/ServicePage/StickyContactBar';
import CTASection from '../../../components/CTA/CTASection';
import dynamic from 'next/dynamic';
import { CONTACT } from '@/lib/contact';

const TaxiRatesCheatSheet = dynamic(() => import('../../../components/TaxiRatesCheatSheet/TaxiRatesCheatSheet'), {
  loading: () => <div className="h-96 w-full animate-pulse bg-gray-100 container mx-auto rounded-xl my-8" />,
  ssr: false,
});

const TravelerSegmentBlocks = dynamic(() => import('../../../components/TravelerSegmentBlocks/TravelerSegmentBlocks'), {
  loading: () => <div className="h-64 w-full animate-pulse bg-gray-50 my-8" />,
  ssr: false,
});

export default function ServicePage({ postData, jsonLdData, allPosts, pageLang, pageSlug, alternateLanguages = [] }) {
  // Split content logic for injection
  const { part1, part2 } = (() => {
    const html = postData.contentHtml || '';
    if (postData.showRatesCheatSheet === false || !html) return { part1: html, part2: null };

    // Try to split after 2nd paragraph for better flow, fallback to 1st
    const firstP = html.indexOf('</p>');
    if (firstP === -1) return { part1: html, part2: null };

    const secondP = html.indexOf('</p>', firstP + 4);
    const splitIndex = (secondP !== -1) ? secondP + 4 : firstP + 4;

    return {
      part1: html.substring(0, splitIndex),
      part2: html.substring(splitIndex)
    };
  })();

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

        {/* Traveler Segment Blocks - Target persona value props */}
        {postData.showSegmentBlocks && (
          <TravelerSegmentBlocks phone={postData.phone || CONTACT.whatsappNumberRaw} />
        )}

        {/* Service Content Part 1 */}
        {part1 && (
          <ServiceContent
            contentHtml={part1}
            pageTitle={postData.title}
            pageUrl={`/${pageLang}/services/${pageSlug}`}
          />
        )}

        {/* Injected Rates Cheat Sheet */}
        {(postData.showRatesCheatSheet !== false) && part2 && (
          <TaxiRatesCheatSheet variant="compact" showCTA={true} />
        )}

        {/* Service Content Part 2 */}
        {part2 && (
          <ServiceContent
            contentHtml={part2}
            pageTitle={postData.title}
            pageUrl={`/${pageLang}/services/${pageSlug}`}
          />
        )}

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
