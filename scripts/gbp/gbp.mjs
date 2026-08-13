// Shared auth + constants for the Google Business Profile scripts.
//
// Credentials and node_modules both live in the sibling content-pipeline
// project, so this module resolves them by absolute path. That lets these
// scripts run from anywhere without duplicating secrets into this repo.
//
// See docs/GOOGLE-BUSINESS-PROFILE.md for usage.

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PIPELINE = process.env.CONTENT_PIPELINE_DIR
  || path.resolve(HERE, '../../../seo_tools/content-pipeline');

const require = createRequire(path.join(PIPELINE, 'package.json'));

let dotenv, CryptoJS, mongoose;
try {
  dotenv = require('dotenv');
  CryptoJS = require('crypto-js');
  mongoose = require('mongoose');
} catch (err) {
  console.error(
    `Could not load dependencies from ${PIPELINE}.\n` +
    'Run `npm install` there, or set CONTENT_PIPELINE_DIR to its location.'
  );
  throw err;
}

dotenv.config({ path: path.join(PIPELINE, '.env') });

export const ACC = 'accounts/108260916532676950345';

export const LOCATIONS = {
  taxi: 'locations/212769643918733473',        // Vinayak Travels (new, SMS-verified)
  bike: 'locations/17026451353868543962',      // Kashi Bike Rentals (auto-verified)
  boat: 'locations/13583163067120340957',      // Kashi Boat Rides
  tempo: 'locations/13606737182050512573',     // Kashi Tempo Traveller
  taxiOld: 'locations/16805355982216334281',   // Kashi Taxi (suspended, 192 reviews)
};

// Back-compat aliases used by the older scripts.
export const TAXI = LOCATIONS.taxiOld;
export const BIKE = LOCATIONS.bike;

// Tokens were encrypted before ENCRYPTION_KEY was configured, so fall back to
// the legacy default key. See docs/GOOGLE-BUSINESS-PROFILE.md section 4.
function decrypt(ciphertext) {
  for (const key of [process.env.ENCRYPTION_KEY, 'default-key-change-me']) {
    if (!key) continue;
    try {
      const plaintext = CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);
      if (plaintext) return plaintext;
    } catch {
      // try the next key
    }
  }
  throw new Error('Could not decrypt the stored refresh token.');
}

/** Mint a short-lived access token from the refresh token stored in MongoDB. */
export async function token() {
  if (!process.env.MONGODB_URI) {
    throw new Error(`MONGODB_URI not set. Expected it in ${path.join(PIPELINE, '.env')}`);
  }

  let channel;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    channel = await mongoose.connection.db.collection('channels').findOne({ name: 'gmb' });
  } finally {
    await mongoose.disconnect().catch(() => {});
  }

  if (!channel?.credentials?.refreshToken) {
    throw new Error('No stored GMB refresh token. Re-authorise - see docs/GOOGLE-BUSINESS-PROFILE.md section 4.');
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: decrypt(channel.credentials.refreshToken),
      grant_type: 'refresh_token',
    }),
  });

  const body = await res.json();
  if (!body.access_token) {
    throw new Error(
      body.error === 'invalid_grant'
        ? 'Refresh token revoked. Re-authorise as abhinavpandey.1996@gmail.com - see docs/GOOGLE-BUSINESS-PROFILE.md section 4.'
        : `Token request failed: ${JSON.stringify(body)}`
    );
  }
  return body.access_token;
}
