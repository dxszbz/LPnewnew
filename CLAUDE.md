# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based product landing page template with data-driven architecture. The codebase uses a modular component system where product data is separated from presentation logic, enabling easy creation of multiple product landing pages from a single template.

## Development Commands

```bash
# Development
npm install                  # Install dependencies
npm run dev                  # Start dev server at http://localhost:4321
npm run build                # Build static site
npm run preview              # Preview production build
npm run check                # Run Astro type checking
```

## Architecture

### Data-Driven Product System

Products are organized under `src/data/products/{sku}/` with two key JSON files:

- **`product_data.json`**: Structured data (SKU, pricing, images, meta attributes for checkout)
- **`product_info.json`**: Content and copy (hero text, HTML details, FAQs, comments, guarantees)

The `loadProduct()` utility (src/utils/loadProduct.ts) merges both files and caches the result. Products are lazy-loaded using Vite's `import.meta.glob()`.

### Component Structure

Components are organized by section in `src/components/`, each representing a landing page block:
- TopBar, HeroSection, ProductDetails, Comments, Guarantee, FAQ, BuySection, MobileStickyFooter, Footer
- Components accept product data/info as props and render accordingly
- Each component folder can contain multiple visual variants

### Client-Side Interactivity

All client-side logic lives in `src/scripts/`:
- **`landing-init.ts`**: Main entry point that initializes all modules
- **`modules/`**: Individual feature modules (countdown, stockMeter, heroCarousel, comments, checkout, etc.)
- **`utils/`**: Shared utilities (lazyMedia, icons, runtimeConfig)

Runtime configuration is passed from Astro to client via `<script type="application/json" id="landing-runtime">`.

### Product Feed Integration

The `astro.config.mjs` includes a custom integration (`productFeedIntegration`) that:
- Generates `/data/product.json` with all products' ID, name, and price
- Auto-refreshes during dev when `src/data/products/` files change
- Writes the feed to `dist/data/product.json` during build

### Checkout Flow

The checkout system (src/scripts/modules/checkout.ts) constructs a checkout URL with:
- Base endpoint from `src/config.ts` (`siteConfig.checkout.endpoint`)
- Serialized product metadata (base64-encoded)
- Quantity and price parameters
- Redirects to external checkout service

### Theme and Internationalization

- **Theme**: `ThemeScript` manages system/day/night themes via localStorage, exposes `window.__LANDER_THEME__`
- **i18n**: `LocaleScript` provides `window.__LANDER_I18N__` interface, supports en/fr/de/es/it/nl (framework ready, not fully implemented)

## Adding a New Product

### Automated AI Agent Workflow (Recommended)

Claude Code can automatically create product landing pages by analyzing product URLs. See [docs/agent-workflow-add-product.md](docs/agent-workflow-add-product.md) for the complete workflow.

**Quick command format**:
```
Add product from [URL], SKU: [sku], price $[current] (original $[original]), [sale event]
```

**Example**:
```
Add product from https://example.com/wireless-charger, SKU: wireless-10w, price $29 (original $59), flash sale
```

The AI agent will:
1. Parse your command and extract pricing/event details
2. Use Fetcher MCP to visit the product URL and analyze features, specs, and selling points
3. Generate conversion-optimized copy following copywriting frameworks (4U, PAS, AIDA)
4. Download and organize product images
5. Create complete `product_data.json` and `product_info.json` files
6. Verify the landing page renders correctly using chrome-devtools MCP

### Manual Method

1. Copy existing product folder in `src/data/products/` (e.g., duplicate `adar-nordcharge` to `new-sku`)
2. Edit `product_data.json`: Update SKU, name, price, images (store in `public/products/{sku}/images/`)
3. Edit `product_info.json`: Update copy for hero, details, FAQs, comments, etc.
4. Optional: Create `component-presets.json` to customize component variants
5. Update `src/config.ts` to set `defaultSku` if needed, or pass SKU to `loadProduct(sku)` in pages

**Detailed manual authoring guide**: [docs/guidelines.md](docs/guidelines.md)

## Key Configuration

`src/config.ts` (`siteConfig`) contains:
- `checkout.endpoint`: External checkout service URL
- `themes`: Available theme options
- `locales`: Supported languages
- `products.defaultSku`: Default product to load

## Image Handling

- Product images go in `public/products/{sku}/images/`
- Gallery images and main image are referenced in `product_data.json`
- LazyLoad is implemented via `vanilla-lazyload` (src/scripts/utils/lazyMedia.ts)
- Images use `data-src` attribute for lazy loading

## Tech Stack

- **Framework**: Astro 5.x (static site generation)
- **Styling**: Tailwind CSS 3.x (config in tailwind.config.cjs)
- **TypeScript**: Strict mode enabled
- **Client Libraries**: Swiper (carousels), Lucide (icons), vanilla-lazyload

## Important Notes

- All text in codebase and documentation is in Chinese (maintain this convention)
- **All product copy, UI text, and JSON content must be in English** (for international landing pages)
- The [AGENTS.md](AGENTS.md) file contains AI agent engineering workflow and quality standards
- The [docs/agent-workflow-add-product.md](docs/agent-workflow-add-product.md) defines automated product creation workflow
- The [docs/guidelines.md](docs/guidelines.md) provides detailed copywriting and authoring guidelines
- Product info HTML (`detailHtml`) is injected using Astro's `set:html` directive
- Placeholder `{{price}}` in `purchase.ctaLabel` is auto-replaced with current price
- Placeholder `{stock}` in `stickyFooter.stockMessage` is auto-replaced with live inventory count
- Comments system supports pagination and dynamic activity messages
- Sticky footer and stock alerts use IntersectionObserver for scroll-based visibility

## AI Agent Tools & MCP Servers

When Claude Code adds products automatically, it uses these MCP servers:

- **Fetcher MCP** (`mcp_servers.fetcher`): Fetch and analyze product pages from URLs
- **Chrome DevTools MCP** (`mcp_servers.chrome-devtools`): Validate rendered pages, check console errors, inspect DOM/styles
- **Context7** (optional): Query latest Astro/Tailwind documentation for best practices

See [docs/agent-workflow-add-product.md](docs/agent-workflow-add-product.md) for detailed agent workflow.
