# Hreflang Implementation Guide

## Overview

This document explains the hreflang implementation across the Varanasi Insider website to prevent duplicate content penalties and properly signal language/regional variants to search engines.

## Why Hreflang Matters

Hreflang tags tell search engines:
1. **Language variants** of the same content (en, hi, etc.)
2. **Regional targeting** (en-IN for India, en-US for USA, etc.)
3. **Default fallback** (x-default) for unspecified regions
4. **Prevention** of duplicate content penalties

Without proper hreflang implementation, search engines may:
- Treat regional variants as duplicate content
- Show wrong language version to users
- Penalize rankings due to perceived duplicate content

## Implementation Structure

### 1. Regional Variants Supported

**English Variants:**
- `en` - Generic English
- `en-IN` - English (India) - Primary market
- `en-US` - English (United States)
- `en-GB` - English (United Kingdom)
- `en-AU` - English (Australia)

**Hindi Variants:**
- `hi` - Generic Hindi
- `hi-IN` - Hindi (India)

**Fallback:**
- `x-default` - Default for unspecified regions (points to English version)

### 2. Implementation Locations

#### A. HeadForBlogs Component (`/components/SEO/HeadForBlogs.jsx`)

Used for all markdown-driven content pages:

```jsx
<HeadForBlogs 
  postData={postData}
  pageLang="en"
  pageSlug="varanasi-local-sightseeing-package"
  alternateLanguages={[
    { lang: 'en', url: 'https://www.kashitaxi.in/en/page' },
    { lang: 'hi', url: 'https://www.kashitaxi.in/hi/page' }
  ]}
/>
```

The component automatically generates:
- Self-referencing hreflang for current page
- Regional variants (en-IN, en-US, etc.)
- Alternate language links
- x-default fallback

#### B. Static Pages (e.g., `/pages/bike-rentals-varanasi.js`)

For non-markdown pages, add hreflang tags manually in Head:

```jsx
<Head>
  <link rel="canonical" href={canonicalUrl} />
  
  {/* Hreflang tags */}
  <link rel="alternate" hrefLang="en" href={canonicalUrl} />
  <link rel="alternate" hrefLang="en-IN" href={canonicalUrl} />
  <link rel="alternate" hrefLang="en-US" href={canonicalUrl} />
  <link rel="alternate" hrefLang="en-GB" href={canonicalUrl} />
  <link rel="alternate" hrefLang="en-AU" href={canonicalUrl} />
  <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
</Head>
```

#### C. Sitemap (`/scripts/generate-sitemap.js`)

Sitemap includes hreflang attributes for all URLs:

```xml
<url>
  <loc>https://www.kashitaxi.in/en/page</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://www.kashitaxi.in/en/page"/>
  <xhtml:link rel="alternate" hreflang="en-IN" href="https://www.kashitaxi.in/en/page"/>
  <xhtml:link rel="alternate" hreflang="en-US" href="https://www.kashitaxi.in/en/page"/>
  <xhtml:link rel="alternate" hreflang="en-GB" href="https://www.kashitaxi.in/en/page"/>
  <xhtml:link rel="alternate" hreflang="en-AU" href="https://www.kashitaxi.in/en/page"/>
  <xhtml:link rel="alternate" hreflang="hi" href="https://www.kashitaxi.in/hi/page"/>
  <xhtml:link rel="alternate" hreflang="hi-IN" href="https://www.kashitaxi.in/hi/page"/>
  <xhtml:link rel="alternate" hreflang="x-default" href="https://www.kashitaxi.in/en/page"/>
</url>
```

### 3. Utility Helper (`/lib/hreflang.js`)

Reusable functions for hreflang generation:

```javascript
import { generateHreflangAlternates, generateSingleLanguageHreflang } from '@/lib/hreflang';

// For pages with translations
const alternates = generateHreflangAlternates('destinations/varanasi/sightseeing/package', ['en', 'hi']);

// For single-language pages
const alternates = generateSingleLanguageHreflang('https://www.kashitaxi.in/bike-rentals-varanasi', 'en');
```

## Best Practices

### 1. Self-Referencing
Every page MUST reference itself with its language code:

```html
<!-- Current page: /en/page -->
<link rel="alternate" hrefLang="en-IN" href="https://www.kashitaxi.in/en/page" />
```

### 2. Bidirectional Links
If page A links to page B, page B must link back to page A:

```html
<!-- On English page -->
<link rel="alternate" hrefLang="hi-IN" href="/hi/page" />

<!-- On Hindi page -->
<link rel="alternate" hrefLang="en-IN" href="/en/page" />
```

### 3. x-default Usage
Always point x-default to the most universally accessible version (usually English):

```html
<link rel="alternate" hrefLang="x-default" href="https://www.kashitaxi.in/en/page" />
```

### 4. Canonical + Hreflang
Both canonical AND hreflang are required:

```html
<link rel="canonical" href="https://www.kashitaxi.in/en/page" />
<link rel="alternate" hrefLang="en" href="https://www.kashitaxi.in/en/page" />
<link rel="alternate" hrefLang="x-default" href="https://www.kashitaxi.in/en/page" />
```

## Testing Hreflang Implementation

### 1. Google Search Console
- Submit sitemap to GSC
- Check "International Targeting" report
- Monitor for hreflang errors

### 2. Hreflang Testing Tools
- **Merkle Hreflang Checker**: https://technicalseo.com/tools/hreflang/
- **Screaming Frog SEO Spider**: Crawl site and check hreflang
- **Google Search Console**: International Targeting > Language tags

### 3. Manual Validation
```bash
# Check hreflang in HTML
curl -s https://www.kashitaxi.in/en/page | grep 'hreflang'

# Check hreflang in sitemap
curl -s https://www.kashitaxi.in/kt-secret-map-v9.xml | grep 'hreflang'
```

## Common Issues & Fixes

### Issue 1: Missing x-default
**Problem**: No x-default tag
**Fix**: Always add x-default pointing to English version

### Issue 2: Incorrect ISO Codes
**Problem**: Using `en` instead of `en-IN`
**Fix**: Use proper ISO 639-1 (language) + ISO 3166-1 Alpha 2 (region) format

### Issue 3: Duplicate Language Codes
**Problem**: Multiple entries for same language code
**Fix**: Ensure each language code appears only once per page

### Issue 4: Missing Self-Reference
**Problem**: Page doesn't reference itself
**Fix**: Always include current page URL with its language code

### Issue 5: Broken Bidirectional Links
**Problem**: English page links to Hindi, but Hindi doesn't link back
**Fix**: Ensure all alternate language pages link to each other

## Adding New Language Support

To add a new language (e.g., Spanish):

### 1. Update Regional Variants
```javascript
// lib/hreflang.js
export const REGIONAL_VARIANTS = {
  en: ['en', 'en-IN', 'en-US', 'en-GB', 'en-AU'],
  hi: ['hi', 'hi-IN'],
  es: ['es', 'es-ES', 'es-MX', 'es-AR'] // NEW
};
```

### 2. Update Sitemap Generator
```javascript
// scripts/generate-sitemap.js
if (lang === 'es') {
  hreflang.push({ lang: 'es', url: fullUrl });
  hreflang.push({ lang: 'es-ES', url: fullUrl });
  hreflang.push({ lang: 'es-MX', url: fullUrl });
  hreflang.push({ lang: 'es-AR', url: fullUrl });
}
```

### 3. Update HeadForBlogs Component
```jsx
// components/SEO/HeadForBlogs.jsx
{langForPath === 'es' && (
  <>
    <link rel="alternate" hrefLang="es-ES" href={canonical} />
    <link rel="alternate" hrefLang="es-MX" href={canonical} />
    <link rel="alternate" hrefLang="es-AR" href={canonical} />
    <link rel="alternate" hrefLang="es" href={canonical} />
  </>
)}
```

## Monitoring & Maintenance

### Weekly Checks
- [ ] Review GSC International Targeting report
- [ ] Check for hreflang errors in GSC
- [ ] Verify new pages have proper hreflang

### Monthly Audits
- [ ] Crawl site with Screaming Frog
- [ ] Validate hreflang consistency
- [ ] Check for broken alternate links
- [ ] Update documentation for new pages

### After New Content
- [ ] Verify hreflang in page source
- [ ] Check sitemap includes new URLs
- [ ] Test with Merkle Hreflang checker
- [ ] Submit updated sitemap to GSC

## Resources

- **Google Documentation**: https://developers.google.com/search/docs/specialty/international/localized-versions
- **ISO Language Codes**: https://www.w3schools.com/tags/ref_language_codes.asp
- **ISO Country Codes**: https://www.w3schools.com/tags/ref_country_codes.asp
- **Hreflang Best Practices**: https://ahrefs.com/blog/hreflang-tags/

## Quick Reference

### Correct Hreflang Format
```html
<!-- ✅ CORRECT -->
<link rel="alternate" hrefLang="en-IN" href="https://www.kashitaxi.in/en/page" />
<link rel="alternate" hrefLang="en-US" href="https://www.kashitaxi.in/en/page" />
<link rel="alternate" hrefLang="x-default" href="https://www.kashitaxi.in/en/page" />

<!-- ❌ INCORRECT -->
<link rel="alternate" hrefLang="EN-in" href="/en/page" /> <!-- Wrong case -->
<link rel="alternate" href="https://www.kashitaxi.in/en/page" /> <!-- Missing hrefLang -->
<link rel="alternate" hrefLang="en" /> <!-- Missing href -->
```

### Hreflang Checklist
- [ ] Self-referencing link included
- [ ] All regional variants added
- [ ] x-default points to English
- [ ] Bidirectional links verified
- [ ] Canonical tag present
- [ ] Absolute URLs used
- [ ] No duplicate language codes
- [ ] ISO codes are lowercase
- [ ] Sitemap includes hreflang

---

**Last Updated**: November 21, 2025
**Maintained By**: Varanasi Insider Development Team
