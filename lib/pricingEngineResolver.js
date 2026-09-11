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
    id: 'chandauli',
    name: 'Chandauli (~32 km)',
    shortName: 'Chandauli',
    category: 'outstation',
    badge: '32 km',
    distanceKm: 32,
    driveTime: '45–55 min',
    minBillKm: 100,
    aliases: ['chandauli', 'chandauli up', 'chanduali', 'chandauli district', 'chandauli town', 'chandauli junction'],
    canonicalSlug: 'varanasi-airport-to-mughalsarai-taxi',
  },
  {
    id: 'mirzapur',
    name: 'Mirzapur (~65 km)',
    shortName: 'Mirzapur',
    category: 'outstation',
    badge: '65 km',
    distanceKm: 65,
    driveTime: '1.5–2 hr',
    minBillKm: 200,
    aliases: ['mirzapur', 'mirzapur city', 'mirzapur railway station'],
    canonicalSlug: 'varanasi-to-vindhyachal-taxi-fare',
  },
  {
    id: 'bhadohi',
    name: 'Bhadohi (~45 km)',
    shortName: 'Bhadohi',
    category: 'outstation',
    badge: '45 km',
    distanceKm: 45,
    driveTime: '1–1.5 hr',
    minBillKm: 200,
    aliases: ['bhadohi', 'carpet city', 'bhadohi station'],
    canonicalSlug: 'varanasi-taxi-service',
  },
  {
    id: 'chunar',
    name: 'Chunar Fort (~42 km)',
    shortName: 'Chunar',
    category: 'outstation',
    badge: '42 km',
    distanceKm: 42,
    driveTime: '1–1.5 hr',
    minBillKm: 200,
    aliases: ['chunar', 'chunar fort'],
    canonicalSlug: 'varanasi-taxi-service',
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
 * Enhanced search place names for autocomplete dropdown.
 * Handles single words, phrases (e.g. "My Farmhouse in Chandauli", "Hotel near Assi Ghat"),
 * and typo/substring tolerance. Returns top matches sorted by relevance score.
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

  // Extract individual words/tokens from the query (length >= 3)
  const tokens = clean.split(/[\s,./\-_+]+/).filter((w) => w.length >= 3);

  // Score each place
  const scored = ALL_SUGGESTED_PLACES.map((p) => {
    const pName = p.name.toLowerCase();
    const pShort = p.shortName.toLowerCase();
    let score = 0;

    // 1. Exact match on clean string
    if (pName === clean || pShort === clean || p.id.toLowerCase() === clean) {
      score += 150;
    }

    // 2. Query contains place name or place name contains query
    if (clean.includes(pShort)) {
      score += 90;
    } else if (pShort.includes(clean)) {
      score += 60;
    }

    if (clean.includes(pName)) {
      score += 80;
    } else if (pName.includes(clean)) {
      score += 50;
    }

    // 3. Alias matches
    p.aliases.forEach((alias) => {
      if (alias === clean) {
        score += 100;
      } else if (alias.length >= 3 && clean.includes(alias)) {
        score += 70;
      } else if (clean.length >= 3 && alias.includes(clean)) {
        score += 45;
      }
    });

    // 4. Token-level matching (e.g. "farmhouse in chandauli" -> token "chandauli")
    tokens.forEach((t) => {
      if (t.length >= 3) {
        if (pShort === t) {
          score += 85;
        } else if (pShort.includes(t)) {
          score += 40;
        }

        if (p.aliases.some((a) => a === t)) {
          score += 80;
        } else if (p.aliases.some((a) => a.includes(t) || t.includes(a))) {
          score += 35;
        }
      }
    });

    return { place: p, score };
  });

  const matches = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.place);

  return matches.slice(0, 6);
}

/**
 * Match a text input string against our places list.
 * Supports exact match, alias match, or keyword/token detection within phrases.
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

  // Keyword/token match within phrases (e.g. "My Farmhouse in Chandauli" -> Chandauli)
  const candidatePlaces = searchPlaces(clean);
  if (candidatePlaces.length > 0) {
    const top = candidatePlaces[0];
    const topKeywords = [top.shortName.toLowerCase(), top.id.toLowerCase(), ...top.aliases];
    const hasStrongMatch = topKeywords.some(
      (kw) => kw.length >= 3 && (clean.includes(kw) || kw.includes(clean))
    );
    if (hasStrongMatch) {
      return top;
    }
  }

  return null;
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
  tripType = 'round-trip',
  vehicleId,
} = {}) {
  const rawPickup = pickup?.trim() || '';
  const rawDest = destination?.trim() || '';

  if (!rawDest) {
    return null;
  }

  // If destination is provided but pickup is blank, default origin to Varanasi
  const effectivePickup = rawPickup || 'Varanasi';
  const fromPlace = findMatchingPlace(effectivePickup);
  const toPlace = findMatchingPlace(rawDest);

  // If either place is unknown or both are the same location, return graceful fallback
  if (!fromPlace || !toPlace || fromPlace.id === toPlace.id) {
    return {
      canCompute: false,
      reason: fromPlace && toPlace && fromPlace.id === toPlace.id ? 'same_location' : 'unmatched_place',
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
      isDefaultOrigin: !rawPickup,
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
      isDefaultOrigin: !rawPickup,
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
      isDefaultOrigin: !rawPickup,
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
      isDefaultOrigin: !rawPickup,
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
    isDefaultOrigin: !rawPickup,
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
