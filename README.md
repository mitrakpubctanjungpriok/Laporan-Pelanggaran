# 📋 Form Laporan Pelanggaran + Admin Dashboard

Sistem pelaporan pelanggaran internal berbasis web dengan dashboard admin yang terhubung dengan Google Sheets.

> **💡 Catatan:** Script Google Apps Script ini sudah digabungkan dengan sistem Tukar Piket yang sudah ada. Satu Google Sheets menangani DUA sistem sekaligus!

## ✨ Fitur

### 👥 Form Laporan (Public)
- ✅ Dropdown Nama Pengadu (dari Daftar_Petugas)
- ✅ Dropdown Nama Pelanggar (dari Daftar_Petugas)
- ✅ Validasi input otomatis (pengadu ≠ pelanggar)
- ✅ Timestamp otomatis (Zona Jakarta)
- ✅ Notifikasi sukses/error
- ✅ Design modern & responsive

### 🔐 Dashboard Admin (Protected)
- ✅ Password protection
- ✅ Real-time data dari Google Sheets
- ✅ Statistics cards (Total, Baru, Proses, Selesai)
- ✅ Table view semua laporan
- ✅ Search & filter by status
- ✅ Detail modal untuk setiap laporan
- ✅ Update status (Baru → Sedang Ditangani → Selesai)
- ✅ Sort by date (terbaru/terlama)
- ✅ Responsive design (desktop & mobile)

### 🔧 Backend
- ✅ Terhubung langsung ke Google Sheets
- ✅ Auto-save dengan validasi
- ✅ Terintegrasi dengan sistem Tukar Piket (1 Google Sheets, 2 sistem)
- ✅ Support multiple systems dalam satu Apps Script

## 🚀 Cara Deploy

### 1. Setup Google Apps Script

**PENTING:** Jika Anda sudah punya sistem Tukar Piket dengan Google Apps Script yang aktif, gunakan Google Sheets yang SAMA!

1. Buka Google Sheets Anda (yang sudah ada untuk Tukar Piket, atau buat baru)
2. Klik **Extensions** → **Apps Script**
3. **Jika sudah ada script lama:** Backup dulu, lalu replace dengan script gabungan
4. **Jika baru:** Copy kode dari file `google-apps-script.js`
5. Klik **Save** (Ctrl+S)
6. Klik **Deploy** → **New deployment** (atau **Manage deployments** jika sudah pernah deploy)
7. Pilih tipe: **Web app**
8. Execute as: **Me**
9. Who has access: **Anyone**
10. Klik **Deploy**
11. **Copy Web App URL** yang muncul

> **📝 Catatan:** URL ini akan sama untuk Tukar Piket dan Laporan Pelanggaran!

### 2. Setup GitHub Repository

1. Buat repository baru di GitHub
2. Upload semua file:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
3. Commit dan push

### 3. Konfigurasi Script

1. Buka file `script.js`
2. Cari baris:
   ```javascript
   SCRIPT_URL: 'GANTI_DENGAN_URL_GOOGLE_APPS_SCRIPT_ANDA',
   ```
3. Ganti dengan URL dari langkah 1.10
4. Save dan commit

### 4. Deploy ke Cloudflare Pages

1. Login ke [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Pilih **Workers & Pages**
3. Klik **Create Application**
4. Pilih tab **Pages**
5. Klik **Connect to Git**
6. Pilih repository GitHub Anda
7. Konfigurasi build:
   - **Project name**: nama-project-anda
   - **Production branch**: main
   - **Build command**: (kosongkan)
   - **Build output directory**: `/`
8. Klik **Save and Deploy**
9. Tunggu proses deployment selesai
10. Website Anda siap di: `https://nama-project-anda.pages.dev`

## 📁 Struktur File

```
.
├── index.html          # Halaman utama form
├── styles.css          # Styling CSS
├── script.js           # JavaScript logic
├── README.md           # Dokumentasi
└── google-apps-script.js  # Backend Google Apps Script
```

## 🔧 Konfigurasi

### Struktur Google Sheets

Setelah deploy, Google Sheets Anda akan punya sheet-sheet berikut:

| Sheet Name | Keterangan |
|------------|------------|
| `Daftar_Petugas` | Daftar nama petugas (untuk Tukar Piket) |
| `Data_Pengajuan` | Data tukar piket (sistem lama) |
| `Laporan_Pelanggaran` | Data laporan pelanggaran (sistem baru) |

> Sheet akan dibuat otomatis saat pertama kali ada data yang masuk.

### Web App URL
URL Google Apps Script yang sama akan melayani dua sistem:
```
https://script.google.com/macros/s/AKfycbx.../exec
```

Script akan otomatis mendeteksi request dari sistem mana berdasarkan field `type` yang dikirim.

## 📝 Kolom Data di Google Sheets

| Timestamp | Nama | Area/Lantai | Laporan/Keluhan |
|-----------|------|-------------|-----------------|
| Auto | Input user | Input user | Input user |

## 🛠️ Troubleshooting

### Form tidak bisa mengirim data
1. Pastikan SCRIPT_URL sudah diganti
2. Cek apakah Web App sudah di-deploy dengan "Anyone" access
3. Buka Console (F12) untuk lihat error

### Data tidak masuk ke Google Sheets
1. Pastikan SHEET_ID benar
2. Pastikan nama sheet sesuai (`Laporan Pelanggaran`)
3. Cek log di Apps Script (View → Logs)

### Error CORS
- Normal untuk Google Apps Script
- Mode `no-cors` sudah digunakan
- Data tetap terkirim meski tidak ada response

## 🎨 Customization

### Mengubah Warna
Edit file `styles.css` pada bagian:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Menambah Field
1. Tambahkan HTML di `index.html`
2. Tambahkan validasi di `script.js`
3. Update kolom di Google Apps Script

## 📞 Support

Jika ada masalah, buka issue di GitHub repository ini.

## 📄 License

MIT License - Bebas digunakan untuk keperluan apapun.

---

**Dibuat dengan ❤️ untuk sistem pelaporan yang lebih baik**
