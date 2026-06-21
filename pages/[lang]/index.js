// This page lists all blog posts for a specific language.
import NavBar from '../../components/NavBar/NavBar';
import StickyContactBar from '../../components/ServicePage/StickyContactBar';
import Footer from '../../components/Footer/Footer';
import Link from 'next/link';
import Head from 'next/head';
import { getSortedPostsData } from '../../lib/posts';
import { CONTACT, getCallTelHref } from '@/lib/contact';

export async function getStaticPaths() {
  // Define the languages you support
  const languages = ['en', 'hi'];
  const paths = languages.map(lang => ({ params: { lang } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const allPostsData = getSortedPostsData(params.lang);
  return {
    props: {
      allPostsData,
      lang: params.lang,
    },
  };
}

export default function LangHome({ allPostsData, lang }) {
  const isEnglish = lang === 'en';
  const baseUrl = 'https://www.kashitaxi.in';
  const pageTitle = isEnglish
    ? 'Varanasi Travel Guides, Group Tours & Packages | Kashi Taxi'
    : 'वाराणसी ट्रैवल गाइड, समूह टूर और पैकेज | Kashi Taxi';
  const pageDescription = isEnglish
    ? 'Expert Varanasi guides plus quick access to group tours, Delhi-origin pilgrimage packages, temple guides, festival calendars, and practical transport advice.'
    : 'वाराणसी यात्रा गाइड के साथ समूह टूर, दिल्ली से पैकेज, मंदिर जानकारी, त्योहार कैलेंडर और व्यवहारिक ट्रांसपोर्ट सलाह एक जगह पाएँ।';
  const canonical = `${baseUrl}/${lang}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/en`} />
        <link rel="alternate" hrefLang="hi" href={`${baseUrl}/hi`} />
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content="https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/varanasi-hero.png" />
      </Head>
      
      <NavBar />
      
      {/* Hero Section - Compact & Branded */}
      <section className="relative bg-gradient-to-br from-cyan-500 via-teal-500 to-cyan-600 text-white py-16 overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20px 20px, white 2%, transparent 0%), radial-gradient(circle at 60px 60px, white 2%, transparent 0%)',
            backgroundSize: '80px 80px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-3 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold border border-white/30">
              📖 TRAVEL GUIDES & TIPS
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              Explore Varanasi Like a Local
            </h1>
            <p className="text-lg md:text-xl text-cyan-50 max-w-2xl mx-auto">
              Expert guides, insider tips & practical advice for your perfect Kashi journey
            </p>
          </div>
        </div>
        
        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0 -mb-1">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-20">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>

      <main className="bg-gradient-to-b from-white via-cyan-50/30 to-white py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Quick Links */}
          {lang === 'en' && (
            <div className="mb-12 flex flex-wrap gap-3 justify-center">
              <Link href="/en/varanasi-tour-package-for-families" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                👨‍👩‍👧 Family Package
              </Link>
              <Link href="/en/kashi-vishwanath-darshan-ganga-aarti-package" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-cyan-700 font-semibold rounded-xl hover:bg-cyan-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 border-2 border-cyan-200">
                🛕 Darshan + Aarti
              </Link>
              <Link href="/en/varanasi-tour-package-with-hotel" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 border-2 border-teal-200">
                🏨 Hotel + Cab
              </Link>
              <Link href="/en/varanasi-group-tour-package" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                👥 Group Tours 6-40+
              </Link>
              <Link href="/en/services" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-cyan-700 font-semibold rounded-xl hover:bg-cyan-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 border-2 border-cyan-200">
                🚕 Our Services
              </Link>
            </div>
          )}

          {lang === 'hi' && (
            <div className="mb-12 flex flex-wrap gap-3 justify-center">
              <Link href="/hi/varanasi-tour-package-for-families" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                👨‍👩‍👧 फैमिली पैकेज
              </Link>
              <Link href="/hi/kashi-vishwanath-darshan-ganga-aarti-package" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-cyan-700 font-semibold rounded-xl hover:bg-cyan-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 border-2 border-cyan-200">
                🛕 दर्शन + आरती
              </Link>
              <Link href="/hi/varanasi-tour-package-with-hotel" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 border-2 border-teal-200">
                🏨 होटल + कैब
              </Link>
              <Link href="/hi/varanasi-group-tour-package" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                👥 समूह टूर 6-40+
              </Link>
              <Link href="/hi/tempo-traveller-varanasi" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-cyan-700 font-semibold rounded-xl hover:bg-cyan-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 border-2 border-cyan-200">
                🚐 टेम्पो ट्रैवलर
              </Link>
            </div>
          )}

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPostsData.map(({ slug, routePath, date, title, description }) => (
              <Link 
                key={slug} 
                href={routePath || `/${lang}/${slug}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-cyan-100 hover:border-cyan-300 hover:-translate-y-1"
              >
                {/* Card Header with Gradient */}
                <div className="h-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500"></div>
                
                <div className="p-6">
                  {/* Date Badge */}
                  <div className="inline-block mb-3 px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-semibold rounded-full border border-cyan-200">
                    📅 {date}
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors line-clamp-2 leading-snug">
                    {title}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {description}
                  </p>
                  
                  {/* Read More Link */}
                  <div className="flex items-center text-cyan-600 font-semibold text-sm group-hover:text-teal-600 group-hover:translate-x-1 transition-all">
                    Read Full Guide →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center bg-gradient-to-br from-cyan-50 to-teal-50 rounded-3xl p-8 md:p-12 border-2 border-cyan-200/50 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              {isEnglish ? 'Need Transport or a Pilgrimage Package?' : 'ट्रांसपोर्ट या तीर्थ पैकेज चाहिए?'}
            </h2>
            <p className="text-gray-700 text-lg mb-6 max-w-2xl mx-auto">
              {isEnglish
                ? 'Book reliable taxi service for airport pickup, local sightseeing, group tours, or sacred circuits from one Varanasi team.'
                : 'एयरपोर्ट पिकअप, लोकल साइटसीइंग, समूह टूर या तीर्थ सर्किट के लिए एक ही वाराणसी टीम से बुकिंग करें।'}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a 
                href={getCallTelHref()}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                {`📞 Call: ${CONTACT.callNumberDisplay.replace('+91 ', '')}`}
              </a>
              <a 
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                💚 WhatsApp Booking
              </a>
              <Link
                href={isEnglish ? '/en/varanasi-tour-package-for-families' : '/hi/varanasi-tour-package-for-families'}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-cyan-700 font-bold rounded-xl hover:bg-cyan-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 border-2 border-cyan-200"
              >
                👨‍👩‍👧 {isEnglish ? 'Open Family Packages' : 'फैमिली पैकेज देखें'}
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <StickyContactBar phone={CONTACT.callNumberRaw} />
    </>
  );
}
