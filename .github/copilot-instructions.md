# Copilot Instructions for Banaras Insider

This repository contains the **Banaras Insider** website—a high-performance Next.js content platform focused on Varanasi travel guides and taxi booking services (KashiTaxi/Vinayak Travels).

## Project Overview

**Banaras Insider** is a Git-based CMS where all content is managed through Markdown files. The site combines SEO-optimized travel content with a lead generation funnel for taxi services.

### Key Business Context
- **Primary Service**: Taxi booking and tour packages for Varanasi (operated by Vinayak Travels/KashiTaxi)
- **Contact**: Primary booking number is +91-94503-01573 (24/7 call/WhatsApp)
- **Pricing Examples**: 
  - Pre-dawn ghat transfers: ₹700-1200 (sedan) / ₹1400-1800 (SUV)
  - Half-day packages: ₹1500-2000 (sedan) / ₹2400-3000 (SUV)
  - Full-day packages: ₹2200-3500 (sedan) / ₹3200-5000 (SUV)
  - Tempo travellers: ₹4500-7500 for groups

## Technology Stack

- **Framework**: Next.js 14.2.33
- **Runtime**: Node.js 20.x
- **Styling**: Tailwind CSS with CSS Modules
- **Content**: Markdown with gray-matter frontmatter
- **Markdown Processing**: remark, rehype, remark-gfm
- **UI Components**: Radix UI, Lucide icons, shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **Analytics**: Google Analytics 4
- **Deployment**: Vercel (production), Azure Functions (API routes in development)

## Project Structure

```
/
├── .github/              # GitHub configuration and workflows
├── api/                  # Azure Functions API (for dev environment)
├── components/           # Reusable React components
│   ├── ArticleSection/
│   ├── BookingWidget/
│   ├── CTA/              # Call-to-action components
│   ├── Header/
│   ├── Footer/
│   └── ...
├── content/              # All Markdown content files
│   ├── en/              # English articles
│   │   ├── destinations/
│   │   │   └── varanasi/
│   │   │       └── events/  # Event-specific pages (25K-40KB format)
│   │   └── *.md
│   └── hi/              # Hindi articles (translations)
├── pages/               # Next.js pages and routing
│   ├── api/            # API routes
│   ├── [lang]/         # Dynamic language routes
│   │   ├── index.js    # Blog index
│   │   └── [slug].js   # Dynamic article pages
│   └── index.js        # Homepage
├── lib/                # Helper functions (e.g., posts.js for Markdown)
├── public/             # Static assets
│   └── images/
│       └── posts/      # Article images
├── scripts/            # Build and content management scripts
├── styles/             # Global CSS
├── config/             # Configuration files
├── data/               # JSON data files
└── tests/              # Test files
```

## Coding Conventions

### JavaScript/React Standards
- Use **ES6+ syntax** (arrow functions, destructuring, async/await)
- Follow **Next.js conventions** for page routing and API routes
- Use **functional components** with React Hooks
- ESLint configuration in `.eslintrc.json` (extends "next")
- **Disabled rules**: 
  - `react/no-unescaped-entities`: off
  - `@next/next/no-html-link-for-pages`: off
  - `@next/next/no-img-element`: off

### CSS & Styling
- **Tailwind CSS** is the primary styling method
- Use **CSS Modules** for component-specific styles
- Follow shadcn/ui component patterns for UI components
- Tailwind config uses CSS variables for theming (see `tailwind.config.js`)
- Typography plugin enabled for Markdown content styling

### File Naming
- React components: PascalCase (e.g., `BookingWidget.js`)
- Pages: kebab-case or dynamic brackets (e.g., `[slug].js`)
- Content files: kebab-case (e.g., `varanasi-to-bodhgaya-tempo-traveller.md`)
- Scripts: kebab-case (e.g., `generate-sitemap.js`)

## Content Management

### Creating New Content

All content is managed as Markdown files in the `/content` directory.

#### Required Frontmatter Schema

Every Markdown file must include YAML frontmatter with these fields:

```yaml
---
lang: en                    # Language code (en or hi)
title: "Article Title"     # SEO-optimized title
description: "Meta description for SEO (compelling, 150-160 chars)"
date: 2025-08-27           # Publication date (YYYY-MM-DD)
tags: [tag1, tag2]         # Relevant tags
slug: article-slug         # URL slug (matches filename)
canonical: https://www.kashitaxi.in/en/article-slug  # Full canonical URL
relatedPosts:              # Optional: related article slugs
  - related-article-1
  - related-article-2
---
```

#### Content Guidelines
- **Images**: Place in `/public/images/posts/` and reference as `/images/posts/filename.jpg`
- **Markdown syntax**: Use standard Markdown (##, ###, lists, links, images)
- **Event pages**: Use comprehensive 25K-40KB format with:
  - JSON-LD schemas (Event, FAQPage, Service, LocalBusiness, TouristAttraction)
  - Detailed ritual/event guides
  - Taxi packages with pricing
  - Emergency contacts
  - Multiple CTAs (Call-to-Actions)

#### Bilingual Content
- English content in `/content/en/`
- Hindi translations in `/content/hi/`
- Maintain parallel file structure for both languages
- Use `hreflang` tags for language variants (implementation in `HREFLANG-IMPLEMENTATION.md`)

### Major Religious Festivals
The site covers three major Varanasi ritual bathing (snana/snan) festivals:
1. **Kartik Purnima** (November, Dev Deepawali)
2. **Mauni Amavasya** (January, silent bathing)
3. **Makar Sankranti** (January 14, kite festival)

Each has unique spiritual significance and attracts large pilgrim crowds.

## Build, Test & Development

### Prerequisites
- Node.js 20.x
- npm (comes with Node.js)

### Installation
```bash
npm install
```

### Development Commands
```bash
# Start development server (localhost:3000)
npm run dev

# Start Azure Functions API (localhost:7071)
npm run dev:api

# Start both dev server and API
npm run dev:full

# Build for production
npm run build

# Start production server (must build first)
npm start

# Run ESLint
npm run lint

# Generate sitemap
npm run generate-sitemap

# Update breadcrumb JSON-LD
npm run update:breadcrumbs
```

### Testing
- Test files in `/tests` directory
- Uses Playwright for testing (config in `playwright.config.ts`)
- Run specific test: Check test files for patterns

### Environment Variables
Create `.env.local` for local development:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # Google Analytics 4 property ID
```

Default GA4 property: `G-57P08K8G17` (only override if needed)

## API Routes & Functions

- **Development**: API routes proxy to Azure Functions on `localhost:7071`
- **Production**: API routes handled by Vercel/serverless functions
- API directory: `/api` (Azure Functions) and `/pages/api` (Next.js routes)

## Git Workflow

### Before Committing
1. **Lint your code**: `npm run lint`
2. **Test locally**: `npm run dev` and verify changes
3. **Build check**: `npm run build` (if making structural changes)

### Commit Guidelines
- Write clear, descriptive commit messages
- Keep commits focused on a single concern
- Reference issue numbers when applicable

### Protected Files
- **Do not modify** or commit:
  - `node_modules/` (ignored)
  - `.next/` (build output, ignored)
  - `out/` (export output, ignored)
  - `docs/` (ignored via .gitignore)
  - `.env.local` (local environment, ignored)
  - `api/local.settings.json` (ignored)

## Security & Compliance

### Security Best Practices
- **Never commit secrets or API keys** to the repository
- Use environment variables for sensitive data (`.env.local`)
- API keys should be stored in deployment platform's environment settings
- The booking contact number (+91-94503-01573) is public information and safe to include in content

### Content Security
- All user-submitted content through forms should be validated
- Use React Hook Form with Zod validation for form handling
- API routes should validate and sanitize inputs

### SEO & Analytics
- Google Analytics tracking is automatic when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
- Canonical URLs must be included in all content frontmatter
- Use proper meta tags for SEO (handled by page components)

## Component Architecture

### Component Patterns
- **Presentation components**: Pure UI components in `/components`
- **Layout components**: Header, Footer, Hero sections
- **CTA components**: Call-to-action sections for lead generation
- **Booking components**: BookingWidget, HeroBookingWidget for taxi booking
- **Content components**: ArticleSection, ClusterDirectory for content display

### shadcn/ui Components
- Configuration in `components.json`
- Style: default, with CSS variables
- Base color: slate
- Components use Radix UI primitives
- Import from `@/components` and `@/lib/utils`

## Scripts & Automation

Key scripts in `/scripts` directory:
- `generate-sitemap.js`: Creates XML sitemap
- `update-jsonld-breadcrumbs.js`: Updates structured data
- `verify-cta.py`: Verifies CTA coverage (Python)
- `audit-content-translation.js`: Checks translation completeness
- `submit-to-google.js`: Google Search Console submission

## Documentation References

Comprehensive documentation in `/docs` (not committed to repo):
- `CTA-COVERAGE-SUMMARY.md`: CTA implementation guide
- `SEO-OPTIMIZATION-SUMMARY.md`: SEO best practices
- `HREFLANG-IMPLEMENTATION.md`: Multilingual SEO setup
- `ROUTE-PAGES-IMPLEMENTATION-SUMMARY.md`: Route page patterns
- `LEAD-CAPTURE-SYSTEM.md`: Lead generation system
- `SERVICE-PAGE-STRUCTURE.md`: Service page format
- Various content calendars and keyword research files

## Acceptance Criteria for Changes

When making changes, ensure:
1. **Code quality**:
   - Passes ESLint (`npm run lint`)
   - Builds successfully (`npm run build`)
   - No console errors in development mode

2. **Content changes**:
   - All required frontmatter fields are present
   - Images are optimized and properly referenced
   - Links work and point to correct URLs
   - Canonical URLs are correctly formatted

3. **Component changes**:
   - Component follows existing patterns
   - Responsive design works (mobile, tablet, desktop)
   - Tailwind classes are used appropriately
   - No prop-types errors

4. **Testing**:
   - Manual testing in development mode
   - No broken pages or routes
   - Forms work as expected
   - CTAs are properly displayed

5. **SEO compliance**:
   - Meta tags are present
   - Structured data (JSON-LD) is valid
   - Images have alt text
   - Links have descriptive text

## Common Tasks & Patterns

### Adding a New Article
1. Create Markdown file in `/content/en/` or `/content/hi/`
2. Add complete frontmatter with all required fields
3. Write content using Markdown syntax
4. Add images to `/public/images/posts/`
5. Reference images in Markdown: `![Alt text](/images/posts/image.jpg)`
6. Build and test locally
7. Commit and deploy

### Adding a New Component
1. Create component directory in `/components/ComponentName/`
2. Create main file: `ComponentName.js`
3. Add styles if needed (CSS Module or Tailwind)
4. Export component
5. Import in pages where needed
6. Test responsive behavior

### Updating Taxi Pricing
Taxi pricing appears in multiple locations. When updating:
1. Update event page content files (e.g., `/content/en/destinations/varanasi/events/*.md`)
2. Update any pricing components or data files
3. Ensure consistency across English and Hindi versions
4. Verify displayed prices match updated values

### Adding Structured Data (JSON-LD)
Event pages include comprehensive JSON-LD schemas:
- Event schema (for festivals/events)
- FAQPage schema (for FAQ sections)
- Service schema (for taxi services)
- LocalBusiness schema (for KashiTaxi business info)
- TouristAttraction schema (for destinations)

Reference existing event pages for examples.

## Tips for Copilot

- **Content is king**: This is primarily a content site. Most changes involve adding/updating Markdown content.
- **SEO matters**: All content changes should maintain or improve SEO. Include meta descriptions, proper headings, structured data.
- **Mobile-first**: Always consider mobile users. Varanasi tourists frequently access the site on mobile.
- **Lead generation**: CTAs are critical. Maintain prominent placement of booking widgets and contact information.
- **Bilingual support**: When adding content, consider both English and Hindi versions.
- **Performance**: Keep images optimized. Next.js Image component is preferred for images when possible.
- **Local context**: Understand that this is for Varanasi, India—a major pilgrimage destination with specific cultural and religious significance.

## Questions?

If you need clarification:
- Check existing content files for patterns
- Review documentation in `/docs` (if accessible)
- Look at similar components for reference
- Follow Next.js best practices
- When in doubt, maintain consistency with existing code
