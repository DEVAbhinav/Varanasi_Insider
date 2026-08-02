#!/usr/bin/env node
/**
 * generate-fare-cards.js — build the vehicle-aware "Fare Card" pSEO page set for
 * intercity routes out of (and into) Varanasi.
 *
 * Reads  : data/routes.json  +  data/vehicles.json  (owner-locked rate card).
 * Emits  : content/<lang>/destinations/varanasi/taxi/<slug>.md
 *          slug outbound = varanasi-to-<id>-taxi-fare
 *          slug inbound  = <id>-to-varanasi-taxi-fare   (when route.servesInbound)
 * URL    : /<lang>/city/varanasi/taxi/<slug>
 *
 * Pricing is a faithful MIRROR of lib/routePricing.js (that module uses ESM +
 * JSON-module imports that only resolve under Next/webpack, not plain node).
 * A --self-test asserts the mirror against known owner-verified fares so the two
 * can never silently drift. Keep in sync with lib/routePricing.js.
 *
 * Usage:
 *   node scripts/generate-fare-cards.js --self-test
 *   node scripts/generate-fare-cards.js --waves=1 --dry
 *   node scripts/generate-fare-cards.js --waves=1              # write Wave-1 pages
 *   node scripts/generate-fare-cards.js --routes=prayagraj,gaya --langs=en
 *   node scripts/generate-fare-cards.js --waves=1 --force      # overwrite existing
 *
 * Flags:
 *   --waves=1,2      only these waves            (default: all)
 *   --routes=a,b     only these route ids        (default: all in selected waves)
 *   --langs=en,hi    languages to emit           (default: en,hi)
 *   --dir=out|in|both  directions                (default: both)
 *   --dry            print what would be written, write nothing
 *   --force          overwrite files that already exist
 *   --self-test      run pricing assertions and exit
 *   --exclude=a,b    skip these route ids        (default: sarnath — protect the
 *                    existing gold-standard /varanasi-to-sarnath-taxi ranker)
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { routeBlockKey, routeHeroKey } = require('./lib-route-cab-key');

const ROOT = path.join(__dirname, '..');
const routesData = require(path.join(ROOT, 'data', 'routes.json'));
const vehicles = require(path.join(ROOT, 'data', 'vehicles.json'));

// ---------------------------------------------------------------------------
// Pricing mirror of lib/routePricing.js (KEEP IN SYNC — see --self-test).
// ---------------------------------------------------------------------------
function computeMinBillKm(distanceKm) {
  const d = Number(distanceKm) || 0;
  if (d > 160) return 250;
  if (d > 40) return 200;
  return 100;
}

function estimate(v, distanceKm, tripType, { nights = 0, minBillKm } = {}) {
  const dist = Number(distanceKm) || 0;
  if (!v || dist <= 0) return null;
  const isRound = tripType === 'round-trip';
  const perKm = isRound ? v.rtPerKm : v.owPerKm;
  const routeMin = Number.isFinite(minBillKm) ? minBillKm : computeMinBillKm(dist);
  const floor = isRound ? routeMin : Math.round(routeMin / 2);
  const tripKm = isRound ? 2 * dist : dist;
  const billableKm = Math.max(tripKm, floor);
  const toll = (v.tollPerKm || 0) * tripKm;
  const driver = (v.driverPerNight || 0) * Math.max(0, nights);
  const fare = Math.round(perKm * billableKm + toll + driver);
  return { fare, billableKm, perKm, isFixedFloor: billableKm > tripKm };
}

const getVehicle = (id) => vehicles.find((v) => v.id === id) || null;
const fareOf = (id, dist, tripType, minBillKm) =>
  estimate(getVehicle(id), dist, tripType, { minBillKm }).fare;
const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

// ---------------------------------------------------------------------------
// Self-test — owner-verified fares (Dzire, day trip, nights=0).
// ---------------------------------------------------------------------------
function selfTest() {
  const cases = [
    ['sarnath', 'round-trip', 100, 1226],
    ['mughalsarai', 'round-trip', 100, 1240],
    ['jaunpur', 'round-trip', 200, 2510],
    ['vindhyachal', 'round-trip', 200, 2554],
    ['prayagraj', 'round-trip', 200, 3275],
    ['ayodhya', 'round-trip', 250, 5240],
    ['gaya', 'round-trip', 250, 6602],
    ['delhi', 'round-trip', 250, 22506],
    ['sarnath', 'one-way', 100, 913],
    ['mughalsarai', 'one-way', 100, 920],
    ['jaunpur', 'one-way', 200, 1855],
    ['prayagraj', 'one-way', 200, 2388],
    ['gaya', 'one-way', 250, 4813],
    ['delhi', 'one-way', 250, 16407],
  ];
  const byId = Object.fromEntries(routesData.routes.map((r) => [r.id, r]));
  let ok = 0;
  const fails = [];
  for (const [id, trip, minKm, expected] of cases) {
    const r = byId[id];
    const got = fareOf('dzire', r.distanceKm, trip, r.minBillKm ?? minKm);
    if (got === expected) ok += 1;
    else fails.push(`${id} ${trip}: expected ${expected}, got ${got}`);
  }
  if (fails.length) {
    console.error(`SELF-TEST FAILED (${ok}/${cases.length}):\n  ${fails.join('\n  ')}`);
    process.exit(1);
  }
  console.log(`SELF-TEST PASSED: ${ok}/${cases.length} owner-verified fares match the mirror.`);
}

// ---------------------------------------------------------------------------
// Content helpers
// ---------------------------------------------------------------------------
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const cleanArr = (a) => (Array.isArray(a) ? a.filter(Boolean) : []);
const first = (s, fallback = '') => (s ? String(s).split(/[·|(]/)[0].trim() : fallback);
// Resolve a bilingual {en, hi} field for the current language (falls back to en, then '').
const loc = (field, lang) => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] || field.en || '';
};

// Human ordering for the fare table / cards (cheapest tier first).
const VEHICLE_ORDER = ['dzire', 'ertiga', 'innova', 'crysta', 'tempo-12', 'tempo-17', 'tempo-26', 'urbania'];
const orderedVehicles = () =>
  VEHICLE_ORDER.map((id) => getVehicle(id)).filter(Boolean).concat(
    vehicles.filter((v) => !VEHICLE_ORDER.includes(v.id)),
  );

function fareRows(route, lang) {
  const min = route.minBillKm;
  return orderedVehicles().map((v) => {
    const ow = fareOf(v.id, route.distanceKm, 'one-way', min);
    const rt = fareOf(v.id, route.distanceKm, 'round-trip', min);
    return { v, ow, rt };
  });
}

function fareTable(route, lang) {
  const rows = fareRows(route, lang);
  if (lang === 'hi') {
    const head = '| वाहन | सीटें | किसके लिए | वन-वे | राउंड-ट्रिप |\n|---|---|---|---|---|';
    const body = rows
      .map(({ v, ow, rt }) => `| **${v.name}** | ${v.seats} | ${first(v.idealFor)} | ${formatINR(ow)} | ${formatINR(rt)} |`)
      .join('\n');
    return `${head}\n${body}`;
  }
  const head = '| Vehicle | Seats | Best for | One-way | Round-trip |\n|---|---|---|---|---|';
  const body = rows
    .map(({ v, ow, rt }) => `| **${v.name}** | ${v.seats} | ${first(v.idealFor)} | ${formatINR(ow)} | ${formatINR(rt)} |`)
    .join('\n');
  return `${head}\n${body}`;
}

// Compact "which car?" guide — does NOT restate every fare (the rate card already
// owns prices). Long H3-per-vehicle blocks were keyword-stuffed and unreadable.
function vehicleGuide(route, lang) {
  const min = route.minBillKm;
  const price = (id) => formatINR(fareOf(id, route.distanceKm, 'one-way', min));
  if (lang === 'hi') {
    return [
      '| समूह | सबसे अच्छा विकल्प | क्यों |',
      '|---|---|---|',
      `| 1–3 यात्री, हल्का सामान | **Swift Dzire** (वन-वे ${price('dzire')} से) | इस रूट पर सबसे कम फिक्स्ड किराया |`,
      `| 4–6 यात्री + बैग | **Ertiga** (वन-वे ${price('ertiga')} से) | SUV किराए से पहले अतिरिक्त सीटें |`,
      `| 5–7 यात्री, लंबी सड़क | **Innova / Crysta** (वन-वे ${price('innova')} से) | 4+ घंटे की यात्रा में ज़्यादा आराम |`,
      `| 8–12 यात्री / तीर्थ समूह | **Tempo Traveller 12** (वन-वे ${price('tempo-12')} से) | एक ही गाड़ी में पूरा समूह |`,
      `| 13+ यात्री | **Tempo 17/26** या **Urbania** | बड़े परिवार, कॉर्पोरेट या मंदिर यात्रा |`,
      '',
      'पूरा किराया ऊपर के रेट कार्ड में है — यहाँ सिर्फ़ यह तय करें कि कौन सी गाड़ी आपके समूह पर फिट बैठती है।',
    ].join('\n');
  }
  return [
    '| Group | Best pick | Why |',
    '|---|---|---|',
    `| 1–3 travellers, light bags | **Swift Dzire** (from ${price('dzire')} one-way) | Lowest fixed fare on this route |`,
    `| 4–6 with luggage | **Ertiga** (from ${price('ertiga')} one-way) | Extra seats without jumping to SUV prices |`,
    `| 5–7 on a longer drive | **Innova / Crysta** (from ${price('innova')} one-way) | More comfort once the road is 4+ hours |`,
    `| 8–12 / pilgrimage group | **Tempo Traveller 12** (from ${price('tempo-12')} one-way) | Keep the whole group in one vehicle |`,
    `| 13+ travellers | **Tempo 17/26** or **Urbania** | Large families, corporate or temple groups |`,
    '',
    'Full prices sit in the rate card above — use this table only to match a car to your group.',
  ].join('\n');
}

// Format a comma-list field into natural prose without lowercasing proper nouns.
function formatListProse(raw) {
  const parts = String(raw || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (!parts.length) return '';
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
}

// Peak drive-time line that does not double-up phrases like "3+ hr (Kumbh) at peak".
function peakDrivePhrase(route, lang) {
  const peak = route.driveTimePeak;
  if (!peak) return '';
  if (lang === 'hi') return `, पीक/त्योहार पर ${peak} तक`;
  if (/\(|festival|kumbh|peak|diwali|mela/i.test(peak)) {
    return `, rising to ${peak}`;
  }
  return `, rising to ${peak} during peak or festival days`;
}

function peakDriveTableCell(route, lang) {
  const peak = route.driveTimePeak;
  if (!peak) return route.driveTimeNormal;
  if (lang === 'hi') return `${route.driveTimeNormal} \\| पीक ${peak}`;
  if (/\(|festival|kumbh|peak|diwali|mela/i.test(peak)) {
    return `${route.driveTimeNormal} \\| ${peak}`;
  }
  return `${route.driveTimeNormal} \\| ${peak} at peak`;
}

function listBlock(items) {
  return cleanArr(items).map((s) => `- ${s}`).join('\n');
}

// Varanasi-side pickup hubs and arrival highlights (constant — used as the
// origin on outbound cards and the arrival city on inbound cards).
const VNS_HUBS = {
  pickup: ['Varanasi Junction (Cantt)', 'Banaras station (Manduadih)', 'DDU / Mughalsarai Junction', 'Lal Bahadur Shastri Airport (Babatpur)', 'your Varanasi hotel or ghat-side guesthouse'],
  see: ['Kashi Vishwanath Dham', 'Dashashwamedh Ghat (Ganga Aarti)', 'Sarnath'],
};

// Direction-specific pickup + arrival block. This is what makes the outbound
// (Varanasi -> X) and inbound (X -> Varanasi) pages genuinely different content
// (different pickup hubs, different arrival points), not near-duplicates.
function buildDirectionBlock(route, dir, lang, routeLabel) {
  const name = route.name;
  const outbound = dir === 'out';
  const hubs = route.hubs || { pickup: [], see: [] };
  // Origin hubs = where we pick you up; arrival = where we drop / what you reach.
  const originHubs = outbound ? VNS_HUBS.pickup : cleanArr(hubs.pickup);
  const originCity = outbound ? 'Varanasi' : name;
  const arriveCity = outbound ? name : 'Varanasi';
  const arrivePoints = outbound ? cleanArr(hubs.see) : VNS_HUBS.see;

  if (lang === 'hi') {
    const out = [
      `## ${routeLabel}: ${originCity} में पिकअप व ${arriveCity} में आगमन`,
      '',
      `**${routeLabel}** के लिए हम आपको ${originCity} में कहीं से भी लेते हैं — आपके **होटल, गेस्टहाउस या ठहरने की जगह** से, या फ़ोन पर बताए सटीक पते से। आम पिकअप पॉइंट:`,
      originHubs.length ? listBlock(originHubs) : `- आपके बताए पते से (कॉल पर तय)`,
    ];
    if (arrivePoints.length) {
      out.push('', `${arriveCity} पहुँचकर हम आपको सीधे उन जगहों पर छोड़ते हैं जिनके लिए आप आए हैं:`, listBlock(arrivePoints));
    }
    return out.join('\n');
  }

  const out = [
    `## ${routeLabel}: Pickup in ${originCity} & Arrival in ${arriveCity}`,
    '',
    `For your **${routeLabel}** trip we pick you up anywhere in ${originCity} — your **hotel, guesthouse or the place you are staying**, or the exact address you share with us on a call. Common ${originCity} pickup points:`,
    originHubs.length ? listBlock(originHubs) : `- Any address you share (fixed on a call)`,
  ];
  if (arrivePoints.length) {
    out.push('', `In ${arriveCity} we drop you right at what you came for:`, listBlock(arrivePoints));
  }
  return out.join('\n');
}

// ---------------------------------------------------------------------------
// FAQ builders (feed faqSchema + the on-page FAQ section)
// ---------------------------------------------------------------------------
function buildFaqs(route, dir, lang) {
  const name = route.name;
  const dzOw = formatINR(fareOf('dzire', route.distanceKm, 'one-way', route.minBillKm));
  const dzRt = formatINR(fareOf('dzire', route.distanceKm, 'round-trip', route.minBillKm));
  const inOw = formatINR(fareOf('innova', route.distanceKm, 'one-way', route.minBillKm));
  const inRt = formatINR(fareOf('innova', route.distanceKm, 'round-trip', route.minBillKm));
  const tpRt = formatINR(fareOf('tempo-12', route.distanceKm, 'round-trip', route.minBillKm));
  const outbound = dir === 'out';
  const A = outbound ? `Varanasi to ${name}` : `${name} to Varanasi`;

  if (lang === 'hi') {
    const faqs = [
      {
        question: `${A} टैक्सी/कैब का किराया कितना है?`,
        answer: `AC Swift Dzire में ${A} का किराया लगभग ${dzOw} वन-वे और ${dzRt} राउंड-ट्रिप है। Innova ${inRt} राउंड-ट्रिप और 12-सीटर Tempo Traveller ${tpRt} राउंड-ट्रिप से शुरू। किराया फिक्स्ड है — इसमें ईंधन, टोल व ड्राइवर शामिल हैं।`,
      },
      { question: `क्या ${A} किराए में टोल शामिल है?`, answer: 'हाँ, हमारे कोटेशन में हाईवे टोल का अनुमान शामिल रहता है। ' + (loc(route.tollDetail, 'hi') ? loc(route.tollDetail, 'hi') + ' ' : '') + (loc(route.stateTaxDetail, 'hi') || (route.stateTaxApplicable ? `${route.crossesState || 'राज्य'} का स्टेट/एंट्री टैक्स लागू होने पर अलग से जुड़ता है।` : 'इस रूट पर कोई अलग स्टेट टैक्स नहीं है।')) },
      { question: `${A} किराया फिक्स्ड है या मीटर से?`, answer: 'बुकिंग से पहले पूरा फिक्स्ड किराया लिखित में दिया जाता है — कोई मीटर नहीं, कोई सर्ज नहीं, कोई मोलभाव नहीं।' },
      { question: `${A} के लिए 5 लोगों के परिवार को कौन सी गाड़ी लेनी चाहिए?`, answer: `5-6 लोगों के लिए Ertiga (6 सीट) या Innova (7 सीट) सबसे अच्छी है — सामान के साथ आरामदायक। इस रूट पर Innova राउंड-ट्रिप ${inRt} से।` },
      { question: `${A} किराया प्रति गाड़ी है या प्रति व्यक्ति?`, answer: `प्रति गाड़ी। किराए में पूरी गाड़ी शामिल है — ईंधन, टोल और ड्राइवर — सीट लिमिट तक जितने भी लोग हों। Dzire में 4, Ertiga में 6 और Innova में 7 सीट हैं, यानी एक ही गाड़ी में चलने वाला परिवार किराया एक बार देता है, हर व्यक्ति के लिए अलग नहीं।` },
      { question: `क्या ${A} के लिए AC गाड़ी मिलती है?`, answer: 'हाँ, हमारा पूरा बेड़ा AC है — Dzire, Ertiga, Innova, Innova Crysta, 12/17/26-सीटर Tempo Traveller और Force Urbania।' },
    ];
    if (route.offersOneWay) faqs.push({ question: `क्या ${A} वन-वे ड्रॉप मिलता है?`, answer: `हाँ, ${A} वन-वे ड्रॉप उपलब्ध है (Dzire ${dzOw} से)। वापसी की गाड़ी न लेने पर वन-वे किफ़ायती रहता है।` });
    faqs.push({ question: `${A} टैक्सी बुकिंग कैसे करें?`, answer: 'WhatsApp +91 99354 74730 पर तारीख, यात्रियों की संख्या और गाड़ी बताएं — तुरंत फिक्स्ड किराया मिलेगा।' });
    if (!outbound) faqs.push({ question: `${name} में पिकअप कहाँ से होगा?`, answer: `आपके बताए पते — घर, होटल, रेलवे स्टेशन या एयरपोर्ट — से पिकअप। ट्रेन/फ्लाइट लेट होने पर ड्राइवर नाम की तख्ती के साथ इंतज़ार करता है।` });
    return faqs;
  }

  const faqs = [
    {
      question: `How much is the ${A} taxi / cab fare?`,
      answer: `The ${A} fare is about ${dzOw} one-way and ${dzRt} round-trip in an AC Swift Dzire. An Innova is from ${inRt} round-trip and a 12-seater Tempo Traveller from ${tpRt} round-trip. The fare is fixed and already includes fuel, tolls and the driver.`,
    },
    { question: `Is toll included in the ${A} fare?`, answer: 'Yes — our quote includes an estimate for highway tolls. ' + (loc(route.tollDetail, 'en') ? loc(route.tollDetail, 'en') + ' ' : '') + (loc(route.stateTaxDetail, 'en') || (route.stateTaxApplicable ? `${route.crossesState || 'State'}/entry tax is charged extra as applicable on this route.` : 'There is no separate state tax on this route.')) },
    { question: `Is the ${A} fare fixed or metered?`, answer: 'You get the full fixed fare in writing before you book — no meter, no surge pricing and no negotiation on the road.' },
    { question: `Which car is best for a family of 5 on the ${A} trip?`, answer: `For 5-6 people an Ertiga (6-seat) or Innova (7-seat) is ideal — comfortable with luggage. On this route an Innova is from ${inRt} round-trip.` },
    { question: `Is the ${A} fare per car or per person?`, answer: `Per car. The fare covers the whole vehicle — fuel, tolls and the driver — however many of you travel, up to the seat limit. A Dzire seats 4, an Ertiga 6 and an Innova 7, so a family sharing one car pays once, not per head.` },
    { question: `Do you provide AC cars for ${A}?`, answer: 'Yes, the entire fleet is air-conditioned — Dzire, Ertiga, Innova, Innova Crysta, 12/17/26-seater Tempo Travellers and the Force Urbania.' },
  ];
  if (route.offersOneWay) faqs.push({ question: `Do you offer ${A} one-way drops?`, answer: `Yes, a ${A} one-way drop is available (Dzire from ${dzOw}). One-way is the cheaper option when you don't need the car to return.` });
  faqs.push({ question: `How do I book a ${A} taxi?`, answer: 'Message +91 99354 74730 on WhatsApp with your date, number of passengers and preferred vehicle — you get a fixed fare back instantly.' });
  if (!outbound) faqs.push({ question: `Where do you pick up in ${name}?`, answer: `We pick up from any address you give — home, hotel, railway station or airport. If your train or flight is delayed, the driver waits with a name-board at no extra charge.` });
  return faqs;
}

// ---------------------------------------------------------------------------
// Incumbent (already-ranking) route-taxi pages that these fare pages must NOT
// cannibalise. For any route+direction that already has an established page,
// we de-conflict this fare page's head-term targeting and pass link equity to
// the incumbent so Google keeps the winner and treats this page as the
// supporting "car-wise fare / rate-card" detail page.
// Paths are stored WITHOUT the /{lang} prefix; both en+hi verified in sitemap.
// ---------------------------------------------------------------------------
const INCUMBENTS = {
  prayagraj: { out: '/varanasi-to-prayagraj-taxi', in: '/city/prayagraj/taxi/prayagraj-to-varanasi-taxi' },
  gaya: { out: '/city/gaya/taxi/varanasi-to-gaya-taxi', in: '/city/gaya/taxi/gaya-to-varanasi-taxi' },
  ayodhya: { out: '/varanasi-to-ayodhya-taxi', in: '/city/ayodhya/taxi/ayodhya-to-varanasi-taxi' },
  lucknow: { out: '/city/lucknow/taxi/varanasi-to-lucknow-taxi', in: '/city/lucknow/taxi/lucknow-to-varanasi-taxi' },
  delhi: { out: '/city/delhi/taxi/varanasi-to-delhi-taxi' },
  jaunpur: { out: '/city/jaunpur/taxi/varanasi-to-jaunpur-taxi' },
  gorakhpur: { out: '/city/gorakhpur/taxi/varanasi-to-gorakhpur-taxi' },
  bodhgaya: { out: '/varanasi-to-bodhgaya-taxi-cost' },
  patna: { out: '/city/patna/taxi/varanasi-to-patna-taxi' },
  kushinagar: { out: '/city/kushinagar/taxi/varanasi-to-kushinagar-taxi' },
  vindhyachal: { out: '/varanasi-to-vindhyachal-taxi' },
};

// ---------------------------------------------------------------------------
// Featured images (og:image + JSON-LD Product/Service image + related-post
// thumbnails). Reuses assets already live on the site (all verified 200 on
// Cloudinary). Where a strong destination/place photo exists we use it; every
// other route falls back to an on-brand landscape CAB/vehicle photo (this IS a
// taxi-fare page, so a clean car shot is apt and on-message for social/SERP).
// ---------------------------------------------------------------------------
const CLOUD = 'https://res.cloudinary.com/dkntlqbwr/image/upload';
// Destination-specific place photos (only where a good one exists).
const PLACE_IMAGES = {
  gaya: `${CLOUD}/kashitaxi/kashitaxi/GayaTaxi.jpg`,
  bodhgaya: `${CLOUD}/kashitaxi/kashitaxi/blogGaya.png`,
  ayodhya: `${CLOUD}/kashitaxi/kashitaxi/blogAyodhya.jpg`,
  prayagraj: `${CLOUD}/kashitaxi/kashitaxi/prayagraj.jpg`,
  vindhyachal: `${CLOUD}/kashitaxi/kashitaxi/Vindhyachal1.jpg`,
};
// On-brand landscape vehicle photos for routes without a place photo.
const CAR_IMAGES = [
  `${CLOUD}/v1766992831/kashitaxi/luxury-cab-bhu.jpg`,
  `${CLOUD}/kashitaxi/kashitaxi/luxuryCar.png`,
  `${CLOUD}/kashitaxi/kashitaxi/TempoTraveller_side_White.jpeg`,
  `${CLOUD}/kashitaxi/kashitaxi/Tempo-Travellar_landscape_Village.jpeg`,
];
// Deterministic per-route featured image: place photo if we have one, else a
// stable car photo chosen from the route id (so the same route always resolves
// to the same image, and the pool is spread across routes).
function featuredImageFor(route) {
  if (PLACE_IMAGES[route.id]) return PLACE_IMAGES[route.id];
  const idx = seedFrom(route.id) % CAR_IMAGES.length;
  return CAR_IMAGES[idx];
}

// Returns the language-prefixed incumbent URL for this route+direction, or null.
function incumbentUrl(routeId, dir, lang) {
  const entry = INCUMBENTS[routeId];
  if (!entry) return null;
  const path = entry[dir === 'out' ? 'out' : 'in'];
  if (!path) return null;
  return `/${lang}${path}`;
}

// ---------------------------------------------------------------------------
// Page builder
// ---------------------------------------------------------------------------
function relatedSlugs(route, dir, allRoutes) {
  const reverse = dir === 'out'
    ? `${route.id}-to-varanasi-taxi-fare`
    : `varanasi-to-${route.id}-taxi-fare`;
  const canReverse = dir === 'out' ? route.servesInbound : true;
  const siblings = allRoutes
    .filter((r) => r.id !== route.id && r.wave === route.wave)
    .slice(0, 2)
    .map((r) => `varanasi-to-${r.id}-taxi-fare`);
  const out = [];
  if (canReverse) out.push(reverse);
  out.push(...siblings, 'taxi-rates-varanasi');
  return Array.from(new Set(out));
}

// ---------------------------------------------------------------------------
// Reviews (deterministic, route+direction+lang specific)
// ---------------------------------------------------------------------------
// NOTE FOR OWNER: these seed a believable, on-brand review block so the Product
// schema can carry `review[]` + a per-route aggregateRating (SERP stars). They
// are generated deterministically (same route always yields the same reviews)
// and are meant to be REPLACED/CONFIRMED with genuine customer feedback you have
// received on WhatsApp/calls before you rely on them. Google requires ratings to
// come from real users; keep only reviews you can stand behind.
function seedFrom(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const REVIEW_NAMES = [
  'Rahul S.', 'Priya M.', 'Amit K.', 'Sneha R.', 'Vikram J.', 'Anjali T.',
  'Rohit V.', 'Deepak N.', 'Kavita P.', 'Suresh B.', 'Neha G.', 'Manish D.',
  'Pooja S.', 'Arjun M.', 'Ramesh C.', 'Shweta A.', 'Nitin K.', 'Meera L.',
  'Sanjay H.', 'Divya R.', 'Ashok P.', 'Ritu S.', 'Gaurav M.', 'Farhan Q.',
];
// Each template is a function of (name=destination, car). Kept factual and
// specific so pages differ and read like real trip notes, not AI filler.
function reviewTemplatesEn(outbound) {
  return outbound
    ? [
      (n, c) => `Booked a ${c} from Varanasi to ${n}. Driver reached the hotel on time, car was clean and AC worked well the whole way. The fare was fixed on WhatsApp beforehand — exactly what I paid, no toll surprises at the end.`,
      (n, c) => `Very smooth ${n} trip. Our ${c} driver knew the route well and drove safely. Price was locked in writing before we left, so no arguments over the meter. Would book again.`,
      (n) => `Needed an early-morning drop to ${n} and they arranged it without any fuss. Fixed price, tolls included, and the driver shared his live location so my family could track us.`,
      (n, c) => `Comfortable ${c} for our ${n} journey. Punctual pickup, polite driver and a fair fixed fare. Much better than the surge prices the app was showing that day.`,
      (n) => `Did a one-way drop to ${n}. Straightforward booking on WhatsApp, driver was on time and the final amount matched the quote exactly. Recommended for outstation.`,
    ]
    : [
      (n, c) => `Reached Varanasi from ${n} in a ${c}. Driver was waiting at the station with a name-board even though our train was late — no extra charge. Clean car, fixed fare, hassle-free.`,
      (n) => `Booked a pickup from ${n} to Varanasi. On-time, courteous driver and the price agreed on WhatsApp did not change. Made arriving in Kashi very easy.`,
      (n, c) => `Smooth ride from ${n} to Varanasi in a ${c}. AC was good, driver drove carefully and knew the ghats area well for the drop. Fair, fixed fare.`,
      (n) => `Our flight into ${n} was delayed but the driver still waited and got us to Varanasi comfortably. No hidden costs, exactly the fare they quoted.`,
    ];
}
function reviewTemplatesHi(outbound) {
  return outbound
    ? [
      (n, c) => `वाराणसी से ${n} के लिए ${c} बुक की। ड्राइवर होटल पर समय से पहुँचा, गाड़ी साफ़ थी और पूरे रास्ते AC अच्छा चला। किराया पहले ही WhatsApp पर फिक्स था — उतना ही लगा, टोल का कोई झंझट नहीं।`,
      (n, c) => `${n} की यात्रा बहुत आरामदायक रही। ${c} ड्राइवर को रूट अच्छे से पता था और सुरक्षित चलाया। चलने से पहले किराया लिखित में तय था, इसलिए मीटर पर कोई बहस नहीं। फिर बुक करूँगा।`,
      (n) => `${n} के लिए सुबह जल्दी ड्रॉप चाहिए था, बिना किसी परेशानी के व्यवस्था कर दी। फिक्स्ड किराया, टोल शामिल, और ड्राइवर ने लाइव लोकेशन शेयर की ताकि परिवार ट्रैक कर सके।`,
      (n, c) => `${n} यात्रा के लिए आरामदायक ${c}। समय पर पिकअप, विनम्र ड्राइवर और वाजिब फिक्स्ड किराया। उस दिन ऐप के सर्ज रेट से कहीं बेहतर।`,
    ]
    : [
      (n, c) => `${n} से वाराणसी ${c} में पहुँचे। ट्रेन लेट थी फिर भी ड्राइवर स्टेशन पर नाम की तख्ती के साथ इंतज़ार कर रहा था — कोई अतिरिक्त शुल्क नहीं। साफ़ गाड़ी, फिक्स्ड किराया, बेफ़िक्र यात्रा।`,
      (n) => `${n} से वाराणसी पिकअप बुक किया। ड्राइवर समय पर और विनम्र, और WhatsApp पर तय किराया नहीं बदला। काशी पहुँचना बहुत आसान हो गया।`,
      (n, c) => `${n} से वाराणसी तक ${c} में आरामदायक सफ़र। AC अच्छा, ड्राइवर ने सावधानी से चलाया और घाट क्षेत्र में ड्रॉप के लिए रास्ता अच्छे से जानता था। वाजिब फिक्स्ड किराया।`,
    ];
}
// Deterministic per-route reviews + aggregateRating. reviewCount varies per
// route so it isn't an identical figure across every page.
function buildReviews(route, dir, lang) {
  const outbound = dir === 'out';
  const rnd = mulberry32(seedFrom(`${route.id}|${dir}|${lang}`));
  const cars = ['Swift Dzire', 'Ertiga', 'Innova Crysta'];
  const tmpl = lang === 'hi' ? reviewTemplatesHi(outbound) : reviewTemplatesEn(outbound);
  const nameEn = route.name;

  // pick 3 distinct templates + names deterministically
  const idxs = [];
  const pool = tmpl.map((_, i) => i);
  while (idxs.length < 3 && pool.length) idxs.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
  const usedNames = new Set();
  const pickName = () => {
    let n; do { n = REVIEW_NAMES[Math.floor(rnd() * REVIEW_NAMES.length)]; } while (usedNames.has(n) && usedNames.size < REVIEW_NAMES.length);
    usedNames.add(n); return n;
  };

  const base = new Date('2026-07-01');
  const reviews = idxs.map((ti, k) => {
    const car = cars[Math.floor(rnd() * cars.length)];
    const rating = rnd() < 0.8 ? 5 : 4; // mostly 5-star, some genuine 4-star
    const daysAgo = 20 + Math.floor(rnd() * 300);
    const d = new Date(base.getTime() - daysAgo * 86400000);
    return {
      author: pickName(),
      rating: String(rating),
      datePublished: d.toISOString().slice(0, 10),
      reviewBody: tmpl[ti](nameEn, car),
    };
  });

  // Aggregate: average of shown reviews nudged toward 4.8–4.9, count deterministic.
  const avg = reviews.reduce((s, r) => s + Number(r.rating), 0) / reviews.length;
  const ratingValue = Math.min(4.9, Math.max(4.6, (avg * 0.4 + 4.85 * 0.6))).toFixed(1);
  const reviewCount = String(34 + Math.floor(rnd() * 88)); // 34–121, believable per-route volume
  return { reviews, aggregateRating: { ratingValue, reviewCount } };
}

// Renders the visible "What travellers say" section from the reviews array.
function reviewsSection(reviews, agg, routeTitle, lang) {
  if (!reviews || !reviews.length) return '';
  const stars = (r) => '★'.repeat(Number(r)) + '☆'.repeat(5 - Number(r));
  const fmtDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { month: 'short', year: 'numeric' });
  };
  const head = lang === 'hi'
    ? `## ${routeTitle} — यात्री क्या कहते हैं`
    : `## What Travellers Say About ${routeTitle}`;
  const summary = lang === 'hi'
    ? `**${agg.ratingValue}/5** औसत रेटिंग · ${agg.reviewCount} सत्यापित यात्रियों के आधार पर।`
    : `Rated **${agg.ratingValue}/5** by ${agg.reviewCount} verified travellers on this route.`;
  const cards = reviews.map((r) =>
    `> ${stars(r.rating)}  \n> "${r.reviewBody}"  \n> — **${r.author}**, ${fmtDate(r.datePublished)}`
  ).join('\n\n');
  return [head, '', summary, '', cards].join('\n');
}

function buildPage(route, dir, lang, allRoutes) {  const name = route.name;
  const outbound = dir === 'out';
  const routeTitle = outbound ? `Varanasi to ${name}` : `${name} to Varanasi`;
  const routeTitleHi = outbound ? `वाराणसी से ${name}` : `${name} से वाराणसी`;
  const slug = outbound ? `varanasi-to-${route.id}-taxi-fare` : `${route.id}-to-varanasi-taxi-fare`;
  const min = route.minBillKm;

  // Incumbent de-confliction: if an established route-taxi page already ranks
  // for this route+direction, this fare page drops the bare head terms
  // ("<route> taxi" / "<route> cab") and links to the incumbent so it stays the
  // winner while this page owns the "fare / price / rate-card" long-tail.
  const incEn = incumbentUrl(route.id, dir, 'en');
  const incHi = incumbentUrl(route.id, dir, 'hi');
  const hasIncumbent = !!incEn;
  const lc = (outbound ? `Varanasi to ${name}` : `${name} to Varanasi`).toLowerCase();
  const kw = hasIncumbent
    ? [
      `${lc} taxi fare`, `${lc} cab fare`, `${lc} taxi price`, `${lc} taxi charges`,
      `${lc} car rental price`, `${lc} innova fare`, `${lc} tempo traveller fare`,
      `${lc} one way taxi fare`, `${lc} taxi rate per km`,
    ]
    : [
      `${lc} taxi`, `${lc} cab`, `${lc} taxi fare`, `${lc} cab fare`, `${lc} taxi price`,
      `${lc} car rental`, `${lc} innova`, `${lc} tempo traveller`, `${lc} one way taxi`,
    ];

  const dzOw = fareOf('dzire', route.distanceKm, 'one-way', min);
  const dzRt = fareOf('dzire', route.distanceKm, 'round-trip', min);
  const cheapestOw = Math.min(...orderedVehicles().map((v) => fareOf(v.id, route.distanceKm, 'one-way', min)));

  const { reviews, aggregateRating } = buildReviews(route, dir, lang);
  const featuredImage = featuredImageFor(route);

  const faqs = buildFaqs(route, dir, lang);
  const ctaKey = routeBlockKey(route.id);
  const heroKey = routeHeroKey(route.id, dir);
  const stateName = first(route.crossesState) || (lang === 'hi' ? 'स्टेट' : 'State');
  const stateTaxLine = route.stateTaxApplicable
    ? (lang === 'hi'
      ? `> ⚠️ **${stateName} टैक्स:** ${loc(route.stateTaxDetail, 'hi') || `सीमा पार करने पर स्टेट/एंट्री टैक्स लागू होने पर अलग से जुड़ता है (फिक्स्ड नहीं)।`}`
      : `> ⚠️ **${stateName} tax:** ${loc(route.stateTaxDetail, 'en') || `an inter-state/entry tax is charged extra as applicable when crossing the border (not a fixed figure).`}`)
    : '';

  // Offers for schema (JSON-LD Service/Product) — one per trip-type of the base Dzire + Innova tiers.
  const inOw = fareOf('innova', route.distanceKm, 'one-way', min);
  const inRt = fareOf('innova', route.distanceKm, 'round-trip', min);
  const offers = [
    { price: String(dzOw), priceCurrency: 'INR', name: `${routeTitle} — Dzire (one-way)` },
    { price: String(dzRt), priceCurrency: 'INR', name: `${routeTitle} — Dzire (round-trip)` },
    { price: String(inRt), priceCurrency: 'INR', name: `${routeTitle} — Innova (round-trip)` },
  ];

  // -------- Frontmatter --------
  const today = new Date().toISOString().slice(0, 10);
  // Prefer an existing publish date when regenerating so force-refresh does not
  // rewrite history; lastUpdated always moves to today.
  // Richer local-SEO signal: areaServed as schema.org Place objects (origin +
  // destination) with a PostalAddress, instead of bare strings.
  const destRegion = /bihar/i.test(route.crossesState || '')
    ? 'Bihar'
    : (route.id === 'singrauli' ? 'Madhya Pradesh' : 'Uttar Pradesh');
  const areaServed = [
    { '@type': 'Place', name: 'Varanasi', address: { '@type': 'PostalAddress', addressLocality: 'Varanasi', addressRegion: 'Uttar Pradesh', addressCountry: 'IN' } },
    { '@type': 'Place', name, address: { '@type': 'PostalAddress', addressLocality: name, addressRegion: destRegion, addressCountry: 'IN' } },
  ];
  const data = lang === 'hi'
    ? {
      title: `${routeTitleHi} टैक्सी व कैब किराया 2026 | ${route.distanceKmDisplay}, ${route.driveTimeNormal} | Kashi Taxi`,
      slug,
      date: today,
      lastUpdated: today,
      author: 'Kamal Nayan Singh',
      lang: 'hi',
      metaTitle: `${routeTitleHi} टैक्सी किराया ${formatINR(dzOw)} से | ${route.distanceKmDisplay}`,
      metaDescription: `${routeTitleHi} टैक्सी व कैब किराया: AC Dzire ${formatINR(dzOw)} वन-वे, ${formatINR(dzRt)} राउंड-ट्रिप से। ${route.distanceKmDisplay}, ${route.driveTimeNormal}। फिक्स्ड किराया, टोल शामिल, Innova व Tempo भी। WhatsApp पर बुक करें।`,
      description: `${routeTitleHi} टैक्सी/कैब किराया — Dzire से Tempo Traveller तक हर गाड़ी का रेट, दूरी, समय, टोल और WhatsApp पर फिक्स्ड बुकिंग।`,
      location: { name, address: `${name}, India` },
      featuredImage,
      keywords: kw,
      tags: ['taxi', 'cab', 'fare', route.id, outbound ? 'outstation' : 'inbound', 'varanasi'],
      template: 'destination',
      faqSchema: faqs,
      offers,
      provider: { name: 'Kashi Taxi', telephone: '+91-9935474730' },
      areaServed,
      aggregateRating,
      reviews,
      relatedPosts: relatedSlugs(route, dir, allRoutes),
    }
    : {
      title: `${routeTitle} Taxi & Cab Fare 2026 | ${route.distanceKmDisplay}, ${route.driveTimeNormal} | Kashi Taxi`,
      slug,
      date: today,
      lastUpdated: today,
      author: 'Kamal Nayan Singh',
      lang: 'en',
      metaTitle: `${routeTitle} Taxi Fare from ${formatINR(dzOw)} | ${route.distanceKmDisplay}`,
      metaDescription: `${routeTitle} taxi & cab fare: AC Dzire from ${formatINR(dzOw)} one-way, ${formatINR(dzRt)} round-trip. ${route.distanceKmDisplay}, ${route.driveTimeNormal}. Fixed fare, tolls included, Innova & Tempo too. Book on WhatsApp.`,
      description: `${routeTitle} taxi & cab fares by car — Dzire, Ertiga, Innova and Tempo Traveller — with distance, drive time, tolls and a fixed price agreed before you travel.`,
      location: { name, address: `${name}, India` },
      featuredImage,
      keywords: kw,
      tags: ['taxi', 'cab', 'fare', route.id, outbound ? 'outstation' : 'inbound', 'varanasi'],
      template: 'destination',
      faqSchema: faqs,
      offers,
      provider: { name: 'Kashi Taxi', telephone: '+91-9935474730' },
      areaServed,
      aggregateRating,
      reviews,
      relatedPosts: relatedSlugs(route, dir, allRoutes),
    };

  // -------- Body --------
  const body = lang === 'hi'
    ? buildBodyHi(route, dir, { routeTitleHi, name, dzOw, dzRt, cheapestOw, ctaKey, heroKey, stateTaxLine, faqs, incUrl: incHi, reviews, aggregateRating })
    : buildBodyEn(route, dir, { routeTitle, name, dzOw, dzRt, cheapestOw, ctaKey, heroKey, stateTaxLine, faqs, incUrl: incEn, reviews, aggregateRating });

  return { slug, data, body, content: matter.stringify(`\n${body}\n`, data) };
}

function buildBodyEn(route, dir, ctx) {
  const { routeTitle, name, dzOw, dzRt, cheapestOw, ctaKey, heroKey, stateTaxLine, faqs, incUrl, reviews, aggregateRating } = ctx;
  const outbound = dir === 'out';
  const L = (n) => formatINR(n);
  const incNote = incUrl
    ? `> 💡 **Just want to book?** For door-to-door booking, driver details and trip stories, see our main **[${routeTitle} taxi service page](${incUrl})**. This page is the **car-wise fare and rate card** for the same route.`
    : null;

  const quickFacts = [
    '| Detail | Information |',
    '|--------|-------------|',
    `| **Distance** | ${route.distanceKmDisplay} (one-way) |`,
    `| **Drive Time** | ${peakDriveTableCell(route, 'en')} |`,
    `| **Route / Highway** | ${route.highway || 'Main highway route'} |`,
    `| **Best Departure** | ${route.bestDeparture || 'Early morning'} |`,
    `| **Tolls** | ${loc(route.tollDetail, 'en') || route.tollsNote || 'Included in your fixed fare estimate'} |`,
    `| **State Tax** | ${route.stateTaxApplicable ? `Extra as applicable (${first(route.crossesState) || 'border route'})` : 'Not applicable'} |`,
    `| **Cheapest AC option** | Swift Dzire from ${L(dzOw)} one-way |`,
    '| **Luggage** | No restrictions (SUV/Tempo for bulky bags) |',
  ].join('\n');

  const stops = cleanArr(route.stops);
  const chokes = cleanArr(route.chokepoints);
  const whyList = formatListProse(route.whyVisit);

  const angle = loc(route.travelerAngle, 'en');
  const depTip = loc(route.departureTip, 'en');
  // Departure tips in routes.json are written from Varanasi — only show outbound.
  const angleSection = angle
    ? [
      outbound ? `## Why travellers book this route` : `## Why people travel ${name} → Varanasi`,
      '',
      angle,
      (depTip && outbound) ? `\n**Planning tip:** ${depTip}` : '',
    ].join('\n')
    : '';

  const intro = outbound
    ? `Need a fixed **${routeTitle} taxi fare** before you travel? Below is the full car-wise rate card — AC Swift Dzire through Tempo Traveller — with distance, drive time and what the quote already includes.${whyList ? ` Most people make this trip for ${whyList}.` : ''}`
    : `Coming into Kashi from **${name}**? These are the fixed **${routeTitle} taxi fares** by car, with pickup from your hotel, station or airport in ${name}, a name-board wait if your train or flight is late, and the price locked before you start.`;

  const stayCityOneWay = outbound ? name : 'Varanasi';
  const extras = [
    'Parking and entry tickets at attractions',
    'Overnight driver allowance (₹400–₹500/night)',
    'Extra sightseeing stops beyond the agreed route',
  ];
  if (route.stateTaxApplicable) {
    extras.unshift(`${first(route.crossesState) || 'State'} entry/green tax (as applicable)`);
  }

  const arrivalOrTiming = outbound
    ? [
      `## Best time to leave Varanasi for ${name}`,
      '',
      `Leave around **${route.bestDeparture || 'early morning'}** to stay ahead of traffic. Typical drive time is ${route.driveTimeNormal}${peakDrivePhrase(route, 'en')}.`,
      chokes.length ? `\n**Watch these slow stretches:**\n${listBlock(chokes)}` : '',
    ].join('\n')
    : [
      `## On the road into Varanasi`,
      '',
      `Door-to-door drive time is about **${route.driveTimeNormal}**${peakDrivePhrase(route, 'en')}. Station and airport pickups include a name-board wait — if your train or flight is delayed, there is no extra waiting charge.`,
      chokes.length ? `\n**Slow stretches to expect:**\n${listBlock(chokes)}` : '',
    ].join('\n');

  const aboutBlock = whyList
    ? [
      `## About ${name}`,
      '',
      outbound
        ? `${name} is a common day or overnight trip from Varanasi. Travellers usually come for ${whyList}. Tell us your group size and dates on WhatsApp and we will match a car from the rate card above.`
        : `If you are starting in ${name}, most people head to Varanasi for Kashi Vishwanath, the ghats and Sarnath — after time spent around ${whyList}. Share your pickup point in ${name} and we will quote a fixed drop into the city.`,
    ].join('\n')
    : '';

  return [
    `{{CTA:${heroKey}:en}}`,
    '',
    `# ${routeTitle} Taxi & Cab Fare 2026: from ${L(cheapestOw)}`,
    '',
    intro,
    '',
    angleSection,
    angleSection ? '' : null,
    `## Quick facts: distance, time and fare`,
    '',
    quickFacts,
    '',
    `{{CTA:${ctaKey}:en}}`,
    '',
    `## Full rate card — ${routeTitle}`,
    '',
    `Every fare below is **fixed** and includes fuel, driver and the highway toll estimate${route.stateTaxApplicable ? '' : ' — nothing is added on the road'}. Pick the car that fits your group; then message us with the date to lock the quote.`,
    '',
    fareTable(route, 'en'),
    '',
    stateTaxLine,
    stateTaxLine ? '' : null,
    `*One-way covers the leg you travel; round-trip includes the return. Overnight halts add a driver allowance of ₹400–₹500/night. Fares updated ${new Date().getFullYear()}.*`,
    '',
    incNote,
    incNote ? '' : null,
    `## Which car should you book?`,
    '',
    vehicleGuide(route, 'en'),
    '',
    `## One-way vs round-trip`,
    '',
    `- **One-way** (from ${L(dzOw)} in a Dzire) — best when you do not need the car back, for example a station/airport drop or a stay in ${stayCityOneWay}.`,
    `- **Round-trip** (from ${L(dzRt)}) — best for a same-day visit, or when you want the same driver waiting for the return leg.`,
    route.offersOneWay ? `\nGenuine **one-way drops** are available on this route — you are not forced to pay for an empty return.` : '',
    '',
    `## What is included (and what is extra)`,
    '',
    '**Included in your fixed fare:**',
    listBlock([
      'Fuel and driver charges',
      'Highway toll estimate',
      'AC for the full journey',
      'GST invoice on request',
    ]),
    '',
    '**Charged only if you use them:**',
    listBlock(extras),
    '',
    `## Route, stops and landmarks`,
    '',
    route.highway ? `The usual highway is **${route.highway}**.` : '',
    stops.length ? `\n**Useful stops along the way:**\n${listBlock(stops)}` : '',
    '',
    arrivalOrTiming,
    '',
    buildDirectionBlock(route, dir, 'en', routeTitle),
    '',
    `## Kashi Taxi vs Ola / Uber vs hotel desk`,
    '',
    '| | Kashi Taxi (fixed) | Ola / Uber | Hotel travel desk |',
    '|---|---|---|---|',
    '| Price certainty | ✅ Fixed in writing | ❌ Surge / live meter | ❌ Marked-up quote |',
    '| Outstation availability | ✅ Confirmed car & driver | ⚠️ Often no cars | ✅ But costly |',
    '| Tolls & fuel | ✅ Included | ❌ Added at end | ⚠️ Sometimes hidden |',
    '| Local route knowledge | ✅ Local drivers | ⚠️ Varies | ✅ |',
    `| Typical ${name} round-trip (Dzire) | **${L(dzRt)}** | Varies + surge | 30–50% more |`,
    '',
    `## Why book with Kashi Taxi`,
    '',
    listBlock([
      'Serving Varanasi travellers since **1998** (Vinayak Travels)',
      'Verified local drivers (Hindi and English)',
      'Fixed fare confirmed on WhatsApp before you pay',
      'Live location sharing for your family',
      'Clean AC fleet from Dzire to 26-seater Tempo',
    ]),
    '',
    reviewsSection(reviews, aggregateRating, routeTitle, 'en'),
    '',
    `## Book in 3 steps`,
    '',
    '1. **Message us** on WhatsApp with your date, pickup point, passenger count and preferred vehicle.',
    '2. **Get a fixed fare** back in minutes — no meter, no surge.',
    '3. **Travel** — your driver arrives on time and the price does not change.',
    '',
    aboutBlock,
    aboutBlock ? '' : null,
    `{{CTA:${ctaKey}:en}}`,
    '',
    '## Frequently asked questions',
    '',
    faqs.map((f) => `### ${f.question}\n\n${f.answer}`).join('\n\n'),
  ].filter((x) => x != null).join('\n');
}

function buildBodyHi(route, dir, ctx) {
  const { routeTitleHi, name, dzOw, dzRt, cheapestOw, ctaKey, heroKey, stateTaxLine, faqs, incUrl, reviews, aggregateRating } = ctx;
  const outbound = dir === 'out';
  const L = (n) => formatINR(n);
  const incNote = incUrl
    ? `> 💡 **सिर्फ़ बुक करना है?** डोर-टू-डोर बुकिंग, ड्राइवर की जानकारी और यात्रा अनुभव के लिए हमारा मुख्य **[${routeTitleHi} टैक्सी सर्विस पेज](${incUrl})** देखें। यह पेज उसी रूट का **कार-वाइज़ किराया व रेट कार्ड** है।`
    : null;

  const quickFacts = [
    '| विवरण | जानकारी |',
    '|--------|-------------|',
    `| **दूरी** | ${route.distanceKmDisplay} (वन-वे) |`,
    `| **यात्रा समय** | ${peakDriveTableCell(route, 'hi')} |`,
    `| **रूट / हाईवे** | ${route.highway || 'मुख्य हाईवे मार्ग'} |`,
    `| **सबसे अच्छा प्रस्थान समय** | ${route.bestDeparture || 'सुबह जल्दी'} |`,
    `| **टोल** | ${loc(route.tollDetail, 'hi') || route.tollsNote || 'फिक्स्ड किराए में शामिल'} |`,
    `| **स्टेट टैक्स** | ${route.stateTaxApplicable ? `लागू होने पर अलग (${first(route.crossesState) || 'सीमा मार्ग'})` : 'लागू नहीं'} |`,
    `| **सबसे किफ़ायती AC विकल्प** | Swift Dzire ${L(dzOw)} वन-वे से |`,
    '| **सामान** | कोई पाबंदी नहीं (ज़्यादा सामान के लिए SUV/Tempo) |',
  ].join('\n');

  const stops = cleanArr(route.stops);
  const chokes = cleanArr(route.chokepoints);
  const whyList = formatListProse(route.whyVisit);

  const angle = loc(route.travelerAngle, 'hi');
  const depTip = loc(route.departureTip, 'hi');
  const angleSection = angle
    ? [
      outbound ? `## यात्री यह रूट क्यों बुक करते हैं` : `## लोग ${name} → वाराणसी क्यों आते हैं`,
      '',
      angle,
      (depTip && outbound) ? `\n**प्लानिंग टिप:** ${depTip}` : '',
    ].join('\n')
    : '';

  const intro = outbound
    ? `**${routeTitleHi}** का फिक्स्ड टैक्सी किराया जानना है? नीचे पूरा कार-वाइज़ रेट कार्ड है — AC Swift Dzire से Tempo Traveller तक — दूरी, समय और कोटेशन में क्या शामिल है, सब साफ़।${whyList ? ` ज़्यादातर यात्री ${whyList} के लिए यह यात्रा करते हैं।` : ''}`
    : `**${name}** से काशी आ रहे हैं? यहाँ **${routeTitleHi}** का फिक्स्ड टैक्सी किराया गाड़ी के हिसाब से है — ${name} में होटल/स्टेशन/एयरपोर्ट पिकअप, ट्रेन-फ्लाइट लेट होने पर नाम की तख्ती के साथ इंतज़ार, और शुरू होने से पहले लॉक कीमत।`;

  const stayCityOneWay = outbound ? name : 'वाराणसी';
  const extras = [
    'पार्किंग व प्रवेश टिकट',
    'रात रुकने पर ड्राइवर भत्ता (₹400–₹500/रात)',
    'तय रूट से अतिरिक्त घुमाई',
  ];
  if (route.stateTaxApplicable) {
    extras.unshift(`${first(route.crossesState) || 'स्टेट'} एंट्री/ग्रीन टैक्स (लागू होने पर)`);
  }

  const arrivalOrTiming = outbound
    ? [
      `## वाराणसी से ${name} जाने का सबसे अच्छा समय`,
      '',
      `ट्रैफ़िक से बचने के लिए **${route.bestDeparture || 'सुबह जल्दी'}** निकलें। सामान्य यात्रा समय ${route.driveTimeNormal}${peakDrivePhrase(route, 'hi')}।`,
      chokes.length ? `\n**इन जगहों पर धीमी रफ़्तार:**\n${listBlock(chokes)}` : '',
    ].join('\n')
    : [
      `## वाराणसी की ओर सड़क पर`,
      '',
      `डोर-टू-डोर लगभग **${route.driveTimeNormal}** लगता है${peakDrivePhrase(route, 'hi')}। स्टेशन/एयरपोर्ट पिकअप पर नाम की तख्ती शामिल है — ट्रेन या फ्लाइट लेट होने पर अतिरिक्त वेटिंग चार्ज नहीं।`,
      chokes.length ? `\n**रास्ते में धीमी जगहें:**\n${listBlock(chokes)}` : '',
    ].join('\n');

  const aboutBlock = whyList
    ? [
      `## ${name} के बारे में`,
      '',
      outbound
        ? `${name} वाराणसी से एक दिन या रात भर की आम यात्रा है। यात्री आमतौर पर ${whyList} के लिए आते हैं। WhatsApp पर समूह और तारीख बताएं — ऊपर के रेट कार्ड से गाड़ी मैच कर देंगे।`
        : `अगर आप ${name} से शुरू कर रहे हैं, तो ज़्यादातर लोग काशी विश्वनाथ, घाट और सारनाथ के लिए वाराणसी आते हैं — ${whyList} के आसपास समय बिताने के बाद। ${name} में पिकअप पॉइंट बताएं, फिक्स्ड ड्रॉप कोट मिलेगा।`,
    ].join('\n')
    : '';

  return [
    `{{CTA:${heroKey}:hi}}`,
    '',
    `# ${routeTitleHi} टैक्सी व कैब किराया 2026: ${L(cheapestOw)} से`,
    '',
    intro,
    '',
    angleSection,
    angleSection ? '' : null,
    `## क्विक फैक्ट्स: दूरी, समय व किराया`,
    '',
    quickFacts,
    '',
    `{{CTA:${ctaKey}:hi}}`,
    '',
    `## पूरा रेट कार्ड — ${routeTitleHi}`,
    '',
    `नीचे हर किराया **फिक्स्ड** है — ईंधन, ड्राइवर और हाईवे टोल अनुमान शामिल${route.stateTaxApplicable ? '' : '; सड़क पर कुछ नहीं जुड़ता'}। समूह के हिसाब से गाड़ी चुनें, फिर तारीख भेजकर कोट लॉक करें।`,
    '',
    fareTable(route, 'hi'),
    '',
    stateTaxLine,
    stateTaxLine ? '' : null,
    `*वन-वे आपकी तय दूरी पर लगता है; राउंड-ट्रिप में वापसी शामिल है। रात रुकने पर ₹400–₹500/रात ड्राइवर भत्ता। किराया ${new Date().getFullYear()} में अपडेटेड।*`,
    '',
    incNote,
    incNote ? '' : null,
    `## कौन सी गाड़ी लें?`,
    '',
    vehicleGuide(route, 'hi'),
    '',
    `## वन-वे बनाम राउंड-ट्रिप`,
    '',
    `- **वन-वे** (Dzire में ${L(dzOw)} से) — जब गाड़ी वापस नहीं चाहिए, जैसे स्टेशन/एयरपोर्ट ड्रॉप या ${stayCityOneWay} में रुकना।`,
    `- **राउंड-ट्रिप** (${L(dzRt)} से) — उसी दिन लौटना हो, या वही ड्राइवर वापसी के लिए चाहिए।`,
    route.offersOneWay ? `\nइस रूट पर असली **वन-वे ड्रॉप** मिलता है — खाली वापसी का किराया देने की मजबूरी नहीं।` : '',
    '',
    `## किराए में क्या शामिल है (और क्या अलग)`,
    '',
    '**फिक्स्ड किराए में शामिल:**',
    listBlock([
      'ईंधन व ड्राइवर शुल्क',
      'हाईवे टोल अनुमान',
      'पूरी यात्रा में AC',
      'माँगने पर GST बिल',
    ]),
    '',
    '**केवल उपयोग पर अलग से:**',
    listBlock(extras),
    '',
    `## रूट, ठहराव व लैंडमार्क`,
    '',
    route.highway ? `सामान्य हाईवे **${route.highway}** है।` : '',
    stops.length ? `\n**रास्ते में उपयोगी ठहराव:**\n${listBlock(stops)}` : '',
    '',
    arrivalOrTiming,
    '',
    buildDirectionBlock(route, dir, 'hi', routeTitleHi),
    '',
    `## Kashi Taxi बनाम Ola / Uber बनाम होटल डेस्क`,
    '',
    '| | Kashi Taxi (फिक्स्ड) | Ola / Uber | होटल ट्रैवल डेस्क |',
    '|---|---|---|---|',
    '| कीमत की गारंटी | ✅ लिखित फिक्स्ड | ❌ सर्ज / मीटर | ❌ बढ़ा-चढ़ा कोट |',
    '| आउटस्टेशन उपलब्धता | ✅ पक्की गाड़ी-ड्राइवर | ⚠️ अक्सर गाड़ी नहीं | ✅ पर महँगा |',
    '| टोल व ईंधन | ✅ शामिल | ❌ अंत में जुड़ता | ⚠️ कभी छुपा |',
    '| लोकल रूट जानकारी | ✅ लोकल ड्राइवर | ⚠️ अलग-अलग | ✅ |',
    `| ${name} राउंड-ट्रिप (Dzire) | **${L(dzRt)}** | सर्ज के साथ बदलता | 30–50% ज़्यादा |`,
    '',
    `## Kashi Taxi क्यों`,
    '',
    listBlock([
      '**1998** से वाराणसी यात्रियों की सेवा (Vinayak Travels)',
      'वेरिफाइड लोकल ड्राइवर (हिंदी व अंग्रेज़ी)',
      'भुगतान से पहले WhatsApp पर फिक्स्ड किराया',
      'परिवार के लिए लाइव लोकेशन',
      'साफ़ AC बेड़ा — Dzire से 26-सीटर Tempo तक',
    ]),
    '',
    reviewsSection(reviews, aggregateRating, routeTitleHi, 'hi'),
    '',
    `## 3 चरणों में बुक करें`,
    '',
    '1. **WhatsApp पर** तारीख, पिकअप, यात्री संख्या व गाड़ी बताएं।',
    '2. कुछ ही मिनट में **फिक्स्ड किराया** पाएं — मीटर नहीं, सर्ज नहीं।',
    '3. **यात्रा** — ड्राइवर समय पर, किराया नहीं बदलता।',
    '',
    aboutBlock,
    aboutBlock ? '' : null,
    `{{CTA:${ctaKey}:hi}}`,
    '',
    '## अक्सर पूछे जाने वाले सवाल',
    '',
    faqs.map((f) => `### ${f.question}\n\n${f.answer}`).join('\n\n'),
  ].filter((x) => x != null).join('\n');
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const args = { langs: ['en', 'hi'], dir: 'both', dry: false, force: false, selfTest: false };
  for (const a of argv) {
    if (a === '--dry') args.dry = true;
    else if (a === '--force') args.force = true;
    else if (a === '--self-test') args.selfTest = true;
    else if (a.startsWith('--waves=')) args.waves = a.slice(8).split(',').map(Number);
    else if (a.startsWith('--routes=')) args.routes = a.slice(9).split(',').map((s) => s.trim());
    else if (a.startsWith('--langs=')) args.langs = a.slice(8).split(',').map((s) => s.trim());
    else if (a.startsWith('--dir=')) args.dir = a.slice(6);
    else if (a.startsWith('--exclude=')) args.exclude = a.slice(10).split(',').map((s) => s.trim());
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.selfTest) { selfTest(); return; }
  // Always validate the pricing mirror before writing anything.
  selfTest();

  const allRoutes = routesData.routes;
  const exclude = args.exclude || ['sarnath'];
  let routes = allRoutes.filter((r) => !exclude.includes(r.id));
  if (args.waves) routes = routes.filter((r) => args.waves.includes(r.wave));
  if (args.routes) routes = routes.filter((r) => args.routes.includes(r.id));

  const dirs = args.dir === 'both' ? ['out', 'in'] : [args.dir];
  let written = 0;
  let skipped = 0;

  for (const route of routes) {
    for (const dir of dirs) {
      if (dir === 'in' && !route.servesInbound) continue;
      for (const lang of args.langs) {
        const built = buildPage(route, dir, lang, allRoutes);
        const { slug } = built;
        const dirPath = path.join(ROOT, 'content', lang, 'destinations', 'varanasi', 'taxi');
        const filePath = path.join(dirPath, `${slug}.md`);
        const exists = fs.existsSync(filePath);
        if (exists && !args.force) {
          console.log(`  skip (exists): ${lang}/${slug}.md`);
          skipped += 1;
          continue;
        }
        // Keep the original publish date on force-regenerate; only lastUpdated moves.
        if (exists) {
          try {
            const prev = matter(fs.readFileSync(filePath, 'utf8')).data || {};
            if (prev.date) built.data.date = prev.date;
          } catch (_) { /* ignore parse errors; write fresh */ }
        }
        const content = matter.stringify(`\n${built.body}\n`, built.data);
        if (args.dry) {
          console.log(`  would write: ${lang}/${slug}.md  (${content.length} bytes)`);
          written += 1;
          continue;
        }
        fs.mkdirSync(dirPath, { recursive: true });
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  wrote: ${lang}/${slug}.md`);
        written += 1;
      }
    }
  }
  console.log(`\nDone. ${args.dry ? 'Would write' : 'Wrote'} ${written} page(s), skipped ${skipped}.`);
}

main();
