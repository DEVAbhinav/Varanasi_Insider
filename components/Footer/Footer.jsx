import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerContainer}>
        <div className={styles.logoSection}>
          <h3 className={styles.footerTitle}>Banaras Insider</h3>
          <p className={styles.footerSubtitle}>A Vinayak Travels Tour Venture</p>
        </div>
        <div className={styles.linksSection}>
          <h4 className={styles.linksTitle}>Quick Links</h4>
          <Link href="/en/about" className={styles.footerLink}>About Us</Link>
          <Link href="/en/contact" className={styles.footerLink}>Contact</Link>
          <a href="https://kashitaxi.in" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Book a Taxi</a>
          <Link href="/en/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
        </div>
      </div>
      <div className={styles.copyright}>
        © {new Date().getFullYear()} Banaras Insider. All Rights Reserved.
      </div>
    </footer>
  );
}