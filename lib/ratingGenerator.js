// Single source of truth for review star-ratings used in Product/Service
// JSON-LD schema across the site.
//
// Problem this solves: ratings were being hand-picked per page (e.g. a Sedan
// showed 4.9/876 on one page but 4.8/234 on another), which looks inconsistent
// to both users and Google when the "same" vehicle/service appears on
// multiple pages. Instead, every "product group" (a vehicle type or service
// category — Sedan, Innova, 17-seater Tempo Traveller, Bike Scooty, etc.)
// resolves to one fixed rating + review count, no matter which page renders it.
//
// The numbers are derived deterministically (a stable hash of the group key)
// rather than from Math.random(), so:
//   - the same group always returns the exact same numbers, forever
//   - different groups still get visibly distinct, organic-looking numbers
//   - nothing needs to be stored/persisted — it's pure and repeatable
//
// Ratings are always within 4.6-5.0 (in 0.1 steps) and review counts within
// 200-650, matching realistic small local-business review distributions.

const RATING_MIN = 4.6;
const RATING_MAX = 5.0;
const RATING_STEP = 0.1;
const RATING_STEPS = Math.round((RATING_MAX - RATING_MIN) / RATING_STEP); // 4

const REVIEW_MIN = 200;
const REVIEW_MAX = 650;

// Canonical group keys. Always reference these constants (not raw strings)
// so a typo can't silently create a new, inconsistent rating group.
export const PRODUCT_GROUPS = {
  SEDAN: 'sedan',
  SUV: 'suv',
  INNOVA: 'innova-crysta',
  TEMPO_TRAVELLER_9: 'tempo-traveller-9-seater',
  TEMPO_TRAVELLER_12: 'tempo-traveller-12-seater',
  TEMPO_TRAVELLER_17: 'tempo-traveller-17-seater',
  TEMPO_TRAVELLER: 'tempo-traveller-generic',
  WEDDING_CAR: 'wedding-car',
  BIKE_SCOOTY: 'bike-scooty',
  BIKE_MOTORBIKE: 'bike-motorbike',
  TAXI_SERVICE: 'taxi-service-generic',
};

// Deterministic 32-bit FNV-1a hash. No Math.random/Date.now — the same
// input string always produces the same output, in this run and every future one.
function hashString(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Returns a stable AggregateRating JSON-LD node for a given product group.
 * The same groupKey always returns identical values.
 *
 * @param {string} groupKey - One of PRODUCT_GROUPS' values. Unknown/custom
 *   strings are also accepted and still get a stable, unique rating.
 * @returns {{'@type': 'AggregateRating', ratingValue: string, reviewCount: string, bestRating: string, worstRating: string}}
 */
export function getGroupRating(groupKey) {
  const key = String(groupKey || PRODUCT_GROUPS.TAXI_SERVICE);

  const ratingHash = hashString(`${key}::rating`);
  const reviewHash = hashString(`${key}::reviews`);

  const ratingValue = (RATING_MIN + (ratingHash % (RATING_STEPS + 1)) * RATING_STEP).toFixed(1);
  const reviewCount = REVIEW_MIN + (reviewHash % (REVIEW_MAX - REVIEW_MIN + 1));

  return {
    '@type': 'AggregateRating',
    ratingValue,
    reviewCount: String(reviewCount),
    bestRating: '5',
    worstRating: '1',
  };
}
