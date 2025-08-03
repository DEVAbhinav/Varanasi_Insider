import Image from "next/image";
import styles from './Header.module.css';

export default function Header({ title, featuredImage }) {
  return (
    <>
      {/* Top fixed header with logo/nav/CTA */}
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Logo */}
          <div className={styles.logo}>
            <Image
              src="/images/logo.jpeg"
              alt="kashi Taxi Logo"
              width={40}
              height={40}
              className={styles.logoImage}
            />
            <span className={styles.logoText}>Kashi Insider</span>
          </div>

          {/* Navigation */}
          <nav className={styles.nav}>
            <a href="#" className={styles.navLink}>Home</a>
            <a href="#" className={styles.navLink}>Travel Guides</a>
            <a href="#" className={styles.navLink}>Outstation Taxis</a>
            <a href="tel:9450301573" className={styles.navLink}>Contact</a>
          </nav>

          {/* CTA Button */}
          <a
            href="tel:9450301573"
            className={styles.ctaButton}
          >
            Get Fare
          </a>
        </div>
      </header>

      {/* Page title and featured image below nav */}
      <div className={styles.headerContainer}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>{title || "This is dummy title"}</h1>
        </div>
        {/* {featuredImage && (
          <Image
            src={featuredImage}
            alt={title}
            className={styles.heroImage}
            fetchpriority="high"
          />
        )} */}
      </div>
    </>
  );
}
