// components/commerce/VariantSelector.jsx
// Lets the user pick an offer variant and a quantity (members/passengers/days).
// Controlled component: parent owns state and receives changes.

import React from 'react';
import { Users, CalendarDays } from 'lucide-react';

const QTY_LABEL = {
  members: 'Travellers',
  passengers: 'Passengers',
  days: 'Days',
};

export default function VariantSelector({
  offers = [],
  selectedIndex = 0,
  quantity = 1,
  selector = 'members',
  onSelectOffer,
  onChangeQuantity,
  className = '',
}) {
  const showQty = selector && selector !== 'none' && selector !== 'vehicle';
  const qtyLabel = QTY_LABEL[selector] || 'Quantity';

  return (
    <div className={`space-y-4 ${className}`}>
      {offers.length > 1 && (
        <div>
          <span className="mb-2 block text-sm font-semibold">Choose an option</span>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Package options">
            {offers.map((o, i) => {
              const active = i === selectedIndex;
              return (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onSelectOffer?.(i)}
                  className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                    active
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {o.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showQty && (
        <div>
          <label htmlFor="commerce-qty" className="mb-2 block text-sm font-semibold">
            {qtyLabel}
          </label>
          <div className="inline-flex items-center rounded-xl border">
            <button
              type="button"
              aria-label={`Decrease ${qtyLabel.toLowerCase()}`}
              onClick={() => onChangeQuantity?.(Math.max(1, quantity - 1))}
              className="px-3 py-2 text-lg leading-none text-muted-foreground hover:text-foreground"
            >
              −
            </button>
            <span
              id="commerce-qty"
              className="inline-flex min-w-[3rem] items-center justify-center gap-1.5 border-x px-3 py-2 text-sm font-medium"
            >
              {selector === 'days' ? (
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Users className="h-4 w-4" aria-hidden="true" />
              )}
              {quantity}
            </span>
            <button
              type="button"
              aria-label={`Increase ${qtyLabel.toLowerCase()}`}
              onClick={() => onChangeQuantity?.(quantity + 1)}
              className="px-3 py-2 text-lg leading-none text-muted-foreground hover:text-foreground"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
