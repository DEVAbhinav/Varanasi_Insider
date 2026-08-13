// Redeem the code that Google sent, completing a pending verification.
//
//   node complete.mjs boat 123456
//   node complete.mjs locations/13583163067120340957 123456
//
// Note the request field is `pin`, not `verificationCode` - the latter is
// rejected with a confusing "Cannot find field" error.
//
// On success the listing moves to hasBusinessAuthority=true and then
// waitForVoiceOfMerchant while Google processes it. Going fully live can take
// anywhere from a few hours to a couple of days.

import { token, LOCATIONS } from './gbp.mjs';

const arg = process.argv[2];
const pin = process.argv[3];
if (!arg || !pin) {
  console.error('Usage: node complete.mjs <locationId|key> <code>');
  console.error('Keys:', Object.keys(LOCATIONS).join(', '));
  process.exit(1);
}
const loc = LOCATIONS[arg] || arg;

const accessToken = await token();
const headers = { Authorization: `Bearer ${accessToken}` };

const list = await fetch(
  `https://mybusinessverifications.googleapis.com/v1/${loc}/verifications`,
  { headers }
).then((r) => r.json());

const pending = (list.verifications || []).find((v) => v.state === 'PENDING');
if (!pending) {
  console.log('No pending verification. Current state:', JSON.stringify(list));
  console.log('Request one first: node verify.mjs', arg, 'SMS');
  process.exit(0);
}

const res = await fetch(
  `https://mybusinessverifications.googleapis.com/v1/${pending.name}:complete`,
  {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  }
);
console.log('complete:', res.status, JSON.stringify(await res.json()));

const state = await fetch(
  `https://mybusinessverifications.googleapis.com/v1/${loc}/VoiceOfMerchantState`,
  { headers }
).then((r) => r.json());
console.log('VoM now:', JSON.stringify(state));
