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
  const { title, sub, bullets, primary, call, more, align = 'center', className = '', variant = 'gradient' } = opts;
  const alignLeft = align === 'left';
  const card = variant === 'card';
  const cls = className ? ` ${className}` : '';

  const container = card
    ? 'background:#f0f9ff;border:1px solid #bae6fd;border-left:5px solid #0891b2;border-radius:14px;padding:1.25rem 1.5rem;margin:1.5rem 0;color:#0f172a;'
    : `background:linear-gradient(135deg,#3b82f6,#22d3ee,#2dd4bf);border-radius:16px;padding:1.5rem;margin:1.5rem 0;color:#ffffff;${alignLeft ? '' : 'text-align:center;'}`;

  const parts = [
    `<div class="cta-banner${card ? ' cta-card' : ''}${cls}" style="${container}">`,
    `<div style="${card ? 'font-size:1.15rem;font-weight:800;color:#0e7490;' : 'font-size:1.25rem;font-weight:800;'}">${title}</div>`,
  ];
  if (sub) {
    parts.push(
      `<div style="${card ? 'font-size:0.95rem;margin:0.35rem 0 0.9rem;color:#475569;line-height:1.55;' : 'font-size:0.95rem;margin:0.3rem 0 0.7rem;opacity:0.97;'}">${sub}</div>`,
    );
  }
  if (bullets && bullets.length) {
    const list = bullets.map((b) => `✅ ${b}`).join('<br>\n');
    parts.push(
      `<div style="font-size:0.95rem;line-height:1.7;margin-bottom:1.1rem;${card ? 'color:#475569;' : ''}text-align:left;max-width:380px;margin-left:auto;margin-right:auto;">`,
      list,
      '</div>',
    );
  }
  let btnStyle;
  if (card) {
    btnStyle = 'background:#16a34a;color:#ffffff;padding:12px 22px;border-radius:9999px;text-decoration:none;display:inline-block;font-weight:800;font-size:1rem;box-shadow:0 4px 12px rgba(22,163,74,0.22);';
  } else if (alignLeft) {
    btnStyle = 'background:#ffffff;color:#0369a1;padding:14px 24px;border-radius:9999px;text-decoration:none;display:inline-block;font-weight:800;font-size:1.02rem;';
  } else {
    btnStyle = 'background:#ffffff;color:#0369a1;padding:16px 24px;border-radius:9999px;text-decoration:none;display:block;font-weight:800;font-size:1.05rem;margin:0 auto;max-width:380px;';
  }
  parts.push(`<a href="${waUrl(primary.waText)}" style="${btnStyle}">${primary.label}</a>`);
  if (call) {
    const callColor = card ? '#0e7490' : '#ffffff';
    if (alignLeft) {
      parts.push(
        `<span style="display:inline-block;margin:0.5rem 0 0 0.6rem;"><a href="tel:${TEL}" style="color:${callColor};text-decoration:none;font-weight:700;white-space:nowrap;">${call.label}</a></span>`,
      );
    } else {
      parts.push(
        `<div style="margin-top:0.7rem;"><a href="tel:${TEL}" style="color:${callColor};text-decoration:none;font-weight:700;">${call.label}</a></div>`,
      );
    }
  }
  if (more) {
    const moreColor = card ? '#0891b2' : '#ffffff';
    parts.push(
      `<div style="margin-top:0.4rem;font-size:0.82rem;${card ? '' : 'opacity:0.9;'}"><a href="${more.href}" style="color:${moreColor};text-decoration:underline;">${more.label}</a></div>`,
    );
  }
  parts.push('</div>');
  return parts.join('\n');
}

// --- Generic builder: scannable feature / reassurance strip ---------------
// items: [{ title, text }]  (title may lead with an emoji)
// opts.compact: render a small single-line trust row (title only, no descriptions)
function buildFeatureStrip(items, opts = {}) {
  if (!items || !items.length) return '';
  if (opts.compact) {
    const chips = items
      .map((it) => `<span style="white-space:nowrap;">${it.title}</span>`)
      .join('<span aria-hidden="true" style="opacity:0.4;">·</span>\n  ');
    return [
      '<div class="cta-trust" style="display:flex;flex-wrap:wrap;align-items:center;gap:0.3rem 0.65rem;margin:0.7rem 0 1.6rem;font-size:0.78rem;color:#64748b;line-height:1.5;">',
      `  ${chips}`,
      '</div>',
    ].join('\n');
  }
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
  return [buildGradientCta(cfg.cta), cfg.strip ? buildFeatureStrip(cfg.strip, { compact: cfg.compactStrip }) : '']
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
      compactStrip: true,
      cta: {
        variant: 'card',
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
        { title: '✅ Fixed fare upfront' },
        { title: '⏳ Driver waits 3–4 hrs' },
        { title: '❄️ AC · tolls included' },
        { title: '🛡️ Verified local drivers' },
      ],
    },
    hi: {
      compactStrip: true,
      cta: {
        variant: 'card',
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
        { title: '✅ पहले से फिक्स्ड किराया' },
        { title: '⏳ ड्राइवर 3–4 घंटे रुकेगा' },
        { title: '❄️ AC · टोल शामिल' },
        { title: '🛡️ वेरिफाइड लोकल ड्राइवर' },
      ],
    },
  },

  // Anti-scam / fixed-fare trust block — use on scam, first-timer, shopping pages.
  SCAM_SHIELD: {
    en: {
      compactStrip: true,
      cta: {
        variant: 'card',
        align: 'left',
        title: '🛡️ Skip the “walking ATM” treatment',
        sub: 'Get a <b>fixed all-day fare in writing</b> before you travel — no meter games, no “temple closed” detours, no commission shops. One vetted local driver for your whole Kashi trip.',
        primary: {
          label: '📲 Get my fixed fare on WhatsApp',
          waText: 'Hi, I want a fixed-fare local driver for my Varanasi trip (no commission shops, no detours). My dates & group size:',
        },
        call: { label: 'or 📞 +91 99354 74730' },
        more: { label: 'See fixed transport prices →', href: '/en/varanasi-transport-price-guide-2026' },
      },
      strip: [
        { title: '✅ Fare fixed in writing' },
        { title: '🚫 No commission shops' },
        { title: '🧭 No fake detours' },
        { title: '🛡️ Verified local driver' },
      ],
    },
    hi: {
      compactStrip: true,
      cta: {
        variant: 'card',
        align: 'left',
        title: '🛡️ “चलता-फिरता ATM” बनने से बचें',
        sub: 'यात्रा से पहले <b>पूरे दिन का किराया लिखित में फिक्स</b> कराएं — कोई मीटर का खेल नहीं, कोई “मंदिर बंद है” वाला चक्कर नहीं, कोई कमीशन वाली दुकान नहीं। पूरी काशी यात्रा के लिए एक भरोसेमंद लोकल ड्राइवर।',
        primary: {
          label: '📲 WhatsApp पर फिक्स्ड किराया पाएं',
          waText: 'नमस्ते, मुझे अपनी वाराणसी यात्रा के लिए फिक्स्ड किराए वाला लोकल ड्राइवर चाहिए (कोई कमीशन दुकान नहीं, कोई चक्कर नहीं)। मेरी तारीख व संख्या:',
        },
        call: { label: 'या 📞 +91 99354 74730' },
        more: { label: 'फिक्स्ड ट्रांसपोर्ट कीमतें देखें →', href: '/hi/varanasi-transport-price-guide-2026' },
      },
      strip: [
        { title: '✅ किराया लिखित में फिक्स' },
        { title: '🚫 कोई कमीशन दुकान नहीं' },
        { title: '🧭 कोई नकली चक्कर नहीं' },
        { title: '🛡️ वेरिफाइड लोकल ड्राइवर' },
      ],
    },
  },

  // Full-day city tour cab — use on itinerary / how-many-days / first-timer pages.
  CITY_TOUR: {
    en: {
      compactStrip: true,
      cta: {
        variant: 'card',
        align: 'left',
        title: '🚕 Do all the ghats & temples in one calm day',
        sub: 'A <b>fixed-fare full-day Varanasi city tour cab</b> with a local driver who knows the one-way lanes, parking, and darshan timings — so you cover Kashi Vishwanath, the ghats, Sarnath and more without haggling at every stop.',
        primary: {
          label: '📲 Plan my day on WhatsApp',
          waText: 'Hi, I want a fixed-fare full-day Varanasi city tour cab. My date, hotel & group size:',
        },
        call: { label: 'or 📞 +91 99354 74730' },
        more: { label: 'See the full-day city tour →', href: '/en/services/varanasi-full-day-city-tour-winter-2026' },
      },
      strip: [
        { title: '✅ Fixed fare, driver waits' },
        { title: '🕉️ Temples + ghats + Sarnath' },
        { title: '❄️ AC · tolls · parking included' },
        { title: '🛡️ Verified local driver' },
      ],
    },
    hi: {
      compactStrip: true,
      cta: {
        variant: 'card',
        align: 'left',
        title: '🚕 एक ही आराम भरे दिन में सभी घाट व मंदिर',
        sub: '<b>फिक्स्ड किराए वाली फुल-डे वाराणसी सिटी टूर कैब</b> — लोकल ड्राइवर जो वन-वे गलियां, पार्किंग व दर्शन समय जानता है, ताकि आप काशी विश्वनाथ, घाट, सारनाथ हर जगह बिना मोलभाव घूम सकें।',
        primary: {
          label: '📲 WhatsApp पर दिन प्लान करें',
          waText: 'नमस्ते, मुझे फिक्स्ड किराए वाली फुल-डे वाराणसी सिटी टूर कैब चाहिए। मेरी तारीख, होटल व संख्या:',
        },
        call: { label: 'या 📞 +91 99354 74730' },
        more: { label: 'फुल-डे सिटी टूर देखें →', href: '/hi/services/varanasi-full-day-city-tour-winter-2026' },
      },
      strip: [
        { title: '✅ फिक्स्ड किराया, ड्राइवर रुकेगा' },
        { title: '🕉️ मंदिर + घाट + सारनाथ' },
        { title: '❄️ AC · टोल · पार्किंग शामिल' },
        { title: '🛡️ वेरिफाइड लोकल ड्राइवर' },
      ],
    },
  },

  // Kashi Vishwanath darshan help — use on darshan / temple pages.
  DARSHAN: {
    en: {
      compactStrip: true,
      cta: {
        variant: 'card',
        align: 'left',
        title: '🕉️ Kashi Vishwanath darshan — without the ₹1,400 tout trap',
        sub: 'We help you use the <b>official Sugam Darshan (~₹300)</b> and time your slot to skip the longest queues. No “VIP guide” markups, no fake urgency — just an honest cab + darshan plan.',
        primary: {
          label: '📲 Plan my darshan on WhatsApp',
          waText: 'Hi, I want help with Kashi Vishwanath Sugam Darshan + cab. My date & group size:',
        },
        call: { label: 'or 📞 +91 99354 74730' },
        more: { label: 'Sugam Darshan price & booking →', href: '/en/services/kashi-vishwanath-sugam-darshan-price-booking' },
      },
      strip: [
        { title: '✅ Official Sugam (~₹300)' },
        { title: '🚫 No tout markups' },
        { title: '⏱️ Best low-queue slots' },
        { title: '🛡️ Verified local driver' },
      ],
    },
    hi: {
      compactStrip: true,
      cta: {
        variant: 'card',
        align: 'left',
        title: '🕉️ काशी विश्वनाथ दर्शन — ₹1,400 वाले दलाल जाल के बिना',
        sub: 'हम आपको <b>ऑफिशियल सुगम दर्शन (~₹300)</b> इस्तेमाल करने व सही समय चुनने में मदद करते हैं ताकि लंबी लाइन से बचें। कोई “VIP गाइड” चार्ज नहीं, कोई नकली जल्दबाज़ी नहीं।',
        primary: {
          label: '📲 WhatsApp पर दर्शन प्लान करें',
          waText: 'नमस्ते, मुझे काशी विश्वनाथ सुगम दर्शन + कैब में मदद चाहिए। मेरी तारीख व संख्या:',
        },
        call: { label: 'या 📞 +91 99354 74730' },
        more: { label: 'सुगम दर्शन कीमत व बुकिंग →', href: '/hi/services/kashi-vishwanath-sugam-darshan-price-booking' },
      },
      strip: [
        { title: '✅ ऑफिशियल सुगम (~₹300)' },
        { title: '🚫 कोई दलाल चार्ज नहीं' },
        { title: '⏱️ कम भीड़ वाला समय' },
        { title: '🛡️ वेरिफाइड लोकल ड्राइवर' },
      ],
    },
  },

  // Hotel booking + transfer — use on where-to-stay / hotel pages.
  HOTEL: {
    en: {
      compactStrip: true,
      cta: {
        variant: 'card',
        align: 'left',
        title: '🏨 Stay in the right lane — with a door-to-door transfer',
        sub: 'Tell us your vibe (ghat-side immersion, quiet periphery, or sterile-clean cantonment) and budget. We match a <b>vetted stay</b> and add a <b>fixed-fare airport/station pickup</b> so you never drag luggage through the gullies.',
        primary: {
          label: '📲 Find my stay on WhatsApp',
          waText: 'Hi, I want help booking a Varanasi hotel + airport/station transfer. My dates, budget & group size:',
        },
        call: { label: 'or 📞 +91 99354 74730' },
        more: { label: 'Hotel booking help →', href: '/en/services/hotel-booking-in-varanasi' },
      },
      strip: [
        { title: '✅ Vetted stays, real areas' },
        { title: '🧳 Door-to-door transfer' },
        { title: '📍 Ghat / quiet / clean zones' },
        { title: '🛡️ No commission surprises' },
      ],
    },
    hi: {
      compactStrip: true,
      cta: {
        variant: 'card',
        align: 'left',
        title: '🏨 सही इलाके में ठहरें — डोर-टू-डोर ट्रांसफर के साथ',
        sub: 'हमें अपनी पसंद (घाट किनारे, शांत बाहरी इलाका, या साफ-सुथरा कैंट) व बजट बताएं। हम <b>भरोसेमंद होटल</b> चुनते हैं और <b>फिक्स्ड किराए वाला एयरपोर्ट/स्टेशन पिकअप</b> जोड़ते हैं ताकि गलियों में सामान न घसीटना पड़े।',
        primary: {
          label: '📲 WhatsApp पर होटल ढूंढें',
          waText: 'नमस्ते, मुझे वाराणसी होटल + एयरपोर्ट/स्टेशन ट्रांसफर बुक करने में मदद चाहिए। मेरी तारीख, बजट व संख्या:',
        },
        call: { label: 'या 📞 +91 99354 74730' },
        more: { label: 'होटल बुकिंग मदद →', href: '/hi/services/hotel-booking-in-varanasi' },
      },
      strip: [
        { title: '✅ भरोसेमंद होटल, सही इलाके' },
        { title: '🧳 डोर-टू-डोर ट्रांसफर' },
        { title: '📍 घाट / शांत / साफ ज़ोन' },
        { title: '🛡️ कोई कमीशन झटका नहीं' },
      ],
    },
  },

  // Safest taxi for women — use on solo-female / safety pages.
  WOMEN_TAXI: {
    en: {
      compactStrip: true,
      cta: {
        variant: 'card',
        align: 'left',
        title: '👩 A vetted driver who waits — so you never wait alone',
        sub: 'For solo and women travellers: a <b>fixed-fare, verified driver</b> for arrivals, late aarti nights and ghat runs. Share live trip status with family. No haggling in a dark lane at 10 PM.',
        primary: {
          label: '📲 Book a safe driver on WhatsApp',
          waText: 'Hi, I want a verified fixed-fare driver for a solo/women trip in Varanasi. My dates & plan:',
        },
        call: { label: 'or 📞 +91 99354 74730' },
        more: { label: 'Safest taxi for women →', href: '/en/services/varanasi-safest-taxi-for-women' },
      },
      strip: [
        { title: '✅ Verified drivers' },
        { title: '📍 Live status to family' },
        { title: '🌙 Safe late-night runs' },
        { title: '💬 Fixed fare, no haggling' },
      ],
    },
    hi: {
      compactStrip: true,
      cta: {
        variant: 'card',
        align: 'left',
        title: '👩 भरोसेमंद ड्राइवर जो रुकता है — ताकि आप अकेले न रुकें',
        sub: 'अकेली व महिला यात्रियों के लिए: आगमन, देर रात आरती व घाट यात्रा हेतु <b>फिक्स्ड किराए वाला वेरिफाइड ड्राइवर</b>। परिवार के साथ लाइव ट्रिप स्टेटस साझा करें। रात 10 बजे अंधेरी गली में कोई मोलभाव नहीं।',
        primary: {
          label: '📲 WhatsApp पर सुरक्षित ड्राइवर बुक करें',
          waText: 'नमस्ते, मुझे वाराणसी में अकेली/महिला यात्रा के लिए वेरिफाइड फिक्स्ड किराए वाला ड्राइवर चाहिए। मेरी तारीख व प्लान:',
        },
        call: { label: 'या 📞 +91 99354 74730' },
        more: { label: 'महिलाओं के लिए सबसे सुरक्षित टैक्सी →', href: '/hi/services/varanasi-safest-taxi-for-women' },
      },
      strip: [
        { title: '✅ वेरिफाइड ड्राइवर' },
        { title: '📍 परिवार को लाइव स्टेटस' },
        { title: '🌙 सुरक्षित देर-रात यात्रा' },
        { title: '💬 फिक्स्ड किराया, कोई मोलभाव नहीं' },
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
