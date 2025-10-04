# Subdomain Redirect Issue - Action Required

## Problem
Google Search Console shows multiple 404 errors from the old subdomain `banarasi.kashitaxi.in`:

```
https://banarasi.kashitaxi.in/city-tours
https://banarasi.kashitaxi.in/is-varanasi-safe-for-solo-female-travellers
https://banarasi.kashitaxi.in/en/privacy-policy
https://banarasi.kashitaxi.in/en/package/prayagraj-day-tour
https://banarasi.kashitaxi.in/kashi-vishwanath-darshan-guide
https://banarasi.kashitaxi.in/morning-boat-ride-varanasi-price
https://banarasi.kashitaxi.in/en/varanasi-in-monsoon
https://banarasi.kashitaxi.in/en/varanasi-safety-guide
https://banarasi.kashitaxi.in/en/varanasi-in-december-2025-guide
https://banarasi.kashitaxi.in/en/package/airport-pickup-drop
https://banarasi.kashitaxi.in/en/package/varanasi-local-darshan
```

## SEO Impact
- **CRITICAL:** This splits domain authority between two domains
- **Link Equity Loss:** Backlinks to banarasi.kashitaxi.in don't benefit www.kashitaxi.in
- **Duplicate Content:** Same content appears on two domains
- **User Confusion:** Inconsistent branding

## Solution Required
This **CANNOT** be fixed in Next.js or application code. It requires **DNS/Server-level configuration**.

### Option 1: DNS CNAME + Server Redirect (Recommended)
If you have access to your hosting provider (Azure Static Web Apps):

1. **Remove DNS CNAME** for `banarasi.kashitaxi.in` subdomain
2. **Configure server-level 301 redirect** from `banarasi.kashitaxi.in` to `www.kashitaxi.in`

### Option 2: Azure Static Web Apps Configuration
If using Azure Static Web Apps, add to `staticwebapp.config.json`:

```json
{
  "routes": [
    {
      "route": "/*",
      "condition": {
        "header": "Host",
        "match": "banarasi.kashitaxi.in"
      },
      "redirect": "https://www.kashitaxi.in/:path*",
      "statusCode": 301
    }
  ]
}
```

### Option 3: DNS Provider Level
If using Cloudflare, AWS Route 53, or similar:

1. Go to DNS management
2. Remove CNAME record for `banarasi`
3. Add redirect rule at DNS level (if supported)

## Steps to Implement

### 1. Identify Your Hosting Setup
Check where your site is hosted:
- Azure Static Web Apps?
- Cloudflare?
- Vercel?
- Other?

### 2. Implement Redirect
Follow the appropriate method above based on your hosting provider.

### 3. Verify
After implementation, test:
```bash
curl -I https://banarasi.kashitaxi.in/
```

Should return:
```
HTTP/1.1 301 Moved Permanently
Location: https://www.kashitaxi.in/
```

### 4. Update Google Search Console
- Submit removal request for banarasi.kashitaxi.in in GSC
- Monitor crawl errors
- Watch for redirect confirmation

## Timeline
- **Priority:** HIGH
- **Estimated Impact:** ~10-15% boost in domain authority once consolidated
- **Implementation Time:** 15-30 minutes
- **SEO Recovery Time:** 2-4 weeks

## References
- [Azure Static Web Apps Custom Domains](https://docs.microsoft.com/en-us/azure/static-web-apps/custom-domain)
- [301 Redirect SEO Best Practices](https://developers.google.com/search/docs/crawling-indexing/301-redirects)
- [Google Search Console Domain Property](https://support.google.com/webmasters/answer/9008080)

## Status
- [ ] DNS configuration updated
- [ ] Server redirect implemented
- [ ] Tested subdomain redirect
- [ ] GSC removal request submitted
- [ ] Monitoring redirect performance

---
**Note:** This is outside the scope of the Next.js application and must be handled at the infrastructure/hosting level.
