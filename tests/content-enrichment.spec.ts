import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/* ────────────────────────────────────────────────────────────────
 *  Content-level verification for P1-enriched pages.
 *  These tests read markdown files directly — no server needed.
 * ──────────────────────────────────────────────────────────────── */

const CONTENT_ROOT = path.resolve(__dirname, '..', 'content', 'en');

interface PageSpec {
  file: string;              // relative to content/en
  slug: string;
  minWords: number;
  minFaq: number;
  minRelatedPosts: number;
  minImages: number;         // inline markdown images (![...)
  requiredKeywords?: string[];
}

const PAGES: PageSpec[] = [
  {
    file: 'destinations/varanasi/tour-packages/varanasi-3-day-tour.md',
    slug: 'varanasi-3-day-tour',
    minWords: 5000,
    minFaq: 8,
    minRelatedPosts: 6,
    minImages: 5,
    requiredKeywords: ['varanasi 3 day', 'kashi 3 day tour'],
  },
  {
    file: 'destinations/varanasi/tour-packages/ayodhya-varanasi-3-day-tour.md',
    slug: 'ayodhya-varanasi-3-day-tour',
    minWords: 3000,
    minFaq: 8,
    minRelatedPosts: 6,
    minImages: 4,
    requiredKeywords: ['ayodhya varanasi tour'],
  },
  {
    file: 'ayodhya-varanasi-prayagraj-group-tour-package.md',
    slug: 'ayodhya-varanasi-prayagraj-group-tour-package',
    minWords: 2500,
    minFaq: 8,
    minRelatedPosts: 5,
    minImages: 3,
  },
  {
    file: 'tourist-spots-varanasi.md',
    slug: 'tourist-spots-varanasi',
    minWords: 5000,
    minFaq: 8,
    minRelatedPosts: 10,
    minImages: 10,
    requiredKeywords: ['tourist spots in varanasi'],
  },
  {
    file: 'destinations/varanasi/tour-packages/varanasi-2-day-tour.md',
    slug: 'varanasi-2-day-tour',
    minWords: 4000,
    minFaq: 8,
    minRelatedPosts: 6,
    minImages: 5,
  },
];

const readPage = (relPath: string) => {
  const full = path.join(CONTENT_ROOT, relPath);
  const raw = fs.readFileSync(full, 'utf-8');
  const { data, content } = matter(raw);
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const imageCount = (content.match(/!\[/g) || []).length;
  return { data, content, wordCount, imageCount };
};

/* ─── Per-page property checks ──────────────────────────────── */

test.describe('Content enrichment verification', () => {
  for (const spec of PAGES) {
    test.describe(spec.slug, () => {
      let data: Record<string, unknown>;
      let content: string;
      let wordCount: number;
      let imageCount: number;

      test.beforeAll(() => {
        ({ data, content, wordCount, imageCount } = readPage(spec.file));
      });

      test('slug matches', () => {
        expect(data.slug).toBe(spec.slug);
      });

      test(`word count ≥ ${spec.minWords}`, () => {
        expect(wordCount).toBeGreaterThanOrEqual(spec.minWords);
      });

      test(`faqSchema ≥ ${spec.minFaq}`, () => {
        const faq = data.faqSchema as Array<{ question: string; answer: string }>;
        expect(Array.isArray(faq)).toBe(true);
        expect(faq.length).toBeGreaterThanOrEqual(spec.minFaq);
        for (const item of faq) {
          expect(item.question.length).toBeGreaterThan(10);
          expect(item.answer.length).toBeGreaterThan(20);
        }
      });

      test(`relatedPosts ≥ ${spec.minRelatedPosts}`, () => {
        const rp = data.relatedPosts as string[];
        expect(Array.isArray(rp)).toBe(true);
        expect(rp.length).toBeGreaterThanOrEqual(spec.minRelatedPosts);
        for (const slug of rp) {
          expect(typeof slug).toBe('string');
          expect(slug.length).toBeGreaterThan(3);
        }
      });

      test(`inline images ≥ ${spec.minImages}`, () => {
        expect(imageCount).toBeGreaterThanOrEqual(spec.minImages);
      });

      test('has metaTitle and metaDescription', () => {
        expect(typeof data.metaTitle).toBe('string');
        expect((data.metaTitle as string).length).toBeGreaterThan(10);
        expect(typeof data.metaDescription).toBe('string');
        expect((data.metaDescription as string).length).toBeGreaterThan(30);
      });

      if (spec.requiredKeywords) {
        test('required keywords present', () => {
          const kw = data.keywords as string[];
          expect(Array.isArray(kw)).toBe(true);
          for (const required of spec.requiredKeywords!) {
            const found = kw.some((k) => k.toLowerCase().includes(required.toLowerCase()));
            expect(found, `keyword containing "${required}" not found`).toBe(true);
          }
        });
      }
    });
  }
});

/* ─── Cross-link trio verification ──────────────────────────── */

test.describe('Sightseeing trio cross-links', () => {
  const TRIO = [
    { file: 'tourist-spots-varanasi.md', slug: 'tourist-spots-varanasi' },
    { file: 'varanasi-sightseeing-complete-guide.md', slug: 'varanasi-sightseeing-complete-guide' },
    { file: 'destinations/varanasi/sightseeing/varanasi-local-sightseeing-package.md', slug: 'varanasi-local-sightseeing-package' },
  ];

  for (const page of TRIO) {
    test(`${page.slug} links to both other trio pages`, () => {
      const { data, content } = readPage(page.file);
      const rp = data.relatedPosts as string[];
      const others = TRIO.filter((t) => t.slug !== page.slug);

      for (const other of others) {
        const inRP = rp.includes(other.slug);
        const inBody = content.includes(other.slug);
        expect(
          inRP || inBody,
          `${page.slug} should reference ${other.slug} in relatedPosts or body`,
        ).toBe(true);
      }
    });
  }
});

/* ─── Batch relatedPosts verification (sample) ──────────────── */

test.describe('Batch relatedPosts — sample taxi pages', () => {
  const TAXI_SAMPLES = [
    'destinations/varanasi/taxi/airport-taxi-varanasi.md',
    'destinations/varanasi/taxi/24-7-taxi-varanasi.md',
    'destinations/varanasi/taxi/one-way-taxi-varanasi.md',
  ];

  for (const file of TAXI_SAMPLES) {
    test(`${path.basename(file)} has relatedPosts`, () => {
      const { data } = readPage(file);
      const rp = data.relatedPosts as string[];
      expect(Array.isArray(rp)).toBe(true);
      expect(rp.length).toBeGreaterThanOrEqual(1);
    });
  }
});

/* ─── Temple section richness in tourist-spots ──────────────── */

test.describe('Temple sections enriched in tourist-spots', () => {
  const TEMPLES = [
    'Sankat Mochan Hanuman Temple',
    'Durga Temple (Durga Kund)',
    'New Vishwanath Temple (BHU/Birla Temple)',
    'Tulsi Manas Mandir',
    'Bharat Mata Temple',
    'Kala Bhairav Temple',
  ];

  let content: string;

  test.beforeAll(() => {
    ({ content } = readPage('tourist-spots-varanasi.md'));
  });

  for (const temple of TEMPLES) {
    test(`${temple} section has practical details`, () => {
      // Find the section by heading
      const idx = content.indexOf(temple);
      expect(idx, `heading for ${temple} not found`).toBeGreaterThan(-1);

      // Extract ~2500 chars after heading
      const section = content.slice(idx, idx + 2500);

      expect(section).toContain('**Timings:**');
      expect(section).toContain('**Entry Fee:**');
      expect(section).toContain('**Photography:**');
      expect(section).toContain('**Location:**');
    });
  }
});
