import Link from 'next/link';
import styles from './Navbar.module.css';

export default function NavBar() {
  return (
    <header className={styles.navHeader} role="banner">
      <nav className={styles.navContainer} role="navigation" aria-label="Main navigation">
        <Link href="/" className={styles.logo} aria-label="Kashi Insider homepage">
          Kashi Insider
        </Link>
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/en" className={styles.navLink}>
            Travel Guides
          </Link>
          <Link href="/rates/outstation-taxi-varanasi" className={styles.navLink}>
            Outstation Taxis
          </Link>
          <Link href="/en/contact" className={styles.navLink}>
            Contact
          </Link>
          <a
            href="https://wa.me/919935474730"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navButtonWhatsApp}
            aria-label="Contact us on WhatsApp +91-99354-74730"
          >
            WhatsApp
          </a>
          <a 
            href="tel:+919450301573" 
            className={styles.navButtonCall}
            aria-label="Call us at +91-94503-01573"
          >
            Call
          </a>
        </div>
      </nav>
    </header>
  );
}
