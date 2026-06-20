export const CONTACT = {
  callNumberRaw: '9935474730',
  callNumberE164: '+919935474730',
  callNumberDisplay: '+91 99354 74730',
  whatsappNumberRaw: '919935474730',
  whatsappNumberE164: '+919935474730',
  whatsappNumberDisplay: '+91 99354 74730',
  whatsappUrl: 'https://wa.me/919935474730',
  // Deprecated by business decision: keep for record only, do not use in UI/flows.
  legacyCallNumberRaw: '8062182380',
  legacyCallNumberE164: '+918062182380',
  legacyCallNumberDisplay: '+91 80621 82380',
};

function normalizeIndianPhone(number) {
  const digits = String(number || '').replace(/\D/g, '');
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length > 10) return digits.slice(-10);
  return CONTACT.callNumberRaw;
}

export function getCallTelHref(raw = CONTACT.callNumberRaw) {
  return `tel:+91${normalizeIndianPhone(raw)}`;
}

export function getWhatsAppUrl(text) {
  if (!text) return CONTACT.whatsappUrl;
  return `${CONTACT.whatsappUrl}?text=${encodeURIComponent(text)}`;
}
