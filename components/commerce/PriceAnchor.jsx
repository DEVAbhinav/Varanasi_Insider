// components/commerce/PriceAnchor.jsx
// "from ₹X / unit" price anchor chip. Read-only display of the starting price.

import React from 'react';
import { formatINR } from '@/lib/pricing';

export default function PriceAnchor({ price, unit, priceType = 'from', tone = 'default', className = '' }) {
  if (!price) return null;
  const n = Number(String(price).replace(/[,₹\s]/g, ''));
  if (!Number.isFinite(n) || n <= 0) return null;

  const light = tone === 'light';
  const subCls = light ? 'text-white/80' : 'text-muted-foreground';
  const numCls = light ? 'text-white' : 'text-cyan-700';

  return (
    <div className={`inline-flex items-baseline gap-1.5 ${className}`}>
      {priceType === 'from' && (
        <span className={`text-xs font-medium ${subCls}`}>from</span>
      )}
      <span className={`text-2xl font-bold tracking-tight ${numCls}`}>{formatINR(n)}</span>
      {unit && <span className={`text-xs ${subCls}`}>{unit}</span>}
    </div>
  );
}
