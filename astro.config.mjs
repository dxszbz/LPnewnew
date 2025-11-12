import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const productsRoot = path.join(projectRoot, 'src', 'data', 'products');
const normalizedProductsRoot = path.normalize(productsRoot);
const FEED_ROUTE = '/data/product.json';

const readProductFeedData = async (logger) => {
  const entries = await fs.readdir(productsRoot, { withFileTypes: true }).catch(() => []);
  const products = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const productDir = path.join(productsRoot, entry.name);
    const productDataPath = path.join(productDir, 'product_data.json');

    try {
      const raw = await fs.readFile(productDataPath, 'utf-8');
      const data = JSON.parse(raw);
      const productId = data?.meta?.product_id ?? data?.sku ?? entry.name;
      const name = data?.name ?? data?.meta?.name ?? productId;
      const priceValue = typeof data?.price === 'object' ? data?.price?.current : data?.price;
      const price = Number(priceValue);

      if (!productId || !Number.isFinite(price)) {
        logger?.warn?.(`product_data.json 缺少必要欄位：${path.relative(projectRoot, productDataPath)}`);
        continue;
      }

      const normalizedPrice = Math.round(price * 100) / 100;
      products.push({ product_id: productId, name, price: normalizedPrice });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger?.warn?.(`無法處理 ${path.relative(projectRoot, productDataPath)}：${message}`);
    }
  }

  return products.sort((a, b) => a.product_id.localeCompare(b.product_id));
};

const toFeedJson = (payload) => JSON.stringify({ products: payload }, null, 2);

const writeFeedFile = async (filePath, payload, logger) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, toFeedJson(payload), 'utf-8');
  logger?.info?.(`[product-feed] 已輸出 ${path.relative(projectRoot, filePath)}`);
};

const productFeedIntegration = () => {
  let latestFeed = null;

  const refreshFeed = async (logger) => {
    latestFeed = await readProductFeedData(logger);
    return latestFeed;
  };

  const getFeed = async (logger) => {
    if (latestFeed) return latestFeed;
    return refreshFeed(logger);
  };

  return {
    name: 'product-feed-generator',
    hooks: {
      'astro:server:setup': ({ server, logger }) => {
        const serveFeed = (req, res, next) => {
          if (!req.url || !req.url.startsWith(FEED_ROUTE)) {
            next();
            return;
          }

          getFeed(logger)
            .then((feed) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(toFeedJson(feed));
            })
            .catch((error) => {
              const message = error instanceof Error ? error.message : String(error);
              logger?.error?.(`[product-feed] 開發伺服器產生失敗：${message}`);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Unable to generate product feed' }));
            });
        };

        server.middlewares.use(serveFeed);

        refreshFeed(logger).catch((error) => {
          const message = error instanceof Error ? error.message : String(error);
          logger?.error?.(`[product-feed] 初始化失敗：${message}`);
        });

        const watcher = server.watcher;
        const scheduleRefresh = (filePath) => {
          const normalized = path.normalize(filePath ?? '');
          const absolutePath = path.isAbsolute(normalized) ? normalized : path.join(projectRoot, normalized);
          const isInsideProductsDir =
            absolutePath === normalizedProductsRoot || absolutePath.startsWith(`${normalizedProductsRoot}${path.sep}`);
          if (!isInsideProductsDir) return;
          refreshFeed(logger).catch((error) => {
            const message = error instanceof Error ? error.message : String(error);
            logger?.error?.(`[product-feed] 監看更新失敗：${message}`);
          });
        };

        watcher.on('add', scheduleRefresh);
        watcher.on('change', scheduleRefresh);
        watcher.on('unlink', scheduleRefresh);
      },
      'astro:build:start': async ({ logger }) => {
        await refreshFeed(logger);
      },
      'astro:build:done': async ({ dir, logger }) => {
        const feed = await getFeed(logger);
        const outputPath = fileURLToPath(new URL('./data/product.json', dir));
        await writeFeedFile(outputPath, feed, logger);
      }
    }
  };
};

export default defineConfig({
  srcDir: './src',
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    productFeedIntegration()
  ],
  experimental: {
    clientPrerender: true
  }
});
