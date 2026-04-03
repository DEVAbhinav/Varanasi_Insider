const fs = require('fs');
const path = require('path');

const CONTENT_ROOT = path.join(__dirname, 'content');
const SITE_BASE = 'https://www.kashitaxi.in';

function safeReadDir(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

function normalizeCanonicalPath(input) {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const url = new URL(trimmed);
      if (url.origin !== SITE_BASE) return null;
      return url.pathname.replace(/\/+$/, '') || '/';
    } catch {
      return null;
    }
  }

  return (trimmed.startsWith('/') ? trimmed : `/${trimmed}`).replace(/\/+$/, '') || '/';
}

function getRootMarkdownSlugs(lang) {
  return new Set(
    safeReadDir(path.join(CONTENT_ROOT, lang))
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name.toLowerCase() !== 'index.md')
      .map((entry) => entry.name.replace(/\.md$/i, ''))
  );
}

function getScopedMarkdownSlugs(lang) {
  const folders = ['services', 'landing', 'guides', 'packages', 'bus'];
  const slugs = new Set();

  folders.forEach((folder) => {
    safeReadDir(path.join(CONTENT_ROOT, lang, folder))
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name.toLowerCase() !== 'index.md')
      .forEach((entry) => slugs.add(entry.name.replace(/\.md$/i, '')));
  });

  return slugs;
}

function buildRootCanonicalRedirects() {
  const redirects = [];
  const langs = ['en', 'hi'];

  langs.forEach((lang) => {
    safeReadDir(path.join(CONTENT_ROOT, lang))
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name.toLowerCase() !== 'index.md')
      .forEach((entry) => {
        const slug = entry.name.replace(/\.md$/i, '');
        const abs = path.join(CONTENT_ROOT, lang, entry.name);
        const raw = fs.readFileSync(abs, 'utf8');
        const canonicalMatch = raw.match(/^canonical:\s*["']?(.+?)["']?\s*$/m);
        const currentPath = `/${lang}/${slug}`;
        const canonicalPath = normalizeCanonicalPath(canonicalMatch?.[1]);

        if (canonicalPath && canonicalPath !== currentPath) {
          redirects.push({
            source: currentPath,
            destination: canonicalPath,
            permanent: true,
          });
        }
      });
  });

  return redirects;
}

function buildScopedRootRedirects() {
  const redirects = [];
  const langs = ['en', 'hi'];
  const folderToRoute = {
    services: 'services',
    landing: 'services',
    guides: 'services',
    packages: 'packages',
    bus: 'bus',
  };

  langs.forEach((lang) => {
    const rootSlugs = getRootMarkdownSlugs(lang);
    const usedSources = new Set();

    Object.entries(folderToRoute).forEach(([folder, routeBase]) => {
      safeReadDir(path.join(CONTENT_ROOT, lang, folder))
        .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name.toLowerCase() !== 'index.md')
        .forEach((entry) => {
          const slug = entry.name.replace(/\.md$/i, '');
          const source = `/${lang}/${slug}`;
          if (rootSlugs.has(slug) || usedSources.has(source)) return;
          usedSources.add(source);
          redirects.push({
            source,
            destination: `/${lang}/${routeBase}/${slug}`,
            permanent: true,
          });
        });
    });
  });

  return redirects;
}

function buildDestinationRootRedirects() {
  const redirects = [];
  const langs = ['en', 'hi'];

  langs.forEach((lang) => {
    const reserved = new Set([
      ...getRootMarkdownSlugs(lang),
      ...getScopedMarkdownSlugs(lang),
    ]);
    const destinationRoot = path.join(CONTENT_ROOT, lang, 'destinations');

    safeReadDir(destinationRoot)
      .filter((entry) => entry.isDirectory())
      .forEach((destinationEntry) => {
        const destination = destinationEntry.name;
        const destinationDir = path.join(destinationRoot, destination);

        safeReadDir(destinationDir)
          .filter((entry) => entry.isDirectory())
          .forEach((categoryEntry) => {
            const category = categoryEntry.name;
            const categoryDir = path.join(destinationDir, category);

            safeReadDir(categoryDir)
              .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name.toLowerCase() !== 'index.md')
              .forEach((entry) => {
                const slug = entry.name.replace(/\.md$/i, '');
                if (reserved.has(slug)) return;
                redirects.push({
                  source: `/${lang}/${slug}`,
                  destination: `/${lang}/city/${destination}/${category}/${slug}`,
                  permanent: true,
                });
              });
          });
      });
  });

  return redirects;
}

function dedupeRedirects(redirects) {
  const seen = new Set();
  return redirects.filter((redirect) => {
    const key = `${redirect.source}=>${redirect.destination}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force no trailing slashes to prevent duplicate content
  trailingSlash: false,

  // Allow images from Cloudinary CDN with modern formats
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 144, 256],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dkntlqbwr/**',
      },
    ],
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
    }
    return config
  },

  // Proxy API calls to local Azure Functions in development
  async rewrites() {
    return {
      beforeFiles: [
        // In development, proxy /api/* to Azure Functions running on port 7071
        // EXCLUDING /api/assistant which is handled locally by Next.js
        ...(process.env.NODE_ENV === 'development' ? [
          {
            source: '/api/:path((?!assistant).*)',
            destination: 'http://localhost:7071/api/:path*',
          },
        ] : []),
      ],
    };
  },

  async redirects() {
    return dedupeRedirects([
      // ===================================
      // CATEGORY 0: 404 Cleanup & Path Normalization
      // ===================================
      {
        source: '/:lang(en|hi)/destinations/:destination/:category/:slug',
        destination: '/:lang/city/:destination/:category/:slug',
        permanent: true,
      },
      // Duplicate Consolidations (2026-02-23)
      {
        source: '/en/taxi-service-varanasi',
        destination: '/en/city/varanasi/taxi/taxi-service-varanasi',
        permanent: true,
      },
      {
        source: '/en/24-7-taxi-varanasi',
        destination: '/en/city/varanasi/taxi/24-7-taxi-varanasi',
        permanent: true,
      },
      {
        source: '/en/airport-taxi-service-varanasi',
        destination: '/en/city/varanasi/taxi/airport-taxi-varanasi',
        permanent: true,
      },
      {
        source: '/en/city/varanasi/taxi/airport-taxi-service-varanasi',
        destination: '/en/city/varanasi/taxi/airport-taxi-varanasi',
        permanent: true,
      },
      {
        source: '/en/assi-ghat-aarti-time',
        destination: '/en/assi-ghat-evening-aarti-time',
        permanent: true,
      },
      {
        source: '/en/services/varanasi-airport-taxi-winter-2025',
        destination: '/en/varanasi-airport-taxi-price-guide',
        permanent: true,
      },
      {
        source: '/en/ganga-aarti-boat-booking-price',
        destination: '/en/evening-boat-ride-varanasi-ganga-aarti',
        permanent: true,
      },
      {
        source: '/hi/ganga-aarti-boat-booking-price',
        destination: '/hi/evening-boat-ride-varanasi-ganga-aarti',
        permanent: true,
      },
      {
        source: '/en/varanasi-to-allahabad-tempo-traveller',
        destination: '/en/varanasi-to-prayagraj-tempo-traveller',
        permanent: true,
      },
      {
        source: '/hi/varanasi-to-allahabad-tempo-traveller',
        destination: '/hi/varanasi-to-prayagraj-tempo-traveller',
        permanent: true,
      },
      {
        source: '/en/city/allahabad/taxi/varanasi-to-allahabad-taxi',
        destination: '/en/city/prayagraj/taxi/varanasi-to-prayagraj-taxi',
        permanent: true,
      },
      {
        source: '/varanasi/tour-packages/:slug',
        destination: '/en/city/varanasi/tour-packages/:slug',
        permanent: true,
      },
      {
        source: '/ayodhya/tour-packages/:slug',
        destination: '/en/city/ayodhya/tour-packages/:slug',
        permanent: true,
      },
      {
        source: '/hi/services',
        destination: '/hi/varanasi-transport-price-guide-2026',
        permanent: true,
      },
      {
        source: '/hi/services/',
        destination: '/hi/varanasi-transport-price-guide-2026',
        permanent: true,
      },
      {
        source: '/hi/sarnath-complete-guide',
        destination: '/en/sarnath-complete-guide',
        permanent: true,
      },
      {
        source: '/hi/city/varanasi/events/kashi-tamil-sangamam-2025-varanasi',
        destination: '/en/city/varanasi/events/kashi-tamil-sangamam-2026-varanasi',
        permanent: true,
      },

      // ===================================
      // CATEGORY 1: Missing Language Prefix
      // High-priority: Content exists but accessed without /en/ or /hi/
      // ===================================
      {
        source: '/navratri-in-vindhyachal-practical-guide',
        destination: '/en/navratri-in-vindhyachal-practical-guide',
        permanent: true,
      },
      {
        source: '/is-varanasi-safe-for-solo-female-travellers',
        destination: '/en/is-varanasi-safe-for-solo-female-travellers',
        permanent: true,
      },
      {
        source: '/varanasi-transport-price-guide-2025',
        destination: '/en/varanasi-transport-price-guide-2026',
        permanent: true,
      },
      {
        source: '/morning-boat-ride-varanasi-price',
        destination: '/en/morning-boat-ride-varanasi-price',
        permanent: true,
      },

      // ===================================
      // CATEGORY 2: Safety Guide Redirects
      // Multiple pages link to /varanasi-safety-guide which doesn't exist
      // ===================================
      {
        source: '/varanasi-safety-guide',
        destination: '/en/safety-and-security-in-varanasi-guide-for-solo-travellar',
        permanent: true,
      },
      {
        source: '/en/varanasi-safety-guide',
        destination: '/en/safety-and-security-in-varanasi-guide-for-solo-travellar',
        permanent: true,
      },
      {
        source: '/hi/varanasi-safety-guide',
        destination: '/en/safety-and-security-in-varanasi-guide-for-solo-travellar',
        permanent: true,
      },
      {
        source: '/en/safety-security-varanasi',
        destination: '/en/safety-and-security-in-varanasi-guide-for-solo-travellar',
        permanent: true,
      },

      // ===================================
      // CATEGORY 3: Airport Taxi URL Variations
      // ===================================
      {
        source: '/varanasi-airport-taxi-price',
        destination: '/en/varanasi-airport-taxi-price-guide',
        permanent: true,
      },
      {
        source: '/en/varanasi-airport-to-ghat-taxi',
        destination: '/en/varanasi-airport-taxi-price-guide',
        permanent: true,
      },

      // ===================================
      // CATEGORY 4: Kashi Vishwanath Redirects
      // ===================================
      {
        source: '/kashi-vishwanath-darshan-guide',
        destination: '/en/kashi-vishwanath-shivaratri-crowd-survival-guide',
        permanent: true,
      },

      // ===================================
      // CATEGORY 5: Old Blog Structure
      // Redirect old /blogs/[location] to relevant content
      // ===================================
      {
        source: '/blogs/Gaya',
        destination: '/en/varanasi-to-gaya-bodh-gaya-tour-package',
        permanent: true,
      },
      {
        source: '/blogs/Vindhyachal',
        destination: '/en/travel-from-varanasi-to-vindhyachal-guide',
        permanent: true,
      },
      {
        source: '/blogs/Prayagraj',
        destination: '/en/varanasi-to-prayagraj',
        permanent: true,
      },

      // ===================================
      // CATEGORY 6: Old Service/Package Structure
      // ===================================
      {
        source: '/services/hotel-booking-in-varanasi',
        destination: '/en/services/hotel-booking-in-varanasi',
        permanent: true,
      },
      {
        source: '/city-tours',
        destination: '/en/services/varanasi-full-day-city-tour-winter-2026',
        permanent: true,
      },
      {
        source: '/buddhist-circuit',
        destination: '/en/buddhist-circuit-tour-tempo-traveller-varanasi',
        permanent: true,
      },
      {
        source: '/boat',
        destination: '/en/morning-boat-ride-varanasi-price',
        permanent: true,
      },
      {
        source: '/packages',
        destination: '/en/packages',
        permanent: true,
      },

      // ===================================
      // CATEGORY 7: Old Package URL Structure
      // Redirect /en/package/* to new locations
      // ===================================
      {
        source: '/en/package/airport-pickup-drop',
        destination: '/en/varanasi-airport-taxi-price-guide',
        permanent: true,
      },
      {
        source: '/en/package/prayagraj-day-tour',
        destination: '/en/varanasi-to-prayagraj',
        permanent: true,
      },
      {
        source: '/en/package/varanasi-local-darshan',
        destination: '/en/services/varanasi-full-day-city-tour-winter-2026',
        permanent: true,
      },

      // ===================================
      // CATEGORY 8: Boat Ride URL Variations
      // ===================================
      {
        source: '/en/sunrise-boat-ride-varanasi',
        destination: '/en/sunrise-boat-ride-ganges',
        permanent: true,
      },

      // ===================================
      // CATEGORY 9: Hindi Pages (Redirect to English for now)
      // Create Hindi translations later, redirect to English versions
      // ===================================
      {
        source: '/hi/pilgrimage-guides',
        destination: '/en',
        permanent: false, // Temporary until we create the page
      },
      {
        source: '/hi/parikrama-guides',
        destination: '/en',
        permanent: false,
      },
      {
        source: '/hi/accommodation',
        destination: '/hi/where-to-stay-in-vindhyachal',
        permanent: true,
      },
      {
        source: '/hi/book',
        destination: '/hi',
        permanent: false,
      },
      {
        source: '/en/book',
        destination: '/en',
        permanent: false,
      },
      {
        source: '/hi/safety-and-security-in-varanasi-guide-for-solo-travellar',
        destination: '/en/safety-and-security-in-varanasi-guide-for-solo-travellar',
        permanent: false, // Temporary until Hindi translation
      },
      {
        source: '/hi/best-time-to-visit-varanasi',
        destination: '/en/best-time-to-visit-varanasi',
        permanent: false,
      },
      {
        source: '/hi/vegetarian-cafes-near-assi-ghat',
        destination: '/en',
        permanent: false,
      },
      {
        source: '/hi/best-things-to-do-in-varanasi',
        destination: '/en',
        permanent: false,
      },

      // ===================================
      // CATEGORY 10: Trailing Slash Redirects
      // Remove trailing slashes from URLs
      // ===================================
      {
        source: '/en/vegetarian-cafes-near-assi-ghat/',
        destination: '/en',
        permanent: true,
      },
      {
        source: '/en/best-things-to-do-in-varanasi/',
        destination: '/en',
        permanent: true,
      },
      {
        source: '/en/jageshwar-mahadev-varanasi-guide/',
        destination: '/en/jageshwar-mahadev-varanasi',
        permanent: true,
      },
      {
        source: '/en/varanasi-itinerary-3-days/',
        destination: '/en',
        permanent: true,
      },

      // ===================================
      // CATEGORY 11: Monsoon/Seasonal URL Variations
      // ===================================
      {
        source: '/en/varanasi-in-monsoon',
        destination: '/en/varanasi-in-monsoon-july-september-2026',
        permanent: true,
      },

      // ===================================
      // CATEGORY 12: Miscellaneous Pages
      // ===================================
      {
        source: '/author/abhinav-pandey',
        destination: '/en',
        permanent: false, // May create author page later
      },
      {
        source: '/author/abhinav-pandey/',
        destination: '/en',
        permanent: false,
      },
      {
        source: '/en/varanasi-to-gaya-bodh-gaya-tour-package',
        destination: '/en/varanasi-to-gaya-bodh-gaya-tour-package',
        permanent: true,
      },

      // ===================================
      // CATEGORY 13: December Guide Variations
      // ===================================
      {
        source: '/en/varanasi-in-december-2025-guide',
        destination: '/en/varanasi-in-december-2026',
        permanent: true,
      },

      // ===================================
      // CATEGORY 13b: January Guide Consolidation
      // ===================================
      {
        source: '/en/varanasi-january-weather-travel-guide',
        destination: '/en/city/varanasi/travel-guide/varanasi-in-january-2026',
        permanent: true,
      },
      {
        source: '/en/varanasi-in-january',
        destination: '/en/city/varanasi/travel-guide/varanasi-in-january-2026',
        permanent: true,
      },
      {
        source: '/en/varanasi-january-2025',
        destination: '/en/city/varanasi/travel-guide/varanasi-in-january-2026',
        permanent: true,
      },

      // ===================================
      // CATEGORY 14: Site Audit Fixes (2025-10-23)
      // Redirects based on sitemap verification
      // ===================================

      // Section folder canonicalization
      {
        source: '/:lang(en|hi)/guides/:slug',
        destination: '/:lang/services/:slug',
        permanent: true,
      },
      {
        source: '/:lang(en|hi)/landing/:slug',
        destination: '/:lang/services/:slug',
        permanent: true,
      },

      // Generic content pages - redirect to related existing content
      {
        source: '/en/best-things-to-do-in-varanasi',
        destination: '/en/guide-to-10-most-important-ghats-of-varanasi',
        permanent: true,
      },
      {
        source: '/en/vegetarian-cafes-near-assi-ghat',
        destination: '/en/assi-ghat-aarti-timings-2026',
        permanent: true,
      },
      {
        source: '/en/varanasi-itinerary-3-days',
        destination: '/en/tour-package-from-varanasi',
        permanent: true,
      },

      // Festival and Shivaratri content
      {
        source: '/en/maha-shivaratri-varanasi',
        destination: '/en/maha-shivaratri-2026-varanasi-guide',
        permanent: true,
      },
      {
        source: '/en/varanasi-festivals-calendar-2025-2026',
        destination: '/en/varanasi-in-december-2026',
        permanent: true,
      },
      {
        source: '/en/varanasi-festival-safety-guide',
        destination: '/en/is-varanasi-safe-for-solo-female-travellers',
        permanent: true,
      },

      // Dev Deepawali content
      {
        source: '/en/ganga-mahotsav-2025-classical-festival',
        destination: '/en/ganga-mahotsav-2026-classical-festival-varanasi',
        permanent: true,
      },
      {
        source: '/en/dev-deepawali-crowd-survival-guide',
        destination: '/en/dev-deepawali-crowd-survival-guide-varanasi',
        permanent: true,
      },
      {
        source: '/en/dev-deepawali-varanasi-guide',
        destination: '/en/dev-deepawali-2026-varanasi-ultimate-guide',
        permanent: true,
      },

      // Service pages - redirect to actual service pages
      {
        source: '/en/varanasi-safest-taxi-for-women',
        destination: '/en/services/varanasi-safest-taxi-for-women',
        permanent: true,
      },
      {
        source: '/en/varanasi-airport-taxi-winter-2025',
        destination: '/en/city/varanasi/taxi/airport-taxi-service-varanasi',
        permanent: true,
      },
      {
        source: '/en/varanasi-full-day-city-tour-winter-2025',
        destination: '/en/services/varanasi-full-day-city-tour-winter-2026',
        permanent: true,
      },
      {
        source: '/en/varanasi-ayodhya-prayagraj-pilgrimage-taxi',
        destination: '/en/services/varanasi-ayodhya-prayagraj-pilgrimage-taxi',
        permanent: true,
      },
      {
        source: '/en/landing/dev-deepawali-taxi-booking-varanasi',
        destination: '/en/varanasi-airport-taxi-price-guide',
        permanent: true,
      },

      // Vindhyachal accommodation - English only (Hindi exists at base level)
      {
        source: '/en/where-to-stay-in-vindhyachal',
        destination: '/en/services/where-to-stay-in-vindhyachal',
        permanent: true,
      },

      // Group tour packages
      {
        source: '/en/varanasi-group-tour-packages',
        destination: '/en/packages/varanasi-customised-packages-tour',
        permanent: true,
      },

      // Hindi pages - redirect to existing Hindi service pages
      {
        source: '/hi/buddhist-circuit-tour-tempo-traveller-varanasi',
        destination: '/en/buddhist-circuit-tour-tempo-traveller-varanasi',
        permanent: true,
      },
      {
        source: '/hi/pink-taxi-varanasi',
        destination: '/hi/services/varanasi-safest-taxi-for-women',
        permanent: true,
      },
      {
        source: '/hi/varanasi-safest-taxi-for-women',
        destination: '/hi/services/varanasi-safest-taxi-for-women',
        permanent: true,
      },

      // Home page redirect
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },

      // ===================================
      // CATEGORY 15: Year Migration 2025 → 2026 (April 2026)
      // 301 redirects to transfer authority from old 2025 slugs
      // ===================================
      { source: '/en/assi-ghat-aarti-timings-2025', destination: '/en/assi-ghat-aarti-timings-2026', permanent: true },
      { source: '/en/dev-deepawali-2025-varanasi-ultimate-guide', destination: '/en/dev-deepawali-2026-varanasi-ultimate-guide', permanent: true },
      { source: '/en/dev-deepawali-boat-ride-pricing-guide-2025', destination: '/en/dev-deepawali-boat-ride-pricing-guide-2026', permanent: true },
      { source: '/en/dev-deepawali-photography-guide-2025', destination: '/en/dev-deepawali-photography-guide-2026', permanent: true },
      { source: '/en/ganga-mahotsav-2025-classical-festival-varanasi', destination: '/en/ganga-mahotsav-2026-classical-festival-varanasi', permanent: true },
      { source: '/en/nag-nathaiya-festival-varanasi-2025', destination: '/en/nag-nathaiya-festival-varanasi-2026', permanent: true },
      { source: '/en/ultimate-guide-ramlila-dussehra-varanasi-2025', destination: '/en/ultimate-guide-ramlila-dussehra-varanasi-2026', permanent: true },
      { source: '/en/varanasi-in-december-2025', destination: '/en/varanasi-in-december-2026', permanent: true },
      { source: '/en/varanasi-in-monsoon-july-september-2025', destination: '/en/varanasi-in-monsoon-july-september-2026', permanent: true },
      { source: '/en/varanasi-in-november-2025-insider-guide', destination: '/en/varanasi-in-november-2026-insider-guide', permanent: true },
      { source: '/en/varanasi-in-october-2025', destination: '/en/varanasi-in-october-2026', permanent: true },
      { source: '/en/varanasi-transport-price-guide-2025', destination: '/en/varanasi-transport-price-guide-2026', permanent: true },
      { source: '/en/services/varanasi-full-day-city-tour-winter-2025', destination: '/en/services/varanasi-full-day-city-tour-winter-2026', permanent: true },
      { source: '/en/city/varanasi/travel-guide/varanasi-in-january-2025', destination: '/en/city/varanasi/travel-guide/varanasi-in-january-2026', permanent: true },
      { source: '/en/city/varanasi/events/kashi-tamil-sangamam-2025-varanasi', destination: '/en/city/varanasi/events/kashi-tamil-sangamam-2026-varanasi', permanent: true },
      { source: '/en/city/varanasi/events/kartik-purnima-ganga-snan-varanasi-2025', destination: '/en/city/varanasi/events/kartik-purnima-ganga-snan-varanasi-2026', permanent: true },
      { source: '/en/city/varanasi/events/mahindra-kabira-festival-2025-varanasi', destination: '/en/city/varanasi/events/mahindra-kabira-festival-2026-varanasi', permanent: true },
      { source: '/en/city/varanasi/activities/ganga-aarti-timing-varanasi-2025', destination: '/en/city/varanasi/activities/ganga-aarti-timing-varanasi-2026', permanent: true },
      { source: '/en/city/varanasi/activities/sunrise-yoga-varanasi-2025', destination: '/en/city/varanasi/activities/sunrise-yoga-varanasi-2026', permanent: true },
      { source: '/en/city/varanasi/sightseeing/kashi-vishwanath-temple-ganga-aarti-spiritual-journey-2025', destination: '/en/city/varanasi/sightseeing/kashi-vishwanath-temple-ganga-aarti-spiritual-journey-2026', permanent: true },
      { source: '/en/city/varanasi/shopping/banarasi-silk-saree-shopping-varanasi-2025', destination: '/en/city/varanasi/shopping/banarasi-silk-saree-shopping-varanasi-2026', permanent: true },
      { source: '/hi/varanasi-transport-price-guide-2025', destination: '/hi/varanasi-transport-price-guide-2026', permanent: true },
      { source: '/hi/assi-ghat-aarti-timings-2025', destination: '/hi/assi-ghat-aarti-timings-2026', permanent: true },
      { source: '/hi/dev-deepawali-2025-varanasi-ultimate-guide', destination: '/hi/dev-deepawali-2026-varanasi-ultimate-guide', permanent: true },
      { source: '/hi/dev-deepawali-photography-guide-2025', destination: '/hi/dev-deepawali-photography-guide-2026', permanent: true },
      { source: '/hi/dev-deepawali-boat-ride-pricing-guide-2025', destination: '/hi/dev-deepawali-boat-ride-pricing-guide-2026', permanent: true },
      { source: '/hi/ganga-mahotsav-2025-classical-festival-varanasi', destination: '/hi/ganga-mahotsav-2026-classical-festival-varanasi', permanent: true },
      { source: '/hi/varanasi-in-december-2025', destination: '/hi/varanasi-in-december-2026', permanent: true },
      { source: '/hi/varanasi-in-october-2025', destination: '/hi/varanasi-in-october-2026', permanent: true },
      { source: '/hi/varanasi-in-november-2025-insider-guide', destination: '/hi/varanasi-in-november-2026-insider-guide', permanent: true },
      { source: '/hi/varanasi-in-monsoon-july-september-2025', destination: '/hi/varanasi-in-monsoon-july-september-2026', permanent: true },
      { source: '/en/varanasi-in-february-2025', destination: '/en/varanasi-in-february-2026', permanent: true },
      { source: '/hi/varanasi-in-february-2025', destination: '/hi/varanasi-in-february-2026', permanent: true },
      { source: '/en/maha-shivaratri-2025-varanasi-guide', destination: '/en/maha-shivaratri-2026-varanasi-guide', permanent: true },
      { source: '/en/makar-sankranti-2025-varanasi-kite-festival-guide', destination: '/en/makar-sankranti-2026-varanasi-kite-festival-guide', permanent: true },
      { source: '/en/varanasi-kite-wars-tourist-guide-makar-sankranti-2025', destination: '/en/varanasi-kite-wars-tourist-guide-makar-sankranti-2026', permanent: true },

      ...buildRootCanonicalRedirects(),
      ...buildScopedRootRedirects(),
      ...buildDestinationRootRedirects(),
    ]);
  },
}

module.exports = nextConfig
