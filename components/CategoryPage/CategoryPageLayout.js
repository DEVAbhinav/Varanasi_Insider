import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';

export default function CategoryPageLayout({ 
  title, 
  metaTitle,
  metaDescription,
  heroTitle, 
  heroSubtitle,
  heroBadge,
  items, 
  jsonLd,
  children // For custom content sections
}) {
  return (
    <>
      <Head>
        <title>{metaTitle || title}</title>
        <meta name="description" content={metaDescription} />
        {jsonLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        )}
      </Head>
      
      <NavBar />
      
      {/* Hero Section */}
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
            {heroBadge && (
              <div className="inline-block mb-3 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold border border-white/30">
                {heroBadge}
              </div>
            )}
            <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              {heroTitle || title}
            </h1>
            {heroSubtitle && (
              <p className="text-lg md:text-xl text-cyan-50 max-w-2xl mx-auto">
                {heroSubtitle}
              </p>
            )}
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
          
          {/* Items Grid */}
          {items && items.length > 0 && (
            <div className="mb-12">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <Link 
                    key={item.slug} 
                    href={item.href || `/en/${item.slug}`}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-cyan-100 hover:border-cyan-300 hover:-translate-y-1"
                  >
                    {/* Card Header with Gradient */}
                    <div className="h-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500"></div>
                    
                    <div className="p-6">
                      {/* Icon */}
                      {item.icon && (
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <span className="text-2xl">{item.icon}</span>
                        </div>
                      )}
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors line-clamp-2 leading-snug">
                        {item.title || item.slug}
                      </h3>
                      
                      {/* Description */}
                      {item.description && (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                          {item.description}
                        </p>
                      )}
                      
                      {/* CTA */}
                      <div className="flex items-center text-cyan-600 font-semibold text-sm group-hover:text-teal-600 group-hover:translate-x-1 transition-all">
                        {item.ctaText || 'Learn More'} →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Custom Content Section */}
          {children}

          {/* CTA Section */}
          <div className="mt-12 text-center bg-gradient-to-br from-cyan-50 to-teal-50 rounded-3xl p-8 md:p-12 border-2 border-cyan-200/50 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Need Help with Booking?
            </h2>
            <p className="text-gray-700 text-lg mb-6 max-w-2xl mx-auto">
              Get instant confirmation with transparent pricing. No hidden charges, no surprises.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a 
                href="tel:+919450301573"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                📞 Call: 94503 01573
              </a>
              <a 
                href="https://wa.me/919935474730"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                💚 WhatsApp Booking
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
