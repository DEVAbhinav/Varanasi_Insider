/**
 * logClick — fire-and-forget browser utility
 * Sends a click/intent event to Gaadi Diary ERP via POST /api/public/lead.
 * Never throws, never blocks the UI action.
 *
 * Usage:
 *   import { logClick } from '@/lib/logClick';
 *   logClick('WHATSAPP');
 *   logClick('EXIT_INTENT_WHATSAPP');
 */

let _pageLoadTime = null;
let _maxScrollPct = 0;

if (typeof window !== 'undefined') {
  _pageLoadTime = Date.now();

  window.addEventListener('scroll', () => {
    const el = document.documentElement;
    const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    if (pct > _maxScrollPct) _maxScrollPct = pct;
  }, { passive: true });
}

function getUtmParams() {
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get('utm_source') || undefined,
      utmMedium: params.get('utm_medium') || undefined,
      utmCampaign: params.get('utm_campaign') || undefined,
    };
  } catch {
    return {};
  }
}

function getDevice() {
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

/**
 * @param {'WHATSAPP'|'CALL'|'EXIT_INTENT_WHATSAPP'|'EXIT_INTENT_CALL'} clickType
 */
export function logClick(clickType) {
  if (typeof window === 'undefined') return;

  const erpUrl = process.env.NEXT_PUBLIC_WEBSITE_LEAD_ERP_URL;
  const apiKey = process.env.NEXT_PUBLIC_WEBSITE_LEAD_API_KEY;
  if (!erpUrl || !apiKey) return;

  const payload = {
    clickType,
    sourcePage: window.location.pathname,
    sourceUrl: window.location.href,
    pageTitle: document.title,
    referrer: document.referrer || undefined,
    device: getDevice(),
    screenSize: `${window.screen.width}x${window.screen.height}`,
    userAgent: navigator.userAgent,
    timeOnPageSecs: _pageLoadTime ? Math.round((Date.now() - _pageLoadTime) / 1000) : undefined,
    scrollDepthPct: _maxScrollPct || undefined,
    language: navigator.language || undefined,
    localTime: new Date().toLocaleString('en-IN'),
    ...getUtmParams(),
  };

  // Use sendBeacon when available (survives page unload, truly fire-and-forget)
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    // sendBeacon doesn't support custom headers — fall through to fetch
  }

  // fetch with keepalive — survives short navigations
  fetch(`${erpUrl}/api/public/lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-website-key': apiKey },
    body,
    keepalive: true,
  }).catch(() => { /* silent — never surface to user */ });
}
