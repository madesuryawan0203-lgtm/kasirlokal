# SPEC — KasirLokal

**Versi:** 1.0 · **Tanggal:** 19 November 2026 · **Status:** Disetujui untuk latihan 1 hari
**Stack:** Vite + JavaScript vanilla (tanpa framework UI, tanpa backend)
**Dokumen terkait:** `CATATAN.md` (tujuan workshop, risiko, batasan)

---

## 1. Tujuan

KasirLokal adalah katalog sekaligus kasir sederhana untuk UMKM makanan/minuman yang berjalan sepenuhnya di browser. Dalam satu perangkat, kasir/pengelola toko dapat menampilkan produk, menerima pesanan, dan mengirim struk lewat WhatsApp; sementara calon pembeli dapat melihat katalog yang sama.

Tujuan yang terukur untuk latihan 1 hari:

1. Menghasilkan aplikasi web yang bisa didemokan tanpa backend dan tanpa login.
2. Menunjukkan alur inti: **lihat katalog → cari/filter → pesan → kirim struk WhatsApp**.
3. Menunjukkan CRUD produk dan ringkasan stok yang datanya bertahan setelah refresh (localStorage).
4. Menjadi bahan latihan *vibe coding* terstruktur: setiap iterasi punya keluaran dan kriteria selesai yang bisa diperiksa manual.

**Bukan tujuan:** membuat sistem kasir produksi, sistem akuntansi, atau aplikasi multi-pengguna.

---

## 2. Pengguna

| Pengguna | Kebutuhan utama | Konteks pemakaian |
|---|---|---|
| **Kasir / pengelola toko** | Menemukan produk cepat, melihat stok, mencatat pesanan, mengirim struk, mengelola katalog | Memegang perangkat di meja/konter, sering sambil melayani pembeli |
| **Calon pembeli** | Melihat daftar produk, harga, dan ketersediaan; menerima rincian pesanan | Melihat layar yang sama, kadang bergantian dengan kasir |

**Asumsi penting:**

- Satu perangkat, satu pengguna aktif pada satu waktu. Tidak ada sesi, tidak ada peran, **tidak ada login palsu**.
- Dashboard pengelola adalah **tab/halaman terbuka** yang bisa diakses siapa pun yang memegang perangkat. Ini keputusan sadar untuk demo, bukan celah yang perlu ditambal.
- Nomor WhatsApp pembeli **tidak disimpan**; tautan `wa.me` dibuka tanpa nomor tujuan sehingga pengguna memilih kontaknya sendiri di WhatsApp.
- Semua data produk adalah data contoh nonpribadi.

---

## 3. Daftar Fitur

Nomor fitur dipakai sebagai rujukan di acceptance criteria dan rencana implementasi.

### 3.1 Katalog (FR-01 – FR-05)

| ID | Fitur | Perilaku |
|---|---|---|
| FR-01 | Katalog 8 produk contoh | Grid kartu produk; setiap kartu memuat gambar, nama, kategori, harga Rupiah, stok, dan label "Unggulan" bila `unggulan = true`. |
| FR-02 | Foto/placeholder lokal | Gambar diambil dari folder aset lokal (`public/img/produk/`). Bila `imageUrl` kosong atau gagal dimuat, tampil placeholder lokal bergambar inisial/nama produk. Tidak ada permintaan gambar ke domain eksternal. |
| FR-03 | Harga Rupiah | Harga ditampilkan dengan format Indonesia tanpa desimal, contoh `Rp18.000`. Nilai disimpan sebagai angka bulat. |
| FR-04 | Status stok | Stok > 0 tampil sebagai "Stok: N". Stok 0 tampil sebagai label "Habis" dan tombol pesan nonaktif. |
| FR-05 | Ringkasan katalog | Menampilkan jumlah hasil yang sedang tampil, contoh "8 produk". |

### 3.2 Pencarian, Filter, Sorting (FR-06 – FR-10)

| ID | Fitur | Perilaku |
|---|---|---|
| FR-06 | Pencarian | Mencari pada **nama** dan **deskripsi**, tidak peka huruf besar/kecil, spasi berlebih dirapikan; beberapa kata dianggap AND (semua kata harus cocok). Minimal 1 karakter. |
| FR-07 | Filter kategori | Pilihan: Semua, Makanan, Minuman, Camilan. Hanya satu kategori aktif pada satu waktu. |
| FR-08 | Sorting | Pilihan: **Unggulan dulu** (default), Nama A–Z, Harga terendah, Harga tertinggi. Urutan unggulan di dalam "Unggulan dulu" memakai Nama A–Z sebagai pemecah seri. |
| FR-09 | Kombinasi | Pencarian, filter, dan sorting berlaku bersamaan; hasil selalu dihitung ulang dari data terkini. |
| FR-10 | Kondisi kosong | Bila tidak ada hasil: tampil pesan "Produk tidak ditemukan", kata kunci yang dicari, dan tombol "Reset pencarian" yang mengosongkan pencarian + filter + sorting ke default. |

### 3.3 Keranjang & Struk WhatsApp (FR-11 – FR-14)

| ID | Fitur | Perilaku |
|---|---|---|
| FR-11 | Keranjang minimal | Tombol "Pesan" pada kartu menambah 1 item; stepper `− / qty / +` mengubah jumlah; qty tidak boleh melebihi stok dan tidak boleh 0 (tombol "Hapus" tersedia). Keranjang tampil sebagai panel/ringkasan dengan subtotal per item dan total. |
| FR-12 | Validasi pesanan | Tombol "Buat struk" nonaktif bila keranjang kosong. Bila stok produk berubah (mis. diedit di dashboard) hingga lebih kecil dari qty, tampil peringatan dan qty disesuaikan ke batas stok. |
| FR-13 | Struk WhatsApp | Menekan "Buat struk" menampilkan pratinjau struk berisi nama toko, tanggal/jam, daftar item (nama × qty = subtotal), total, dan ucapan terima kasih. Tombol "Kirim via WhatsApp" membuka `https://wa.me/?text=<teks ter-encode>` di tab baru. Tidak ada nomor telepon yang disimpan atau di-hardcode. |
| FR-14 | Pengurangan stok | Stok dikurangi sesuai qty **saat struk dibuat** (sekali per struk), lalu disimpan ke localStorage. Bila stok tidak cukup, struk tidak dibuat. Tidak ada pembatalan otomatis; koreksi dilakukan lewat dashboard. |

### 3.4 Dashboard Demo (FR-15 – FR-19)

| ID | Fitur | Perilaku |
|---|---|---|
| FR-15 | Akses dashboard | Tab "Dashboard" tanpa autentikasi. Menampilkan tabel produk dan tombol "Tambah produk". |
| FR-16 | Ringkasan | Empat kartu: total produk (jumlah), total stok (jumlah semua stok), produk habis (jumlah stok = 0), nilai stok (`Σ harga × stok`, format Rupiah). |
| FR-17 | Tambah & edit | Form dengan field sesuai model data. Setelah simpan, katalog dan ringkasan langsung diperbarui. |
| FR-18 | Validasi form | Pesan galat per field, simpan diblokir selama ada galat. Aturan di bagian 4. |
| FR-19 | Hapus & reset | Hapus produk memerlukan konfirmasi; produk yang sedang ada di keranjang ikut dikeluarkan dengan pemberitahuan. Tombol "Reset data contoh" mengembalikan 8 produk awal setelah konfirmasi. |

### 3.5 Penyimpanan (FR-20 – FR-21)

| ID | Fitur | Perilaku |
|---|---|---|
| FR-20 | localStorage | Produk disimpan di kunci `kasirlokal.products.v1` dalam bentuk `{ version, updatedAt, products }`. Saat pertama dibuka, data contoh ditulis otomatis. |
| FR-21 | Ketahanan data | JSON rusak/versi tak dikenal → kembali ke data contoh + banner peringatan, aplikasi tidak blank. Kuota penuh → perubahan terakhir dibatalkan dengan pesan galat. Keranjang tidak disimpan (hilang saat refresh) dan itu dinyatakan di UI. |

---

## 4. Data Model

### 4.1 Entitas Produk

| Field | Tipe | Aturan validasi | Contoh |
|---|---|---|---|
| `id` | string | unik, 3–40 karakter, huruf kecil/angka/tanda hubung; dibuat otomatis dari nama + sufiks bila bentrok | `p-kopi-susu` |
| `nama` | string | wajib, 1–60 karakter setelah trim, unik (tidak peka huruf besar/kecil) | `Kopi Susu Gula Aren` |
| `kategori` | string (enum) | wajib, salah satu: `Makanan`, `Minuman`, `Camilan` | `Minuman` |
| `harga` | number | wajib, bilangan bulat, `0 ≤ harga ≤ 10.000.000` | `18000` |
| `stok` | number | wajib, bilangan bulat, `0 ≤ stok ≤ 9.999` | `24` |
| `deskripsi` | string | opsional, maksimal 160 karakter | `Kopi robusta, susu segar, gula aren cair.` |
| `imageUrl` | string | opsional; path lokal diawali `/img/produk/`; kosong → placeholder | `/img/produk/kopi-susu.svg` |
| `unggulan` | boolean | wajib, default `false` | `true` |

Aturan tambahan: `harga` dan `stok` disimpan sebagai angka (bukan string berformat); format Rupiah hanya untuk tampilan; semua teks dari pengguna di-escape saat dirender.

### 4.2 Bentuk Penyimpanan (ilustrasi data, bukan kode aplikasi)

```
{
  "version": 1,
  "updatedAt": "2026-11-19T08:00:00.000Z",
  "products": [ { ...produk... }, ... ]
}
```

Keranjang berada di memori (tidak dipersist) dengan bentuk: `{ productId, qty }[]`. Struk tidak disimpan sebagai riwayat.

### 4.3 Data Contoh (8 produk, nonpribadi)

| id | nama | kategori | harga | stok | unggulan |
|---|---|---|---|---|---|
| `p-kopi-susu` | Kopi Susu Gula Aren | Minuman | 18000 | 24 | ya |
| `p-es-teh` | Es Teh Manis | Minuman | 5000 | 40 | tidak |
| `p-nasgor` | Nasi Goreng Kampung | Makanan | 20000 | 15 | ya |
| `p-ayam-geprek` | Ayam Geprek Sambal Bawang | Makanan | 22000 | 12 | ya |
| `p-mie-goreng` | Mie Goreng Jawa | Makanan | 18000 | 10 | tidak |
| `p-pisang-goreng` | Pisang Goreng Keju (4 pcs) | Camilan | 12000 | 0 | tidak |
| `p-tahu-crispy` | Tahu Crispy Bumbu Tabur | Camilan | 10000 | 18 | tidak |
| `p-air-mineral` | Air Mineral Botol | Minuman | 4000 | 50 | tidak |

Komposisi ini sengaja mencakup: tiga kategori, satu produk stok 0 (uji label "Habis"), tiga produk unggulan (uji sorting default), dan rentang harga 4.000–22.000 (uji format Rupiah).

### 4.4 Aturan Turunan

- **Ringkasan:** total produk = jumlah baris; total stok = `Σ stok`; produk habis = jumlah `stok = 0`; nilai stok = `Σ (harga × stok)`.
- **Pencarian "kopi"** harus menemukan produk yang namanya mengandung "kopi" **dan** produk yang deskripsinya mengandung "kopi".
- **Pemecah seri** sorting selalu Nama A–Z agar urutan stabil dan hasil uji dapat diprediksi.

---

## 5. Non-Functional Requirements

| ID | Aspek | Target yang dapat diperiksa |
|---|---|---|
| NFR-01 | Performa muat | Halaman katalog tampil < 2 detik di `localhost` (Chrome desktop, cache kosong). |
| NFR-02 | Respons interaksi | Pencarian/filter/sorting terasa instan; hasil berubah < 100 ms untuk 8 produk. |
| NFR-03 | Bobot | Bundle JS produksi < 150 KB (gzip), tanpa pustaka UI/grafik. |
| NFR-04 | Responsif | Layout utuh pada lebar 360 px, 768 px, dan 1280 px; tanpa scroll horizontal. |
| NFR-05 | Aksesibilitas dasar | Semua kontrol punya label, fokus keyboard terlihat, gambar punya teks alternatif, kontras teks ≥ 4,5:1, perubahan jumlah hasil diumumkan lewat `aria-live`. |
| NFR-06 | Kompatibilitas | Dua versi terakhir Chrome, Edge, Firefox, dan Safari (desktop + mobile) — diuji minimal di Chrome. |
| NFR-07 | Ketahanan | Data localStorage rusak tidak membuat halaman blank; ada fallback ke data contoh. |
| NFR-08 | Keamanan & privasi | Tidak ada API key, token, atau `.env` berisi rahasia; tidak ada analytics/tracker; tidak ada nomor telepon atau data pribadi di data contoh maupun localStorage; tautan eksternal memakai `rel="noopener"`. |
| NFR-09 | Keterpeliharaan | Struktur folder jelas (data, komponen UI, utilitas), tanpa framework; fungsi format Rupiah dan validasi dipakai ulang, tidak diduplikasi. |
| NFR-10 | Operasional | Berjalan dengan `npm install` + `npm run dev`; build produksi `npm run build` tanpa galat; dapat di-deploy statis (Vercel) tanpa konfigurasi backend. |

---

## 6. Risiko

| ID | Risiko | Dampak | Mitigasi |
|---|---|---|---|
| R-01 | Scope melebar (checkout, ongkir, login, riwayat pesanan) | Iterasi tidak selesai dalam 1 hari | Non-goal di bagian 7 bersifat mengikat; perubahan scope harus mengubah dokumen ini lebih dulu |
| R-02 | Data localStorage rusak/kuota penuh | Aplikasi blank atau data hilang | FR-21 + NFR-07: fallback ke data contoh, pesan galat, tombol reset |
| R-03 | Popup WhatsApp diblokir browser | Struk tidak terbuka | Tampilkan pratinjau teks + tombol "Salin teks" sebagai jalur cadangan; buka tautan dari klik pengguna langsung |
| R-04 | Stok tidak sinkron antara katalog, keranjang, dan dashboard | Pesanan melebihi stok | Satu sumber data; validasi ulang stok saat membuat struk (FR-12, FR-14); qty disesuaikan |
| R-05 | Keranjang hilang saat refresh | Kasir mengulang input | Dinyatakan di UI; keranjang sengaja tidak dipersist untuk menjaga scope |
| R-06 | Aset gambar hilang/berat | Kartu rusak, muat lambat | SVG placeholder lokal < 20 KB per file, `loading="lazy"`, handler `onerror` ke placeholder |
| R-07 | Editor/agen AI mengubah berkas di luar fitur | Regresi tak terduga | Satu iterasi = satu fitur; tinjau `git diff`; commit per iterasi |
| R-08 | Waktu habis di iterasi CRUD | Demo tanpa dashboard | Prioritas: I1–I5 sebelum poles; dashboard CRUD dipersempit ke field inti bila waktu mendesak (catat penyimpangan) |
| R-09 | Nomor WhatsApp dianggap data yang perlu disimpan | Bocor data pribadi | Keputusan desain: nomor tidak pernah diminta/di-hardcode; `wa.me` tanpa nomor tujuan |

---

## 7. Out of Scope

Secara tegas **tidak** dikerjakan pada versi ini:

- Backend, database, API, serverless function, atau integrasi pembayaran apa pun.
- Login/autentikasi nyata maupun **login palsu**, peran pengguna, atau pembatasan akses dashboard.
- Riwayat pesanan/transaksi, laporan penjualan, pembukuan, dan ekspor CSV.
- Pembatalan/refund otomatis, audit log perubahan stok.
- Unggah file gambar dari perangkat (hanya path lokal/URL yang diisi lewat form).
- Cetak thermal, barcode scanner, SKU, varian produk, dan ongkir.
- PWA/instalasi offline penuh, sinkronisasi antar-tab, multi-perangkat, i18n, dark mode.
- Optimasi SEO/SSR dan uji beban.

---

## 8. Acceptance Criteria (verifikasi manual)

Semua pengujian dilakukan di browser pada `npm run dev`, kecuali disebutkan lain. "Data awal" berarti hasil "Reset data contoh".

### 8.1 Katalog

**AC-01 — Katalog awal**
Langkah: buka aplikasi dengan localStorage kosong.
Diharapkan: 8 kartu produk tampil; setiap kartu memuat gambar (atau placeholder), nama, kategori, harga berformat `Rp`, dan info stok; 3 kartu berlabel "Unggulan".

**AC-02 — Format Rupiah & stok habis**
Langkah: periksa kartu "Kopi Susu Gula Aren" dan "Pisang Goreng Keju (4 pcs)".
Diharapkan: harga tertulis `Rp18.000` (tanpa desimal); Pisang Goreng menampilkan label "Habis" dan tombol "Pesan" nonaktif.

**AC-03 — Gambar lokal & fallback**
Langkah: (a) buka DevTools → Network, muat ulang halaman; (b) di dashboard, ubah `imageUrl` satu produk menjadi `/img/produk/tidak-ada.svg`.
Diharapkan: (a) tidak ada permintaan gambar ke domain luar; (b) kartu menampilkan placeholder, bukan ikon gambar rusak.

### 8.2 Pencarian, Filter, Sorting

**AC-04 — Pencarian nama**
Langkah: ketik `kopi` pada kolom pencarian.
Diharapkan: hanya produk yang nama/deskripsinya mengandung "kopi" yang tampil; penghitung hasil menunjukkan jumlah yang sama dengan jumlah kartu.

**AC-05 — Pencarian tidak peka huruf & spasi**
Langkah: bandingkan hasil untuk `KOPI` , `kopi`, dan `  kopi  `.
Diharapkan: ketiganya menghasilkan daftar yang identik.

**AC-06 — Pencarian multi-kata (AND)**
Langkah: ketik `nasi kampung`.
Diharapkan: "Nasi Goreng Kampung" tampil; produk yang hanya cocok salah satu kata tidak tampil.

**AC-07 — Filter kategori**
Langkah: pilih kategori "Minuman" tanpa kata kunci.
Diharapkan: hanya 3 produk minuman tampil; memilih "Semua" mengembalikan 8 produk.

**AC-08 — Sorting**
Langkah: uji tiap opsi sorting pada data awal.
Diharapkan: "Unggulan dulu" menampilkan 3 produk unggulan lebih dulu (masing-masing urut A–Z); "Nama A–Z" alfabetis; "Harga terendah" dimulai `Rp4.000`; "Harga tertinggi" dimulai `Rp22.000`. Tidak ada produk hilang/duplikat.

**AC-09 — Kombinasi & kondisi kosong**
Langkah: pilih kategori "Minuman", ketik `geprek`.
Diharapkan: 0 kartu, pesan "Produk tidak ditemukan" dengan kata kunci `geprek`, tombol "Reset pencarian" mengembalikan pencarian kosong, kategori "Semua", sorting "Unggulan dulu", dan 8 kartu.

### 8.3 Keranjang & Struk WhatsApp

**AC-10 — Tambah ke keranjang**
Langkah: klik "Pesan" pada Kopi Susu dua kali, lalu `+` satu kali.
Diharapkan: keranjang menampilkan Kopi Susu dengan qty 3 dan subtotal `Rp54.000`; total keranjang `Rp54.000`.

**AC-11 — Batas stok**
Langkah: tambah qty produk berstok 1 (atur lewat dashboard) melebihi stok.
Diharapkan: qty berhenti di 1 dan tombol `+` nonaktif/berpesan "Stok tidak cukup"; tidak ada nilai negatif.

**AC-12 — Struk & pengurangan stok**
Langkah: catat stok Kopi Susu (24), buat pesanan qty 3, klik "Buat struk".
Diharapkan: pratinjau struk memuat nama toko, tanggal/jam, `Kopi Susu Gula Aren × 3 = Rp54.000`, total `Rp54.000`; setelah struk dibuat, stok menjadi 21 di katalog dan dashboard, dan nilainya bertahan setelah refresh.

**AC-13 — Tautan WhatsApp**
Langkah: dari pratinjau struk, klik "Kirim via WhatsApp"; periksa juga atribut tautan.
Diharapkan: tab `wa.me` terbuka dengan teks struk yang terbaca (baris baru & `×` utuh); tidak ada nomor tujuan pada URL; tautan memakai `rel="noopener"`. Bila popup diblokir, tombol "Salin teks" tetap menyediakan isi struk.

**AC-14 — Keranjang kosong & refresh**
Langkah: kosongkan keranjang, lalu refresh halaman dengan item di keranjang.
Diharapkan: "Buat struk" nonaktif saat kosong; setelah refresh keranjang kosong dan ada keterangan bahwa keranjang tidak disimpan.

### 8.4 Dashboard CRUD

**AC-15 — Ringkasan**
Langkah: buka Dashboard pada data awal.
Diharapkan: total produk 8, total stok 169, produk habis 1, nilai stok `Rp1.756.000` (18.000×24 + 5.000×40 + 20.000×15 + 22.000×12 + 18.000×10 + 12.000×0 + 10.000×18 + 4.000×50).

**AC-16 — Tambah produk**
Langkah: tambah produk "Es Jeruk" / Minuman / 8000 / 20 / unggulan aktif.
Diharapkan: produk muncul di tabel, ringkasan berubah (total produk 9, total stok 189, nilai stok `Rp1.916.000`), kartu muncul di katalog, dan data bertahan setelah refresh.

**AC-17 — Validasi form**
Langkah: coba simpan dengan nama kosong, harga `-1`, harga `12,5`, stok `abc`, dan deskripsi 161 karakter.
Diharapkan: masing-masing menampilkan pesan galat pada field terkait, data tidak tersimpan, dan nilai lain di form tidak hilang.

**AC-18 — Nama duplikat**
Langkah: tambah produk dengan nama `kopi susu gula aren`.
Diharapkan: ditolak dengan pesan "Nama produk sudah dipakai" (tidak peka huruf besar/kecil).

**AC-19 — Edit & hapus**
Langkah: ubah harga Es Teh menjadi 6000; lalu hapus produk yang sedang ada di keranjang.
Diharapkan: harga baru langsung terlihat di katalog; penghapusan meminta konfirmasi; produk keluar dari keranjang dengan pemberitahuan; ringkasan menyesuaikan.

**AC-20 — Reset data**
Langkah: lakukan beberapa perubahan, klik "Reset data contoh", setujui konfirmasi.
Diharapkan: kembali tepat ke 8 produk awal dengan stok dan harga sesuai bagian 4.3; bertahan setelah refresh.

### 8.5 Persistensi & Ketahanan

**AC-21 — Kunci & bentuk penyimpanan**
Langkah: periksa localStorage di DevTools.
Diharapkan: hanya kunci `kasirlokal.products.v1` yang dibuat aplikasi, berisi `version: 1`, `updatedAt`, dan array 8 produk; tidak ada kunci berisi data pribadi.

**AC-22 — Data rusak**
Langkah: isi `kasirlokal.products.v1` dengan teks `rusak{`, lalu muat ulang.
Diharapkan: aplikasi tetap tampil dengan data contoh dan banner peringatan; tidak ada halaman blank; data dapat dipulihkan lewat reset.

### 8.6 Non-fungsional

**AC-23 — Responsif**
Langkah: uji lebar 360 px, 768 px, 1280 px (DevTools device mode).
Diharapkan: tidak ada scroll horizontal, tombol dapat ditekan, teks tidak terpotong, keranjang tetap dapat diakses.

**AC-24 — Keyboard & label**
Langkah: navigasi katalog dan form hanya dengan Tab/Shift+Tab/Enter/Space.
Diharapkan: fokus terlihat di setiap kontrol, urutan fokus masuk akal, kolom pencarian dan tombol dapat dioperasikan, gambar memiliki teks alternatif.

**AC-25 — Build & bersih-bersih**
Langkah: jalankan `npm run build` lalu `npm run preview`; cari `api`, `key`, `token`, `secret` di repo.
Diharapkan: build sukses tanpa galat, aplikasi berjalan dari hasil build, dan tidak ditemukan API key/rahasia maupun permintaan jaringan ke layanan pihak ketiga (selain `wa.me` saat diklik).

---

## 9. Implementation Plan per Iterasi

Total anggaran ± 7 jam kerja + 30 menit buffer untuk latihan 1 hari. Setiap iterasi berakhir dengan commit dan pemeriksaan manual singkat.

### I0 — Fondasi proyek (30 menit)
- Scaffold Vite (vanilla JS), struktur folder: `src/data`, `src/ui`, `src/lib`, `public/img/produk`, `src/styles`.
- Siapkan modul data contoh 8 produk + 8 aset SVG placeholder < 20 KB.
- `README.md` berisi cara menjalankan, kunci localStorage, dan daftar AC.
- **Selesai bila:** `npm run dev` menampilkan halaman kosong tanpa galat konsol; data contoh dapat diimpor dan dicetak ke konsol saat pengembangan.

### I1 — Lapisan data & penyimpanan (60 menit)
- Muat/simpan localStorage, seed otomatis, `version`, `updatedAt`, fallback data rusak, reset data contoh.
- Fungsi validasi produk, pembuat `id`, format Rupiah, dan ringkasan (4 metrik).
- **Selesai bila:** AC-15 lolos lewat pemeriksaan nilai; menambah/mengubah objek di data mengubah hasil ringkasan; data bertahan setelah refresh (AC-21 sebagian).

### I2 — Katalog (75 menit)
- Grid kartu responsif, gambar lokal + fallback, harga Rupiah, badge unggulan, label "Habis", tombol pesan.
- Tab "Katalog" dan "Dashboard" (dashboard masih kosong).
- **Selesai bila:** AC-01, AC-02, AC-03 lolos; layout 360 px rapi.

### I3 — Pencarian, filter, sorting (60 menit)
- Input pencarian (nama + deskripsi, AND, trim), filter kategori, sorting 4 opsi, penghitung hasil, kondisi kosong + reset.
- **Selesai bila:** AC-04 s.d. AC-09 lolos.

### I4 — Keranjang & struk WhatsApp (75 menit)
- Panel keranjang, qty stepper, batas stok, total, pratinjau struk, `wa.me`, salin teks, pengurangan stok sekali per struk.
- **Selesai bila:** AC-10 s.d. AC-14 lolos; stok di katalog dan dashboard konsisten setelah refresh.

### I5 — Dashboard CRUD & ringkasan (90 menit)
- Tabel produk, form tambah/edit dengan validasi per field, konfirmasi hapus, sinkronisasi keranjang, kartu ringkasan, reset data.
- **Selesai bila:** AC-16 s.d. AC-20 lolos; AC-15 tetap lolos setelah perubahan data.

### I6 — Poles, aksesibilitas, verifikasi (45 menit)
- Label/`aria-live`, fokus keyboard, kontras, `loading="lazy"`, `rel="noopener"`, pesan galat kuota.
- Jalankan seluruh AC-01 s.d. AC-25 dan catat status di README (lolos / tidak / catatan).
- **Selesai bila:** tidak ada AC berstatus gagal tanpa catatan; `npm run build` sukses.

### I7 — Buffer & demo (30 menit)
- Perbaiki temuan I6, deploy statis ke Vercel, siapkan skrip demo 3 menit: katalog → cari/filter → pesan → struk → dashboard → reset.
- **Selesai bila:** URL demo dapat dibuka di ponsel dan alur demo berjalan tanpa intervensi manual di luar skrip.

**Aturan kerja selama iterasi:**

1. Satu iterasi = satu fitur; jangan menyentuh berkas di luar lingkup iterasi.
2. Tinjau `git diff` sebelum setiap commit; commit per iterasi dengan pesan yang menyebut ID fitur/AC.
3. Bila spesifikasi meragukan, tanyakan dan perbarui `SPEC.md` lebih dulu — jangan mengarang keputusan di kode.
4. Jangan menyimpan API key/rahasia, jangan menjalankan perintah destruktif (`rm -rf`, `git reset --hard`, force push), dan jangan memakai data pribadi pada data contoh.
5. Bila waktu habis, hentikan fitur yang sedang berjalan pada kondisi stabil, catat penyimpangan di README, dan jangan meninggalkan build yang gagal.
