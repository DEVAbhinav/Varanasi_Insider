import React from 'react';
import { CONTACT, getCallTelHref, getWhatsAppUrl } from '@/lib/contact';

export default function ArticleNew({
  contentHtml,
  badgeIcon = '🕉️',
  badgeText = 'Complete Banaras Guide',
  title = 'Your Sacred Journey Starts Here',
  subtitle = 'Everything from temple timings to transport—curated by locals who know every ghat and gali.',
  gradientStops = 'from-amber-50/80 via-orange-50/40 to-white',
  dotPattern =
    'radial-gradient(circle at 10% 20%, rgba(251,146,60,0.25) 2px, transparent 2px), radial-gradient(circle at 50% 10%, rgba(234,88,12,0.18) 1.5px, transparent 1.5px), radial-gradient(circle at 80% 30%, rgba(245,158,11,0.22) 2.5px, transparent 2.5px), radial-gradient(circle at 20% 70%, rgba(251,146,60,0.2) 2px, transparent 2px), radial-gradient(circle at 90% 85%, rgba(234,88,12,0.15) 1.8px, transparent 1.8px)',
  dotOpacity = 'opacity-[0.5]',
  dotSize = '600px 600px',
  maxWidth = 'max-w-5xl',
  cardBorder = 'border-orange-200/60',
  cardShadow = 'shadow-2xl shadow-orange-100/40',
  ribbonGradient = 'from-orange-400 via-amber-400 to-yellow-300',
  articleClassName = '',
  showDecorations = true,
  showTableOfContents = true,
  tocItems = [
    { label: 'Why Choose Us', anchor: '#why-choose' },
    { label: 'Our Services', anchor: '#services' },
    { label: 'Tour Packages', anchor: '#packages' },
    { label: 'Pricing', anchor: '#pricing' },
    { label: 'FAQs', anchor: '#faq' },
  ],
  stats = [
    { value: '5,000+', label: 'Happy Pilgrims' },
    { value: '24×7', label: 'Support' },
    { value: '7+', label: 'Years Experience' },
    { value: '4.8★', label: 'Google Rating' },
  ],
}) {
  return (
    <section className={`relative py-20 bg-gradient-to-b ${gradientStops} overflow-hidden`}>
      {/* Decorative floating elements */}
      {showDecorations && (
        <>
          <div className="absolute top-12 left-8 w-20 h-20 rounded-full bg-gradient-to-br from-orange-200/40 to-amber-100/30 blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-32 right-12 w-32 h-32 rounded-full bg-gradient-to-br from-yellow-200/30 to-orange-100/20 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-gradient-to-br from-amber-200/30 to-orange-100/20 blur-2xl animate-pulse" style={{ animationDuration: '5s' }} />
          <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-gradient-to-br from-orange-300/20 to-yellow-100/10 blur-xl animate-pulse" style={{ animationDuration: '7s' }} />
          
          {/* Floating diyas with glow halos */}
          <div className="absolute top-[15%] left-[8%] animate-float-slow">
            <div className="relative">
              <div className="absolute inset-0 w-14 h-14 rounded-full bg-orange-500/30 blur-xl -translate-x-1 -translate-y-1" />
              <div className="absolute inset-0 w-10 h-10 rounded-full bg-yellow-400/40 blur-lg translate-x-1 translate-y-1" />
              <span className="relative text-4xl drop-shadow-[0_0_12px_rgba(251,146,60,0.8)]">🪔</span>
            </div>
          </div>
          
          <div className="absolute top-[25%] right-[12%] animate-float-medium">
            <div className="relative">
              <div className="absolute inset-0 w-12 h-12 rounded-full bg-orange-500/25 blur-xl -translate-x-1 -translate-y-1" />
              <div className="absolute inset-0 w-8 h-8 rounded-full bg-yellow-300/35 blur-lg translate-x-1 translate-y-1" />
              <span className="relative text-3xl drop-shadow-[0_0_10px_rgba(251,146,60,0.7)]">🪔</span>
            </div>
          </div>
          
          <div className="absolute top-[45%] left-[5%] animate-float-fast">
            <div className="relative">
              <div className="absolute inset-0 w-10 h-10 rounded-full bg-orange-400/30 blur-lg -translate-x-1 -translate-y-1" />
              <div className="absolute inset-0 w-6 h-6 rounded-full bg-yellow-400/40 blur-md translate-x-1 translate-y-1" />
              <span className="relative text-2xl drop-shadow-[0_0_8px_rgba(251,146,60,0.75)]">🪔</span>
            </div>
          </div>
          
          <div className="absolute top-[60%] right-[6%] animate-float-slow">
            <div className="relative">
              <div className="absolute inset-0 w-14 h-14 rounded-full bg-orange-500/25 blur-xl -translate-x-1 -translate-y-1" />
              <div className="absolute inset-0 w-10 h-10 rounded-full bg-yellow-300/35 blur-lg translate-x-1 translate-y-1" />
              <span className="relative text-4xl drop-shadow-[0_0_12px_rgba(251,146,60,0.8)]">🪔</span>
            </div>
          </div>
          
          <div className="absolute top-[75%] left-[15%] animate-float-medium">
            <div className="relative">
              <div className="absolute inset-0 w-12 h-12 rounded-full bg-orange-400/30 blur-xl -translate-x-1 -translate-y-1" />
              <div className="absolute inset-0 w-8 h-8 rounded-full bg-yellow-400/40 blur-lg translate-x-1 translate-y-1" />
              <span className="relative text-3xl drop-shadow-[0_0_10px_rgba(251,146,60,0.75)]">🪔</span>
            </div>
          </div>
          
          <div className="absolute top-[35%] right-[25%] animate-float-fast">
            <div className="relative">
              <div className="absolute inset-0 w-10 h-10 rounded-full bg-orange-500/20 blur-lg -translate-x-1 -translate-y-1" />
              <div className="absolute inset-0 w-6 h-6 rounded-full bg-yellow-300/30 blur-md translate-x-1 translate-y-1" />
              <span className="relative text-2xl drop-shadow-[0_0_8px_rgba(251,146,60,0.7)]">🪔</span>
            </div>
          </div>
          
          <div className="absolute top-[85%] right-[18%] animate-float-medium">
            <div className="relative">
              <div className="absolute inset-0 w-12 h-12 rounded-full bg-orange-400/25 blur-xl -translate-x-1 -translate-y-1" />
              <div className="absolute inset-0 w-8 h-8 rounded-full bg-yellow-400/35 blur-lg translate-x-1 translate-y-1" />
              <span className="relative text-3xl drop-shadow-[0_0_10px_rgba(251,146,60,0.75)]">🪔</span>
            </div>
          </div>
          
          {/* Lotus decorations */}
          <div className="absolute top-[20%] left-[35%] opacity-[0.12] text-5xl select-none pointer-events-none rotate-12 animate-pulse" style={{ animationDuration: '8s' }}>🪷</div>
          <div className="absolute top-[70%] right-[30%] opacity-[0.10] text-4xl select-none pointer-events-none -rotate-6 animate-pulse" style={{ animationDuration: '10s' }}>🪷</div>
        </>
      )}

      {/* Custom floating animation styles */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-12px) rotate(2deg); }
          50% { transform: translateY(-6px) rotate(-1deg); }
          75% { transform: translateY(-18px) rotate(1deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(-2deg); }
          66% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 4.5s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
      `}</style>

      {/* Dot pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute inset-0 ${dotOpacity}`}
          style={{
            backgroundImage: dotPattern,
            backgroundSize: dotSize,
          }}
        />
      </div>

      <div className={`container mx-auto px-4 relative z-10 ${maxWidth}`}>
        {/* Header with icon and decorative lines */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-orange-300 to-orange-400" />
            <span className="mx-4 text-5xl drop-shadow-lg">{badgeIcon}</span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent via-orange-300 to-orange-400" />
          </div>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-100 to-amber-50 border border-orange-200/60 text-sm font-semibold text-orange-700 shadow-md mb-5">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            {badgeText}
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-[Avenir-bold] text-gray-900 tracking-tight leading-tight bg-gradient-to-r from-gray-900 via-orange-900 to-gray-900 bg-clip-text">
            {title}
          </h2>
          <p className="mt-5 text-gray-600 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Stats bar */}
        <div className="mb-10 py-6 px-8 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {stats.map((stat, idx) => (
              <div key={idx} className="relative">
                <div className="text-3xl md:text-4xl font-[Avenir-bold] drop-shadow-md">{stat.value}</div>
                <div className="text-sm md:text-base opacity-90 font-[Avenir-regular]">{stat.label}</div>
                {idx < stats.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-10 w-px bg-white/30" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick navigation TOC */}
        {showTableOfContents && tocItems.length > 0 && (
          <div className="mb-10 p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-orange-100 shadow-lg">
            <div className="flex items-center gap-2 mb-4 text-sm font-[Avenir-demi] text-orange-800">
              <span>📑</span>
              <span>Quick Navigation</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tocItems.map((item, idx) => (
                <a
                  key={idx}
                  href={item.anchor}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/50 text-sm text-orange-700 font-[Avenir-regular] hover:from-orange-100 hover:to-amber-100 hover:border-orange-300 hover:shadow-md transition-all duration-200"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Main content card */}
        <div className={`relative rounded-[2rem] border-2 ${cardBorder} bg-white/95 backdrop-blur-sm ${cardShadow} overflow-hidden`}>
          {/* Top ribbon with glow */}
          <div className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${ribbonGradient}`} />
          <div className={`absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-orange-100/40 to-transparent`} />
          
          {/* Corner decorations */}
          <div className="absolute top-6 right-6 w-20 h-20 opacity-[0.12]">
            <svg viewBox="0 0 100 100" className="w-full h-full text-orange-500">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 4" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
            </svg>
          </div>

          <div className="absolute bottom-6 left-6 w-16 h-16 opacity-[0.08]">
            <svg viewBox="0 0 100 100" className="w-full h-full text-orange-500">
              <polygon points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          
          <div className="p-8 md:p-12 lg:p-16">
            <article
              className={`
                prose lg:prose-lg xl:prose-xl prose-orange max-w-none 
                font-[Avenir-regular] 
                prose-headings:font-[Avenir-bold] 
                prose-strong:font-[Avenir-demi] prose-strong:text-orange-900
                prose-a:text-orange-600 prose-a:no-underline prose-a:border-b-2 prose-a:border-orange-200 hover:prose-a:border-orange-500 hover:prose-a:text-orange-700 prose-a:transition-all prose-a:duration-200
                prose-blockquote:border-l-4 prose-blockquote:border-orange-400 prose-blockquote:bg-gradient-to-r prose-blockquote:from-orange-50 prose-blockquote:via-amber-50/50 prose-blockquote:to-transparent prose-blockquote:pl-6 prose-blockquote:pr-6 prose-blockquote:py-4 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:shadow-sm prose-blockquote:my-8
                prose-h1:text-4xl md:prose-h1:text-5xl prose-h1:leading-tight prose-h1:text-gray-900 prose-h1:mb-8 prose-h1:mt-4
                prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:leading-snug prose-h2:text-gray-800 prose-h2:border-l-4 prose-h2:border-orange-400 prose-h2:pl-5 prose-h2:py-2 prose-h2:bg-gradient-to-r prose-h2:from-orange-50/90 prose-h2:via-amber-50/50 prose-h2:to-transparent prose-h2:rounded-r-xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:shadow-sm
                prose-h3:text-xl md:prose-h3:text-2xl prose-h3:text-gray-800 prose-h3:mt-10 prose-h3:mb-4 prose-h3:flex prose-h3:items-center prose-h3:gap-2
                prose-h4:text-lg prose-h4:text-gray-700 prose-h4:mt-6 prose-h4:mb-3
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-base md:prose-p:text-lg
                prose-li:text-gray-700 prose-li:marker:text-orange-400 prose-li:my-1
                prose-ul:my-4 prose-ol:my-4
                prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
                prose-table:border-2 prose-table:border-orange-200 prose-table:rounded-2xl prose-table:overflow-hidden prose-table:shadow-md prose-table:my-8
                prose-thead:bg-gradient-to-r prose-thead:from-orange-100 prose-thead:via-amber-100 prose-thead:to-orange-50
                prose-th:text-gray-800 prose-th:font-[Avenir-demi] prose-th:px-5 prose-th:py-4 prose-th:text-left prose-th:border-b-2 prose-th:border-orange-200
                prose-td:px-5 prose-td:py-4 prose-td:border-orange-100
                prose-tr:even:bg-gradient-to-r prose-tr:even:from-orange-50/70 prose-tr:even:to-amber-50/50 prose-tr:hover:bg-orange-100/80 prose-tr:transition-colors prose-tr:duration-200
                prose-hr:border-orange-200 prose-hr:my-10
                prose-code:bg-orange-50 prose-code:text-orange-800 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm
                ${articleClassName}
              `}
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>

          {/* Bottom decorative footer */}
          <div className="px-8 md:px-12 py-8 bg-gradient-to-r from-orange-100 via-amber-50 to-orange-100 border-t-2 border-orange-200/60">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <div className="flex items-center gap-3 text-orange-800">
                <span className="text-2xl">🙏</span>
                <span className="font-[Avenir-bold] text-lg">Trusted by 5,000+ pilgrims</span>
              </div>
              <span className="hidden md:block h-6 w-px bg-orange-300" />
              <div className="flex items-center gap-3 text-orange-700">
                <span className="text-xl">📞</span>
                <span className="font-[Avenir-regular]">24×7 Local Support</span>
              </div>
              <span className="hidden md:block h-6 w-px bg-orange-300" />
              <div className="flex items-center gap-3 text-orange-700">
                <span className="text-xl">⭐</span>
                <span className="font-[Avenir-regular]">Since 2018</span>
              </div>
            </div>
            
            {/* CTA buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={getWhatsAppUrl('Hi, I need help planning my Banaras trip')}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white font-[Avenir-demi] shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <span>💬</span>
                <span>WhatsApp Us</span>
              </a>
              <a
                href={getCallTelHref()}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-[Avenir-demi] shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <span>📞</span>
                <span>{`Call ${CONTACT.callNumberDisplay.replace('+91 ', '')}`}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
