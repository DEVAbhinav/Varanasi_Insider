import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageCircle, ChevronRight } from 'lucide-react';
import styles from './Navbar.module.css';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header
      className={`${styles.navHeader} ${open ? 'bg-white text-gray-900 backdrop-blur-0 shadow relative z-[60]' : ''}`}
      role="banner"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <nav className={styles.navContainer} role="navigation" aria-label="Primary">
        <Link href="/" className={styles.logo} aria-label="Kashi Insider homepage">
          Kashi Insider
        </Link>

        {/* Desktop links */}
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/en" className={styles.navLink}>Travel Guides</Link>
          <Link href="/rates/outstation-taxi-varanasi" className={styles.navLink}>Outstation Taxis</Link>
          <Link href="/en/contact" className={styles.navLink}>Contact</Link>
          <a
            href="https://wa.me/919935474730"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.navButtonWhatsApp} hidden md:inline-flex`}
            aria-label="Contact us on WhatsApp +91-99354-74730"
          >
            WhatsApp
          </a>
          <a 
            href="tel:+919450301573" 
            className={`${styles.navButtonCall} hidden md:inline-flex`}
            aria-label="Call us at +91-94503-01573"
          >
            Call
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="inline-flex items-center justify-center md:hidden h-10 w-10 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          <span className="sr-only">Menu</span>
        </button>
      </nav>

      {/* Overlay (behind the drawer) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/70 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Mobile drawer (above overlay) */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        className={`fixed inset-y-0 right-0 z-[100] w-72 max-w-[85vw] ${open ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-200 ease-out bg-white/85 backdrop-blur-md text-gray-900 shadow-2xl ring-1 ring-black/10 md:hidden`}
      >
        <div className="p-4 border-b border-white/50 flex items-center justify-between">
          <span className="text-base font-semibold">Kashi Insider</span>
          <button aria-label="Close menu" onClick={() => setOpen(false)} className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/60">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5 pt-4">
          {/* Button-like list items (with soft pink gradient) */}
          <div className="space-y-3">
            <Link href="/" onClick={() => setOpen(false)} className="w-full inline-flex items-center justify-between rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 text-gray-950 font-medium text-base ring-1 ring-rose-200 shadow-sm hover:shadow-md hover:from-rose-100 hover:to-pink-100 focus:outline-none focus:ring-2 focus:ring-rose-400/50">
              <span>Home</span>
              <ChevronRight className="h-4 w-4 text-rose-600" />
            </Link>
            <Link href="/en" onClick={() => setOpen(false)} className="w-full inline-flex items-center justify-between rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 text-gray-950 font-medium text-base ring-1 ring-rose-200 shadow-sm hover:shadow-md hover:from-rose-100 hover:to-pink-100 focus:outline-none focus:ring-2 focus:ring-rose-400/50">
              <span>Travel Guides</span>
              <ChevronRight className="h-4 w-4 text-rose-600" />
            </Link>
            <Link href="/rates/outstation-taxi-varanasi" onClick={() => setOpen(false)} className="w-full inline-flex items-center justify-between rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 text-gray-950 font-medium text-base ring-1 ring-rose-200 shadow-sm hover:shadow-md hover:from-rose-100 hover:to-pink-100 focus:outline-none focus:ring-2 focus:ring-rose-400/50">
              <span>Outstation Taxis</span>
              <ChevronRight className="h-4 w-4 text-rose-600" />
            </Link>
            <Link href="/en/contact" onClick={() => setOpen(false)} className="w-full inline-flex items-center justify-between rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 text-gray-950 font-medium text-base ring-1 ring-rose-200 shadow-sm hover:shadow-md hover:from-rose-100 hover:to-pink-100 focus:outline-none focus:ring-2 focus:ring-rose-400/50">
              <span>Contact</span>
              <ChevronRight className="h-4 w-4 text-rose-600" />
            </Link>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <a href="https://wa.me/919935474730" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 text-white py-2.5">
              <MessageCircle className="h-4 w-4" /> <span>WhatsApp</span>
            </a>
            <a href="tel:+919450301573" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white py-2.5">
              <Phone className="h-4 w-4" /> <span>Call</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
