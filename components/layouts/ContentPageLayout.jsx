/**
 * ContentPageLayout — shared shell for all content/article pages.
 *
 * Provides: NavBar, StickyContactBar, 2-column (8+4) grid with sidebar,
 * mobile sidebar, ContentEnhancements.Bottom, CTASection, Footer.
 *
 * Slot props (all optional JSX):
 *   head          — <Head> / <HeadForBlogs> block
 *   header        — hero, breadcrumb header, etc. (above the 2-col grid)
 *   beforeGrid    — full-width content between header and grid (e.g. ServiceHero)
 *   children      — main article column content (8-col)
 *   afterMain     — full-width sections after the grid (e.g. RelatedPostsGrid)
 *
 * Data props:
 *   phone         — phone number for StickyContactBar + CTA
 *   pageTitle     — title for sidebar booking widget
 *   pageUrl       — url for sidebar booking widget
 *   contentHtml   — full HTML string for ContentEnhancements.Bottom
 *   faqSchema     — frontmatter FAQ array
 *   cta           — { title, subtitle, variant } overrides for CTASection
 *   allPosts      — post metadata for Footer
 *   hideSidebar   — if true, content goes full width (no booking widget)
 */

import NavBar from '@/components/NavBar/NavBar';
import Footer from '@/components/Footer/Footer';
import StickyContactBar from '@/components/ServicePage/StickyContactBar';
import SidebarBookingWidget from '@/components/BookingWidget/SidebarBookingWidget';
import ContentEnhancements from '@/components/ArticleSection/ContentEnhancements';
import CTASection from '@/components/CTA/CTASection';
import RelatedLinks from '@/components/SEO/RelatedLinks';
import { CONTACT } from '@/lib/contact';

export default function ContentPageLayout({
  head,
  header,
  beforeGrid,
  children,
  afterMain,
  // data props
  phone,
  pageTitle = '',
  pageUrl = '',
  contentHtml = '',
  faqSchema,
  cta = {},
  allPosts,
  hideSidebar = false,
}) {
  const resolvedPhone = phone || CONTACT.callNumberRaw;
  const relatedLang = /^\/hi(\/|$)/.test(pageUrl || '') ? 'hi' : 'en';

  return (
    <>
      {head}

      <NavBar />
      <StickyContactBar phone={resolvedPhone} />

      <main>
        {header}
        {beforeGrid}

        <div className="container mx-auto px-4 py-8">
          <div className={hideSidebar
            ? 'max-w-4xl mx-auto'
            : 'grid grid-cols-1 lg:grid-cols-12 gap-8'
          }>
            {/* Main article column */}
            <div className={hideSidebar ? undefined : 'lg:col-span-8'}>
              {children}
            </div>

            {/* Sidebar booking widget */}
            {!hideSidebar && (
              <aside className="lg:col-span-4">
                <div className="hidden lg:block">
                  <SidebarBookingWidget pageTitle={pageTitle} pageUrl={pageUrl} />
                </div>
              </aside>
            )}
          </div>
        </div>

        {/* Mobile: Fixed bottom booking widget */}
        {!hideSidebar && (
          <div className="lg:hidden">
            <SidebarBookingWidget pageTitle={pageTitle} pageUrl={pageUrl} />
          </div>
        )}

        {/* FAQ Accordion (auto-skips if body already has FAQ) */}
        <ContentEnhancements.Bottom html={contentHtml} faqSchema={faqSchema} />

        {/* Contextual internal links (build-generated, GSC-driven) */}
        {pageUrl && <RelatedLinks path={pageUrl} lang={relatedLang} />}

        {/* CTA Section */}
        {cta !== null && (
          <CTASection
            phone={resolvedPhone}
            title={cta?.title || 'Need help planning your trip?'}
            subtitle={cta?.subtitle || 'Get personalized assistance for your Varanasi journey'}
            variant={cta?.variant || 'default'}
          />
        )}

        {afterMain}
      </main>

      <Footer allPosts={allPosts} />
    </>
  );
}
