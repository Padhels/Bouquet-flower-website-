# Bloomie 🌸 — Toko Buket Bunga Online

Website e-commerce buket bunga (target market cewek-cewek) — HTML, CSS, dan JavaScript murni (tanpa framework/JSX), siap di-deploy ke GitHub Pages atau hosting statis apa pun.

## Fitur yang sudah jalan (demo, data disimpan di localStorage browser)

- **Home page** — hero, kategori, produk best-seller
- **Katalog produk** — search, filter kategori, custom bouquet builder
- **Detail produk** — pilih tambahan bunga, ukuran, kartu ucapan custom
- **Keranjang & checkout** — edit qty, ringkasan harga, ongkir
- **Pembayaran** — pilihan QRIS & Virtual Account (BRI/Mandiri/BNI) — **mock/tampilan saja**, lihat catatan di bawah
- **Login/Register** — akun tersimpan di localStorage
- **Riwayat pesanan** & **Profil** (termasuk alamat pengiriman)
- **Wishlist**, **Search**, tombol **Chat WhatsApp** ke 085601854064
- Custom bunga: rose, tulip, sunflower, lily, daisy, anyelir, gerbera, hydrangea, eucalyptus (ikon dibuat sendiri, bebas hak cipta)
- UI pink/cream/lilac, tombol membulat, animasi pixel-flower & bounce, responsive mobile & desktop

## ⚠️ Yang perlu kamu tahu sebelum go-live

1. **Pembayaran belum benar-benar tersambung ke bank/QRIS.** Untuk pembayaran QRIS & VA (BRI/Mandiri/BNI) yang sungguhan, kamu perlu daftar ke payment gateway seperti **Midtrans** atau **Xendit**, lalu ganti fungsi `generateVaNumber()` di `js/app.js` dan bagian QRIS di `checkout.html` dengan pemanggilan API mereka (butuh backend/server kecil untuk simpan API key dengan aman — jangan taruh API key di kode frontend).
2. **Semua data (akun, pesanan, wishlist, keranjang) tersimpan di localStorage browser pengguna**, bukan database sungguhan. Cocok untuk demo/MVP, tapi kalau mau data pesanan beneran tersimpan terpusat (misal biar kamu sebagai admin bisa lihat semua pesanan dari HP kamu), butuh backend + database (contoh: Supabase, Firebase, atau server Node.js sendiri).
3. **Foto bunga** memakai ilustrasi vektor buatan sendiri (di folder `assets/flowers/` dan `assets/bouquets/`), bukan foto asli. Silakan ganti dengan foto produk asli kamu — cukup ganti file gambar di folder tersebut atau ubah path `img` di `js/data.js`.
4. Nomor WhatsApp sudah diset ke **085601854064** (otomatis dikonversi ke format internasional `62856...`) — ganti di `WA_NUMBER` pada `js/app.js` kalau nomornya berubah.

## Struktur folder

```
bouquet-site/
├── index.html          → Home
├── catalog.html         → Katalog + custom bouquet builder
├── product.html          → Detail produk
├── cart.html              → Keranjang
├── checkout.html          → Checkout + pembayaran
├── order-success.html     → Konfirmasi pesanan
├── orders.html            → Riwayat pesanan
├── login.html / register.html
├── profile.html           → Profil & alamat
├── wishlist.html
├── css/style.css
├── js/data.js             → Data produk & bunga (edit di sini untuk ganti produk/harga)
├── js/app.js              → Logic cart, wishlist, auth, orders, payment mock
└── assets/                → Semua ikon & ilustrasi bunga (SVG)
```

## Cara Deploy ke GitHub Pages

1. Buat repo baru di GitHub (misal `bloomie-flower-shop`), **jangan** dicentang "Initialize with README".
2. Di folder project ini (sudah ada git init), jalankan:
   ```bash
   git remote add origin https://github.com/USERNAME/bloomie-flower-shop.git
   git branch -M main
   git push -u origin main
   ```
3. Di GitHub: buka repo → **Settings** → **Pages** → pada "Build and deployment", pilih **Deploy from a branch** → branch `main`, folder `/ (root)` → **Save**.
4. Tunggu 1-2 menit, situs akan aktif di `https://USERNAME.github.io/bloomie-flower-shop/`.

Kalau mau custom domain (misal `bloomie.com`), tambahkan file `CNAME` berisi domain tersebut, lalu atur DNS record sesuai instruksi GitHub Pages.

## Menambah/mengubah produk

Edit array `PRODUCTS` dan `FLOWERS` di `js/data.js` — tinggal tambah objek baru dengan `id`, `name`, `img`, `price`, `desc`, `category`, `flowers`.
