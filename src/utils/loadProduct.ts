import { siteConfig } from '../config';
import type { LoadedProduct, ProductData, ProductInfo } from './types';

const dataModules = import.meta.glob('../data/products/*/product_data.json', {
  import: 'default',
  eager: true
}) as Record<string, ProductData>;

const infoModules = import.meta.glob('../data/products/*/product_info.json', {
  import: 'default',
  eager: true
}) as Record<string, ProductInfo>;

const normalizeId = (modulePath: string): string => {
  const segments = modulePath.split('/products/')[1]?.split('/') ?? [];
  return segments[0] ?? '';
};

const productCache = new Map<string, LoadedProduct>();

const availableIds = Object.keys(dataModules)
  .map(normalizeId)
  .filter((id) => id.length > 0);

export const listAvailableProducts = (): string[] => [...new Set(availableIds)];

export const findDefaultProductId = (): string => {
  const configured = siteConfig.products?.defaultSku ?? '';
  if (configured && availableIds.includes(configured)) {
    return configured;
  }
  return availableIds[0] ?? '';
};

export const loadProduct = (productId?: string): LoadedProduct => {
  const targetId = productId && availableIds.includes(productId) ? productId : findDefaultProductId();
  if (!targetId) {
    throw new Error('找不到可用的產品資料，請確認資料夾結構是否正確。');
  }
  if (productCache.has(targetId)) {
    return productCache.get(targetId)!;
  }

  const dataPath = Object.keys(dataModules).find((key) => normalizeId(key) === targetId);
  const infoPath = Object.keys(infoModules).find((key) => normalizeId(key) === targetId);

  if (!dataPath || !infoPath) {
    throw new Error(`產品 ${targetId} 的資料或文案檔案缺失。`);
  }

  const loaded: LoadedProduct = {
    data: dataModules[dataPath],
    info: infoModules[infoPath]
  };

  productCache.set(targetId, loaded);
  return loaded;
};
