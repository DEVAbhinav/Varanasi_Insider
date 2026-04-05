/**
 * LandingPageLayout — shared shell for full-width marketing/landing pages.
 *
 * Provides: NavBar, Footer. No sidebar, no StickyContactBar, no CTA.
 * Each landing page brings its own hero, sections, and CTAs.
 *
 * Slot props:
 *   head      — <Head> / JSON-LD block
 *   children  — full-width page content (hero, sections, ArticleNew, etc.)
 *
 * Data props:
 *   allPosts  — post metadata for Footer (optional)
 */

import NavBar from '@/components/NavBar/NavBar';
import Footer from '@/components/Footer/Footer';

export default function LandingPageLayout({ head, children, allPosts }) {
  return (
    <>
      {head}
      <NavBar />
      <main>
        {children}
      </main>
      <Footer allPosts={allPosts} />
    </>
  );
}
