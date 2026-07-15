// lib/analyticsEvents.js
// Canonical analytics event map for the commerce/ordering funnel (plan.md §10).
// Thin wrapper over lib/gtag.js so every commerce component fires consistent,
// well-named events with a standard payload. Safe on the server (no-op).

import * as gtag from './gtag';

export const COMMERCE_EVENTS = Object.freeze({
  VIEW_OFFER: 'view_offer',
  SELECT_VARIANT: 'select_variant',
  CHANGE_QUANTITY: 'change_quantity',
  ADD_ADDON: 'add_addon',
  REMOVE_ADDON: 'remove_addon',
  START_ENQUIRY: 'start_enquiry',
  SUBMIT_ENQUIRY: 'submit_enquiry',
  CLICK_CALL: 'click_call',
  CLICK_WHATSAPP: 'click_whatsapp',
});

/**
 * Fire a commerce event.
 * @param {string} action - one of COMMERCE_EVENTS
 * @param {object} payload - flat primitive params (product_type, slug, etc.)
 */
export function trackCommerce(action, payload = {}) {
  gtag.event({
    action,
    category: 'Commerce',
    label: payload.product_slug || payload.product_type || 'commerce',
    ...payload,
  });
}
