// Set the contact / social attributes that drive clicks and calls.
//
//   node attrset.mjs boat
//   node attrset.mjs tempo 919935474730 https://www.kashitaxi.in/booking
//
// Two things the API docs do not make obvious:
//   1. The query parameter is `attributeMask`, NOT `updateMask`. Using the
//      latter produces a misleading "Unknown name updateMask" error.
//   2. Mask values must be full resource names (attributes/url_whatsapp),
//      not bare names (url_whatsapp).
//
// Available attributes vary by category. `has_onsite_services` is rejected for
// service-area businesses, for example. Query the attributes endpoint with a
// categoryName to see what a given category supports.

import { token, LOCATIONS } from './gbp.mjs';

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: node attrset.mjs <locationId|key> [whatsappNumber] [bookingUrl]');
  console.error('Keys:', Object.keys(LOCATIONS).join(', '));
  process.exit(1);
}
const loc = LOCATIONS[arg] || arg;
const whatsapp = process.argv[3] || '919935474730';
const bookingUrl = process.argv[4] || 'https://www.kashitaxi.in/booking';

const attributes = [
  { name: 'attributes/url_whatsapp', uriValues: [{ uri: `https://wa.me/${whatsapp}` }] },
  { name: 'attributes/url_appointment', uriValues: [{ uri: bookingUrl }] },
  { name: 'attributes/url_instagram', uriValues: [{ uri: 'https://www.instagram.com/kashitaxi' }] },
  { name: 'attributes/url_facebook', uriValues: [{ uri: 'https://www.facebook.com/kashitaxi' }] },
];

const accessToken = await token();
const mask = attributes.map((a) => a.name).join(',');

const res = await fetch(
  `https://mybusinessbusinessinformation.googleapis.com/v1/${loc}/attributes?attributeMask=${encodeURIComponent(mask)}`,
  {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: `${loc}/attributes`, attributes }),
  }
);

const body = await res.json();
if (body.error) {
  console.error(loc, 'failed:', res.status, JSON.stringify(body.error.details || body.error.message));
  process.exit(1);
}
const live = (body.attributes || []).map((a) => a.name.replace('attributes/', ''));
console.log(loc, `${live.length} attributes live ->`, live.join(', '));
