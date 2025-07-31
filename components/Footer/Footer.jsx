import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer({ allPosts }) {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerContainer}>
        <div className={styles.logoSection}>
          <h3 className={styles.footerTitle}>Banaras Insider</h3>
          <p className={styles.footerSubtitle}>A Vinayak Travels Tour Venture</p>
        </div>
        <div className={styles.linksSection}>
          <h4 className={styles.linksTitle}>Quick Links</h4>
          <Link href="/" className={styles.footerLink}>Home</Link>
          <Link href="/pink-taxi-varanasi" className={styles.footerLink}>Pink Taxi</Link>
          <Link href="/en/about" className={styles.footerLink}>About Us</Link>
          <Link href="/en/contact" className={styles.footerLink}>Contact</Link>
          <a href="https://kashitaxi.in" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Book a Taxi</a>
          <Link href="#" className={styles.footerLink}>Privacy Policy</Link>
        </div>
        {allPosts && allPosts.length > 0 && (
          <div className={styles.allPostsSection}>
            <h4 className={styles.linksTitle}>All Posts</h4>
            <ul className={styles.allPostsList}>
              {allPosts.map((post, index) => (
                <li key={index}>
                  <Link href={`/${post.params.lang}/${post.params.slug}`} className={styles.footerLink}>
                    {post.params.slug}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className={styles.copyright}>
        © {new Date().getFullYear()} Banaras Insider. All Rights Reserved.
      </div>
    </footer>
  );
}