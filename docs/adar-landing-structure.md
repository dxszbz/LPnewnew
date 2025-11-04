# A'DAR NordCharge 落地頁結構與資料整理

## 1. 區塊劃分
- **Top Bar 頂部公告**（`body` 頂部固定橫幅）：倒計時、保證文案、lucide 圖標。
- **Hero 區塊**：圖片輪播、優勢賣點、關鍵 CTA、庫存條、倒計時、標籤徽章。
- **Product Details 產品敘述**：目前由多段文案 + 配圖組成，包含痛點、解決方案、功能列表、場景展示等。
- **Comments 評論區**：動態渲染星級評論、分頁、最新評論提示。
- **Guarantee 保證區**：10 年保固、30 天退貨等賣點清單與 CTA。
- **FAQ 常見問題**：四條問答。
- **Buy Section 下單區**：產品價格、數量選擇、Checkout CTA、保障徽章。
- **Mobile Sticky Footer**：行動裝置底部浮動 CTA，顯示倒計時與庫存。
- **Footer 頁尾**：品牌承諾、購物保障、行動提醒。
- **其它腳本/元素**：畫廊輪播、倒計時、庫存動態、表單提交跳轉、IntersectionObserver 懶載、lucide icon 初始化等。

## 2. 結構化資料需求（將移轉至 `product_data.json`）
- `sku`：產品識別碼（與 productId 等同）。
- `name`：產品名稱。
- `price`：價格資訊（含 `currency`、`current`、`original`）。
- `mainImage`：主圖（`url`、`alt`）。
- `gallery`：輪播圖清單（每筆 `url`、`alt`）。
- `meta`：產品變體 / 屬性資訊（顏色、尺寸等，供下游收銀台使用）。

## 3. 非結構化資料需求（將移轉至 `product_info.json`）
- Hero 區塊所有文案（標題、副標、段落、CTA、提示語、徽章文字）。
- Product Details 內部 HTML（自由格式，用 AI 生成內容時可替換）。
- Guarantee、FAQ、Comments、Footer 等區塊文案。
- 倒計時提示語、庫存提示語、Review 區塊活動訊息。
- 圖片替代文字（如需覆寫）。

## 4. 靜態資源與依賴
- **圖片**：`adar/images/01.png` ~ `15.png` 及其他外部連結圖；需轉移至 Astro `public/`。
- **外部 CSS/JS**：Tailwind CDN、lucide；後續將改為本地建構（Tailwind 插件或對應等）。
- **本地 JSON**：`adar/data/site-content.json`（提供輪播圖與評論資料）可作為預設資料來源。

## 5. 互動腳本重點
- Hero 輪播：自動播放、滑動、點擊切換、懶載。
- 倒計時：三處顯示（Top Bar、Hero、Sticky Footer）。
- 庫存展示：主區與 Sticky Footer 動態更新條。
- Checkout 表單：組合 `CHECKOUT_CONFIG` 參數，Base64 編碼 `meta`，跳轉至 `apiEndpoint/?payload`。
- 評論分頁：透過 JSON 內容生成網格與分頁控制。

## 6. Astro 模板化注意事項
- 透過 Astro 組件將上述區塊拆分，並提供多外觀版本擴充。
- `product_data.json` 內容精簡，方便人工核對。
- `product_info.json` 承載所有可變文案及 HTML，支援多語系。
- 全站設定移轉至 `src/config.ts`，統一儲存 checkout endpoint、主題列表、語言列表等。
