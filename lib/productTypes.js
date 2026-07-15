// lib/productTypes.js
// Canonical product-type taxonomy for the commerce/ordering system.
// Every sellable page declares exactly one `productType` in its `commerce`
// frontmatter block. This module is the single source of truth for the enum,
// per-type display config, and the schema.org type mapping.
//
// Referenced by:
//  - lib/commercialPageData.js (validation + normalization)
//  - components/commerce/* (labels, default CTA copy)
//  - lib/schemaGenerator helpers (schema @type per product)

export const PRODUCT_TYPES = Object.freeze([
  'tour_package',
  'sightseeing',
  'route_taxi',
  'vehicle',
  'boat',
  'darshan',
  'activity',
  'accommodation',
  'bus_package',
  'addon',
]);

// Per-type config. `schemaType` maps to schema.org; `unitLabel` is a sensible
// default price unit; `ctaVerb` drives button copy; `selector` is the default
// quantity selector when the content does not specify one.
export const PRODUCT_TYPE_CONFIG = Object.freeze({
  tour_package: {
    label: 'Tour Package',
    schemaType: 'TouristTrip',
    ctaVerb: 'Book',
    selector: 'members',
    unitLabel: 'per trip',
  },
  sightseeing: {
    label: 'Sightseeing',
    schemaType: 'TouristTrip',
    ctaVerb: 'Book',
    selector: 'members',
    unitLabel: 'per trip',
  },
  route_taxi: {
    label: 'Taxi / Route',
    schemaType: 'Service',
    ctaVerb: 'Get quote',
    selector: 'passengers',
    unitLabel: 'per trip',
  },
  vehicle: {
    label: 'Vehicle Hire',
    schemaType: 'Product',
    ctaVerb: 'Reserve',
    selector: 'days',
    unitLabel: 'per day',
  },
  boat: {
    label: 'Boat Ride',
    schemaType: 'Product',
    ctaVerb: 'Book',
    selector: 'members',
    unitLabel: 'per person',
  },
  darshan: {
    label: 'Darshan / Puja',
    schemaType: 'Service',
    ctaVerb: 'Book',
    selector: 'members',
    unitLabel: 'per person',
  },
  activity: {
    label: 'Activity',
    schemaType: 'Product',
    ctaVerb: 'Book',
    selector: 'members',
    unitLabel: 'per person',
  },
  accommodation: {
    label: 'Stay',
    schemaType: 'Product',
    ctaVerb: 'Enquire',
    selector: 'days',
    unitLabel: 'per night',
  },
  bus_package: {
    label: 'Bus Yatra',
    schemaType: 'TouristTrip',
    ctaVerb: 'Book',
    selector: 'members',
    unitLabel: 'per seat',
  },
  addon: {
    label: 'Add-on',
    schemaType: 'Product',
    ctaVerb: 'Add',
    selector: 'members',
    unitLabel: 'per person',
  },
});

export function isValidProductType(type) {
  return PRODUCT_TYPES.includes(type);
}

export function getProductTypeConfig(type) {
  return PRODUCT_TYPE_CONFIG[type] || PRODUCT_TYPE_CONFIG.tour_package;
}
