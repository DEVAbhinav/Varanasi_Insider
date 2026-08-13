// Health check for every Google Business Profile listing on the account.
//
//   node audit.mjs
//
// "live=true" means the listing has Voice of Merchant and is visible to
// customers in Maps and Search. Anything else is invisible, whatever the
// dashboard shows.

import { token, ACC } from './gbp.mjs';

const accessToken = await token();
const headers = { Authorization: `Bearer ${accessToken}` };

const readMask = 'name,title,categories,phoneNumbers,serviceItems,websiteUri';
const res = await fetch(
  `https://mybusinessbusinessinformation.googleapis.com/v1/${ACC}/locations?readMask=${readMask}&pageSize=100`,
  { headers }
);
const { locations = [], error } = await res.json();
if (error) {
  console.error('Failed to list locations:', error.message);
  process.exit(1);
}

const pad = (v, n) => String(v ?? '').padEnd(n);

for (const loc of locations) {
  const state = await fetch(
    `https://mybusinessverifications.googleapis.com/v1/${loc.name}/VoiceOfMerchantState`,
    { headers }
  ).then((r) => r.json());

  console.log(
    [
      pad(loc.title, 24),
      pad(loc.name.replace('locations/', ''), 21),
      `live=${pad(!!state.hasVoiceOfMerchant, 5)}`,
      `pending=${pad(!!state.verify?.hasPendingVerification, 5)}`,
      `cat=${pad(loc.categories?.primaryCategory?.displayName || '-', 22)}`,
      `svcs=${pad((loc.serviceItems || []).length, 3)}`,
      loc.phoneNumbers?.primaryPhone || '',
    ].join(' ')
  );
}
