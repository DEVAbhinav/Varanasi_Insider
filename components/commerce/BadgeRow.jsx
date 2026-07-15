// components/commerce/BadgeRow.jsx
// Renders verified trust/feature badges with matching inline icons.

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { badgeIcon } from './icons';

export default function BadgeRow({ badges = [], className = '' }) {
  if (!badges?.length) return null;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges.map((label, i) => {
        const Icon = badgeIcon(label);
        return (
          <Badge key={i} variant="secondary" className="rounded-full px-2.5 py-1 text-xs font-medium">
            <Icon className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
            {label}
          </Badge>
        );
      })}
    </div>
  );
}
