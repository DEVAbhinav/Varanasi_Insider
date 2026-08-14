import React, { useState } from "react";
import {
  PlaneLanding,
  PlaneTakeoff,
  TrainFront,
  Clock,
  Sun,
  Sunrise,
  Route,
  Coffee,
  Copy,
  Trash2,
  Pencil,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Search,
  MapPin,
} from "lucide-react";
import {
  DAY_TYPES,
  VEHICLES,
  ROUTES,
  POPULAR_ROUTE_IDS,
  getDayType,
  formatINR,
  suggestVehiclePlan,
} from "@/lib/quoteEngine";
import { Chip, MoneyInput, Field } from "./Controls";
import ExtrasEditor from "./ExtrasEditor";

const ICONS = {
  PlaneLanding,
  PlaneTakeoff,
  TrainFront,
  Clock,
  Sun,
  Sunrise,
  Route,
  Coffee,
};

/**
 * One day of the itinerary.
 *
 * Interaction model, deliberately shallow:
 *   1. Tap what happens that day (8 icon chips)  → price appears instantly
 *   2. Tap the car if the default is wrong
 *   3. Only outstation days reveal route/trip-type — everything else stays hidden
 *   4. The price is a normal editable number; a pencil reveals it, "reset" restores the engine value
 */
export default function DayCard({
  day,
  index,
  priced,
  pax,
  onChange,
  onDuplicate,
  onRemove,
  canRemove,
  expanded,
  onExpand,
}) {
  const type = getDayType(day.type);
  const [editPrice, setEditPrice] = useState(false);
  const [showVehicles, setShowVehicles] = useState(false);
  const [allRoutes, setAllRoutes] = useState(false);
  const [routeQuery, setRouteQuery] = useState("");
  const isOutstation = type.kind === "outstation";
  const isFree = type.kind === "free";
  const isCustomRoute = isOutstation && !day.routeId;
  const recommendedVehicleIds = suggestVehiclePlan(pax);
  const currentVehicleIds = day.vehicleIds?.length
    ? day.vehicleIds
    : [day.vehicleId];
  const usesRecommendedPlan =
    currentVehicleIds.length === recommendedVehicleIds.length &&
    currentVehicleIds.every((id, i) => id === recommendedVehicleIds[i]);
  const recommendedVehicles = recommendedVehicleIds.map(
    (id) => VEHICLES.find((vehicle) => vehicle.id === id) || VEHICLES[0],
  );
  const recommendedSeats = recommendedVehicles.reduce(
    (sum, vehicle) => sum + vehicle.seats,
    0,
  );

  // Keep the picker short: popular destinations first, the rest one tap away
  // (or already shown when the day is set to an unlisted place).
  const candidateRoutes =
    allRoutes || routeQuery
      ? ROUTES
      : ROUTES.filter(
          (route) =>
            POPULAR_ROUTE_IDS.includes(route.id) || route.id === day.routeId,
        );
  const visibleRoutes = candidateRoutes.filter((route) =>
    route.name.toLowerCase().includes(routeQuery.trim().toLowerCase()),
  );

  const set = (patch) => onChange({ ...day, ...patch });

  return (
    <section className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm transition hover:border-slate-300">
      {/* Header stays useful when the day is collapsed. */}
      <header className="border-b border-slate-100 bg-slate-50/70 px-4 py-3">
        <div className="flex items-start gap-2">
          <button
            type="button"
            onClick={onExpand}
            disabled={expanded}
            className="flex min-w-0 flex-1 items-start gap-3 text-left disabled:cursor-default"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-slate-900">
                Day {index + 1} · {type.label}
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                {priced?.detail}
              </span>
              {!expanded && day.note && (
                <span className="mt-1 block truncate text-xs italic text-slate-500">
                  Note: {day.note}
                </span>
              )}
              {!expanded && !!priced?.extras?.length && (
                <span className="mt-1 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                  {priced.extras.length} extra
                  {priced.extras.length === 1 ? "" : "s"} included
                </span>
              )}
            </span>
          </button>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <span
              className={`text-right font-bold tabular-nums ${
                priced?.needsDistance
                  ? "text-xs text-amber-700"
                  : "text-lg text-slate-900"
              }`}
            >
              {priced?.needsDistance
                ? "Distance needed"
                : formatINR(priced?.total || 0)}
              {priced?.overridden && (
                <span className="ml-1 align-middle text-[10px] font-semibold uppercase text-amber-600">
                  edited
                </span>
              )}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                aria-label={`Duplicate day ${index + 1}`}
                onClick={onDuplicate}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700"
              >
                <Copy className="h-4 w-4" />
              </button>
              {canRemove && (
                <button
                  type="button"
                  aria-label={`Remove day ${index + 1}`}
                  onClick={onRemove}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              {!expanded && (
                <button
                  type="button"
                  aria-label={`Edit day ${index + 1}`}
                  onClick={onExpand}
                  className="rounded-lg p-2 text-amber-700 transition hover:bg-amber-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {expanded && (
        <div className="space-y-4 p-4">
          {/* 1. What happens today */}
          <div className="grid grid-cols-4 gap-2">
            {DAY_TYPES.map((t) => {
              const Icon = ICONS[t.icon] || Sun;
              const active = t.id === day.type;
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => set({ type: t.id, priceOverride: null })}
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 px-1 py-2.5 text-center transition active:scale-95 ${
                    active
                      ? "border-amber-500 bg-amber-50 text-amber-900 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:border-amber-300 hover:bg-amber-50/50"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${active ? "text-amber-600" : "text-slate-400"}`}
                  />
                  <span className="text-[11px] font-semibold leading-tight">
                    {t.short}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 2. Vehicle — one line, expands to all options */}
          {!isFree && (
            <div>
              <button
                type="button"
                onClick={() => setShowVehicles((s) => !s)}
                className="flex w-full items-center justify-between rounded-xl border-2 border-slate-200 px-3 py-2.5 text-left transition hover:border-amber-300"
              >
                <span className="text-sm">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Vehicle plan
                  </span>
                  <span className="ml-2 font-semibold text-slate-900">
                    {priced?.vehicleName}
                  </span>
                  {currentVehicleIds.length > 1 && (
                    <span className="ml-2 text-xs font-medium text-emerald-700">
                      {priced?.seats} seats
                    </span>
                  )}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition ${showVehicles ? "rotate-180" : ""}`}
                />
              </button>
              {showVehicles && (
                <div className="mt-2 space-y-2">
                  {recommendedVehicleIds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        set({
                          vehicleId: recommendedVehicleIds[0],
                          vehicleIds: recommendedVehicleIds,
                          priceOverride: null,
                        });
                        setShowVehicles(false);
                      }}
                      className={`w-full rounded-xl border-2 px-3 py-2.5 text-left text-sm transition ${
                        usesRecommendedPlan
                          ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                          : "border-slate-200 hover:border-emerald-400 hover:bg-emerald-50"
                      }`}
                    >
                      <span className="block font-bold">
                        Recommended for {pax} guests
                      </span>
                      <span className="text-xs">
                        {priced?.vehicleName} · {recommendedSeats} seats
                      </span>
                    </button>
                  )}
                  {recommendedVehicleIds.length === 1 && (
                    <div className="flex flex-wrap gap-2">
                      {VEHICLES.map((v) => (
                        <Chip
                          key={v.id}
                          active={
                            currentVehicleIds.length === 1 &&
                            v.id === day.vehicleId
                          }
                          disabled={v.seats < pax}
                          onClick={() => {
                            set({
                              vehicleId: v.id,
                              vehicleIds: [v.id],
                              priceOverride: null,
                            });
                            setShowVehicles(false);
                          }}
                          className="disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {v.name}
                          <span className="ml-1 text-xs opacity-70">
                            {v.seats} seats
                            {v.seats < pax ? " · too small" : ""}
                          </span>
                        </Chip>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 3. Outstation-only details */}
          {isOutstation && (
            <div className="space-y-3 rounded-xl bg-slate-50 p-3">
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Where to
                </p>
                <div className="relative mb-2">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={routeQuery}
                    onChange={(event) => setRouteQuery(event.target.value)}
                    placeholder="Search destination"
                    className="w-full rounded-xl border-2 border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {visibleRoutes.map((r) => (
                    <Chip
                      key={r.id}
                      active={r.id === day.routeId}
                      onClick={() => {
                        set({
                          routeId: r.id,
                          destinationName: "",
                          distanceKm: null,
                          priceOverride: null,
                        });
                        setRouteQuery("");
                      }}
                    >
                      {r.name}
                      <span className="ml-1 text-xs opacity-70">
                        {r.distanceKm} km
                      </span>
                    </Chip>
                  ))}
                  {!routeQuery && !allRoutes && (
                    <button
                      type="button"
                      onClick={() => setAllRoutes(true)}
                      className="rounded-full px-3 py-1.5 text-sm font-semibold text-amber-700 underline-offset-2 hover:underline"
                    >
                      More places…
                    </button>
                  )}
                  <Chip
                    active={isCustomRoute}
                    onClick={() =>
                      set({
                        routeId: null,
                        destinationName:
                          routeQuery || day.destinationName || "",
                        distanceKm: day.routeId ? null : day.distanceKm,
                        priceOverride: null,
                      })
                    }
                  >
                    <MapPin className="mr-1 inline h-3.5 w-3.5" />
                    {routeQuery ? `Other: ${routeQuery}` : "Other destination"}
                  </Chip>
                </div>
                {isCustomRoute && (
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Field label="Destination">
                      <input
                        value={day.destinationName || ""}
                        onChange={(event) =>
                          set({
                            destinationName: event.target.value,
                            priceOverride: null,
                          })
                        }
                        placeholder="Place or city name"
                        className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
                      />
                    </Field>
                    <Field label="One-way distance (km)">
                      <input
                        type="number"
                        min="1"
                        inputMode="numeric"
                        value={day.distanceKm ?? ""}
                        onChange={(event) =>
                          set({
                            distanceKm:
                              event.target.value === ""
                                ? null
                                : Number(event.target.value),
                            priceOverride: null,
                          })
                        }
                        placeholder="Required for price"
                        className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
                      />
                    </Field>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Trip">
                  <div className="flex flex-wrap gap-2">
                    {["round-trip", "one-way"].map((t) => (
                      <Chip
                        key={t}
                        active={day.tripType === t}
                        onClick={() =>
                          set({ tripType: t, priceOverride: null })
                        }
                      >
                        {t === "round-trip" ? "Return" : "One way"}
                      </Chip>
                    ))}
                  </div>
                </Field>
                <Field label="Night halt">
                  <div className="flex flex-wrap gap-2">
                    {[0, 1, 2].map((n) => (
                      <Chip
                        key={n}
                        active={(day.nights || 0) === n}
                        onClick={() => set({ nights: n, priceOverride: null })}
                      >
                        {n === 0 ? "None" : `${n} night${n > 1 ? "s" : ""}`}
                      </Chip>
                    ))}
                  </div>
                </Field>
              </div>
            </div>
          )}

          {/* 4. Price — pre-filled by the engine, editable on demand */}
          {!isFree && !priced?.needsDistance && (
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
              <span className="flex-1 text-sm font-medium text-slate-600">
                Car cost for this day
              </span>
              {editPrice || priced?.overridden ? (
                <>
                  <MoneyInput
                    value={day.priceOverride ?? priced?.computed ?? 0}
                    onChange={(v) => set({ priceOverride: v })}
                    className="w-32"
                    autoFocus={editPrice}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      set({ priceOverride: null });
                      setEditPrice(false);
                    }}
                    title="Reset to engine price"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditPrice(true)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1 text-lg font-bold tabular-nums text-slate-900 transition hover:bg-white"
                >
                  {formatINR(priced?.transport || 0)}
                  <Pencil className="h-3.5 w-3.5 text-slate-400" />
                </button>
              )}
            </div>
          )}

          {/* 5. Extras + note */}
          <ExtrasEditor
            extras={day.extras || []}
            pax={pax}
            onChange={(extras) => set({ extras })}
          />

          <input
            value={day.note || ""}
            onChange={(e) => set({ note: e.target.value })}
            placeholder="Note for this day (optional) — e.g. 5 am Sangam snan"
            className="w-full rounded-xl border-2 border-dashed border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-amber-400"
          />
        </div>
      )}
    </section>
  );
}
