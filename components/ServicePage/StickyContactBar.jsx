// components/ServicePage/StickyContactBar.jsx
import { useState, useEffect } from 'react';

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
      {/* Desktop/Tablet Version - Bottom Sticky Bar with Aquatic Wave Theme */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        } hidden md:block relative overflow-hidden`}
        style={{ 
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)'
        }}
      >
        {/* Base Gradient Layer - Deep Rich Blue to Cyan */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400"></div>
        
        {/* Overlay Gradient for Depth */}
        <div className="absolute inset-0 bg-gradient-to-l from-cyan-500/40 via-transparent to-teal-500/50"></div>
        
        {/* Organic Dot Pattern - Aquatic Texture */}
        <div className="absolute inset-0 opacity-[0.20]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 7% 33%, rgba(255,255,255,0.7) 1px, transparent 1px),
              radial-gradient(circle at 23% 58%, rgba(255,255,255,0.6) 0.8px, transparent 0.8px),
              radial-gradient(circle at 41% 21%, rgba(255,255,255,0.8) 1.2px, transparent 1.2px),
              radial-gradient(circle at 58% 45%, rgba(255,255,255,0.7) 0.9px, transparent 0.9px),
              radial-gradient(circle at 73% 19%, rgba(255,255,255,0.6) 1px, transparent 1px),
              radial-gradient(circle at 89% 68%, rgba(255,255,255,0.8) 1.1px, transparent 1.1px)
            `,
            backgroundSize: '300px 100px',
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between">
          <div className="text-white drop-shadow-md">
            <p className="text-base font-bold">Ready to book your ride?</p>
            <p className="text-xs text-white/90">Instant confirmation • Transparent pricing • Safe & reliable</p>
          </div>
          <div className="flex gap-3">
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center px-5 py-2 bg-white/95 text-cyan-700 font-bold rounded-lg hover:bg-white transition-all transform hover:scale-105 shadow-lg text-sm backdrop-blur-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Call Now
            </a>
            <a
              href={`https://wa.me/91${phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Version - Floating Action Buttons */}
      <div
        className={`fixed bottom-6 right-4 z-50 flex flex-col gap-3 transition-all duration-300 md:hidden ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/91${phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 bg-green-600 text-white rounded-full shadow-2xl hover:bg-green-700 transition-all transform hover:scale-110 active:scale-95"
          aria-label="WhatsApp"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>

        {/* Call Button - Aquatic Theme */}
        <a
          href={`tel:${phone}`}
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-500 text-white rounded-full shadow-2xl hover:from-cyan-600 hover:to-teal-600 transition-all transform hover:scale-110 active:scale-95"
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
