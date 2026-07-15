// components/commerce/InclusionsList.jsx
// What's included / excluded, with optional "show more".

import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

function List({ items, tone, expandableAfter }) {
  const [expanded, setExpanded] = useState(false);
  if (!items?.length) return null;
  const limit = expandableAfter && !expanded ? expandableAfter : items.length;
  const shown = items.slice(0, limit);
  const hidden = items.length - shown.length;
  const Icon = tone === 'in' ? Check : X;
  const color = tone === 'in' ? 'text-emerald-600' : 'text-rose-500';

  return (
    <div>
      <ul className="space-y-1.5 text-sm">
        {shown.map((it, i) => (
          <li key={i} className="flex items-start gap-2">
            <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} aria-hidden="true" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-2 text-sm font-semibold text-cyan-700 hover:underline"
        >
          +{hidden} more
        </button>
      )}
    </div>
  );
}

export default function InclusionsList({ inclusions = [], exclusions = [], expandableAfter, className = '' }) {
  if (!inclusions.length && !exclusions.length) return null;
  return (
    <div className={`grid gap-6 md:grid-cols-2 ${className}`}>
      {inclusions.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">What's included</h3>
          <List items={inclusions} tone="in" expandableAfter={expandableAfter} />
        </div>
      )}
      {exclusions.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Not included</h3>
          <List items={exclusions} tone="out" expandableAfter={expandableAfter} />
        </div>
      )}
    </div>
  );
}
