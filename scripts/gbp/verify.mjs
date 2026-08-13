// Request a verification code for a listing.
//
//   node verify.mjs boat SMS
//   node verify.mjs locations/13606737182050512573 PHONE_CALL
//
// The code is delivered to the business phone. Redeem it with complete.mjs.
//
// Only run ONE verification at a time: every code goes to the same number and
// they are indistinguishable once they arrive.
//
// This endpoint is flaky - it returns 500/503 intermittently, and a failed
// response may STILL have registered the request. Always confirm with
// vlist.mjs before retrying, and stop as soon as one shows PENDING.

import { token, LOCATIONS } from './gbp.mjs';

const arg = process.argv[2];
const method = (process.argv[3] || 'SMS').toUpperCase();
const phone = process.argv[4] || '+91 99354 74730';

if (!arg) {
  console.error('Usage: node verify.mjs <locationId|key> [SMS|PHONE_CALL|AUTO|EMAIL] [phone]');
  console.error('Keys:', Object.keys(LOCATIONS).join(', '));
  process.exit(1);
}
const loc = LOCATIONS[arg] || arg;

const accessToken = await token();
const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

const body = {
  method,
  languageCode: 'en',
  context: {
    address: {
      regionCode: 'IN',
      languageCode: 'en',
      postalCode: '221010',
      administrativeArea: 'Uttar Pradesh',
      locality: 'Varanasi',
      addressLines: ['L10/125 Shastri Nagar, Sigra'],
    },
  },
};
if (method === 'SMS' || method === 'PHONE_CALL') body.phoneNumber = phone;

const res = await fetch(`https://mybusinessverifications.googleapis.com/v1/${loc}:verify`, {
  method: 'POST',
  headers,
  body: JSON.stringify(body),
});
console.log(method, res.status, JSON.stringify(await res.json(), null, 1));

const state = await fetch(
  `https://mybusinessverifications.googleapis.com/v1/${loc}/VoiceOfMerchantState`,
  { headers: { Authorization: `Bearer ${accessToken}` } }
).then((r) => r.json());
console.log('VoM now:', JSON.stringify(state));
