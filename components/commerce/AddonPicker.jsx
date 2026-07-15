// components/commerce/AddonPicker.jsx
// Bundle upsells (boat / hotel / VIP darshan / guide). Controlled: parent owns
// the set of selected addon ids.

import React from 'react';
import { formatINR } from '@/lib/pricing';
import { ProductTypeIcon } from './icons';
import { Plus } from 'lucide-react';

export default function AddonPicker({ addons = [], selectedIds = [], onToggle, className = '' }) {
  if (!addons?.length) return null;
  return (
    <div className={className}>
      <span className="mb-2 block text-sm font-semibold">Add to your trip</span>
      <div className="grid gap-2 sm:grid-cols-2">
        {addons.map((a) => {
          const checked = selectedIds.includes(a.id);
          const Icon = ProductTypeIcon[a.productType] || Plus;
          return (
            <label
              key={a.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
                checked ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              <input
                type="checkbox"
                className="h-4 w-4 accent-current"
                checked={checked}
                onChange={() => onToggle?.(a.id)}
                aria-label={`${a.label} (${formatINR(a.price)})`}
              />
              <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="flex-1">{a.label}</span>
              <span className="font-medium">
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
