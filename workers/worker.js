const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

const jsonResponse = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });

const handlePreflight = (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  return null;
};

const normalizeQuantity = (value) => {
  const parsed = Number.parseInt(value ?? '1', 10);
  if (Number.isNaN(parsed) || parsed < 1) return 1;
  return Math.min(parsed, 99);
};

const buildUrl = (domain, path) => {
  try {
    const base = new URL(domain);
    return new URL(path, base.origin).toString();
  } catch {
    const sanitized = domain.replace(/\/+$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${sanitized}${normalizedPath}`;
  }
};

const handleShopyy = async (input) => {
  const { domain, productId, skuCode } = input;
  if (!domain || !productId || !skuCode) {
    throw new Error('Missing shopyy parameters: domain/productId/skuCode');
  }

  const quantity = normalizeQuantity(input.quantity);
  const dataFrom = input.dataFrom || 'external_lander';
  const target = buildUrl(domain, '/homeapi/cart/buynow');

  const response = await fetch(target, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_id: productId,
      sku_code: skuCode,
      quantity,
      data_from: dataFrom
    })
  });

  if (!response.ok) {
    throw new Error(`Shopyy API failed with status ${response.status}`);
  }

  const payload = await response.json();
  const apiCode = payload?.data?.code ?? payload?.code ?? 0;
  const apiMsg = payload?.data?.msg ?? payload?.msg;
  const checkoutPath = payload?.data?.checkout_url ?? payload?.checkout_url;

  if (apiCode !== 0 || !checkoutPath) {
    return {
      errorCode: apiCode || -1,
      errorMsg: apiMsg || 'Shopyy checkout error'
    };
  }

  return { checkoutUrl: buildUrl(domain, checkoutPath) };
};

const handlers = {
  shopyy: handleShopyy
};

export default {
  async fetch(request) {
    const preflight = handlePreflight(request);
    if (preflight) return preflight;

    const url = new URL(request.url);
    if (url.pathname !== '/checkout') {
      return jsonResponse({ code: 404, msg: 'Not Found' }, 404);
    }

    if (request.method !== 'POST') {
      return jsonResponse({ code: 405, msg: 'Method Not Allowed' }, 405);
    }

    try {
      const body = await request.json();
      const provider = body?.provider;
      const handler = handlers[provider];

      if (!handler) {
        return jsonResponse({ code: 400, msg: 'Unsupported provider' }, 400);
      }

      const result = await handler(body);
      if (result?.errorCode) {
        return jsonResponse({ code: result.errorCode, msg: result.errorMsg }, 400);
      }
      return jsonResponse({ code: 0, msg: 'ok', data: result });
    } catch (error) {
      console.error('Checkout worker error', error);
      return jsonResponse({ code: 500, msg: error?.message || 'Internal Error' }, 500);
    }
  }
};
