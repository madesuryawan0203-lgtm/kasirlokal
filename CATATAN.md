# Catatan Workshop: Lab Vibe Coding UMKM

## 1. Tujuan Latihan
Membangun aplikasi web **KasirLokal** (aplikasi kasir/POS dan pembukuan sederhana untuk pelaku UMKM) menggunakan pendekatan *Vibe Coding* secara terstruktur melalui OpenCode, mulai dari penyusunan spesifikasi, pembuatan kode bertahap, pengujian di browser, hingga *deployment* ke Vercel.

## 2. Target Aplikasi
- **Nama Aplikasi:** KasirLokal
- **Target Pengguna:** Pelaku UMKM (warung makan, kedai kopi, toko kelontong) yang membutuhkan pencatatan transaksi harian tanpa kerumitan sistem akuntansi besar.
- **Fitur Inti (MVP):**
  1. Pencatatan transaksi kasir cepat (hitung total belanja dan kembalian otomatis).
  2. Manajemen daftar produk dan stok barang sederhana.
  3. Rekap laporan pemasukan harian untuk memisahkan uang usaha dan uang pribadi.
- **Batasan (Scope):** Fokus pada fungsionalitas utama yang ringan diakses lewat browser HP/laptop, tanpa integrasi pembayaran kompleks (seperti payment gateway otomatis) pada tahap awal.

## 3. Risiko Penggunaan AI yang Ingin Diperiksa
- **Hallucination & Perubahan Kode Tidak Terkontrol:** AI berisiko menulis logika perhitungan total/stok yang keliru atau mengubah file lain di luar instruksi jika *prompt* terlalu luas.
- **Mitigasi:** Membatasi setiap *prompt* hanya untuk satu fitur spesifik dan selalu memeriksa perubahan kode (`git diff`) sebelum menyetujui serta melakukan *commit*.