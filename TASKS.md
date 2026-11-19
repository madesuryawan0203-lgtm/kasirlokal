# TASKS — KasirLokal

**Versi:** 1.0 · **Tanggal:** 19 November 2026
**Mengacu pada:** `SPEC.md` v1.0 (FR-01 – FR-21, AC-01 – AC-25, iterasi I0 – I7) dan `UI-SPEC.md` v1.0 (token, komponen, wireframe, QA visual)
**Status repo:** baru berisi dokumen (`CATATAN.md`, `SPEC.md`, `UI-SPEC.md`). **Belum ada kode aplikasi.**
**Sifat dokumen:** rencana kerja. Semua path di bawah adalah **target**, bukan file yang sudah ada. Tugas tidak mengubah kode apa pun sampai Anda memilih untuk mengeksekusinya.

---

## 0. Cara Memakai Dokumen Ini

1. Kerjakan **satu tugas** dalam satu waktu; jangan gabungkan dua tugas dalam satu commit.
2. Sebelum commit: periksa `git diff`, jalankan acceptance criteria tugas, catat hasilnya di README.
3. Bila spesifikasi meragukan, perbarui `SPEC.md`/`UI-SPEC.md` lebih dulu (perubahan scope), baru kode.
4. Bila waktu habis, hentikan pada kondisi stabil dan catat penyimpangan; jangan meninggalkan build gagal.

**Definition of Done global (berlaku untuk semua tugas):**

- Semua AC tugas lolos secara manual dan dicatat (lolos / gagal / catatan).
- `npm run dev` tidak menghasilkan galat konsol; `npm run build` tetap sukses sejak M1.
- Untuk tugas UI: diperiksa pada 360 px, 768 px, dan 1280 px, tanpa scroll horizontal.
- Tidak ada berkas di luar daftar "Berkas" yang ikut berubah; tidak ada rahasia, data pribadi, atau perintah destruktif.
- Commit menyebut ID tugas, mis. `feat(M2-T1): render katalog 8 produk (AC-01, AC-02)`.

**Legenda:** AC merujuk nomor di `SPEC.md` §8; QA merujuk `UI-SPEC.md` §9. Estimasi termasuk review dan commit.

---

## 1. Ringkasan Milestone

| # | Milestone | Tugas | Estimasi | Iterasi SPEC | Keluaran utama |
|---|---|---|---|---|---|
| M1 | Scaffold | 4 | 40 mnt | I0, I1 (awal) | Proyek Vite, token, seed, kontrak storage |
| M2 | Katalog | 3 | 60 mnt | I2 | Grid produk, hero, layout responsif |
| M3 | Pencarian/filter/sorting | 3 | 45 mnt | I3 | Filter bar, logika filter, empty state |
| M4 | Keranjang & WhatsApp | 4 | 70 mnt | I4 | Keranjang, pratinjau struk, `wa.me`, stok |
| M5 | CRUD dashboard | 4 | 85 mnt | I5 | Ringkasan, tabel, form, hapus/reset |
| M6 | localStorage | 3 | 35 mnt | I1, I6 | Persistensi penuh, fallback, banner |
| M7 | Testing | 4 | 40 mnt | I6 | Matriks AC, uji unit, regresi |
| M8 | Security | 3 | 20 mnt | I6 | Audit rahasia, XSS, privasi |
| M9 | Build | 2 | 15 mnt | I6 | Build produksi bersih |
| M10 | Deployment | 2 | 20 mnt | I7 | URL demo + dokumentasi |
| | **Total** | **32** | **± 7 j 10 mnt** | | + buffer 30 mnt (I7) |

**Urutan dependensi:**

```
M1 ──▶ M2 ──▶ M3 ──▶ M4 ──▶ M5 ──▶ M6 ──▶ M7 ──▶ M8 ──▶ M9 ──▶ M10
                   │        │
                   └────────┴── memakai kontrak storage dari T1.4
```

Catatan penting: **inti storage dibuat di T1.4** (load/save/seed/format/validasi), karena M4 dan M5 membutuhkannya. **M6 bukan pembuatan dari nol**, melainkan pengerasan: persistensi semua mutasi, fallback data rusak, kuota penuh, dan audit kunci.

---

## 2. Peta Berkas Target

Struktur ini menjadi acuan kolom "Berkas" pada setiap tugas. Jangan menambah folder baru tanpa memperbarui peta ini.

```
index.html                      shell HTML, landmark, mount point
package.json / package-lock.json
.gitignore                      node_modules, dist, .env*, .vercel
README.md                       cara jalan, kunci storage, matriks AC, skrip demo
vite.config.js                  hanya bila base/konfigurasi diperlukan
vercel.json                     opsional; hanya bila perlu rewrite

src/main.js                     bootstrap, routing tab, wiring state
src/styles/tokens.css           warna, tipe, spasi, radius, bayangan (UI-SPEC §2)
src/styles/base.css             reset ringan, tipografi, fokus, skip link
src/styles/layout.css           container, grid, navbar, footer
src/styles/components.css       kartu, tombol, chip, dialog, form, tabel, toast
src/styles/responsive.css       penyesuaian breakpoint UI-SPEC §7

src/data/seed.js                8 produk contoh (SPEC §4.3)
src/data/categories.js          enum Makanan/Minuman/Camilan + label filter

src/lib/storage.js              load/save/seed/reset, validasi envelope, kuota
src/lib/format.js               Rupiah, tanggal struk, tabular display
src/lib/validate.js             validasi produk & form per field
src/lib/summary.js              4 metrik dashboard
src/lib/filter.js               pencarian AND, kategori, sorting stabil
src/lib/cart.js                 state keranjang, qty, total, batas stok
src/lib/receipt.js              teks struk + URL wa.me
src/lib/dom.js                  helper render aman (textContent), fallback gambar

src/ui/navbar.js                logo, tab, badge keranjang
src/ui/hero.js                  hero + CTA
src/ui/productCard.js           kartu produk + state stok
src/ui/catalog.js               grid + empty state katalog
src/ui/filters.js               input, chip, sorting, hitung hasil
src/ui/cartPanel.js             aside desktop + isi sheet
src/ui/cartBar.js               bottom bar mobile
src/ui/receiptModal.js          pratinjau struk, salin, kirim
src/ui/summaryCards.js          4 kartu ringkasan
src/ui/productTable.js          tabel desktop + daftar kartu mobile
src/ui/productForm.js           drawer/sheet tambah & edit
src/ui/dialog.js                dialog konfirmasi + focus trap
src/ui/toast.js                 toast
src/ui/banner.js                banner penyimpanan
src/pages/catalogPage.js        komposisi halaman katalog
src/pages/dashboardPage.js      komposisi halaman dashboard

public/img/produk/*.svg         8 aset produk (< 20 KB/file)
public/img/placeholder.svg      placeholder lokal
public/favicon.svg
tests/*.test.js                 uji unit pure functions (opsional, M7)
```

---

## M1 — Scaffold

**Hasil milestone:** proyek bisa dijalankan, tampilan dasar mengikuti token, data contoh tersedia, dan kontrak penyimpanan siap dipakai milestone berikutnya.

### T1.1 — Inisialisasi proyek & toolchain
**Estimasi:** 8 mnt · **Depends:** —

**Acceptance criteria**
- `npm install`, `npm run dev`, dan `npm run build` sukses; halaman awal tampil tanpa galat konsol.
- Struktur folder sesuai peta bagian 2 (folder kosong boleh, file belum).
- `.gitignore` memuat `node_modules`, `dist`, `.env*`, `.vercel`; `git status` bersih setelah commit.
- Tidak ada dependency runtime tambahan selain Vite (dev dependency); tidak ada API key/rahasia di repo.

**Berkas:** `package.json`, `package-lock.json`, `.gitignore`, `index.html`, `src/main.js`, `README.md`.

### T1.2 — Token desain, shell layout, navigasi tab
**Estimasi:** 8 mnt · **Depends:** T1.1

**Acceptance criteria**
- Token UI-SPEC §2.1–2.4 tersedia dan dipakai (warna, skala tipe, spasi, radius); sampling 3 pasangan kontras sesuai tabel §2.2.
- Navbar sticky 56/64 px dengan logo, tab "Katalog"/"Dashboard"; berpindah tab tanpa reload dan state aktif terlihat.
- Skip link "Lewati ke katalog" adalah elemen fokus pertama dan berfungsi.
- Pada 360 px tidak ada scroll horizontal pada shell kosong.

**Berkas:** `src/styles/tokens.css`, `base.css`, `layout.css`, `src/ui/navbar.js`, `src/main.js`, `index.html`.

### T1.3 — Data contoh & aset produk
**Estimasi:** 10 mnt · **Depends:** T1.1

**Acceptance criteria**
- `seed.js` memuat tepat 8 produk sesuai SPEC §4.3: id, nama, kategori, harga, stok, unggulan, ditambah deskripsi 1 kalimat.
- 8 SVG produk + 1 placeholder tersedia, masing-masing < 20 KB, rasio 4:3, gaya flat 2 warna (UI-SPEC §2.6).
- Semua `imageUrl` menunjuk path lokal `/img/produk/...`; tidak ada URL eksternal.
- Placeholder dapat ditampilkan bila `imageUrl` kosong (diverifikasi visual, bukan hanya file ada).

**Berkas:** `src/data/seed.js`, `src/data/categories.js`, `public/img/produk/*.svg`, `public/img/placeholder.svg`.

### T1.4 — Kontrak storage, format, validasi, ringkasan
**Estimasi:** 14 mnt · **Depends:** T1.1, T1.3

**Acceptance criteria**
- `load()` menulis seed saat kunci `kasirlokal.products.v1` kosong; `save()` melakukan roundtrip dengan `version: 1` dan `updatedAt` yang berubah.
- `formatRupiah`: `18000 → "Rp18.000"`, `0 → "Rp0"`, `1756000 → "Rp1.756.000"`.
- `validateProduct` menolak: nama kosong/>60, nama duplikat (tanpa peka huruf), kategori di luar enum, harga negatif/desimal, stok negatif/desimal; pesan galat per field.
- `summary()` pada data awal menghasilkan total produk 8, total stok 169, produk habis 1, nilai stok 1756000.

**Berkas:** `src/lib/storage.js`, `src/lib/format.js`, `src/lib/validate.js`, `src/lib/summary.js`, `src/data/seed.js`.

**Exit criteria M1:** aplikasi kosong berjalan, token tampil, seed termuat, fungsi inti lulus pemeriksaan konsol/DevTools.
**Commit:** `chore(M1): scaffold Vite, token, seed, kontrak storage`

---

## M2 — Katalog

**Hasil milestone:** 8 produk tampil sebagai kartu sesuai UI-SPEC §5.3 dan wireframe 6.1/6.3, dengan harga, badge, dan state stok yang benar.

### T2.1 — Grid & kartu produk
**Estimasi:** 22 mnt · **Depends:** M1

**Acceptance criteria**
- AC-01: 8 kartu tampil; setiap kartu memuat gambar/placeholder, nama, kategori, harga `Rp`, info stok; 3 kartu berlabel "Unggulan".
- AC-02: "Kopi Susu Gula Aren" menampilkan `Rp18.000`; "Pisang Goreng Keju (4 pcs)" menampilkan badge "Habis", teks "Stok habis", dan tombol "Habis" nonaktif.
- Struktur kartu mengikuti UI-SPEC §5.3 (gambar 4:3, badge, kategori, nama maks. 2 baris, harga tabular, tombol 44 px).
- Klik "Pesan" pada produk berstok memicu callback (belum perlu keranjang; dicatat di konsol saat pengembangan).

**Berkas:** `src/ui/productCard.js`, `src/ui/catalog.js`, `src/pages/catalogPage.js`, `src/styles/components.css`.

### T2.2 — Hero, penghitung hasil, layout responsif
**Estimasi:** 18 mnt · **Depends:** T2.1

**Acceptance criteria**
- Hero memakai mikrokopi UI-SPEC §5.1; "Lihat menu" menggulir ke `#katalog`, "Kelola produk" membuka tab Dashboard.
- Grid: 2 kolom di 360–767 px, 3 kolom di 768–1023 px, 3 kolom + aside 360 px di ≥1024 px (aside masih kosong pada tahap ini).
- Penghitung "8 produk" tampil dan diperbarui dari jumlah data.
- AC-23 sebagian: tidak ada scroll horizontal dan tidak ada teks terpotong pada 360/768/1280 px.

**Berkas:** `src/ui/hero.js`, `src/ui/catalog.js`, `src/pages/catalogPage.js`, `src/styles/layout.css`, `src/styles/responsive.css`.

### T2.3 — Gambar lokal, fallback, aksesibilitas kartu
**Estimasi:** 20 mnt · **Depends:** T2.1

**Acceptance criteria**
- AC-03: panel Network tidak menunjukkan permintaan gambar eksternal; `imageUrl` yang diubah ke path tidak ada menampilkan placeholder tanpa ikon rusak.
- Semua gambar produk punya `alt` = nama produk dan `loading="lazy"`; placeholder dekoratif memakai `alt=""`.
- Tombol "Pesan"/"Habis" dapat difokuskan dengan Tab dan ring fokus terlihat (QA #4 sebagian).
- Kartu tidak memiliki affordance klik palsu (gambar/nama tidak reaktif).

**Berkas:** `src/ui/productCard.js`, `src/lib/dom.js`, `src/styles/components.css`, `public/img/placeholder.svg`.

**Exit criteria M2:** AC-01, AC-02, AC-03 lolos; layout 360 px rapi; tidak ada galat konsol.
**Commit:** `feat(M2): katalog 8 produk responsif (AC-01–AC-03)`

---

## M3 — Interaksi Pencarian, Filter, Sorting

**Hasil milestone:** katalog dapat disaring dan diurutkan sesuai FR-06 – FR-10 tanpa kehilangan data.

### T3.1 — Logika filter & sorting murni
**Estimasi:** 18 mnt · **Depends:** M2

**Acceptance criteria**
- Pencarian pada nama **dan** deskripsi, tidak peka huruf besar/kecil, trim spasi, multi-kata AND (AC-04, AC-05, AC-06).
- Filter kategori menghasilkan subset tepat (Minuman = 3 produk); "Semua" mengembalikan 8 (AC-07).
- Sorting benar untuk 4 opsi dengan pemecah seri Nama A–Z; tidak ada produk hilang/duplikat (AC-08).
- Pipeline pencarian + filter + sorting berlaku bersamaan dan tidak memutasi array sumber (diperiksa dengan urutan data setelah pemanggilan).

**Berkas:** `src/lib/filter.js`.

### T3.2 — Filter bar & state UI
**Estimasi:** 18 mnt · **Depends:** T3.1

**Acceptance criteria**
- Input pencarian 44 px dengan tombol ✕ (muncul saat terisi, `aria-label`), chip kategori `aria-pressed`, select sorting berlabel "Urutkan".
- Perubahan input/filter/sorting langsung memperbarui grid dan penghitung hasil; `aria-live="polite"` mengumumkan jumlah hasil.
- Layout filter mengikuti UI-SPEC §5.2: 1 baris desktop, 3 baris mobile; chip dapat digulir horizontal di 360 px.
- Keyboard: seluruh kontrol dapat dioperasikan Tab/Enter/Space tanpa mouse.

**Berkas:** `src/ui/filters.js`, `src/pages/catalogPage.js`, `src/styles/components.css`, `src/styles/responsive.css`.

### T3.3 — Kondisi kosong & reset
**Estimasi:** 9 mnt · **Depends:** T3.2

**Acceptance criteria**
- AC-09: kategori "Minuman" + kata kunci `geprek` → 0 kartu, pesan "Produk tidak ditemukan", kata kunci ditampilkan.
- "Reset pencarian" mengosongkan input, kategori "Semua", sorting "Unggulan dulu", dan mengembalikan 8 kartu.
- Empty state tidak menyisakan ruang kosong aneh di layout dan tombolnya dapat dijangkau keyboard.

**Berkas:** `src/ui/catalog.js`, `src/ui/filters.js`, `src/styles/components.css`.

**Exit criteria M3:** AC-04 s.d. AC-09 lolos; tidak ada regresi AC-01–AC-03.
**Commit:** `feat(M3): pencarian, filter kategori, sorting (AC-04–AC-09)`

## M4 — Keranjang & WhatsApp

**Hasil milestone:** kasir dapat menyusun pesanan, melihat total, membuat struk, mengirimnya lewat WhatsApp, dan stok berkurang sekali per struk.

### T4.1 — State keranjang & panel (desktop + mobile)
**Estimasi:** 18 mnt · **Depends:** M3

**Acceptance criteria**
- AC-10: klik "Pesan" menambah 1 item; badge keranjang di navbar memperbarui jumlah.
- ≥1024 px: keranjang tampil sebagai aside sticky 360 px; <1024 px: bottom bar muncul hanya saat ada item dan membuka bottom sheet.
- Panel menampilkan nama, harga satuan, qty, subtotal, dan total; kondisi kosong memakai mikrokopi UI-SPEC §5.4–5.5.
- Disclaimer "Keranjang tidak tersimpan saat halaman dimuat ulang." terlihat; refresh mengosongkan keranjang (AC-14 sebagian).

**Berkas:** `src/lib/cart.js`, `src/ui/cartPanel.js`, `src/ui/cartBar.js`, `src/pages/catalogPage.js`, `src/styles/components.css`, `src/styles/responsive.css`.

### T4.2 — Qty, batas stok, hapus item
**Estimasi:** 15 mnt · **Depends:** T4.1

**Acceptance criteria**
- Stepper `− qty +` mengubah qty; subtotal dan total ikut berubah; hit area ≥ 44 px.
- AC-11: qty tidak dapat melebihi stok; tombol `+` nonaktif saat batas; tidak ada nilai negatif.
- `−` pada qty 1 menghapus item dan menampilkan toast "Item dihapus dari keranjang."; tombol hapus per item bekerja dengan `aria-label` yang menyebut nama.
- "Buat struk" nonaktif saat keranjang kosong.

**Berkas:** `src/lib/cart.js`, `src/ui/cartPanel.js`, `src/ui/cartBar.js`, `src/ui/toast.js`.

### T4.3 — Pratinjau struk, salin teks, dialog aksesibel
**Estimasi:** 19 mnt · **Depends:** T4.1

**Acceptance criteria**
- AC-12 (isi): struk memuat "KasirLokal · RasaNusa", tanggal/jam lokal, tiap item `nama` + `qty × harga` + subtotal, total, dan "Terima kasih sudah memesan!".
- Teks struk memakai format Rupiah yang sama dengan katalog; baris baru dan simbol `×` tampil utuh.
- "Salin teks" menyalin isi struk; bila clipboard gagal, teks dapat diseleksi manual dan ada pesan arahan.
- Dialog menahan fokus, Esc menutup, fokus kembali ke tombol pemicu (QA #5).

**Berkas:** `src/lib/receipt.js`, `src/lib/format.js`, `src/ui/receiptModal.js`, `src/ui/dialog.js`, `src/styles/components.css`.

### T4.4 — Kirim WhatsApp & pengurangan stok
**Estimasi:** 18 mnt · **Depends:** T4.3, T1.4

**Acceptance criteria**
- AC-13: "Kirim via WhatsApp" membuka `https://wa.me/?text=<encoded>` di tab baru; tidak ada nomor tujuan; tautan `rel="noopener"`; teks terbaca di WhatsApp.
- Popup diblokir → inline alert sesuai mikrokopi, bukan `alert()` browser; "Salin teks" tetap tersedia.
- AC-12 (stok): setelah struk dibuat, stok berkurang tepat sekali sesuai qty di katalog dan dashboard, tersimpan setelah refresh.
- Setelah struk dibuat: dialog tertutup, keranjang kosong, badge hilang, toast "Struk dibuat. Stok diperbarui."

**Berkas:** `src/ui/receiptModal.js`, `src/lib/receipt.js`, `src/lib/cart.js`, `src/lib/storage.js`, `src/ui/toast.js`, `src/pages/catalogPage.js`.

**Exit criteria M4:** AC-10 s.d. AC-14 lolos; stok konsisten setelah refresh; tidak ada regresi AC-01–AC-09.
**Commit:** `feat(M4): keranjang, struk, WhatsApp, pengurangan stok (AC-10–AC-14)`

---

## M5 — CRUD Dashboard

**Hasil milestone:** pengelola dapat melihat ringkasan, menambah, mengubah, menghapus, dan mereset produk; perubahan langsung terlihat di katalog.

### T5.1 — Empat kartu ringkasan
**Estimasi:** 14 mnt · **Depends:** M4

**Acceptance criteria**
- AC-15: data awal menampilkan 8 / 169 / 1 / `Rp1.756.000` dengan label Total produk, Total stok, Produk habis, Nilai stok.
- Angka memakai tabular nums dan format Rupiah; "Produk habis" > 0 memakai aksen bahaya.
- Ringkasan berubah segera setelah tambah/edit/hapus/reset (diverifikasi bersama T5.3–T5.4).
- Layout 2×2 di bawah 768 px, 4 sejajar di atasnya, tanpa potongan teks.

**Berkas:** `src/ui/summaryCards.js`, `src/lib/summary.js`, `src/pages/dashboardPage.js`, `src/styles/components.css`, `src/styles/responsive.css`.

### T5.2 — Tabel desktop & daftar kartu mobile
**Estimasi:** 18 mnt · **Depends:** T5.1

**Acceptance criteria**
- ≥768 px: tabel memuat kolom Produk (thumbnail+nama), Kategori, Harga, Stok (+badge "Habis"), Unggulan, Aksi; header sticky; hover baris `cream-100`.
- <768 px: setiap produk menjadi kartu dengan thumbnail, nama, kategori · harga, stok, dan tombol Edit/Hapus.
- Tombol aksi punya hit area 44 px dan dapat dioperasikan keyboard; "Hapus" memakai warna `danger-700`.
- Data yang tampil berasal dari sumber yang sama dengan katalog (tidak ada salinan state terpisah).

**Berkas:** `src/ui/productTable.js`, `src/pages/dashboardPage.js`, `src/styles/components.css`, `src/styles/responsive.css`.

### T5.3 — Form tambah/edit & validasi
**Estimasi:** 28 mnt · **Depends:** T5.2

**Acceptance criteria**
- AC-16: tambah "Es Jeruk" / Minuman / 8000 / 20 / unggulan → muncul di tabel, ringkasan menjadi 9 / 189 / `Rp1.916.000`, kartu muncul di katalog, data bertahan setelah refresh.
- AC-17: nama kosong, harga `-1`, harga `12,5`, stok `abc`, deskripsi 161 karakter → galat per field, data tidak tersimpan, nilai field lain tidak hilang.
- AC-18: nama `kopi susu gula aren` ditolak dengan pesan "Nama produk sudah dipakai" (tidak peka huruf besar/kecil).
- Fokus pindah ke field galat pertama; pesan galat memakai `aria-describedby`; drawer desktop / sheet mobile menetap di footer aksi.

**Berkas:** `src/ui/productForm.js`, `src/lib/validate.js`, `src/lib/storage.js`, `src/pages/dashboardPage.js`, `src/styles/components.css`.

### T5.4 — Hapus, konfirmasi, sinkron keranjang, reset
**Estimasi:** 25 mnt · **Depends:** T5.3

**Acceptance criteria**
- AC-19: edit harga Es Teh menjadi 6000 langsung terlihat di katalog; hapus produk meminta konfirmasi, mengeluarkan produk dari keranjang dengan pemberitahuan, dan menyesuaikan ringkasan.
- AC-20: "Reset data contoh" setelah konfirmasi mengembalikan tepat 8 produk sesuai SPEC §4.3 dan bertahan setelah refresh.
- Dialog konfirmasi menyebut nama produk/dampak, fokus awal pada "Batal", Esc membatalkan.
- Menghapus produk yang sedang dipakai di struk berikutnya tidak menyebabkan galat (keranjang sudah bersih).

**Berkas:** `src/ui/productTable.js`, `src/ui/dialog.js`, `src/ui/toast.js`, `src/lib/cart.js`, `src/lib/storage.js`, `src/pages/dashboardPage.js`.

**Exit criteria M5:** AC-15 s.d. AC-20 lolos; tidak ada regresi AC-01–AC-14.
**Commit:** `feat(M5): dashboard CRUD, ringkasan, reset (AC-15–AC-20)`

---

## M6 — localStorage

**Hasil milestone:** seluruh mutasi bertahan setelah refresh, data rusak tidak membuat halaman blank, dan kuota penuh ditangani dengan pesan jelas. Inti storage sudah dibuat di T1.4; milestone ini menguji dan mengeraskannya.

### T6.1 — Persistensi semua mutasi & konsistensi state
**Estimasi:** 14 mnt · **Depends:** M5

**Acceptance criteria**
- AC-21: hanya kunci `kasirlokal.products.v1` yang dibuat aplikasi, berisi `version: 1`, `updatedAt`, dan array produk; tidak ada kunci berisi data pribadi.
- Tambah/edit/hapus/reset/pengurangan stok semuanya memicu `save()` dan `updatedAt` berubah.
- Setelah reload: katalog, dashboard, ringkasan, dan stok identik dengan sebelum reload.
- Tidak ada penulisan ganda yang mengubah hasil (stok berkurang satu kali per struk, bukan dua).

**Berkas:** `src/lib/storage.js`, `src/main.js`, `src/pages/dashboardPage.js`, `src/lib/cart.js`.

### T6.2 — Fallback data rusak & kuota penuh
**Estimasi:** 13 mnt · **Depends:** T6.1

**Acceptance criteria**
- AC-22: isi kunci dengan `rusak{` lalu reload → aplikasi tetap tampil, memuat data contoh, dan menampilkan banner peringatan; tidak ada halaman blank.
- Versi tidak dikenal atau bentuk envelope salah diperlakukan sama (fallback + banner), tanpa menghapus data secara diam-diam.
- Simulasi kuota penuh (mock `setItem` melempar `QuotaExceededError`) → perubahan terakhir dibatalkan, state sebelumnya tetap utuh, pesan galat tampil.
- Banner dapat ditutup (44 px) dan tidak menutupi konten secara permanen.

**Berkas:** `src/lib/storage.js`, `src/ui/banner.js`, `src/main.js`, `src/styles/components.css`.

### T6.3 — Reset idempotent & audit kunci
**Estimasi:** 8 mnt · **Depends:** T6.2

**Acceptance criteria**
- Reset dua kali berturut-turut menghasilkan data identik (stok, harga, unggulan) dan `updatedAt` terbaru.
- DevTools → Application → Local Storage hanya memuat kunci aplikasi yang diizinkan; tidak ada nomor telepon/alamat/nama orang.
- Menghapus kunci secara manual lalu reload memicu seed otomatis tanpa banner galat.
- Reset tetap bekerja setelah data rusak (AC-22) sebagai jalur pemulihan.

**Berkas:** `src/lib/storage.js`, `src/pages/dashboardPage.js`, `README.md`.

**Exit criteria M6:** AC-21, AC-22 lolos; persistensi terverifikasi untuk seluruh mutasi; tidak ada regresi AC-12, AC-16, AC-20.
**Commit:** `feat(M6): persistensi, fallback data rusak, penanganan kuota (AC-21, AC-22)`

---

## M7 — Testing

**Hasil milestone:** seluruh AC diperiksa manual dan tercatat; fungsi murni memiliki uji otomatis opsional; tidak ada bug terbuka tanpa catatan.

### T7.1 — Matriks uji manual AC-01 – AC-25
**Estimasi:** 13 mnt · **Depends:** M6

**Acceptance criteria**
- README memuat tabel 25 baris: ID AC, status (lolos/gagal/tertunda), catatan, dan tugas pemilik bila gagal.
- Setiap AC dijalankan pada `npm run dev` dengan data awal (reset lebih dulu).
- Kegagalan dipetakan ke ID tugas (mis. AC-17 → T5.3), bukan deskripsi bebas.
- Tidak ada AC berstatus gagal tanpa catatan alasan dan rencana perbaikan.

**Berkas:** `README.md`.

### T7.2 — Uji unit fungsi murni (opsional, disarankan)
**Estimasi:** 13 mnt · **Depends:** M6

**Acceptance criteria**
- `npm test` menjalankan `node --test` dan lulus 0 gagal, tanpa menambah dependency runtime.
- Cakupan minimal: `formatRupiah`, `validateProduct` (semua aturan), `filterProducts` (AC-04–AC-08), `cart` (tambah/qty/batas/total), `summary` (4 metrik), `buildReceipt` + pembentukan URL.
- Uji tidak memerlukan DOM/browser; modul yang diuji tetap pure (tidak mengimpor `window`).
- Bundle produksi tidak bertambah akibat uji (diverifikasi di M9).

**Berkas:** `tests/format.test.js`, `tests/validate.test.js`, `tests/filter.test.js`, `tests/cart.test.js`, `tests/summary.test.js`, `tests/receipt.test.js`, `package.json`.

### T7.3 — Regresi lintas viewport, keyboard, dan jaringan
**Estimasi:** 8 mnt · **Depends:** T7.1

**Acceptance criteria**
- AC-23: 360/768/1280 px tanpa scroll horizontal; keranjang tetap dapat diakses di semua lebar.
- AC-24: alur katalog → cari → pesan → struk → dashboard dapat diselesaikan hanya dengan keyboard; fokus terlihat; dialog menahan fokus.
- QA #14: `prefers-reduced-motion` mematikan transisi; QA #15: tidak ada permintaan aset eksternal saat muat ulang.
- QA #9: latar tombol WhatsApp bukan `#25D366`.

**Berkas:** `README.md`, `src/styles/components.css`, `src/styles/responsive.css` (hanya bila ada perbaikan).

### T7.4 — Triage & perbaikan bug (timebox)
**Estimasi:** 6 mnt · **Depends:** T7.1, T7.3

**Acceptance criteria**
- Setiap temuan diberi label: blocker / mayor / minor / ditunda.
- Tidak ada blocker atau mayor terbuka saat milestone ditutup; minor boleh ditunda dengan catatan.
- Perbaikan tidak memperluas scope (tidak menambah fitur) dan build tetap hijau.

**Berkas:** modul yang terdampak (maksimal 3 berkas per bug) + `README.md`.

**Exit criteria M7:** matriks AC terisi; `npm test` (bila dikerjakan) hijau; tidak ada blocker/mayor.
**Commit:** `test(M7): matriks AC, uji unit, regresi responsif`

---

## M8 — Security

**Hasil milestone:** tidak ada rahasia, vektor XSS, atau permintaan pihak ketiga; data yang dipakai tetap nonpribadi.

### T8.1 — Audit rahasia & kebersihan perintah
**Estimasi:** 8 mnt · **Depends:** M7

**Acceptance criteria**
- Pencarian `api[_-]?key`, `token`, `secret`, `password` di repo tidak menemukan nilai nyata (hanya nama field/dokumen).
- Tidak ada `.env`/`.env.local` ter-commit; `.gitignore` mencakup pola `.env*`.
- Skrip `package.json` hanya berisi perintah aman (`dev`, `build`, `preview`, `test`); tidak ada `rm -rf`, `git reset --hard`, atau force push.
- `git diff` milestone ini tidak menyentuh logika fitur.

**Berkas:** `.gitignore`, `package.json`, `README.md`.

### T8.2 — Keamanan render & tautan
**Estimasi:** 8 mnt · **Depends:** M7

**Acceptance criteria**
- Semua teks dari pengguna (nama, deskripsi, kategori) dirender via `textContent`/node teks; tidak ada `innerHTML` yang menerima data pengguna.
- Isi struk di-`encodeURIComponent` sebelum masuk URL `wa.me`; tautan eksternal memakai `target="_blank"` + `rel="noopener noreferrer"`.
- Data dari localStorage divalidasi bentuk dan tipenya sebelum dipakai; record cacat ditolak atau diganti seed (tidak dieksekusi).
- Uji cepat: simpan produk bernama `<img src=x onerror=alert(1)>`; nama tampil sebagai teks biasa, tidak ada dialog/JS berjalan.

**Berkas:** `src/lib/dom.js`, `src/ui/productCard.js`, `src/ui/productTable.js`, `src/ui/receiptModal.js`, `src/lib/receipt.js`, `src/lib/storage.js`.

### T8.3 — Audit dependency & privasi
**Estimasi:** 4 mnt · **Depends:** T8.2

**Acceptance criteria**
- `npm audit` tanpa kerentanan high/critical (moderate dicatat).
- Tidak ada analytics, tracker, font eksternal, atau gambar dari domain luar (kecuali `wa.me` saat diklik).
- localStorage dan seed tidak memuat nomor telepon, alamat, atau nama orang; URL WhatsApp tidak memuat nomor tujuan.
- Catatan privasi singkat ditambahkan ke README (data lokal, tanpa backend).

**Berkas:** `package-lock.json` (bila perlu update aman), `README.md`.

**Exit criteria M8:** tidak ada temuan kritis; XSS test negatif; audit dependency bersih.
**Commit:** `chore(M8): audit rahasia, XSS, dependency, privasi`

---

## M9 — Build

**Hasil milestone:** build produksi bersih, ringan, dan dapat dijalankan dari hasil build.

### T9.1 — Build produksi & preview
**Estimasi:** 10 mnt · **Depends:** M8

**Acceptance criteria**
- AC-25 (bagian build): `npm run build` sukses tanpa galat; `npm run preview` menampilkan aplikasi yang berfungsi penuh.
- Bundle JS produksi < 150 KB gzip (NFR-03); tidak ada pustaka UI/grafik.
- Tidak ada galat/warning konsol saat memuat katalog, dashboard, dan membuat struk dari hasil build.
- Seluruh aset (gambar, favicon) termuat dari path lokal.

**Berkas:** `package.json`, `vite.config.js` (hanya bila perlu), `index.html`, `src/main.js`.

### T9.2 — Pembersihan & konfigurasi path
**Estimasi:** 5 mnt · **Depends:** T9.1

**Acceptance criteria**
- Tidak ada `console.log` debug yang tersisa di alur pengguna (kecuali pesan galat yang disengaja).
- Path aset konsisten antara `dev` dan `preview` (tidak ada gambar 404).
- `dist/` tidak ter-commit; `.gitignore` berlaku.
- Build dijalankan ulang setelah pembersihan dan tetap sukses.

**Berkas:** `src/main.js`, `index.html`, `.gitignore`, `vite.config.js`.

**Exit criteria M9:** build + preview hijau, ukuran bundle terukur, tidak ada aset hilang.
**Commit:** `build(M9): produksi bersih, bundle < 150 KB`

---

## M10 — Deployment

**Hasil milestone:** demo dapat dibuka dari URL publik di ponsel, dengan dokumentasi dan jalur rollback.

### T10.1 — Deploy statis ke Vercel
**Estimasi:** 10 mnt · **Depends:** M9

**Acceptance criteria**
- URL HTTPS memuat katalog 8 produk dan tab Dashboard tanpa galat konsol.
- Refresh di root tetap memuat aplikasi (navigasi berbasis tab, bukan path yang butuh rewrite); `vercel.json` hanya ditambahkan bila benar-benar diperlukan.
- localStorage bekerja pada origin produksi (ubah produk → refresh → data bertahan).
- Tautan WhatsApp berfungsi saat dibuka dari ponsel; tidak ada environment variable/secret yang dikonfigurasi.
- Tidak ada backend/function yang ter-deploy.

**Berkas:** `vercel.json` (opsional), `package.json`, `README.md`.

### T10.2 — Dokumentasi demo, status AC, rollback
**Estimasi:** 10 mnt · **Depends:** T10.1

**Acceptance criteria**
- README memuat: cara menjalankan lokal, kunci localStorage, URL demo, dan skrip demo 3 menit (katalog → cari/filter → pesan → struk → dashboard → reset).
- Matriks AC-01 – AC-25 terisi final; setiap penyimpangan dari SPEC dicatat beserta alasannya.
- Jalur rollback terdokumentasi (redeploy build sebelumnya atau `git revert` commit rilis).
- Skrip demo dijalankan sekali dari URL produksi di ponsel dan berhasil tanpa langkah di luar skrip.

**Berkas:** `README.md`.

**Exit criteria M10:** URL demo aktif, skrip demo berhasil, dokumentasi lengkap.
**Commit:** `docs(M10): deploy Vercel, skrip demo, status AC`

---

## 3. Matriks Ketertelusuran AC → Tugas

| AC | Tugas utama | Verifikasi akhir |
|---|---|---|
| AC-01 | T2.1 | T7.1 |
| AC-02 | T2.1 | T7.1 |
| AC-03 | T2.3 | T7.1 |
| AC-04 | T3.1, T3.2 | T7.1 |
| AC-05 | T3.1 | T7.1 |
| AC-06 | T3.1 | T7.1 |
| AC-07 | T3.1, T3.2 | T7.1 |
| AC-08 | T3.1, T3.2 | T7.1 |
| AC-09 | T3.3 | T7.1 |
| AC-10 | T4.1, T4.2 | T7.1 |
| AC-11 | T4.2 | T7.1 |
| AC-12 | T4.3, T4.4, T6.1 | T7.1 |
| AC-13 | T4.3, T4.4 | T7.1, T8.2 |
| AC-14 | T4.1, T4.2, T4.4 | T7.1 |
| AC-15 | T5.1 | T7.1 |
| AC-16 | T5.3, T6.1 | T7.1 |
| AC-17 | T5.3 | T7.1, T7.2 |
| AC-18 | T5.3 | T7.1, T7.2 |
| AC-19 | T5.4 | T7.1 |
| AC-20 | T5.4, T6.3 | T7.1 |
| AC-21 | T6.1, T6.3 | T7.1 |
| AC-22 | T6.2 | T7.1 |
| AC-23 | T2.2, T4.1, T5.1 | T7.3 |
| AC-24 | T1.2, T2.3, T5.3 | T7.3 |
| AC-25 | T8.1, T9.1, T8.3 | T7.1 |

---

## 4. Timebox, Prioritas, dan Pemotongan

**Anggaran:** 7 jam 10 menit kerja + 30 menit buffer = ± 7 jam 40 menit. Buffer hanya untuk perbaikan temuan, bukan fitur baru.

**Garis prioritas bila waktu mepet (dari yang paling boleh dipotong):**

1. T7.2 uji unit (opsional) — lewati, catat di README.
2. T5.2 tampilan tabel desktop boleh disederhanakan (kolom Unggulan digabung ke nama) — catat penyimpangan.
3. T2.2 ilustrasi hero dihilangkan (teks + CTA tetap).
4. T4.3 tombol "Salin teks" tetap wajib (mitigasi R-03), jangan dipotong.

**Yang tidak boleh dipotong:** M1-T1.4, M4-T4.4, M5-T5.3, M6, M8-T8.1/T8.2, M9, M10. Memotong bagian ini melanggar AC atau NFR di `SPEC.md`.

**Sinyal berhenti:** bila satu tugas melebihi estimasi 50%, hentikan, catat kondisi, dan pilih: selesaikan versi minimal yang memenuhi AC, atau tandai tertunda beserta dampaknya ke AC terkait.

---

## 5. Status Pelaksanaan

| Milestone | Status | Tanggal | Catatan |
|---|---|---|---|
| M1 Scaffold | Belum mulai | — | — |
| M2 Katalog | Belum mulai | — | — |
| M3 Pencarian/filter | Belum mulai | — | — |
| M4 WhatsApp | Belum mulai | — | — |
| M5 CRUD | Belum mulai | — | — |
| M6 localStorage | Belum mulai | — | — |
| M7 Testing | Belum mulai | — | — |
| M8 Security | Belum mulai | — | — |
| M9 Build | Belum mulai | — | — |
| M10 Deployment | Belum mulai | — | — |

Dokumen ini tidak mengubah kode. Eksekusi dimulai hanya setelah Anda menyetujui urutan, estimasi, dan batas pemotongan di atas.
