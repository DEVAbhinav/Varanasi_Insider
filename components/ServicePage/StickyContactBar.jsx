// components/ServicePage/StickyContactBar.jsx
import { useState, useEffect } from 'react';
import { CONTACT, getCallTelHref } from '@/lib/contact';

export default function StickyContactBar({ phone }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Show sticky bar after scrolling 300px
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (!phone) return null;

  return (
    <>
      {/* Desktop/Tablet Version - Bottom Sticky Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'
          } hidden md:block`}
      >
        {/* Subtle Wave Top Border - Compact */}
        <div className="absolute bottom-full left-0 right-0 -mb-px">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-6 md:h-8">
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#0ea5e9', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="url(#waveGradient)"></path>
          </svg>
        </div>

        {/* Main Bar Content - Compact */}
        <div
          className="relative"
          style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)',
            boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* Premium Polka Dot Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-[0.22] pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(circle at 15% 25%, rgba(255,255,255,1) 3px, transparent 3px),
                radial-gradient(circle at 45% 15%, rgba(255,255,255,1) 2.5px, transparent 2.5px),
                radial-gradient(circle at 75% 35%, rgba(255,255,255,1) 3.5px, transparent 3.5px),
                radial-gradient(circle at 25% 65%, rgba(255,255,255,1) 3px, transparent 3px),
                radial-gradient(circle at 85% 75%, rgba(255,255,255,1) 2.7px, transparent 2.7px),
                radial-gradient(circle at 55% 50%, rgba(255,255,255,1) 3.2px, transparent 3.2px),
                radial-gradient(circle at 10% 85%, rgba(255,255,255,1) 3px, transparent 3px),
                radial-gradient(circle at 90% 15%, rgba(255,255,255,1) 2.5px, transparent 2.5px),
                radial-gradient(circle at 35% 90%, rgba(255,255,255,1) 3.3px, transparent 3.3px),
                radial-gradient(circle at 65% 8%, rgba(255,255,255,1) 2.8px, transparent 2.8px),
                radial-gradient(circle at 5% 50%, rgba(255,255,255,1) 2.5px, transparent 2.5px),
                radial-gradient(circle at 95% 45%, rgba(255,255,255,1) 2.9px, transparent 2.9px),
                radial-gradient(circle at 50% 80%, rgba(255,255,255,1) 2.7px, transparent 2.7px),
                radial-gradient(circle at 20% 10%, rgba(255,255,255,1) 2.5px, transparent 2.5px)
              `,
              backgroundSize: '350px 350px',
              backgroundPosition: '0 0'
            }}
          />

          <div className="max-w-7xl mx-auto px-6 py-1.5 flex items-center justify-between relative z-10">
            <div className="text-white">
              <p className="text-sm md:text-base font-bold leading-none mb-0.5 drop-shadow-sm">Ready to book your ride?</p>
              <p className="text-[11px] md:text-xs text-white/90 leading-none">Instant confirmation • Transparent pricing • Safe & reliable</p>
            </div>
            <div className="flex gap-2.5">
              <a
                href={getCallTelHref(phone)}
                className="inline-flex items-center px-5 py-2 bg-white text-sky-600 font-bold rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-md text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Call Now
              </a>
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-all transform hover:scale-105 shadow-md text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version - Floating Action Buttons */}
      <div
        className={`fixed bottom-6 right-4 z-50 flex flex-col gap-3 transition-all duration-300 md:hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
          }`}
      >
        {/* WhatsApp Button */}
        <a
          href={CONTACT.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 bg-green-600 text-white rounded-full shadow-2xl hover:bg-green-700 transition-all transform hover:scale-110 active:scale-95"
          aria-label="WhatsApp"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </a>

        {/* Call Button */}
        <a
          href={getCallTelHref(phone)}
          className="flex items-center justify-center w-14 h-14 bg-cyan-500 text-white rounded-full shadow-2xl hover:bg-cyan-600 transition-all transform hover:scale-110 active:scale-95"
          aria-label="Call Now"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
        </a>

        {/* Pulse Animation on Mobile Buttons */}
        <style jsx>{`
          @keyframes pulse-ring {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            100% {
              transform: scale(1.4);
              opacity: 0;
            }
          }
          
          a[aria-label]:before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 50%;
            animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
          }
          
          a[aria-label="WhatsApp"]:before {
            background: rgba(37, 211, 102, 0.5);
          }
          
          a[aria-label="Call Now"]:before {
            background: rgba(6, 182, 212, 0.5);
          }
        `}</style>
      </div>
    </>
  );
}
