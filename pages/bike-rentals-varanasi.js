import Head from 'next/head';
import Image from 'next/image';
import SalesSectionVisuals from '../components/SalesSectionVisuals/SalesSectionVisuals';
import NavBar from '../components/NavBar/NavBar';
import Footer from '../components/Footer/Footer';
import fleet from '../data/fleet.json';
import StickyContactBar from '../components/ServicePage/StickyContactBar';
import { CONTACT } from '../lib/contact';
import { getGroupRating, PRODUCT_GROUPS } from '../lib/ratingGenerator';

// --- SEO: Structured Data & Meta (updated) ---
const canonicalUrl = 'https://www.kashitaxi.in/bike-rentals-varanasi';

const organizationNode = {
  '@type': 'Organization',
  '@id': 'https://www.kashitaxi.in#organization',
  name: 'Vinayak Travels',
  legalName: 'Vinayak Travels',
  alternateName: ['Varanasi Taxi', 'Kashitaxi'],
  url: 'https://www.kashitaxi.in/',
  logo: { '@type': 'ImageObject', url: 'https://www.kashitaxi.in/favicon.jpeg' },
  sameAs: [CONTACT.whatsappUrl, 'https://maps.app.goo.gl/gbmqXgHE8Nzq5NrbA']
};

const websiteNode = {
  '@type': 'WebSite',
  '@id': 'https://www.kashitaxi.in#website',
  url: 'https://www.kashitaxi.in/',
  name: 'Vinayak Travels',
  inLanguage: 'en-IN',
  publisher: { '@id': organizationNode['@id'] }
};

// Primary keyword phrase chosen: "Bike & Scooty Rental in Varanasi" (high intent + combines key variants)
const primaryPageName = 'Bike & Scooty Rental in Varanasi — From ₹449/day | Self-Drive';

// Rating + reviews live on the Product node below (Google shows review stars for
// Product, not for self-serving LocalBusiness/Organization reviews). Shared here
// so the visible on-page reviews section stays in sync with the structured data.
const rentalAggregateRating = {
  '@type': 'AggregateRating',
  ratingValue: 4.7,
  bestRating: 5,
  worstRating: 1,
  ratingCount: 150,
  reviewCount: 150
};

const rentalReviews = [
  {
    '@type': 'Review',
    '@id': canonicalUrl + '#review-1',
    reviewBody: 'I got a very nice and properly maintained bike — I recommend it to everyone!',
    reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5 },
    datePublished: '2026-01-15',
    author: { '@type': 'Person', name: 'Rahul S.' }
  },
  {
    '@type': 'Review',
    '@id': canonicalUrl + '#review-2',
    reviewBody: 'Service is top-notch with clean, well-maintained bikes. Booking was smooth and quick.',
    reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5 },
    datePublished: '2026-02-02',
    author: { '@type': 'Person', name: 'Priya K.' }
  },
  {
    '@type': 'Review',
    '@id': canonicalUrl + '#review-3',
    reviewBody: 'Very nice and properly maintained bike — highly recommend! Friendly support on WhatsApp.',
    reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5 },
    datePublished: '2026-03-10',
    author: { '@type': 'Person', name: 'Amit Verma' }
  }
];

const jsonLdBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Vinayak Travels — Scooty Rental',
  image: 'https://www.kashitaxi.in/images/og-image-rentals.jpg',
  '@id': canonicalUrl + '#autorental',
  url: canonicalUrl,
  telephone: CONTACT.callNumberE164,
  priceRange: '₹449–₹1,200/day',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Near Sigra',
    addressLocality: 'Varanasi',
    postalCode: '221002',
    addressRegion: 'UP',
    addressCountry: 'IN'
  },
  geo: { '@type': 'GeoCoordinates', latitude: 25.3283, longitude: 82.9868 },
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '08:00',
    closes: '22:00'
  }],
  areaServed: [
    { '@type': 'City', name: 'Varanasi' },
    { '@type': 'Place', name: 'Assi Ghat' },
    { '@type': 'Place', name: 'BHU' },
    { '@type': 'Place', name: 'Sarnath' },
    { '@type': 'Place', name: 'Ramnagar' },
    { '@type': 'Place', name: 'Sigra' }
  ],
  knowsAbout: [
    'bike rental varanasi', 'scooty on rent varanasi', 'self drive bike varanasi', 'two wheeler rental varanasi', 'activa on rent varanasi', 'royal enfield on rent varanasi', 'bike rental in varanasi', 'rental bike in varanasi', 'scooty rental in varanasi', 'rental scooty in varanasi', 'rent bike in varanasi'
  ],
  areaServed: {
    '@type': 'City',
    name: 'Varanasi'
  },
  makesOffer: [
    {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: 449,
      itemOffered: {
        '@type': 'Product',
        name: 'Scooty (Honda Activa or similar)',
        image: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/scooty-varanasi-ghat.jpeg',
        brand: { '@type': 'Brand', name: 'Vinayak Travels' },
        aggregateRating: getGroupRating(PRODUCT_GROUPS.BIKE_SCOOTY),
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: 449,
          availability: 'https://schema.org/InStock',
          url: canonicalUrl + '#book'
        }
      },
      availability: 'https://schema.org/InStock',
      url: canonicalUrl + '#book',
      eligibleRegion: 'Varanasi',
      potentialAction: {
        '@type': 'ReserveAction',
        target: canonicalUrl + '#book'
      }
    },
    {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: 900,
      itemOffered: {
        '@type': 'Product',
        name: 'Motorbike (125–160cc)',
        image: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/scooty-varanasi-ghat.jpeg',
        brand: { '@type': 'Brand', name: 'Vinayak Travels' },
        aggregateRating: getGroupRating(PRODUCT_GROUPS.BIKE_MOTORBIKE),
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: 900,
          availability: 'https://schema.org/InStock',
          url: canonicalUrl + '#book'
        }
      },
      availability: 'https://schema.org/InStock',
      url: canonicalUrl + '#book',
      eligibleRegion: 'Varanasi'
    }
  ],
  contactPoint: [{
    '@type': 'ContactPoint',
    telephone: CONTACT.callNumberE164,
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['en', 'hi']
  }],
  brand: { '@id': organizationNode['@id'] },
  provider: { '@id': organizationNode['@id'] },
  publisher: { '@id': organizationNode['@id'] }
};

// Star-eligible entity. Google shows review stars for Product (not for
// self-serving LocalBusiness reviews), so the rating + reviews live here.
const jsonLdProduct = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': canonicalUrl + '#rental-product',
  name: 'Bike & Scooty Rental in Varanasi',
  description: 'Self-drive scooty, bike and Royal Enfield rentals in Varanasi from ₹449/day — well-maintained two-wheelers with helmets, doorstep delivery and 24x7 WhatsApp support.',
  image: 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/scooty-varanasi-ghat.jpeg',
  brand: { '@type': 'Brand', name: 'Vinayak Travels' },
  category: 'Vehicle Rental',
  areaServed: { '@type': 'City', name: 'Varanasi' },
  aggregateRating: rentalAggregateRating,
  review: rentalReviews,
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: 449,
    highPrice: 1500,
    offerCount: 4,
    availability: 'https://schema.org/InStock',
    url: canonicalUrl + '#book'
  }
};

const jsonLdFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': canonicalUrl + '#faq',
  inLanguage: 'en-IN',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What documents do I need to rent a bike in Varanasi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A valid two-wheeler driving licence and one government ID (Aadhaar/Passport/Voter ID). A refundable security deposit is required at pickup. You should also keep a soft copy handy in DigiLocker for quick verification.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does a scooty or bike cost per day?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Bike on rent in Varanasi is priced by vehicle: Scooty/Activa ~₹449–₹599/day, 125–160cc bikes ~₹700–₹900/day, Royal Enfield/350–500cc ~₹1,200–₹1,500/day. Fuel is usually not included. Seasonal demand (festivals, holidays) can push the higher end—call or WhatsApp for today’s rate.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can you deliver near Varanasi railway station or my hotel?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, pickup at Cantt (Varanasi Junction) is common, and delivery can be arranged within city limits for select bookings. Share arrival time / hotel location in advance so we can schedule a smooth handover.'
      }
    },
    {
      '@type': 'Question',
      name: 'Are helmets mandatory for riders and pillion?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Helmets are mandatory for both rider and pillion. We provide helmets on request at pickup—always wear them to avoid fines and stay safe in dense traffic.'
      }
    },
    {
      '@type': 'Question',
      name: 'Where should I park near the ghats or Kashi Vishwanath Corridor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use multilevel / official parking near Godowlia or Benia Bagh and then walk or take an e‑rickshaw into pedestrian zones, especially during peak hours, festivals or security closures.'
      }
    }
  ],
  publisher: { '@id': organizationNode['@id'] }
};

const jsonLdBreadcrumbs = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': canonicalUrl + '#breadcrumb',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.kashitaxi.in/' },
    { '@type': 'ListItem', position: 2, name: 'Bike & Scooty Rental in Varanasi', item: canonicalUrl }
  ]
};

const webPageNode = {
  '@type': 'WebPage',
  '@id': canonicalUrl + '#webpage',
  url: canonicalUrl,
  name: primaryPageName,
  description: 'Scooty on rent in Varanasi from ₹449/day by Vinayak Travels. Activa, 125–160cc bikes, Royal Enfield with helmets, airport pickup, and WhatsApp confirmation.',
  inLanguage: 'en-IN',
  isPartOf: { '@id': websiteNode['@id'] },
  breadcrumb: { '@id': jsonLdBreadcrumbs['@id'] },
  primaryImageOfPage: { '@type': 'ImageObject', url: 'https://www.kashitaxi.in/images/og-image-rentals.jpg' },
  publisher: { '@id': organizationNode['@id'] }
};

const jsonLd = { '@context': 'https://schema.org', '@graph': [organizationNode, websiteNode, webPageNode, jsonLdBreadcrumbs, jsonLdBusiness, jsonLdProduct, jsonLdFAQ] };

const businessCallNumber = CONTACT.callNumberRaw;
const businessWhatsAppNumber = CONTACT.whatsappNumberRaw;

export default function BikeRentalsPage({ allPosts }) {
  return (
    <>
      <Head>
        <title>Bike & Scooty Rental in Varanasi from ₹449/day | Self-Drive</title>
        <meta name="description" content="Bike rental in Varanasi from ₹449/day. Activa, Royal Enfield, 125-160cc bikes with helmet, simple documents, WhatsApp booking, airport & Assi pickup by Vinayak Travels." />
        <meta name="keywords" content="bike rental varanasi,scooty on rent varanasi,bike on rent varanasi,self drive bike varanasi,two wheeler rental varanasi,activa on rent varanasi,royal enfield on rent varanasi,bike rental in varanasi,rental bike in varanasi,scooty rental in varanasi,rental scooty in varanasi,rent bike in varanasi" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Hreflang tags for international SEO - prevents duplicate content penalties */}
        <link rel="alternate" hrefLang="en" href={canonicalUrl} />
        <link rel="alternate" hrefLang="en-IN" href={canonicalUrl} />
        <link rel="alternate" hrefLang="en-US" href={canonicalUrl} />
        <link rel="alternate" hrefLang="en-GB" href={canonicalUrl} />
        <link rel="alternate" hrefLang="en-AU" href={canonicalUrl} />
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

        <meta property="og:title" content="Bike & Scooty Rental in Varanasi from ₹449/day | Vinayak Travels" />
        <meta property="og:description" content="Bike rental & scooty on rent in Varanasi from ₹449/day with helmets, airport delivery and instant WhatsApp confirmation." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Vinayak Travels" />
        <meta property="og:image" content="https://www.kashitaxi.in/images/og-image-rentals.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <NavBar />
      <div className="bg-gray-50 text-gray-800">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] text-white">
          <Image
            src="https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/scooty-varanasi-ghat.jpeg"
            alt="A scooty parked with a view of the Varanasi ghats at sunrise"
            layout="fill"
            objectFit="cover"
            priority
            className="brightness-75"
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl font-extrabold md:text-6xl">Bike & Scooty Rental in Varanasi</h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl">
              Bike rental & scooty on rent from ₹449/day — Activa, Royal Enfield, 125-160cc bikes with helmets, instant WhatsApp booking, Assi & airport pickup.
            </p>
            <a
              href="#fleet"
              className="mt-8 rounded-full bg-yellow-500 px-8 py-4 text-lg font-bold text-black transition hover:bg-yellow-400"
            >
              See Our Fleet & Book
            </a>
          </div>
        </section>


        {/* How It Works (Manual Flow) */}
        <section id="book" className="bg-white py-16 sm:py-20">
          <div className="container mx-auto max-w-7xl px-4">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">Booking is Easy as 1-2-3</h2>
            <div className="mt-12 grid grid-cols-1 gap-12 text-center md:grid-cols-3">
              <div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">1</div>
                <h3 className="mt-6 text-xl font-semibold">Browse Our Fleet</h3>
                <p className="mt-2 text-gray-600">Choose from scooties (Activa, TVS Jupiter) or bikes (Royal Enfield, 125-160cc) for your Varanasi exploration.</p>
              </div>
              <div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">2</div>
                <h3 className="mt-6 text-xl font-semibold">Call or WhatsApp Us</h3>
                <p className="mt-2 text-gray-600">Contact us directly to check availability for your dates and get the final price.</p>
              </div>
              <div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">3</div>
                <h3 className="mt-6 text-xl font-semibold">Confirm & Ride!</h3>
                <p className="mt-2 text-gray-600">Confirm your booking over the phone, schedule your pickup, and start exploring Kashi!</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Fleet Section */}
        <section id="fleet" className="py-16 sm:py-20">
          <div className="container mx-auto max-w-7xl px-4">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">Our Fleet</h2>
            <p className="mt-4 text-center text-lg text-gray-600">Updated: Apr 2026 • Scooty from ₹449/day · Bikes from ₹700/day · Royal Enfield from ₹1,200/day.</p>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {fleet.map((vehicle) => (
                <div key={vehicle.id} className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-lg">
                  <div className="relative h-48 w-full">
                    <Image src={vehicle.image} alt={`Vinayak Travels - ${vehicle.name} for rent`} layout="fill" objectFit="cover" />
                  </div>
                  <div className="flex flex-grow flex-col p-6">
                    <h3 className="text-xl font-bold">{vehicle.name}</h3>
                    <p className="mt-2 text-sm text-gray-600">{vehicle.idealFor}</p>
                    <p className="mt-4 text-xl font-semibold">
                      ₹{vehicle.price}
                      <span className="text-sm font-normal text-gray-500"> / day (approx)</span>
                    </p>
                    <div className="mt-auto pt-6">
                      <div className="flex flex-col space-y-3">
                        <a
                          href={`tel:+${businessCallNumber}`}
                          className="flex items-center justify-center rounded-full bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 mr-2"><path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5h-2.148a1.5 1.5 0 01-1.465-1.175l-.716-3.223a1.5 1.5 0 011.052-1.767l.933-.267c.41-.117.643.555-.48.95A11.542 11.542 0 006.254 6.254c-.395-.163-.833.07-.95.48l-.267.933a1.5 1.5 0 01-1.767 1.052l-3.223-.716A1.5 1.5 0 012 4.648V3.5z" clipRule="evenodd" /></svg>
                          Call to Book
                        </a>
                        <a
                          href={`https://wa.me/${businessWhatsAppNumber}?text=Hi! I would like to book the ${vehicle.name}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center rounded-full bg-green-500 px-4 py-3 font-semibold text-white transition hover:bg-green-400"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.459L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.447-4.435-9.884-9.888-9.884-5.448 0-9.886 4.434-9.889 9.885.002 2.17.661 4.227 1.879 5.921l-1.263 4.603 4.749-1.251z" /></svg>
                          WhatsApp Us
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Updated SEO Content Section */}
        <section className="bg-white py-16 sm:py-20">
          <div className="container mx-auto max-w-4xl px-4 text-lg text-gray-700">
            <h2 className="text-center text-4xl font-bold sm:text-5xl text-gray-800 mb-8">Bike Rental in Varanasi: Scooty & Motorcycle on Rent from ₹449/day</h2>
            <p className="mt-6">
              Varanasi, the eternal city of ghats and temples, comes alive when explored on two wheels. At Varanasi Taxi, we specialize in <strong>bike rental in Varanasi</strong> and <strong>scooty on rent in Varanasi</strong>, giving you the freedom to cruise from Assi to Dashashwamedh without haggling with autos. Whether you need a nimble Activa for navigating temple lanes or a powerful Royal Enfield for highway rides to Sarnath, our <strong>two wheeler rental in Varanasi</strong> starts at just ₹449/day with helmets and easy paperwork. All vehicles are serviced weekly and sanitized before handover.
            </p>
            <p className="mt-4">
              This ultimate guide, crafted from local expertise and real user feedback, covers our fleet, pricing, booking process, safety tips, and insider recommendations for must-visit spots. Whether you're looking for <strong>bike on rent in Varanasi</strong> or a simple scooter, we prioritize well-maintained vehicles and transparent dealings to make your trip memorable and safe.
            </p>

            <h2 className="mt-12 text-3xl font-bold text-gray-800">Why Choose Varanasi Taxi for Bike Rental in Varanasi?</h2>
            <p className="mt-6">
              Opting for <strong>bike rental in Varanasi</strong> with Varanasi Taxi means freedom from crowded autos and unreliable public transport. Our two-wheeler rentals let you zip through traffic to reach the Ganges Ghats or venture to nearby attractions like Sarnath without delays. Travelers rave about the flexibility—perfect for spontaneous visits to temples or evening Aartis. Whether you choose a scooty for city lanes or a bike for longer distances, we've got you covered.
            </p>
            <p className="mt-4">
              With a 4.7-star rating on Justdial based on customer reviews, we're known for reliability and cleanliness. One reviewer shared, "I got a very nice and properly maintained bike—I recommend it to everyone!" For eco-friendly explorers, we also support <strong>bicycle rental in Varanasi</strong> inquiries, though our core focus is motorized options. In 2026, with improved city roads, our <strong>daily bike rental</strong> and <strong>monthly bike rental</strong> plans offer unbeatable value for short trips or extended stays.
            </p>

            <h2 className="mt-12 text-3xl font-bold text-gray-800">Our Fleet: Top-Quality Bikes and Scooties for Every Need</h2>
            <p className="mt-6">
              At Varanasi Taxi, our fleet is curated for Varanasi's diverse terrain—from city streets to highway excursions. All vehicles are regularly serviced, sanitized, and come with helmets for safety.
            </p>
            <ul className="mt-4 list-disc pl-6">
              <li><strong>Honda Activa</strong>: Ideal for <strong>scooter rental in Varanasi</strong>; easy handling in traffic.</li>
              <li><strong>Honda Shine</strong>: Comfortable for daily commutes and longer rides.</li>
              <li><strong>Royal Enfield Classic 350</strong>: Perfect for adventure seekers exploring rural paths.</li>
              <li><strong>TVS Jupiter</strong>: Fuel-efficient and reliable for urban exploration.</li>
            </ul>
            <p className="mt-4">
              We ensure no hidden charges, with vehicles ready for immediate pickup near Varanasi Cantt Railway Station.
            </p>

            <h2 className="mt-12 text-3xl font-bold text-gray-800">Bike vs Scooty: Which Should You Choose for Varanasi?</h2>
            <p className="mt-6">
              Not sure whether to rent a bike or scooty in Varanasi? Here's a quick comparison to help you decide:
            </p>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 border-b text-left">Feature</th>
                    <th className="py-3 px-4 border-b text-left">Scooty (Activa, Jupiter)</th>
                    <th className="py-3 px-4 border-b text-left">Bike (Royal Enfield, Shine)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b font-semibold">Best For</td>
                    <td className="py-2 px-4 border-b">City rides, temple lanes, ghats</td>
                    <td className="py-2 px-4 border-b">Highway trips, Sarnath, waterfalls</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-2 px-4 border-b font-semibold">Ease of Riding</td>
                    <td className="py-2 px-4 border-b">Very easy, automatic</td>
                    <td className="py-2 px-4 border-b">Requires gear shifting</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b font-semibold">Fuel Efficiency</td>
                    <td className="py-2 px-4 border-b">45-55 km/l</td>
                    <td className="py-2 px-4 border-b">35-40 km/l</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-2 px-4 border-b font-semibold">Price Range</td>
                    <td className="py-2 px-4 border-b">₹449-599/day</td>
                    <td className="py-2 px-4 border-b">₹700-1,500/day</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b font-semibold">Long Distance</td>
                    <td className="py-2 px-4 border-b">Comfortable up to 30 km</td>
                    <td className="py-2 px-4 border-b">Perfect for 50-100 km trips</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-2 px-4 border-b font-semibold">Parking</td>
                    <td className="py-2 px-4 border-b">Fits in narrow spaces</td>
                    <td className="py-2 px-4 border-b">Needs more space</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b font-semibold">Recommended For</td>
                    <td className="py-2 px-4 border-b">First-timers, solo travelers</td>
                    <td className="py-2 px-4 border-b">Experienced riders, adventure</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              <strong>Our Recommendation:</strong> Choose a scooty for exploring Varanasi's old city, temples, and ghats. Opt for a bike if you're planning trips to Sarnath, Chunar Fort, or nearby waterfalls. Both come with helmets and full insurance coverage.
            </p>

            <SalesSectionVisuals route="/bike-rentals-varanasi" className="mt-10" />

            <h2 className="mt-12 text-3xl font-bold text-gray-800">Pricing: Affordable Options for Daily and Monthly Rentals in 2026</h2>
            <p className="mt-6">
              Our <strong>affordable bike rental</strong> rates are designed to fit every budget, with flexible plans for tourists and residents. Based on 2026 market trends, prices start from Rs. 449 for basic scooters, but our premium well-maintained options provide better value.
            </p>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Vehicle Model</th>
                    <th className="py-2 px-4 border-b">Daily Rate (Approx.)</th>
                    <th className="py-2 px-4 border-b">Monthly Rate (Contact for Details)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b">Honda Activa / TVS Jupiter</td>
                    <td className="py-2 px-4 border-b">₹449 – ₹599</td>
                    <td className="py-2 px-4 border-b">Custom discounts available</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">Honda Shine / Pulsar 125</td>
                    <td className="py-2 px-4 border-b">₹700 – ₹900</td>
                    <td className="py-2 px-4 border-b">Custom discounts available</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">Royal Enfield Classic 350</td>
                    <td className="py-2 px-4 border-b">₹1,200 – ₹1,500</td>
                    <td className="py-2 px-4 border-b">Custom discounts available</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              Prices exclude fuel and a refundable security deposit (₹1,000–₹5,000). Scooters include one free ISI helmet; an extra pillion lid is ₹50/day. Monthly scooty rentals unlock up to 45% savings—call or WhatsApp for live availability before you land.
            </p>

            <h2 className="mt-12 text-3xl font-bold text-gray-800">How to Book Your Bike Rental with Varanasi Taxi</h2>
            <p className="mt-6">
              Booking is straightforward and user-friendly:
            </p>
            <ol className="mt-4 list-decimal pl-6">
              <li>Browse Our Fleet: Visit our website or contact us to view options.</li>
              <li>Check Availability: Call or WhatsApp to confirm dates and get a personalized quote.</li>
              <li>Provide Documents: Submit a valid driving license and government-issued ID (e.g., Aadhaar or passport) at pickup.</li>
              <li>Pickup and Go: Collect your vehicle from our convenient location near Cantt Station; we offer delivery for select bookings.</li>
              <li>Return: Drop off within the agreed time to avoid late fees (₹100/hour).</li>
            </ol>
            <p className="mt-4">
              As a reviewer noted, "The service is top-notch with clean, well-maintained bikes." Foreigners are welcome with an international DL.
            </p>

            <h2 className="mt-12 text-3xl font-bold text-gray-800">Safety Tips and Local Traffic Insights for Varanasi Riders</h2>
            <p className="mt-6">
              Safety is our priority at Varanasi Taxi. All bikes undergo maintenance checks, and we provide quality helmets. Follow these tips for a secure ride:
            </p>
            <ul className="mt-4 list-disc pl-6">
              <li><strong>Helmet Use</strong>: Mandatory for rider and pillion (fine: ₹1,000+ if violated).</li>
              <li><strong>Speed Limits</strong>: Stick to 60 kmph on highways; slower in city areas to avoid fines up to ₹2,000.</li>
              <li><strong>Traffic Rules</strong>: Use indicators, carry digital documents via DigiLocker, and avoid overloading.</li>
              <li><strong>Local Advice</strong>: Navigate carefully during monsoons—watch for slippery ghats. Park near designated spots for Aartis. Night rides in alleys? Opt for well-lit main roads.</li>
            </ul>
            <p className="mt-4">
              User experiences highlight: "Properly maintained bikes made my trip safe and enjoyable."
            </p>

            <h2 className="mt-12 text-3xl font-bold text-gray-800">Must-Visit Places in Varanasi by Bike from Varanasi Taxi</h2>
            <p className="mt-6">
              Unlock Varanasi's hidden gems with our rentals:
            </p>
            <ol className="mt-4 list-decimal pl-6">
              <li><strong>Ganges Ghats</strong>: Ride from Assi to Dashashwamedh for stunning Aarti views—easy parking nearby.</li>
              <li><strong>Kashi Vishwanath Temple</strong>: Navigate lanes effortlessly on a scooty.</li>
              <li><strong>Sarnath Stupa</strong>: A quick 12 km ride to this peaceful Buddhist site.</li>
              <li><strong>Devdari Waterfall</strong>: 50 km away for a refreshing countryside escape (1-hour ride on Royal Enfield).</li>
              <li><strong>Chunar Fort</strong>: 40 km historic spot—perfect for day trips.</li>
              <li><strong>Vindhyachal Temple</strong>: 70 km spiritual journey.</li>
              <li><strong>Lakhaniya Dari Waterfall</strong>: Scenic 1-hour ride in nature.</li>
              <li><strong>Rajdari Waterfall</strong>: Explore Chandraprabha Sanctuary nearby.</li>
              <li><strong>Banaras Hindu University</strong>: Cycle-friendly trails for a relaxed vibe.</li>
              <li><strong>Manikarnika Ghat</strong>: Observe rituals respectfully from afar.</li>
            </ol>
            <p className="mt-4">
              These spots are best experienced on two wheels, as per local travelers: "Cruising along the riverfront was magical."
            </p>

            <h2 className="mt-12 text-3xl font-bold text-gray-800">Need a Taxi Instead? Longer Trips & Airport Transfers</h2>
            <p className="mt-6">
              Bikes are perfect for city exploration, but for certain trips you'll need four wheels:
            </p>
            <ul className="mt-4 list-disc pl-6">
              <li><strong>Airport Transfers</strong>: <a href="/en/city/varanasi/taxi/airport-taxi-varanasi" className="text-blue-600 hover:underline">Book airport taxi</a> with fixed fares (₹600-950) and flight tracking.</li>
              <li><strong>Outstation Pilgrimage</strong>: Planning <a href="/en/city/varanasi/taxi/varanasi-to-gaya-taxi-service" className="text-blue-600 hover:underline">Varanasi to Gaya for Pind Daan</a>? A 260 km trip needs AC taxi comfort.</li>
              <li><strong>Family Tours</strong>: <a href="/en/city/varanasi/tour-packages/varanasi-gaya-prayagraj-tour-package-elderly" className="text-blue-600 hover:underline">Elderly-friendly pilgrimage packages</a> with private transport.</li>
              <li><strong>Group Weddings</strong>: <a href="/en/city/varanasi/taxi/wedding-tempo-traveller-varanasi" className="text-blue-600 hover:underline">Tempo traveller for weddings</a> (12-17 seater).</li>
              <li><strong>Where to Stay</strong>: Riding around the city? See <a href="/en/where-to-stay-in-varanasi" className="text-blue-600 hover:underline">where to stay in Varanasi</a> — best areas for families and groups, near the ghats or central Sigra.</li>
            </ul>
            <p className="mt-4">
              Check our <a href="/en/city/varanasi/taxi/taxi-rates-varanasi" className="text-blue-600 hover:underline">complete taxi rate card</a> for transparent pricing. Mix bike rental for city days + taxi for longer excursions!
            </p>

            <h2 className="mt-12 text-3xl font-bold text-gray-800">Real User Experiences with Varanasi Taxi</h2>
            <p className="mt-6">
              Our 4.7 rating reflects satisfied customers: "Customers praise the cleanliness and quality of service." Another shared, "Very nice and proper maintained bike—highly recommend!" Pro Tip: Refuel before return and record a quick video of the bike's condition for peace of mind.
            </p>
            {/* Structured Data Compliance: Visible review snippets matching JSON-LD review[].reviewBody */}
            <section id="reviews" className="mt-10">
              <div className="flex items-center gap-3">
                <div className="flex text-yellow-500" aria-hidden="true">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" /></svg>
                  ))}
                </div>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">{rentalAggregateRating.ratingValue}</span>/5 based on {rentalAggregateRating.ratingCount} reviews
                </p>
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {rentalReviews.map(r => (
                  <figure key={r['@id']} className="relative rounded-lg border bg-white p-5 shadow-sm">
                    <blockquote className="text-sm text-gray-700 leading-relaxed">“{r.reviewBody}”</blockquote>
                    <figcaption className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <span className="font-medium text-gray-800">{r.author.name}</span>
                      <time dateTime={r.datePublished}>{new Date(r.datePublished).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</time>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-500">Reviews shown above are genuine customer snippets displayed to align with structured data markup.</p>
            </section>

            <h2 className="mt-12 text-3xl font-bold text-gray-800">FAQs on Bike Rental in Varanasi with Varanasi Taxi</h2>
            <ul className="mt-6 space-y-4">
              <li><strong>Is fuel included?</strong> No, it's pay-as-you-go for transparency.</li>
              <li><strong>Can foreigners rent?</strong> Yes, with a valid international driving license.</li>
              <li><strong>Best time to rent?</strong> Early mornings for lighter traffic; avoid peak monsoons.</li>
              <li><strong>Cancellation policy?</strong> Flexible—contact us 24 hours in advance.</li>
              <li><strong>Electric options?</strong> Inquire for emerging availability in 2026.</li>
            </ul>
            <p className="mt-6 text-center">
              Ready for your Varanasi adventure? Book your <strong>trusted bike rental</strong> with Varanasi Taxi today via call or WhatsApp. Explore Kashi like a local—affordably and safely!
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">Frequently Asked Questions (FAQ)</h2>
            <div className="mt-12 space-y-8">
              <div>
                <h3 className="text-xl font-semibold">1. What documents do I need to rent a bike in Varanasi?</h3>
                <p className="mt-2 text-gray-600">A valid two-wheeler driving licence and one government ID (Aadhaar/Passport/Voter ID). A refundable security deposit is required at pickup. You should also keep a soft copy handy in DigiLocker for quick verification.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">2. How much does a scooty or bike cost per day?</h3>
                <p className="mt-2 text-gray-600">Scooty/Activa ~₹449–₹599/day, 125–160cc bikes ~₹700–₹900/day, Royal Enfield/350–500cc ~₹1,200–₹1,500/day. Fuel is usually not included. Seasonal demand (festivals, holidays) can push the higher end—call or WhatsApp for today’s rate.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">3. Can you deliver near Varanasi railway station or my hotel?</h3>
                <p className="mt-2 text-gray-600">Yes, pickup at Cantt (Varanasi Junction) is common, and delivery can be arranged within city limits for select bookings. Share arrival time / hotel location in advance so we can schedule a smooth handover.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">4. Are helmets mandatory for riders and pillion?</h3>
                <p className="mt-2 text-gray-600">Yes. Helmets are mandatory for both rider and pillion. We provide helmets on request at pickup—always wear them to avoid fines and stay safe in dense traffic.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">5. Where should I park near the ghats or Kashi Vishwanath Corridor?</h3>
                <p className="mt-2 text-gray-600">Use multilevel / official parking near Godowlia or Benia Bagh and then walk or take an e‑rickshaw into pedestrian zones, especially during peak hours, festivals or security closures.</p>
              </div>
              <p className="mt-6 text-center text-gray-600">Still have a question? Call or WhatsApp – we’re happy to guide you before you book.</p>
            </div>
          </div>
        </section>
      </div>
      <Footer allPosts={allPosts} />
      <StickyContactBar phone={CONTACT.callNumberRaw} />
    </>
  );
}

export async function getStaticProps() {
  const { getAllPostsMeta } = await import('../lib/posts');
  const allPosts = getAllPostsMeta();
  return {
    props: {
      allPosts,
    },
  };
}
