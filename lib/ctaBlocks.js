// Single source of truth for reusable in-content CTA blocks.
//
// Markdown content is rendered through a remark/rehype pipeline (see
// lib/markdown.js), so React components cannot be embedded directly. Instead,
// authors drop a shortcode token in markdown and it is replaced with shared,
// on-brand HTML during processing.
//
// Generic form:   {{CTA:BLOCK_NAME:en}}  /  {{CTA:BLOCK_NAME:hi}}
// Legacy alias:   {{BOAT_AARTI_CTA:en}}   (kept working; == {{CTA:BOAT_AARTI:en}})
//
// To add a new CTA, register a config under BLOCKS below — no new markup needed.
// All blocks share the oceanic palette used on the home page:
//   gradient       linear-gradient(135deg,#3b82f6,#22d3ee,#2dd4bf)
//   feature strip  cyan cards (#ecfeff / #06b6d4)

const WA_DIGITS = '919935474730';
const TEL = '+919935474730';

const waUrl = (text) => `https://wa.me/${WA_DIGITS}?text=${encodeURIComponent(text)}`;

// --- Generic builder: oceanic gradient CTA banner -------------------------
// opts: { title, sub?, bullets?, primary:{label,waText}, call?:{label},
//         more?:{label,href}, align?: 'center'|'left', className? }
function buildGradientCta(opts) {
  const { title, sub, bullets, primary, call, more, align = 'center', className = '' } = opts;
  const alignLeft = align === 'left';
  const cls = className ? ` ${className}` : '';
  const parts = [
    `<div class="cta-banner${cls}" style="background:linear-gradient(135deg,#3b82f6,#22d3ee,#2dd4bf);border-radius:16px;padding:1.5rem;margin:1.5rem 0;color:#ffffff;${alignLeft ? '' : 'text-align:center;'}">`,
    `<div style="font-size:1.25rem;font-weight:800;">${title}</div>`,
  ];
  if (sub) parts.push(`<div style="font-size:0.95rem;margin:0.3rem 0 0.7rem;opacity:0.97;">${sub}</div>`);
  if (bullets && bullets.length) {
    const list = bullets.map((b) => `✅ ${b}`).join('<br>\n');
    parts.push(
      '<div style="font-size:0.95rem;line-height:1.7;margin-bottom:1.1rem;text-align:left;max-width:380px;margin-left:auto;margin-right:auto;">',
      list,
      '</div>',
    );
  }
  const btnStyle = alignLeft
    ? 'background:#ffffff;color:#0369a1;padding:14px 24px;border-radius:9999px;text-decoration:none;display:inline-block;font-weight:800;font-size:1.02rem;'
    : 'background:#ffffff;color:#0369a1;padding:16px 24px;border-radius:9999px;text-decoration:none;display:block;font-weight:800;font-size:1.05rem;margin:0 auto;max-width:380px;';
  parts.push(`<a href="${waUrl(primary.waText)}" style="${btnStyle}">${primary.label}</a>`);
  if (call) {
    if (alignLeft) {
      parts.push(
        `<span style="display:inline-block;margin:0.5rem 0 0 0.2rem;"><a href="tel:${TEL}" style="color:#ffffff;text-decoration:none;font-weight:700;white-space:nowrap;">${call.label}</a></span>`,
      );
    } else {
      parts.push(
        `<div style="margin-top:0.7rem;"><a href="tel:${TEL}" style="color:#ffffff;text-decoration:none;font-weight:700;">${call.label}</a></div>`,
      );
    }
  }
  if (more) {
    parts.push(
      `<div style="margin-top:0.4rem;font-size:0.82rem;opacity:0.9;"><a href="${more.href}" style="color:#ffffff;text-decoration:underline;">${more.label}</a></div>`,
    );
  }
  parts.push('</div>');
  return parts.join('\n');
}

// --- Generic builder: scannable feature / reassurance strip ---------------
// items: [{ title, text }]  (title may lead with an emoji)
function buildFeatureStrip(items) {
  if (!items || !items.length) return '';
  const cards = items
    .map((it) =>
      [
        '  <div style="flex:1 1 190px;background:#ecfeff;border:1px solid #a5f3fc;border-left:4px solid #06b6d4;border-radius:12px;padding:0.8rem 1rem;">',
        `    <div style="font-weight:800;color:#0e7490;font-size:0.98rem;">${it.title}</div>`,
        `    <div style="font-size:0.86rem;color:#155e75;line-height:1.45;margin-top:0.15rem;">${it.text}</div>`,
        '  </div>',
      ].join('\n'),
    )
    .join('\n');
  return ['<div class="cta-strip" style="display:flex;flex-wrap:wrap;gap:0.7rem;margin:1rem 0 1.75rem;">', cards, '</div>'].join('\n');
}

// --- Compose a full block (gradient + optional strip) ---------------------
function buildBlock(cfg) {
  return [buildGradientCta(cfg.cta), cfg.strip ? buildFeatureStrip(cfg.strip) : '']
    .filter(Boolean)
    .join('\n\n');
}

// --- Block registry: add new CTAs here ------------------------------------
const BLOCKS = {
  BOAT_AARTI: {
    en: {
      cta: {
        className: 'boat-cta',
        title: '🛶 Watch the Ganga Aarti From Your Own Boat',
        sub: 'Private family boat · all-inclusive · <b>from ₹1,999</b>',
        bullets: [
          '1.5-hour Ganga ride + aarti live from the water',
          'Experienced local boatman · life jackets for all',
          'Your own boat — no crowd, no pushing',
        ],
        primary: {
          label: '📲 Book on WhatsApp',
          waText:
            'I want to book the all-inclusive private Ganga Aarti boat (1.5-hour ride + aarti from the water). My date & group size:',
        },
        call: { label: '📞 Call +91 99354 74730' },
        more: { label: 'See all boats & prices →', href: '/en/evening-boat-ride-varanasi-ganga-aarti' },
      },
    },
    hi: {
      cta: {
        className: 'boat-cta',
        title: '🛶 अपनी नाव से गंगा आरती देखें',
        sub: 'परिवार के लिए प्राइवेट नाव · सब कुछ शामिल · <b>₹1,999 से</b>',
        bullets: [
          '1.5 घंटे की गंगा सैर + नाव से लाइव आरती दर्शन',
          'अनुभवी स्थानीय नाविक · सबके लिए लाइफ जैकेट',
          'आपकी अपनी नाव — कोई भीड़ नहीं, कोई धक्का नहीं',
        ],
        primary: {
          label: '📲 WhatsApp पर बुक करें',
          waText: 'मुझे ऑल-इनक्लूसिव प्राइवेट गंगा आरती नाव बुक करनी है (1.5 घंटे की सैर + नाव से आरती दर्शन)। मेरी तारीख व संख्या:',
        },
        call: { label: '📞 कॉल करें +91 99354 74730' },
        more: { label: 'सभी नावें व कीमत देखें →', href: '/hi/evening-boat-ride-varanasi-ganga-aarti' },
      },
    },
  },

  SARNATH_CAB: {
    en: {
      cta: {
        align: 'left',
        title: '🚕 Just want a cab to Sarnath?',
        sub: 'Get a <b>fixed round-trip Varanasi ⇄ Sarnath fare</b> — your driver waits the full 3–4 hours while you explore. No hourly meter, no negotiation.',
        primary: {
          label: '📲 Get my fixed fare on WhatsApp',
          waText: 'Hi, I want a fixed round-trip Varanasi to Sarnath cab. My date & group size:',
        },
        call: { label: 'or 📞 +91 99354 74730' },
      },
      strip: [
        { title: '✅ Fixed fare upfront', text: 'Told before you book — no negotiation, no surprises.' },
        { title: '⏳ Driver waits for you', text: 'Full 3–4 hr visit included — no per-hour charge.' },
        { title: '❄️ Clean AC car', text: 'Fuel, tolls &amp; parking all included in the fare.' },
        { title: '🛡️ Verified local drivers', text: 'Punctual even at 6 AM — safe for families &amp; solo travellers.' },
      ],
    },
    hi: {
      cta: {
        align: 'left',
        title: '🚕 सिर्फ़ सारनाथ के लिए कैब चाहिए?',
        sub: '<b>फिक्स्ड राउंड-ट्रिप वाराणसी ⇄ सारनाथ किराया</b> पाएं — आप घूमते रहें, ड्राइवर पूरे 3–4 घंटे इंतज़ार करेगा। कोई घंटे का मीटर नहीं, कोई मोलभाव नहीं।',
        primary: {
          label: '📲 WhatsApp पर फिक्स्ड किराया पाएं',
          waText: 'नमस्ते, मुझे वाराणसी से सारनाथ के लिए फिक्स्ड राउंड-ट्रिप कैब चाहिए। मेरी तारीख व संख्या:',
        },
        call: { label: 'या 📞 +91 99354 74730' },
      },
      strip: [
        { title: '✅ पहले से फिक्स्ड किराया', text: 'बुकिंग से पहले बताया जाता है — कोई मोलभाव नहीं, कोई सरप्राइज़ नहीं।' },
        { title: '⏳ ड्राइवर आपका इंतज़ार करेगा', text: 'पूरे 3–4 घंटे शामिल — कोई प्रति-घंटा शुल्क नहीं।' },
        { title: '❄️ साफ़ AC कार', text: 'फ्यूल, टोल व पार्किंग सब किराये में शामिल।' },
        { title: '🛡️ वेरिफाइड लोकल ड्राइवर', text: 'सुबह 6 बजे भी समय पर — परिवार व अकेले यात्रियों के लिए सुरक्षित।' },
      ],
    },
  },
};

// Pre-render every block/lang once.
const CACHE = {};
for (const [name, langs] of Object.entries(BLOCKS)) {
  for (const [lang, cfg] of Object.entries(langs)) {
    CACHE[`${name}:${lang}`] = buildBlock(cfg);
  }
}

const resolve = (name, lang) => CACHE[`${name}:${lang}`] || CACHE[`${name}:en`] || '';

// Generic shortcode: {{CTA:BLOCK_NAME:lang}}  and legacy {{BOAT_AARTI_CTA:lang}}
const GENERIC_RE = /\{\{CTA:([A-Z0-9_]+):(en|hi)\}\}/g;
const LEGACY_BOAT_RE = /\{\{BOAT_AARTI_CTA:(en|hi)\}\}/g;

// Replace CTA shortcode tokens in markdown with the shared HTML block.
export function injectCtaShortcodes(markdown) {
  if (!markdown || markdown.indexOf('{{') === -1) return markdown;
  let out = markdown;
  if (out.indexOf('{{BOAT_AARTI_CTA') !== -1) {
    out = out.replace(LEGACY_BOAT_RE, (_, lang) => resolve('BOAT_AARTI', lang));
  }
  if (out.indexOf('{{CTA:') !== -1) {
    out = out.replace(GENERIC_RE, (whole, name, lang) => resolve(name, lang) || whole);
  }
  return out;
}

export { buildGradientCta, buildFeatureStrip, buildBlock, BLOCKS };

// Backward-compatible helper (used elsewhere / tests).
export function buildBoatAartiCta(lang = 'en') {
  return resolve('BOAT_AARTI', lang);
}
