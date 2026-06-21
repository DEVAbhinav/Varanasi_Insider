/**
 * LandingPageLayout — shared shell for full-width marketing/landing pages.
 *
 * Provides: NavBar, Footer, StickyContactBar (floating mobile Call/WhatsApp CTA).
 * Each landing page brings its own hero, sections, and CTAs.
 *
 * Slot props:
 *   head      — <Head> / JSON-LD block
 *   children  — full-width page content (hero, sections, ArticleNew, etc.)
 *
 * Data props:
 *   allPosts  — post metadata for Footer (optional)
 *   phone     — phone number for StickyContactBar (optional; defaults to CONTACT)
 */

import NavBar from '@/components/NavBar/NavBar';
import Footer from '@/components/Footer/Footer';
import StickyContactBar from '@/components/ServicePage/StickyContactBar';
import { CONTACT } from '@/lib/contact';

export default function LandingPageLayout({ head, children, allPosts, phone }) {
  return (
    <>
      {head}
      <NavBar />
      <main>
        {children}
      </main>
      <Footer allPosts={allPosts} />
      <StickyContactBar phone={phone || CONTACT.callNumberRaw} />
    </>
  );
}
