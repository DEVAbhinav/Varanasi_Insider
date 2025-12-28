import Head from 'next/head';
import NavBar from '@/components/NavBar/NavBar';
import Footer from '@/components/Footer/Footer';
import CTASection from '@/components/CTA/CTASection';
import StickyContactBar from '@/components/ServicePage/StickyContactBar';
import SidebarBookingWidget from '@/components/BookingWidget/SidebarBookingWidget';
import ArticleSection from '@/components/ArticleSection/ArticleSection';
import ClusterDirectory from '@/components/ClusterDirectory/ClusterDirectory';

const SITE_BASE = 'https://www.kashitaxi.in';
const DEFAULT_PHONE = '9935474730';

export default function CategoryDirectoryPage({ entry, allPosts }) {
  if (!entry) {
    return null;
  }

  const slugPath = `/${entry.lang || 'en'}/city/${entry.destination}/${entry.category}`;
  const canonicalUrl = `${SITE_BASE}${slugPath}`;
  const title = entry.title || 'Kashi Taxi | Travel Agent Varanasi';
  const description = entry.description || '';
  const keywords = Array.isArray(entry.keywords)
    ? entry.keywords.join(', ')
    : entry.keywords;
  const published = entry.date || undefined;
  const modified = entry.lastUpdated || entry.date || undefined;
  const ogImage = entry.featuredImage
    ? (entry.featuredImage.startsWith('http') ? entry.featuredImage : `${SITE_BASE}${entry.featuredImage}`)
    : `${SITE_BASE}https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png`;
  const phoneNumber = entry.phone || DEFAULT_PHONE;
  const headerEyebrow = entry.eyebrow || 'Destination Cluster';

  return (
    <>
      <Head>
        <title>{entry.metaTitle || title}</title>
        {(entry.metaDescription || description) && (
          <meta name="description" content={entry.metaDescription || description} />
        )}
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={entry.metaTitle || title} />
        {(entry.metaDescription || description) && (
          <meta property="og:description" content={entry.metaDescription || description} />
        )}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="Kashi Taxi" />
        {published && <meta property="article:published_time" content={published} />}
        {modified && <meta property="article:modified_time" content={modified} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={entry.metaTitle || title} />
        {(entry.metaDescription || description) && (
          <meta name="twitter:description" content={entry.metaDescription || description} />
        )}
        <meta name="twitter:image" content={ogImage} />
        {entry.jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(entry.jsonLd) }}
          />
        )}
      </Head>

      <NavBar />
      <StickyContactBar phone={phoneNumber} />

      <main>
        <header className="bg-slate-50 py-10">
          <div className="container mx-auto px-4 text-center lg:text-left">
            {headerEyebrow && (
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-600">
                {headerEyebrow}
              </p>
            )}
            <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              {entry.heading || title}
            </h1>
            {description && (
              <p className="mt-4 max-w-3xl text-base text-slate-600">
                {description}
              </p>
            )}
          </div>
        </header>

        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              {entry.contentHtml && entry.contentHtml.trim() && (
                <ArticleSection contentHtml={entry.contentHtml} />
              )}

              <ClusterDirectory
                title={entry.clusterTitle || 'Interactive Directory'}
                description={entry.clusterDescription}
                tabs={entry.clusterTabs || []}
                entries={entry.clusterEntries || []}
              />
            </div>
            <aside className="lg:col-span-4">
              <div className="hidden lg:block">
                <SidebarBookingWidget
                  pageTitle={title}
                  pageUrl={slugPath}
                />
              </div>
            </aside>
          </div>
        </div>

        <div className="lg:hidden">
          <SidebarBookingWidget
            pageTitle={title}
            pageUrl={slugPath}
          />
        </div>

        <CTASection
          phone={phoneNumber}
          title={entry.ctaTitle || 'Need help planning your route?'}
          subtitle={entry.ctaSubtitle || 'Share your arrival window and get a dispatch-ready plan with barricade, fleet, and fare intel.'}
          variant={entry.ctaVariant || 'default'}
        />
      </main>

      <Footer allPosts={allPosts} />
    </>
  );
}
