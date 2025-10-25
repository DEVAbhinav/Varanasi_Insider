# SEO Tools Implementation Guide for Varanasi Taxi Website
## Complete Requirements & Technical Specification

**Project:** Custom SEO Dashboard for kashitaxi.in  
**Goal:** Replace expensive tools (Ahrefs/SEMrush) with custom solution  
**Budget Target:** $10-50/month vs $200+/month  
**Date:** October 2025

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Core Features Required](#core-features-required)
3. [Technical Architecture](#technical-architecture)
4. [API & Service Providers](#api--service-providers)
5. [Implementation Roadmap](#implementation-roadmap)
6. [Cost Analysis](#cost-analysis)
7. [Setup Instructions](#setup-instructions)
8. [Code Examples](#code-examples)

---

## Executive Summary

### Business Requirements
- Track keyword rankings for 100+ target keywords
- Monitor competitor positions for top 20 money keywords
- Get accurate search volume data for content planning
- Receive alerts when rankings drop
- Analyze on-page SEO issues automatically
- Track backlinks and domain authority
- Generate weekly/monthly SEO reports

### Target Keywords to Track
**Priority 1 (Money Keywords - Daily Tracking):**
- varanasi taxi
- varanasi airport cab
- tempo traveller varanasi
- varanasi to ayodhya taxi
- varanasi local sightseeing cab
- varanasi airport transfer
- kashi taxi service
- varanasi cab booking
- varanasi tour packages
- varanasi day tour taxi

**Priority 2 (Service Pages - Weekly Tracking):**
- varanasi to prayagraj taxi
- varanasi to bodhgaya cab
- varanasi to vindhyachal taxi
- tempo traveller hire varanasi
- 12 seater tempo traveller varanasi
- force urbania hire varanasi
- pink taxi varanasi
- bike rental varanasi

**Priority 3 (Long-tail/Content - Monthly Tracking):**
- best time to visit varanasi
- dev deepawali varanasi guide
- ganga aarti timing dashashwamedh
- varanasi itinerary 3 days
- is varanasi safe for solo female travellers

### Key Competitors to Monitor
1. tourmyindia.com
2. thrillophilia.com
3. goibibo.com (taxi section)
4. makemytrip.com (taxi section)
5. Local Varanasi cab operators

---

## Core Features Required

### 1. Keyword Rank Tracker

**Requirements:**
- Track 100+ keywords daily/weekly
- Store historical ranking data (min 12 months)
- Track rankings for specific URLs
- Compare rankings across time periods
- Show position changes (up/down arrows)
- Track local rankings (Varanasi/India specific)
- Mobile vs Desktop rankings
- SERP features tracking (Featured snippets, People Also Ask, etc.)

**Data Points per Keyword:**
```javascript
{
  keyword: "varanasi taxi",
  date: "2025-10-23",
  position: 5,
  previousPosition: 7,
  change: +2,
  url: "https://www.kashitaxi.in/",
  searchVolume: 12100,
  difficulty: "Medium",
  cpc: 0.42,
  traffic: 156, // Estimated clicks
  competitors: [
    { position: 1, domain: "competitor1.com", url: "..." },
    { position: 2, domain: "competitor2.com", url: "..." },
    // ... top 10
  ],
  serpFeatures: ["Featured Snippet", "People Also Ask", "Local Pack"]
}
```

**Alerts:**
- Position dropped by 5+ positions
- New keyword entered top 10
- Competitor overtook your position
- Lost featured snippet

**UI Requirements:**
- Table view with sortable columns
- Line charts showing rank over time
- Color coding (green = improved, red = dropped)
- Export to CSV/PDF
- Filter by keyword groups (money, service, content)

---

### 2. Keyword Research Tool

**Requirements:**
- Get search volume for any keyword
- Find related keywords automatically
- Show keyword difficulty score
- Display CPC and commercial intent
- Generate content ideas from keywords
- Analyze keyword gaps vs competitors

**Input:**
- Seed keyword (e.g., "varanasi taxi")
- Location (India/Varanasi)
- Language (English/Hindi)

**Output:**
```javascript
{
  mainKeyword: "varanasi taxi",
  searchVolume: 12100,
  difficulty: 45, // 0-100 scale
  cpc: 0.42,
  competition: "Medium",
  trend: "Increasing", // based on 12-month data
  relatedKeywords: [
    { keyword: "varanasi airport taxi", volume: 3600, difficulty: 38 },
    { keyword: "varanasi cab service", volume: 2900, difficulty: 42 },
    { keyword: "taxi in varanasi", volume: 8100, difficulty: 48 },
    // ... 50+ suggestions
  ],
  questions: [
    "how to book taxi in varanasi",
    "what is taxi fare in varanasi",
    "which is best taxi service in varanasi"
  ],
  seasonality: {
    // Monthly trend data
    "jan": 100, "feb": 95, "mar": 110, // indexed to 100
    // ...
  }
}
```

**Features:**
- Bulk keyword lookup (upload CSV with 1000s of keywords)
- Keyword grouping/clustering
- Content gap analysis (keywords competitors rank for, you don't)
- Export keyword lists

---

### 3. Search Console Integration (FREE)

**Requirements:**
- Pull actual performance data from Google Search Console
- Show clicks, impressions, CTR, position per keyword
- Compare time periods (this month vs last month)
- Identify declining keywords
- Find high-impression, low-CTR keywords (optimization opportunities)

**Metrics to Track:**
```javascript
{
  keyword: "varanasi taxi",
  period: "last 30 days",
  clicks: 234,
  impressions: 8945,
  ctr: 2.62,
  avgPosition: 5.2,
  
  comparison: {
    clicksChange: +12, // vs previous period
    impressionsChange: +456,
    ctrChange: -0.3,
    positionChange: -0.5 // improved
  },
  
  landingPages: [
    { url: "/", clicks: 180, impressions: 6500 },
    { url: "/en/services", clicks: 54, impressions: 2445 }
  ],
  
  devices: {
    mobile: { clicks: 156, impressions: 5890 },
    desktop: { clicks: 78, impressions: 3055 }
  }
}
```

**Reports:**
- Top performing keywords (most clicks)
- Best opportunity keywords (high impressions, low CTR)
- Declining keywords (position dropped)
- New ranking keywords
- Query type analysis (brand vs non-brand)

---

### 4. Competitor Analysis

**Requirements:**
- Track competitor rankings for same keywords
- Compare domain authority
- Monitor their new content
- Identify keywords they rank for (you don't)
- Analyze their backlink profile

**Data Points:**
```javascript
{
  competitor: "tourmyindia.com",
  overview: {
    domainAuthority: 65,
    domainRating: 72,
    backlinks: 125000,
    referringDomains: 3450,
    organicTraffic: 450000, // estimated monthly
    organicKeywords: 125000
  },
  
  commonKeywords: [
    {
      keyword: "varanasi taxi",
      theirPosition: 3,
      yourPosition: 5,
      gap: -2,
      trafficPotential: 300 // clicks they get
    }
  ],
  
  keywordGaps: [
    // Keywords they rank for, you don't
    {
      keyword: "varanasi sightseeing packages",
      theirPosition: 4,
      yourPosition: null,
      searchVolume: 1900,
      opportunity: "High" // easy to rank for
    }
  ],
  
  topPages: [
    { url: "/varanasi-tour", traffic: 25000, keywords: 450 },
    { url: "/taxi-booking", traffic: 18000, keywords: 320 }
  ]
}
```

---

### 5. On-Page SEO Analyzer

**Requirements:**
- Audit any page on your site
- Check technical SEO issues
- Analyze content quality
- Suggest improvements

**Checks per Page:**
```javascript
{
  url: "https://www.kashitaxi.in/en/varanasi-taxi",
  score: 85, // out of 100
  
  titleTag: {
    content: "Varanasi Taxi Service 2025...",
    length: 65,
    status: "Good",
    hasKeyword: true,
    suggestion: null
  },
  
  metaDescription: {
    content: "Book Varanasi Taxi...",
    length: 158,
    status: "Good",
    hasKeyword: true,
    hasCTA: true
  },
  
  headings: {
    h1: { count: 1, status: "Good", content: "Varanasi Taxi..." },
    h2: { count: 6, status: "Good" },
    h3: { count: 12, status: "Good" },
    issues: []
  },
  
  content: {
    wordCount: 1850,
    status: "Good",
    keywordDensity: 1.8, // target keyword
    readabilityScore: 65,
    images: 8,
    imagesWithAlt: 7,
    internalLinks: 15,
    externalLinks: 3
  },
  
  technical: {
    loadTime: 2.1, // seconds
    mobileScore: 92,
    https: true,
    canonicalTag: true,
    structuredData: true,
    robotsIndexable: true
  },
  
  recommendations: [
    "Add alt text to 1 image",
    "Consider adding 200 more words",
    "Add 2-3 more internal links to service pages"
  ]
}
```

**Bulk Page Audit:**
- Crawl entire site (all pages)
- Generate site-wide SEO issues report
- Priority ranking (critical, important, minor)

---

### 6. Backlink Monitor

**Requirements:**
- Track total backlink count
- Monitor new backlinks
- Identify lost backlinks
- Analyze backlink quality
- Find toxic links

**Data Structure:**
```javascript
{
  summary: {
    totalBacklinks: 1250,
    referringDomains: 180,
    dofollow: 890,
    nofollow: 360,
    domainRating: 35,
    newLast30Days: 12,
    lostLast30Days: 3
  },
  
  topBacklinks: [
    {
      sourceUrl: "https://travelsite.com/india-taxi-guide",
      targetUrl: "https://www.kashitaxi.in/",
      anchorText: "Varanasi taxi service",
      domainRating: 65,
      dofollow: true,
      firstSeen: "2025-09-15",
      lastChecked: "2025-10-23",
      status: "Active"
    }
  ],
  
  newBacklinks: [
    // Recently acquired links
  ],
  
  lostBacklinks: [
    // Links that disappeared
  ],
  
  anchorTextDistribution: {
    "varanasi taxi": 45,
    "kashitaxi.in": 120,
    "click here": 15,
    "branded": 680,
    "exact match": 90,
    "generic": 300
  },
  
  topReferringDomains: [
    { domain: "touristwebsite.com", backlinks: 25, dr: 55 },
    { domain: "travelblog.in", backlinks: 18, dr: 48 }
  ]
}
```

**Alerts:**
- New high-authority backlink acquired
- Lost important backlink
- Toxic backlink detected
- Competitor got valuable backlink

---

### 7. Content Performance Tracker

**Requirements:**
- Track which blog posts drive most traffic
- Show keyword rankings per article
- Analyze content decay (losing rankings)
- Suggest content refresh opportunities

**Per Article Metrics:**
```javascript
{
  article: "Dev Deepawali 2025 Guide",
  url: "/en/dev-deepawali-2025-varanasi-ultimate-guide",
  publishDate: "2025-08-15",
  
  performance: {
    organicClicks: 3456, // last 30 days
    impressions: 45678,
    avgPosition: 3.2,
    ctr: 7.6,
    
    trend: "Increasing", // vs previous period
    clicksChange: +23,
    positionChange: +1.2 // improved
  },
  
  keywords: [
    { keyword: "dev deepawali 2025", position: 2, clicks: 1890 },
    { keyword: "dev deepawali varanasi", position: 5, clicks: 890 },
    { keyword: "ganga aarti dev deepawali", position: 8, clicks: 456 }
  ],
  
  internalLinks: {
    linksToThisPage: 12,
    linksFromThisPage: 8,
    topLinkingSources: [
      { page: "/en/varanasi-in-november-2025", anchor: "Dev Deepawali festival" }
    ]
  },
  
  recommendations: [
    "Content is performing well, consider creating similar content",
    "Update with 2026 dates soon",
    "Add internal link from airport taxi page"
  ]
}
```

---

### 8. Technical SEO Monitoring

**Requirements:**
- Monitor site health
- Track Core Web Vitals
- Identify crawl errors
- Check mobile usability
- Monitor indexation status

**Site Health Dashboard:**
```javascript
{
  overview: {
    totalPages: 256,
    indexedPages: 234,
    crawlablePages: 250,
    blockedPages: 6,
    errors: 2,
    warnings: 15
  },
  
  coreWebVitals: {
    lcp: 2.1, // Largest Contentful Paint (< 2.5s good)
    fid: 85, // First Input Delay (< 100ms good)
    cls: 0.08, // Cumulative Layout Shift (< 0.1 good)
    status: "Good"
  },
  
  indexation: {
    submitted: 256,
    indexed: 234,
    excluded: 22,
    exclusionReasons: {
      "Crawled - currently not indexed": 8,
      "Duplicate without canonical": 4,
      "Soft 404": 2
    }
  },
  
  crawlErrors: [
    { url: "/old-page", error: "404 Not Found", lastCrawled: "2025-10-20" },
    { url: "/broken-link", error: "500 Server Error", lastCrawled: "2025-10-22" }
  ],
  
  mobileUsability: {
    score: 95,
    issues: [
      { type: "Text too small to read", affectedPages: 2 }
    ]
  },
  
  sitemap: {
    url: "https://www.kashitaxi.in/sitemap.xml",
    lastSubmitted: "2025-10-20",
    urlsSubmitted: 256,
    urlsIndexed: 234
  }
}
```

---

### 9. Automated Reporting

**Requirements:**
- Weekly email reports (summary)
- Monthly detailed reports (full analysis)
- PDF export capability
- Custom report templates

**Weekly Report Contents:**
- Ranking changes summary (biggest movers)
- Traffic overview (GSC data)
- New backlinks
- Critical issues found
- Quick wins identified

**Monthly Report Contents:**
- Full keyword ranking report
- Traffic analysis with YoY comparison
- Content performance analysis
- Competitor analysis
- Technical SEO health
- Recommendations for next month

---

## Technical Architecture

### Tech Stack Recommendation

```
Frontend Dashboard:
- Next.js (already using)
- React + TypeScript
- Recharts / Chart.js for visualizations
- TailwindCSS for styling

Backend:
- Next.js API routes
- Node.js cron jobs for automated tracking

Database:
- PostgreSQL (for structured data)
  - Tables: keywords, rankings, backlinks, pages, competitors
- Supabase (PostgreSQL + realtime) - $25/month
  OR
- PlanetScale (MySQL) - Free tier available

APIs/Services:
- Google Search Console API (FREE)
- Google Keyword Planner API (FREE)
- DataForSEO API ($20-50/month)
- Lighthouse API (FREE)

Hosting:
- Vercel (already using for frontend)
- Vercel Cron Jobs (for scheduled tasks)
  OR
- GitHub Actions (for running scheduled scripts)

File Storage:
- Store reports/exports in Vercel Blob or S3
```

### Database Schema

```sql
-- Keywords table
CREATE TABLE keywords (
  id SERIAL PRIMARY KEY,
  keyword VARCHAR(500) NOT NULL,
  search_volume INTEGER,
  difficulty INTEGER,
  cpc DECIMAL(10,2),
  target_url VARCHAR(1000),
  priority VARCHAR(20), -- 'high', 'medium', 'low'
  category VARCHAR(100), -- 'money', 'service', 'content'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(keyword)
);

-- Rankings table (historical data)
CREATE TABLE rankings (
  id SERIAL PRIMARY KEY,
  keyword_id INTEGER REFERENCES keywords(id),
  date DATE NOT NULL,
  position INTEGER,
  url VARCHAR(1000),
  serp_features JSONB, -- ['Featured Snippet', 'PAA']
  competitors JSONB, -- Top 10 competitor data
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(keyword_id, date)
);

-- Search Console data
CREATE TABLE gsc_data (
  id SERIAL PRIMARY KEY,
  query VARCHAR(500),
  page VARCHAR(1000),
  date DATE NOT NULL,
  clicks INTEGER,
  impressions INTEGER,
  ctr DECIMAL(10,4),
  position DECIMAL(10,2),
  device VARCHAR(20), -- 'mobile', 'desktop', 'tablet'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(query, page, date, device)
);

-- Backlinks table
CREATE TABLE backlinks (
  id SERIAL PRIMARY KEY,
  source_url VARCHAR(1000),
  target_url VARCHAR(1000),
  anchor_text VARCHAR(500),
  domain_rating INTEGER,
  dofollow BOOLEAN,
  first_seen DATE,
  last_seen DATE,
  status VARCHAR(20), -- 'active', 'lost'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pages table (on-page SEO data)
CREATE TABLE pages (
  id SERIAL PRIMARY KEY,
  url VARCHAR(1000) UNIQUE,
  title VARCHAR(500),
  meta_description TEXT,
  word_count INTEGER,
  load_time DECIMAL(10,2),
  mobile_score INTEGER,
  seo_score INTEGER,
  last_audited TIMESTAMP,
  issues JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Competitors table
CREATE TABLE competitors (
  id SERIAL PRIMARY KEY,
  domain VARCHAR(255) UNIQUE,
  domain_rating INTEGER,
  backlinks INTEGER,
  referring_domains INTEGER,
  organic_traffic INTEGER,
  organic_keywords INTEGER,
  last_updated TIMESTAMP
);

-- Alerts table
CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50), -- 'rank_drop', 'new_backlink', etc.
  severity VARCHAR(20), -- 'critical', 'warning', 'info'
  message TEXT,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API & Service Providers

### 1. Google Search Console API (FREE)

**Setup Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project "SEO Dashboard"
3. Enable "Search Console API"
4. Create service account
5. Download credentials JSON
6. Add service account email to Search Console property

**API Limits:**
- 1200 queries per minute
- Unlimited total queries per day

**Code Example:**
```javascript
const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: './credentials.json',
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

const searchconsole = google.searchconsole({ version: 'v1', auth });

async function getSearchConsoleData(startDate, endDate) {
  const response = await searchconsole.searchanalytics.query({
    siteUrl: 'https://www.kashitaxi.in',
    requestBody: {
      startDate: startDate,
      endDate: endDate,
      dimensions: ['query', 'page', 'device'],
      rowLimit: 25000
    }
  });
  
  return response.data.rows;
}
```

---

### 2. Google Keyword Planner API (FREE)

**Setup Steps:**
1. Create Google Ads account (no spending required)
2. Apply for API access
3. Get developer token
4. Set up OAuth2 credentials

**API Limits:**
- 15,000 operations per day (each keyword lookup = 1 operation)
- Enough for 500+ keyword lookups daily

**Code Example:**
```javascript
const { GoogleAdsApi } = require('google-ads-api');

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
});

async function getKeywordIdeas(keywords) {
  const customer = client.Customer({
    customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID,
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
  });

  const ideas = await customer.keywordPlanIdeas.generate({
    language: 'en',
    geo_target_constants: ['geoTargetConstants/2356'], // India
    keywords: keywords,
  });

  return ideas.results.map(idea => ({
    keyword: idea.text,
    searchVolume: idea.keyword_idea_metrics.avg_monthly_searches,
    competition: idea.keyword_idea_metrics.competition,
    lowBid: idea.keyword_idea_metrics.low_top_of_page_bid_micros / 1000000,
    highBid: idea.keyword_idea_metrics.high_top_of_page_bid_micros / 1000000,
  }));
}
```

---

### 3. DataForSEO API (PAID - Recommended)

**Pricing:**
- SERP API: $0.003 per request
- Keywords Data API: $0.00006 per keyword
- Backlinks API: $0.0003 per domain

**Monthly Cost Estimate:**
- Track 100 keywords daily = 3000 requests/month = $9
- Keyword research (1000 keywords/month) = $0.06
- Backlink checks (10 domains monthly) = $0.003
- **Total: ~$10-15/month**

**Setup:**
```bash
npm install @dataforseo/client
```

**Code Example:**
```javascript
const DataForSeoClient = require('@dataforseo/client');

const client = new DataForSeoClient(LOGIN, PASSWORD);

// Track rankings
async function getRankings(keywords) {
  const tasks = keywords.map(keyword => ({
    keyword: keyword,
    location_code: 2356, // India
    language_code: "en",
    device: "desktop"
  }));
  
  const response = await client.post('/v3/serp/google/organic/live/advanced', tasks);
  return response;
}

// Get keyword data
async function getKeywordVolume(keywords) {
  const response = await client.post('/v3/keywords_data/google_ads/search_volume/live', [{
    keywords: keywords,
    location_code: 2356,
    language_code: "en"
  }]);
  
  return response[0].result;
}
```

---

### 4. SerpAPI (ALTERNATIVE - Higher Cost)

**Pricing:**
- $50/month for 5000 searches
- Good for: ~160 keywords tracked daily

**Better than DataForSEO for:**
- More detailed SERP features
- Easier to use
- Better documentation

**Code Example:**
```javascript
const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch(process.env.SERPAPI_KEY);

search.json({
  q: "varanasi taxi",
  location: "Varanasi, Uttar Pradesh, India",
  gl: "in",
  num: 100
}, (data) => {
  const organicResults = data.organic_results;
  // Process results
});
```

---

### 5. Lighthouse CI (FREE)

**For:** Technical SEO audits

**Setup:**
```bash
npm install -g @lhci/cli

# Run audit
lhci autorun --collect.url=https://www.kashitaxi.in
```

**Code Example:**
```javascript
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function auditPage(url) {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless']
  });
  
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'seo', 'accessibility'],
    port: chrome.port
  };
  
  const runnerResult = await lighthouse(url, options);
  await chrome.kill();
  
  return {
    performance: runnerResult.lhr.categories.performance.score * 100,
    seo: runnerResult.lhr.categories.seo.score * 100,
    accessibility: runnerResult.lhr.categories.accessibility.score * 100,
  };
}
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

**Goals:**
- Set up database
- Integrate Google Search Console
- Create basic dashboard UI

**Tasks:**
1. Set up PostgreSQL database (Supabase)
2. Create database schema
3. Set up Google Search Console API
4. Build data fetching scripts
5. Create basic Next.js dashboard pages
6. Set up authentication (admin only)

**Deliverables:**
- Database with tables created
- Script to pull GSC data daily
- Basic dashboard showing GSC metrics

---

### Phase 2: Rank Tracking (Week 3-4)

**Goals:**
- Implement keyword rank tracking
- Set up automated daily checks
- Create ranking visualization

**Tasks:**
1. Choose API provider (DataForSEO recommended)
2. Set up API integration
3. Create keyword management UI (add/edit/delete)
4. Build ranking check script
5. Set up daily cron job (Vercel Cron)
6. Create ranking charts/tables
7. Implement rank change alerts

**Deliverables:**
- Rank tracking for 100 keywords
- Historical data storage
- Dashboard with ranking charts
- Email alerts for big changes

---

### Phase 3: Keyword Research (Week 5)

**Goals:**
- Add keyword research tool
- Integrate keyword volume data

**Tasks:**
1. Set up Google Keyword Planner API
2. Build keyword suggestion UI
3. Create bulk keyword lookup
4. Add related keywords finder
5. Implement keyword difficulty scoring
6. Add export functionality (CSV)

**Deliverables:**
- Keyword research tool
- Bulk keyword analysis
- Export feature

---

### Phase 4: On-Page SEO Auditor (Week 6-7)

**Goals:**
- Automated page audits
- Site-wide crawling

**Tasks:**
1. Integrate Lighthouse
2. Build custom SEO checks
3. Create page audit UI
4. Implement site crawler
5. Generate issues report
6. Add recommendations engine

**Deliverables:**
- Single page audit tool
- Bulk site audit
- SEO score for all pages
- Actionable recommendations

---

### Phase 5: Backlink Monitor (Week 8)

**Goals:**
- Track backlinks
- Monitor new/lost links

**Tasks:**
1. Integrate backlink API (DataForSEO)
2. Build backlink dashboard
3. Set up weekly backlink checks
4. Create backlink alerts
5. Add toxic link detector

**Deliverables:**
- Backlink overview dashboard
- New/lost backlink tracking
- Backlink quality analysis

---

### Phase 6: Competitor Analysis (Week 9-10)

**Goals:**
- Track competitors
- Compare keyword rankings
- Identify opportunities

**Tasks:**
1. Add competitor management UI
2. Track competitor rankings
3. Build comparison views
4. Create keyword gap analysis
5. Add competitor alerts

**Deliverables:**
- Competitor tracking for 5 sites
- Side-by-side ranking comparison
- Keyword gap opportunities

---

### Phase 7: Reporting & Automation (Week 11-12)

**Goals:**
- Automated reports
- Email notifications
- Data exports

**Tasks:**
1. Build report templates
2. Set up email service (SendGrid/Resend)
3. Create weekly email reports
4. Build monthly PDF reports
5. Add custom date range exports
6. Set up all automated jobs

**Deliverables:**
- Weekly email reports
- Monthly detailed reports
- PDF export functionality
- All cron jobs running

---

### Phase 8: Polish & Optimization (Week 13-14)

**Goals:**
- UI/UX improvements
- Performance optimization
- Documentation

**Tasks:**
1. Improve dashboard design
2. Add loading states
3. Optimize database queries
4. Add caching layer
5. Write user documentation
6. Create admin guide

**Deliverables:**
- Polished, production-ready dashboard
- User documentation
- Admin guide

---

## Cost Analysis

### Monthly Operating Costs

```
API Costs:
├── DataForSEO API
│   ├── SERP tracking (100 keywords daily): $9/month
│   ├── Keyword research (1000 keywords): $0.06/month
│   └── Backlinks (weekly checks): $0.12/month
│   Total: ~$10/month

├── Database (Supabase)
│   └── Pro plan: $25/month
│   (or PlanetScale free tier)

├── Email Service (SendGrid/Resend)
│   └── Free tier: 100 emails/day (sufficient)

├── Hosting (Vercel)
│   └── Already covered by existing plan

Total Monthly Cost: $35-40/month
vs Ahrefs Standard: $199/month
SAVINGS: $160/month = $1,920/year
```

### Development Cost (One-Time)

```
If hiring developer:
- 14 weeks @ 20 hours/week = 280 hours
- @ $30/hour = $8,400

OR

Build gradually yourself:
- Phase 1-2: Essential features (4 weeks)
- Add features incrementally
- Total time: 3-4 months part-time
```

### Alternative: Minimal Version Cost

```
Phase 1 + 2 only (GSC + Rank Tracking):
- Development: 4 weeks
- Monthly cost: $10 (DataForSEO only)
- 90% of value, 10% of cost
```

---

## Setup Instructions

### Step 1: Database Setup (Supabase)

```bash
# 1. Sign up at https://supabase.com
# 2. Create new project "seo-dashboard"
# 3. Go to SQL Editor and run:

-- Copy database schema from above section
-- Execute all CREATE TABLE statements

# 4. Get connection string from Settings > Database
# 5. Add to .env.local:
DATABASE_URL=postgresql://...
```

---

### Step 2: Google Search Console Setup

```bash
# 1. Go to https://console.cloud.google.com/
# 2. Create new project "SEO Dashboard"
# 3. Enable "Search Console API"
# 4. Create Service Account:
#    - IAM & Admin > Service Accounts
#    - Create account: "seo-dashboard"
#    - Create key (JSON)
#    - Download to: /credentials/gsc-credentials.json

# 5. Add service account to Search Console:
#    - Go to https://search.google.com/search-console
#    - Settings > Users and permissions
#    - Add service account email as Full user

# 6. Add to .env.local:
GOOGLE_CREDENTIALS_PATH=./credentials/gsc-credentials.json
```

---

### Step 3: Google Keyword Planner Setup

```bash
# 1. Create Google Ads account (if you don't have)
#    https://ads.google.com/

# 2. Apply for API access:
#    https://developers.google.com/google-ads/api/docs/first-call/overview
#    - Fill out API access form
#    - Usually approved within 1-2 days

# 3. Create OAuth2 credentials:
#    - Google Cloud Console > APIs > Credentials
#    - Create OAuth 2.0 Client ID
#    - Type: Web application
#    - Download client_secret.json

# 4. Get developer token:
#    - Google Ads > Tools > API Center
#    - Copy developer token

# 5. Add to .env.local:
GOOGLE_ADS_CLIENT_ID=xxx
GOOGLE_ADS_CLIENT_SECRET=xxx
GOOGLE_ADS_DEVELOPER_TOKEN=xxx
GOOGLE_ADS_CUSTOMER_ID=xxx (your Google Ads account ID)
```

---

### Step 4: DataForSEO Setup

```bash
# 1. Sign up at https://dataforseo.com/
# 2. Choose plan: "Standard" - $20/month for 10,000 API calls
# 3. Go to Dashboard > API credentials
# 4. Copy login and password

# 5. Add to .env.local:
DATAFORSEO_LOGIN=your_login
DATAFORSEO_PASSWORD=your_password

# 6. Install SDK:
npm install @dataforseo/client
```

---

### Step 5: Create Dashboard Project Structure

```bash
# Create new Next.js page for SEO dashboard
mkdir -p pages/admin/seo
mkdir -p lib/seo
mkdir -p components/SEO

# Project structure:
Varanasi_Insider/
├── pages/
│   └── admin/
│       └── seo/
│           ├── index.js          # Dashboard home
│           ├── rankings.js       # Rank tracker
│           ├── keywords.js       # Keyword research
│           ├── audit.js          # Page auditor
│           ├── backlinks.js      # Backlink monitor
│           ├── competitors.js    # Competitor analysis
│           └── reports.js        # Reports
├── lib/
│   └── seo/
│       ├── gsc.js               # Google Search Console API
│       ├── keywords.js          # Google Keyword Planner
│       ├── rankings.js          # DataForSEO rank tracking
│       ├── audit.js             # Lighthouse integration
│       └── db.js                # Database queries
├── components/
│   └── SEO/
│       ├── RankingChart.js
│       ├── KeywordTable.js
│       ├── CompetitorCard.js
│       └── AlertBanner.js
└── scripts/
    └── cron/
        ├── daily-rankings.js    # Run daily
        ├── weekly-backlinks.js  # Run weekly
        └── monthly-report.js    # Run monthly
```

---

### Step 6: Set Up Cron Jobs (Vercel)

```javascript
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/daily-rankings",
      "schedule": "0 2 * * *" // 2 AM IST daily
    },
    {
      "path": "/api/cron/gsc-sync",
      "schedule": "0 3 * * *" // 3 AM IST daily
    },
    {
      "path": "/api/cron/weekly-backlinks",
      "schedule": "0 4 * * 0" // 4 AM IST every Sunday
    },
    {
      "path": "/api/cron/monthly-report",
      "schedule": "0 9 1 * *" // 9 AM IST on 1st of month
    }
  ]
}
```

```javascript
// pages/api/cron/daily-rankings.js
import { trackAllKeywords } from '../../../lib/seo/rankings';
import { saveRankingsToDb } from '../../../lib/seo/db';

export default async function handler(req, res) {
  // Verify cron secret to prevent unauthorized calls
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const rankings = await trackAllKeywords();
    await saveRankingsToDb(rankings);
    
    res.status(200).json({ 
      success: true, 
      tracked: rankings.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

---

## Code Examples

### Complete Rank Tracking Script

```javascript
// lib/seo/rankings.js
const DataForSeoClient = require('@dataforseo/client');
const db = require('./db');

const client = new DataForSeoClient(
  process.env.DATAFORSEO_LOGIN,
  process.env.DATAFORSEO_PASSWORD
);

async function trackAllKeywords() {
  // Get keywords from database
  const keywords = await db.query('SELECT * FROM keywords WHERE priority IN ($1, $2)', ['high', 'medium']);
  
  const results = [];
  
  // Process in batches of 10 (API limit)
  for (let i = 0; i < keywords.length; i += 10) {
    const batch = keywords.slice(i, i + 10);
    const batchResults = await trackKeywordBatch(batch);
    results.push(...batchResults);
    
    // Wait 2 seconds between batches to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return results;
}

async function trackKeywordBatch(keywords) {
  const tasks = keywords.map(kw => ({
    keyword: kw.keyword,
    location_code: 2356, // India
    language_code: "en",
    device: "desktop",
    depth: 100 // Check top 100 results
  }));
  
  const response = await client.post('/v3/serp/google/organic/live/advanced', tasks);
  
  return response.tasks.map((task, index) => {
    const keyword = keywords[index];
    const items = task.result?.[0]?.items || [];
    
    // Find our position
    const myResult = items.find(item => 
      item.url?.includes('kashitaxi.in') || 
      item.domain === 'kashitaxi.in'
    );
    
    // Get SERP features
    const serpFeatures = items
      .filter(item => item.type !== 'organic')
      .map(item => item.type);
    
    // Top 10 competitors
    const competitors = items
      .filter(item => item.type === 'organic')
      .slice(0, 10)
      .map(item => ({
        position: item.rank_absolute,
        domain: item.domain,
        url: item.url,
        title: item.title
      }));
    
    return {
      keywordId: keyword.id,
      keyword: keyword.keyword,
      date: new Date().toISOString().split('T')[0],
      position: myResult ? myResult.rank_absolute : null,
      url: myResult?.url || null,
      serpFeatures: serpFeatures,
      competitors: competitors
    };
  });
}

async function saveRankingsToDb(rankings) {
  for (const ranking of rankings) {
    await db.query(`
      INSERT INTO rankings (keyword_id, date, position, url, serp_features, competitors)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (keyword_id, date) 
      DO UPDATE SET 
        position = $3,
        url = $4,
        serp_features = $5,
        competitors = $6
    `, [
      ranking.keywordId,
      ranking.date,
      ranking.position,
      ranking.url,
      JSON.stringify(ranking.serpFeatures),
      JSON.stringify(ranking.competitors)
    ]);
  }
  
  // Check for alerts
  await checkRankingAlerts(rankings);
}

async function checkRankingAlerts(rankings) {
  for (const ranking of rankings) {
    // Get previous ranking
    const previous = await db.queryOne(`
      SELECT position FROM rankings 
      WHERE keyword_id = $1 AND date < $2 
      ORDER BY date DESC LIMIT 1
    `, [ranking.keywordId, ranking.date]);
    
    if (previous && ranking.position) {
      const change = previous.position - ranking.position;
      
      // Alert if dropped 5+ positions
      if (change < -5) {
        await createAlert({
          type: 'rank_drop',
          severity: 'warning',
          message: `"${ranking.keyword}" dropped from #${previous.position} to #${ranking.position}`,
          data: { keyword: ranking.keyword, change: change }
        });
      }
      
      // Alert if entered top 10
      if (ranking.position <= 10 && previous.position > 10) {
        await createAlert({
          type: 'rank_improvement',
          severity: 'info',
          message: `"${ranking.keyword}" entered top 10 at #${ranking.position}!`,
          data: { keyword: ranking.keyword, position: ranking.position }
        });
      }
    }
  }
}

module.exports = {
  trackAllKeywords,
  trackKeywordBatch,
  saveRankingsToDb
};
```

---

### Google Search Console Integration

```javascript
// lib/seo/gsc.js
const { google } = require('googleapis');
const db = require('./db');

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_CREDENTIALS_PATH,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

const searchconsole = google.searchconsole({ version: 'v1', auth });

async function syncSearchConsoleData(days = 30) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const response = await searchconsole.searchanalytics.query({
    siteUrl: 'https://www.kashitaxi.in',
    requestBody: {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      dimensions: ['query', 'page', 'device'],
      rowLimit: 25000,
      dataState: 'final' // Only final data
    }
  });
  
  const rows = response.data.rows || [];
  
  // Save to database
  for (const row of rows) {
    const [query, page, device] = row.keys;
    
    await db.query(`
      INSERT INTO gsc_data (query, page, date, clicks, impressions, ctr, position, device)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (query, page, date, device)
      DO UPDATE SET
        clicks = $4,
        impressions = $5,
        ctr = $6,
        position = $7
    `, [
      query,
      page,
      endDate.toISOString().split('T')[0],
      row.clicks,
      row.impressions,
      row.ctr,
      row.position,
      device
    ]);
  }
  
  return { synced: rows.length };
}

async function getTopKeywords(days = 30) {
  return await db.query(`
    SELECT 
      query,
      SUM(clicks) as total_clicks,
      SUM(impressions) as total_impressions,
      AVG(ctr) as avg_ctr,
      AVG(position) as avg_position
    FROM gsc_data
    WHERE date >= NOW() - INTERVAL '${days} days'
    GROUP BY query
    ORDER BY total_clicks DESC
    LIMIT 100
  `);
}

async function getOpportunityKeywords(days = 30) {
  // High impressions but low CTR = opportunity
  return await db.query(`
    SELECT 
      query,
      SUM(impressions) as total_impressions,
      AVG(ctr) as avg_ctr,
      AVG(position) as avg_position
    FROM gsc_data
    WHERE date >= NOW() - INTERVAL '${days} days'
    GROUP BY query
    HAVING SUM(impressions) > 100 AND AVG(ctr) < 0.02
    ORDER BY total_impressions DESC
    LIMIT 50
  `);
}

module.exports = {
  syncSearchConsoleData,
  getTopKeywords,
  getOpportunityKeywords
};
```

---

### Dashboard Page Example

```javascript
// pages/admin/seo/rankings.js
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

export default function RankingsPage() {
  const [keywords, setKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchKeywords();
  }, []);
  
  async function fetchKeywords() {
    const response = await fetch('/api/seo/keywords');
    const data = await response.json();
    setKeywords(data);
    setLoading(false);
  }
  
  async function viewKeywordHistory(keyword) {
    setSelectedKeyword(keyword);
    const response = await fetch(`/api/seo/rankings/${keyword.id}?days=90`);
    const history = await response.json();
    
    setChartData({
      labels: history.map(h => h.date),
      datasets: [{
        label: 'Position',
        data: history.map(h => h.position),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        yAxisID: 'y',
      }]
    });
  }
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Keyword Rankings</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500 text-sm">Total Keywords</div>
          <div className="text-3xl font-bold">{keywords.length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500 text-sm">Top 3 Rankings</div>
          <div className="text-3xl font-bold text-green-600">
            {keywords.filter(k => k.position <= 3).length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500 text-sm">Top 10 Rankings</div>
          <div className="text-3xl font-bold text-blue-600">
            {keywords.filter(k => k.position <= 10).length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500 text-sm">Avg Position</div>
          <div className="text-3xl font-bold">
            {(keywords.reduce((sum, k) => sum + k.position, 0) / keywords.length).toFixed(1)}
          </div>
        </div>
      </div>
      
      {/* Keywords Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Keyword</th>
              <th className="px-6 py-3 text-left">Position</th>
              <th className="px-6 py-3 text-left">Change</th>
              <th className="px-6 py-3 text-left">Volume</th>
              <th className="px-6 py-3 text-left">Traffic</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {keywords.map(keyword => (
              <tr key={keyword.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{keyword.keyword}</td>
                <td className="px-6 py-4">
                  <span className={`font-semibold ${
                    keyword.position <= 3 ? 'text-green-600' :
                    keyword.position <= 10 ? 'text-blue-600' :
                    'text-gray-600'
                  }`}>
                    #{keyword.position}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {keyword.change > 0 && (
                    <span className="text-green-600">↑ {keyword.change}</span>
                  )}
                  {keyword.change < 0 && (
                    <span className="text-red-600">↓ {Math.abs(keyword.change)}</span>
                  )}
                  {keyword.change === 0 && (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4">{keyword.searchVolume?.toLocaleString()}</td>
                <td className="px-6 py-4">{keyword.estimatedTraffic}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => viewKeywordHistory(keyword)}
                    className="text-blue-600 hover:underline"
                  >
                    View History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Chart Modal */}
      {selectedKeyword && chartData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full">
            <h2 className="text-2xl font-bold mb-4">
              {selectedKeyword.keyword} - 90 Day History
            </h2>
            <Line 
              data={chartData} 
              options={{
                scales: {
                  y: {
                    reverse: true, // Lower position = better
                    beginAtZero: false
                  }
                }
              }}
            />
            <button 
              onClick={() => setSelectedKeyword(null)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Next Steps

### Immediate Actions

1. **Decision Point:**
   - Build in-house? (recommended for long-term)
   - Hire freelancer for initial build?
   - Use paid tools for now, build later?

2. **If building in-house:**
   - Start with Phase 1 (GSC integration) - immediate value
   - Add Phase 2 (rank tracking) - high priority
   - Gradually add other features

3. **Quick Wins (No coding required):**
   - Set up Google Search Console properly
   - Export GSC data to sheets weekly (manual)
   - Use free Google Keyword Planner for research
   - Use Lighthouse CLI for audits

### Resources

**Learning:**
- [DataForSEO Documentation](https://docs.dataforseo.com/)
- [Google Search Console API Guide](https://developers.google.com/webmaster-tools)
- [Google Keyword Planner API](https://developers.google.com/google-ads/api)

**Communities:**
- r/TechSEO (Reddit)
- SEO Tools discussion forums
- DataForSEO community

### Support

For implementation help:
1. Start with Phase 1 (easiest)
2. Test with small keyword set (10-20 keywords)
3. Scale up gradually
4. Document issues and solutions

---

## Conclusion

**This system will give you:**
- 90% of Ahrefs/SEMrush functionality
- At 10-20% of the cost
- Customized for your specific needs
- Full data ownership
- Scalable architecture

**Investment:**
- Development: 3-4 months (part-time) or $5-8k (hire)
- Monthly: $35-40 (vs $200+ for tools)
- Payback: 1-2 months

**ROI:**
- Year 1 savings: $1,920
- Year 2+ savings: $2,400/year
- Plus: Custom features not available in standard tools

---

**Ready to start?** Begin with Phase 1 (Google Search Console integration) - it's free and provides immediate value!
