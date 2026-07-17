import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Footer.module.css';
import { BUSINESS } from '@/config/business';
import { CONTACT, getCallTelHref } from '@/lib/contact';
import linkGraph from '@/data/generated/seo-link-graph.json';

const SITE_URL = (BUSINESS.siteUrl || 'https://www.kashitaxi.in').replace(/\/+$/, '');

function toAbsolute(href) {
  if (!href) return href;
  if (/^https?:\/\//i.test(href)) return href;
  return `${SITE_URL}${href.startsWith('/') ? '' : '/'}${href}`;
}

// `allPosts` is accepted for backward compatibility with existing call sites but
// is no longer used — footer link groups are generated at build time by
// scripts/generate-link-graph.js (GSC-driven) and read from the JSON below.
export default function Footer({ lang: langProp }) {
  const router = useRouter();
  const asPath = router?.asPath || '';
  const detectedLang = /^\/hi(\/|$)/.test(asPath) ? 'hi' : 'en';
  const lang = langProp === 'hi' || langProp === 'en' ? langProp : detectedLang;

  const groups = (linkGraph.footer && (linkGraph.footer[lang] || linkGraph.footer.en)) || [];

  const navItems = [];
  for (const g of groups) {
    for (const l of g.links) {
      if (l.external) continue;
      navItems.push({ name: l.label, url: toAbsolute(l.href) });
    }
  }
  const navLd = navItems.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'SiteNavigationElement',
        name: navItems.map((i) => i.name),
        url: navItems.map((i) => i.url),
      }
    : null;

  const copy = {
    en: {
      needTaxi: 'Need a taxi or tour in Varanasi?',
      call: 'Call',
      whatsapp: 'WhatsApp',
      rated: `Rated ${BUSINESS.rating}/5 by ${BUSINESS.reviewCount} travellers on Google`,
    },
    hi: {
      needTaxi: 'वाराणसी में टैक्सी या टूर चाहिए?',
      call: 'कॉल करें',
      whatsapp: 'व्हाट्सएप',
      rated: `गूगल पर ${BUSINESS.reviewCount} यात्रियों द्वारा ${BUSINESS.rating}/5 रेटेड`,
    },
  }[lang] || {};

  return (
    <footer className={styles.footerWrapper}>
      {navLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(navLd) }}
        />
      )}

      <div className={styles.footerContainer}>
        <div className={styles.brandCol}>
          <h3 className={styles.footerTitle}>{BUSINESS.brandName}</h3>
          <p className={styles.footerSubtitle}>Operated by {BUSINESS.legalNameFull}</p>
          <p className={styles.address}>{BUSINESS.addressDisplay}</p>
          <p className={styles.rating}>★ {copy.rated}</p>
          <p className={styles.needTaxi}>{copy.needTaxi}</p>
          <div className={styles.contactRow}>
            <a href={getCallTelHref()} className={styles.callBtn}>
              {copy.call}: {CONTACT.callNumberDisplay}
            </a>
            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.waBtn}
            >
              {copy.whatsapp}
            </a>
          </div>
          <div className={styles.socialRow}>
            {BUSINESS.socialHandles?.instagram && (
              <a href={BUSINESS.socialHandles.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>
            )}
            {BUSINESS.socialHandles?.twitter && (
              <a href={BUSINESS.socialHandles.twitter} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">X</a>
            )}
            {BUSINESS.socialHandles?.googleMaps && (
              <a href={BUSINESS.socialHandles.googleMaps} target="_blank" rel="noopener noreferrer" aria-label="Google Maps">Google Maps</a>
            )}
          </div>
        </div>

        <div className={styles.groupsGrid}>
          {groups.map((group) => (
            <details key={group.id} className={styles.group} open>
              <summary className={styles.groupTitle}>{group.title}</summary>
              <ul className={styles.linkList}>
                {group.links.map((l) =>
                  l.external ? (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        className={styles.footerLink}
                        target="_blank"
                        rel={l.rel === 'dofollow' ? 'noopener' : 'noopener noreferrer'}
                      >
                        {l.label}
                      </a>
                    </li>
                  ) : (
                    <li key={l.href}>
                      <Link href={l.href} className={styles.footerLink}>
                        {l.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </details>
          ))}
        </div>
      </div>

      <div className={styles.copyright}>
        © {new Date().getFullYear()} {BUSINESS.legalName}. All Rights Reserved.
      </div>
      <div className={styles.credit}>
        Made and managed with ♥ by{' '}
        <a href="https://www.vistalabs.in/" target="_blank" rel="noopener noreferrer">
          Vista Labs
        </a>
      </div>
    </footer>
  );
}
