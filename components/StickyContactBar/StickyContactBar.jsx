// components/StickyContactBar/StickyContactBar.jsx
// Modular sticky contact bar - works for all page types
import { useState, useEffect } from 'react';

export default function StickyContactBar({ 
  phone = "9450301573",
  variant = "spiritual" // "spiritual" | "service" | "simple"
}) {
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

  // Variant-specific styling with improved readability - NO TRANSPARENCY
  const variants = {
    spiritual: {
      background: 'linear-gradient(135deg, #b91c1c 0%, #c2410c 50%, #b91c1c 100%)', // Deeper, darker red-orange
      pattern: null, // Removed transparent pattern overlay
      title: "🙏 Need Help Planning Your Varanasi Journey?",
      subtitle: "Instant Response • Expert Guidance • Safe Travels",
      accentColor: "bg-red-800",
      hoverColor: "hover:bg-red-900",
      textColor: "text-white",
      textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.7)"
    },
    service: {
      background: 'linear-gradient(to right, #a16207, #c2410c)', // Darker yellow-orange
      pattern: null,
      title: "Ready to Book Your Ride?",
      subtitle: "Instant Confirmation • Transparent Pricing • Safe & Reliable",
      accentColor: "bg-yellow-800",
      hoverColor: "hover:bg-yellow-900",
      textColor: "text-white",
      textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.7)"
    },
    simple: {
      background: 'linear-gradient(to right, #c2410c, #b91c1c)', // Darker orange-red
      pattern: null,
      title: "Ready to Explore Varanasi?",
      subtitle: "24×7 Service • Expert Drivers • Best Rates",
      accentColor: "bg-orange-800",
      hoverColor: "hover:bg-orange-900",
      textColor: "text-white",
      textShadow: "0 2px 6px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.7)"
    }
  };

  const style = variants[variant];

  return (
    <>
      {/* Desktop/Tablet Version - Bottom Sticky Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        } hidden md:block`}
        style={{ 
          background: style.background,
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.3), 0 -2px 8px rgba(220, 38, 38, 0.4)',
          borderTop: variant === 'spiritual' ? '3px solid rgba(255, 237, 213, 0.8)' : '2px solid rgba(255, 237, 213, 0.6)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className={style.textColor}>
            <p className="text-lg font-extrabold" style={{ textShadow: style.textShadow }}>
              {style.title}
            </p>
            <p className="text-sm font-medium opacity-95" style={{ textShadow: style.textShadow }}>
              {style.subtitle}
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center px-6 py-3 bg-white text-red-700 font-extrabold rounded-lg hover:bg-yellow-50 transition-all transform hover:scale-105 shadow-xl text-base border-2 border-white"
              aria-label={`Call ${phone}`}
              style={{ textShadow: 'none' }}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              📞 Call Now
            </a>
            <a
              href={`https://wa.me/91${phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-extrabold rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-xl text-base border-2 border-green-500"
              aria-label="Contact via WhatsApp"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Version - Floating Action Buttons */}
      <div
        className={`fixed bottom-6 right-4 z-50 flex flex-col gap-3 transition-all duration-500 md:hidden ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/91${phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full shadow-2xl hover:bg-green-700 transition-all transform hover:scale-110 active:scale-95 animate-pulse"
          aria-label="WhatsApp"
          style={{
            boxShadow: '0 8px 24px rgba(34, 197, 94, 0.4), 0 4px 8px rgba(0, 0, 0, 0.2)'
          }}
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>

        {/* Call Button */}
        <a
          href={`tel:${phone}`}
          className={`flex items-center justify-center w-16 h-16 ${style.accentColor} text-white rounded-full shadow-2xl ${style.hoverColor} transition-all transform hover:scale-110 active:scale-95`}
          aria-label="Call Now"
          style={{
            boxShadow: variant === 'spiritual' 
              ? '0 8px 24px rgba(255, 107, 53, 0.4), 0 4px 8px rgba(0, 0, 0, 0.2)'
              : '0 8px 24px rgba(234, 179, 8, 0.4), 0 4px 8px rgba(0, 0, 0, 0.2)'
          }}
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
        </a>
      </div>
    </>
  );
}
