#!/usr/bin/env node
// One-off migration: replace the ad-hoc aggregateRating values added during
// the GSC "missing aggregateRating" fix-up session with numbers derived from
// the shared lib/ratingGenerator.js, so the same product group (Sedan, SUV,
// Innova, Tempo Traveller 12/17-seater, Wedding Car, generic Taxi Service)
// always shows an identical rating + review count everywhere it appears.
//
// Scope: only the items touched in that session (per explicit user decision
// NOT to rewrite the site's other, already-indexed ratings).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getGroupRating, PRODUCT_GROUPS } from '../lib/ratingGenerator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// { file: [ { match: productName, group } ] }
const TARGETS = [
  {
    file: 'content/en/destinations/varanasi/taxi/json/airport-taxi-varanasi.json',
    items: [
      { name: 'Sedan Airport Transfer', group: PRODUCT_GROUPS.SEDAN },
      { name: 'Ertiga Airport Transfer', group: PRODUCT_GROUPS.SUV },
      { name: 'Innova Airport Transfer', group: PRODUCT_GROUPS.INNOVA },
      { name: 'Tempo Traveller Airport Transfer', group: PRODUCT_GROUPS.TEMPO_TRAVELLER_17 },
    ],
  },
  {
    file: 'content/en/destinations/varanasi/taxi/json/varanasi-to-sarnath-taxi.json',
    items: [
      { name: 'Sarnath One-Way Transfer', group: PRODUCT_GROUPS.TAXI_SERVICE },
    ],
  },
  {
    file: 'content/en/destinations/varanasi/taxi/json/varanasi-to-gaya-taxi-service.json',
    items: [
      { name: 'Varanasi to Gaya Sedan Transfer', group: PRODUCT_GROUPS.SEDAN },
      { name: 'Varanasi to Gaya SUV Transfer', group: PRODUCT_GROUPS.SUV },
      { name: 'Varanasi to Gaya Innova Crysta', group: PRODUCT_GROUPS.INNOVA },
      { name: 'Varanasi to Gaya Tempo Traveller', group: PRODUCT_GROUPS.TEMPO_TRAVELLER },
    ],
  },
  {
    file: 'content/en/json/17-seater-tempo-traveller-varanasi.json',
    items: [
      { name: '17 Seater Tempo Traveller Varanasi', group: PRODUCT_GROUPS.TEMPO_TRAVELLER_17 },
    ],
  },
  {
    file: 'content/en/json/12-seater-tempo-traveller-varanasi.json',
    items: [
      { name: '12 Seater Tempo Traveller Varanasi', group: PRODUCT_GROUPS.TEMPO_TRAVELLER_12 },
    ],
  },
  {
    file: 'content/en/destinations/varanasi/taxi/json/wedding-tempo-traveller-varanasi.json',
    items: [
      { name: 'Decorated Wedding Car', group: PRODUCT_GROUPS.WEDDING_CAR },
    ],
  },
  {
    file: 'content/en/destinations/varanasi/taxi/json/airport-to-taj-gateway-varanasi.json',
    items: [
      { name: 'Sedan Airport to Taj Gateway Transfer', group: PRODUCT_GROUPS.SEDAN },
      { name: 'SUV Airport to Taj Gateway Transfer', group: PRODUCT_GROUPS.SUV },
    ],
  },
  {
    file: 'content/en/destinations/varanasi/taxi/json/one-way-taxi-varanasi.json',
    items: [
      { name: 'Airport Round-Trip Sedan Package', group: PRODUCT_GROUPS.SEDAN },
      { name: 'City Tour Round-Trip Package', group: PRODUCT_GROUPS.TAXI_SERVICE },
    ],
  },
];

function walk(node, visit) {
  if (Array.isArray(node)) {
    node.forEach((n) => walk(n, visit));
    return;
  }
  if (node && typeof node === 'object') {
    visit(node);
    Object.values(node).forEach((v) => walk(v, visit));
  }
}

let totalUpdated = 0;

for (const { file, items } of TARGETS) {
  const fullPath = path.join(ROOT, file);
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const remaining = new Map(items.map((i) => [i.name, i.group]));

  walk(data, (node) => {
    if (node.name && remaining.has(node.name) && node['@type'] === 'Product') {
      node.aggregateRating = getGroupRating(remaining.get(node.name));
      totalUpdated += 1;
      remaining.delete(node.name);
    }
  });

  if (remaining.size > 0) {
    console.warn(`WARNING: ${file} — could not find product(s):`, [...remaining.keys()]);
  }

  fs.writeFileSync(fullPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`Updated ${file}`);
}

console.log(`\nTotal Product nodes updated: ${totalUpdated}`);
