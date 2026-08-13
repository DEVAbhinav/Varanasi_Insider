// config/business.js
// Single authoritative source of truth for the business identity used across
// UI and structured data (JSON-LD). Update values here only — do not hard-code
// name, address, ratings, or founding details anywhere else.
//
// NOTE ON REVIEW COUNT: `REVIEW_COUNT` reflects the customer-facing Google
// review count. It should be kept in sync with the live Google Business Profile
// (https://maps.app.goo.gl/gbmqXgHE8Nzq5NrbA). Do not inflate this number.

import { CONTACT } from '@/lib/contact';
import { SOCIAL_PROFILE_URLS, SOCIAL_PROFILE_HANDLES } from './socials';

const SITE_URL = 'https://www.kashitaxi.in';

// Brand + legal entity
const BRAND_NAME = 'Kashi Taxi';
const LEGAL_NAME = 'Vinayak Travels';
const LEGAL_NAME_FULL = 'Vinayak Travels Tour';
const OPERATED_BY = `${BRAND_NAME}, operated by ${LEGAL_NAME}`;

// Founding
const FOUNDING_YEAR = 1982;
const FOUNDING_DATE = String(FOUNDING_YEAR);
const yearsInService = () => new Date().getFullYear() - FOUNDING_YEAR;

// Contact
const EMAIL = 'sudhir.vinayaktravels@gmail.com';

// Registered address (Sigra, Varanasi)
const ADDRESS = Object.freeze({
  streetAddress: 'L 10/125, Shastri Nagar, Sigra',
  addressLocality: 'Varanasi',
  addressRegion: 'Uttar Pradesh',
  postalCode: '221010',
  addressCountry: 'IN',
});

const ADDRESS_DISPLAY = 'L 10/125, Shastri Nagar (near IP Mall), Sigra, Varanasi – 221010';

// Coordinates (matches the Google Business Profile map pin)
const GEO = Object.freeze({
  latitude: 25.315282,
  longitude: 82.989593,
});

// Reviews / rating (Google Business Profile)
const RATING = 4.8;
const REVIEW_COUNT = 191;
const PLACE_ID = 'ChIJFf7XW_wtjjkRL_xW7xSLBtI';
const MAPS_URL = 'https://maps.app.goo.gl/gbmqXgHE8Nzq5NrbA';

const LOGO_URL = 'https://res.cloudinary.com/dkntlqbwr/image/upload/kashitaxi/kashitaxi/logo.jpeg';

export const BUSINESS = Object.freeze({
  siteUrl: SITE_URL,

  brandName: BRAND_NAME,
  legalName: LEGAL_NAME,
  legalNameFull: LEGAL_NAME_FULL,
  operatedBy: OPERATED_BY,

  foundingYear: FOUNDING_YEAR,
  foundingDate: FOUNDING_DATE,
  yearsInService,

  email: EMAIL,
  phone: CONTACT,

  address: ADDRESS,
  addressDisplay: ADDRESS_DISPLAY,
  geo: GEO,

  rating: RATING,
  reviewCount: REVIEW_COUNT,
  placeId: PLACE_ID,
  mapsUrl: MAPS_URL,

  logo: LOGO_URL,
  socials: SOCIAL_PROFILE_URLS,
  socialHandles: SOCIAL_PROFILE_HANDLES,
});

export default BUSINESS;
