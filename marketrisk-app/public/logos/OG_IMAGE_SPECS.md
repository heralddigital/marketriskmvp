# OpenGraph Image Specifications

**Required Location:** `/public/logos/og-image.png`

## Dimensions

- **Width:** 1200 pixels
- **Height:** 630 pixels
- **Aspect Ratio:** 1.91:1
- **Format:** PNG or JPG
- **Max File Size:** 8 MB (recommended: under 300KB)

## Design Requirements

### Brand Colors
- **Primary:** Mughal Green `#2F5232`
- **Secondary:** Pistachio `#8ACA74`
- **Background:** Gradient from `#2F5232` to `#1a2e1b`

### Content Structure

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              [MarketRisk Logo]                  │
│                                                 │
│       Credit Risk Analysis Platform             │
│                                                 │
│     Real-time monitoring for Romanian           │
│              businesses                         │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘
     1200px x 630px
```

### Typography
- **Headline:** 60-72px, Bold, White
- **Subtext:** 32-40px, Regular, White/90% opacity
- **Logo:** Centered at top, ~200px width

### Safe Zone
- Keep all text and important elements **80px from edges**
- Some platforms crop to square (600x600 centered)

## Testing Platforms

Your image will appear on:
- **Facebook:** News feed, shares, links
- **LinkedIn:** Post previews
- **Twitter:** Summary large image card
- **WhatsApp:** Link previews
- **Slack:** Link unfurling
- **Discord:** Embeds

## Quick Creation Options

### Option 1: Figma (Recommended)
1. Create 1200x630 frame
2. Add gradient background (#2F5232 → #1a2e1b)
3. Add MarketRisk logo (SVG import)
4. Add text layers with proper hierarchy
5. Export as PNG @1x

### Option 2: Canva
1. Use "Custom Size" template: 1200x630px
2. Search for "Social Media Header" templates
3. Customize with brand colors and text
4. Download as PNG

### Option 3: Adobe Photoshop
1. New file: 1200x630px, 72 DPI, RGB
2. Create gradient layer (brand colors)
3. Add logo and text
4. Save for Web (PNG-24)

### Option 4: Online Tool
```
https://www.opengraph.xyz/
https://ogimage.dev/
https://www.bannersnack.com/social-media-image-maker/
```

## Example Text Content

### Romanian
```
MarketRisk
Analiză Riscuri de Credit
Monitorizare în timp real pentru companii românești
```

### English
```
MarketRisk
Credit Risk Analysis
Real-time monitoring for Romanian businesses
```

## File Naming

✅ **Correct:** `og-image.png`
❌ **Incorrect:** `og_image.png`, `OG-Image.PNG`, `ogimage.png`

## Verification

After creating, verify:
1. File exists at `/public/logos/og-image.png`
2. Dimensions are exactly 1200x630
3. File size is under 1MB
4. Colors match brand guidelines
5. Text is readable at thumbnail size (400x210)

## Testing

Use these tools to preview:
- **Facebook:** https://developers.facebook.com/tools/debug/
- **LinkedIn:** https://www.linkedin.com/post-inspector/
- **Twitter:** https://cards-dev.twitter.com/validator

## Current Status

🔴 **NOT CREATED YET**

**Action Required:** Create this image before deploying to production.

**Priority:** High (affects social media sharing)

**Estimated Time:** 15-30 minutes

---

## Temporary Placeholder

Until you create the final image, you can use a simple placeholder:

1. Create a 1200x630 image with:
   - Solid #2F5232 background
   - White text: "MarketRisk"
   - No logo (text only)

2. Or use the MarketRisk logo SVG scaled to fit

This will prevent broken image errors but won't look professional for sharing.
