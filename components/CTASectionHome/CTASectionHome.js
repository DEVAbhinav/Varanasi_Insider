import { CONTACT, getCallTelHref } from '@/lib/contact';

export default function CTASectionHome() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-cyan-500 via-teal-500 to-cyan-600 text-white overflow-hidden">
      {/* Enhanced Premium Dot Pattern */}
      <div className="absolute inset-0 opacity-[0.15]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 12% 18%, rgba(255,255,255,0.6) 3px, transparent 3px),
            radial-gradient(circle at 38% 8%, rgba(255,255,255,0.5) 2px, transparent 2px),
            radial-gradient(circle at 62% 25%, rgba(255,255,255,0.65) 3.5px, transparent 3.5px),
            radial-gradient(circle at 82% 12%, rgba(255,255,255,0.55) 2.5px, transparent 2.5px),
            radial-gradient(circle at 22% 52%, rgba(255,255,255,0.6) 3px, transparent 3px),
            radial-gradient(circle at 48% 45%, rgba(255,255,255,0.5) 2.2px, transparent 2.2px),
            radial-gradient(circle at 72% 58%, rgba(255,255,255,0.65) 3.2px, transparent 3.2px),
            radial-gradient(circle at 28% 78%, rgba(255,255,255,0.55) 2.8px, transparent 2.8px),
            radial-gradient(circle at 88% 82%, rgba(255,255,255,0.6) 2.5px, transparent 2.5px),
            radial-gradient(circle at 58% 88%, rgba(255,255,255,0.5) 3px, transparent 3px)
          `,
          backgroundSize: '900px 900px',
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
            Book Varanasi Taxi & Cab Now – Best Rates Guaranteed
          </h2>
          <p className="text-xl md:text-2xl text-blue-50 mb-8 font-light">
            24×7 cab service with professional drivers. Airport taxi, local temple tours and outstation trips available
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-cyan-700 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg"
            >
              🚕 Book Varanasi Taxi Online
            </a>
            <a
              href={getCallTelHref()}
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-cyan-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg"
            >
              {`📞 Call: ${CONTACT.callNumberDisplay.replace('+91 ', '')}`}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
