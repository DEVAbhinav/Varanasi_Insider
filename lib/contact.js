export const CONTACT = {
  callNumberRaw: '8062182380',
  callNumberE164: '+918062182380',
  callNumberDisplay: '+91 80621 82380',
  whatsappNumberRaw: '919935474730',
  whatsappNumberE164: '+919935474730',
  whatsappNumberDisplay: '+91 99354 74730',
  whatsappUrl: 'https://wa.me/919935474730',
};

export function getCallTelHref(raw = CONTACT.callNumberRaw) {
  return `tel:+91${raw}`;
}

export function getWhatsAppUrl(text) {
  if (!text) return CONTACT.whatsappUrl;
  return `${CONTACT.whatsappUrl}?text=${encodeURIComponent(text)}`;
}
