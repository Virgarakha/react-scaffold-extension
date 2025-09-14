# React Auth Scaffold

🚀 Extension VSCode untuk membuat **scaffolding autentikasi** dan **CRUD** di project React + Vite hanya dengan 1 klik.

## ✨ Fitur
- Membuat `AuthContext.jsx` di folder `context` untuk mengelola autentikasi (login, logout, user, token).
- Membuat `Login.jsx` & `Home.jsx` di folder `pages` untuk halaman login dan home yang terproteksi.
- Membuat `PrivateRoute.jsx` di folder `components` untuk melindungi rute yang memerlukan autentikasi.
- Update `App.jsx` dengan konfigurasi router menggunakan `react-router-dom`.
- Bisa custom lokasi folder (`frontend/src`, `src`, dll).
- Membuat scaffolding CRUD untuk entitas tertentu (misalnya, `Barang`) dengan file:
  - `${name}.jsx` (daftar item),
  - `${name}Create.jsx` (form pembuatan item),
  - `${name}Update.jsx` (form pengeditan item),
  - `${name}Detail.jsx` (detail item).
- Otomatis menambahkan rute CRUD ke `App.jsx` untuk integrasi dengan router.
- Dukungan autentikasi token di semua request API CRUD.
- Penanganan error dasar untuk request API dan pembuatan folder.

<img src="icon.png" width="128" />

## ⚡ Cara Pemakaian
1. **Install extension** (via `.vsix` atau Marketplace).
2. Buka project React + Vite di VSCode.
3. Tekan `Ctrl + Shift + P` untuk membuka Command Palette.

### Membuat Scaffolding Autentikasi
4. Pilih **Create React Auth Files**.
5. Ketik folder tujuan (contoh: `frontend/src` atau `src`).
6. Otomatis terbentuk struktur:
frontend/src/
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── Login.jsx
│   └── Home.jsx
├── components/
│   └── PrivateRoute.jsx
└── App.jsx

7. Jalankan proyek React dan akses rute `/login` untuk login, atau `/` (setelah login) untuk halaman home.

### Membuat Scaffolding CRUD
4. Pilih **Create CRUD Files**.
5. Ketik folder tujuan (contoh: `src/pages`).
6. Ketik nama CRUD (contoh: `Barang`).
7. Otomatis terbentuk struktur:
src/pages/
└── Barang/
├── Barang.jsx
├── BarangCreate.jsx
├── BarangUpdate.jsx
└── BarangDetail.jsx

8. Rute CRUD akan otomatis ditambahkan ke `App.jsx`, misalnya:
- `/barang` (daftar),
- `/barang/create` (buat),
- `/barang/:id` (detail),
- `/barang/:id/edit` (edit).
9. Pastikan API backend tersedia (misalnya, `http://localhost:8000/api/barangs`) dan autentikasi token dikonfigurasi jika diperlukan.

## 🎯 Cocok untuk
- Belajar autentikasi di React.
- Membuat boilerplate project dengan cepat.
- Menghemat waktu setup awal project.
- Pengembangan fitur CRUD sederhana dengan integrasi autentikasi.

# React Auth Scaffold

🚀 Extension VSCode untuk membuat **scaffolding autentikasi** dan **CRUD** di project React + Vite hanya dengan 1 klik.

## 📥 Cara Mendownload dan Menginstal Extension

### 1. Unduh File `.vsix` Secara Otomatis
Klik tombol di bawah ini untuk mengunduh file `.vsix` rilisan terbaru secara langsung:

[<img src="https://img.shields.io/badge/Download%20Now-blue?logo=download&style=for-the-badge" alt="Download Now">](https://github.com/Virgarakha/react-scaffold-extension/react-auth-scaffold-0.1.1.vsix)

- **Catatan**: Ganti URL di atas dengan tautan rilisan terbaru Anda (misalnya, `v0.0.8` untuk versi berikutnya).
- Jika tautan tidak berfungsi, kunjungi [halaman Releases](https://github.com/Virgarakha/react-scaffold-extension) untuk mengunduh manual.

### 2. Instalasi di VS Code
- Buka Visual Studio Code.
- Tekan `Ctrl+Shift+X` untuk membuka **Extensions** view.
- Klik ikon titik tiga (...) di kanan atas panel Extensions, lalu pilih **Install from VSIX...**.
- Pilih file `.vsix` yang telah diunduh.
- Tunggu hingga instalasi selesai. Extension akan otomatis aktif.

### 3. Verifikasi Instalasi
- Setelah terinstal, Anda akan melihat "React Auth Scaffold" di daftar extension di VS Code.
- Tekan `Ctrl+Shift+P`, ketik "Create React Auth Files" atau "Create CRUD Files" untuk memastikan perintah tersedia.

## ✨ Fitur Utama
- Membuat `AuthContext.jsx`, `Login.jsx`, `Home.jsx`, dan `PrivateRoute.jsx` untuk autentikasi.
- Membuat scaffolding CRUD (misalnya, `Barang.jsx`, `BarangCreate.jsx`, dll.).
- Integrasi otomatis dengan `App.jsx` menggunakan `react-router-dom`.
- Dukungan autentikasi token dan penanganan error dasar.

## ⚡ Cara Penggunaan
1. Buka proyek React + Vite di VS Code.
2. Tekan `Ctrl+Shift+P`:
   - Pilih **Create React Auth Files** untuk scaffolding autentikasi.
   - Pilih **Create CRUD Files** untuk scaffolding CRUD.
3. Ikuti prompt untuk memasukkan folder tujuan dan nama CRUD (jika diperlukan).
4. Struktur file akan otomatis dibuat sesuai kebutuhan.

## 🎯 Cocok untuk
- Belajar autentikasi dan CRUD di React.
- Membuat boilerplate project dengan cepat.
- Menghemat waktu setup awal.

## 📝 Kontribusi
- Fork repositori ini.
- Buat pull request untuk fitur atau bug fix.
- Laporkan isu di [Issues](https://github.com/<yourusername>/react-auth-scaffold/issues).

## 📄 Lisensi
MIT License - Lihat [LICENSE](LICENSE) untuk detail.

## 🌐 Kontak
Jika ada pertanyaan, buka isu di GitHub atau hubungi pengembang di [email Anda](mailto:your.email@example.com) (ganti dengan email Anda).

---

### Catatan untuk Pengembang
- Pastikan file `.vsix` diunggah ke rilisan GitHub dengan nama yang konsisten (misalnya, `react-auth-scaffold-0.0.7.vsix`).
- Perbarui tautan unduh di atas setiap kali merilis versi baru.