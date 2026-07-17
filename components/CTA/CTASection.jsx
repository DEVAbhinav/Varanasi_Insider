// components/CTA/CTASection.jsx
import { CONTACT, getCallTelHref } from '@/lib/contact';
import { logClick } from '@/lib/logClick';

export default function CTASection({
  phone = CONTACT.callNumberRaw,
  title = 'Need help planning your trip?',
  subtitle = 'Get personalized assistance for your Varanasi journey',
  variant = 'default', // "default" | "compact" | "service"
}) {
  const variants = {
    default: { wrapper: 'my-10 px-4', pad: 'p-6 sm:p-8', titleSize: 'text-2xl sm:text-3xl', maxWidth: 'max-w-4xl' },
    compact: { wrapper: 'my-6 px-4', pad: 'p-5 sm:p-6', titleSize: 'text-xl sm:text-2xl', maxWidth: 'max-w-3xl' },
    service: { wrapper: 'my-0 px-4', pad: 'p-6 sm:p-8', titleSize: 'text-2xl sm:text-3xl', maxWidth: 'max-w-5xl' },
  };
  const style = variants[variant] || variants.default;

  return (
    <section className={`${style.wrapper}`}>
      <div
        className={`relative ${style.maxWidth} mx-auto overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950 shadow-xl ${style.pad}`}
      >
        {/* Ambient warm glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange-500/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl"
        />

        <div className="relative flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300" />
              </span>
              We reply in minutes
            </span>
            <h3 className={`${style.titleSize} font-bold leading-tight text-white`}>{title}</h3>
            <p className="mt-1.5 text-sm text-slate-300 sm:text-base">{subtitle}</p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={getCallTelHref(phone)}
              onClick={() => logClick('CALL')}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3.5 font-bold text-slate-900 shadow-lg shadow-orange-900/30 transition-all duration-200 hover:from-amber-300 hover:to-orange-400 hover:shadow-orange-900/40 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900"
              aria-label={`Call ${phone}`}
            >
              <svg className="h-5 w-5 transition-transform group-hover:-rotate-12" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Call Now
            </a>
            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => logClick('WHATSAPP')}
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-6 py-3.5 font-bold text-emerald-50 backdrop-blur-sm transition-all duration-200 hover:bg-emerald-500/25 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-900"
              aria-label="Contact via WhatsApp"
            >
              <svg className="h-5 w-5 text-emerald-300 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
