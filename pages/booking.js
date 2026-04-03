import Head from 'next/head';
import NavBar from '../components/NavBar/NavBar';
import Footer from '../components/Footer/Footer';
import BookingWidget from '../components/BookingWidget/BookingWidget';
import StickyContactBar from '../components/ServicePage/StickyContactBar';
import { CONTACT } from '@/lib/contact';

export default function BookingPage() {
  return (
    <>
      <Head>
        <title>Book Varanasi Taxi Online | Airport Taxi & Tempo Traveller Booking 2026</title>
        <meta 
          name="description" 
          content={`Book Varanasi taxi & tempo traveller online. VNS Airport taxi, local Kashi darshan, outstation cabs to Ayodhya Prayagraj. AC vehicles, expert drivers. Instant booking ☎ ${CONTACT.callNumberDisplay.replace('+91 ', '')}`} 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.varanasiinsider.com/booking" />
        <meta name="keywords" content="book varanasi taxi online, varanasi airport taxi booking, tempo traveller on rent varanasi, kashi taxi service, varanasi cab booking, outstation taxi from varanasi, book taxi varanasi to ayodhya, varanasi local taxi, kashi darshan taxi" />
      </Head>

      <NavBar />
      <StickyContactBar phone={CONTACT.callNumberRaw} />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-blue-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 text-white py-20 overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)',
              backgroundSize: '100px 100px'
            }}></div>
          </div>
          
          {/* Content */}
          <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
            <div className="inline-block mb-4 px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              TRUSTED KASHI TAXI SERVICE
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
              Book Varanasi Taxi & Tempo Traveller Online
            </h1>
            <p className="text-xl md:text-2xl text-blue-50 mb-8 font-light max-w-2xl mx-auto">
              Varanasi Airport Taxi • Kashi Darshan Tour • Tempo Traveller on Rent • Outstation Cabs
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm md:text-base">
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/25 transition-all">
                <span className="text-xl">✓</span>
                <span>Instant Confirmation</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/25 transition-all">
                <span className="text-xl">✓</span>
                <span>AC Vehicles</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/25 transition-all">
                <span className="text-xl">✓</span>
                <span>Expert Drivers</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/25 transition-all">
                <span className="text-xl">✓</span>
                <span>Fixed Rates</span>
              </div>
            </div>
          </div>

          {/* Wave Separator */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#f0f9ff" opacity="0.3"></path>
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#f0f9ff"></path>
            </svg>
          </div>
        </section>

        {/* Booking Form Section */}
        <section className="py-12 -mt-8 relative z-20">
          <div className="container mx-auto px-4 max-w-2xl">
            <BookingWidget />
            
            {/* Trust Indicators */}
            <div className="mt-8 text-center text-sm text-gray-600 bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-cyan-100">
              <p className="mb-2 flex items-center justify-center gap-2">
                <span className="text-cyan-600">🔒</span>
                Your information is secure and will never be shared
              </p>
              <p className="text-gray-700">
                Average response time: <strong className="text-cyan-600">Under 15 minutes</strong>
              </p>
            </div>

            {/* Service Cards */}
            <div className="mt-16 grid md:grid-cols-2 gap-6">
              <div className="group bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-lg p-6 border border-blue-100/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-3xl bg-blue-100 p-3 rounded-xl group-hover:scale-110 transition-transform">✈️</div>
                  <h2 className="font-bold text-lg text-blue-700 flex-1 pt-2">Varanasi Airport Taxi Service</h2>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Book Varanasi Airport pickup & drop taxi online. VNS Airport to Varanasi city, hotels, Assi Ghat, railway station. AC sedan, Innova Crysta & SUV with meet-and-greet. Fixed fares, no surge pricing.
                </p>
              </div>

              <div className="group bg-gradient-to-br from-white to-indigo-50/50 rounded-2xl shadow-lg p-6 border border-indigo-100/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-3xl bg-indigo-100 p-3 rounded-xl group-hover:scale-110 transition-transform">🚐</div>
                  <h2 className="font-bold text-lg text-indigo-700 flex-1 pt-2">Tempo Traveller on Rent in Varanasi</h2>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  12, 14, 17 seater tempo traveller rental in Varanasi for group tours, family pilgrimage, corporate events. Book AC tempo traveller for Sarnath, Prayagraj, Ayodhya, Vindhyachal, Bodhgaya trips from Varanasi.
                </p>
              </div>

              <div className="group bg-gradient-to-br from-white to-cyan-50/50 rounded-2xl shadow-lg p-6 border border-cyan-100/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-3xl bg-cyan-100 p-3 rounded-xl group-hover:scale-110 transition-transform">🏛️</div>
                  <h2 className="font-bold text-lg text-cyan-700 flex-1 pt-2">Varanasi Local Sightseeing Taxi</h2>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Book Varanasi local taxi for half-day & full-day Kashi darshan tour. Visit Kashi Vishwanath Temple, Dashashwamedh Ghat, Assi Ghat, Manikarnika Ghat, Sarnath, BHU, Ramnagar Fort with expert local driver.
                </p>
              </div>

              <div className="group bg-gradient-to-br from-white to-teal-50/50 rounded-2xl shadow-lg p-6 border border-teal-100/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-3xl bg-teal-100 p-3 rounded-xl group-hover:scale-110 transition-transform">🛣️</div>
                  <h2 className="font-bold text-lg text-teal-700 flex-1 pt-2">Outstation Taxi from Varanasi</h2>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Book outstation cab from Varanasi to Prayagraj (130 km), Ayodhya (200 km), Bodhgaya (250 km), Gaya, Lucknow, Gorakhpur, Chitrakoot. One-way taxi & round-trip packages. All-India tourist permits.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
