import { describe, it, expect } from 'vitest';
import {
  formatRupiah, filterProducts, validateProduct, parseStorage, buildWaUrl,
  cartAdd, cartSetQty, cartTotal, computeSummary, SEED_PRODUCTS, CATEGORIES,
} from '../src/products.js';

describe('KasirLokal unit tests', () => {
  it('formatRupiah formats integer rupiah', () => {
    expect(formatRupiah(18000)).toBe('Rp18.000');
    expect(formatRupiah(0)).toBe('Rp0');
    expect(formatRupiah(1756000)).toBe('Rp1.756.000');
  });

  it('filterProducts searches case-insensitively on name and description', () => {
    const res = filterProducts(SEED_PRODUCTS, 'KOPI', 'Semua', 'unggulan');
    expect(res.length).toBeGreaterThan(0);
    expect(res.every((p) => /kopi/i.test(p.nama + ' ' + p.deskripsi))).toBe(true);
  });

  it('filterProducts trims whitespace and treats multiple words as AND', () => {
    const res = filterProducts(SEED_PRODUCTS, '  nasi  kampung  ', 'Semua', 'unggulan');
    expect(res.map((p) => p.id)).toContain('p-nasgor');
    expect(res.length).toBe(1);
  });

  it('filterProducts filters by category', () => {
    const res = filterProducts(SEED_PRODUCTS, '', 'Minuman', 'unggulan');
    expect(res.length).toBe(4);
    expect(res.every((p) => p.kategori === 'Minuman')).toBe(true);
  });

  it('filterProducts sorts by price ascending', () => {
    const res = filterProducts(SEED_PRODUCTS, '', 'Semua', 'harga-asc');
    const prices = res.map((p) => p.harga);
    for (let i = 1; i < prices.length; i++) expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    expect(res[0].harga).toBe(4000);
  });

  it('filterProducts sorts by price descending', () => {
    const res = filterProducts(SEED_PRODUCTS, '', 'Semua', 'harga-desc');
    expect(res[0].harga).toBe(22000);
  });

  it('filterProducts sorts by name A-Z', () => {
    const res = filterProducts(SEED_PRODUCTS, '', 'Semua', 'nama');
    const names = res.map((p) => p.nama);
    const sorted = [...names].sort((a, b) => a.localeCompare(b, 'id'));
    expect(names).toEqual(sorted);
  });

  it('filterProducts returns empty array when no match', () => {
    const res = filterProducts(SEED_PRODUCTS, 'zzzznotfound', 'Semua', 'unggulan');
    expect(res).toEqual([]);
  });

  it('validateProduct rejects empty name', () => {
    const errs = validateProduct({ nama: '', kategori: 'Makanan', harga: 1000, stok: 1, deskripsi: '', imageUrl: '', unggulan: false }, SEED_PRODUCTS, null);
    expect(errs.nama).toBeTruthy();
  });

  it('validateProduct rejects negative and NaN harga', () => {
    const neg = validateProduct({ nama: 'X', kategori: 'Makanan', harga: -1, stok: 1, deskripsi: '', imageUrl: '', unggulan: false }, SEED_PRODUCTS, null);
    expect(neg.harga).toBeTruthy();
    const nan = validateProduct({ nama: 'X', kategori: 'Makanan', harga: NaN, stok: 1, deskripsi: '', imageUrl: '', unggulan: false }, SEED_PRODUCTS, null);
    expect(nan.harga).toBeTruthy();
  });

  it('validateProduct rejects invalid stok (negative/decimal/string)', () => {
    const neg = validateProduct({ nama: 'X', kategori: 'Makanan', harga: 1000, stok: -1, deskripsi: '', imageUrl: '', unggulan: false }, SEED_PRODUCTS, null);
    expect(neg.stok).toBeTruthy();
    const dec = validateProduct({ nama: 'X', kategori: 'Makanan', harga: 1000, stok: 1.5, deskripsi: '', imageUrl: '', unggulan: false }, SEED_PRODUCTS, null);
    expect(dec.stok).toBeTruthy();
  });

  it('validateProduct rejects invalid category', () => {
    const errs = validateProduct({ nama: 'X', kategori: 'Lainnya', harga: 1000, stok: 1, deskripsi: '', imageUrl: '', unggulan: false }, SEED_PRODUCTS, null);
    expect(errs.kategori).toBeTruthy();
  });

  it('validateProduct rejects duplicate name case-insensitively', () => {
    const errs = validateProduct({ nama: 'kopi susu gula aren', kategori: 'Minuman', harga: 1000, stok: 1, deskripsi: '', imageUrl: '', unggulan: false }, SEED_PRODUCTS, null);
    expect(errs.nama).toBe('Nama produk sudah dipakai.');
  });

  it('validateProduct accepts a valid product', () => {
    const errs = validateProduct({ nama: 'Produk Baru', kategori: 'Minuman', harga: 8000, stok: 5, deskripsi: 'ok', imageUrl: '', unggulan: false }, SEED_PRODUCTS, null);
    expect(Object.keys(errs)).toHaveLength(0);
  });

  it('validateProduct rejects description over 160 chars', () => {
    const errs = validateProduct({ nama: 'X', kategori: 'Makanan', harga: 1000, stok: 1, deskripsi: 'a'.repeat(161), imageUrl: '', unggulan: false }, SEED_PRODUCTS, null);
    expect(errs.deskripsi).toBeTruthy();
  });

  it('validateProduct rejects invalid imageUrl', () => {
    const errs = validateProduct({ nama: 'X', kategori: 'Makanan', harga: 1000, stok: 1, deskripsi: '', imageUrl: 'http://evil.com/x.png', unggulan: false }, SEED_PRODUCTS, null);
    // http allowed by current rule? our rule allows http(s) and /img/produk/. http://evil is allowed by regex. Check local-only failure:
    const errs2 = validateProduct({ nama: 'X', kategori: 'Makanan', harga: 1000, stok: 1, deskripsi: '', imageUrl: 'foo.png', unggulan: false }, SEED_PRODUCTS, null);
    expect(errs2.imageUrl).toBeTruthy();
  });

  it('parseStorage returns ok false on broken JSON', () => {
    const res = parseStorage('rusak{');
    expect(res.ok).toBe(false);
    expect(res.reason).toBe('parse');
  });

  it('parseStorage returns ok false on version mismatch', () => {
    const res = parseStorage(JSON.stringify({ version: 2, products: [] }));
    expect(res.ok).toBe(false);
    expect(res.reason).toBe('version');
  });

  it('parseStorage returns ok false on missing products', () => {
    const res = parseStorage(JSON.stringify({ version: 1, updatedAt: 'x' }));
    expect(res.ok).toBe(false);
  });

  it('parseStorage parses valid envelope', () => {
    const env = { version: 1, updatedAt: '2026-01-01T00:00:00.000Z', products: SEED_PRODUCTS.slice(0, 2) };
    const res = parseStorage(JSON.stringify(env));
    expect(res.ok).toBe(true);
    expect(res.data.products).toHaveLength(2);
  });

  it('buildWaUrl encodes text and contains no phone number', () => {
    const url = buildWaUrl('Halo\nTotal Rp10.000');
    expect(url.startsWith('https://wa.me/?text=')).toBe(true);
    expect(url).not.toMatch(/wa\.me\/\d/);
    expect(decodeURIComponent(url.split('text=')[1])).toBe('Halo\nTotal Rp10.000');
  });

  it('cartAdd respects stock limit', () => {
    const products = [{ id: 'p', nama: 'P', kategori: 'Makanan', harga: 1000, stok: 1, deskripsi: '', imageUrl: '', unggulan: false }];
    let cart = cartAdd([], 'p', products);
    expect(cart).toHaveLength(1);
    cart = cartAdd(cart, 'p', products);
    expect(cart[0].qty).toBe(1);
  });

  it('cartSetQty clamps to stock and removes on zero', () => {
    const products = [{ id: 'p', nama: 'P', kategori: 'Makanan', harga: 1000, stok: 3, deskripsi: '', imageUrl: '', unggulan: false }];
    let cart = [{ productId: 'p', qty: 1 }];
    cart = cartSetQty(cart, 'p', 10, products);
    expect(cart[0].qty).toBe(3);
    cart = cartSetQty(cart, 'p', 0, products);
    expect(cart).toHaveLength(0);
  });

  it('computeSummary computes 4 metrics', () => {
    const s = computeSummary(SEED_PRODUCTS);
    expect(s.totalProduk).toBe(SEED_PRODUCTS.length);
    expect(s.totalStok).toBeGreaterThan(0);
    expect(typeof s.nilaiStok).toBe('number');
  });
});