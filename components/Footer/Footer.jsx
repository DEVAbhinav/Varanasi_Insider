import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer({ allPosts }) {
  // Normalize incoming posts to handle both formats
  const normalized = Array.isArray(allPosts)
    ? allPosts.map((p) =>
        p?.params
          ? { lang: p.params.lang, slug: p.params.slug, title: p.params.title || p.params.slug }
          : { lang: p.lang, slug: p.slug, title: p.title || p.slug }
      )
    : [];

  // Group posts by language
  const groups = normalized.reduce(
    (acc, p) => {
      if (!p?.lang || !p?.slug) return acc;
      if (!acc[p.lang]) acc[p.lang] = [];
      acc[p.lang].push(p);
      return acc;
    },
    {}
  );

  const langLabels = {
    hi: 'सभी पोस्ट (हिंदी)',
    en: 'All Posts (English)'
  };
  
  const langOrder = ['hi', 'en'];
  const hasAnyPosts = normalized.length > 0;
  const perLangLimit = 12; // Increased from 8 to 12 for better SEO

  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerContainer}>
        <div className={styles.logoSection}>
          <h3 className={styles.footerTitle}>Kashi Taxi</h3>
          <p className={styles.footerSubtitle}>A Vinayak Travels Tour Venture</p>
        </div>
        <div className={styles.linksSection}>
          <h4 className={styles.linksTitle}>Quick Links</h4>
          <Link href="/" className={styles.footerLink}>Home</Link>
          <Link href="/pink-taxi-varanasi" className={styles.footerLink}>Pink Taxi</Link>
          <Link href="/en/about" className={styles.footerLink}>About Us</Link>
          <Link href="/en/contact" className={styles.footerLink}>Contact</Link>
          <a href="https://www.kashitaxi.in" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Book a Taxi</a>
          <Link href="#" className={styles.footerLink}>Privacy Policy</Link>
        </div>
        {hasAnyPosts && (
          <div className={styles.allPostsSection}>
            <h4 className={styles.linksTitle}>All Posts</h4>
            <div className={styles.allPostsGrid}>
              {langOrder
                .filter((lang) => groups[lang] && groups[lang].length > 0)
                .map((lang) => {
                  const posts = groups[lang].slice(0, perLangLimit);
                  return (
                    <div key={lang} className={styles.langColumn}>
                      <div className={styles.langHeader}>
                        {langLabels[lang] || lang.toUpperCase()}
                      </div>
                      <ul className={styles.allPostsList}>
                        {posts.map((post) => (
                          <li key={`${lang}-${post.slug}`}>
                            <Link href={`/${post.lang}/${post.slug}`} className={styles.footerLink}>
                              {post.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {groups[lang].length > perLangLimit && (
                        <Link href={`/${lang}`} className={styles.viewAll}>
                          View all {groups[lang].length} posts →
                        </Link>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
      <div className={styles.copyright}>
        © {new Date().getFullYear()} Vinayak Travels. All Rights Reserved.
      </div>
    </footer>
  );
}