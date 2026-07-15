// lib/orderPayload.js
// Builds the normalized lead payload + human-readable message for an order
// enquiry, so every lead names exactly which product, variant, price, and
// add-ons the user chose (plan.md §18.7). Shapes match the existing
// /api/contact-form contract used by useBookingForm.

import { formatINR } from './pricing';

/**
 * @param {object} args
 * @param {object} args.product   - normalized commerce data (getCommerceData)
 * @param {object} args.offer     - selected offer
 * @param {object} args.estimate  - result of pricing.estimate()
 * @param {Array}  args.addons    - chosen addon objects
 * @param {object} args.form      - { name, phone, email, date, pickup, notes }
 * @param {object} [args.meta]    - { slug, lang, ctaLocation, device }
 */
export function buildOrderPayload({ product, offer, estimate, addons = [], form = {}, meta = {} }) {
  const addonLabels = addons.map((a) => a.label).join(', ');
  const priceStr = estimate ? formatINR(estimate.total) : '';

  const messageLines = [
    `Order enquiry: ${product?.productName || 'Package'}`,
    offer?.name ? `Option: ${offer.name}` : null,
    estimate ? `Estimated: ${priceStr}${estimate.priceType === 'from' ? ' (from)' : ''}` : null,
    addonLabels ? `Add-ons: ${addonLabels}` : null,
    form.date ? `Date: ${form.date}` : null,
    form.pickup ? `Pickup: ${form.pickup}` : null,
    form.notes ? `Notes: ${form.notes}` : null,
  ].filter(Boolean);

  return {
    name: form.name,
    phone: form.phone,
    email: form.email || '',
    tripType: product?.typeLabel || 'Package Enquiry',
    pickupLocation: form.pickup || '',
    destination: product?.productName || '',
    pickupDate: form.date || '',
    passengers: String(estimate?.quantity ?? ''),
    message: messageLines.join(' | '),
    source: `Commerce:${product?.productType || 'unknown'}:${meta.slug || ''}`,
    // structured extras (safe to ignore server-side if unused)
    productType: product?.productType,
    productName: product?.productName,
    slug: meta.slug,
    lang: meta.lang,
    selectedOffer: offer?.name,
    displayedPrice: priceStr,
    selectedAddons: addons.map((a) => a.id),
    ctaLocation: meta.ctaLocation || 'commerce_section',
    device: meta.device,
  };
}

/** Build the analytics payload counterpart (flat, primitive values). */
export function buildOrderAnalytics({ product, offer, estimate, addons = [], meta = {} }) {
  return {
    product_type: product?.productType,
    product_slug: meta.slug,
    selected_offer: offer?.name,
    displayed_price: estimate?.total,
    addon_count: addons.length,
    addons: addons.map((a) => a.id).join(','),
    cta_location: meta.ctaLocation || 'commerce_section',
  };
}
