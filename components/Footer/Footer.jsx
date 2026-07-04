import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer({ allPosts }) {
  // Supports both the current shape ({ posts, counts }) and a legacy plain array.
  const isStructured =
    allPosts && !Array.isArray(allPosts) && Array.isArray(allPosts.posts);
  const rawList = isStructured
    ? allPosts.posts
    : Array.isArray(allPosts)
      ? allPosts
      : [];
  const totals = isStructured ? allPosts.counts || {} : {};

  // Normalize incoming posts to handle both formats
  const normalized = rawList.map((p) =>
    p?.params
      ? { lang: p.params.lang, slug: p.params.slug, routePath: p.params.routePath, title: p.params.title || p.params.slug }
      : { lang: p.lang, slug: p.slug, routePath: p.routePath, title: p.title || p.slug }
  );

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
          <h3 className={styles.footerTitle}>Varanasi Taxi</h3>
          <p className={styles.footerSubtitle}>A Vinayak Travels Tour Venture</p>
        </div>
        <div className={styles.linksSection}>
          <h4 className={styles.linksTitle}>Quick Links</h4>
          <Link href="/" className={styles.footerLink}>Home</Link>
          <Link href="/pink-taxi-varanasi" className={styles.footerLink}>Pink Taxi</Link>
          <Link href="/en/varanasi-airport-taxi-guide" className={styles.footerLink}>Airport Transfers</Link>
          <Link href="/en/about" className={styles.footerLink}>About Us</Link>
          <Link href="/en/contact" className={styles.footerLink}>Contact</Link>
          <Link
            href="/en/city/varanasi/events/kashi-tamil-sangamam-2026-varanasi"
            className={styles.footerLink}
          >
            Kashi Tamil Sangamam
          </Link>
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
                  const totalForLang = totals[lang] ?? groups[lang].length;
                  return (
                    <div key={lang} className={styles.langColumn}>
                      <div className={styles.langHeader}>
                        {langLabels[lang] || lang.toUpperCase()}
                      </div>
                      <ul className={styles.allPostsList}>
                        {posts.map((post) => (
                          <li key={`${lang}-${post.slug}`}>
                            <Link href={post.routePath || `/${post.lang}/${post.slug}`} className={styles.footerLink}>
                              {post.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {totalForLang > perLangLimit && (
                        <Link href={`/${lang}`} className={styles.viewAll}>
                          View all {totalForLang} posts →
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
      <div className={styles.credit}>
        Made and managed with ♥ by <a href="https://www.vistalabs.in/" target="_blank" rel="noopener noreferrer">Vista Labs</a>
      </div>
    </footer>
  );
}
