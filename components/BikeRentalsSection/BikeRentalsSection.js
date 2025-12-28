import Image from 'next/image';

export default function BikeRentalsSection() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
      {/* Warm Orange Dot Pattern */}
      <div className="absolute inset-0 opacity-[0.1]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 18% 22%, rgba(249,115,22,0.4) 2.5px, transparent 2.5px),
            radial-gradient(circle at 42% 12%, rgba(251,146,60,0.35) 2px, transparent 2px),
            radial-gradient(circle at 68% 28%, rgba(249,115,22,0.45) 2.8px, transparent 2.8px),
            radial-gradient(circle at 88% 18%, rgba(251,146,60,0.4) 2.2px, transparent 2.2px),
            radial-gradient(circle at 25% 58%, rgba(249,115,22,0.38) 2.5px, transparent 2.5px),
            radial-gradient(circle at 55% 48%, rgba(251,146,60,0.42) 2px, transparent 2px),
            radial-gradient(circle at 78% 68%, rgba(249,115,22,0.45) 2.6px, transparent 2.6px),
            radial-gradient(circle at 32% 82%, rgba(251,146,60,0.38) 2.3px, transparent 2.3px)
          `,
          backgroundSize: '850px 850px',
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/scooty-varanasi-ghat.jpeg"
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
  );
}
