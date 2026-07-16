// components/commerce/AddonPicker.jsx
// Bundle upsells (boat / hotel / VIP darshan / guide). Controlled: parent owns
// the set of selected addon ids. Each add-on can carry a `note` explaining why
// it helps — surfaced via a small "i" cue (hover on desktop, tap on mobile).

import React, { useState } from 'react';
import { formatINR } from '@/lib/pricing';
import { ProductTypeIcon } from './icons';
import { Plus, Info } from 'lucide-react';

export default function AddonPicker({ addons = [], selectedIds = [], onToggle, className = '' }) {
  const [openTipId, setOpenTipId] = useState(null);
  if (!addons?.length) return null;

  const toggleTip = (e, id) => {
    // Keep the tooltip control independent of the checkbox label.
    e.preventDefault();
    e.stopPropagation();
    setOpenTipId((cur) => (cur === id ? null : id));
  };

  return (
    <div className={className}>
      <span className="mb-2 block text-sm font-semibold">Add to your trip</span>
      <div className="grid gap-2 sm:grid-cols-2">
        {addons.map((a) => {
          const checked = selectedIds.includes(a.id);
          const Icon = ProductTypeIcon[a.productType] || Plus;
          const tipOpen = openTipId === a.id;
          return (
            <label
              key={a.id}
              className={`group relative flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
                checked ? 'border-cyan-500 bg-cyan-50' : 'border-border hover:border-cyan-400 hover:bg-cyan-50/40'
              }`}
            >
              <input
                type="checkbox"
                className="h-4 w-4 accent-cyan-600"
                checked={checked}
                onChange={() => onToggle?.(a.id)}
                aria-label={`${a.label} (${formatINR(a.price)})`}
              />
              <Icon className="h-4 w-4 shrink-0 text-cyan-600" aria-hidden="true" />
              <span className="flex-1">{a.label}</span>

              {a.note && (
                <span className="relative flex items-center">
                  <button
                    type="button"
                    onClick={(e) => toggleTip(e, a.id)}
                    onMouseEnter={() => setOpenTipId(a.id)}
                    onMouseLeave={() => setOpenTipId((cur) => (cur === a.id ? null : cur))}
                    aria-label={`Why add ${a.label}?`}
                    aria-expanded={tipOpen}
                    className="flex h-4 w-4 items-center justify-center rounded-full text-cyan-500 transition hover:text-cyan-700"
                  >
                    <Info className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  {tipOpen && (
                    <span
                      role="tooltip"
                      className="absolute bottom-full right-0 z-20 mb-2 w-52 rounded-lg bg-slate-900 px-3 py-2 text-xs font-normal leading-snug text-white shadow-lg"
                    >
                      {a.note}
                      <span className="absolute right-1.5 top-full -mt-1 h-2 w-2 rotate-45 bg-slate-900" />
                    </span>
                  )}
                </span>
              )}

              <span className="font-semibold text-cyan-700">
                +{formatINR(a.price)}
                {a.perPerson ? '/pp' : ''}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
