// lib/quoteEngine.js
// Day-by-day quotation engine for the internal sales pricing tool.
//
// Design rules:
//  - Pure and dependency-free (no React, no fetch). Never throws.
//  - Every number it produces is a *suggestion*: the UI may override any of
//    them, and an override always wins over the computed value.
//  - Outstation days reuse the owner-locked model in lib/routePricing.js so the
//    sales quote can never drift from the public fare-card pages.
//
// A quote is: { pax, days: [Day], extras: [Extra], discount, markupPct }
// A Day is:   { id, type, vehicleId, routeId, distanceKm, tripType, nights,
//               priceOverride, note, extras: [Extra] }

import vehiclesData from "../data/vehicles.json";
import routesData from "../data/routes.json";
import { estimateRoute, computeMinBillKm } from "./routePricing";

export const VEHICLES = vehiclesData;

export const ROUTES = (routesData.routes || [])
  .map((r) => ({
    id: r.id,
    name: r.name,
    distanceKm: r.distanceKm,
    minBillKm: r.minBillKm,
    driveTime: r.driveTimeNormal || "",
    offersOneWay: r.offersOneWay !== false,
  }))
  .sort((a, b) => a.distanceKm - b.distanceKm);

/** Routes sales quotes most often — shown first, rest behind "More". */
export const POPULAR_ROUTE_IDS = [
  "sarnath",
  "vindhyachal",
  "prayagraj",
  "ayodhya",
  "bodhgaya",
  "lucknow",
];

export const getVehicle = (id) =>
  VEHICLES.find((v) => v.id === id) || VEHICLES[0];
export const getRoute = (id) => ROUTES.find((r) => r.id === id) || null;

const vehicleIdsForDay = (day = {}) => {
  const ids = Array.isArray(day.vehicleIds)
    ? day.vehicleIds.filter(Boolean)
    : [];
  return ids.length ? ids : [day.vehicleId || VEHICLES[0].id];
};

const vehiclePlanLabel = (vehicles = []) => {
  const counts = vehicles.reduce((all, vehicle) => {
    all.set(vehicle.id, {
      vehicle,
      count: (all.get(vehicle.id)?.count || 0) + 1,
    });
    return all;
  }, new Map());
  return [...counts.values()]
    .map(({ vehicle, count }) => {
      const name =
        vehicles.length > 1 && vehicle.id.startsWith("tempo-")
          ? `Tempo ${vehicle.seats}`
          : vehicle.name;
      return `${name}${count > 1 ? ` ×${count}` : ""}`;
    })
    .join(" + ");
};

/**
 * Local / airport package rate card, per vehicle, in rupees.
 * Sedan, Innova and Tempo rows mirror lib/taxiRates.js (the public rate card);
 * the remaining vehicles are interpolated from the same card. Sales can still
 * edit any day price inline, so these are starting points, not hard prices.
 */
export const LOCAL_RATES = {
  dzire: { airport: 899, half: 1100, full: 2499, extended: 3200 },
  ertiga: { airport: 1299, half: 1400, full: 2800, extended: 3900 },
  innova: { airport: 1500, half: 1600, full: 3200, extended: 4500 },
  crysta: { airport: 1800, half: 2000, full: 3800, extended: 5200 },
  "tempo-12": { airport: 2200, half: 2000, full: 3800, extended: 5000 },
  "tempo-17": { airport: 2500, half: 2200, full: 4250, extended: 5500 },
  "tempo-26": { airport: 3200, half: 2800, full: 5200, extended: 6800 },
  urbania: { airport: 3500, half: 3000, full: 5800, extended: 7200 },
};

/**
 * The day types a sales person can pick, in the order they appear in the UI.
 * `kind` drives how the engine prices the day:
 *   'local'      -> flat package price from LOCAL_RATES[vehicle][rateKey]
 *   'outstation' -> per-km model from lib/routePricing.js
 *   'free'       -> zero (rest day / own arrangement)
 */
export const DAY_TYPES = [
  {
    id: "airport-pickup",
    label: "Airport Pickup",
    short: "Pickup",
    kind: "local",
    rateKey: "airport",
    hint: "Airport → hotel, 25–30 km",
    icon: "PlaneLanding",
  },
  {
    id: "airport-drop",
    label: "Airport Drop",
    short: "Drop",
    kind: "local",
    rateKey: "airport",
    hint: "Hotel → airport, 25–30 km",
    icon: "PlaneTakeoff",
  },
  {
    id: "station-transfer",
    label: "Station Transfer",
    short: "Station",
    kind: "local",
    rateKey: "airport",
    factor: 0.7,
    hint: "Cantt / Banaras station ↔ hotel",
    icon: "TrainFront",
  },
  {
    id: "half-day",
    label: "Half Day Local",
    short: "Half day",
    kind: "local",
    rateKey: "half",
    hint: "4 hrs • 40 km in city",
    icon: "Clock",
  },
  {
    id: "full-day",
    label: "Full Day Local",
    short: "Full day",
    kind: "local",
    rateKey: "full",
    hint: "8 hrs • 80 km in city",
    icon: "Sun",
  },
  {
    id: "extended-day",
    label: "Extended Day",
    short: "Extended",
    kind: "local",
    rateKey: "extended",
    hint: "12 hrs • 120 km",
    icon: "Sunrise",
  },
  {
    id: "outstation",
    label: "Outstation Trip",
    short: "Outstation",
    kind: "outstation",
    hint: "Ayodhya, Prayagraj, Bodhgaya…",
    icon: "Route",
  },
  {
    id: "free",
    label: "Free / No Car",
    short: "Free",
    kind: "free",
    hint: "Rest day, no vehicle billed",
    icon: "Coffee",
  },
];

export const getDayType = (id) =>
  DAY_TYPES.find((t) => t.id === id) || DAY_TYPES[4];

/** One-tap extras. `perPax` multiplies by the head count. */
export const EXTRA_PRESETS = [
  { id: "guide", label: "Local guide", amount: 2500, perPax: false },
  { id: "boat", label: "Boat ride (shared)", amount: 400, perPax: true },
  { id: "boat-private", label: "Private boat", amount: 2000, perPax: false },
  { id: "aarti", label: "Ganga Aarti VIP seats", amount: 500, perPax: true },
  { id: "hotel", label: "Hotel night", amount: 3500, perPax: false },
  { id: "entry", label: "Entry tickets", amount: 200, perPax: true },
  { id: "parking", label: "Parking / toll extra", amount: 300, perPax: false },
  { id: "meals", label: "Meals", amount: 500, perPax: true },
  { id: "pooja", label: "Pooja / Rudrabhishek", amount: 2100, perPax: false },
];

export const getExtraPreset = (id) =>
  EXTRA_PRESETS.find((e) => e.id === id) || null;

const num = (v, fallback = 0) => {
  const n = Number(String(v ?? "").replace(/[,₹\s]/g, ""));
  return Number.isFinite(n) ? n : fallback;
};
const round = (n) => Math.round(num(n));

export const formatINR = (n) => `₹${round(n).toLocaleString("en-IN")}`;

let seq = 0;
const uid = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${(seq += 1).toString(36)}`;

/** A blank extra line, ready to render. */
export function makeExtra(presetId, overrides = {}) {
  const preset = getExtraPreset(presetId);
  return {
    id: uid("x"),
    presetId: preset ? preset.id : null,
    label: preset ? preset.label : "Other cost",
    amount: preset ? preset.amount : 0,
    perPax: preset ? preset.perPax : false,
    qty: 1,
    ...overrides,
  };
}

/**
 * A new day, pre-populated with sensible defaults so the sales person only has
 * to change what is unusual. Day 1 defaults to an airport pickup, day 2+ to a
 * full local day — the shape of almost every Varanasi itinerary.
 */
export function makeDay(index = 0, defaults = {}) {
  const type = index === 0 ? "airport-pickup" : "full-day";
  return {
    id: uid("d"),
    type,
    vehicleId: defaults.vehicleId || "dzire",
    routeId: "ayodhya",
    tripType: "round-trip",
    distanceKm: null, // null = use the route's own distance
    nights: 0,
    priceOverride: null,
    note: "",
    extras: [],
    ...defaults,
  };
}

/**
 * Suggested vehicle plan for a head count. Uses the fewest vehicles, then the
 * smallest available vehicle that can carry the remaining guests.
 */
export function suggestVehiclePlan(pax) {
  const p = Math.max(1, num(pax, 1));
  const bySeats = [...VEHICLES].sort((a, b) => a.seats - b.seats);
  const largest = bySeats[bySeats.length - 1];
  const plan = [];
  let remaining = p;

  while (remaining > 0) {
    const fit = bySeats.find((v) => v.seats >= remaining);
    if (fit) {
      plan.push(fit.id);
      break;
    }
    plan.push(largest.id);
    remaining -= largest.seats;
  }

  return plan;
}

/** Backwards-compatible single suggestion for older callers. */
export const suggestVehicle = (pax) => suggestVehiclePlan(pax)[0];

function extraAmount(extra, pax) {
  const qty = Math.max(1, num(extra?.qty, 1));
  const unit = num(extra?.amount);
  const heads = extra?.perPax ? Math.max(1, num(pax, 1)) : 1;
  return round(unit * qty * heads);
}

/** Price one day. Returns the computed suggestion plus the effective price. */
export function priceDay(day, { pax = 2 } = {}) {
  const type = getDayType(day?.type);
  const vehicles = vehicleIdsForDay(day).map(getVehicle);
  const vehicle = vehicles[0];
  const vehicleName = vehiclePlanLabel(vehicles);
  const lines = [];
  let computed = 0;
  let detail = type.hint;
  let needsDistance = false;

  if (type.kind === "local") {
    vehicles.forEach((item) => {
      const card = LOCAL_RATES[item.id] || LOCAL_RATES.dzire;
      const amount = round(num(card[type.rateKey]) * (type.factor || 1));
      computed += amount;
      lines.push({ label: `${item.name} — ${type.label}`, amount });
    });
    detail = `${type.hint} • ${vehicleName}`;
  } else if (type.kind === "outstation") {
    const route = getRoute(day?.routeId);
    const distanceKm = num(day?.distanceKm) || route?.distanceKm || 0;
    const destination =
      route?.name ||
      String(day?.destinationName || "").trim() ||
      "Other destination";
    needsDistance = distanceKm <= 0;

    vehicles.forEach((item) => {
      const est = estimateRoute({
        vehicleId: item.id,
        distanceKm,
        tripType: day?.tripType === "one-way" ? "one-way" : "round-trip",
        days: 1,
        nights: Math.max(0, num(day?.nights)),
        minBillKm:
          day?.distanceKm != null && day.distanceKm !== ""
            ? computeMinBillKm(distanceKm)
            : route?.minBillKm,
      });
      if (est) {
        computed += est.fare;
        lines.push(...est.lines);
      }
    });

    if (needsDistance) {
      detail = `${destination} • distance required • ${vehicleName}`;
    } else {
      const firstEstimate = estimateRoute({
        vehicleId: vehicle.id,
        distanceKm,
        tripType: day?.tripType === "one-way" ? "one-way" : "round-trip",
        nights: Math.max(0, num(day?.nights)),
        minBillKm:
          day?.distanceKm != null && day.distanceKm !== ""
            ? computeMinBillKm(distanceKm)
            : route?.minBillKm,
      });
      detail = `${destination} • ${
        day?.tripType === "one-way" ? "one way" : "round trip"
      } • ${firstEstimate?.billableKm || distanceKm} km billed • ${vehicleName}`;
    }
  } else {
    detail = "No vehicle billed";
  }

  const overridden = day?.priceOverride != null && day.priceOverride !== "";
  const transport = overridden ? round(day.priceOverride) : computed;

  const extras = (day?.extras || []).map((x) => ({
    ...x,
    total: extraAmount(x, pax),
  }));
  const extrasTotal = extras.reduce((s, x) => s + x.total, 0);

  return {
    dayId: day?.id,
    typeId: type.id,
    typeLabel: type.label,
    vehicleName,
    vehicleIds: vehicles.map((v) => v.id),
    seats: vehicles.reduce((sum, v) => sum + v.seats, 0),
    detail,
    needsDistance,
    computed,
    transport,
    overridden,
    lines,
    extras,
    extrasTotal,
    total: transport + extrasTotal,
  };
}

/**
 * Price a whole quote.
 * @returns {{ days:Array, transportTotal:number, extrasTotal:number,
 *            subtotal:number, markup:number, discount:number, total:number,
 *            perPax:number, pax:number, nights:number }}
 */
export function priceQuote(quote = {}) {
  const pax = Math.max(1, num(quote.pax, 2));
  const days = (quote.days || []).map((d) => priceDay(d, { pax }));

  const transportTotal = days.reduce((s, d) => s + d.transport, 0);
  const dayExtrasTotal = days.reduce((s, d) => s + d.extrasTotal, 0);

  const tripExtras = (quote.extras || []).map((x) => ({
    ...x,
    total: extraAmount(x, pax),
  }));
  const tripExtrasTotal = tripExtras.reduce((s, x) => s + x.total, 0);

  const extrasTotal = dayExtrasTotal + tripExtrasTotal;
  const subtotal = transportTotal + extrasTotal;

  const markupPct = num(quote.markupPct);
  const markup = round((subtotal * markupPct) / 100);
  const discount = Math.min(round(quote.discount), subtotal + markup);
  const total = Math.max(0, subtotal + markup - discount);

  return {
    days,
    tripExtras,
    tripExtrasTotal,
    transportTotal,
    extrasTotal,
    subtotal,
    markupPct,
    markup,
    discount,
    total,
    pax,
    perPax: round(total / pax),
    nights: Math.max(0, (quote.days || []).length - 1),
  };
}

/** Plain-text quotation, ready to paste into WhatsApp. */
export function quoteToText(quote = {}, priced = null) {
  const p = priced || priceQuote(quote);
  const lines = [];
  const title = quote.customerName
    ? `Quotation for ${quote.customerName}`
    : "Trip Quotation";
  lines.push(`*${title}*`);
  lines.push(
    `${p.days.length} day${p.days.length === 1 ? "" : "s"} • ${p.pax} pax`,
  );
  lines.push("");

  p.days.forEach((d, i) => {
    lines.push(`*Day ${i + 1} — ${d.typeLabel}*`);
    if (d.typeId !== "free") {
      lines.push(
        d.needsDistance
          ? `${d.detail} — price pending`
          : `${d.detail} — ${formatINR(d.transport)}`,
      );
    }
    d.extras.forEach((x) => lines.push(`• ${x.label} — ${formatINR(x.total)}`));
    const note = (quote.days || [])[i]?.note;
    if (note) lines.push(`_${note}_`);
    lines.push("");
  });

  if (p.tripExtras.length) {
    lines.push("*Other costs*");
    p.tripExtras.forEach((x) =>
      lines.push(`• ${x.label} — ${formatINR(x.total)}`),
    );
    lines.push("");
  }

  if (p.markup) lines.push(`Service charge: ${formatINR(p.markup)}`);
  if (p.discount) lines.push(`Discount: -${formatINR(p.discount)}`);
  lines.push(
    `*Total: ${formatINR(p.total)}*  (≈ ${formatINR(p.perPax)} per person)`,
  );
  lines.push("");
  lines.push(
    "Includes fuel, driver and tolls as estimated. State tax and parking extra where applicable.",
  );
  return lines.join("\n");
}

/** Ready-made itinerary shapes so a common trip is one click, not ten. */
export const QUICK_TEMPLATES = [
  {
    id: "arrival-only",
    label: "Airport pickup only",
    days: ["airport-pickup"],
  },
  {
    id: "weekend",
    label: "2N Varanasi classic",
    days: ["airport-pickup", "full-day", "airport-drop"],
  },
  {
    id: "ayodhya",
    label: "Varanasi + Ayodhya",
    days: ["airport-pickup", "full-day", "outstation", "airport-drop"],
  },
  {
    id: "buddhist",
    label: "Buddhist circuit",
    days: [
      "airport-pickup",
      "full-day",
      "outstation",
      "outstation",
      "airport-drop",
    ],
  },
];

/** Build a full quote draft from a template id. */
export function applyTemplate(
  templateId,
  { pax = 2, vehicleId, vehicleIds } = {},
) {
  const tpl = QUICK_TEMPLATES.find((t) => t.id === templateId);
  if (!tpl) return [];
  const plan = vehicleIds?.length
    ? vehicleIds
    : vehicleId
      ? [vehicleId]
      : suggestVehiclePlan(pax);
  let outstationIdx = 0;
  const outstationRoutes = ["ayodhya", "bodhgaya"];
  return tpl.days.map((type, i) => {
    const day = makeDay(i, { vehicleId: plan[0], vehicleIds: plan });
    day.type = type;
    if (type === "outstation") {
      day.routeId = outstationRoutes[outstationIdx % outstationRoutes.length];
      outstationIdx += 1;
    }
    return day;
  });
}
