// components/commerce/TrustRibbon.jsx
// Verified-only trust strip. Pulls rating/years from config/business.js so
// numbers never diverge across the site.

import React from 'react';
import { Star, ShieldCheck, CalendarClock, MapPin } from 'lucide-react';
import { BUSINESS } from '@/config/business';

export default function TrustRibbon({ extraClaims = [], className = '' }) {
  const years = typeof BUSINESS.yearsInService === 'function' ? BUSINESS.yearsInService() : null;
  const items = [
    BUSINESS.rating && {
      Icon: Star,
      text: `${BUSINESS.rating}★ (${BUSINESS.reviewCount} Google reviews)`,
    },
    years && { Icon: CalendarClock, text: `${years}+ years serving Varanasi` },
    { Icon: ShieldCheck, text: 'Commercial-permit fleet' },
    BUSINESS.addressLocality && { Icon: MapPin, text: `Local operator, ${BUSINESS.address?.addressLocality || 'Varanasi'}` },
    ...extraClaims.map((t) => ({ Icon: ShieldCheck, text: t })),
  ].filter(Boolean);

  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${className}`}>
      {items.map((it, i) => (
        <div key={i} className="inline-flex items-center gap-1.5 text-sm">
          <it.Icon className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>{it.text}</span>
        </div>
      ))}
    </div>
  );
}
