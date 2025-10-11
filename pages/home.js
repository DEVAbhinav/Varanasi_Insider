import Head from 'next/head';
import Image from 'next/image';
import NavBar from '../components/NavBar/NavBar';
import Footer from '../components/Footer/Footer';
import GoogleReviews from '../components/GoogleReviews/GoogleReviews';

export default function HomePage({ allPosts }) {
  return (
    <>
      <Head>
        <title>Varanasi Taxi Service | Airport Cab, Local Sightseeing & Tempo Traveller ☎ 9450301573</title>
        <meta
          name="description"
          content="Book Varanasi taxi online - Airport cab ₹800, Local Kashi darshan ₹2500, Tempo traveller hire, Outstation taxi. AC vehicles, 24×7 service, fixed rates. Call 9450301573"
        />
        <meta name="keywords" content="varanasi taxi, varanasi cab service, airport taxi varanasi, kashi taxi, tempo traveller varanasi, varanasi to prayagraj taxi, varanasi local sightseeing cab, varanasi airport cab fare, outstation taxi from varanasi" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.varanasiinsider.com/home" />
      </Head>

      <NavBar />

      {/* Hero Section - Luxurious Rich Gradient with Texture - Compact for Above Fold */}
      <section className="relative flex items-center justify-center text-white overflow-hidden pt-16 pb-8 md:pt-20 md:pb-12">
        {/* Base Gradient Layer 1 - Deep Rich Blue to Cyan */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-400"></div>
        
        {/* Gradient Layer 2 - Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/40 via-transparent to-teal-500/50"></div>
        
        {/* Gradient Layer 3 - Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-300/20 via-transparent to-transparent"></div>
        
        {/* Organic Artistic Dot Pattern - Breaking the Grid - Enhanced 5% */}
        
        {/* Base Texture Layer - Irregular scattered tiny dots */}
        <div className="absolute inset-0 opacity-[0.17]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 7% 13%, rgba(255,255,255,0.6) 1px, transparent 1px),
              radial-gradient(circle at 23% 8%, rgba(255,255,255,0.7) 0.5px, transparent 0.5px),
              radial-gradient(circle at 41% 21%, rgba(255,255,255,0.5) 1px, transparent 1px),
              radial-gradient(circle at 58% 15%, rgba(255,255,255,0.8) 0.8px, transparent 0.8px),
              radial-gradient(circle at 73% 9%, rgba(255,255,255,0.6) 1.2px, transparent 1.2px),
              radial-gradient(circle at 89% 18%, rgba(255,255,255,0.7) 0.7px, transparent 0.7px)
            `,
            backgroundSize: '400px 400px',
          }}></div>
        </div>
        
        {/* Medium Organic Scatter Pattern - Increased Count */}
        <div className="absolute inset-0 opacity-[0.25]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 12% 28%, rgba(255,255,255,0.85) 2px, transparent 2px),
              radial-gradient(circle at 34% 42%, rgba(255,255,255,0.75) 1.5px, transparent 1.5px),
              radial-gradient(circle at 51% 19%, rgba(255,255,255,0.9) 2px, transparent 2px),
              radial-gradient(circle at 67% 35%, rgba(255,255,255,0.8) 1.8px, transparent 1.8px),
              radial-gradient(circle at 82% 23%, rgba(255,255,255,0.85) 2.2px, transparent 2.2px),
              radial-gradient(circle at 19% 51%, rgba(255,255,255,0.7) 1.6px, transparent 1.6px),
              radial-gradient(circle at 45% 58%, rgba(255,255,255,0.8) 2px, transparent 2px),
              radial-gradient(circle at 78% 47%, rgba(255,255,255,0.75) 1.7px, transparent 1.7px),
              radial-gradient(circle at 26% 63%, rgba(255,255,255,0.8) 1.9px, transparent 1.9px),
              radial-gradient(circle at 58% 72%, rgba(255,255,255,0.85) 1.8px, transparent 1.8px),
              radial-gradient(circle at 91% 38%, rgba(255,255,255,0.75) 2px, transparent 2px),
              radial-gradient(circle at 8% 85%, rgba(255,255,255,0.8) 1.7px, transparent 1.7px),
              radial-gradient(circle at 43% 11%, rgba(255,255,255,0.85) 1.6px, transparent 1.6px)
            `,
            backgroundSize: '600px 600px',
            backgroundPosition: '50px 80px'
          }}></div>
        </div>
        
        {/* Large Artistic Accent Dots - Constellation Style */}
        <div className="absolute inset-0 opacity-[0.33]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 15% 22%, rgba(255,255,255,1) 3px, transparent 3px),
              radial-gradient(circle at 38% 67%, rgba(255,255,255,0.95) 3.5px, transparent 3.5px),
              radial-gradient(circle at 62% 31%, rgba(255,255,255,1) 3.2px, transparent 3.2px),
              radial-gradient(circle at 81% 58%, rgba(255,255,255,0.9) 3px, transparent 3px),
              radial-gradient(circle at 28% 79%, rgba(255,255,255,0.95) 3.3px, transparent 3.3px),
              radial-gradient(circle at 71% 88%, rgba(255,255,255,1) 3px, transparent 3px)
            `,
            backgroundSize: '900px 900px',
            backgroundPosition: '120px 150px'
          }}></div>
        </div>
        
        {/* Extra Large Focal Dots - Sparse Artistic Placement */}
        <div className="absolute inset-0 opacity-[0.37]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 15%, rgba(255,255,255,1) 4px, transparent 4px),
              radial-gradient(circle at 68% 42%, rgba(255,255,255,0.95) 4.5px, transparent 4.5px),
              radial-gradient(circle at 43% 78%, rgba(255,255,255,1) 4.2px, transparent 4.2px),
              radial-gradient(circle at 88% 25%, rgba(255,255,255,0.9) 4px, transparent 4px)
            `,
            backgroundSize: '1200px 1200px',
            backgroundPosition: '200px 250px'
          }}></div>
        </div>
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent animate-pulse" style={{ animationDuration: '4s' }}></div>

        <div className="container mx-auto px-4 relative z-10 py-2">
          <div className="max-w-6xl mx-auto">
            {/* Main Title */}
            <div className="text-center mb-3">
              <div className="inline-block mb-1.5 px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold border border-white/30">
                24×7 VARANASI CAB SERVICE
              </div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-2xl tracking-tight leading-tight">
                Varanasi Taxi Service | Airport Cab & Tempo Traveller Rental
              </h1>
              <p className="text-sm md:text-base font-light text-white/95 drop-shadow-lg">
                Airport Taxi Varanasi • Kashi Darshan Cab • Tempo Traveller on Rent • Outstation Taxi from Varanasi
              </p>
            </div>

            {/* Search Your Ride Widget - Premium Glassmorphism */}
            <div className="max-w-5xl mx-auto mt-4">
              <div className="bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.25)] p-4 md:p-6 border-2 border-white/40 relative overflow-hidden">
                {/* Subtle shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
                
                <h2 className="relative text-lg md:text-xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-sm">
                  Book Varanasi Taxi Online – Get Instant Fare
                </h2>

                {/* Search Form */}
                <div className="relative grid md:grid-cols-4 gap-3 mb-3">
                  {/* Pickup Location */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-800">
                      Pickup Location
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 text-sm">
                        📍
                      </div>
                      <input
                        type="text"
                        placeholder="Enter location"
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 text-gray-800 placeholder-gray-500 transition-all outline-none bg-white/95 shadow-sm text-sm"
                      />
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-800">
                      Destination
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 text-sm">
                        🎯
                      </div>
                      <input
                        type="text"
                        placeholder="Select destination"
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 text-gray-800 placeholder-gray-500 transition-all outline-none bg-white/95 shadow-sm text-sm"
                      />
                    </div>
                  </div>

                  {/* Travel Date */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-800">
                      Travel Date
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 text-sm">
                        📅
                      </div>
                      <input
                        type="date"
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 text-gray-800 transition-all outline-none bg-white/95 shadow-sm text-sm"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  {/* Passengers */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-800">
                      Passengers
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 text-sm">
                        👥
                      </div>
                      <select className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 text-gray-800 transition-all outline-none bg-white/95 appearance-none cursor-pointer shadow-sm text-sm">
                        <option>1 Adult</option>
                        <option>2 Adults</option>
                        <option>3 Adults</option>
                        <option>4 Adults</option>
                        <option>5+ Adults</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Compact Search Button */}
                <button className="relative w-full py-2 px-6 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600 text-white font-semibold text-sm rounded-lg shadow-[0_8px_30px_rgba(6,182,212,0.35)] hover:shadow-[0_10px_35px_rgba(6,182,212,0.45)] hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="text-base relative z-10">🔍</span>
                  <span className="relative z-10">Search Available Rides</span>
                </button>

                {/* Compact Trust Indicators */}
                <div className="relative flex flex-wrap justify-center gap-2 mt-3">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-md border border-white/50 shadow-md hover:shadow-lg transition-all hover:scale-105">
                    <span className="text-teal-600 text-xs font-bold">✓</span>
                    <span className="text-gray-800 font-semibold text-[10px] md:text-xs">Instant Confirmation</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-md border border-white/50 shadow-md hover:shadow-lg transition-all hover:scale-105">
                    <span className="text-teal-600 text-xs font-bold">✓</span>
                    <span className="text-gray-800 font-semibold text-[10px] md:text-xs">AC Vehicles</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-md border border-white/50 shadow-md hover:shadow-lg transition-all hover:scale-105">
                    <span className="text-teal-600 text-xs font-bold">✓</span>
                    <span className="text-gray-800 font-semibold text-[10px] md:text-xs">Expert Drivers</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-md border border-white/50 shadow-md hover:shadow-lg transition-all hover:scale-105">
                    <span className="text-teal-600 text-xs font-bold">✓</span>
                    <span className="text-gray-800 font-semibold text-[10px] md:text-xs">Fixed Rates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Separator - Multi-layered for Depth */}
        <div className="absolute bottom-0 left-0 right-0 -mb-1">
          {/* Wave Layer 1 - Back (slightly transparent) */}
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute w-full h-24 md:h-36 opacity-30">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ecfeff" transform="translate(0, 10)"></path>
          </svg>
          
          {/* Wave Layer 2 - Middle */}
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute w-full h-24 md:h-36 opacity-60">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ecfeff" transform="translate(0, 5)"></path>
          </svg>
          
          {/* Wave Layer 3 - Front (solid) */}
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative w-full h-24 md:h-36">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ecfeff"></path>
          </svg>
        </div>
      </section>

      {/* Popular Packages Section - Light Aqua Background */}
      <section className="relative py-16 bg-gradient-to-b from-cyan-50 via-white to-teal-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Best Varanasi Taxi Packages & Rates
            </h2>
            <p className="text-gray-600 text-lg">
              Affordable cab packages for local sightseeing, airport transfer & outstation trips
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Local Darshan Card */}
            <a
              href="/en/services/varanasi-full-day-city-tour-winter-2025"
              className="group bg-white rounded-2xl shadow-lg border border-cyan-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-48">
                <Image
                  src="/images/varanasi-kashi-vishwanath-l.jpeg"
                  alt="Kashi Vishwanath Temple - Local Darshan"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-xl drop-shadow-lg">Varanasi Local Taxi for Kashi Darshan</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 text-sm">
                  Full-day Varanasi city tour cab covering Kashi Vishwanath Temple, Dashashwamedh Ghat, Assi Ghat, Sarnath & BHU
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-teal-600 font-bold text-lg">From ₹2,500</span>
                  <span className="text-sm text-cyan-600 group-hover:translate-x-2 transition-transform">
                    View Details →
                  </span>
                </div>
              </div>
            </a>

            {/* Airport Taxi Card */}
            <a
              href="/en/services/varanasi-airport-taxi-winter-2025"
              className="group bg-white rounded-2xl shadow-lg border border-cyan-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-48">
                <Image
                  src="/images/airport-taxi-600x400.jpeg"
                  alt="Varanasi Airport Taxi Service"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-xl drop-shadow-lg">Varanasi Airport Taxi Service</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 text-sm">
                  VNS Airport to city center cab with meet-and-greet. AC vehicles, fixed fare, 24×7 availability
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-teal-600 font-bold text-lg">From ₹800</span>
                  <span className="text-sm text-cyan-600 group-hover:translate-x-2 transition-transform">
                    View Details →
                  </span>
                </div>
              </div>
            </a>

            {/* Prayagraj Trip Card */}
            <a
              href="/en/varanasi-to-prayagraj"
              className="group bg-white rounded-2xl shadow-lg border border-cyan-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-48">
                <Image
                  src="/images/sangam-600x400.jpeg"
                  alt="Varanasi to Prayagraj Taxi"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-xl drop-shadow-lg">Varanasi to Prayagraj Taxi</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 text-sm">
                  Varanasi to Prayagraj cab service (130 km). Visit Triveni Sangam, Hanuman Temple & Akshayavat. Roundtrip available
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-teal-600 font-bold text-lg">From ₹3,500</span>
                  <span className="text-sm text-cyan-600 group-hover:translate-x-2 transition-transform">
                    View Details →
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Wave Separator - Popular Packages to Services (white) */}
        <div className="absolute bottom-0 left-0 right-0 -mb-1">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>

      {/* Services Section - White to Light Teal */}
      <section className="relative py-16 bg-gradient-to-b from-white to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Varanasi Cab Services – All Types of Vehicles
            </h2>
            <p className="text-gray-600 text-lg">
              Sedan, SUV, Tempo Traveller – Complete taxi solutions for every journey in Varanasi
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Airport Transfer */}
            <a
              href="/en/varanasi-airport-taxi-guide"
              className="group bg-white rounded-2xl shadow-lg p-6 border border-cyan-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">✈️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Varanasi Airport Cab</h3>
              <p className="text-gray-600 text-sm mb-4">
                VNS Airport pickup & drop. 24×7 cab service with professional drivers
              </p>
              <span className="text-cyan-600 font-semibold text-sm group-hover:translate-x-2 transition-transform inline-block">
                Learn More →
              </span>
            </a>

            {/* Local Sightseeing */}
            <a
              href="/en/services/varanasi-full-day-city-tour-winter-2025"
              className="group bg-white rounded-2xl shadow-lg p-6 border border-cyan-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏛️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Varanasi Local Sightseeing Taxi</h3>
              <p className="text-gray-600 text-sm mb-4">
                Half-day & full-day Varanasi city tour packages. Temple, ghat & heritage site visits
              </p>
              <span className="text-cyan-600 font-semibold text-sm group-hover:translate-x-2 transition-transform inline-block">
                Learn More →
              </span>
            </a>

            {/* Tempo Traveller */}
            <a
              href="/en/tempo-traveller-varanasi"
              className="group bg-white rounded-2xl shadow-lg p-6 border border-cyan-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🚐</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Tempo Traveller Hire in Varanasi</h3>
              <p className="text-gray-600 text-sm mb-4">
                12, 14, 17 seater AC tempo traveller on rent for group tours & family trips
              </p>
              <span className="text-cyan-600 font-semibold text-sm group-hover:translate-x-2 transition-transform inline-block">
                Learn More →
              </span>
            </a>

            {/* Outstation Cabs */}
            <a
              href="/en/outstation-cabs-from-varanasi"
              className="group bg-white rounded-2xl shadow-lg p-6 border border-cyan-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🛣️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Outstation Taxi from Varanasi</h3>
              <p className="text-gray-600 text-sm mb-4">
                Varanasi to Prayagraj, Ayodhya, Bodhgaya, Vindhyachal. Intercity cab service available
              </p>
              <span className="text-cyan-600 font-semibold text-sm group-hover:translate-x-2 transition-transform inline-block">
                Learn More →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Google Reviews Section - Flowing with Waves */}
      <section className="relative py-16 bg-gradient-to-br from-cyan-50/60 via-white to-teal-50/40 overflow-hidden">
        {/* Decorative Wave Pattern Background */}
        <div className="absolute inset-0 opacity-30">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <path d="M0,300 Q300,250 600,300 T1200,300 L1200,800 L0,800 Z" fill="#ecfeff" opacity="0.3"/>
            <path d="M0,400 Q300,350 600,400 T1200,400 L1200,800 L0,800 Z" fill="#5eead4" opacity="0.1"/>
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-3 px-4 py-1 bg-white/60 backdrop-blur-sm rounded-full border border-teal-200/50 shadow-sm">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600 font-bold text-xs uppercase tracking-wider">
                Trusted by Thousands
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600">
                What Our Customers Say
              </span>
            </h2>
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current drop-shadow" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <div className="flex items-baseline gap-1">
                <div className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">4.8</div>
                <div className="text-xs text-gray-500">· 87 Reviews</div>
              </div>
            </div>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Real experiences from travelers who explored Varanasi with us
            </p>
          </div>

          <GoogleReviews />
        </div>

        {/* Flowing Wave Separator to Next Section */}
        <div className="absolute bottom-0 left-0 right-0 -mb-1">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 md:h-28">
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#fff7ed', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#ffedd5', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#fff7ed', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path d="M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 L1200,120 L0,120 Z" fill="url(#waveGradient)" opacity="0.8"/>
            <path d="M0,80 C200,40 400,120 600,80 C800,40 1000,120 1200,80 L1200,120 L0,120 Z" fill="#fff7ed"/>
          </svg>
        </div>
      </section>

      {/* Bike Rentals Section */}
      <section className="relative py-20 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/scooty-varanasi-ghat.jpeg"
                    alt="Bike Rentals in Varanasi - Two Wheeler on Rent"
                    width={600}
                    height={400}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-block mb-4 px-4 py-1.5 bg-orange-200 text-orange-800 rounded-full text-sm font-semibold">
                  EXPLORE AT YOUR OWN PACE
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  Bike Rentals in Varanasi
                </h2>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  Explore Varanasi's narrow lanes and hidden gems on a two-wheeler. 
                  We offer scooters and bikes on rent with helmet, documents, and 24×7 support.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span className="text-gray-700">Honda Activa, Dio & Royal Enfield available</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span className="text-gray-700">Free helmet & riding gloves</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span className="text-gray-700">Daily, weekly & monthly rental options</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span className="text-gray-700">Home delivery & pickup available</span>
                  </li>
                </ul>
                <a
                  href="/bike-rentals-varanasi"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Rent Bike Now →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Separator - Bike to CTA (Teal) */}
        <div className="absolute bottom-0 left-0 right-0 -mb-1">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#14b8a6"></path>
          </svg>
        </div>
      </section>

      {/* CTA Section - Aqua/Teal Gradient */}
      <section className="relative py-20 bg-gradient-to-br from-cyan-500 via-teal-500 to-cyan-600 text-white overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)',
            backgroundSize: '100px 100px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
              Book Varanasi Taxi Now – Best Rates Guaranteed
            </h2>
            <p className="text-xl md:text-2xl text-blue-50 mb-8 font-light">
              24×7 cab service with professional drivers. Airport taxi, local tours & outstation trips available
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/booking"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-cyan-700 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg"
              >
                🚕 Book Varanasi Taxi Online
              </a>
              <a
                href="tel:9450301573"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-cyan-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg"
              >
                📞 Call: 94503 01573
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer allPosts={allPosts} />
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
