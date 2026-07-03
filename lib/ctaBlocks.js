// Single source of truth for reusable in-content CTA blocks.
// Authors drop a shortcode token in markdown, e.g. {{BOAT_AARTI_CTA:en}} or
// {{BOAT_AARTI_CTA:hi}}, and it is replaced with the shared HTML below during
// markdown processing (see lib/markdown.js). Update the copy/design in ONE place.

const WA_DIGITS = '919935474730';
const TEL = '+919935474730';

const COPY = {
  en: {
    title: '🛶 Watch the Ganga Aarti From Your Own Boat',
    sub: 'Private family boat · all-inclusive · <b>from ₹1,999</b>',
    bullets: [
      '1.5-hour Ganga ride + aarti live from the water',
      'Experienced local boatman · life jackets for all',
      'Your own boat — no crowd, no pushing',
    ],
    waText:
      'I want to book the all-inclusive private Ganga Aarti boat (1.5-hour ride + aarti from the water). My date & group size:',
    primary: '📲 Book on WhatsApp',
    call: '📞 Call +91 99354 74730',
    more: 'See all boats & prices →',
    moreHref: '/en/evening-boat-ride-varanasi-ganga-aarti',
  },
  hi: {
    title: '🛶 अपनी नाव से गंगा आरती देखें',
    sub: 'परिवार के लिए प्राइवेट नाव · सब कुछ शामिल · <b>₹1,999 से</b>',
    bullets: [
      '1.5 घंटे की गंगा सैर + नाव से लाइव आरती दर्शन',
      'अनुभवी स्थानीय नाविक · सबके लिए लाइफ जैकेट',
      'आपकी अपनी नाव — कोई भीड़ नहीं, कोई धक्का नहीं',
    ],
    waText:
      'मुझे ऑल-इनक्लूसिव प्राइवेट गंगा आरती नाव बुक करनी है (1.5 घंटे की सैर + नाव से आरती दर्शन)। मेरी तारीख व संख्या:',
    primary: '📲 WhatsApp पर बुक करें',
    call: '📞 कॉल करें +91 99354 74730',
    more: 'सभी नावें व कीमत देखें →',
    moreHref: '/hi/evening-boat-ride-varanasi-ganga-aarti',
  },
};

function buildBoatAartiCta(lang) {
  const c = COPY[lang] || COPY.en;
  const bullets = c.bullets.map((b) => `✅ ${b}`).join('<br>\n');
  const waUrl = `https://wa.me/${WA_DIGITS}?text=${encodeURIComponent(c.waText)}`;
  return [
    '<div class="boat-cta" style="background:linear-gradient(135deg,#3b82f6,#22d3ee,#2dd4bf);border-radius:16px;padding:1.5rem;margin:1.5rem 0;text-align:center;color:#ffffff;">',
    `<div style="font-size:1.25rem;font-weight:800;">${c.title}</div>`,
    `<div style="font-size:0.95rem;margin:0.3rem 0 0.7rem;opacity:0.97;">${c.sub}</div>`,
    '<div style="font-size:0.95rem;line-height:1.7;margin-bottom:1.1rem;text-align:left;max-width:380px;margin-left:auto;margin-right:auto;">',
    bullets,
    '</div>',
    `<a href="${waUrl}" style="background:#ffffff;color:#0369a1;padding:16px 24px;border-radius:9999px;text-decoration:none;display:block;font-weight:800;font-size:1.05rem;margin:0 auto;max-width:380px;">${c.primary}</a>`,
    `<div style="margin-top:0.7rem;"><a href="tel:${TEL}" style="color:#ffffff;text-decoration:none;font-weight:700;">${c.call}</a></div>`,
    `<div style="margin-top:0.4rem;font-size:0.82rem;opacity:0.9;"><a href="${c.moreHref}" style="color:#ffffff;text-decoration:underline;">${c.more}</a></div>`,
    '</div>',
  ].join('\n');
}

const CACHE = { en: buildBoatAartiCta('en'), hi: buildBoatAartiCta('hi') };

const SHORTCODE_RE = /\{\{BOAT_AARTI_CTA:(en|hi)\}\}/g;

// Replace CTA shortcode tokens in markdown with the shared HTML block.
export function injectCtaShortcodes(markdown) {
  if (!markdown || markdown.indexOf('{{BOAT_AARTI_CTA') === -1) return markdown;
  return markdown.replace(SHORTCODE_RE, (_, lang) => CACHE[lang] || CACHE.en);
}

export { buildBoatAartiCta };
