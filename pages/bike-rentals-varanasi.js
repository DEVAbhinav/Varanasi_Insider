import Head from 'next/head';
import Image from 'next/image';
import NavBar from '../components/NavBar/NavBar';
import Footer from '../components/Footer/Footer';
import fleet from '../data/fleet.json';
import { getSortedPostsData } from '../lib/posts';
import PinkTaxiSection from '../components/PinkTaxiSection/PinkTaxiSection';

// SEO: Structured Data for Local Business
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Bike & Scooty Rentals in Varanasi',
    image: 'https://banarasi.kashitaxi.in/images/logo.png', // Replace with your logo URL
    '@id': 'https://banarasi.kashitaxi.in/bike-rentals', // Replace with your final URL
    url: 'https://banarasi.kashitaxi.in/bike-rentals', // Replace with your final URL
    telephone: '+91-9450301573', // Using a placeholder number
    priceRange: '₹₹',
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'Near Cantt Railway Station',
        addressLocality: 'Varanasi',
        postalCode: '221002',
        addressRegion: 'UP',
        addressCountry: 'IN',
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: 25.3283, // Replace with your actual coordinates
        longitude: 82.9868,
    },
    openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '08:00',
        closes: '22:00',
    },
    makesOffer: {
        '@type': 'Offer',
        itemOffered: {
            '@type': 'Service',
            name: 'Two-Wheeler Rental Service',
            serviceType: 'Bike and Scooty Rental',
            provider: {
                '@type': 'LocalBusiness',
                name: 'Vinayak Travels - Bike & Scooty Rentals',
            },
        },
    },
};

const businessPhoneNumber = '919450301573'; // Replace with your actual 10-digit number + 91

export default function BikeRentalsPage({ allPosts }) {
    return (
        <>
            <Head>
                <title>Bike & Scooty Rental in Varanasi | Call to Book | Vinayak Travels</title>
                <meta name="description" content="Rent a bike or scooty in Varanasi with Vinayak Travels. Call or WhatsApp to book Activa, Pulsar, and Royal Enfield at the best prices. Well-maintained vehicles, 24/7 support. Explore Kashi on your own terms!" />
                <meta name="keywords" content="bike rental varanasi, scooty on rent in varanasi, rent a bike varanasi, vinayak travels, varanasi bike rent price, two wheeler on rent varanasi, kashi bike rental, call to book bike rental varanasi" />
                <link rel="canonical" href="https://banarasi.kashitaxi.in/bike-rentals" />
                <meta property="og:title" content="Bike & Scooty Rental in Varanasi | Vinayak Travels" />
                <meta property="og:description" content="Explore Kashi on your own terms with our easy bike rentals." />
                <meta property="og:url" content="https://banarasi.kashitaxi.in/bike-rentals" />
                <meta property="og:site_name" content="Vinayak Travels Varanasi" />
                <meta property="og:image" content="https://banarasi.kashitaxi.in/images/og-image-rentals.jpg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:locale" content="en_IN" />
                <meta property="og:type" content="website" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            </Head>
            <NavBar />
            <div className="bg-gray-50 text-gray-800">
                <PinkTaxiSection />
                
                {/* Hero Section */}
                <section className="relative h-[60vh] min-h-[400px] text-white">
                    <Image
                        src="/images/scooty-varanasi-ghat.jpeg"
                        alt="A scooty parked with a view of the Varanasi ghats at sunrise"
                        layout="fill"
                        objectFit="cover"
                        priority
                        className="brightness-75"
                    />
                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
                        <h1 className="text-4xl font-extrabold md:text-6xl">Bike & Scooty Rental in Varanasi</h1>
                        <p className="mt-4 max-w-2xl text-lg md:text-xl">
                            Explore the ghats, temples, and lanes of Kashi on your own terms. Trusted rides from Vinayak Travels.
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
                <section className="bg-white py-16 sm:py-20">
                    <div className="container mx-auto max-w-7xl px-4">
                        <h2 className="text-center text-3xl font-bold sm:text-4xl">Booking is Easy as 1-2-3</h2>
                        <div className="mt-12 grid grid-cols-1 gap-12 text-center md:grid-cols-3">
                            <div>
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">1</div>
                                <h3 className="mt-6 text-xl font-semibold">Browse Our Fleet</h3>
                                <p className="mt-2 text-gray-600">Choose the perfect bike or scooty for your trip from our selection below.</p>
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
                        <p className="mt-4 text-center text-lg text-gray-600">Well-maintained, reliable, and ready for your adventure.</p>
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
                                                    href={`tel:${businessPhoneNumber}`}
                                                    className="flex items-center justify-center rounded-full bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 mr-2"><path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5h-2.148a1.5 1.5 0 01-1.465-1.175l-.716-3.223a1.5 1.5 0 011.052-1.767l.933-.267c.41-.117.643.555-.48.95A11.542 11.542 0 006.254 6.254c-.395-.163-.833.07-.95.48l-.267.933a1.5 1.5 0 01-1.767 1.052l-3.223-.716A1.5 1.5 0 012 4.648V3.5z" clipRule="evenodd" /></svg>
                                                    Call to Book
                                                </a>
                                                <a
                                                    href={`https://wa.me/${businessPhoneNumber}?text=Hi! I would like to book the ${vehicle.name}.`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center rounded-full bg-green-500 px-4 py-3 font-semibold text-white transition hover:bg-green-400"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.459L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.447-4.435-9.884-9.888-9.884-5.448 0-9.886 4.434-9.889 9.885.002 2.17.661 4.227 1.879 5.921l-1.263 4.603 4.749-1.251z"/></svg>
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

                {/* SEO Content Section */}
                <section className="bg-white py-16 sm:py-20">
                    <div className="container mx-auto max-w-4xl px-4 text-lg text-gray-700">
                        <h2 className="text-center text-3xl font-bold sm:text-4xl text-gray-800">Your Perfect Ride for Every Varanasi Plan</h2>
                        <p className="mt-6">
                            Thinking of getting a two-wheeler on rent in Varanasi? We have the perfect ride for every plan. If you want to navigate the bustling city traffic with ease and find parking near the ghats for the evening Ganga Aarti, getting an Activa on rent is your best bet. It’s light, easy, and perfect for short trips.
                        </p>
                        <p className="mt-4">
                            But maybe you're more adventurous. If you're planning to ride out on the highway, explore the countryside, or just want that classic thump-thump sound as you cruise along the riverfront, then you should definitely rent a bike like our Royal Enfield or Pulsar. Our goal is to provide a simple, trusted, and affordable bike rental in Varanasi. We ensure every vehicle is perfectly maintained, sanitized, and ready for the road, so your only focus is on making memories.
                        </p>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 sm:py-20">
                    <div className="container mx-auto max-w-4xl px-4">
                        <h2 className="text-center text-3xl font-bold sm:text-4xl">Frequently Asked Questions (FAQ)</h2>
                        <div className="mt-12 space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold">1. What is the best and easiest way to get a bike rental in Varanasi?</h3>
                                <p className="mt-2 text-gray-600">The best way is to choose a trusted, local provider. At Vinayak Travels, we make it simple. Just look through our fleet online and give us a call or WhatsApp message. We'll confirm your booking instantly. We believe we offer the best bike rental in Varanasi because of our well-maintained vehicles and honest, local service.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">2. How much does it cost to get a scooty on rent in Varanasi?</h3>
                                <p className="mt-2 text-gray-600">The Varanasi bike rent price can vary based on the model and an rental duration. Our prices are affordable and transparent. For the latest and most accurate pricing for a scooty on rent in Varanasi, it’s always best to call us directly. We guarantee no hidden charges!</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">3. Can I find a bike rent near the Varanasi railway station?</h3>
                                <p className="mt-2 text-gray-600">Yes! We know convenience is key, especially when you've just arrived. We have easy pickup points, including options for a bike rent near the Varanasi railway station (Cantt). Just let us know your travel plans, and we'll coordinate the easiest handover for you.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">4. Is it safe to explore Kashi on a two-wheeler?</h3>
                                <p className="mt-2 text-gray-600">Absolutely, provided you have a reliable vehicle. Safety is our top priority. Every bike and scooty in our fleet goes through regular maintenance checks. We provide you with quality helmets and the confidence that you're riding a dependable machine, making your exploration of Kashi both safe and unforgettable.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">5. What documents do I need to rent a bike from you?</h3>
                                <p className="mt-2 text-gray-600">The process is simple. You'll need your valid driving licence (for two-wheelers) and a government-issued ID proof like an Aadhaar card or passport for verification during pickup.</p>
                            </div>
                            <p className="mt-6 text-center text-gray-600">So, when you're ready to rent a bike in Varanasi, just give us a call. Let us help you discover the city we love, one ride at a time.</p>
                        </div>
                    </div>
                </section>
            </div>
            <Footer allPosts={allPosts} />
        </>
    );
}

export async function getStaticProps() {
    const enPosts = getSortedPostsData('en').map(post => ({
        params: { lang: 'en', slug: post.slug, title: post.title || post.slug }
    }));
    const hiPosts = getSortedPostsData('hi').map(post => ({
        params: { lang: 'hi', slug: post.slug, title: post.title || post.slug }
    }));
    const allPosts = [...enPosts, ...hiPosts];
    return {
        props: {
            allPosts,
        },
    };
}
