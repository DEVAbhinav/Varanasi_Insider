// components/commerce/BadgeRow.jsx
// Renders verified trust/feature badges with matching inline icons.

import React from 'react';
import { badgeIcon } from './icons';

export default function BadgeRow({ badges = [], tone = 'default', className = '' }) {
  if (!badges?.length) return null;
  const light = tone === 'light';
  const chipCls = light
    ? 'border border-white/50 bg-white/25 text-white font-semibold backdrop-blur-sm'
    : 'border border-cyan-100 bg-cyan-50 text-cyan-800';
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges.map((label, i) => {
        const Icon = badgeIcon(label);
        return (
          <span
            key={i}
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${chipCls}`}
          >
            <Icon className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
            {label}
          </span>
        );
      })}
    </div>
  );
}
