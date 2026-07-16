// lib/commercialPageData.js
// Keystone of the ordering system: a Zod-validated parser that reads the
// `commerce` frontmatter block (see plan.md §18) and returns ONE normalized,
// typed object consumed by the UI, the JSON-LD schema, and the enquiry payload.
//
// Design rules:
//  - Opt-in: if a page has no `commerce` block, getCommerceData() returns null
//    and the page renders exactly as before (zero risk to existing pages).
//  - Fail loud: if a `commerce` block IS present but invalid, parsing throws.
//    This runs inside getStaticProps, so a bad block fails the build (CI gate).
//  - Single source: prices/inclusions/rating all come from here, never
//    hardcoded in components.

import { z } from 'zod';
import { PRODUCT_TYPES, getProductTypeConfig } from './productTypes';

const stringNumber = z
  .union([z.string(), z.number()])
  .transform((v) => String(v).trim())
  .refine((v) => v === '' || !Number.isNaN(Number(v.replace(/[,₹\s]/g, ''))), {
    message: 'must be a numeric string',
  });

const offerSchema = z.object({
  name: z.string().min(1),
  price: stringNumber,
  priceCurrency: z.string().default('INR'),
  priceUnit: z.string().optional(),
  priceType: z.enum(['fixed', 'from', 'range']).default('from'),
  priceMax: stringNumber.optional(),
  listPrice: stringNumber.optional(),
  priceIncludes: z.array(z.string()).default([]),
  priceExcludes: z.array(z.string()).default([]),
  priceAssumptions: z.string().optional(),
  priceUpdated: z.string().optional(),
  perPerson: z.boolean().optional(),
});

const addonSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  price: stringNumber,
  priceCurrency: z.string().default('INR'),
  productType: z.string().optional(),
  perPerson: z.boolean().default(false),
  note: z.string().optional(),
});

const itineraryItemSchema = z.object({
  label: z.string().optional(),
  day: z.string().optional(),
  title: z.string().min(1),
  detail: z.string().optional(),
});

const reviewHighlightSchema = z.object({
  quote: z.string().min(1),
  author: z.string().optional(),
  trip: z.string().optional(),
});

const commerceSchema = z.object({
  productType: z.enum(PRODUCT_TYPES),
  productName: z.string().min(1),
  bestFor: z.string().optional(),
  badges: z.array(z.string()).default([]),

  startingPrice: stringNumber.optional(),
  startingPriceUnit: z.string().optional(),

  duration: z.string().optional(),
  distanceIncludedKm: z.union([z.string(), z.number()]).optional(),
  passengerRange: z.string().optional(),
  seats: z.union([z.string(), z.number()]).optional(),
  luggage: z.string().optional(),
  pickupCoverage: z.string().optional(),

  selector: z.enum(['passengers', 'vehicle', 'members', 'days', 'date', 'none']).optional(),

  offers: z.array(offerSchema).min(1),
  inclusions: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  itinerary: z.array(itineraryItemSchema).default([]),
  requirements: z.array(z.string()).default([]),
  cancellationPolicy: z.string().optional(),
  expandableAfter: z.number().int().positive().optional(),

  addons: z.array(addonSchema).default([]),
  reviewHighlights: z.array(reviewHighlightSchema).default([]),
});

/**
 * Parse and normalize the commerce block from page frontmatter.
 * @param {object} frontmatter - parsed markdown frontmatter
 * @param {object} [ctx] - { slug, lang } for error messages
 * @returns {object|null} normalized commerce data, or null if no block present
 * @throws {Error} if a commerce block is present but fails validation
 */
export function getCommerceData(frontmatter, ctx = {}) {
  const raw = frontmatter && frontmatter.commerce;
  if (!raw || typeof raw !== 'object') return null;

  const result = commerceSchema.safeParse(raw);
  if (!result.success) {
    const where = ctx.slug ? ` on "${ctx.lang || ''}/${ctx.slug}"` : '';
    const issues = result.error.issues
      .map((i) => `commerce.${i.path.join('.')}: ${i.message}`)
      .join('; ');
    throw new Error(`Invalid commerce frontmatter${where} — ${issues}`);
  }

  const data = result.data;
  const typeConfig = getProductTypeConfig(data.productType);

  // Fill display defaults from product-type config without overwriting authored values.
  const selector = data.selector || typeConfig.selector;
  const offers = data.offers.map((o) => ({
    ...o,
    priceUnit: o.priceUnit || typeConfig.unitLabel,
  }));

  // Derive a starting-price anchor if not explicitly provided.
  const numericPrices = offers
    .map((o) => Number(String(o.price).replace(/[,₹\s]/g, '')))
    .filter((n) => !Number.isNaN(n) && n > 0);
  const startingPrice =
    data.startingPrice || (numericPrices.length ? String(Math.min(...numericPrices)) : undefined);
  const startingPriceUnit = data.startingPriceUnit || offers[0]?.priceUnit || typeConfig.unitLabel;

  return {
    ...data,
    selector,
    offers,
    startingPrice,
    startingPriceUnit,
    typeLabel: typeConfig.label,
    ctaVerb: typeConfig.ctaVerb,
    schemaType: typeConfig.schemaType,
  };
}

export { commerceSchema };
