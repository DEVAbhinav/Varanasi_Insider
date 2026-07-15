// components/commerce/ReviewHighlights.jsx
// 1–3 short verified review quotes shown near the CTA.

import React from 'react';
import { Quote } from 'lucide-react';

export default function ReviewHighlights({ highlights = [], className = '' }) {
  if (!highlights?.length) return null;
  return (
    <div className={`grid gap-4 md:grid-cols-3 ${className}`}>
      {highlights.slice(0, 3).map((r, i) => (
        <figure key={i} className="rounded-xl border bg-card p-4">
          <Quote className="h-4 w-4 text-cyan-500" aria-hidden="true" />
          <blockquote className="mt-2 text-sm">{r.quote}</blockquote>
          {(r.author || r.trip) && (
            <figcaption className="mt-2 text-xs text-muted-foreground">
              {r.author}
              {r.trip ? ` · ${r.trip}` : ''}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
