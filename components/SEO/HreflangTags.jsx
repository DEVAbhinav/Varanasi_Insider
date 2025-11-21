import React from 'react';

const EN_VARIANTS = ['en', 'en-IN', 'en-US', 'en-GB', 'en-AU'];
const HI_VARIANTS = ['hi', 'hi-IN'];

const normalizeLang = (code = '') => code.toLowerCase();

const formatHrefLang = (code = '') => {
  const trimmed = code.trim();
  if (!trimmed) return '';
  if (trimmed === 'x-default') return 'x-default';
  const parts = trimmed.split('-');
  if (parts.length === 1) return parts[0].toLowerCase();
  return `${parts[0].toLowerCase()}-${parts.slice(1).map((p) => p.toUpperCase()).join('-')}`;
};

const dedupeAlternates = (alternates = []) => {
  const map = new Map();
  alternates.forEach((alt) => {
    if (!alt || !alt.lang || !alt.url) return;
    const key = normalizeLang(alt.lang);
    if (!key || map.has(key)) return;
    map.set(key, { lang: formatHrefLang(alt.lang), url: alt.url });
  });
  return Array.from(map.values());
};

export default function HreflangTags({ pageLang = 'en', canonical, alternates = [] }) {
  if (!canonical) return null;

  const normalizedPageLang = normalizeLang(pageLang) || 'en';
  const normalizedCanon = canonical.trim();
  const dedupedAlternates = dedupeAlternates(alternates);

  const englishEntry = normalizedPageLang.startsWith('en')
    ? { lang: 'en', url: normalizedCanon }
    : dedupedAlternates.find((alt) => normalizeLang(alt.lang).startsWith('en'));

  const hindiEntry = normalizedPageLang.startsWith('hi')
    ? { lang: 'hi', url: normalizedCanon }
    : dedupedAlternates.find((alt) => normalizeLang(alt.lang).startsWith('hi'));

  const otherAlternates = dedupedAlternates.filter((alt) => {
    const lang = normalizeLang(alt.lang);
    return lang && !lang.startsWith('en') && !lang.startsWith('hi') && lang !== normalizedPageLang;
  });

  const englishHref = englishEntry?.url;
  const hindiHref = hindiEntry?.url;
  const xDefaultHref = englishHref || otherAlternates[0]?.url || normalizedCanon;

  const selfHrefLang = normalizedPageLang === 'en'
    ? 'en-IN'
    : normalizedPageLang === 'hi'
      ? 'hi-IN'
      : formatHrefLang(pageLang);

  const englishCodesToRender = englishHref
    ? EN_VARIANTS.filter((code) => !(code === 'en-IN' && normalizedPageLang === 'en' && englishHref === normalizedCanon))
    : [];

  const hindiCodesToRender = hindiHref
    ? HI_VARIANTS.filter((code) => !(code === 'hi-IN' && normalizedPageLang === 'hi' && hindiHref === normalizedCanon))
    : [];

  return (
    <>
      <link rel="alternate" hrefLang={selfHrefLang} href={normalizedCanon} />
      {englishHref && englishCodesToRender.map((code) => (
        <link key={`hreflang-${code}`} rel="alternate" hrefLang={code} href={englishHref} />
      ))}
      {hindiHref && hindiCodesToRender.map((code) => (
        <link key={`hreflang-${code}`} rel="alternate" hrefLang={code} href={hindiHref} />
      ))}
      {otherAlternates.map((alt) => (
        <link key={`hreflang-${alt.lang}`} rel="alternate" hrefLang={alt.lang} href={alt.url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={xDefaultHref} />
    </>
  );
}
