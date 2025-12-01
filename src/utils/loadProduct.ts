import { siteConfig } from '../config';
import type { ComponentPreset, LoadedProduct, ProductData, ProductInfo } from './types';

const dataModules = import.meta.glob('../data/products/*/product_data.json', {
  import: 'default',
  eager: true
}) as Record<string, ProductData>;

const infoModules = import.meta.glob('../data/products/*/product_info.json', {
  import: 'default',
  eager: true
}) as Record<string, ProductInfo>;

// 允許 product_info.<locale>.json 變體
const localizedInfoModules = import.meta.glob('../data/products/*/product_info.*.json', {
  import: 'default',
  eager: true
}) as Record<string, ProductInfo>;

const presetModules = import.meta.glob('../data/products/*/component-presets.json', {
  import: 'default',
  eager: true
}) as Record<string, ComponentPreset>;

const normalizeId = (modulePath: string): string => {
  const segments = modulePath.split('/products/')[1]?.split('/') ?? [];
  return segments[0] ?? '';
};

const allInfoModules: Record<string, ProductInfo> = {
  ...infoModules,
  ...localizedInfoModules
};

const defaultLocale = (siteConfig.locales?.default ?? 'en').toLowerCase();
const supportedLocales = (siteConfig.locales?.supported ?? []).map((l) => l.toLowerCase());

const toBaseLang = (locale: string) => locale.toLowerCase().split('-')[0] || defaultLocale;

const extractLocaleFromPath = (modulePath: string): string => {
  const filename = modulePath.split('/').pop() ?? '';
  const match = filename.match(/product_info(?:\.([a-zA-Z-]+))?\.json$/);
  const locale = match?.[1] ?? defaultLocale;
  return toBaseLang(locale);
};

const productCache = new Map<string, LoadedProduct>();

const availableIds = Object.keys(dataModules)
  .map(normalizeId)
  .filter((id) => id.length > 0);

const listLocalesForProduct = (productId: string): string[] => {
  const locales = Object.keys(allInfoModules)
    .filter((key) => normalizeId(key) === productId)
    .map(extractLocaleFromPath);

  const unique = Array.from(new Set(locales));
  if (!unique.length) {
    return [defaultLocale];
  }

  if (!supportedLocales.length) {
    return unique;
  }

  const filtered = unique.filter((locale) => supportedLocales.includes(locale));
  return filtered.length ? filtered : unique;
};

const pickBestLocale = (requested: string | undefined, available: string[]): string => {
  const normalizedAvailable = available.map(toBaseLang);
  const requestedBase = requested ? toBaseLang(requested) : '';

  if (requestedBase) {
    const idx = normalizedAvailable.findIndex((l) => l === requestedBase);
    if (idx !== -1) return available[idx];
  }

  const defaultIdx = normalizedAvailable.findIndex((l) => l === defaultLocale);
  if (defaultIdx !== -1) return available[defaultIdx];

  return available[0];
};

const findInfoPath = (productId: string, locale: string): string | undefined => {
  const allPaths = Object.keys(allInfoModules).filter((key) => normalizeId(key) === productId);
  const targetLocale = toBaseLang(locale);

  const match = allPaths.find((path) => extractLocaleFromPath(path) === targetLocale);
  if (match) return match;

  return allPaths[0];
};

export const listAvailableProducts = (): string[] => [...new Set(availableIds)];

export const listProductLocales = (productId: string): string[] => listLocalesForProduct(productId);

export const listAllProductLocalePairs = (): Array<{ productId: string; locale: string }> => {
  return listAvailableProducts().flatMap((productId) =>
    listLocalesForProduct(productId).map((locale) => ({ productId, locale }))
  );
};

export const findDefaultProductId = (): string => {
  const configured = siteConfig.products?.defaultSku ?? '';
  if (configured && availableIds.includes(configured)) {
    return configured;
  }
  return availableIds[0] ?? '';
};

export const loadProduct = (productId?: string, locale?: string): LoadedProduct => {
  const targetId = productId && availableIds.includes(productId) ? productId : findDefaultProductId();
  if (!targetId) {
    throw new Error('找不到可用的產品資料，請確認資料夾結構是否正確。');
  }

  const availableLocales = listLocalesForProduct(targetId);
  const targetLocale = pickBestLocale(locale, availableLocales);
  const cacheKey = `${targetId}__${targetLocale}`;

  if (productCache.has(cacheKey)) {
    return productCache.get(cacheKey)!;
  }

  const dataPath = Object.keys(dataModules).find((key) => normalizeId(key) === targetId);
  const infoPath = findInfoPath(targetId, targetLocale);
  const presetPath = Object.keys(presetModules).find((key) => normalizeId(key) === targetId);

  if (!dataPath || !infoPath) {
    throw new Error(`產品 ${targetId} 的資料或文案檔案缺失。`);
  }

  const loaded: LoadedProduct = {
    data: dataModules[dataPath],
    info: allInfoModules[infoPath],
    components: presetPath ? presetModules[presetPath] : undefined,
    locale: targetLocale,
    availableLocales
  };

  productCache.set(cacheKey, loaded);
  return loaded;
};
