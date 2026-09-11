// lib/pricingEngineResolver.js
// Resolves pickup & destination against existing routes and rate cards without duplicating data.
// Pure, dependency-free (imports data/routes.json, data/vehicles.json, lib/routePricing.js, lib/taxiRates.js).

import routesData from '../data/routes.json';
import vehiclesData from '../data/vehicles.json';
import { estimateRoute } from './routePricing';
import { TAXI_RATE_CARDS } from './taxiRates';
import { LOCAL_RATES } from './quoteEngine';

// Local hubs in Varanasi (Airport, Stations, Ghats, Sightseeing)
const LOCAL_HUBS = [
  {
    id: 'airport',
    name: 'Varanasi Airport (Babatpur - VNS)',
    shortName: 'Varanasi Airport',
    category: 'airport',
    badge: 'Airport',
    aliases: ['airport', 'vns', 'babatpur', 'lal bahadur shastri', 'varanasi airport', 'lbs airport'],
    canonicalSlug: 'airport-taxi-service-varanasi',
  },
  {
    id: 'cantt-station',
    name: 'Varanasi Cantt Railway Station (BSB)',
    shortName: 'Varanasi Cantt',
    category: 'station',
    badge: 'Station',
    aliases: ['cantt', 'varanasi junction', 'bsb', 'cantt station', 'varanasi cantt', 'railway station', 'varanasi railway station', 'varanasi jn'],
    canonicalSlug: 'taxi-service-varanasi-cantt-station',
  },
  {
    id: 'banaras-station',
    name: 'Banaras Railway Station (Manduadih - BSBS)',
    shortName: 'Banaras Station',
    category: 'station',
    badge: 'Station',
    aliases: ['manduadih', 'banaras station', 'bsbs', 'manduadih station', 'banaras railway station'],
    canonicalSlug: 'varanasi-railway-station-taxi-service',
  },
  {
    id: 'ddu-station',
    name: 'Pt. Deen Dayal Upadhyaya Jn (Mughalsarai - DDU)',
    shortName: 'DDU Mughalsarai',
    category: 'station',
    badge: 'Station',
    aliases: ['mughalsarai', 'ddu', 'deen dayal upadhyaya', 'mughalsarai station', 'ddu junction', 'pt deen dayal upadhyaya'],
    canonicalSlug: 'varanasi-airport-to-mughalsarai-taxi',
  },
  {
    id: 'kashi-vishwanath',
    name: 'Kashi Vishwanath Temple / Godowlia',
    shortName: 'Kashi Vishwanath',
    category: 'ghat',
    badge: 'Temple',
    aliases: ['kashi vishwanath', 'vishwanath', 'godowlia', 'godowlia chowk', 'kashi vishwanath temple', 'corridor', 'vishwanath corridor'],
    canonicalSlug: 'varanasi-airport-to-kashi-vishwanath-taxi',
  },
  {
    id: 'dashashwamedh',
    name: 'Dashashwamedh Ghat (Ganga Aarti)',
    shortName: 'Dashashwamedh Ghat',
    category: 'ghat',
    badge: 'Holy Ghat',
    aliases: ['dashashwamedh', 'dashashwamedh ghat', 'ganga aarti', 'main ghat', 'dasaswamedh'],
    canonicalSlug: 'varanasi-airport-to-dashashwamedh-taxi',
  },
  {
    id: 'assi-ghat',
    name: 'Assi Ghat',
    shortName: 'Assi Ghat',
    category: 'ghat',
    badge: 'Holy Ghat',
    aliases: ['assi', 'assi ghat', 'subah-e-banaras', 'assi crossing', 'nagwa'],
    canonicalSlug: 'varanasi-airport-to-assi-ghat-taxi',
  },
  {
    id: 'namo-ghat',
    name: 'Namo Ghat (Khidkiya Ghat)',
    shortName: 'Namo Ghat',
    category: 'ghat',
    badge: 'Ghat',
    aliases: ['namo', 'namo ghat', 'khidkiya ghat', 'khirkiya ghat'],
    canonicalSlug: 'varanasi-airport-to-namo-ghat-taxi',
  },
  {
    id: 'manikarnika-ghat',
    name: 'Manikarnika Ghat',
    shortName: 'Manikarnika Ghat',
    category: 'ghat',
    badge: 'Ghat',
    aliases: ['manikarnika', 'manikarnika ghat'],
    canonicalSlug: 'varanasi-airport-to-manikarnika-taxi',
  },
  {
    id: 'sarnath',
    name: 'Sarnath (Dhamek Stupa & Deer Park)',
    shortName: 'Sarnath',
    category: 'sightseeing',
    badge: 'Heritage',
    aliases: ['sarnath', 'dhamek stupa', 'deer park', 'buddhist temple sarnath'],
    canonicalSlug: 'varanasi-to-sarnath-taxi',
  },
  {
    id: 'bhu-lanka',
    name: 'BHU / Lanka / VT (New Vishwanath Temple)',
    shortName: 'BHU / Lanka',
    category: 'local',
    badge: 'City',
    aliases: ['bhu', 'lanka', 'banaras hindu university', 'new vishwanath temple', 'vt bhu'],
    canonicalSlug: 'taxi-near-bhu',
  },
  {
    id: 'ramnagar',
    name: 'Ramnagar Fort',
    shortName: 'Ramnagar Fort',
    category: 'sightseeing',
    badge: 'Heritage',
    aliases: ['ramnagar', 'ramnagar fort'],
    canonicalSlug: 'varanasi-airport-to-ramnagar-fort-taxi',
  },
  {
    id: 'tent-city',
    name: 'Tent City Varanasi',
    shortName: 'Tent City',
    category: 'sightseeing',
    badge: 'Ghat Area',
    aliases: ['tent city', 'tent city varanasi'],
    canonicalSlug: 'taxi-for-tent-city-varanasi',
  },
  {
    id: 'varanasi-city',
    name: 'Varanasi City Center (Hotel / Home)',
    shortName: 'Varanasi City',
    category: 'local',
    badge: 'City Center',
    aliases: ['varanasi', 'banaras', 'kashi', 'city', 'hotel', 'home', 'varanasi city', 'sigra', 'nadesar', 'chowk'],
    canonicalSlug: 'varanasi-taxi-service',
  },
];

// Outstation routes mapped from existing data/routes.json
const OUTSTATION_ROUTES = (routesData.routes || []).map((r) => ({
  id: r.id,
  name: `${r.name} (${r.distanceKm} km)`,
  shortName: r.name,
  category: 'outstation',
  badge: `${r.distanceKm} km`,
  distanceKm: r.distanceKm,
  driveTime: r.driveTimeNormal || '',
  minBillKm: r.minBillKm,
  minFare: r.minFare || r.fixedFare || null,
  aliases: [
    r.id.toLowerCase(),
    r.name.toLowerCase(),
    ...(r.aliases || []).map((a) => a.toLowerCase()),
    `${r.id} taxi`,
    `${r.name.toLowerCase()} cab`,
  ],
  canonicalSlug: `varanasi-to-${r.id}-taxi-fare`,
}));

// Combined places list for search & autocomplete
export const ALL_SUGGESTED_PLACES = [
  ...LOCAL_HUBS,
  ...OUTSTATION_ROUTES,
];

/**
 * Fuzzy search place names for autocomplete dropdown.
 * Returns up to 6 most relevant matches.
 */
export function searchPlaces(query = '') {
  const clean = String(query).trim().toLowerCase();
  if (!clean) {
    // Default popular suggestions if input is empty
    return [
      LOCAL_HUBS[0], // Airport
      LOCAL_HUBS[1], // Cantt Station
      LOCAL_HUBS[4], // Kashi Vishwanath
      LOCAL_HUBS[6], // Assi Ghat
      OUTSTATION_ROUTES.find((r) => r.id === 'ayodhya') || OUTSTATION_ROUTES[0],
      OUTSTATION_ROUTES.find((r) => r.id === 'prayagraj') || OUTSTATION_ROUTES[1],
    ].filter(Boolean);
  }

  const matches = ALL_SUGGESTED_PLACES.filter((p) => {
    if (p.name.toLowerCase().includes(clean)) return true;
    if (p.shortName.toLowerCase().includes(clean)) return true;
    return p.aliases.some((alias) => alias.includes(clean) || clean.includes(alias));
  });

  return matches.slice(0, 6);
}

/**
 * Match a text input string against our places list.
 */
function findMatchingPlace(text = '') {
  const clean = String(text).trim().toLowerCase();
  if (!clean) return null;

  // Exact ID or Name match
  const exact = ALL_SUGGESTED_PLACES.find(
    (p) =>
      p.id.toLowerCase() === clean ||
      p.name.toLowerCase() === clean ||
      p.shortName.toLowerCase() === clean
  );
  if (exact) return exact;

  // Alias exact match
  const aliasMatch = ALL_SUGGESTED_PLACES.find((p) =>
    p.aliases.some((alias) => alias === clean)
  );
  if (aliasMatch) return aliasMatch;

  // Substring match
  return ALL_SUGGESTED_PLACES.find((p) => {
    if (clean.length < 3) return false;
    return (
      clean.includes(p.shortName.toLowerCase()) ||
      p.aliases.some((alias) => clean.includes(alias))
    );
  }) || null;
}

/**
 * Recommends vehicle ID based on passenger count:
 * 1-4 pax -> Sedan (Dzire)
 * 5-6 pax -> Ertiga (SUV)
 * 7+ pax  -> Tempo Traveller (12/17 seater)
 */
export function recommendVehicle(passengers) {
  const pax = String(passengers || '1');
  if (pax === '5-6' || pax === '5' || pax === '6') return 'ertiga';
  if (pax === '7+' || parseInt(pax, 10) >= 7) return 'tempo-17';
  return 'dzire';
}

/**
 * Vehicle display definitions with human names and passenger capacities.
 */
export const VEHICLE_OPTIONS = [
  { id: 'dzire', name: 'Sedan (Dzire / Etios)', seats: '1–4 seats', class: 'sedan' },
  { id: 'ertiga', name: 'SUV (Ertiga)', seats: '5–6 seats', class: 'suv' },
  { id: 'innova', name: 'Premium (Innova Crysta)', seats: '6–7 seats', class: 'crysta' },
  { id: 'tempo-17', name: 'Tempo Traveller', seats: '7–17 seats', class: 'tempo' },
];

/**
 * Core Fare Resolution Function
 * Computes rough price based on pickup, destination, passengers, tripType, vehicle.
 * Pure and deterministic. Returns null or { canCompute: false } if uncomputable.
 */
export function resolveFare({
  pickup = '',
  destination = '',
  passengers = '1',
  tripType = 'one-way',
  vehicleId,
} = {}) {
  const fromPlace = findMatchingPlace(pickup);
  const toPlace = findMatchingPlace(destination);

  // If either place is unknown, return graceful fallback
  if (!fromPlace || !toPlace) {
    return {
      canCompute: false,
      reason: 'unmatched_place',
      fromPlace,
      toPlace,
    };
  }

  // Determine active vehicle
  const activeVehicle = vehicleId || recommendVehicle(passengers);

  // Scenario 1: Outstation Route (Either from or to is an outstation destination)
  const outstationPlace = fromPlace.category === 'outstation' ? fromPlace : toPlace.category === 'outstation' ? toPlace : null;

  if (outstationPlace) {
    const isOutbound = toPlace.category === 'outstation';
    const routeId = outstationPlace.id;
    const distanceKm = outstationPlace.distanceKm;
    const isRound = tripType === 'round-trip';

    // Calculate rates for all 4 vehicle classes using existing estimateRoute
    const faresByVehicle = {};
    VEHICLE_OPTIONS.forEach((v) => {
      const targetVehicle = v.id === 'innova' ? 'crysta' : v.id;
      const est = estimateRoute({
        vehicleId: targetVehicle,
        distanceKm,
        tripType: isRound ? 'round-trip' : 'one-way',
        days: 1,
        nights: 0,
        minBillKm: outstationPlace.minBillKm,
        minFare: outstationPlace.minFare,
        fixedFare: outstationPlace.minFare,
      });
      if (est) {
        faresByVehicle[v.id] = est.fare;
      }
    });

    const activeTargetVehicle = activeVehicle === 'innova' ? 'crysta' : activeVehicle;
    const selectedEstimate = estimateRoute({
      vehicleId: activeTargetVehicle,
      distanceKm,
      tripType: isRound ? 'round-trip' : 'one-way',
      days: 1,
      nights: 0,
      minBillKm: outstationPlace.minBillKm,
      minFare: outstationPlace.minFare,
      fixedFare: outstationPlace.minFare,
    });

    const canonicalSlug = isOutbound
      ? `varanasi-to-${routeId}-taxi-fare`
      : `${routeId}-to-varanasi-taxi-fare`;

    return {
      canCompute: true,
      routeType: 'outstation',
      isOutstation: true,
      fromPlace,
      toPlace,
      distanceKm,
      driveTime: outstationPlace.driveTime,
      tripType: isRound ? 'round-trip' : 'one-way',
      vehicleId: activeVehicle,
      fare: selectedEstimate ? selectedEstimate.fare : faresByVehicle[activeVehicle] || 0,
      faresByVehicle,
      canonicalUrl: `/en/city/varanasi/taxi/${canonicalSlug}`,
      canonicalTitle: `${fromPlace.shortName} to ${toPlace.shortName} Taxi Fare`,
      inclusions: 'Fuel, Highway Tolls & Chauffeur Allowance Included',
    };
  }

  // Scenario 2: Airport Transfer (Airport <-> City / Ghat / Station)
  const isAirportTransfer = fromPlace.id === 'airport' || toPlace.id === 'airport';
  if (isAirportTransfer) {
    const isRound = tripType === 'round-trip';
    const multiplier = isRound ? 1.8 : 1;

    const faresByVehicle = {
      dzire: Math.round((LOCAL_RATES.dzire?.airport || 899) * multiplier),
      ertiga: Math.round((LOCAL_RATES.ertiga?.airport || 1299) * multiplier),
      innova: Math.round((LOCAL_RATES.crysta?.airport || 1800) * multiplier),
      'tempo-17': Math.round((LOCAL_RATES['tempo-17']?.airport || 2500) * multiplier),
    };

    const targetSlug =
      toPlace.id === 'kashi-vishwanath' || fromPlace.id === 'kashi-vishwanath'
        ? 'varanasi-airport-to-kashi-vishwanath-taxi'
        : toPlace.id === 'assi-ghat' || fromPlace.id === 'assi-ghat'
        ? 'varanasi-airport-to-assi-ghat-taxi'
        : toPlace.id === 'dashashwamedh' || fromPlace.id === 'dashashwamedh'
        ? 'varanasi-airport-to-dashashwamedh-taxi'
        : toPlace.id === 'sarnath' || fromPlace.id === 'sarnath'
        ? 'varanasi-airport-to-sarnath-taxi'
        : toPlace.id === 'cantt-station' || fromPlace.id === 'cantt-station'
        ? 'varanasi-airport-to-varanasi-junction-taxi'
        : 'airport-taxi-service-varanasi';

    return {
      canCompute: true,
      routeType: 'airport_transfer',
      isOutstation: false,
      fromPlace,
      toPlace,
      distanceKm: 26,
      driveTime: '40–50 min',
      tripType: isRound ? 'round-trip' : 'one-way',
      vehicleId: activeVehicle,
      fare: faresByVehicle[activeVehicle] || faresByVehicle.dzire,
      faresByVehicle,
      canonicalUrl: `/en/city/varanasi/taxi/${targetSlug}`,
      canonicalTitle: `${fromPlace.shortName} to ${toPlace.shortName} Cab`,
      inclusions: 'Flight Tracking, Meet & Greet, Parking & Tolls Included',
    };
  }

  // Scenario 3: Railway Station Transfer (Station <-> Ghat / Local)
  const isStationTransfer = fromPlace.category === 'station' || toPlace.category === 'station';
  if (isStationTransfer) {
    const isRound = tripType === 'round-trip';
    const multiplier = isRound ? 1.7 : 1;

    const faresByVehicle = {
      dzire: Math.round(550 * multiplier),
      ertiga: Math.round(850 * multiplier),
      innova: Math.round(1100 * multiplier),
      'tempo-17': Math.round(1800 * multiplier),
    };

    return {
      canCompute: true,
      routeType: 'station_transfer',
      isOutstation: false,
      fromPlace,
      toPlace,
      distanceKm: 6,
      driveTime: '20–30 min',
      tripType: isRound ? 'round-trip' : 'one-way',
      vehicleId: activeVehicle,
      fare: faresByVehicle[activeVehicle] || faresByVehicle.dzire,
      faresByVehicle,
      canonicalUrl: '/en/city/varanasi/taxi/taxi-service-varanasi-cantt-station',
      canonicalTitle: 'Varanasi Railway Station Taxi Transfer',
      inclusions: 'Station Platform Pickup & Gali Drop Assistance Included',
    };
  }

  // Scenario 4: Local Ghat / Sightseeing Transfer (e.g. Assi Ghat <-> Sarnath)
  const isSarnath = fromPlace.id === 'sarnath' || toPlace.id === 'sarnath';
  if (isSarnath) {
    const isRound = tripType === 'round-trip';
    const multiplier = isRound ? 1.5 : 1;

    const faresByVehicle = {
      dzire: Math.round(900 * multiplier),
      ertiga: Math.round(1300 * multiplier),
      innova: Math.round(1600 * multiplier),
      'tempo-17': Math.round(2200 * multiplier),
    };

    return {
      canCompute: true,
      routeType: 'local_transfer',
      isOutstation: false,
      fromPlace,
      toPlace,
      distanceKm: 14,
      driveTime: '35–45 min',
      tripType: isRound ? 'round-trip' : 'one-way',
      vehicleId: activeVehicle,
      fare: faresByVehicle[activeVehicle] || faresByVehicle.dzire,
      faresByVehicle,
      canonicalUrl: '/en/city/varanasi/taxi/varanasi-to-sarnath-taxi',
      canonicalTitle: 'Varanasi to Sarnath Taxi Service',
      inclusions: 'Fuel, Driver Allowance & Sightseeing Wait Time Included',
    };
  }

  // Other local transfers: Flat local run
  const faresByVehicle = {
    dzire: 450,
    ertiga: 750,
    innova: 1000,
    'tempo-17': 1600,
  };

  return {
    canCompute: true,
    routeType: 'city_point_to_point',
    isOutstation: false,
    fromPlace,
    toPlace,
    distanceKm: 8,
    driveTime: '20–30 min',
    tripType: 'one-way',
    vehicleId: activeVehicle,
    fare: faresByVehicle[activeVehicle] || faresByVehicle.dzire,
    faresByVehicle,
    canonicalUrl: '/varanasi-taxi-service',
    canonicalTitle: 'Varanasi City Taxi Service',
    inclusions: 'Local Driver, City Navigation & Gali Drop Assistance',
  };
}

export const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
