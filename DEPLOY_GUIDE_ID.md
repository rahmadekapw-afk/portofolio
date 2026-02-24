# Panduan Pengaturan Auto-Deploy (GitHub Actions)

Agar website Anda bisa ter-deploy otomatis ke hostingan setiap kali melakukan `git push`, Anda harus memasukkan data login FTP Anda ke dalam **GitHub Secrets**.

### Langkah-langkah:

1.  Buka repositori Anda di GitHub.
2.  Klik tab **Settings** (di bagian atas).
3.  Pilih menu **Secrets and variables** > **Actions** di sidebar sebelah kiri.
4.  Klik tombol hijau **New repository secret**.
5.  Masukkan satu per satu data berikut:

| Name (NAMA) | Value (ISI) | Keterangan |
| :--- | :--- | :--- |
| `FTP_SERVER` | `ftp.rahmadeka.com` | Hostname FTP Anda (bisa cek di cPanel) |
| `FTP_USERNAME` | `username_ftp_anda` | Username FTP |
| `FTP_PASSWORD` | `password_ftp_anda` | Password FTP |
| `VITE_SUPABASE_URL` | `https://iggzdcuthrqxekblguaz.supabase.co` | (Sudah ada di .env) |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI...` | (Sudah ada di .env) |

### Cara Cek Keberhasilan:
Setelah semua *Secret* di atas ditambah, coba lakukan perubahan kecil pada kode dan `git push`, atau buka tab **Actions** di GitHub dan klik **"Re-run all jobs"** pada proses terakhir.

> [!IMPORTANT]
> Tanpa data di atas, GitHub tidak punya "izin/kunci" untuk masuk ke server hosting Anda, sehingga proses upload otomatis tidak bisa berjalan.
