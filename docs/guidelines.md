# Product Authoring Guide

This guide shows how to add a new product that renders at `/products/{sku}` using the shared Astro landing template. Data is fully decoupled from presentation so you only edit JSON and images.

## What You’ll Build

- A new product folder under `src/data/products/{sku}/` with two JSON files:
  - `product_data.json` — structured data (SKU, price, images, checkout meta)
  - `product_info.json` — page copy and HTML content (hero, details, FAQs, etc.)
- Optional component preset: `component-presets.json` for selecting visual variants.
- Images under `public/products/{sku}/images/` referenced by absolute paths.

## Folder Structure

```
src/
  data/
    products/
      {sku}/
        product_data.json
        product_info.json
        component-presets.json   # optional
public/
  products/
    {sku}/
      images/
        01.jpg 02.jpg ...
```

## Quick Start

1) Duplicate an existing product folder, e.g. copy `src/data/products/adar-nordcharge` to `src/data/products/<your-sku>`.
2) Place your images in `public/products/<your-sku>/images/`.
3) Update `product_data.json` image URLs to match the new paths.
4) Edit `product_info.json` with your product copy and HTML details.
5) Dev run: `npm run dev` and open `/products/<your-sku>`.
6) Optional: set default product in `src/config.ts` (`products.defaultSku`).
7) Production build: `npm run build`.

## Copywriting Guidelines (Conversion‑First)

This template prioritizes conversion performance over conservative “terms‑style” compliance. Aim for clarity, urgency, and benefit‑first messaging while staying truthful and non‑deceptive.

Principles

- Lead with outcomes: state the user’s gain in the first line.
- Urgency and scarcity: time pressure (countdowns), live inventory, and social proof are expected patterns here.
- Specific beats vague: quantify benefits (e.g., “60% in 30 minutes”).
- Objection handling: anticipate top 3 objections and address them plainly (heat, compatibility, portability, etc.).
- Skimmable layout: short lines, bullets, bold benefits; avoid long blocks.
- Truthful claims: avoid unverifiable absolutes; prefer measurable statements.

Recommended frameworks

- PAS (Problem–Agitate–Solve): expose the pain → raise stakes → present fix.
- AIDA (Attention–Interest–Desire–Action): headline hook → proof → benefits → clear CTA.
- 4U (Useful–Urgent–Unique–Ultra‑specific): ensure at least 3 of the 4 in hero+CTA.

Tone and voice

- Direct‑response, confident, “decisive” tone. Prefer active verbs.
- Short headlines; avoid jargon. Keep subcopy 1–3 sentences.
- Use social proof and numbers to de‑risk decisions.

Section‑by‑section guidance (maps to product_info.json)

- topBar
  - Goal: immediate urgency + reason to act (deal ends, checkout closing, shipping perk).
  - Example: “Emergency drop: 10‑year risk‑free guarantee + BOGO bonus”.

- hero
  - headline: 7–12 words; outcome‑led. Example: “Snap‑on fast power. No cables. No dead phone.”
  - description: 1–2 sentences, may use light HTML; highlight 1 key mechanism (“smart heat control”, “20W”).
  - highlights: 3 bullets, each 3–6 words, measurable where possible.
  - inventoryCard: countdownLabel + stockLabel/Unit + stockAlert (explicit consequence). Keep trustSignals concrete (e.g., “10‑year warranty”, “Ships today”).
  - cta: imperative verb + time cue. Banner text: “X shoppers checking out now”. Note: reinforce safety (“256‑bit secured checkout”).

- detailHtml
  - Purpose: long‑form persuasion. Structure as short sections (h2 + 1–2 short paragraphs + scannable bullets). Use images/figures sparingly.
  - Framework: Pain → Use cases → Proof/Specs → Comparison → Offer reminder.
  - Keep paragraphs under ~80 words. Use benefit‑first subheads.

- guarantee
  - Title promises safety. Bullets remove risk (“30‑day money‑back”, “Free shipping”, “Secure checkout”).
  - CTA mirrors primary action and scrolls to purchase.

- comments
  - Mix professions and scenarios; keeps timestamps recent (2–8 hours) to imply freshness.
  - 4–8 reviews per page; 5‑star focus, avoid repeating phrasing.

- faq
  - Start with compatibility, safety/heat, flights/legal, pass‑through charging.
  - Each answer ≤ 2 sentences; avoid hedging language.

- purchase
  - subtitle: compress key specs with middots “·”.
  - ctaLabel: include {{price}} and an imperative: “Buy now — {{price}}”.
  - assurances: 3–6 short items reinforcing trust.

- stickyFooter
  - headline + countdown + stockMessage with `{stock}`; make the consequence explicit (“before price jumps back”).

Do/Don’t

- Do: quantify benefits; show social proof; use time‑bound words (“today”, “now”, “ends in”).
- Do: keep lines short; front‑load benefits; reuse the same primary verb across CTAs.
- Don’t: add scripts/iframes; promise medical/legal outcomes; use unverifiable superlatives.

## Tailwind in Custom HTML (detailHtml)

The base layout is built with Tailwind CSS. Any HTML you place in `detailHtml` can directly use Tailwind utility classes from this project. Keep styling consistent with existing components.

Recommended utility palette

- Layout: `container`, `mx-auto`, `grid`, `gap-6`, `sm:`, `md:`, `lg:` responsive prefixes.
- Spacing: `mt-*`, `mb-*`, `py-*`, `px-*` (use 2/4/6/10 commonly).
- Typography: `text-white`, `text-white/80`, `text-slate-300`, `font-bold`, `leading-relaxed`.
- Surfaces: `bg-slate-900/50`, `bg-slate-950/60`, `ring-1 ring-white/10`, `border border-white/10`.
- Shapes: `rounded-xl`, `rounded-2xl`, `rounded-3xl`.
- Accents: `text-brand-100`, `bg-brand-500`, `bg-warning-500`, `text-success-500`.
- Media: images with `lazyload` and `data-src` are auto‑initialized by the runtime. Include a `<noscript>` fallback.
- Icons: use Lucide via `data-lucide="icon-name"` — icons are auto‑hydrated by the runtime script.

HTML section skeleton (copy‑ready)

```
<section class="mt-12 rounded-3xl border border-white/5 bg-slate-900/50 p-6 sm:p-10">
  <h2 class="text-2xl font-bold text-white">Headline: state the outcome</h2>
  <p class="mt-3 text-sm text-white/70">1–2 sentences that clarify the gain and mechanism.</p>

  <div class="mt-6 grid gap-6 md:grid-cols-2">
    <div class="space-y-3">
      <h3 class="text-lg font-semibold text-white">Sub‑benefit</h3>
      <ul class="mt-2 space-y-2 text-sm text-white/75">
        <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-brand-500"></span> Specific proof point</li>
        <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-brand-500"></span> Objection handled</li>
      </ul>
    </div>
    <figure class="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60">
      <img class="lazyload h-full w-full object-cover" src="/placeholder.png" data-src="/products/{sku}/images/02.jpg" alt="Descriptive alt" />
      <noscript><img class="h-full w-full object-cover" src="/products/{sku}/images/02.jpg" alt="Descriptive alt" /></noscript>
    </figure>
  </div>

  <div class="mt-8 rounded-2xl border border-dashed border-brand-500/40 bg-slate-950/60 p-6">
    <p class="text-sm text-white/70"><i data-lucide="shield-check" class="h-4 w-4 text-success-500"></i> Risk‑reducer line (warranty, returns, shipping).</p>
  </div>
</section>
```

Consistency checklist for custom HTML

- Colors: prefer slate/brand/success/warning tones already used in components.
- Rings/Borders: keep `ring-white/10` or `border-white/10` for subtle depth; avoid harsh blacks.
- Headings: h2 for section title, h3 for sub‑blocks; keep to 1–2 sentence paragraphs.
- Accessibility: always include meaningful `alt`; avoid text embedded in images.

## product_data.json — schema (summary)

- `sku`: string — unique product ID, also used in route.
- `name`: string — product display name.
- `price`: `{ currency: string; current: number; original?: number }`.
- `mainImage`: `{ url: string; alt: string }` — primary image.
- `gallery`: `Array<{ url: string; alt: string }>` — thumbnails/slider items (fallbacks to `mainImage` if empty).
- `meta?`: `Record<string, unknown> | string` — serialized metadata for checkout; will be base64-encoded on submit.

Minimal example

```
{
  "sku": "my-product",
  "name": "My Product",
  "price": { "currency": "USD", "current": 59, "original": 119 },
  "mainImage": { "url": "/products/my-product/images/01.jpg", "alt": "My Product hero" },
  "gallery": [
    { "url": "/products/my-product/images/01.jpg", "alt": "Front view" },
    { "url": "/products/my-product/images/02.jpg", "alt": "In use" }
  ],
  "meta": { "bundle": "single", "product_id": "my-product", "currency": "USD" }
}
```

## product_info.json — schema (authoring focus)

These fields are rendered across the landing sections and mirror the TypeScript types in `src/utils/types.ts`.

- `topBar`: `{ icon: string; message: string; countdownLabel: string }`
- `hero`:
  - `badgeLines`: `string[]`
  - `socialProof`: `{ icon: string; text: string }`
  - `headline`: `string`
  - `description`: `string` (HTML allowed; no scripts)
  - `highlights`: `string[]`
  - `inventoryCard`:
    - `countdownLabel`: `string`
    - `stockLabel`: `string`
    - `stockUnit`: `string`
    - `stockAlert`: `string`
    - `trustSignals`: `Array<{ icon: string; text: string }>`
  - `cta`:
    - `label`: `string`
    - `icon`: `string`
    - `banner`: `{ icon: string; text: string }`
    - `note`: `string`
- `countdown`: `{ durationSeconds: number }`
- `inventory`: `{ start: number; minimum: number }`
- `detailHtml`: `string` — rich HTML injected into the Product Details section.
- `guarantee`: `{ title: string; description: string; bullets: string[]; ctaLabel: string; ctaHref: string; note: string }`
- `comments`:
  - `headline`: `string`
  - `description`: `string`
  - `activity`: `string`
  - `perPage`: `number`
  - `pagination`: `{ previous: string; next: string }`
  - `activityMessages?`: `string[]`
  - `reviews`: `Array<{ name: string; timestamp: string; avatar: string; stars: number; content: string }>`
- `faq`: `Array<{ question: string; answer: string }>`
- `purchase`:
  - `title`: `string`
  - `subtitle`: `string`
  - `quantityLabel`: `string`
  - `ctaLabel`: `string` — supports `{{price}}` placeholder
  - `assurances`: `Array<{ icon: string; text: string }>`
  - `note`: `string`
  - `mediaAlt`: `string`
- `stickyFooter`: `{ headline: string; stockMessage: string; ctaLabel: string }` — `stockMessage` supports `{stock}` placeholder
- `footer`:
  - `columns`: `Array<{ title: string; body?: string; items?: string[] }>`
  - `copyright?`: `string`

Minimal example

```
{
  "topBar": {
    "icon": "sparkles",
    "message": "Limited drop: free express shipping today",
    "countdownLabel": "Checkout closes in"
  },
  "hero": {
    "badgeLines": ["Flash", "Deal"],
    "socialProof": { "icon": "star", "text": "Thousands of 5‑star reviews" },
    "headline": "Snap‑on fast power. No cables. No dead phone.",
    "description": "Charge 60% in 30 minutes with safe heat control.",
    "highlights": ["60% in 30 minutes", "Strong MagSafe hold", "LED power display"],
    "inventoryCard": {
      "countdownLabel": "Limited‑time sale ends in",
      "stockLabel": "Live inventory",
      "stockUnit": "sets",
      "stockAlert": "Only 20 sets left before price jumps back",
      "trustSignals": [
        { "icon": "shield-check", "text": "10‑year warranty" },
        { "icon": "truck", "text": "Worldwide free shipping" }
      ]
    },
    "cta": {
      "label": "Claim my order NOW",
      "icon": "arrow-right",
      "banner": { "icon": "users", "text": "Many shoppers are checking out now" },
      "note": "256‑bit secured checkout · 24/7 support · Easy returns"
    }
  },
  "countdown": { "durationSeconds": 900 },
  "inventory": { "start": 120, "minimum": 15 },
  "detailHtml": "<section><h2>Why it matters</h2><p>…</p></section>",
  "guarantee": {
    "title": "Shop with confidence",
    "description": "You’re protected from day one.",
    "bullets": ["30‑day money‑back", "1‑year warranty", "Secure checkout"],
    "ctaLabel": "Proceed to checkout",
    "ctaHref": "#purchase",
    "note": "No‑hassle returns"
  },
  "comments": {
    "headline": "Real reviews, real results",
    "description": "Verified buyers share how they use it daily.",
    "activity": "New 5‑star reviews are coming in",
    "perPage": 4,
    "pagination": { "previous": "Previous", "next": "Next" },
    "reviews": [
      {
        "name": "Taylor",
        "timestamp": "2 hours ago",
        "avatar": "https://i.pravatar.cc/80?img=1",
        "stars": 5,
        "content": "Snaps on firmly and charges fast."
      }
    ]
  },
  "faq": [
    { "question": "Does it work with Android phones?", "answer": "Yes — via USB‑C fast charging; use the magnetic ring for snap." }
  ],
  "purchase": {
    "title": "Complete your order",
    "subtitle": "Snap‑on fast power · 10,000 mAh · 20W USB‑C · LED display",
    "quantityLabel": "Quantity",
    "ctaLabel": "Buy now — {{price}}",
    "assurances": [
      { "icon": "truck", "text": "Free shipping" },
      { "icon": "rotate-ccw", "text": "Easy returns" },
      { "icon": "shield-check", "text": "Secure checkout" }
    ],
    "note": "256‑bit secured checkout · 30‑day money‑back guarantee",
    "mediaAlt": "Product hero image"
  },
  "stickyFooter": {
    "headline": "Deal ends in",
    "stockMessage": "Only {stock} sets left before price jumps back",
    "ctaLabel": "Grab mine now"
  },
  "footer": {
    "columns": [
      { "title": "Peace‑of‑mind promise", "body": "Risk‑free returns, worldwide shipping, and human support." },
      { "title": "Shop with confidence", "items": ["SSL encrypted checkout", "Payment protection"] }
    ]
  }
}
```

## Component Presets (optional)

Add `component-presets.json` to choose visual variants per section. Keys map to registered component names, e.g.:

```
{
  "layout": "BaseLayout",
  "topBar": "TopBar/Primary",
  "hero": "HeroSection/FlashDeal",
  "productDetails": "ProductDetails/RichHtml",
  "guarantee": "Guarantee/Promise",
  "comments": "Comments/DynamicGrid",
  "faq": "FAQ/BasicAccordion",
  "buySection": "BuySection/Primary",
  "mobileStickyFooter": "MobileStickyFooter/Primary",
  "footer": "Footer/SiteFooter",
  "copyright": "Copyright/Default"
}
```

## Authoring Rules and Tips

- Icons: use Lucide icon names (e.g., `sparkles`, `star`, `shield-check`, `arrow-right`).
- HTML safety: `detailHtml` and `hero.description` are injected with `set:html`. Do not include scripts, iframes, or remote JS/CSS.
- Placeholders:
  - `purchase.ctaLabel` supports `{{price}}` → replaced with current price.
  - `stickyFooter.stockMessage` supports `{stock}` → replaced with a live number.
- Copy style: benefit-first, concise, scannable; provide meaningful `alt` texts.
- Images: store under `/public/products/{sku}/images/` and reference with absolute paths.

## Verification Checklist

- Dev: `npm run dev` runs clean; page renders at `/products/{sku}`.
- Build: `npm run build` succeeds.
- Console: no errors/warnings; images resolve; icons render.
- Placeholders render correctly (`{{price}}`, `{stock}`).
- No scripts/iframes in HTML fields.

## Code References

- Types (single source of truth): `src/utils/types.ts`
- Product loader and cache: `src/utils/loadProduct.ts`
- Page routes and SSG: `src/pages/products/[productId].astro`
- Default SKU and site settings: `src/config.ts`
