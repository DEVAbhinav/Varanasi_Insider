// components/commerce/FactRow.jsx
// Compact fact row: duration · passengers · distance · pickup coverage.

import React from 'react';
import { FactIcons } from './icons';

export default function FactRow({ facts = [], className = '' }) {
  const visible = facts.filter((f) => f && f.value);
  if (!visible.length) return null;
  return (
    <ul className={`flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground ${className}`}>
      {visible.map((f, i) => {
        const Icon = FactIcons[f.key] || FactIcons.duration;
        return (
          <li key={i} className="inline-flex items-center gap-1.5">
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span>{f.value}</span>
          </li>
        );
      })}
    </ul>
  );
}
