// pages/[lang]/services/[slug].js
import ContentPageLayout from '../../../components/layouts/ContentPageLayout';
import HeadForBlogs from '../../../components/SEO/HeadForBlogs';
import ServiceHero from '../../../components/ServicePage/ServiceHero';
import ServiceContent from '../../../components/ServicePage/ServiceContent';
import ContentEnhancements from '../../../components/ArticleSection/ContentEnhancements';
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
  const { part1, part2 } = (() => {
    const html = postData.contentHtml || '';
    if (postData.showRatesCheatSheet === false || !html) return { part1: html, part2: null };

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
    <ContentPageLayout
      head={<HeadForBlogs postData={postData} pageLang={pageLang} pageSlug={`services/${pageSlug}`} jsonLdData={jsonLdData} alternateLanguages={alternateLanguages} />}
      header={
        <ServiceHero
          title={postData.title}
          subtitle={postData.subtitle}
          heroImage={postData.featuredImage || postData.heroImage}
          phone={postData.phone}
        />
      }
      beforeGrid={postData.showSegmentBlocks ? <TravelerSegmentBlocks phone={postData.phone || CONTACT.whatsappNumberRaw} /> : null}
      phone={postData.phone}
      pageTitle={postData.title}
      pageUrl={`/${pageLang}/services/${pageSlug}`}
      contentHtml={postData.contentHtml}
      faqSchema={postData.faqSchema}
      cta={postData.phone ? { title: 'Need help with this trip plan?', subtitle: 'Talk to our local team for practical options, clear pricing, and smooth coordination', variant: 'service' } : null}
      allPosts={allPosts}
      hideSidebar
    >
      {/* Service Content Part 1 */}
      {part1 && (
        <ServiceContent
          contentHtml={part1}
          pageTitle={postData.title}
          pageUrl={`/${pageLang}/services/${pageSlug}`}
        />
      )}

      {/* Quick Facts + TOC */}
      <div className="max-w-5xl mx-auto px-4">
        <ContentEnhancements.Inline html={postData.contentHtml} quickFacts={postData.quickFacts} />
      </div>

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
    </ContentPageLayout>
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
      const existingJsonLd = await getJsonLdData(params.lang, scopedSlug);
      jsonLdData = existingJsonLd || { '@context': 'https://schema.org', '@graph': [] };
      sourceFolder = folder;
      break;
    }
  }

  if (!postData) {
    return { notFound: true };
  }

  const siteUrl = 'https://www.kashitaxi.in';
  const pageUrl = `${siteUrl}/${params.lang}/services/${params.slug}`;
  const hasGraphType = (typeName) =>
    jsonLdData['@graph'].some((node) => {
      const type = node?.['@type'];
      if (!type) return false;
      if (Array.isArray(type)) return type.includes(typeName);
      return type === typeName;
    });

  if (!hasGraphType('BreadcrumbList')) {
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Services', url: `/${params.lang}/services/` },
      { name: postData.title, url: pageUrl }
    ];
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
    jsonLdData['@graph'].push(breadcrumbSchema);
  }

  if ((postData.schemaType === 'Service' || postData.offers) && !hasGraphType('Service')) {
    const serviceSchema = generateServiceSchema({
      title: postData.title,
      description: postData.description,
      url: pageUrl,
      image: postData.featuredImage,
      offers: postData.offers,
      provider: postData.provider,
      areaServed: postData.areaServed
    });
    jsonLdData['@graph'].push(serviceSchema);
  }

  if ((postData.faq || postData.faqSchema) && !hasGraphType('FAQPage')) {
    const faqSchema = generateFAQSchema(postData.faq || postData.faqSchema);
    if (faqSchema) {
      jsonLdData['@graph'].push(faqSchema);
    }
  }

  if (!postData.schemaType && !postData.offers && !hasGraphType('BlogPosting')) {
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
