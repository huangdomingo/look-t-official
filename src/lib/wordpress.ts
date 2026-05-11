const WP_API = 'https://admin.look-t.com.tw/wp-json/wp/v2';
const MAX_PER_PAGE = 100;

type QueryValue = string | number | boolean;

async function fetchWpItems<T>(
  endpoint: string,
  query: Record<string, QueryValue> = {},
): Promise<T[]> {
  const url = new URL(`${WP_API}/${endpoint}`);
  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, String(value));
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

async function fetchAllWpItems<T>(
  endpoint: string,
  baseQuery: Record<string, QueryValue> = {},
): Promise<T[]> {
  const firstPage = await fetchWpItems<T>(endpoint, {
    per_page: MAX_PER_PAGE,
    page: 1,
    ...baseQuery,
  });

  const firstPageUrl = new URL(`${WP_API}/${endpoint}`);
  for (const [key, value] of Object.entries({
    per_page: MAX_PER_PAGE,
    page: 1,
    ...baseQuery,
  })) {
    firstPageUrl.searchParams.set(key, String(value));
  }

  const firstRes = await fetch(firstPageUrl.toString());
  if (!firstRes.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${firstRes.status} ${firstRes.statusText}`);
  }

  const totalPages = Number(firstRes.headers.get('X-WP-TotalPages') ?? '1');
  const items = await firstRes.json() as T[];

  if (totalPages <= 1) {
    return items;
  }

  for (let page = 2; page <= totalPages; page += 1) {
    const pageItems = await fetchWpItems<T>(endpoint, {
      per_page: MAX_PER_PAGE,
      page,
      ...baseQuery,
    });
    items.push(...pageItems);
  }

  return items;
}

// ── 產品型錄 ──
export async function fetchProducts(perPage = 12) {
  return fetchWpItems('product', { per_page: perPage, orderby: 'date', order: 'desc', _embed: true });
}

export async function fetchAllProducts() {
  return fetchAllWpItems('product', { orderby: 'date', order: 'desc', _embed: true });
}

export async function fetchProductBySlug(slug: string) {
  const data = await fetchWpItems('product', { slug, _embed: true });
  return data[0] ?? null;
}

// ── 維修日誌 ──
export async function fetchRepairLogs(perPage = 12) {
  return fetchWpItems('repair_log', { per_page: perPage, orderby: 'date', order: 'desc', _embed: true });
}

export async function fetchAllRepairLogs() {
  return fetchAllWpItems('repair_log', { orderby: 'date', order: 'desc', _embed: true });
}

export async function fetchRepairLogBySlug(slug: string) {
  const data = await fetchWpItems('repair_log', { slug, _embed: true });
  return data[0] ?? null;
}

// ── FAQ ──
export async function fetchFAQs(perPage = 100) {
  return fetchWpItems('faq', { per_page: perPage, orderby: 'date', order: 'asc', _embed: true });
}

// ── 一般文章（部落格）──
export async function fetchPosts(perPage = 12) {
  return fetchWpItems('posts', { per_page: perPage, orderby: 'date', order: 'desc', _embed: true });
}

export async function fetchAllPosts() {
  return fetchAllWpItems('posts', { orderby: 'date', order: 'desc', _embed: true });
}

export async function fetchPostBySlug(slug: string) {
  const data = await fetchWpItems('posts', { slug, _embed: true });
  return data[0] ?? null;
}
