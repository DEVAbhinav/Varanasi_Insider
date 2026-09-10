#!/usr/bin/env node
/**
 * scripts/scheduled-price-sync.js
 *
 * Daily task to find pages for kashitaxi.in with incorrect prices from the pricing engine.
 *
 * Workflow:
 * 1. Reads the sitemap (public/kt-secret-map-v9.xml).
 * 2. Reads docs/scheduledTasks/PriceSync to exclude already corrected & updated pages.
 * 3. Compares page content/meta against the authoritative pricing engine (lib/routePricing.js / data/routes.json / data/vehicles.json).
 * 4. Outputs candidate pages with pricing discrepancies, recommending the next 2 pages for the next run.
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = path.join(__dirname, '..');
const SITEMAP_PATH = path.join(ROOT, 'public', 'kt-secret-map-v9.xml');
const PRICE_SYNC_FILE = path.join(ROOT, 'docs', 'scheduledTasks', 'PriceSync');
const CONTENT_PATH = path.join(ROOT, 'content');
const BASE_URL = 'https://www.kashitaxi.in';

const rawRoutesData = require(path.join(ROOT, 'data', 'routes.json'));
const routesData = { ...rawRoutesData, routes: [...rawRoutesData.routes].sort((a, b) => b.id.length - a.id.length) };
const vehicles = require(path.join(ROOT, 'data', 'vehicles.json'));

// Pricing engine mirror (same logic as lib/routePricing.js)
function computeMinBillKm(distanceKm) {
  const d = Number(distanceKm) || 0;
  if (d > 160) return 250;
  if (d > 40) return 200;
  return 100;
}

function estimate(v, distanceKm, tripType, { nights = 0, minBillKm, fixedFare, minFare } = {}) {
  const dist = Number(distanceKm) || 0;
  if (!v || dist <= 0) return null;
  const isRound = tripType === 'round-trip';
  const fareMap = minFare || fixedFare;
  const perKm = isRound ? v.rtPerKm : v.owPerKm;
  const routeMin = Number.isFinite(minBillKm) ? minBillKm : computeMinBillKm(dist);
  const floor = isRound ? routeMin : Math.round(routeMin / 2);
  const tripKm = isRound ? 2 * dist : dist;
  const billableKm = Math.max(tripKm, floor);
  const toll = (v.tollPerKm || 0) * tripKm;
  const driver = (v.driverPerNight || 0) * Math.max(0, nights);
  let fare = Math.round(perKm * billableKm + toll + driver);
  let isFixedFloor = billableKm > tripKm;

  if (fareMap && fareMap[v.id]) {
    const minThreshold = isRound ? fareMap[v.id].rt : fareMap[v.id].ow;
    if (Number.isFinite(minThreshold) && fare < minThreshold) {
      fare = minThreshold;
      isFixedFloor = true;
    }
  }
  return { fare, billableKm, perKm, isFixedFloor };
}

// Compute standard fares for all routes
const routeFares = {};
for (const r of routesData.routes) {
  routeFares[r.id] = {};
  for (const v of vehicles) {
    routeFares[r.id][v.id] = {
      ow: estimate(v, r.distanceKm, 'one-way', { minBillKm: r.minBillKm, minFare: r.minFare || r.fixedFare, fixedFare: r.fixedFare || r.minFare }).fare,
      rt: estimate(v, r.distanceKm, 'round-trip', { minBillKm: r.minBillKm, minFare: r.minFare || r.fixedFare, fixedFare: r.fixedFare || r.minFare }).fare,
    };
  }
}

// 1. Read PriceSync reference file to get already corrected pages
function getCorrectedUrls() {
  const corrected = new Set();
  if (!fs.existsSync(PRICE_SYNC_FILE)) return corrected;
  const lines = fs.readFileSync(PRICE_SYNC_FILE, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
      corrected.add(trimmed.replace(/\/+$/, ''));
    }
  }
  return corrected;
}

// 2. Read sitemap
function getSitemapUrls() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    throw new Error(`Sitemap not found at ${SITEMAP_PATH}`);
  }
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  const urls = [];
  const re = /<loc>(.*?)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    urls.push(m[1].trim().replace(/\/+$/, ''));
  }
  return urls;
}

// 3. Map sitemap URLs to markdown content files
function mapUrlsToFiles() {
  const urlToFile = new Map();
  if (!fs.existsSync(CONTENT_PATH)) return urlToFile;

  const langs = fs.readdirSync(CONTENT_PATH).filter(l => !l.startsWith('.') && l !== 'destinations');
  const sectionFolders = ['packages', 'bus', 'services', 'landing', 'guides'];
  const routeBaseMap = { services: 'services', landing: 'services', guides: 'services' };

  for (const lang of langs) {
    const langRoot = path.join(CONTENT_PATH, lang);
    if (!fs.existsSync(langRoot)) continue;

    // Root-level posts
    const rootFiles = fs.readdirSync(langRoot).filter(f => f.endsWith('.md'));
    for (const file of rootFiles) {
      const abs = path.join(langRoot, file);
      const raw = fs.readFileSync(abs, 'utf-8');
      const fm = matter(raw).data;
      const slug = fm.slug || file.replace(/\.md$/, '');
      const loc = `${BASE_URL}/${lang}/${slug}`.replace(/\/+$/, '');
      urlToFile.set(loc, { abs, fm, lang, slug, raw });
    }

    // Section folders
    for (const folder of sectionFolders) {
      const secDir = path.join(langRoot, folder);
      if (!fs.existsSync(secDir)) continue;
      const files = fs.readdirSync(secDir).filter(f => f.endsWith('.md'));
      for (const file of files) {
        const abs = path.join(secDir, file);
        const raw = fs.readFileSync(abs, 'utf-8');
        const fm = matter(raw).data;
        const slug = fm.slug || file.replace(/\.md$/, '');
        const routeBase = routeBaseMap[folder] || folder;
        const loc = `${BASE_URL}/${lang}/${routeBase}/${slug}`.replace(/\/+$/, '');
        urlToFile.set(loc, { abs, fm, lang, slug, raw });
      }
    }
  }

  // Destination pages
  for (const lang of ['en', 'hi']) {
    const destRoot = path.join(CONTENT_PATH, lang, 'destinations');
    if (!fs.existsSync(destRoot)) continue;
    const destinations = fs.readdirSync(destRoot).filter(d => !d.startsWith('.') && fs.statSync(path.join(destRoot, d)).isDirectory());
    for (const destination of destinations) {
      const destDir = path.join(destRoot, destination);
      const categories = fs.readdirSync(destDir).filter(c => !c.startsWith('.') && fs.statSync(path.join(destDir, c)).isDirectory());
      for (const category of categories) {
        const catDir = path.join(destDir, category);
        const files = fs.readdirSync(catDir).filter(f => f.endsWith('.md'));
        for (const file of files) {
          const abs = path.join(catDir, file);
          const raw = fs.readFileSync(abs, 'utf-8');
          const fm = matter(raw).data;
          const isIndex = file.toLowerCase() === 'index.md';
          const slug = isIndex ? category : (fm.slug || file.replace(/\.md$/, ''));
          const catBase = `${BASE_URL}/${lang}/city/${destination}/${category}`;
          const loc = (isIndex ? catBase : `${catBase}/${slug}`).replace(/\/+$/, '');
          urlToFile.set(loc, { abs, fm, lang, slug, destination, category, raw });
        }
      }
    }
  }

  return urlToFile;
}

function findDiscrepancies() {
  const correctedUrls = getCorrectedUrls();
  const sitemapUrls = getSitemapUrls();
  const urlToFile = mapUrlsToFiles();

  console.log(`[PriceSync] Total sitemap URLs: ${sitemapUrls.length}`);
  console.log(`[PriceSync] Already corrected in PriceSync: ${correctedUrls.size}`);

  const candidates = [];

  for (const url of sitemapUrls) {
    if (correctedUrls.has(url)) {
      continue; // Filter out already corrected pages
    }

    const pageInfo = urlToFile.get(url);
    if (!pageInfo) continue;

    const { abs, fm, raw, slug } = pageInfo;

    // Check if page corresponds to a known route
    for (const r of routesData.routes) {
      const routeKeywords = [r.id, r.name.toLowerCase(), ...(r.aliases || []).map(a => a.toLowerCase())];
      const isRouteMatch = routeKeywords.some(kw => { const re = new RegExp('(^|[-_/ ])' + kw + '([-_/ ]|$)', 'i'); return re.test(slug) || re.test(abs); });
      if (!isRouteMatch) continue;

      const isTaxi = /taxi|cab/i.test(slug);
      const isTempo = /tempo-traveller/i.test(slug);
      if (!isTaxi && !isTempo) continue;

      const engine = routeFares[r.id];
      const title = fm.title || '';
      const metaTitle = fm.metaTitle || '';
      const metaDesc = fm.metaDescription || '';
      const h1Match = raw.match(/^#\s+(.+)$/m);
      const h1 = h1Match ? h1Match[1] : '';

      const extractPrices = (str) =>
        [...str.matchAll(/₹\s*([\d,]+)/g)].map(m => parseInt(m[1].replace(/,/g, ''), 10));

      const headlinePrices = [
        ...extractPrices(title),
        ...extractPrices(metaTitle),
        ...extractPrices(metaDesc),
        ...extractPrices(h1),
      ];

      const allEnginePrices = Object.values(engine).flatMap(v => [v.ow, v.rt]);

      if (isTaxi) {
        const discrepancies = headlinePrices.filter(p => !allEnginePrices.includes(p) && p > 100);
        if (discrepancies.length > 0) {
          candidates.push({
            url,
            filePath: abs.replace(ROOT + '/', ''),
            route: r.name,
            type: 'Taxi/Cab',
            foundPrices: discrepancies,
            expectedOwSedan: engine.dzire.ow,
            expectedRtSedan: engine.dzire.rt,
            title,
          });
          break;
        }
      } else if (isTempo) {
        const tempoVehicles = ['tempo-12', 'tempo-17', 'tempo-26'];
        const validTempoPrices = tempoVehicles.flatMap(tid => [engine[tid].ow, engine[tid].rt]);
        const discrepancies = headlinePrices.filter(p => !validTempoPrices.includes(p) && p > 100);
        if (discrepancies.length > 0) {
          candidates.push({
            url,
            filePath: abs.replace(ROOT + '/', ''),
            route: r.name,
            type: 'Tempo Traveller',
            foundPrices: discrepancies,
            expectedOwTempo12: engine['tempo-12'].ow,
            expectedRtTempo12: engine['tempo-12'].rt,
            title,
          });
          break;
        }
      }
    }
  }

  console.log(`\n[PriceSync] Found ${candidates.length} candidate pages with pricing discrepancies.`);
  console.log(`\n=== RECOMMENDED NEXT 2 PAGES FOR CORRECTION ===`);

  const nextTwo = candidates.slice(0, 2);
  nextTwo.forEach((cand, idx) => {
    console.log(`\n${idx + 1}. URL: ${cand.url}`);
    console.log(`   File: ${cand.filePath}`);
    console.log(`   Route: ${cand.route} (${cand.type})`);
    console.log(`   Headline prices found: ₹${cand.foundPrices.join(', ₹')}`);
    if (cand.type === 'Taxi/Cab') {
      console.log(`   Expected Pricing Engine Sedan: OW ₹${cand.expectedOwSedan} / RT ₹${cand.expectedRtSedan}`);
    } else {
      console.log(`   Expected Pricing Engine Tempo-12: OW ₹${cand.expectedOwTempo12} / RT ₹${cand.expectedRtTempo12}`);
    }
  });

  return { candidates, nextTwo };
}

if (require.main === module) {
  findDiscrepancies();
}

module.exports = { findDiscrepancies, getCorrectedUrls };
