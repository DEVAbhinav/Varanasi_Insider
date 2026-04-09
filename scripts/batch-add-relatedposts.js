#!/usr/bin/env node
/**
 * Batch add relatedPosts to taxi cluster pages that have FAQ but RP=0
 * Also adds relatedPosts to event/activity pages with RP=0
 */
const fs = require('fs');
const matter = require('gray-matter');
const path = require('path');

// Standard relatedPosts for taxi pages
const taxiRelatedPosts = [
  'varanasi-airport-taxi-price-guide',
  'outstation-cabs-from-varanasi',
  'varanasi-day-tour-cab-charges',
];

// Standard relatedPosts for tour package pages
const tourRelatedPosts = [
  'same-day-varanasi-tour',
  'varanasi-2-day-tour',
  'varanasi-3-day-tour',
  'best-time-to-visit-varanasi',
];

// Standard relatedPosts for event pages
const eventRelatedPosts = [
  'ganga-aarti-timing-varanasi-2026',
  'best-time-to-visit-varanasi',
  'varanasi-sunrise-boat-ride-timings',
];

// Pages to process: taxi pages with FAQ but RP=0
const taxiPages = [
  'content/en/destinations/varanasi/taxi/varanasi-railway-station-taxi-service.md',
  'content/en/destinations/varanasi/taxi/varanasi-to-sarnath-taxi.md',
  'content/en/destinations/varanasi/taxi/staying-at-taj-ganges-need-taxi.md',
  'content/en/destinations/varanasi/taxi/taj-ganges-varanasi-taxi-service.md',
  'content/en/destinations/varanasi/taxi/airport-to-taj-gateway-varanasi.md',
  'content/en/destinations/varanasi/taxi/airport-taxi-varanasi.md',
  'content/en/destinations/varanasi/taxi/varanasi-city-tour-cab.md',
  'content/en/destinations/varanasi/taxi/taxi-rates-varanasi.md',
  'content/en/destinations/varanasi/taxi/one-way-taxi-varanasi.md',
  'content/en/destinations/varanasi/taxi/taxi-service-varanasi-cantt-station.md',
  'content/en/destinations/varanasi/taxi/wedding-tempo-traveller-varanasi.md',
  'content/en/destinations/varanasi/taxi/24-7-taxi-varanasi.md',
  'content/en/destinations/varanasi/taxi/taxi-service-in-sigra-varanasi.md',
  'content/en/destinations/varanasi/taxi/shivala-ghat-taxi-service.md',
  'content/en/destinations/varanasi/taxi/manikarnika-ghat-cremation-guide.md',
  'content/en/destinations/varanasi/taxi/kedar-harishchandra-ghat-taxi-service.md',
  'content/en/destinations/varanasi/taxi/airport-taxi-service-varanasi.md',
  'content/en/destinations/varanasi/taxi/taxi-service-varanasi.md',
];

// Standalone taxi pages needing RP
const standaloneTaxiPages = [
  'content/en/corporate-group-tempo-traveller-varanasi.md',
  'content/en/9-vs-12-vs-17-seater-tempo-traveller-varanasi.md',
];

// Event pages with FAQ but RP=0
const eventPagesRP0 = [
  'content/en/destinations/varanasi/events/chhath-puja-2026-varanasi-guide.md',
  'content/en/ultimate-guide-ramlila-dussehra-varanasi-2026.md',
  'content/en/holi-2026-varanasi-guide.md',
];

// Content pages with FAQ but RP=0
const contentPagesRP0 = [
  'content/en/destinations/varanasi/food/varanasi-street-food-guide.md',
  'content/en/destinations/varanasi/food/malaiyo-varanasi-guide.md',
];

function addRelatedPosts(filePath, posts) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);
    
    // Skip if already has relatedPosts
    if (data.relatedPosts && data.relatedPosts.length > 0) {
      console.log(`SKIP (has RP): ${filePath}`);
      return;
    }
    
    // Filter out self-references
    const slug = data.slug || '';
    const filtered = posts.filter(p => p !== slug);
    
    data.relatedPosts = filtered;
    
    const output = matter.stringify(content, data);
    fs.writeFileSync(filePath, output);
    console.log(`OK +${filtered.length}RP: ${filePath}`);
  } catch (e) {
    console.log(`ERR: ${filePath} - ${e.message}`);
  }
}

// Process all
console.log('=== Taxi cluster pages ===');
taxiPages.forEach(f => addRelatedPosts(f, taxiRelatedPosts));

console.log('\n=== Standalone taxi pages ===');
standaloneTaxiPages.forEach(f => addRelatedPosts(f, taxiRelatedPosts));

console.log('\n=== Event pages with FAQ but RP=0 ===');
eventPagesRP0.forEach(f => addRelatedPosts(f, eventRelatedPosts));

console.log('\n=== Content pages with FAQ but RP=0 ===');
contentPagesRP0.forEach(f => addRelatedPosts(f, [
  'best-time-to-visit-varanasi',
  'varanasi-street-food-guide',
  'same-day-varanasi-tour',
]));

console.log('\nDone.');
