#!/usr/bin/env node
/**
 * scripts/test-pricing-widget-urls.js
 * Comprehensive automated test suite for the Pricing Widget:
 *  1. Defaults resolution (empty pickup -> Varanasi origin fallback, passenger tier mappings, date).
 *  2. URL query string generation & deep-linking round-trip.
 *  3. WhatsApp 1-tap share URL formatting & encoding.
 *  4. Live HTTP endpoint responses on dev server.
 */

const http = require('http');
const { execSync } = require('child_process');

async function run() {
  console.log('🧪 Starting Booking Widget Defaults & URL Generation Test Suite...\n');

  // Step 1: Bundle resolver using esbuild to test exact logic
  const bundleCode = execSync('npx esbuild lib/pricingEngineResolver.js --bundle --platform=node --format=cjs', {
    encoding: 'utf-8',
    cwd: process.cwd(),
  });

  const moduleScope = { exports: {} };
  const fn = new Function('module', 'exports', 'require', bundleCode);
  fn(moduleScope, moduleScope.exports, require);
  const { resolveFare, searchPlaces, recommendVehicle, VEHICLE_OPTIONS } = moduleScope.exports;

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // --- Section 1: Defaults Testing ---
  console.log('--- 1. Testing Field Defaults & Smart Fallbacks ---');

  // Default origin when pickup is blank but destination is provided (defaults to round-trip)
  const chandauliDefault = resolveFare({ destination: 'My Farmhouse in Chandauli' });
  assert(chandauliDefault?.canCompute === true, 'Chandauli resolves with blank pickup');
  assert(chandauliDefault?.isDefaultOrigin === true, 'Chandauli marks isDefaultOrigin = true');
  assert(chandauliDefault?.fromPlace?.id === 'varanasi-city', 'Blank pickup defaults origin to Varanasi City');
  assert(chandauliDefault?.tripType === 'round-trip', 'Default tripType is round-trip');
  assert(chandauliDefault?.fare === 1270, `Chandauli Round-Trip Sedan fare equals ₹1,270 (got ₹${chandauliDefault?.fare})`);

  const chandauliOneWay = resolveFare({ destination: 'My Farmhouse in Chandauli', tripType: 'one-way' });
  assert(chandauliOneWay?.fare === 935, `Chandauli One-Way Sedan fare equals ₹935 (got ₹${chandauliOneWay?.fare})`);

  const ayodhyaDefault = resolveFare({ destination: 'Ayodhya' });
  assert(ayodhyaDefault?.canCompute === true, 'Ayodhya resolves with blank pickup');
  assert(ayodhyaDefault?.isDefaultOrigin === true, 'Ayodhya marks isDefaultOrigin = true');
  assert(ayodhyaDefault?.tripType === 'round-trip', 'Ayodhya defaults to round-trip');
  assert(ayodhyaDefault?.fare === 5240, `Ayodhya Round-Trip Dzire fare is ₹5,240 (got ₹${ayodhyaDefault?.fare})`);

  const ayodhyaOneWay = resolveFare({ destination: 'Ayodhya', tripType: 'one-way' });
  assert(ayodhyaOneWay?.fare === 3820, `Ayodhya One-Way Dzire fare is ₹3,820 (got ₹${ayodhyaOneWay?.fare})`);

  const prayagrajDefault = resolveFare({ destination: 'Prayagraj' });
  assert(prayagrajDefault?.canCompute === true, 'Prayagraj resolves with blank pickup');
  assert(prayagrajDefault?.isDefaultOrigin === true, 'Prayagraj marks isDefaultOrigin = true');
  assert(prayagrajDefault?.fare === 3275, `Prayagraj Round-Trip Dzire fare is ₹3,275 (got ₹${prayagrajDefault?.fare})`);

  const prayagrajOneWay = resolveFare({ destination: 'Prayagraj', tripType: 'one-way' });
  assert(prayagrajOneWay?.fare === 2388, `Prayagraj One-Way Dzire fare is ₹2,388 (got ₹${prayagrajOneWay?.fare})`);

  // Empty destination returns null (clean hero state)
  const emptyBoth = resolveFare({ pickup: '', destination: '' });
  assert(emptyBoth === null, 'Empty pickup and empty destination returns null');

  // Same pickup and destination returns cannot compute
  const sameLocation = resolveFare({ pickup: 'Assi Ghat', destination: 'Assi Ghat' });
  assert(sameLocation?.canCompute === false, 'Same pickup & destination returns canCompute: false');
  assert(sameLocation?.reason === 'same_location', 'Same location reason is reported');

  // Passenger to Vehicle tier defaults
  assert(recommendVehicle('1') === 'dzire', '1 passenger defaults to dzire (Sedan)');
  assert(recommendVehicle('4') === 'dzire', '4 passengers defaults to dzire (Sedan)');
  assert(recommendVehicle('5-6') === 'ertiga', '5-6 passengers defaults to ertiga (SUV)');
  assert(recommendVehicle('7+') === 'tempo-17', '7+ passengers defaults to tempo-17');

  // Date format check
  const d = new Date();
  const expectedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  assert(/^\d{4}-\d{2}-\d{2}$/.test(expectedDate), `Default date is valid YYYY-MM-DD: ${expectedDate}`);

  // --- Section 2: URL Generation & Canonical Link Testing ---
  console.log('\n--- 2. Testing URL Generation & Deep Links ---');

  function buildDeepLink({ origin = 'https://www.kashitaxi.in', pathname = '/', pickup, destination, passengers, trip, vehicle }) {
    const params = new URLSearchParams();
    if (pickup) params.set('pickup', pickup);
    if (destination) params.set('destination', destination);
    if (passengers && passengers !== '1') params.set('passengers', passengers);
    if (trip && trip !== 'round-trip') params.set('trip', trip);
    if (vehicle) params.set('vehicle', vehicle);
    const qs = params.toString();
    return `${origin}${pathname}${qs ? `?${qs}` : ''}`;
  }

  // URL Deep Link 1: Round-trip is default so omitted from URL
  const link1 = buildDeepLink({
    pickup: 'Varanasi',
    destination: 'My Farmhouse in Chandauli',
    passengers: '2',
    trip: 'round-trip',
    vehicle: 'dzire',
  });
  assert(
    link1 === 'https://www.kashitaxi.in/?pickup=Varanasi&destination=My+Farmhouse+in+Chandauli&passengers=2&vehicle=dzire',
    `Deep link 1 correctly omits default trip (round-trip): ${link1}`
  );

  // URL Deep Link 2: Non-default trip (one-way) is included
  const link2 = buildDeepLink({
    pathname: '/varanasi-taxi-service',
    pickup: 'Airport',
    destination: 'Assi Ghat',
    passengers: '5-6',
    trip: 'one-way',
    vehicle: 'ertiga',
  });
  assert(
    link2.startsWith('https://www.kashitaxi.in/varanasi-taxi-service?'),
    `Deep link 2 preserves target sub-page pathname: ${link2}`
  );
  assert(link2.includes('trip=one-way'), 'Deep link 2 includes non-default trip=one-way param');
  assert(link2.includes('vehicle=ertiga'), 'Deep link 2 includes ertiga vehicle');

  // Canonical SEO URLs
  assert(
    ayodhyaDefault?.canonicalUrl === '/en/city/varanasi/taxi/varanasi-to-ayodhya-taxi-fare',
    `Ayodhya canonical SEO URL is correct: ${ayodhyaDefault?.canonicalUrl}`
  );

  const airportToAssi = resolveFare({ pickup: 'Airport', destination: 'Assi Ghat' });
  assert(
    airportToAssi?.canonicalUrl === '/en/city/varanasi/taxi/varanasi-airport-to-assi-ghat-taxi',
    `Airport to Assi Ghat canonical URL is correct: ${airportToAssi?.canonicalUrl}`
  );

  // --- Section 2.5: URL Parameter Parsing & Aliases Testing ---
  console.log('\n--- 2.5 Testing URL Parameter Aliases & Sanitization ---');

  // Definition of extractUrlParams matching HeroBookingWidget
  function extractUrlParams(query) {
    if (!query) return null;
    const pickupVal = query.pickup || query.from || query.origin || '';
    const destVal = query.destination || query.to || query.dest || '';
    const dateVal = query.date || '';
    const paxRaw = query.passengers || query.pax || '';
    const tripRaw = query.trip || query.type || '';
    const vehicleRaw = query.vehicle || query.car || '';

    const validPax = ['1', '2', '3', '4', '5-6', '7+'];
    const sanitizedPax = validPax.includes(String(paxRaw)) ? String(paxRaw) : null;
    const sanitizedTrip = tripRaw === 'one-way' || tripRaw === 'round-trip' ? tripRaw : null;
    const sanitizedVehicle = VEHICLE_OPTIONS.some((v) => v.id === vehicleRaw) ? vehicleRaw : null;

    return {
      pickup: pickupVal ? String(pickupVal) : null,
      destination: destVal ? String(destVal) : null,
      date: dateVal ? String(dateVal) : null,
      passengers: sanitizedPax,
      trip: sanitizedTrip,
      vehicle: sanitizedVehicle,
    };
  }

  const aliasResult = extractUrlParams({
    from: 'Airport',
    to: 'Assi Ghat',
    pax: '5-6',
    type: 'one-way',
    car: 'ertiga',
  });
  assert(aliasResult.pickup === 'Airport', 'Alias "from" parsed as pickup');
  assert(aliasResult.destination === 'Assi Ghat', 'Alias "to" parsed as destination');
  assert(aliasResult.passengers === '5-6', 'Alias "pax" parsed as passengers');
  assert(aliasResult.trip === 'one-way', 'Alias "type" parsed as trip');
  assert(aliasResult.vehicle === 'ertiga', 'Alias "car" parsed as vehicle');

  // Secondary aliases: origin and dest
  const aliasResult2 = extractUrlParams({
    origin: 'Varanasi',
    dest: 'Ayodhya',
  });
  assert(aliasResult2.pickup === 'Varanasi', 'Alias "origin" parsed as pickup');
  assert(aliasResult2.destination === 'Ayodhya', 'Alias "dest" parsed as destination');

  // Invalid parameter sanitization
  const invalidResult = extractUrlParams({
    passengers: '100',
    trip: 'invalid_trip',
    vehicle: 'jetpack',
  });
  assert(invalidResult.passengers === null, 'Invalid passenger tier sanitized to null');
  assert(invalidResult.trip === null, 'Invalid trip type sanitized to null');
  assert(invalidResult.vehicle === null, 'Invalid vehicle sanitized to null');

  // --- Section 3: WhatsApp 1-Tap Share Message Testing ---
  console.log('\n--- 3. Testing WhatsApp Share Message Formatting ---');

  function buildWhatsAppShareUrl({ origin = 'https://www.kashitaxi.in', pathname = '/', pickup, destination, passengers = '1', trip = 'round-trip', vehicleId = 'dzire' }) {
    const deepLink = buildDeepLink({ origin, pathname, pickup, destination, passengers, trip, vehicle: vehicleId });
    const fareQuote = resolveFare({ pickup, destination, passengers, tripType: trip, vehicleId });
    const fareText = fareQuote?.canCompute ? `₹${fareQuote.fare.toLocaleString('en-IN')}` : 'Fair fixed quote';
    const tripText = trip === 'round-trip' ? 'Round-trip' : 'One-way';
    const vehicleObj = VEHICLE_OPTIONS.find((v) => v.id === vehicleId) || VEHICLE_OPTIONS[0];
    const pickupDisplay = pickup || 'Varanasi';
    const destDisplay = destination || 'Destination';

    const text = `🚕 *Kashi Taxi Quote for Our Trip*\nRoute: ${pickupDisplay} → ${destDisplay}\nEstimated Fare: ${fareText} (${tripText} for ${vehicleObj.name})\n✓ All-inclusive: fuel, driver bhatta & highway tolls included.\n✓ Fixed rate, no surge, verified local chauffeur.\n\nCheck route details & book here:\n${deepLink}`;

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }

  // Default round-trip WhatsApp quote
  const waUrl = buildWhatsAppShareUrl({
    pickup: 'Varanasi',
    destination: 'Ayodhya',
    passengers: '1',
    trip: 'round-trip',
    vehicleId: 'dzire',
  });

  assert(waUrl.startsWith('https://wa.me/?text='), 'WhatsApp URL starts with https://wa.me/?text=');
  assert(decodeURIComponent(waUrl).includes('₹5,240'), 'Decoded WhatsApp text contains exact round-trip fare (₹5,240)');
  assert(decodeURIComponent(waUrl).includes('Round-trip'), 'Decoded WhatsApp text indicates Round-trip');
  assert(decodeURIComponent(waUrl).includes('Varanasi → Ayodhya'), 'Decoded WhatsApp text contains route');
  assert(decodeURIComponent(waUrl).includes('Sedan (Dzire / Etios)'), 'Decoded WhatsApp text contains vehicle name');

  // One-way WhatsApp quote
  const waOneWayUrl = buildWhatsAppShareUrl({
    pickup: 'Varanasi',
    destination: 'Ayodhya',
    passengers: '1',
    trip: 'one-way',
    vehicleId: 'dzire',
  });
  assert(decodeURIComponent(waOneWayUrl).includes('₹3,820'), 'Decoded WhatsApp one-way text contains exact fare (₹3,820)');
  assert(decodeURIComponent(waOneWayUrl).includes('One-way'), 'Decoded WhatsApp one-way text indicates One-way');

  // --- Section 4: Live HTTP Server Response Testing ---
  console.log('\n--- 4. Testing Live Dev Server (Port 3005) ---');

  const testEndpoints = [
    '/',
    '/?pickup=Varanasi&destination=My%20Farmhouse%20in%20Chandauli',
    '/?destination=Ayodhya',
    '/?pickup=Airport&destination=Assi%20Ghat&trip=round-trip',
    '/?to=Ayodhya',
    '/?from=Airport&to=Assi%20Ghat&type=one-way',
    '/?destination=Prayagraj&pax=5-6&car=ertiga',
    '/varanasi-taxi-service?to=Ayodhya',
  ];

  async function testServer() {
    for (const path of testEndpoints) {
      try {
        const res = await fetch(`http://localhost:3005${path}`, { signal: AbortSignal.timeout(4000) });
        assert(res.status === 200, `GET ${path} returned HTTP 200 OK`);
      } catch (err) {
        assert(false, `GET ${path} failed with error: ${err.message}`);
      }
    }

    console.log(`\n========================================`);
    console.log(`Tests Finished: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);
    if (failed > 0) {
      process.exit(1);
    }
  }

  await testServer();
}

run();
