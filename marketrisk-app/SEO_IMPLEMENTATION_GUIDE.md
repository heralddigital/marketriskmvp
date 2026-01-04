# SEO Implementation Guide

**Date:** January 4, 2026
**Status:** Ready to Apply
**Phase:** Phase 3 Complete - Implementation Examples Created

---

## Overview

This guide shows you how to apply the SEO utilities created in Phase 3 to your existing pages. All the infrastructure is in place - you just need to update your page components.

---

## What Was Built

### ✅ Core Infrastructure (Already Applied)

1. **SEO Utilities**
   - `/lib/seo/schema.ts` - Schema.org structured data generators
   - `/lib/seo/metadata.ts` - Next.js metadata generators
   - `/components/seo/JsonLd.tsx` - JSON-LD component
   - `/components/seo/Breadcrumbs.tsx` - Breadcrumb navigation with schema

2. **Global SEO** (Already Active)
   - `/app/layout.tsx` - Organization and Website schemas embedded
   - `/app/sitemap.ts` - Dynamic sitemap with PayloadCMS integration
   - `/public/robots.txt` - Updated robots directives

### ✅ Example Implementations (Templates Created)

Created SEO-enabled versions of pages as examples:

1. **Blog Pages**
   - `/app/[locale]/(marketing)/blog/page-new.tsx` - Blog index with metadata
   - `/app/[locale]/(marketing)/blog/[slug]/page-new.tsx` - Blog post with full SEO
   - `/app/[locale]/(marketing)/blog/BlogClient.tsx` - Client component for blog

2. **Marketing Pages**
   - `/app/[locale]/(marketing)/about/page-with-seo.tsx` - About page
   - `/app/[locale]/(marketing)/pricing/page-with-seo.tsx` - Pricing page
   - `/app/[locale]/(marketing)/contact/page-with-seo.tsx` - Contact page

---

## How to Apply SEO to Your Pages

### Option 1: Quick Method (Use Examples as Templates)

The example files (`*-with-seo.tsx` and `*-new.tsx`) are production-ready. You can:

1. **Rename the files** to replace your existing pages:
   ```bash
   # Blog index
   mv app/[locale]/(marketing)/blog/page.tsx app/[locale]/(marketing)/blog/page-old.tsx
   mv app/[locale]/(marketing)/blog/page-new.tsx app/[locale]/(marketing)/blog/page.tsx

   # Blog post
   mv app/[locale]/(marketing)/blog/[slug]/page.tsx app/[locale]/(marketing)/blog/[slug]/page-old.tsx
   mv app/[locale]/(marketing)/blog/[slug]/page-new.tsx app/[locale]/(marketing)/blog/[slug]/page.tsx

   # About page
   mv app/[locale]/(marketing)/about/page.tsx app/[locale]/(marketing)/about/page-old.tsx
   mv app/[locale]/(marketing)/about/page-with-seo.tsx app/[locale]/(marketing)/about/page.tsx

   # Repeat for pricing, contact, etc.
   ```

2. **Test the pages** to ensure everything works
3. **Delete the old files** once confirmed

### Option 2: Manual Method (Update Existing Pages)

If you want to keep your existing page structure, follow this pattern:

#### For Client Components (like current homepage)

**Before:**
```typescript
'use client'

export default function HomePage() {
  return <div>Content</div>
}
```

**After:**
```typescript
import { Metadata } from 'next'
import { generateMarketingPageMetadata } from '@/lib/seo/metadata'
import { getOrganizationSchema } from '@/lib/seo/schema'
import { JsonLd } from '@/components/seo/JsonLd'
import HomeClient from './HomeClient' // Move client logic here

interface HomePageProps {
  params: Promise<{
    locale: 'ro' | 'en'
  }>
}

// Server Component for metadata
export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params
  return generateMarketingPageMetadata('home', locale)
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  const schema = getOrganizationSchema(locale)

  return (
    <>
      <JsonLd data={schema} />
      <HomeClient locale={locale} />
    </>
  )
}
```

**Then create `HomeClient.tsx`:**
```typescript
'use client'

export default function HomeClient({ locale }: { locale: 'ro' | 'en' }) {
  // All your existing client-side logic here
  return <div>Content</div>
}
```

#### For Server Components

**Add to the top of your page file:**
```typescript
import { Metadata } from 'next'
import { generateMarketingPageMetadata } from '@/lib/seo/metadata'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'

export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params
  return generateMarketingPageMetadata('page-name', locale) // Use: home, about, pricing, contact, faq, privacy, terms
}
```

**Add to your component:**
```typescript
export default async function YourPage({ params }) {
  const { locale } = await params

  // Add breadcrumbs if needed
  const breadcrumbs = [
    { name: 'Section', href: `/${locale}/section` },
    { name: 'Page', href: `/${locale}/section/page` }
  ]

  return (
    <>
      <Breadcrumbs items={breadcrumbs} locale={locale} />
      {/* Your existing content */}
    </>
  )
}
```

---

## Page-by-Page Checklist

### Blog Pages

- [ ] **Blog Index** (`/blog/page.tsx`)
  - [ ] Replace with `page-new.tsx` OR add `generateMetadata()` function
  - [ ] Integrate with PayloadCMS using `getBlogPosts()`
  - [ ] Use `BlogClient` component for client-side functionality

- [ ] **Blog Post** (`/blog/[slug]/page.tsx`)
  - [ ] Replace with `page-new.tsx` OR add full SEO implementation
  - [ ] Add `generateBlogPostMetadata()` for OpenGraph/Twitter Cards
  - [ ] Add `getBlogPostSchema()` for Article structured data
  - [ ] Add `Breadcrumbs` component
  - [ ] Integrate with PayloadCMS using `getBlogPost()`

### Marketing Pages

- [ ] **Homepage** (`/page.tsx`)
  - [ ] Add `generateMetadata()` using `generateMarketingPageMetadata('home', locale)`
  - [ ] Add Organization schema (already global, but can add page-specific)

- [ ] **About** (`/about/page.tsx`)
  - [ ] Replace with `page-with-seo.tsx` OR add metadata manually
  - [ ] Add breadcrumbs
  - [ ] Add Organization schema

- [ ] **Pricing** (`/pricing/page.tsx`)
  - [ ] Replace with `page-with-seo.tsx` OR add metadata manually
  - [ ] Add breadcrumbs
  - [ ] Consider adding PriceSpecification schema (future enhancement)

- [ ] **Contact** (`/contact/page.tsx`)
  - [ ] Replace with `page-with-seo.tsx` OR add metadata manually
  - [ ] Add breadcrumbs
  - [ ] Ensure contact info matches Organization schema

- [ ] **FAQ** (`/faq/page.tsx`)
  - [ ] Add `generateMetadata()`
  - [ ] Add `getFAQSchema()` from `/lib/seo/schema.ts`
  - [ ] Example:
     ```typescript
     const faqs = [
       { question: 'Q1?', answer: 'A1' },
       { question: 'Q2?', answer: 'A2' }
     ]
     const faqSchema = getFAQSchema(faqs)
     return <><JsonLd data={faqSchema} />...</>
     ```

- [ ] **Privacy** (`/privacy/page.tsx`)
  - [ ] Add `generateMarketingPageMetadata('privacy', locale)`
  - [ ] Set `noIndex: false` (privacy pages should be indexed)

- [ ] **Terms** (`/terms/page.tsx`)
  - [ ] Add `generateMarketingPageMetadata('terms', locale)`
  - [ ] Set `noIndex: false`

### Documentation Pages

- [ ] **Docs Index** (`/docs/page.tsx`)
  - [ ] Add metadata
  - [ ] Integrate with PayloadCMS using `getDocumentation()`

- [ ] **Docs Page** (`/docs/[slug]/page.tsx`)
  - [ ] Add `generateDocumentationMetadata()`
  - [ ] Add `getDocumentationSchema()` for TechArticle
  - [ ] Add breadcrumbs with category structure

### Dashboard Pages (Authenticated)

- [ ] **All dashboard pages** (`/app/**`)
  - [ ] Add `generateDashboardMetadata('page-name', locale)`
  - [ ] These pages have `noIndex: true` by default (correct for auth pages)

---

## Critical Assets Needed

### 1. OpenGraph Image

Create a 1200x630px image at `/public/logos/og-image.png`

**Requirements:**
- **Size:** Exactly 1200 x 630 pixels
- **Format:** PNG or JPG
- **Content:**
  - MarketRisk logo
  - Tagline: "Credit Risk Analysis for Romanian Companies"
  - Background: Mughal Green (#2F5232) gradient
  - Clean, professional design
  - Text readable at small sizes

**Quick option:** Use Figma/Canva template:
```
Background: Gradient from #2F5232 to #1a2e1b
Logo: MarketRisk (centered top)
Text: "Credit Risk Analysis" (large, center)
Subtext: "Real-time monitoring for Romanian businesses"
```

### 2. Logo Files

Ensure these exist:
- `/public/logos/logo.svg` - Main logo (already exists)
- `/public/logos/og-image.png` - Social sharing image (1200x630)
- `/public/logos/favicon.ico` - Favicon (optional enhancement)

---

## Testing Your SEO Implementation

### 1. Local Testing

```bash
npm run dev
# Visit http://localhost:3000/ro
```

**Check:**
- [ ] Page title in browser tab is correct
- [ ] View source and find `<script type="application/ld+json">` tags
- [ ] Breadcrumbs render correctly
- [ ] No console errors

### 2. Metadata Validation

**View Page Source:**
```html
<!-- Should see: -->
<title>Your Page Title - MarketRisk</title>
<meta property="og:title" content="Your Page Title" />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://marketrisk.ro/logos/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />

<!-- And JSON-LD: -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MarketRisk",
  ...
}
</script>
```

### 3. Online Tools

Once deployed, test with:

**Google Rich Results Test:**
```
https://search.google.com/test/rich-results
# Enter your page URL
# Verify all schemas are detected
```

**Schema.org Validator:**
```
https://validator.schema.org/
# Copy your JSON-LD from page source
# Paste and validate
```

**OpenGraph Debugger:**
```
# Facebook
https://developers.facebook.com/tools/debug/
# LinkedIn
https://www.linkedin.com/post-inspector/
# Twitter
https://cards-dev.twitter.com/validator
```

**Lighthouse SEO Audit:**
```bash
# Run in Chrome DevTools
# Or use CLI:
npm install -g lighthouse
lighthouse http://localhost:3000/ro --only-categories=seo --view
```

**Target Score:** 95-100

### 4. Sitemap Check

Visit:
```
http://localhost:3000/sitemap.xml
```

**Verify:**
- [ ] All static pages present (ro and en)
- [ ] Blog posts included (if PayloadCMS connected)
- [ ] Documentation pages included
- [ ] Proper `lastModified` dates
- [ ] Hreflang alternates for bilingual pages

### 5. Robots.txt Check

Visit:
```
http://localhost:3000/robots.txt
```

**Verify:**
- [ ] Allows public pages (`Allow: /`)
- [ ] Disallows `/app/`, `/admin/`, `/api/`
- [ ] Allows `/uploads/`
- [ ] References sitemap

---

## Common Issues & Fixes

### Issue 1: "Cannot find module '@/lib/seo/schema'"

**Fix:** Ensure paths in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./"]
    }
  }
}
```

### Issue 2: Metadata not appearing

**Cause:** Using `'use client'` in page component

**Fix:** Split into Server Component (metadata) + Client Component (interactivity)

**Example:**
```typescript
// page.tsx (Server Component)
export async function generateMetadata() { ... }
export default function Page() {
  return <ClientComponent />
}

// ClientComponent.tsx
'use client'
export default function ClientComponent() { ... }
```

### Issue 3: PayloadCMS not available

**Expected:** Graceful fallback to static data

**Verify in code:**
```typescript
try {
  const posts = await getBlogPosts('ro', 100)
} catch (error) {
  console.warn('CMS not available:', error)
  // Falls back to static data
}
```

### Issue 4: OpenGraph image not showing

**Checklist:**
- [ ] Image exists at `/public/logos/og-image.png`
- [ ] Image is exactly 1200x630px
- [ ] File size under 8MB
- [ ] Using absolute URL in metadata
- [ ] Clear social media cache (Facebook debugger "Scrape Again")

---

## Deployment Checklist

Before deploying to production:

### Environment Variables

Add to `.env.production` or Vercel dashboard:
```bash
NEXT_PUBLIC_URL=https://marketrisk.ro
MONGODB_URI=your-mongodb-connection-string
PAYLOAD_SECRET=your-payload-secret
```

### Build Test

```bash
npm run build
npm run start
# Visit http://localhost:3000
# Test all pages
```

### Post-Deployment

1. **Submit Sitemap to Google**
   - Go to Google Search Console
   - Sitemaps → Add sitemap
   - Enter: `https://marketrisk.ro/sitemap.xml`

2. **Verify Schemas**
   - Use Rich Results Test on live URLs
   - Check all page types (home, blog, docs)

3. **Social Media Check**
   - Share a test link on Facebook/LinkedIn
   - Verify image and description appear correctly

4. **Monitor**
   - Check Google Search Console weekly
   - Monitor for schema errors
   - Track click-through rates

---

## Quick Reference: Available Functions

### Metadata Generators

```typescript
import {
  generateMetadata, // Custom metadata
  generateMarketingPageMetadata, // Marketing pages
  generateBlogPostMetadata, // Blog posts
  generateDocumentationMetadata, // Docs pages
  generateDashboardMetadata, // App pages
} from '@/lib/seo/metadata'

// Usage
export async function generateMetadata({ params }) {
  const { locale } = await params
  return generateMarketingPageMetadata('about', locale)
}
```

**Available page types for `generateMarketingPageMetadata`:**
- `'home'`, `'about'`, `'pricing'`, `'contact'`, `'faq'`, `'privacy'`, `'terms'`

**Available page types for `generateDashboardMetadata`:**
- `'dashboard'`, `'search'`, `'watchlist'`, `'alerts'`, `'history'`, `'settings'`

### Schema Generators

```typescript
import {
  getOrganizationSchema,
  getWebsiteSchema,
  getBlogPostSchema,
  getDocumentationSchema,
  getBreadcrumbSchema,
  getFAQSchema,
} from '@/lib/seo/schema'

// Usage
const schema = getOrganizationSchema('ro')
return <JsonLd data={schema} />
```

### Components

```typescript
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'

// JsonLd - Render schemas
<JsonLd data={schema} />
<JsonLd data={[schema1, schema2, schema3]} />

// Breadcrumbs - Navigation with schema
<Breadcrumbs
  items={[
    { name: 'Blog', href: '/ro/blog' },
    { name: 'Article', href: '/ro/blog/slug' }
  ]}
  locale="ro"
/>
```

---

## Next Steps After Implementation

1. **Week 1:** Apply SEO to all pages
2. **Week 2:** Create OpenGraph image, test all pages
3. **Week 3:** Deploy, submit sitemap, verify schemas
4. **Week 4:** Monitor Google Search Console, fix any issues

**Then move to Phase 4:** Stripe Payments Integration

---

## Support

- **Full Documentation:** See `PHASE_3_COMPLETE.md`
- **SEO Utilities:** `/lib/seo/`
- **Example Implementations:** `*-with-seo.tsx` and `*-new.tsx` files

---

**Implementation Status:** ✅ All utilities ready, examples created
**Action Required:** Apply to actual pages (Option 1 or 2 above)
**Estimated Time:** 2-4 hours for all pages
