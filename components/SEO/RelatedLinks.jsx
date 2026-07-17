import Link from 'next/link';
import { BUSINESS } from '@/config/business';
import linkGraph from '@/data/generated/seo-link-graph.json';

const SITE_URL = (BUSINESS.siteUrl || 'https://www.kashitaxi.in').replace(/\/+$/, '');

function normalize(p) {
  if (!p) return p;
  let s = p.replace(/^https?:\/\/[^/]+/, '');
  s = s.replace(/\/+$/, '');
  return s || '/';
}
function toAbsolute(href) {
  if (!href) return href;
  if (/^https?:\/\//i.test(href)) return href;
  return `${SITE_URL}${href.startsWith('/') ? '' : '/'}${href}`;
}

const HEADINGS = {
  en: { book: 'Book this trip', related: 'Related & popular pages' },
  hi: { book: 'यह ट्रिप बुक करें', related: 'संबंधित एवं लोकप्रिय पेज' },
};

/**
 * RelatedLinks — per-page contextual internal links, computed at build time by
 * scripts/generate-link-graph.js. Funnels informational traffic to money pages,
 * passes equity to page-2 URLs (rank-rescue), and builds topical clusters.
 * Renders keyword-rich anchors + ItemList JSON-LD. Renders nothing if the page
 * has no generated set (fewer than 3 relevant links).
 */
export default function RelatedLinks({ path, lang = 'en' }) {
  const key = normalize(path);
  const items = (linkGraph.related && linkGraph.related[key]) || null;
  if (!items || items.length < 3) return null;

  const t = HEADINGS[lang] || HEADINGS.en;
  const booking = items.filter((i) => i.reason === 'book');
  const others = items.filter((i) => i.reason !== 'book');

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((i, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: toAbsolute(i.href),
      name: i.label,
    })),
  };

  return (
    <section aria-labelledby="related-links-heading" className="mx-auto my-10 w-full max-w-5xl px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      {booking.length > 0 && (
        <div className="mb-6 rounded-2xl border border-yellow-300 bg-yellow-50 p-5">
          <h2 className="text-lg font-bold text-gray-900">{t.book}</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {booking.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className="inline-flex items-center rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-300"
              >
                {i.label} →
              </Link>
            ))}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <>
          <h2 id="related-links-heading" className="text-xl font-bold tracking-tight text-gray-900">
            {t.related}
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {others.map((i) => (
              <li key={i.href}>
                <Link
                  href={i.href}
                  className="group flex items-start gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 transition-colors hover:border-orange-300 hover:text-orange-700"
                >
                  <span aria-hidden className="mt-0.5 text-orange-400 group-hover:text-orange-600">›</span>
                  <span className="font-medium leading-snug">{i.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
