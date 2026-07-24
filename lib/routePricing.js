// lib/routePricing.js
// Pure, dependency-free fare estimation for outstation route "fare-card" pages.
// Encodes the owner-approved rate card (data/vehicles.json). Never throws.
//
// Model (owner-locked 2026-07-24):
//   one-way   = owPerKm * distanceKm + tollPerKm * distanceKm       + driverPerNight * nights
//   round-trip= rtPerKm * billableKm + tollPerKm * (2 * distanceKm) + driverPerNight * nights
//              where billableKm = max(2 * distanceKm, minKmPerDay * days)
//   State tax is NOT computed — surfaced as an "extra as applicable" note by the UI.
//   No per-hour waiting charge. No night surcharge.

import vehicles from '../data/vehicles.json';

export const VEHICLES = vehicles;

export const getVehicle = (id) =>
  vehicles.find((v) => v.id === id || v.aliases?.includes(String(id).toLowerCase())) || null;

const round = (n) => Math.round(Number(n) || 0);

/**
 * Minimum billable km rule ("bars", owner-locked 2026-07-24).
 * `x` = one-way route distance (km):
 *   x <= 40  km  -> 100  (true local hops: Sarnath, Mughalsarai)
 *   40 < x <= 160 -> 200
 *   x > 160  km  -> 250
 * This is the ROUND-TRIP floor; the one-way floor is half of it
 * (a one-way drop is never billed more than the round trip).
 */
export function computeMinBillKm(distanceKm) {
  const d = Number(distanceKm) || 0;
  if (d > 160) return 250;
  if (d > 40) return 200;
  return 100;
}

/**
 * Estimate an outstation fare for one vehicle on one route.
 * @param {object} args
 * @param {string} args.vehicleId          - id from data/vehicles.json (e.g. 'dzire')
 * @param {number} args.distanceKm         - one-way distance in km
 * @param {('one-way'|'round-trip')} [args.tripType='one-way']
 * @param {number} [args.days=1]           - trip length in days (for round-trip min-km billing)
 * @param {number} [args.nights=0]         - overnight halts (drives driver allowance)
 * @param {number} [args.minBillKm]        - override min billable km (else derived from distance)
 * @returns {null | {
 *   vehicleId, vehicleName, tripType, distanceKm, billableKm, currency,
 *   fare, lines: Array<{label:string, amount:number}>,
 *   perKm:number, tollPerKm:number, minBillKm:number, isFixedFloor:boolean,
 *   stateTaxNote:string, assumptions:string
 * }}
 */
export function estimateRoute({
  vehicleId,
  distanceKm,
  tripType = 'round-trip',
  days = 1,
  nights = 0,
  minBillKm,
} = {}) {
  const v = getVehicle(vehicleId);
  const dist = Number(distanceKm) || 0;
  if (!v || dist <= 0) return null;

  const d = Math.max(1, Number(days) || 1);
  const n = Math.max(0, Number(nights) || 0);
  const isRound = tripType === 'round-trip';

  const perKm = isRound ? v.rtPerKm : v.owPerKm;

  // Minimum billable km: round-trip uses full floor, one-way uses half (fixed small-route fares).
  const routeMin = Number.isFinite(minBillKm) ? minBillKm : computeMinBillKm(dist);
  const floor = isRound ? routeMin : Math.round(routeMin / 2);

  const tripKm = isRound ? 2 * dist : dist;
  const billableKm = Math.max(tripKm, floor);
  const isFixedFloor = billableKm > tripKm; // floor bound => "fixed" small-route fare
  const tolledKm = tripKm;

  const fareKm = perKm * billableKm;
  const toll = (v.tollPerKm || 0) * tolledKm;
  const driver = (v.driverPerNight || 0) * n;

  const lines = [
    { label: `${v.name} — ${isRound ? 'round trip' : 'one way'} (₹${perKm}/km × ${billableKm} km${isFixedFloor ? ', min-km' : ''})`, amount: round(fareKm) },
    { label: `Toll estimate (₹${v.tollPerKm}/km × ${tolledKm} km)`, amount: round(toll) },
  ];
  if (driver > 0) {
    lines.push({ label: `Driver allowance (₹${v.driverPerNight}/night × ${n})`, amount: round(driver) });
  }

  const fare = round(fareKm + toll + driver);

  return {
    vehicleId: v.id,
    vehicleName: v.name,
    tripType,
    distanceKm: dist,
    billableKm,
    currency: 'INR',
    fare,
    lines,
    perKm,
    tollPerKm: v.tollPerKm || 0,
    minBillKm: routeMin,
    isFixedFloor,
    stateTaxNote: 'State tax extra as applicable (e.g. Bihar/MP border routes).',
    assumptions: isRound
      ? `Round trip billed on max(2×${dist} km, ${routeMin} km min) = ${billableKm} km, plus toll estimate${n ? ` and ${n} night halt` : ''}. State tax extra where applicable.`
      : `One-way${isFixedFloor ? ' fixed local fare' : ''}, billed on max(${dist} km, ${floor} km min) = ${billableKm} km, plus toll estimate${n ? ` and ${n} night halt` : ''}. State tax extra where applicable.`,
  };
}

/** Estimate all vehicles for a route — returns an array sorted cheapest-first. */
export function estimateAllVehicles({ distanceKm, tripType = 'round-trip', days = 1, nights = 0, minBillKm } = {}) {
  return vehicles
    .map((v) => estimateRoute({ vehicleId: v.id, distanceKm, tripType, days, nights, minBillKm }))
    .filter(Boolean)
    .sort((a, b) => a.fare - b.fare);
}

export const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
