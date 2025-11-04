# Astro Lander 模板

以 Astro 建構的產品落地頁模板，包含結構化資料管理、可拆換的內容組件，以及主題／語言擴充預留。此專案已將舊版 `adar/landing.html` 重構為資料驅動的模組化結構。

## 快速開始

```bash
npm install
npm run dev    # 啟動開發伺服器 http://localhost:4321
npm run build  # 產出靜態頁面
```

## 資料結構說明

每個產品位於 `src/data/products/{sku}/` 目錄，並以兩個 JSON 分離結構化與文案資料：

- `product_data.json`  
  - `sku`／`name`：產品識別與顯示名稱  
  - `price`：`currency`、`current`、`original`  
  - `mainImage`：主圖路徑與替代文字  
  - `gallery`：畫廊圖集列表  
  - `meta`：給收銀台的額外屬性（顏色、容量等）
- `product_info.json`  
  - `topBar`、`hero`、`detailHtml`、`guarantee`、`comments`、`faq`、`purchase`、`stickyFooter`、`footer` 等文案與 HTML 片段  
    - `purchase.ctaLabel` 可使用 `{{price}}` 佔位符，自動替換為當前售價  
  - `detailHtml` 直接放入 AI 生成的 HTML 字串，組件以 `set:html` 注入  
  - `comments.activityMessages` 可提供動態輪播的提示語

## 組件與腳本

- `src/components/**`：每個區塊一個資料驅動的 Astro 組件，後續可在同資料夾內新增不同外觀變體。  
- `src/utils/loadProduct.ts`：一次載入 `product_data` 與 `product_info`，並透過 `loadProduct()` 暴露給頁面使用。  
- `src/scripts/landing-init.ts`：處理倒計時、庫存條、畫廊輪播、評論分頁、Sticky CTA、Checkout 表單等互動。頁面於底部輸出 `<script type="application/json" id="landing-runtime">` 傳遞執行時設定。

## 新增產品流程

1. 於 `src/data/products/` 複製 `adar-nordcharge` 資料夾並調整 SKU 名稱。  
2. 編輯 `product_data.json`：確認價格、圖檔（存放於 `public/products/{sku}/images/`）、meta。  
3. 編輯 `product_info.json`：調整英雄文案、`detailHtml`、FAQ、評論等。  
4. 如需替換圖片，將素材放入 `public/products/{sku}/images/` 並更新 JSON 中的路徑。  
5. 在 `src/config.ts` 指定新的 `defaultSku`，或於頁面依需求傳入 `loadProduct('{sku}')`。

## 主題與語言預留

- `ThemeScript`：於載入時讀取 `localStorage`／`prefers-color-scheme`，並暴露 `window.__LANDER_THEME__` 介面（`setTheme`、`getTheme`）。  
- `LocaleScript`：同步 `document.documentElement.lang` 並提供 `window.__LANDER_I18N__` 介面，後續可接入多語資源。  
- 頁面已注入 `availableThemes`、`supportedLocales`，可依需求加入實際的切換 UI。

## 測試與驗證

- `npm run build`：驗證 Astro 靜態輸出。  
- 於瀏覽器檢查：倒計時、庫存條、畫廊輪播、評論分頁、Sticky CTA、Checkout 跳轉是否正常。  
- 若要調整互動邏輯，請更新 `landing-init.ts` 並同步對應的 `data-*` 屬性。

## 檔案對照

- 原始參考：`adar/landing.html`、`adar/data/site-content.json`  
- 新模板入口：`src/pages/index.astro`  
- 靜態資源：`public/products/adar-nordcharge/images/*`
