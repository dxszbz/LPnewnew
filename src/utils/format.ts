export const formatCurrency = (value: number, currency: string): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);

export const encodeMetaPayload = (meta: unknown): string => {
  if (typeof meta === 'string') {
    return meta;
  }
  if (meta && typeof meta === 'object') {
    return JSON.stringify(meta);
  }
  return '';
};
