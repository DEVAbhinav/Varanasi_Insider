// List the verification history for a listing, including anything PENDING.
//
//   node vlist.mjs locations/13583163067120340957
//   node vlist.mjs boat

import { token, LOCATIONS } from './gbp.mjs';

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: node vlist.mjs <locationId|key>');
  console.error('Keys:', Object.keys(LOCATIONS).join(', '));
  process.exit(1);
}
const loc = LOCATIONS[arg] || arg;

const accessToken = await token();
const headers = { Authorization: `Bearer ${accessToken}` };

const res = await fetch(
  `https://mybusinessverifications.googleapis.com/v1/${loc}/verifications`,
  { headers }
);
console.log('verifications', res.status, JSON.stringify(await res.json(), null, 1));

const state = await fetch(
  `https://mybusinessverifications.googleapis.com/v1/${loc}/VoiceOfMerchantState`,
  { headers }
).then((r) => r.json());
console.log('VoM:', JSON.stringify(state, null, 1));
