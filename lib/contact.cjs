const BUSINESS_PHONE_E164 = '+919935474730';

function digitsOnly(number) {
  return String(number || '').replace(/\D/g, '');
}

function normalizeToE164(number = BUSINESS_PHONE_E164) {
  const digits = digitsOnly(number).replace(/^0+/, '');

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }

  if (digits.length > 10) {
    return `+91${digits.slice(-10)}`;
  }

  return BUSINESS_PHONE_E164;
}

function normalizeIndianPhone(number = BUSINESS_PHONE_E164) {
  return normalizeToE164(number).slice(-10);
}

function getWhatsAppNumberDigits(number = BUSINESS_PHONE_E164) {
  return normalizeToE164(number).replace(/\D/g, '');
}

const BUSINESS_PHONE_DIGITS = getWhatsAppNumberDigits(BUSINESS_PHONE_E164);
const BUSINESS_PHONE_NATIONAL = normalizeIndianPhone(BUSINESS_PHONE_E164);
const BUSINESS_PHONE_DISPLAY = `+91 ${BUSINESS_PHONE_NATIONAL.slice(0, 5)} ${BUSINESS_PHONE_NATIONAL.slice(5)}`;

const CONTACT = Object.freeze({
  phoneE164: BUSINESS_PHONE_E164,
  phoneDigits: BUSINESS_PHONE_DIGITS,
  phoneNational: BUSINESS_PHONE_NATIONAL,
  phoneDisplay: BUSINESS_PHONE_DISPLAY,
  callNumberRaw: BUSINESS_PHONE_E164,
  callNumberE164: BUSINESS_PHONE_E164,
  callNumberDisplay: BUSINESS_PHONE_DISPLAY,
  whatsappNumberRaw: BUSINESS_PHONE_DIGITS,
  whatsappNumberE164: BUSINESS_PHONE_E164,
  whatsappNumberDisplay: BUSINESS_PHONE_DISPLAY,
  whatsappUrl: `https://wa.me/${BUSINESS_PHONE_DIGITS}`,
});

function getCallTelHref(number = BUSINESS_PHONE_E164) {
  return `tel:${normalizeToE164(number)}`;
}

function getWhatsAppUrl(text, number = BUSINESS_PHONE_E164) {
  const url = `https://wa.me/${getWhatsAppNumberDigits(number)}`;

  if (!text) {
    return url;
  }

  return `${url}?text=${encodeURIComponent(text)}`;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeContactContent(value) {
  if (typeof value !== 'string' || !value) {
    return value;
  }

  const nationalDisplay = `${BUSINESS_PHONE_NATIONAL.slice(0, 5)} ${BUSINESS_PHONE_NATIONAL.slice(5)}`;
  const businessNationalPattern = escapeRegExp(BUSINESS_PHONE_NATIONAL);
  const staleNationalPattern = '(?:8062182380|9450301573)';
  const staleDisplayPattern = '(?:80621[-\\s]?82380|94503[-\\s]?01573)';

  return value
    .replace(new RegExp(`tel:\\+?(?:91[-\\s]?)?(?:${staleDisplayPattern}|${staleNationalPattern}|${businessNationalPattern})`, 'gi'), getCallTelHref())
    .replace(new RegExp(`https://wa\\.me/\\+?(?:91)?(?:${staleNationalPattern}|${businessNationalPattern})\\b`, 'gi'), CONTACT.whatsappUrl)
    .replace(new RegExp(`\\+?91[-\\s]?${staleDisplayPattern}`, 'g'), CONTACT.phoneDisplay)
    .replace(/8062182380/g, BUSINESS_PHONE_NATIONAL)
    .replace(/80621 82380/g, nationalDisplay)
    .replace(/9450301573/g, BUSINESS_PHONE_NATIONAL)
    .replace(/94503 01573/g, nationalDisplay);
}

function normalizeContactData(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => normalizeContactData(entry));
  }

  if (value instanceof Date) {
    return value;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, normalizeContactData(entry)])
    );
  }

  return normalizeContactContent(value);
}

module.exports = {
  CONTACT,
  normalizeIndianPhone,
  normalizeToE164,
  getWhatsAppNumberDigits,
  getCallTelHref,
  getWhatsAppUrl,
  normalizeContactContent,
  normalizeContactData,
};
