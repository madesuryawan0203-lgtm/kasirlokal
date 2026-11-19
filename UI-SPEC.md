# UI-SPEC — KasirLokal

**Versi:** 1.0 · **Tanggal:** 19 November 2026 · **Status:** Siap dipakai untuk implementasi
**Mengacu pada:** `SPEC.md` v1.0 (FR-01 – FR-21, AC-01 – AC-25)
**Cakupan:** bahasa visual, token desain, komponen, wireframe teks desktop & mobile, checklist QA visual
**Tidak termasuk:** kode aplikasi, library UI, aset final (hanya aturan dan penamaan)

---

## 1. Prinsip & Arah Visual

| Prinsip | Konsekuensi desain |
|---|---|
| **Hangat tapi bersih** | Latar krem (`#FBF7EF`), bukan putih dingin; kartu putih dengan garis tipis, bukan bayangan tebal. |
| **Emerald = tindakan, rempah = selera** | Hijau emerald hanya untuk aksi utama, tautan, dan status positif. Terracotta/rempah dipakai tipis untuk aksen kategori dan garis dekoratif — tidak untuk tombol utama. |
| **Mobile-first, konter-friendly** | Semua target sentuh ≥ 44 px; total keranjang selalu terlihat di layar kecil; tidak ada info yang hanya muncul saat hover. |
| **Ramah UMKM, bukan startup** | Bahasa Indonesia sehari-hari ("Pesan", "Buat struk", "Kelola produk"), tanpa istilah teknis di UI. |
| **Tenang** | Maksimal 2 warna aksen per layar; gambar ilustratif sederhana; tanpa animasi berlebih. |
| **Bisa diperiksa** | Setiap komponen punya state eksplisit dan checklist QA yang bisa dicocokkan dengan AC di `SPEC.md`. |

Rasio komposisi warna per layar: **60% krem/putih, 30% tinta netral, 10% emerald + rempah**.

---

## 2. Design Tokens

Nama token di bawah adalah kontrak penamaan untuk implementasi (CSS custom property), bukan kode.

### 2.1 Warna

| Token | Hex | Pemakaian |
|---|---|---|
| `cream-50` | `#FBF7EF` | Latar halaman, latar sticky bar |
| `cream-100` | `#F3ECE0` | Hero, section alternatif, latar pratinjau struk, hover baris tabel |
| `cream-200` | `#E9DFCE` | Pemisah dekoratif, latar placeholder gambar |
| `white` | `#FFFFFF` | Kartu, dialog, input |
| `ink-900` | `#17251E` | Teks utama, judul |
| `ink-600` | `#55605A` | Teks sekunder, label stok, helper |
| `border` | `#E2D9C8` | Garis kartu/tabel (dekoratif) |
| `input-border` | `#6F7D75` | Garis input/select (batas kontrol interaktif) |
| `emerald-900` | `#083E2F` | Footer, overlay dialog (`rgba(8,62,47,.55)`) |
| `emerald-800` | `#0B5540` | Hover/active tombol primer, teks badge |
| `emerald-700` | `#0F6B4F` | Tombol primer, tautan, focus ring |
| `emerald-100` | `#DCEDE5` | Latar badge "Unggulan", state positif |
| `spice-700` | `#8A3A14` | Teks di atas latar rempah lembut |
| `spice-600` | `#A64B1E` | Aksen kategori, garis bawah hero, ikon dekoratif |
| `spice-100` | `#FBE8DA` | Latar label kategori / aksen lembut |
| `danger-700` | `#A22C1F` | Teks galat, tombol hapus |
| `danger-50` | `#FBE3DF` | Latar galat, badge "Habis" |
| `danger-900` | `#7F2B12` | Teks badge "Habis" |

**Larangan:** jangan memakai hijau WhatsApp `#25D366` sebagai latar tombol berteks putih (rasio 1,98:1). Tombol WhatsApp memakai `emerald-700` dengan ikon WhatsApp putih.

### 2.2 Kontras (terverifikasi terhadap WCAG 2.1 AA)

| Pasangan | Rasio | Dipakai untuk | Status |
|---|---|---|---|
| `ink-900` / `cream-50` | 14,89:1 | Teks utama di halaman | AAA |
| `ink-900` / `white` | 15,91:1 | Teks di kartu/dialog | AAA |
| `ink-600` / `cream-50` | 6,13:1 | Teks sekunder | AA (normal) |
| `ink-600` / `white` | 6,55:1 | Helper, label stok | AA |
| `white` / `emerald-700` | 6,49:1 | Tombol primer, chip aktif | AA |
| `white` / `emerald-800` | 8,80:1 | Hover tombol primer | AAA |
| `emerald-700` / `cream-50` | 6,07:1 | Tautan teks, focus ring (non-teks ≥3:1) | AA |
| `emerald-800` / `emerald-100` | 7,24:1 | Badge "Unggulan" | AAA |
| `spice-600` / `cream-50` | 5,39:1 | Label kategori, aksen teks | AA |
| `spice-700` / `spice-100` | 6,55:1 | Chip kategori lembut | AA |
| `danger-700` / `white` | 7,20:1 | Pesan galat, tombol hapus | AAA |
| `danger-700` / `danger-50` | 5,88:1 | Teks galat di banner | AA |
| `danger-900` / `danger-50` | 7,60:1 | Badge "Habis" | AAA |
| `input-border` / `white` | 4,32:1 | Batas input (non-teks ≥3:1) | Lolos |
| `border` / `cream-50` | 1,31:1 | Garis dekoratif saja, **bukan** batas kontrol | Pengecualian dekoratif |

Aturan tambahan:

- Semua teks memakai target ≥ 4,5:1, meski teks besar boleh 3:1.
- Status tidak boleh dibedakan hanya lewat warna: "Habis" selalu disertai teks + ikon; galat selalu disertai ikon + kalimat.
- `border` tidak boleh menjadi satu-satunya penanda input; input memakai `input-border`.

### 2.3 Tipografi

**Font stack (tanpa permintaan jaringan):**
`ui-sans-serif, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
**Angka:** `font-variant-numeric: tabular-nums` untuk harga, qty, dan ringkasan.
**Struk:** `ui-monospace, "Cascadia Mono", Consolas, monospace` khusus isi struk.

| Peran | Mobile | Desktop | Berat | Line-height | Catatan |
|---|---|---|---|---|---|
| Display / hero | 28 px | 40 px | 700 | 1,15 | Letter-spacing −0,02em |
| H2 (judul section) | 22 px | 28 px | 700 | 1,25 | — |
| H3 (judul kartu/dialog) | 18 px | 20 px | 600 | 1,35 | Maks. 2 baris di kartu |
| Body besar | 16 px | 18 px | 400 | 1,55 | Subjudul hero |
| Body | 16 px | 16 px | 400 | 1,6 | Teks umum |
| Small | 14 px | 14 px | 400/600 | 1,5 | Label stok, helper |
| Micro | 12 px | 12 px | 600 | 1,4 | Kategori, badge, caption |
| Harga kartu | 18 px | 20 px | 700 | 1,3 | Tabular nums |
| Total keranjang | 20 px | 24 px | 700 | 1,25 | Tabular nums |

Aturan: maksimal 3 tingkat ukuran dalam satu kartu; jangan memakai huruf kapital semua untuk kalimat panjang; panjang baris teks 45–75 karakter.

### 2.4 Spasi, Radius, Bayangan, Gerak

| Token | Nilai | Pemakaian |
|---|---|---|
| `space-1…4` | 4 / 8 / 12 / 16 px | Dalam komponen |
| `space-5…8` | 20 / 24 / 32 / 40 px | Antar blok |
| `space-9…10` | 48 / 64 px | Antar section |
| `radius-sm` | 8 px | Input, chip kecil |
| `radius-md` | 12 px | Tombol, baris keranjang |
| `radius-lg` | 16 px | Kartu, dialog |
| `radius-xl` | 24 px | Hero, panel besar |
| `radius-full` | 999 px | Chip filter, badge |
| `shadow-sm` | `0 1px 2px rgba(23,37,30,.06)` | Kartu diam |
| `shadow-md` | `0 8px 24px rgba(23,37,30,.10)` | Kartu hover, aside sticky, bottom sheet |
| `motion` | 150 ms `ease-out` | Hover, buka/tutup sheet |

Dilarang: bayangan berlapis lebih dari 2, gradient teks, glassmorphism, animasi otomatis (marquee/carousel).

### 2.5 Breakpoint & Grid

| Rentang | Nama | Grid katalog | Keranjang | Container |
|---|---|---|---|---|
| 320–479 px | base | 2 kolom, gap 12, padding kartu 10 | Bottom bar + bottom sheet | padding 16 |
| 480–767 px | sm | 2 kolom, gap 16 | Bottom bar + bottom sheet | padding 20 |
| 768–1023 px | md | 3 kolom, gap 20 | Bottom bar + bottom sheet | padding 24 |
| 1024–1279 px | lg | 3 kolom + aside 320 | Aside sticky | 960 |
| ≥1280 px | xl | 3 kolom + aside 360 | Aside sticky | 1200 |

Dashboard: ringkasan 2×2 di bawah 768 px, 4 sejajar di atasnya; tabel berubah menjadi daftar kartu di bawah 768 px. Lebar baca form maksimal 560 px.

### 2.6 Ikon & Ilustrasi

- Ikon garis 1,75 px, ukuran 20/24 px, warna mengikuti teks (`currentColor`).
- Ikon fungsional selalu punya label teks atau `aria-label`; ikon dekoratif `aria-hidden`.
- Foto produk: SVG/PNG lokal di `public/img/produk/`, rasio 4:3, latar `cream-200`, gaya flat 2 warna (emerald + rempah), tanpa wajah/orang, ukuran < 20 KB per file.
- Placeholder: inisial nama produk di atas `cream-200` dengan teks `emerald-800`, dipakai bila `imageUrl` kosong/gagal.
- Ilustrasi hero: cangkir + daun rempah, satu warna dominan, `aria-hidden="true"`, maksimal 240 px.

---

## 3. Aksesibilitas

| Area | Aturan |
|---|---|
| Struktur | Skip link "Lewati ke katalog"; satu `<h1>` per halaman; urutan heading tanpa lompatan; landmark `header/nav/main/footer`. |
| Fokus | Selalu terlihat: ring 3 px `emerald-700` + offset 2 px `cream-50`; tidak pernah `outline: none` tanpa pengganti. |
| Target sentuh | Minimal 44 × 44 px, termasuk tombol stepper `−/+` dan ikon hapus. |
| Keyboard | Semua fungsi dapat dioperasikan Tab/Shift+Tab/Enter/Space/Esc; dialog menahan fokus dan mengembalikannya ke pemicu. |
| Pengumuman | Jumlah hasil pencarian dan total keranjang diumumkan lewat `aria-live="polite"`; galat form dirangkum di atas form dan fokus pindah ke field pertama yang salah. |
| Gambar | `alt` = nama produk; placeholder memakai `alt=""` bila nama sudah tertulis di kartu. |
| Warna | Tidak ada informasi yang hanya disampaikan lewat warna; badge memakai teks. |
| Zoom | Pada zoom 200% dan lebar 320 px, tidak ada konten terpotong atau scroll horizontal. |
| Gerak | Hormati `prefers-reduced-motion`; transisi menjadi 0 ms. |
| Bahasa | `lang="id"`; label dan pesan galat berbahasa Indonesia. |

---

## 4. Struktur Halaman & Navigasi

Dua tampilan dalam satu aplikasi, tanpa login:

1. **Katalog** (`/`) — navbar, hero, filter bar, grid produk, keranjang (aside/sheet), footer.
2. **Dashboard** (tab atau `/dashboard`) — navbar sama, header aksi, 4 kartu ringkasan, tabel/daftar produk, form drawer, dialog konfirmasi.

**Navbar**

- Tinggi 56 px (mobile) / 64 px (desktop), sticky di atas, latar `cream-50`, garis bawah `border`.
- Kiri: logo "♨ KasirLokal" (teks `ink-900`, ikon `emerald-700`).
- Tengah (≥768 px): tautan "Katalog" dan "Dashboard"; aktif ditandai teks `emerald-800` + garis bawah 3 px `emerald-700`.
- Kanan: tombol keranjang dengan badge jumlah (ikon saja di mobile, `aria-label` "Keranjang, 2 item"); di mobile ditambah ikon Dashboard 44 px dengan `aria-label`.
- Tidak ada tombol login/profil. Tidak ada hamburger (hanya 2 tujuan).
- Navbar tidak boleh menutupi anchor `#katalog`; gunakan `scroll-margin-top` 140 px.

**Footer**

- Latar `emerald-900`, teks `cream-50`; isi "KasirLokal · RasaNusa", "Data contoh, tanpa backend", tahun.
- Tinggi ≤ 120 px di mobile, tanpa tautan palsu.

---

## 5. Komponen

### 5.1 Hero

- Latar `cream-100`, radius 24, padding 24 (mobile) / 40 (desktop), margin bawah 24.
- Kiri: H1 "Kopi & camilan rumahan, siap dipesan hari ini." + subjudul "Pilih menu favorit, cek stok, lalu kirim struk lewat WhatsApp."
- CTA: "Lihat menu" (primer, anchor ke `#katalog`) dan "Kelola produk" (sekunder outline, ke Dashboard).
- Kanan (≥768 px): ilustrasi 200–240 px; di mobile disembunyikan.
- Tidak ada klaim diskon, rating, atau jumlah pelanggan.

### 5.2 Filter Bar

- Desktop satu baris: input pencarian (flex 1), chip kategori, select sorting. Mobile tiga baris: input, chip scroll horizontal, lalu "N produk" + sorting.
- Input: tinggi 44 px, ikon kaca pembesar kiri, placeholder "Cari nama atau deskripsi…", tombol ✕ saat terisi (hit area 44 px, `aria-label="Hapus kata kunci"`).
- Chip: "Semua", "Makanan", "Minuman", "Camilan"; tinggi visual 36 px, hit area 44 px; aktif = latar `emerald-700`, teks putih, `aria-pressed="true"`.
- Sorting: select dengan label terlihat "Urutkan", opsi: Unggulan dulu, Nama A–Z, Harga terendah, Harga tertinggi.
- Baris hasil "8 produk" (`small`, `ink-600`), diumumkan `aria-live="polite"`.
- ≥1024 px: filter bar sticky di bawah navbar (top 64 px), latar `cream-50` solid, garis bawah.

### 5.3 Kartu Produk

Anatomi: gambar 4:3 → badge → kategori → nama (maks. 2 baris) → harga → baris stok + tombol.

- Wadah putih, radius 16, border 1 px `border`, padding 10/16; hover `shadow-md` + naik 2 px (kecuali reduced motion).
- Badge kiri-atas di atas gambar: "Unggulan" (`emerald-100` / `emerald-800`, radius full, 12 px).
- Badge kanan-atas hanya bila stok 0: "Habis" (`danger-50` / `danger-900`). Tidak ada badge stok menipis (di luar MVP).
- Kategori 12 px `spice-600`, bukan kapital semua.
- Nama 16 px/600 `ink-900`, elipsis 2 baris.
- Harga 18–20 px/700 `ink-900`, tabular.
- Stok: "Stok: 24" 13–14 px `ink-600` + titik status 8 px `emerald-700`; stok 0 → "Stok habis" `danger-700` + ikon.
- Tombol lebar penuh 44 px, label "Pesan" (sekunder: putih, border `emerald-700`, teks `emerald-700`); stok 0 → "Habis" nonaktif (`aria-disabled="true"`, latar `cream-100`, teks `ink-600`).
- Ring fokus hanya pada elemen interaktif, bukan seluruh kartu.
- Gambar/nama tidak dapat diklik (tidak ada halaman detail di MVP) — jangan membuat affordance palsu.

### 5.4 Keranjang — Desktop (Aside Sticky)

- Lebar 320/360, sticky top 88 px, radius 16, border `border`, `shadow-sm`; tinggi maksimal `calc(100vh − 112px)`, area item dapat digulir, footer total menetap.
- Header "Keranjang" + jumlah item (`small`, `ink-600`); tanpa hapus massal, "Kosongkan" berupa tautan teks di footer.
- Baris item: nama, harga satuan, stepper `− qty +`, subtotal, tombol hapus (`aria-label="Hapus <nama> dari keranjang"`).
- Stepper: tombol 36 px visual dengan hit area 44 px; `+` nonaktif saat qty = stok; `−` pada qty 1 menghapus item + toast "Item dihapus dari keranjang."
- Footer: "Total" + nilai 24 px/700; tombol "Buat struk" primer penuh (nonaktif bila kosong); disclaimer "Keranjang tidak tersimpan saat halaman dimuat ulang."
- Kosong: ilustrasi garis, "Keranjang masih kosong", "Pilih produk untuk mulai pesanan." tanpa tombol.

### 5.5 Keranjang — Mobile (Bottom Bar + Sheet)

- Bottom bar sticky 64 px + safe-area, hanya saat ada item: "2 item · Rp54.000" kiri, "Lihat keranjang" kanan; putih, garis atas `border`, `shadow-md`.
- Konten halaman `padding-bottom` ≥ 96 px agar kartu terakhir tidak tertutup.
- Tap membuka bottom sheet: radius atas 16, maksimal 90vh, grabber dekoratif, judul + tombol tutup 44 px.
- Isi sama dengan aside; "Buat struk" menetap di bawah sheet.
- Tutup lewat Esc, ✕, atau overlay; fokus kembali ke pemicu.

### 5.6 Pratinjau Struk & Tombol WhatsApp

- Dialog tengah (≥768 px, lebar 480) atau sheet penuh (mobile), radius 16, overlay `rgba(8,62,47,.55)`.
- Judul "Pratinjau struk" + tutup; isi struk `cream-100`, garis putus-putus, monospace 13/20.
- Format struk: baris toko "KasirLokal · RasaNusa"; tanggal & jam lokal; garis; item (nama, `3 × Rp18.000`, subtotal rata kanan); Total; "Terima kasih sudah memesan!".
- Tombol "Kirim via WhatsApp" (primer `emerald-700`, ikon WhatsApp putih, penuh) dan "Salin teks" (sekunder). Desktop sejajar; mobile bertumpuk, aksi utama di atas.
- Catatan kecil: "WhatsApp terbuka di tab baru. Nomor tujuan dipilih di aplikasi WhatsApp."
- Popup diblokir: inline alert "Tab WhatsApp tidak terbuka. Gunakan 'Salin teks' lalu tempel di WhatsApp." — bukan alert browser.
- Setelah struk dibuat: tutup dialog, kosongkan keranjang, toast "Struk dibuat. Stok diperbarui.", badge keranjang hilang.

### 5.7 Dashboard

**Header aksi**

- H1 "Dashboard katalog" + subteks "Kelola 8 produk contoh. Perubahan langsung tersimpan di perangkat ini."
- Kanan: "Reset data contoh" (ghost `danger-700` + konfirmasi) dan "Tambah produk" (primer, ikon +).

**Kartu ringkasan**

- Total produk · Total stok · Produk habis · Nilai stok; angka 28 px/700 tabular; label 13 px `ink-600`.
- "Produk habis" > 0 memakai aksen `danger-700`; 0 memakai `ink-900`.

**Tabel (≥768 px)**

- Kolom: Produk (thumbnail 40 px + nama), Kategori (chip `spice-100`), Harga, Stok (angka + badge "Habis" bila 0), Unggulan (ya/tidak), Aksi (Edit, Hapus).
- Header sticky; hover baris `cream-100`; garis bawah `border`; aksi teks dengan hit area 44 px; "Hapus" `danger-700`.
- Baris stok 0 tidak diredupkan seluruhnya agar tetap terbaca.

**Daftar (<768 px)**

- Kartu produk: thumbnail 56 px, nama, kategori · harga, stok, tombol Edit/Hapus. Ringkasan tetap 2×2 di atas.

**Form tambah/edit**

- Desktop drawer kanan 480 px; mobile sheet penuh dengan header "Tambah produk"/"Edit produk" + tutup.
- Urutan: Nama → Kategori → Harga → Stok → Deskripsi → Gambar → Unggulan → footer Batal/Simpan.
- Label terlihat di atas field (14 px/600); wajib ditandai teks "Wajib", bukan hanya bintang.
- Harga: awalan "Rp" statis, helper "Tanpa titik atau desimal." Stok: helper "0–9999". Deskripsi: 3 baris + penghitung `0/160`. Gambar: input path + thumbnail 64 px + helper "Kosongkan untuk memakai placeholder." Unggulan: switch "Tampilkan sebagai unggulan".
- Galat: teks 13 px `danger-700` + ikon di bawah field, `aria-describedby`, border `danger-700`, ringkasan galat di atas form.
- "Simpan" tetap dapat ditekan untuk memicu validasi, tetapi penyimpanan tidak terjadi selama ada galat (FR-18). Setelah percobaan pertama, galat diperbarui saat mengetik.
- Footer aksi menetap agar tidak perlu menggulir.

**Dialog konfirmasi**

- "Hapus produk?" / "Reset ke data contoh?"; isi menyebut nama produk dan dampak ("Produk ini ada di keranjang dan akan dikeluarkan.").
- Tombol "Batal" (sekunder) + "Hapus"/"Reset" (`danger-700`); fokus awal pada "Batal".

### 5.8 Toast, Banner, Empty State

| Komponen | Aturan |
|---|---|
| Toast | Bottom-center (mobile 80 px di atas bottom bar; desktop bottom 24), latar `ink-900`, teks `cream-50`, ikon status, 4 detik, `aria-live="polite"`, maksimal 1. |
| Banner penyimpanan | Di bawah navbar, latar `danger-50`, teks `danger-900`, ikon, tombol tutup 44 px; menetap sampai ditutup; muncul saat data rusak/kuota penuh. |
| Katalog kosong | Ilustrasi kaca pembesar, "Produk tidak ditemukan", `"geprek" tidak cocok dengan produk mana pun.`, tombol "Reset pencarian". |
| Keranjang kosong | "Keranjang masih kosong" + "Pilih produk untuk mulai pesanan." |
| Dashboard kosong | "Belum ada produk" + "Tambah produk" (hanya bila semua produk terhapus). |

### 5.9 State Matrix

| Komponen | Default | Hover | Fokus | Aktif | Nonaktif | Galat |
|---|---|---|---|---|---|---|
| Tombol primer | `emerald-700` | `emerald-800` | ring 3 px | `emerald-800` | `cream-100` + `ink-600` | — |
| Tombol sekunder | putih + border `emerald-700` | `emerald-100` | ring | `emerald-100` | border `border` + `ink-600` | — |
| Tombol hapus | teks `danger-700` | `danger-50` | ring `danger-700` | `danger-50` | `ink-600` | — |
| Input | border `input-border` | border `ink-600` | ring `emerald-700` | — | `cream-100` | border & teks `danger-700` |
| Chip filter | putih + border `border` | `cream-100` | ring | aktif `emerald-700` | — | — |
| Kartu produk | `shadow-sm` | `shadow-md`, naik 2 px | — | — | — | — |

---

## 6. Wireframe Teks

Keterangan: `[ ]` = tombol/kontrol, `( )` = teks, `▾` = select, `●` = badge, `▁` = pembatas, `…` = konten berulang, `[n]` = nomor anotasi di bawah gambar.

### 6.1 Desktop — Katalog (≥1280 px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ♨ KasirLokal         Katalog    Dashboard                              🛒 (2) │ [1]
├──────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │  (Kopi & camilan rumahan,                        ╭────────────────────╮  │ │
│ │   siap dipesan hari ini.)                        │   ilustrasi SVG    │  │ │ [2]
│ │  (Pilih menu favorit, cek stok, lalu kirim       │   cangkir + rempah │  │ │
│ │   struk lewat WhatsApp.)                         ╰────────────────────╯  │ │
│ │  [ Lihat menu ]   [ Kelola produk ]                                      │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  (Katalog)                                      (8 produk · stok terbaru)  │ [3]
│  ┌───────────────────────────────────┐  ┌──────────────────────────────────┐ │
│  │ 🔍 (Cari nama atau deskripsi…)  ✕ │  │(Semua)(Makanan)(Minuman)(Camilan)│ │ [4]
│  └───────────────────────────────────┘  └──────────────────────────────────┘ │
│                                              (Urutkan) [Unggulan dulu    ▾]  │ [5]
│                                                                              │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐   ┌────────────────┐  │
│  │ [gambar 4:3]  │ │ [gambar 4:3]  │ │ [gambar 4:3]  │   │ (Keranjang) (2)│  │
│  │ ● Unggulan    │ │               │ │ ● Unggulan    │   │ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁ │  │
│  │ (Minuman)     │ │ (Minuman)     │ │ (Makanan)     │   │ Kopi Susu      │  │
│  │ Kopi Susu     │ │ Es Teh Manis  │ │ Nasi Goreng   │   │ Gula Aren      │  │ [6]
│  │ Gula Aren     │ │               │ │ Kampung       │   │ Rp18.000       │  │
│  │ Rp18.000      │ │ Rp5.000       │ │ Rp20.000      │   │ [−]  3  [+]    │  │
│  │ Stok: 24      │ │ Stok: 40      │ │ Stok: 15      │   │ Rp54.000       │  │
│  │ [   Pesan   ] │ │ [   Pesan   ] │ │ [   Pesan   ] │   │ (Hapus)        │  │
│  └───────────────┘ └───────────────┘ └───────────────┘   │ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁ │  │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐   │ Total  Rp54.000│  │
│  │ (Makanan)     │ │ (Makanan)     │ │ (Camilan)     │   │ [  Buat struk ]│  │
│  │ Ayam Geprek   │ │ Mie Goreng    │ │ ● Habis       │   │ (Kosongkan)    │  │
│  │ Sambal Bawang │ │ Jawa          │ │ Pisang Goreng │   │                │  │
│  │ Rp22.000      │ │ Rp18.000      │ │ Rp12.000      │   │ (sticky di     │  │
│  │ Stok: 12      │ │ Stok: 10      │ │ [   Habis   ] │   │  samping grid) │  │
│  │ [   Pesan   ] │ │ [   Pesan   ] │ │               │   │                │  │
│  └───────────────┘ └───────────────┘ └───────────────┘   └────────────────┘  │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ (KasirLokal · RasaNusa)   (Data contoh, tanpa backend)          (2026)        │ [7]
└──────────────────────────────────────────────────────────────────────────────┘
```

**Anotasi**

1. Navbar sticky 64 px; tautan aktif "Katalog" bergaris bawah emerald; badge keranjang memperbarui total item.
2. Hero `cream-100`, radius 24, H1 + 2 CTA; ilustrasi dekoratif.
3. Judul section + penghitung hasil (`aria-live`).
4. Pencarian 44 px dengan tombol hapus; chip kategori satu baris, tidak wrap di desktop.
5. Sorting memakai label terlihat; default "Unggulan dulu".
6. Aside keranjang sticky 360 px; item dapat digulir, total menetap; tombol nonaktif saat kosong.
7. Footer ringkas `emerald-900`.

### 6.2 Desktop — Dashboard (≥1280 px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ♨ KasirLokal         Katalog    Dashboard                    🛒 (2)          │
├──────────────────────────────────────────────────────────────────────────────┤
│ (Dashboard katalog)                       [ Reset data contoh ] [+ Tambah]   │ [1]
│ (Kelola 8 produk contoh. Perubahan langsung tersimpan di perangkat ini.)     │
│                                                                              │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐  │
│ │ 8            │ │ 169          │ │ 1            │ │ Rp1.756.000          │  │ [2]
│ │ Total produk │ │ Total stok   │ │ Produk habis │ │ Nilai stok           │  │
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────────────┘  │
│                                                                              │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ Produk            Kategori   Harga      Stok      Unggulan    Aksi       │ │ [3]
│ │ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ │ │
│ │ [img] Kopi Susu…  (Minuman)  Rp18.000   24         ● ya       Edit Hapus │ │
│ │ [img] Es Teh…     (Minuman)  Rp5.000    40         —          Edit Hapus │ │
│ │ [img] Nasi Goreng… (Makanan) Rp20.000   15         ● ya       Edit Hapus │ │
│ │ [img] Pisang…     (Camilan)  Rp12.000   ● Habis    —          Edit Hapus │ │
│ │ …                                                                        │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ╭────────────────── Drawer (terbuka saat Tambah/Edit) ──────────────────╮  │
│  │ (Tambah produk)                                             ✕         │  │ [4]
│  │ (Nama) Wajib        [………………………………………]                              │  │
│  │ (Kategori) Wajib    [Makanan ▾]                                        │  │
│  │ (Harga) Wajib       [Rp 18000]   (Tanpa titik atau desimal.)           │  │
│  │ (Stok) Wajib        [24]         (0–9999)                              │  │
│  │ (Deskripsi)         [………………………………………]  (0/160)                     │  │
│  │ (Gambar)            [/img/produk/…]   [thumb]                          │  │
│  │ (Unggulan)          [ ●———]  (Tampilkan sebagai unggulan)              │  │
│  │ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁             │  │
│  │                              [ Batal ]   [ Simpan produk ]            │  │
│  ╰───────────────────────────────────────────────────────────────────────╯  │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Anotasi**

1. Aksi halaman: reset (ghost bahaya) dan tambah (primer); urutan tetap agar "Tambah" paling mudah dijangkau.
2. Empat metrik dari FR-16; angka tabular; "Produk habis" diberi aksen bahaya bila > 0.
3. Header tabel sticky; aksi teks dengan hit area 44 px; badge "Habis" di kolom stok.
4. Drawer kanan 480 px dengan footer aksi menetap; label terlihat, bukan placeholder-only.

### 6.3 Mobile — Katalog (360–430 px)

```
┌──────────────────────────────────────────┐
│ ♨ KasirLokal          [▦]        🛒 (2)  │ [1] 56 px
├──────────────────────────────────────────┤
│ ╭──────────────────────────────────────╮ │
│ │ (Kopi & camilan rumahan,             │ │
│ │  siap dipesan hari ini.)             │ │ [2]
│ │ [ Lihat menu ]  [ Kelola produk ]    │ │
│ ╰──────────────────────────────────────╯ │
│ 🔍 (Cari nama atau deskripsi…)        ✕  │ [3]
│ (Semua)(Makanan)(Minuman)(Camilan)   →   │ [4]
│ (8 produk)              (Unggulan ▾)     │ [5]
│ ┌─────────────────┐ ┌─────────────────┐  │
│ │ [gambar 4:3]    │ │ [gambar 4:3]    │  │
│ │ ● Unggulan      │ │                 │  │
│ │ (Minuman)       │ │ (Minuman)       │  │
│ │ Kopi Susu Gula  │ │ Es Teh Manis    │  │ [6]
│ │ Aren            │ │                 │  │
│ │ Rp18.000        │ │ Rp5.000         │  │
│ │ Stok: 24        │ │ Stok: 40        │  │
│ │ [    Pesan    ] │ │ [    Pesan    ] │  │
│ └─────────────────┘ └─────────────────┘  │
│ ┌─────────────────┐ ┌─────────────────┐  │
│ │ ● Habis         │ │ …               │  │
│ │ (Camilan)       │ │                 │  │
│ │ Pisang Goreng   │ │                 │  │
│ │ Rp12.000        │ │                 │  │
│ │ Stok habis      │ │                 │  │
│ │ [   Habis     ] │ │                 │  │
│ └─────────────────┘ └─────────────────┘  │
│                    …                     │
├──────────────────────────────────────────┤
│ 2 item · Rp54.000      [ Lihat keranjang]│ [7] sticky 64
└──────────────────────────────────────────┘
```

**Anotasi**

1. Navbar 56 px: logo, ikon Dashboard (44 px, `aria-label`), ikon keranjang + badge. Tanpa hamburger.
2. Hero ringkas; ilustrasi disembunyikan; padding 20; CTA boleh bertumpuk bila < 360 px.
3. Pencarian selebar kontainer, tinggi 44.
4. Chip digulir horizontal dengan indikasi tepi memudar; tidak wrap agar tinggi halaman stabil.
5. Baris hasil + sorting; label "Urutkan" tetap terlihat meski select menyempit.
6. Grid 2 kolom; nama maksimal 2 baris; tombol selalu di bawah, tinggi 44.
7. Bottom bar hanya saat ada item; konten diberi jarak bawah 96 px.

### 6.4 Mobile — Keranjang (Bottom Sheet)

```
┌──────────────────────────────────────────┐
│ (halaman katalog meredup, tidak aktif)   │
│ ╭──────────────────────────────────────╮ │
│ │              ▁▁▁▁                    │ │ [1]
│ │ (Keranjang)  (2 item)             ✕  │ │
│ │ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ │ │
│ │ Kopi Susu Gula Aren              🗑   │ │
│ │ Rp18.000          [−]  3  [+]        │ │ [2]
│ │ Subtotal                  Rp54.000   │ │
│ │ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ │ │
│ │ Total                     Rp54.000   │ │
│ │ [           Buat struk            ] │ │ [3]
│ │ (Keranjang tidak tersimpan saat      │ │
│ │  halaman dimuat ulang.)              │ │
│ ╰──────────────────────────────────────╯ │
└──────────────────────────────────────────┘
```

**Anotasi**

1. Sheet maksimal 90vh, radius atas 16, grabber dekoratif; fokus masuk ke tombol tutup.
2. Stepper hit area 44 px; `+` nonaktif saat qty = stok; `−` pada qty 1 menghapus item + toast.
3. Aksi utama menetap di bawah sheet; disclaimer 12 px `ink-600`.

### 6.5 Mobile — Pratinjau Struk

```
┌──────────────────────────────────────────┐
│ ╭──────────────────────────────────────╮ │
│ │ (Pratinjau struk)                 ✕  │ │
│ │ ┌──────────────────────────────────┐ │ │
│ │ │ KasirLokal · RasaNusa            │ │ │
│ │ │ 19/11/2026 08.42                 │ │ │
│ │ │ ──────────────────────────────── │ │ │
│ │ │ Kopi Susu Gula Aren              │ │ │
│ │ │   3 × Rp18.000        Rp54.000   │ │ │ [1]
│ │ │ ──────────────────────────────── │ │ │
│ │ │ Total                 Rp54.000   │ │ │
│ │ │ Terima kasih sudah memesan!      │ │ │
│ │ └──────────────────────────────────┘ │ │
│ │ [      Kirim via WhatsApp        ]   │ │ [2]
│ │ [           Salin teks           ]   │ │
│ │ (WhatsApp terbuka di tab baru.       │ │
│ │  Nomor tujuan dipilih di WhatsApp.)  │ │
│ ╰──────────────────────────────────────╯ │
└──────────────────────────────────────────┘
```

**Anotasi**

1. Area struk `cream-100`, garis putus-putus, monospace 13/20; teks dapat diseleksi.
2. Tombol utama `emerald-700` + ikon WhatsApp putih; jangan memakai `#25D366` sebagai latar. Tombol kedua adalah cadangan saat popup diblokir.

### 6.6 Mobile — Dashboard

```
┌──────────────────────────────────────────┐
│ ♨ KasirLokal          [▦]        🛒 (2)  │
├──────────────────────────────────────────┤
│ (Dashboard katalog)              ✕       │
│ [ + Tambah produk ]   [ Reset data ]     │ [1]
│ ┌──────────────┐ ┌──────────────┐        │
│ │ 8            │ │ 169          │        │
│ │ Total produk │ │ Total stok   │        │ [2]
│ └──────────────┘ └──────────────┘        │
│ ┌──────────────┐ ┌──────────────┐        │
│ │ 1            │ │ Rp1.756.000  │        │
│ │ Produk habis │ │ Nilai stok   │        │
│ └──────────────┘ └──────────────┘        │
│ ┌──────────────────────────────────────┐ │
│ │ [img] Kopi Susu Gula Aren            │ │
│ │ (Minuman) · Rp18.000 · Stok: 24      │ │ [3]
│ │ ● Unggulan          Edit    Hapus    │ │
│ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ │
│ │ [img] Pisang Goreng Keju             │ │
│ │ (Camilan) · Rp12.000 · ● Habis       │ │
│ │                     Edit    Hapus    │ │
│ └──────────────────────────────────────┘ │
│                    …                     │
├──────────────────────────────────────────┤
│ 2 item · Rp54.000      [ Lihat keranjang]│
└──────────────────────────────────────────┘
```

**Anotasi**

1. Aksi utama di atas (mudah dijangkau); "Reset data" ghost bahaya dengan konfirmasi.
2. Ringkasan 2×2; angka 24–28 px agar tetap terbaca tanpa scroll horizontal.
3. Tabel berubah menjadi kartu; label kolom menjadi teks inline; hit area Edit/Hapus 44 px.

**Form mobile (menggantikan drawer):** sheet penuh dari bawah, header lengket "Tambah produk", field satu kolom jarak 20 px, footer "Batal / Simpan" menetap, field aktif tidak tertutup keyboard (`scroll-padding-bottom`).

---

## 7. Perilaku Responsif Ringkas

| Elemen | <768 px | ≥768 px | ≥1024 px |
|---|---|---|---|
| Navigasi | Logo + ikon Dashboard + keranjang | Logo + tautan teks + keranjang | Sama |
| Hero | Padding 20, tanpa ilustrasi | Padding 32, ilustrasi 200 px | Padding 40, ilustrasi 240 px |
| Filter | 3 baris, chip scroll | 2 baris (cari + chip; sort di kanan) | 1 baris |
| Grid | 2 kolom | 3 kolom | 3 kolom + aside |
| Keranjang | Bottom bar + sheet | Bottom bar + sheet | Aside sticky |
| Dashboard | Ringkasan 2×2, daftar kartu | Ringkasan 4, tabel | Sama + drawer |
| Dialog | Sheet penuh | Dialog 480–560 px | Sama |

---

## 8. Mikrokopi (wajib dipakai)

| Konteks | Teks |
|---|---|
| Tombol tambah item | Pesan |
| Stok > 0 | Stok: 24 |
| Stok 0 (badge & tombol) | Habis / Stok habis |
| Keranjang kosong | Keranjang masih kosong |
| Subteks keranjang kosong | Pilih produk untuk mulai pesanan. |
| Tombol struk | Buat struk |
| Dialog struk | Pratinjau struk |
| Aksi WhatsApp | Kirim via WhatsApp |
| Cadangan | Salin teks |
| Peringatan popup | Tab WhatsApp tidak terbuka. Gunakan "Salin teks" lalu tempel di WhatsApp. |
| Disclaimer keranjang | Keranjang tidak tersimpan saat halaman dimuat ulang. |
| Tanpa hasil | Produk tidak ditemukan |
| Subteks tanpa hasil | "{kata kunci}" tidak cocok dengan produk mana pun. |
| Reset filter | Reset pencarian |
| Ringkasan hasil | 8 produk |
| Dashboard judul | Dashboard katalog |
| Dashboard subteks | Kelola 8 produk contoh. Perubahan langsung tersimpan di perangkat ini. |
| Tambah | Tambah produk |
| Reset | Reset data contoh |
| Konfirmasi hapus | Hapus produk? |
| Dampak hapus | Produk ini akan dihapus dari katalog. Bila ada di keranjang, item ikut dikeluarkan. |
| Konfirmasi reset | Reset ke data contoh? |
| Dampak reset | Semua perubahan akan diganti dengan 8 produk awal. Tindakan ini tidak dapat dibatalkan. |
| Galat nama | Nama produk wajib diisi (1–60 karakter). |
| Galat duplikat | Nama produk sudah dipakai. |
| Galat harga | Harga harus angka bulat 0–10.000.000. |
| Galat stok | Stok harus angka bulat 0–9999. |
| Galat deskripsi | Deskripsi maksimal 160 karakter. |
| Galat gambar | Gunakan path lokal yang diawali /img/produk/. |
| Toast struk | Struk dibuat. Stok diperbarui. |
| Toast item dihapus | Item dihapus dari keranjang. |
| Banner data rusak | Data tersimpan tidak dapat dibaca. Data contoh dimuat; perubahan terakhir tidak tersimpan. |
| Banner kuota | Penyimpanan perangkat penuh. Perubahan terakhir dibatalkan. |

---

## 9. Design QA Checklist (manual)

Diperiksa setelah iterasi I6, bersamaan dengan AC di `SPEC.md`.

| # | Pemeriksaan | Cara memeriksa | Rujukan |
|---|---|---|---|
| 1 | Semua teks memenuhi kontras | Sampling 5 pasangan dengan color picker/DevTools terhadap tabel 2.2 | NFR-05 |
| 2 | Tidak ada scroll horizontal | Device mode 360 px, 768 px, 1280 px | AC-23 |
| 3 | Target sentuh ≥ 44 px | Ukur tombol Pesan, stepper, ikon hapus, tutup dialog | NFR-05 |
| 4 | Fokus terlihat di semua kontrol | Tab menyusuri halaman tanpa mouse | AC-24 |
| 5 | Dialog menahan fokus & Esc menutup | Buka keranjang/struk, tekan Tab berulang, lalu Esc | NFR-05 |
| 6 | Badge "Habis" tidak hanya warna | Cek teks + ikon terbaca tanpa warna | AC-02 |
| 7 | Bottom bar tidak menutup kartu terakhir | Scroll ke bawah pada 360 px | AC-23 |
| 8 | Struk terbaca & tidak terpotong | Buka pratinjau pada 360 px dan 1280 px | AC-12, AC-13 |
| 9 | Tombol WhatsApp bukan hijau `#25D366` | Periksa nilai warna latar tombol | 2.1 |
| 10 | Form: label terlihat, galat di bawah field, fokus pindah ke galat pertama | Submit form kosong | AC-17 |
| 11 | Ringkasan dashboard 2×2 tanpa terpotong | 360 px | AC-15 |
| 12 | Hover hanya memperkaya, bukan syarat | Operasikan seluruh alur dengan keyboard | NFR-05 |
| 13 | Zoom 200% tetap terbaca | Browser zoom 200% pada 1280 px | NFR-05 |
| 14 | `prefers-reduced-motion` mematikan transisi | Emulasi di DevTools | NFR-05 |
| 15 | Tidak ada permintaan aset eksternal | Panel Network saat muat ulang (selain `wa.me` setelah diklik) | AC-03, AC-25 |

---

## 10. Handoff per Iterasi

| Iterasi | Keluaran desain yang harus selesai |
|---|---|
| I0 | Token warna/tipe/spasi, 8 aset produk + placeholder (SVG lokal), struktur halaman kosong, navbar + footer |
| I1 | Tidak ada pekerjaan visual baru; pastikan banner penyimpanan dan toast tersedia |
| I2 | Hero, kartu produk (semua state), grid responsif |
| I3 | Filter bar, chip, sorting, kondisi kosong katalog |
| I4 | Aside keranjang desktop, bottom bar + sheet mobile, pratinjau struk, tombol WhatsApp |
| I5 | Dashboard: ringkasan, tabel/daftar, drawer form, dialog konfirmasi, toast reset |
| I6 | Audit aksesibilitas, perbaikan kontras, poles state nonaktif/galat, checklist bagian 9 |
| I7 | Tidak ada perubahan desain; hanya perbaikan temuan QA yang sudah dicatat |

**Aturan handoff:**

1. Implementasi mengikuti token bagian 2; nilai warna/ukuran baru harus ditambahkan ke dokumen ini lebih dulu.
2. Setiap komponen wajib punya state default, hover, fokus, nonaktif, dan galat bila relevan.
3. Jangan menambah komponen di luar daftar bagian 5 (mis. carousel, rating, modal promo) tanpa memperbarui `SPEC.md`.
4. Teks UI memakai mikrokopi bagian 8; sinonim diperbolehkan hanya bila maknanya sama dan tetap bahasa Indonesia.
5. Semua pemeriksaan visual dicatat lolos/gagal di README bersama status AC.
