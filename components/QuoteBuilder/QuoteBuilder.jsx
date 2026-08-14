import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Users,
  Copy,
  Check,
  RotateCcw,
  MessageCircle,
  Printer,
  Sparkles,
} from "lucide-react";
import {
  makeDay,
  makeExtra,
  priceQuote,
  quoteToText,
  suggestVehiclePlan,
  applyTemplate,
  QUICK_TEMPLATES,
  formatINR,
} from "@/lib/quoteEngine";
import { Chip, Stepper, MoneyInput } from "./Controls";
import DayCard from "./DayCard";
import ExtrasEditor from "./ExtrasEditor";

const STORAGE_KEY = "kt-quote-draft-v1";

const blankQuote = () => ({
  customerName: "",
  pax: 2,
  days: [makeDay(0, { vehicleId: "dzire" })],
  extras: [],
  markupPct: 0,
  discount: 0,
});

export default function QuoteBuilder() {
  const [quote, setQuote] = useState(blankQuote);
  const [activeDayId, setActiveDayId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Work survives a refresh or an accidental tab close.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.days?.length) {
          setQuote(saved);
          setActiveDayId(saved.days[0].id);
        }
      }
    } catch {
      /* ignore corrupt drafts */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quote));
    } catch {
      /* storage full or blocked — the tool still works */
    }
  }, [quote, loaded]);

  const priced = useMemo(() => priceQuote(quote), [quote]);

  const set = (patch) => setQuote((q) => ({ ...q, ...patch }));

  /** Changing head count re-suggests the car on days the user hasn't priced by hand. */
  const setPax = (pax) => {
    const vehicleIds = suggestVehiclePlan(pax);
    setQuote((q) => ({
      ...q,
      pax,
      days: q.days.map((d) =>
        d.priceOverride == null
          ? { ...d, vehicleId: vehicleIds[0], vehicleIds }
          : d,
      ),
    }));
  };

  const addDay = () => {
    const day = makeDay(quote.days.length, {
      vehicleId: quote.days[quote.days.length - 1]?.vehicleId,
      vehicleIds:
        quote.days[quote.days.length - 1]?.vehicleIds ||
        suggestVehiclePlan(quote.pax),
    });
    setQuote((q) => {
      const last = q.days[q.days.length - 1];
      return {
        ...q,
        days: [
          ...q.days,
          { ...day, vehicleId: last?.vehicleId || day.vehicleId },
        ],
      };
    });
    setActiveDayId(day.id);
  };

  const updateDay = (id, next) =>
    setQuote((q) => ({
      ...q,
      days: q.days.map((d) => (d.id === id ? next : d)),
    }));

  const duplicateDay = (id) => {
    const copyId = makeDay(0).id;
    setQuote((q) => {
      const i = q.days.findIndex((d) => d.id === id);
      if (i < 0) return q;
      const source = q.days[i];
      const copy = {
        ...source,
        id: copyId,
        extras: (source.extras || []).map((x) => ({
          ...x,
          id: makeExtra(null).id,
        })),
      };
      const days = [...q.days];
      days.splice(i + 1, 0, copy);
      return { ...q, days };
    });
    setActiveDayId(copyId);
  };

  const removeDay = (id) => {
    const index = quote.days.findIndex((d) => d.id === id);
    const remaining = quote.days.filter((d) => d.id !== id);
    setQuote((q) => ({ ...q, days: q.days.filter((d) => d.id !== id) }));
    if (activeDayId === id) {
      setActiveDayId(
        remaining[Math.min(index, remaining.length - 1)]?.id || null,
      );
    }
  };

  const applyQuickTemplate = (tplId) => {
    const days = applyTemplate(tplId, { pax: quote.pax });
    setQuote((q) => ({ ...q, days }));
    setActiveDayId(days[0]?.id || null);
  };

  const reset = () => {
    const next = blankQuote();
    setQuote(next);
    setActiveDayId(next.days[0].id);
  };

  const text = useMemo(() => quoteToText(quote, priced), [quote, priced]);
  const hasPendingPrices = priced.days.some((day) => day.needsDistance);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const whatsapp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener",
    );
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-40 pt-6">
      {/* Trip basics — 2 fields, nothing more */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <input
            value={quote.customerName}
            onChange={(e) => set({ customerName: e.target.value })}
            placeholder="Customer name (optional)"
            className="min-w-[180px] flex-1 rounded-xl border-2 border-slate-200 px-3 py-2.5 text-base outline-none placeholder:text-slate-400 focus:border-amber-500"
          />
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
              <Users className="h-4 w-4 text-slate-400" /> Guests
            </span>
            <Stepper
              value={quote.pax}
              onChange={setPax}
              min={1}
              max={40}
              label="guests"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <Sparkles className="h-3.5 w-3.5" /> Start from
          </span>
          {QUICK_TEMPLATES.map((t) => (
            <Chip key={t.id} onClick={() => applyQuickTemplate(t.id)}>
              {t.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Days */}
      <div className="mt-4 space-y-4">
        {quote.days.map((day, i) => (
          <DayCard
            key={day.id}
            day={day}
            index={i}
            pax={quote.pax}
            priced={priced.days[i]}
            expanded={(activeDayId || quote.days[0]?.id) === day.id}
            canRemove={quote.days.length > 1}
            onExpand={() => setActiveDayId(day.id)}
            onChange={(next) => updateDay(day.id, next)}
            onDuplicate={() => duplicateDay(day.id)}
            onRemove={() => removeDay(day.id)}
          />
        ))}
      </div>

      {/* The one big button */}
      <button
        type="button"
        onClick={addDay}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50/60 px-4 py-4 text-base font-bold text-amber-800 transition hover:bg-amber-100 active:scale-[0.99]"
      >
        <Plus className="h-5 w-5" /> Add Day {quote.days.length + 1}
      </button>

      {/* Trip-wide costs & adjustments */}
      <div className="mt-6 rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
          Whole-trip costs
        </h2>
        <ExtrasEditor
          extras={quote.extras}
          pax={quote.pax}
          onChange={(extras) => set({ extras })}
          compact
        />
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Service charge %
            </span>
            <div className="flex items-center rounded-xl border-2 border-slate-200 focus-within:border-amber-500">
              <input
                type="number"
                value={quote.markupPct || ""}
                placeholder="0"
                onChange={(e) =>
                  set({ markupPct: Number(e.target.value) || 0 })
                }
                className="w-full min-w-0 bg-transparent px-3 py-2 text-right text-base font-semibold tabular-nums outline-none"
              />
              <span className="pr-3 text-slate-400">%</span>
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Discount
            </span>
            <MoneyInput
              value={quote.discount || null}
              onChange={(v) => set({ discount: v || 0 })}
            />
          </label>
        </div>
      </div>

      {/* Printable summary */}
      <div className="mt-6 rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-sm print:border-0 print:shadow-none">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
          Quotation summary
        </h2>
        <dl className="space-y-1.5 text-sm">
          {priced.days.map((d, i) => (
            <div key={d.dayId} className="flex justify-between gap-4">
              <dt className="min-w-0 truncate text-slate-600">
                Day {i + 1} · {d.typeLabel}
                {d.extras.length ? ` + ${d.extras.length} extra` : ""}
              </dt>
              <dd className="shrink-0 font-semibold tabular-nums">
                {d.needsDistance ? "Distance needed" : formatINR(d.total)}
              </dd>
            </div>
          ))}
          {priced.tripExtras.map((x) => (
            <div key={x.id} className="flex justify-between gap-4">
              <dt className="min-w-0 truncate text-slate-600">{x.label}</dt>
              <dd className="shrink-0 font-semibold tabular-nums">
                {formatINR(x.total)}
              </dd>
            </div>
          ))}
          {!!priced.markup && (
            <div className="flex justify-between gap-4 text-slate-600">
              <dt>Service charge ({priced.markupPct}%)</dt>
              <dd className="font-semibold tabular-nums">
                {formatINR(priced.markup)}
              </dd>
            </div>
          )}
          {!!priced.discount && (
            <div className="flex justify-between gap-4 text-emerald-700">
              <dt>Discount</dt>
              <dd className="font-semibold tabular-nums">
                −{formatINR(priced.discount)}
              </dd>
            </div>
          )}
        </dl>
        <div className="mt-3 flex items-end justify-between border-t-2 border-slate-900 pt-3">
          <span className="text-base font-bold">
            {hasPendingPrices ? "Partial total" : "Total"}
          </span>
          <div className="text-right">
            <span className="text-2xl font-extrabold tabular-nums">
              {formatINR(priced.total)}
            </span>
            <p className="text-xs text-slate-500">
              {formatINR(priced.perPax)} per person · {priced.pax} guests
            </p>
          </div>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
          Estimate includes fuel, driver and toll assumptions. State tax,
          parking and monument entries extra where applicable.
        </p>
        {hasPendingPrices && (
          <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
            Add the missing one-way distance before sharing this quote.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={reset}
        className="mx-auto mt-6 flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-rose-600 print:hidden"
      >
        <RotateCcw className="h-3.5 w-3.5" /> Start a new quote
      </button>

      {/* Sticky total bar — always visible while scrolling */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-slate-200 bg-white/95 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {priced.days.length} day{priced.days.length === 1 ? "" : "s"} ·{" "}
              {priced.pax} guests
            </p>
            <p className="text-2xl font-extrabold leading-tight tabular-nums text-slate-900">
              {formatINR(priced.total)}
              {hasPendingPrices ? " partial" : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            aria-label="Print quotation"
            className="hidden h-12 w-12 items-center justify-center rounded-xl border-2 border-slate-200 text-slate-600 transition hover:border-slate-400 sm:flex"
          >
            <Printer className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={copy}
            disabled={hasPendingPrices}
            className="flex h-12 items-center gap-2 rounded-xl border-2 border-slate-900 px-4 font-bold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copied ? (
              <Check className="h-5 w-5 text-emerald-600" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
            <span className="hidden sm:inline">
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
          <button
            type="button"
            onClick={whatsapp}
            disabled={hasPendingPrices}
            className="flex h-12 items-center gap-2 rounded-xl bg-emerald-600 px-4 font-bold text-white transition hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
