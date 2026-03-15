const WP_API = 'https://admin.look-t.com.tw/wp-json/wp/v2';

// ── 產品型錄 ──
export async function fetchProducts(perPage = 12) {
  const res = await fetch(`${WP_API}/product?per_page=${perPage}&orderby=date&order=desc&_embed`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProductBySlug(slug: string) {
  const res = await fetch(`${WP_API}/product?slug=${slug}&_embed`);
  if (!res.ok) throw new Error('Failed to fetch product');
  const data = await res.json();
  return data[0] ?? null;
}

// ── 維修日誌 ──
export async function fetchRepairLogs(perPage = 12) {
  const res = await fetch(`${WP_API}/repair_log?per_page=${perPage}&orderby=date&order=desc&_embed`);
  if (!res.ok) throw new Error('Failed to fetch repair logs');
  return res.json();
}

export async function fetchRepairLogBySlug(slug: string) {
  const res = await fetch(`${WP_API}/repair_log?slug=${slug}&_embed`);
  if (!res.ok) throw new Error('Failed to fetch repair log');
  const data = await res.json();
  return data[0] ?? null;
}

// ── FAQ ──
export async function fetchFAQs(perPage = 100) {
  const res = await fetch(`${WP_API}/faq?per_page=${perPage}&orderby=date&order=asc&_embed`);
  if (!res.ok) throw new Error('Failed to fetch FAQs');
  return res.json();
}
// ── 一般文章（部落格）──
export async function fetchPosts(perPage = 12) {
  const res = await fetch(`${WP_API}/posts?per_page=${perPage}&orderby=date&order=desc&_embed`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function fetchPostBySlug(slug: string) {
  const res = await fetch(`${WP_API}/posts?slug=${slug}&_embed`);
  if (!res.ok) throw new Error('Failed to fetch post');
  const data = await res.json();
  return data[0] ?? null;
}