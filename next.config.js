/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force no trailing slashes to prevent duplicate content
  trailingSlash: false,

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
        ...(process.env.NODE_ENV === 'development' ? [
          {
            source: '/api/:path*',
            destination: 'http://localhost:7071/api/:path*',
          },
        ] : []),
      ],
    };
  },

  async redirects() {
    return [
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
        destination: '/en/varanasi-transport-price-guide-2025',
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
        destination: '/en/services/where-to-stay-in-vindhyachal',
        permanent: true,
      },
      {
        source: '/city-tours',
        destination: '/en/services/varanasi-full-day-city-tour-winter-2025',
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
        destination: '/en/services/varanasi-full-day-city-tour-winter-2025',
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
        destination: '/en/varanasi-in-monsoon-july-september-2025',
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
        destination: '/en/varanasi-in-december-2025',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
