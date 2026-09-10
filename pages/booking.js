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
        <title>Online Cab Booking & Instant Quote | Kashi Taxi</title>
        <meta 
          name="description" 
          content={`Book your Kashi taxi & tempo traveller online. Instant quote for airport pickup, city darshan & outstation trips. AC vehicles, expert drivers. ☎ ${CONTACT.callNumberDisplay}`} 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.kashitaxi.in/booking" />
      </Head>

      <NavBar />
      <StickyContactBar phone={CONTACT.callNumberRaw} />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-blue-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 text-white py-16 overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)',
              backgroundSize: '100px 100px'
            }}></div>
          </div>
          
          {/* Content */}
          <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
            <div className="inline-block mb-3 px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold uppercase tracking-wider">
              24×7 ONLINE DISPATCH DESK
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
              Online Cab Booking & Instant Quote
            </h1>
            <p className="text-base md:text-lg text-blue-50 mb-6 font-light max-w-2xl mx-auto">
              Reserve your vehicle in 60 seconds. Instant vehicle allocation, flight tracking, and verified chauffeurs.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <a
                href={`tel:${CONTACT.callNumberRaw}`}
                className="rounded-xl bg-white px-5 py-2.5 text-xs md:text-sm font-bold text-slate-900 shadow-md hover:bg-blue-50 transition"
              >
                Call: {CONTACT.callNumberDisplay}
              </a>
              <a
                href={`https://wa.me/${CONTACT.whatsappNumberInternational}?text=${encodeURIComponent('Hi, I want to book a taxi/tempo traveller. Date: __, Route: __, Passengers: __.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-emerald-500 px-5 py-2.5 text-xs md:text-sm font-bold text-white shadow-md hover:bg-emerald-600 transition"
              >
                WhatsApp Quick Booking
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-2 text-xs md:text-sm">
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                <span>✓</span>
                <span>Instant Confirmation</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                <span>✓</span>
                <span>AC Clean Fleet</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                <span>✓</span>
                <span>Verified Drivers</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                <span>✓</span>
                <span>Fixed Transparent Rates</span>
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
