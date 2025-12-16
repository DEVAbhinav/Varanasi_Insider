import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone, MessageCircle, ChevronRight, Plane, Users, MapPin, Map, BookOpen } from 'lucide-react';
import styles from './Navbar.module.css';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    function onKeyDown(e) {
      if (!open) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <header
      className={`${styles.navHeader} ${open ? 'bg-white text-gray-900 backdrop-blur-0 shadow relative z-[60]' : ''}`}
      role="banner"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <nav className={styles.navContainer} role="navigation" aria-label="Primary">
        <Link href="/" className={styles.logo} aria-label="Varanasi Taxi & Tempo Traveller homepage">
          Travel Agent Varanasi
        </Link>

        {/* Desktop links */}
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/en/varanasi-airport-taxi-guide" className={styles.navLink}>Airport Taxi</Link>
          <Link href="/en/tempo-traveller-varanasi" className={styles.navLink}>Tempo Traveller</Link>
          <Link href="/en/outstation-cabs-from-varanasi" className={styles.navLink}>Outstation Cabs</Link>
          <Link href="/en/services/varanasi-full-day-city-tour-winter-2025" className={styles.navLink}>Local Sightseeing</Link>
          <Link href="/en" className={styles.navLink}>Travel Guides</Link>
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
          className="inline-flex items-center justify-center md:hidden h-10 w-10 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Mobile drawer (above overlay) */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        ref={drawerRef}
        className={`fixed inset-y-0 right-0 z-[100] w-80 max-w-[85vw] ${open ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-out bg-white shadow-2xl md:hidden`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        {/* Premium gradient header */}
        <div className="relative p-5 border-b border-cyan-200/50 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600 overflow-hidden">
          {/* Subtle dot pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 20px 20px, white 2%, transparent 0%), radial-gradient(circle at 60px 60px, white 2%, transparent 0%)',
              backgroundSize: '80px 80px'
            }}></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-white drop-shadow-md">Varanasi Travels</span>
              <p className="text-xs text-cyan-50 mt-0.5">Taxi, Tempo Traveller & Tour Packages</p>
            </div>
            <button 
              aria-label="Close menu" 
              onClick={() => setOpen(false)} 
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-all hover:scale-105 active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-4 pt-5 overflow-y-auto h-[calc(100vh-140px)] bg-white">
          {/* Menu items with icons */}
          <nav className="space-y-2" aria-label="Mobile navigation">
            <Link 
              href="/" 
              onClick={() => setOpen(false)} 
              className="group w-full flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 text-gray-800 font-semibold text-[15px] border border-cyan-100 shadow-sm hover:shadow-md hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 hover:border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-100 to-teal-100 group-hover:from-cyan-200 group-hover:to-teal-200 transition-colors">
                <span className="text-lg">🏠</span>
              </div>
              <span className="flex-1">Home</span>
              <ChevronRight className="h-5 w-5 text-cyan-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              href="/en/varanasi-airport-taxi-guide" 
              onClick={() => setOpen(false)} 
              className="group w-full flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 text-gray-800 font-semibold text-[15px] border border-cyan-100 shadow-sm hover:shadow-md hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 hover:border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-100 to-teal-100 group-hover:from-cyan-200 group-hover:to-teal-200 transition-colors">
                <Plane className="h-5 w-5 text-cyan-700" />
              </div>
              <span className="flex-1">Airport Taxi</span>
              <ChevronRight className="h-5 w-5 text-cyan-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              href="/en/tempo-traveller-varanasi" 
              onClick={() => setOpen(false)} 
              className="group w-full flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 text-gray-800 font-semibold text-[15px] border border-cyan-100 shadow-sm hover:shadow-md hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 hover:border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-100 to-teal-100 group-hover:from-cyan-200 group-hover:to-teal-200 transition-colors">
                <Users className="h-5 w-5 text-cyan-700" />
              </div>
              <span className="flex-1">Tempo Traveller</span>
              <ChevronRight className="h-5 w-5 text-cyan-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              href="/en/outstation-cabs-from-varanasi" 
              onClick={() => setOpen(false)} 
              className="group w-full flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 text-gray-800 font-semibold text-[15px] border border-cyan-100 shadow-sm hover:shadow-md hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 hover:border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-100 to-teal-100 group-hover:from-cyan-200 group-hover:to-teal-200 transition-colors">
                <MapPin className="h-5 w-5 text-cyan-700" />
              </div>
              <span className="flex-1">Outstation Cabs</span>
              <ChevronRight className="h-5 w-5 text-cyan-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              href="/en/services/varanasi-full-day-city-tour-winter-2025" 
              onClick={() => setOpen(false)} 
              className="group w-full flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 text-gray-800 font-semibold text-[15px] border border-cyan-100 shadow-sm hover:shadow-md hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 hover:border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-100 to-teal-100 group-hover:from-cyan-200 group-hover:to-teal-200 transition-colors">
                <Map className="h-5 w-5 text-cyan-700" />
              </div>
              <span className="flex-1">Local Sightseeing</span>
              <ChevronRight className="h-5 w-5 text-cyan-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              href="/en" 
              onClick={() => setOpen(false)} 
              className="group w-full flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 text-gray-800 font-semibold text-[15px] border border-cyan-100 shadow-sm hover:shadow-md hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 hover:border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-100 to-teal-100 group-hover:from-cyan-200 group-hover:to-teal-200 transition-colors">
                <BookOpen className="h-5 w-5 text-cyan-700" />
              </div>
              <span className="flex-1">Travel Guides</span>
              <ChevronRight className="h-5 w-5 text-cyan-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </nav>

          {/* Contact buttons */}
          <div className="mt-6 pt-5 border-t border-cyan-200/50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Quick Contact</p>
            <div className="grid grid-cols-2 gap-3">
              <a 
                href="https://wa.me/919935474730" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white py-4 font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle className="h-6 w-6" />
                <span className="text-sm">WhatsApp</span>
              </a>
              <a 
                href="tel:+919450301573" 
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 text-white py-4 font-semibold hover:from-cyan-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <Phone className="h-6 w-6" />
                <span className="text-sm">Call Now</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
