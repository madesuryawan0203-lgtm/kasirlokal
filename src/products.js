// src/products.js — data contoh, kategori, dan fungsi murni (format, validasi, filter, ringkasan, keranjang, struk)

export const CATEGORIES = ['Makanan', 'Minuman', 'Camilan'];
export const CATEGORY_FILTERS = ['Semua', 'Makanan', 'Minuman', 'Camilan'];

export const SEED_PRODUCTS = [
  { id: 'p-kopi-susu', nama: 'Kopi Susu Gula Aren', kategori: 'Minuman', harga: 18000, stok: 24, deskripsi: 'Kopi robusta, susu segar, gula aren cair.', imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&auto=format&fit=crop&q=60', unggulan: true },
  { id: 'p-es-teh', nama: 'Es Teh Manis', kategori: 'Minuman', harga: 5000, stok: 40, deskripsi: 'Teh manis dingin yang menyegarkan.', imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=400&auto=format&fit=crop&q=60', unggulan: false },
  { id: 'p-nasgor', nama: 'Nasi Goreng Kampung', kategori: 'Makanan', harga: 20000, stok: 15, deskripsi: 'Nasi goreng bumbu kampung dengan telur.', imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop&q=60', unggulan: true },
  { id: 'p-ayam-geprek', nama: 'Ayam Geprek Sambal Bawang', kategori: 'Makanan', harga: 22000, stok: 12, deskripsi: 'Ayam geprek crispy dengan sambal bawang.', imageUrl: 'https://images.unsplash.com/photo-1727961315041-8e384dde2a63?q=80&w=961&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D', unggulan: true },
  { id: 'p-mie-goreng', nama: 'Mie Goreng Jawa', kategori: 'Makanan', harga: 18000, stok: 10, deskripsi: 'Mie goreng bumbu Jawa dengan sayuran.', imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&auto=format&fit=crop&q=60', unggulan: false },
  { id: 'p-pisang-goreng', nama: 'Pisang Goreng Keju (4 pcs)', kategori: 'Camilan', harga: 12000, stok: 0, deskripsi: 'Pisang goreng renyah dengan taburan keju.', imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400&auto=format&fit=crop&q=60', unggulan: false },
  { id: 'p-tahu-crispy', nama: 'Tahu Crispy Bumbu Tabur', kategori: 'Camilan', harga: 10000, stok: 18, deskripsi: 'Tahu goreng crispy dengan bumbu tabur.', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=60', unggulan: false },
  { id: 'p-air-mineral', nama: 'Air Mineral Botol', kategori: 'Minuman', harga: 4000, stok: 50, deskripsi: 'Air mineral botol 600 ml.', imageUrl: 'https://images.unsplash.com/photo-1608885898957-a599fb15ec36?w=400&auto=format&fit=crop&q=60', unggulan: false },
];

export function formatRupiah(n) {
  const num = Math.round(Number(n) || 0);
  return 'Rp' + num.toLocaleString('id-ID');
}

export function slugifyName(name) {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function generateId(nama, existingIds) {
  let base = 'p-' + (slugifyName(nama) || 'produk');
  if (base.length > 40) base = base.slice(0, 40);
  if (base.length < 3) base = 'p-' + base;
  const set = new Set(existingIds || []);
  if (!set.has(base)) return base;
  let i = 2;
  while (set.has(base + '-' + i)) i++;
  return base + '-' + i;
}

export function validateProduct(p, existingProducts, editingId) {
  const errors = {};
  const nama = String(p.nama || '').trim();
  if (!nama) errors.nama = 'Nama produk wajib diisi (1–60 karakter).';
  else if (nama.length > 60) errors.nama = 'Nama produk wajib diisi (1–60 karakter).';

  // duplicate name check (case-insensitive)
  const dup = (existingProducts || []).find((x) => x.id !== editingId && String(x.nama || '').trim().toLowerCase() === nama.toLowerCase());
  if (nama && dup) errors.nama = 'Nama produk sudah dipakai.';

  if (!CATEGORIES.includes(p.kategori)) errors.kategori = 'Kategori wajib dipilih.';
  const harga = p.harga;
  if (typeof harga !== 'number' || !Number.isInteger(harga) || harga < 0 || harga > 10000000) errors.harga = 'Harga harus angka bulat 0–10.000.000.';
  const stok = p.stok;
  if (typeof stok !== 'number' || !Number.isInteger(stok) || stok < 0 || stok > 9999) errors.stok = 'Stok harus angka bulat 0–9999.';
  const desk = p.deskripsi == null ? '' : String(p.deskripsi);
  if (desk.length > 160) errors.deskripsi = 'Deskripsi maksimal 160 karakter.';
  const img = p.imageUrl == null ? '' : String(p.imageUrl).trim();
  if (img && !(img.startsWith('/img/produk/') || /^https?:\/\//i.test(img))) errors.imageUrl = 'Gunakan path lokal /img/produk/ atau URL gambar (https).';
  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}

export function filterProducts(products, query, category, sort) {
  const q = String(query || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const words = q ? q.split(' ') : [];
  let list = (products || []).slice();
  if (category && category !== 'Semua') {
    list = list.filter((p) => p.kategori === category);
  }
  if (words.length) {
    list = list.filter((p) => {
      const hay = (String(p.nama || '') + ' ' + String(p.deskripsi || '')).toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }
  const byName = (a, b) => String(a.nama).localeCompare(String(b.nama), 'id');
  switch (sort) {
    case 'nama':
      list.sort(byName);
      break;
    case 'harga-asc':
      list.sort((a, b) => a.harga - b.harga || byName(a, b));
      break;
    case 'harga-desc':
      list.sort((a, b) => b.harga - a.harga || byName(a, b));
      break;
    case 'unggulan':
    default:
      list.sort((a, b) => {
        const ua = a.unggulan ? 1 : 0;
        const ub = b.unggulan ? 1 : 0;
        if (ub !== ua) return ub - ua;
        return byName(a, b);
      });
      break;
  }
  return list;
}

export function computeSummary(products) {
  const arr = products || [];
  return {
    totalProduk: arr.length,
    totalStok: arr.reduce((s, p) => s + (Number(p.stok) || 0), 0),
    produkHabis: arr.filter((p) => (Number(p.stok) || 0) === 0).length,
    nilaiStok: arr.reduce((s, p) => s + (Number(p.harga) || 0) * (Number(p.stok) || 0), 0),
  };
}

// Keranjang helpers (pure)
export function cartAdd(cart, productId, products) {
  const p = (products || []).find((x) => x.id === productId);
  if (!p || p.stok <= 0) return cart;
  const existing = cart.find((c) => c.productId === productId);
  if (existing) {
    if (existing.qty >= p.stok) return cart;
    return cart.map((c) => (c.productId === productId ? { ...c, qty: c.qty + 1 } : c));
  }
  return [...cart, { productId, qty: 1 }];
}

export function cartSetQty(cart, productId, qty, products) {
  const p = (products || []).find((x) => x.id === productId);
  const max = p ? p.stok : 0;
  let q = Number(qty);
  if (!Number.isFinite(q)) q = 1;
  q = Math.floor(q);
  if (q <= 0) return cart.filter((c) => c.productId !== productId);
  if (q > max) q = max;
  return cart.map((c) => (c.productId === productId ? { ...c, qty: q } : c));
}

export function cartRemove(cart, productId) {
  return cart.filter((c) => c.productId !== productId);
}

export function cartTotal(cart, products) {
  return (cart || []).reduce((s, c) => {
    const p = (products || []).find((x) => x.id === c.productId);
    return s + (p ? p.harga * c.qty : 0);
  }, 0);
}

export function cartItemCount(cart) {
  return (cart || []).reduce((s, c) => s + c.qty, 0);
}

export function validateCartStock(cart, products) {
  // returns { ok, adjustedCart, warnings[] }
  const warnings = [];
  let adjusted = (cart || []).map((c) => ({ ...c }));
  let ok = true;
  for (const c of adjusted) {
    const p = (products || []).find((x) => x.id === c.productId);
    if (!p) { c._remove = true; warnings.push('Produk tidak tersedia lagi.'); continue; }
    if (p.stok === 0) { c._remove = true; warnings.push(p.nama + ' habis dan dikeluarkan dari keranjang.'); continue; }
    if (c.qty > p.stok) { c.qty = p.stok; warnings.push('Qty ' + p.nama + ' disesuaikan ke stok ' + p.stok + '.'); }
  }
  adjusted = adjusted.filter((c) => !c._remove);
  return { adjusted, warnings };
}

export function buildReceipt(cart, products, storeName) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const lines = [];
  lines.push((storeName || 'KasirLokal'));
  lines.push(dateStr + ' ' + timeStr);
  lines.push('--------------------------------');
  let total = 0;
  for (const c of cart || []) {
    const p = (products || []).find((x) => x.id === c.productId);
    if (!p) continue;
    const sub = p.harga * c.qty;
    total += sub;
    lines.push(p.nama);
    lines.push('  ' + c.qty + ' × ' + formatRupiah(p.harga) + '        ' + formatRupiah(sub));
  }
  lines.push('--------------------------------');
  lines.push('Total                 ' + formatRupiah(total));
  lines.push('Terima kasih sudah memesan!');
  return { text: lines.join('\n'), total };
}

export function buildWaUrl(text) {
  return 'https://wa.me/?text=' + encodeURIComponent(text);
}

export function parseStorage(raw) {
  // returns { ok, data, reason }
  if (raw == null) return { ok: true, data: null, reason: 'empty' };
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return { ok: false, data: null, reason: 'parse' };
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { ok: false, data: null, reason: 'shape' };
  if (parsed.version !== 1) return { ok: false, data: null, reason: 'version' };
  if (!Array.isArray(parsed.products)) return { ok: false, data: null, reason: 'products' };
  // validate each product minimally
  const products = [];
  for (const p of parsed.products) {
    if (!p || typeof p !== 'object') return { ok: false, data: null, reason: 'product' };
    if (typeof p.id !== 'string' || !p.id) return { ok: false, data: null, reason: 'product' };
    if (typeof p.nama !== 'string') return { ok: false, data: null, reason: 'product' };
    if (!CATEGORIES.includes(p.kategori)) return { ok: false, data: null, reason: 'product' };
    if (typeof p.harga !== 'number' || !Number.isInteger(p.harga)) return { ok: false, data: null, reason: 'product' };
    if (typeof p.stok !== 'number' || !Number.isInteger(p.stok)) return { ok: false, data: null, reason: 'product' };
    if (typeof p.unggulan !== 'boolean') return { ok: false, data: null, reason: 'product' };
    products.push({
      id: p.id,
      nama: p.nama,
      kategori: p.kategori,
      harga: p.harga,
      stok: p.stok,
      deskripsi: typeof p.deskripsi === 'string' ? p.deskripsi : '',
      imageUrl: typeof p.imageUrl === 'string' ? p.imageUrl : '',
      unggulan: p.unggulan,
    });
  }
  return { ok: true, data: { version: 1, updatedAt: parsed.updatedAt || new Date().toISOString(), products }, reason: null };
}

export function makeEnvelope(products) {
  return { version: 1, updatedAt: new Date().toISOString(), products: products.map((p) => ({ ...p })) };
}
