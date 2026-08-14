import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { EXTRA_PRESETS, makeExtra, formatINR } from '@/lib/quoteEngine';
import { MoneyInput } from './Controls';

/**
 * "Add other cost" block. One tap adds a pre-priced common extra; the amount and
 * label stay editable, and "Custom" adds a blank line for anything else.
 */
export default function ExtrasEditor({ extras = [], pax = 2, onChange, compact = false }) {
  const [open, setOpen] = useState(false);

  const add = (presetId) => {
    onChange([...extras, makeExtra(presetId)]);
    setOpen(false);
  };
  const update = (id, patch) =>
    onChange(extras.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const remove = (id) => onChange(extras.filter((x) => x.id !== id));

  return (
    <div className="space-y-2">
      {extras.map((x) => {
        const heads = x.perPax ? Math.max(1, Number(pax) || 1) : 1;
        const total = Math.round((Number(x.amount) || 0) * (Number(x.qty) || 1) * heads);
        return (
          <div key={x.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 p-2 sm:flex-nowrap sm:bg-transparent sm:p-0">
            <input
              value={x.label}
              onChange={(e) => update(x.id, { label: e.target.value })}
              placeholder="Cost name"
              className="min-w-0 flex-1 basis-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-500 sm:basis-auto"
            />
            <MoneyInput
              value={x.amount}
              onChange={(v) => update(x.id, { amount: v ?? 0 })}
              className="w-28 shrink-0"
            />
            <button
              type="button"
              onClick={() => update(x.id, { perPax: !x.perPax })}
              title="Multiply by number of guests"
              className={`shrink-0 rounded-lg border-2 px-2 py-2 text-xs font-semibold transition ${
                x.perPax
                  ? 'border-amber-500 bg-amber-50 text-amber-800'
                  : 'border-slate-200 text-slate-400 hover:border-amber-300'
              }`}
            >
              ×pax
            </button>
            <span className="ml-auto w-20 shrink-0 text-right text-sm font-semibold tabular-nums text-slate-700 sm:ml-0">
              {formatINR(total)}
            </span>
            <button
              type="button"
              aria-label={`Remove ${x.label}`}
              onClick={() => remove(x.id)}
              className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}

      {open ? (
        <div className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/60 p-3">
          <div className="flex flex-wrap gap-2">
            {EXTRA_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => add(p.id)}
                className="rounded-full border border-amber-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:bg-amber-100"
              >
                {p.label}{' '}
                <span className="text-xs text-slate-400">
                  {formatINR(p.amount)}
                  {p.perPax ? '/pax' : ''}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => add(null)}
              className="rounded-full border border-slate-400 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              + Custom cost
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-amber-700 transition hover:bg-amber-50 ${
            compact ? '' : 'mt-1'
          }`}
        >
          <Plus className="h-4 w-4" /> Add other cost
        </button>
      )}
    </div>
  );
}
