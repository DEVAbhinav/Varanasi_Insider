import clsx from 'clsx';
import Image from 'next/image';
import {
  FiSunrise,
  FiSun,
  FiSunset,
  FiMoon,
  FiCoffee,
  FiMapPin,
  FiFeather,
  FiAnchor,
  FiAward,
  FiShoppingBag,
  FiCompass,
  FiClock,
} from 'react-icons/fi';
import styles from './ItineraryTimeline.module.css';

const ICON_MAP = {
  sunrise: FiSunrise,
  morning: FiSun,
  midday: FiSun,
  afternoon: FiSun,
  sunset: FiSunset,
  evening: FiMoon,
  night: FiMoon,
  food: FiCoffee,
  culinary: FiCoffee,
  culture: FiMapPin,
  heritage: FiAward,
  temple: FiAnchor,
  spiritual: FiFeather,
  river: FiAnchor,
  boat: FiAnchor,
  shopping: FiShoppingBag,
  compass: FiCompass,
  explore: FiCompass,
  default: FiClock,
};

const ACCENT_PALETTE = {
  ocean: {
    solid: '#0ea5e9',
    tint: 'rgba(125, 211, 252, 0.92)',
    soft: 'rgba(14, 165, 233, 0.16)',
    glow: 'rgba(14, 165, 233, 0.24)',
    surface: 'rgba(224, 242, 254, 0.88)',
    iconBorder: 'rgba(125, 211, 252, 0.55)',
  },
  lagoon: {
    solid: '#0891b2',
    tint: 'rgba(125, 211, 252, 0.85)',
    soft: 'rgba(8, 145, 178, 0.16)',
    glow: 'rgba(8, 145, 178, 0.24)',
    surface: 'rgba(207, 250, 254, 0.85)',
    iconBorder: 'rgba(6, 182, 212, 0.5)',
  },
  coral: {
    solid: '#fb7185',
    tint: 'rgba(253, 164, 175, 0.85)',
    soft: 'rgba(251, 113, 133, 0.16)',
    glow: 'rgba(251, 113, 133, 0.22)',
    surface: 'rgba(255, 241, 242, 0.9)',
    iconBorder: 'rgba(253, 164, 175, 0.55)',
  },
  teal: {
    solid: '#14b8a6',
    tint: 'rgba(94, 234, 212, 0.88)',
    soft: 'rgba(20, 184, 166, 0.18)',
    glow: 'rgba(20, 184, 166, 0.24)',
    surface: 'rgba(209, 250, 229, 0.9)',
    iconBorder: 'rgba(45, 212, 191, 0.55)',
  },
  amber: {
    solid: '#f59e0b',
    tint: 'rgba(253, 230, 138, 0.88)',
    soft: 'rgba(245, 158, 11, 0.16)',
    glow: 'rgba(245, 158, 11, 0.2)',
    surface: 'rgba(254, 243, 199, 0.9)',
    iconBorder: 'rgba(251, 191, 36, 0.5)',
  },
  rose: {
    solid: '#f43f5e',
    tint: 'rgba(253, 164, 175, 0.88)',
    soft: 'rgba(244, 63, 94, 0.14)',
    glow: 'rgba(244, 63, 94, 0.2)',
    surface: 'rgba(255, 228, 230, 0.92)',
    iconBorder: 'rgba(251, 113, 133, 0.52)',
  },
};

const getIcon = (token) => {
  if (!token) return ICON_MAP.default;
  const key = String(token).toLowerCase();
  return ICON_MAP[key] || ICON_MAP.default;
};

const getAccent = (token) => {
  if (!token) return ACCENT_PALETTE.ocean;
  const key = String(token).toLowerCase();
  return ACCENT_PALETTE[key] || ACCENT_PALETTE.ocean;
};

const formatLabel = (value) => (value ? String(value).toUpperCase() : 'HIGHLIGHT');

function TimelineEvent({ event, isLeft, accent }) {
  const { period, icon, title, description, image, imageAlt } = event;
  const Icon = getIcon(icon || period);
  const visualAlt = imageAlt || (title ? `${title} - itinerary highlight` : 'Itinerary highlight image');

  return (
    <div className={clsx(styles.event, isLeft ? styles.eventLeft : styles.eventRight)}>
      <article
        className="relative overflow-hidden rounded-[24px] px-5 py-5 transition-transform duration-200 ease-out hover:-translate-y-1 md:px-6 md:py-6"
        style={{
          background: `linear-gradient(150deg, rgba(255, 255, 255, 0.96), ${accent.surface})`,
          boxShadow: `0 26px 58px ${accent.glow}`,
          border: '1px solid rgba(255, 255, 255, 0.78)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[24px]"
          style={{
            background: `radial-gradient(circle at top, ${accent.tint}, transparent 60%)`,
            opacity: 0.2,
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1"
          style={{ background: `linear-gradient(90deg, ${accent.solid}, ${accent.tint})`, opacity: 0.9 }}
        />

  <div className="relative z-10 space-y-3.5">
          {image && (
            <div
              className="relative overflow-hidden rounded-2xl border border-white/70 shadow-[0_16px_40px_rgba(15,23,42,0.12)]"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.72))' }}
            >
              <div className="relative aspect-[16/10] md:aspect-[5/3]">
                <Image
                  src={image}
                  alt={visualAlt}
                  fill
                  sizes="(min-width: 1280px) 420px, (min-width: 768px) 360px, 92vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/35 via-slate-900/10 to-transparent" />
              </div>
            </div>
          )}

          {(period || icon) && (
            <span
              className="inline-flex items-center gap-3 rounded-full px-4 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-sky-900/80 shadow-sm backdrop-blur-sm"
              style={{
                background: `linear-gradient(130deg, rgba(255, 255, 255, 0.92), ${accent.surface})`,
                border: `1px solid ${accent.iconBorder}`,
              }}
            >
              <span
                className="inline-grid size-7 place-items-center rounded-full bg-white/90 shadow"
                style={{
                  color: accent.solid,
                  border: `1px solid ${accent.iconBorder}`,
                  boxShadow: `0 8px 18px ${accent.soft}`,
                }}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              {formatLabel(period || icon)}
            </span>
          )}

          {title && (
            <h3 className="text-[1.05rem] font-semibold leading-snug text-slate-900 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
              {title}
            </h3>
          )}

          {description && (
            <p className="text-[0.93rem] leading-relaxed text-slate-600">{description}</p>
          )}
        </div>

        <div
          className="pointer-events-none absolute -right-12 -bottom-12 size-24 rounded-full blur-3xl md:-right-16 md:size-36"
          style={{ background: accent.soft }}
        />
      </article>
    </div>
  );
}

export default function ItineraryTimeline({ itinerary, days: daysProp, hideHeader = false, className }) {
  if (!itinerary) return null;

  const { days: itineraryDays, title, intro, accentColor } = itinerary;
  const days = Array.isArray(daysProp) && daysProp.length > 0 ? daysProp : itineraryDays;
  if (!Array.isArray(days) || days.length === 0) return null;

  const accent = getAccent(accentColor);

  return (
    <section
      className={clsx(
        'mx-auto my-7 max-w-4xl rounded-[34px] border border-white/80 bg-gradient-to-br from-white/92 via-sky-50/82 to-cyan-50/78 px-5 py-7 shadow-[0_32px_82px_rgba(14,165,233,0.12)] ring-1 ring-cyan-100/40 backdrop-blur sm:px-10',
        className
      )}
      style={{
        '--itinerary-accent': accent.solid,
        '--itinerary-soft': accent.soft,
        boxShadow: `0 42px 95px ${accent.soft}`,
      }}
      aria-label={title || 'Travel itinerary'}
    >
      {!hideHeader && (
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold text-slate-900 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)] sm:text-[1.75rem]">
            {title || 'Detailed Itinerary'}
          </h2>
          {intro && <p className="mt-3 text-sm leading-relaxed text-slate-600/90">{intro}</p>}
        </div>
      )}

    <div className={clsx(hideHeader ? 'mt-1.5' : 'mt-6', 'space-y-7', styles.timeline)}>
        {days.map((day, dayIndex) => {
          const { label, summary, events } = day || {};
          const safeEvents = Array.isArray(events) ? events.filter(Boolean) : [];
          if (safeEvents.length === 0) return null;

          return (
            <div key={label || dayIndex} className="space-y-3.5">
              <div className="flex flex-col items-center gap-2 text-center lg:flex-row lg:justify-between lg:text-left">
                <div
                  className="rounded-full px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${accent.solid}, ${accent.tint})`,
                    boxShadow: `0 12px 28px ${accent.soft}`,
                  }}
                >
                  {label || `Day ${dayIndex + 1}`}
                </div>
                {summary && <p className="max-w-2xl text-sm text-slate-500">{summary}</p>}
              </div>

              <div className="space-y-5">
                {safeEvents.map((event, eventIndex) => (
                  <TimelineEvent
                    key={`${label || dayIndex}-${event?.title || eventIndex}`}
                    event={event}
                    isLeft={(dayIndex + eventIndex) % 2 === 0}
                    accent={accent}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
