# KasirLokal

Katalog sekaligus kasir sederhana untuk UMKM makanan/minuman (Vite + JavaScript vanilla).

## Menjalankan

```bash
npm install
npm run dev
```

Build produksi:

```bash
npm run build
npm run preview
```

## Penyimpanan

Data produk disimpan di localStorage dengan kunci `kasirlokal.products.v1` dalam bentuk `{ version, updatedAt, products }`. Keranjang tidak disimpan (hilang saat refresh).

## Struktur

- `src/main.js` — bootstrap aplikasi
- `src/products.js` — data contoh, format, validasi, filter, ringkasan, keranjang, struk
- `src/store.js` — state dan penyimpanan localStorage
- `src/ui.js` — rendering dan penanganan event
- `src/style.css` — token desain dan gaya