// Show verification state and the methods Google will accept for a listing.
//
//   node vom.mjs locations/13583163067120340957
//   node vom.mjs boat            # shorthand key from LOCATIONS
//
// An EMPTY options list is the signature of a suspended listing - Google
// offers no way to verify it. Use the Appeals tool instead.
// See docs/GOOGLE-BUSINESS-PROFILE.md section 3.

import { token, LOCATIONS } from './gbp.mjs';

const args = process.argv.slice(2);
if (!args.length) {
  console.error('Usage: node vom.mjs <locationId|key> [...]');
  console.error('Keys:', Object.keys(LOCATIONS).join(', '));
  process.exit(1);
}

const accessToken = await token();
const headers = { Authorization: `Bearer ${accessToken}` };

// Registered office, used as verification context for service-area listings.
const context = {
  address: {
    regionCode: 'IN',
    languageCode: 'en',
    postalCode: '221010',
    administrativeArea: 'Uttar Pradesh',
    locality: 'Varanasi',
    addressLines: ['L10/125 Shastri Nagar, Sigra'],
  },
};

for (const arg of args) {
  const loc = LOCATIONS[arg] || arg;

  const state = await fetch(
    `https://mybusinessverifications.googleapis.com/v1/${loc}/VoiceOfMerchantState`,
    { headers }
  ).then((r) => r.json());
  console.log(loc, 'VoM:', JSON.stringify(state));

  const options = await fetch(
    `https://mybusinessverifications.googleapis.com/v1/${loc}:fetchVerificationOptions`,
    {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ languageCode: 'en', context }),
    }
  ).then((r) => r.json());
  console.log('  options:', JSON.stringify(options));
}
