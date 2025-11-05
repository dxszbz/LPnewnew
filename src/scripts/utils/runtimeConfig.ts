import type { RuntimeConfig } from '../types';

export const getRuntimeConfig = (): RuntimeConfig | null => {
  const host = document.getElementById('landing-runtime') as HTMLScriptElement | null;
  if (!host?.textContent) return null;
  try {
    return JSON.parse(host.textContent) as RuntimeConfig;
  } catch (error) {
    console.error('無法解析 runtime JSON。', error);
    return null;
  }
};
