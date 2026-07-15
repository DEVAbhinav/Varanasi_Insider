// lib/pricing.js
// Pure, dependency-free price estimation for commerce products.
// Given a selected offer, a quantity selection, and chosen add-ons, returns a
// transparent breakdown. Never throws; unknown/blank prices are treated as 0.

const toNumber = (v) => {
  const n = Number(String(v ?? '').replace(/[,₹\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

/**
 * @param {object} args
 * @param {object} args.offer          - selected offer object (from commerce.offers)
 * @param {number} [args.quantity=1]    - members/passengers/days depending on selector
 * @param {string} [args.selector]      - 'members' | 'passengers' | 'days' | 'vehicle' | 'none'
 * @param {Array}  [args.addons=[]]     - chosen addon objects
 * @returns {{ base:number, addonsTotal:number, total:number, currency:string,
 *            priceType:string, quantity:number, assumptions:string,
 *            lines:Array<{label:string, amount:number}> }}
 */
export function estimate({ offer, quantity = 1, selector = 'members', addons = [] } = {}) {
  const currency = offer?.priceCurrency || 'INR';
  const unitPrice = toNumber(offer?.price);
  const qty = Math.max(1, Number(quantity) || 1);

  // Multiply by quantity only when the offer is priced per unit of the selector.
  const perUnitSelectors = ['members', 'passengers', 'days'];
  const multiplied =
    (offer?.perPerson || perUnitSelectors.includes(selector)) &&
    /person|seat|day|night|pax/i.test(offer?.priceUnit || '');
  const base = multiplied ? unitPrice * qty : unitPrice;

  const lines = [{ label: offer?.name || 'Base', amount: base }];

  let addonsTotal = 0;
  for (const a of addons) {
    const p = toNumber(a?.price);
    const amount = a?.perPerson ? p * qty : p;
    addonsTotal += amount;
    lines.push({ label: a?.label || 'Add-on', amount });
  }

  const total = base + addonsTotal;

  const assumptions =
    offer?.priceAssumptions ||
    (multiplied ? `${qty} × ${offer?.priceUnit || 'unit'}` : offer?.priceUnit || '');

  return {
    base,
    addonsTotal,
    total,
    currency,
    priceType: offer?.priceType || 'from',
    quantity: qty,
    assumptions,
    lines,
  };
}

export const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
