import Link from 'next/link';
import styles from './Navbar.module.css';

export default function NavBar() {
  return (
    <header className={styles.navHeader}>
      <nav className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          Kashi taxi - A Vinayak Travels Venture
        </Link>
        <div className={styles.navLinks}>
          <Link href="/en/about" className={styles.navLink}>
            About
          </Link>
          <Link href="/en/contact" className={styles.navLink}>
            Contact
          </Link>
          <a href="https://www.kashitaxi.in" target="_blank" rel="noopener noreferrer" className={styles.navButton}>
            Book a Taxi
          </a>
        </div>
      </nav>
    </header>
  );
}
