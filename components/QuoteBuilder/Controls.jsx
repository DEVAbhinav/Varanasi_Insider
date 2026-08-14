import React from 'react';

/**
 * Borderless number input that shows the value big and editable.
 * Sales types straight over the pre-filled number — no "edit" mode to discover.
 */
export function MoneyInput({ value, onChange, className = '', placeholder = '0', ...rest }) {
  return (
    <div className={`flex items-center rounded-xl border-2 border-slate-200 bg-white focus-within:border-amber-500 ${className}`}>
      <span className="pl-3 text-slate-400">₹</span>
      <input
        type="number"
        inputMode="numeric"
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        className="w-full min-w-0 bg-transparent px-2 py-2 text-right text-base font-semibold tabular-nums outline-none"
        {...rest}
      />
    </div>
  );
}

/** Big +/- stepper. Easier than typing on a phone. */
export function Stepper({ value, onChange, min = 1, max = 99, label }) {
  const v = Number(value) || min;
  const step = (delta) => onChange(Math.min(max, Math.max(min, v + delta)));
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        onClick={() => step(-1)}
        className="h-10 w-10 rounded-full border-2 border-slate-200 text-xl font-bold text-slate-600 transition hover:border-amber-400 hover:text-amber-700 active:scale-95"
      >
        –
      </button>
      <span className="w-10 text-center text-xl font-bold tabular-nums text-slate-900">{v}</span>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        onClick={() => step(1)}
        className="h-10 w-10 rounded-full border-2 border-slate-200 text-xl font-bold text-slate-600 transition hover:border-amber-400 hover:text-amber-700 active:scale-95"
      >
        +
      </button>
    </div>
  );
}

/** Pill-shaped single choice. The whole UI is built from these. */
export function Chip({ active, children, className = '', ...rest }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`rounded-full border-2 px-3 py-1.5 text-sm font-medium transition active:scale-95 ${
        active
          ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
          : 'border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50'
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Field({ label, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}
