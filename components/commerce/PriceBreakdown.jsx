// components/commerce/PriceBreakdown.jsx
// Transparent line-item breakdown for the current estimate.

import React from 'react';
import { formatINR } from '@/lib/pricing';

export default function PriceBreakdown({ estimate, className = '' }) {
  if (!estimate) return null;
  return (
    <div className={`rounded-xl border bg-muted/30 p-4 ${className}`}>
      <ul className="space-y-1.5 text-sm">
        {estimate.lines.map((l, i) => (
          <li key={i} className="flex items-center justify-between">
            <span className="text-muted-foreground">{l.label}</span>
            <span className="font-medium">{formatINR(l.amount)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-baseline justify-between border-t pt-3">
        <span className="text-sm font-semibold">
          Estimated total {estimate.priceType === 'from' ? '(from)' : ''}
        </span>
        <span className="text-xl font-semibold">{formatINR(estimate.total)}</span>
      </div>
      {estimate.assumptions && (
        <p className="mt-1 text-xs text-muted-foreground">Based on: {estimate.assumptions}</p>
      )}
    </div>
  );
}
