// lib/outstationFares.js
// Headline outstation fares derived from the owner-approved rate card.
//
// Every customer-facing surface (homepage FAQ copy, FAQPage JSON-LD, route pages)
// must read its price from here rather than hardcoding a number. Hardcoded copies
// drifted to four different fares for the same Varanasi->Ayodhya trip
// (3,500 / 3,820 / 4,990 / 5,500), which advertises one price in the SERP and
// quotes another on landing.
//
// Source of truth: lib/routePricing.js + data/vehicles.json + data/routes.json,
// verified by `node scripts/generate-fare-cards.js --self-test` (14/14 owner-verified).

import routesData from '../data/routes.json';
import { estimateRoute, formatINR } from './routePricing';

const ROUTES_BY_ID = Object.fromEntries((routesData.routes || []).map((r) => [r.id, r]));

/**
 * Fare for one route id, in rupees.
 * @param {string} routeId            id from data/routes.json (e.g. 'ayodhya')
 * @param {object} [opts]
 * @param {('one-way'|'round-trip')} [opts.tripType='one-way']
 * @param {string} [opts.vehicleId='dzire']  cheapest AC sedan = the "from" price
 * @returns {number|null}
 */
export function routeFare(routeId, { tripType = 'one-way', vehicleId = 'dzire' } = {}) {
  const route = ROUTES_BY_ID[routeId];
  if (!route) return null;
  const est = estimateRoute({
    vehicleId,
    distanceKm: route.distanceKm,
    tripType,
    minBillKm: route.minBillKm,
  });
  return est ? est.fare : null;
}

/** Same as routeFare but formatted as ₹1,23,456. Empty string when unknown. */
export function routeFareINR(routeId, opts) {
  const fare = routeFare(routeId, opts);
  return fare == null ? '' : formatINR(fare);
}

/** Routes named in the homepage "outstation" FAQ, in display order. */
export const HOMEPAGE_OUTSTATION_ROUTES = ['prayagraj', 'ayodhya', 'bodhgaya', 'vindhyachal'];

/** "Prayagraj (from ₹2,388), Ayodhya (from ₹3,820), ..." — prices derived at build time. */
export function outstationRouteList() {
  return HOMEPAGE_OUTSTATION_ROUTES.map((id) => {
    const route = ROUTES_BY_ID[id];
    return route ? `${route.name} (from ${routeFareINR(id)})` : null;
  })
    .filter(Boolean)
    .join(', ');
}

export const OUTSTATION_FAQ_LEAD = 'Yes, we offer ';
export const OUTSTATION_FAQ_EMPHASIS = 'outstation taxi from Varanasi';
export const OUTSTATION_FAQ_TAIL =
  ', and all major pilgrimage destinations. Those are one-way fares in an AC sedan including fuel, tolls and driver; round-trip and larger vehicles are quoted the same fixed way before you book.';

/**
 * The homepage outstation FAQ answer as plain text, for FAQPage JSON-LD.
 * The visible answer in pages/index.js is composed from the same exported parts,
 * so the rendered text and the structured data can never disagree.
 */
export function outstationFaqAnswer() {
  return `${OUTSTATION_FAQ_LEAD}${OUTSTATION_FAQ_EMPHASIS} to ${outstationRouteList()}${OUTSTATION_FAQ_TAIL}`;
}
