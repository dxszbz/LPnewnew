# AI Agent Workflow: Add New Product

This document defines the automated workflow for Claude Code to add new products to the landing page template by analyzing product URLs and generating complete landing pages.

## Workflow Overview

```
User Input → Parse Requirements → Fetch Product Info → Generate Content → Create Files → Verify
```

## Phase 1: Parse User Command

### Input Format
User provides command in natural language, e.g.:
- "Add product from https://example.com/product-x, SKU: prod-x, sale price $49, original $99"
- "Create landing page for this URL: [URL], 50% off flash sale"
- "New product: [URL], BOGO deal, $79"

### Extract Parameters
Parse and extract:
1. **Product URL** (required): Target product page to analyze
2. **SKU** (required or auto-generate): Unique product identifier
3. **Pricing** (required):
   - Current price (sale/promotional price)
   - Original price (optional, for discount display)
   - Currency (default: USD)
4. **Sale Event** (optional): Flash sale, BOGO, limited-time offer, etc.
5. **Bundle Type** (optional): single, bogo, bundle-3, etc.

### Auto-generate SKU
If SKU not provided:
- Extract from URL path (e.g., `/product/magnetic-charger` → `magnetic-charger`)
- Sanitize: lowercase, replace spaces/special chars with hyphens
- Validate uniqueness against `src/data/products/` directory

## Phase 2: Fetch & Analyze Product

### Use Fetcher MCP
Call the Fetcher MCP server to visit the product URL and extract:

```json
{
  "tool": "mcp_servers.fetcher.fetch",
  "params": {
    "url": "[product_url]",
    "max_length": 50000
  }
}
```

### Extract Product Intelligence
From the fetched page content, identify:

1. **Product Identity**:
   - Product name/title
   - Brand name (if any)
   - Category/type (power bank, charger, gadget, etc.)

2. **Core Features & Specs**:
   - Key technical specifications (capacity, wattage, dimensions, etc.)
   - Main features (magnetic, wireless, fast charging, etc.)
   - Materials and build quality mentions

3. **Selling Points** (prioritize these):
   - Unique value propositions
   - Problem-solving benefits
   - Competitive advantages
   - Use case scenarios

4. **Visual Assets**:
   - Product image URLs (hero, gallery, lifestyle shots)
   - Note: Download and store locally in `public/products/{sku}/images/`

5. **Social Proof**:
   - Customer reviews/testimonials (if available)
   - Star ratings
   - Number of reviews/sales

6. **Technical Details**:
   - Compatibility information
   - Safety certifications
   - Warranty information

## Phase 3: Generate Landing Page Content

### Apply Copywriting Framework
Using the [docs/guidelines.md](docs/guidelines.md) principles, generate conversion-focused copy:

#### 3.1 Top Bar
- **Framework**: Urgency + Incentive
- **Elements**:
  - Icon: `sparkles`, `zap`, `flame`, `gift`
  - Message: Sale event + key benefit (e.g., "Flash drop: 10-year warranty + free shipping")
  - Countdown label: "Checkout closes in" / "Deal ends in"

#### 3.2 Hero Section
Apply **4U Framework** (Useful, Urgent, Unique, Ultra-specific):

**Badge Lines**:
- Line 1: Event type (Flash, Limited, Emergency)
- Line 2: Offer type (Deal, Drop, Sale)
- Line 3: Discount percentage (if applicable)

**Social Proof**:
- Format: "[Number] [audience] left 5-star raves"
- Make number believable (20K-100K range)

**Headline** (7-12 words, outcome-led):
- Template: "[Benefit]. [No pain point]. [No pain point]."
- Example: "Snap-on fast power. No cables. No dead phone."
- Focus on outcome, not features

**Description** (1-2 sentences):
- Mechanism + key spec + urgency trigger
- Template: "[Product] [action verb], delivers [spec] and [benefit]—[call to action]."

**Highlights** (3 bullets, 3-6 words each):
- Quantifiable benefits preferred
- Examples: "60% in 30 minutes", "10,000 mAh capacity", "10-year warranty"

**Inventory Card**:
- Countdown label: Match top bar or vary slightly
- Stock label: "Live inventory" / "Real-time stock"
- Stock unit: Contextualize (sets, units, pieces)
- Stock alert: Explicit consequence (e.g., "Only X left before price jumps to $Y")
- Trust signals (3-4): Pick from warranty, shipping, returns, support, certifications

**CTA**:
- Label: Imperative verb + urgency ("Claim my order NOW", "Grab mine before time runs out")
- Banner text: "[Number] shoppers are checking out now" (20-100 range)
- Note: Security + support + returns (e.g., "256-bit secured checkout · 24/7 support · Easy returns")

#### 3.3 Detail HTML Section
Structure using **PAS Framework** (Problem-Agitate-Solve):

**Section 1: Problem (Pain Points)**
```html
<h2>Stop letting [problem] make you anxious</h2>
<p>Frame problem as high-stakes, not "inconvenience"</p>
<ul>
  <li>3-4 specific pain scenarios with icons</li>
  <li>Use emotional + situational language</li>
</ul>
```

**Section 2: Solution (Features as Benefits)**
```html
<h3>Three frustrations solved in one [action]</h3>
<ul>
  <li>Core feature 1 → concrete benefit</li>
  <li>Core feature 2 → concrete benefit</li>
  <li>Core feature 3 → concrete benefit</li>
</ul>
```

**Section 3: Proof (Specs + Use Cases)**
```html
<h3>Specs that keep up all day</h3>
<p>Technical details as benefits</p>
<ul>
  <li>List key specs with context</li>
  <li>"In the box" contents</li>
</ul>
```

**Section 4: Confidence (Guarantees)**
```html
<h3>Confidence guarantees that remove hesitation</h3>
<ul>
  <li>Support availability</li>
  <li>Warranty terms</li>
  <li>Payment security</li>
</ul>
```

Use the HTML skeleton from guidelines.md and maintain Tailwind consistency.

#### 3.4 Comments/Reviews
Generate 6-12 realistic reviews:
- **Name format**: "[First name] [Last initial] | [Profession/Role]"
- **Timestamp**: 20 minutes to 8 hours ago (varied, recent)
- **Stars**: Mostly 5-star, occasional 4-star for authenticity
- **Content**:
  - 2-3 sentences
  - Specific use case + benefit realized
  - Natural language, avoid marketing speak
  - Mention specific features or scenarios
- **Avatars**: Use `https://i.pravatar.cc/80?img=[1-70]`

#### 3.5 FAQ Section
Generate 6-10 FAQs addressing common objections:
1. **Compatibility**: "Does it work with [device type]?"
2. **Safety**: "Is it safe for overnight charging?" / "Does it overheat?"
3. **Travel/Legal**: "Can I take it on flights?" / "Is it TSA-approved?"
4. **Charging**: "Does it support pass-through charging?"
5. **Warranty**: "What's covered under warranty?"
6. **Shipping**: "How long does delivery take?"
7. **Returns**: "What's the return policy?"
8. **Specifications**: Device-specific questions

Keep answers ≤2 sentences, confident tone, no hedging.

#### 3.6 Purchase Section
- **Title**: "Complete your order" / "Secure your [product]"
- **Subtitle**: Compress 4-5 key specs with middots (·)
- **CTA Label**: "Buy now — {{price}}" (placeholder will auto-replace)
- **Assurances**: 4-6 trust signals (shipping, returns, security, warranty, support)
- **Note**: Reinforce security and money-back guarantee

#### 3.7 Sticky Footer
- **Headline**: "Deal ends in" / "Limited stock alert"
- **Stock message**: "Only {stock} [units] left before [consequence]" (placeholder auto-replaces)
- **CTA**: Match primary CTA verb ("Grab mine now", "Claim my order")

#### 3.8 Footer
- **Column 1**: Brand promise/peace-of-mind statement
- **Column 2**: Shop with confidence (security, payment protection)
- **Column 3**: Support info (optional)
- **Copyright**: Auto-generate current year

### Countdown & Inventory Settings
- **Countdown duration**: 869-1800 seconds (15-30 minutes)
- **Inventory start**: 60-150 units (make believable for product type)
- **Inventory minimum**: 10-20% of start value

## Phase 4: Handle Images

### Image Download & Organization
1. Extract all product image URLs from fetched page
2. Download images using appropriate tool/MCP
3. Store in `/public/products/{sku}/images/`
4. Rename sequentially: `01.jpg`, `02.jpg`, `03.jpg`, etc.
5. Identify hero image (typically first/largest)

### Image References in JSON
- **mainImage**: `/products/{sku}/images/01.jpg`
- **gallery**: Array of all images with descriptive alt text
- Generate alt text based on:
  - Image content (front view, in use, detail shot, lifestyle, etc.)
  - Product name
  - Feature highlighted (if discernible)

### Fallback for Image Issues
If images cannot be downloaded or processed:
1. Note the URLs in JSON with external links
2. Warn user to manually download and organize images
3. Provide instructions for image placement

## Phase 5: Generate JSON Files

### product_data.json Structure
```json
{
  "sku": "{auto-generated or provided}",
  "name": "{extracted product name}",
  "price": {
    "currency": "{USD or extracted}",
    "current": {parsed from user input},
    "original": {parsed from user input, optional}
  },
  "mainImage": {
    "url": "/products/{sku}/images/01.jpg",
    "alt": "{Product name} hero image"
  },
  "gallery": [
    { "url": "/products/{sku}/images/01.jpg", "alt": "{descriptive}" },
    // ... all images
  ],
  "meta": {
    "bundle": "{single|bogo|bundle-3}",
    "product_id": "{sku}",
    "currency": "{currency}",
    // ... additional metadata from parsed content
  }
}
```

### product_info.json Structure
Generate complete JSON following the schema in guidelines.md, populated with:
- All copywriting generated in Phase 3
- Proper icon names (Lucide icons)
- Countdown and inventory settings
- Reviews with realistic timestamps
- FAQ content addressing product-specific concerns
- All CTA labels with proper placeholders

### component-presets.json (Optional)
Use default presets unless user specifies variants:
```json
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
  "footer": "Footer/SiteFooter"
}
```

## Phase 6: Create Files & Directory Structure

### File Operations
1. **Create directory**: `src/data/products/{sku}/`
2. **Create image directory**: `public/products/{sku}/images/`
3. **Write files**:
   - `src/data/products/{sku}/product_data.json`
   - `src/data/products/{sku}/product_info.json`
   - `src/data/products/{sku}/component-presets.json` (optional)
4. **Download and save images** to `public/products/{sku}/images/`

### Checklist Before File Creation
- [ ] SKU is unique (no existing folder with same name)
- [ ] All required fields populated in both JSON files
- [ ] Image paths reference correct SKU directory
- [ ] Icon names are valid Lucide icons
- [ ] Placeholder syntax is correct ({{price}}, {stock})
- [ ] HTML in detailHtml follows Tailwind conventions
- [ ] No scripts/iframes in HTML content
- [ ] All JSON is valid (no syntax errors)

## Phase 7: Verification & Testing

### Automated Checks
```bash
# 1. Run dev server
npm run dev

# 2. Visit product page
# Navigate to: http://localhost:4321/products/{sku}

# 3. Check console for errors (use chrome-devtools MCP)
# - No JavaScript errors
# - All images load (no 404s)
# - Icons render correctly
# - No missing data warnings

# 4. Validate build
npm run build
```

### Visual Verification Checklist
Use `mcp_servers.chrome-devtools` to verify:
- [ ] Page renders without errors
- [ ] All images display correctly
- [ ] Countdown timer initializes and counts down
- [ ] Stock meter shows and updates
- [ ] Hero carousel/slider works (if multiple images)
- [ ] Comments section renders reviews
- [ ] FAQ accordion functions
- [ ] CTA buttons have correct URLs
- [ ] Sticky footer appears on scroll
- [ ] Price displays correctly ({{price}} replaced)
- [ ] Stock number displays correctly ({stock} replaced)
- [ ] Mobile responsive layout works
- [ ] No console errors or warnings

### Manual Review Points
- [ ] Copy tone matches brand voice (conversion-focused, benefit-first)
- [ ] Product name and specs accurate to source
- [ ] Pricing matches user input
- [ ] Sale event messaging consistent throughout
- [ ] Trust signals and guarantees realistic and compelling
- [ ] Reviews sound authentic and varied
- [ ] FAQ addresses actual product concerns
- [ ] HTML sections follow logical persuasion flow (PAS)
- [ ] No spelling/grammar errors in English UI text

## Phase 8: User Handoff & Documentation

### Success Report
Provide user with:
```
✅ Product landing page created successfully!

**Product**: {Product Name}
**SKU**: {sku}
**URL**: http://localhost:4321/products/{sku}

**Files Created**:
- src/data/products/{sku}/product_data.json
- src/data/products/{sku}/product_info.json
- public/products/{sku}/images/ ({N} images)

**Next Steps**:
1. Review the landing page at the URL above
2. Verify product details and copy accuracy
3. Adjust pricing or copy in JSON files if needed
4. Run `npm run build` for production build

**Configuration**:
- Sale event: {event type}
- Current price: {currency}{current_price}
- Original price: {currency}{original_price} ({discount}% off)
- Countdown: {duration} seconds
- Stock range: {start} → {minimum} units
```

### Troubleshooting Guide
If issues arise:

**Images not loading**:
- Check file paths in product_data.json
- Verify images exist in `public/products/{sku}/images/`
- Ensure filenames match exactly (case-sensitive)

**Icons not rendering**:
- Verify icon names are valid Lucide icons
- Check Lucide initialization in scripts

**Placeholders not replacing**:
- Confirm {{price}} in purchase.ctaLabel
- Confirm {stock} in stickyFooter.stockMessage
- Check runtime initialization scripts

**Page not rendering**:
- Validate JSON syntax (use JSON validator)
- Check for required fields in product_data.json
- Verify SKU matches directory name

## Error Handling

### Graceful Failures
If any phase fails:
1. **Log the error** clearly with context
2. **Report to user** what failed and why
3. **Provide partial results** if possible (e.g., JSON without images)
4. **Offer manual completion steps**

### Common Error Scenarios

**Fetcher fails to access URL**:
- Check if URL is accessible
- Try alternate fetch methods
- Ask user to provide product info manually

**Cannot extract product info**:
- URL might be a login-protected page
- Non-standard e-commerce structure
- Ask user for key details (name, features, specs)

**Image download fails**:
- Network issues or protected images
- Provide image URLs to user for manual download
- Create JSON with placeholder paths

**SKU conflict**:
- Generated SKU already exists
- Append number suffix (-2, -3, etc.) or ask user for alternative

## Best Practices

### Content Quality
1. **Benefit over feature**: Always translate features to user benefits
2. **Specific over vague**: Use numbers, timeframes, and concrete outcomes
3. **Urgent over neutral**: Leverage scarcity and time pressure appropriately
4. **Truthful over exaggerated**: Avoid unverifiable claims
5. **Scannable over dense**: Short paragraphs, bullets, bold key points

### Technical Quality
1. **Valid JSON**: Always validate before writing files
2. **Consistent paths**: Use absolute paths from public root
3. **Semantic alt text**: Describe images meaningfully
4. **Responsive HTML**: Use Tailwind responsive utilities
5. **Performance**: Lazy-load images, optimize bundle size

### Tone Consistency
- All **Chinese** for: AI agent responses, code comments, documentation
- All **English** for: Product copy, UI text, JSON content, HTML content
- Maintain **direct-response, confident** tone in product copy
- Keep **technical, precise** tone in specifications

## Integration with AGENTS.md

This workflow follows AGENTS.md principles:
1. ✅ **Context7 first**: Use latest Astro/Tailwind docs if needed
2. ✅ **Tool-first**: Leverage Fetcher MCP for product analysis
3. ✅ **chrome-devtools**: Validate rendered output
4. ✅ **Transparent**: Log all key decisions and data sources
5. ✅ **Result-oriented**: Final page must render error-free

## Example Command Execution

**User Input**:
> "Add product from https://example.com/magsafe-battery, SKU magsafe-10k, flash sale $39 from $79, BOGO deal"

**Agent Execution**:
```
[Phase 1] ✓ Parsed: SKU=magsafe-10k, price=$39/$79, event=flash+BOGO
[Phase 2] ✓ Fetched product page (15,234 chars)
[Phase 2] ✓ Extracted: "MagSafe 10000mAh Power Bank", 20W fast charge, wireless...
[Phase 3] ✓ Generated hero copy with 4U framework
[Phase 3] ✓ Generated detailHtml with PAS structure (3,421 chars)
[Phase 3] ✓ Generated 8 reviews, 7 FAQs
[Phase 4] ✓ Downloaded 12 images → public/products/magsafe-10k/images/
[Phase 5] ✓ Created product_data.json (892 bytes)
[Phase 5] ✓ Created product_info.json (8,341 bytes)
[Phase 6] ✓ All files written successfully
[Phase 7] ✓ Dev server validation passed
[Phase 7] ✓ Chrome DevTools check: 0 errors, 0 warnings

✅ Product page ready: http://localhost:4321/products/magsafe-10k
```

---

**Version**: 1.0
**Last Updated**: 2025-11-13
**Maintainer**: Claude Code AI Agent
