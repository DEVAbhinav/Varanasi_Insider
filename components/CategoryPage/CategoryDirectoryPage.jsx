import Head from 'next/head';
import NavBar from '@/components/NavBar/NavBar';
import Footer from '@/components/Footer/Footer';
import CTASection from '@/components/CTA/CTASection';
import StickyContactBar from '@/components/ServicePage/StickyContactBar';
import SidebarBookingWidget from '@/components/BookingWidget/SidebarBookingWidget';
import ArticleSection from '@/components/ArticleSection/ArticleSection';
import ClusterDirectory from '@/components/ClusterDirectory/ClusterDirectory';
import { CONTACT, getCallTelHref, getWhatsAppUrl } from '@/lib/contact';
import { logClick } from '@/lib/logClick';
import { Phone, MessageSquare, Car } from 'lucide-react';

const SITE_BASE = 'https://www.kashitaxi.in';
const DEFAULT_PHONE = CONTACT.callNumberRaw;

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
    : 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png';
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
        <header className="bg-slate-50 py-10 border-b border-slate-200">
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

            {/* High-Conversion Fast Actions for Taxi Directory */}
            {entry.category === 'taxi' && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <a
                  href={getCallTelHref(phoneNumber)}
                  onClick={() => logClick('CALL')}
                  data-cta-id="taxi_directory_call"
                  data-cta-location="category_header"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition"
                >
                  <Phone className="h-4 w-4 text-cyan-400" />
                  Call for Taxi (24×7)
                </a>
                <a
                  href={getWhatsAppUrl('Hi, I need a taxi quote in Varanasi. Pickup: __, Drop: __, Date: __.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => logClick('WHATSAPP')}
                  data-cta-id="taxi_directory_whatsapp"
                  data-cta-location="category_header"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition"
                >
                  <MessageSquare className="h-4 w-4" />
                  WhatsApp Route Quote
                </a>
                <a
                  href="/varanasi-taxi-service"
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan-300 bg-cyan-50 px-5 py-3 text-sm font-bold text-cyan-900 hover:bg-cyan-100 transition shadow-sm"
                >
                  <Car className="h-4 w-4 text-cyan-700" />
                  Varanasi Taxi Service (City Fleet) →
                </a>
              </div>
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
