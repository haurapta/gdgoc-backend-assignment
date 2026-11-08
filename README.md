# GDGoC UNSRI - Back-End Technical Assignment 🚀

Repositori ini berisi REST API untuk sistem manajemen Core Team dan Event GDGoC UNSRI. Dibangun untuk memenuhi Technical Assignment divisi Back-End, dengan fokus pada keamanan, performa, dan integritas data.

## 🛠 Tech Stack
* **Runtime & Framework:** Node.js, Express.js, TypeScript
* **ORM & Database:** Prisma ORM, SQLite (Environment Development)
* **Security:** JSON Web Token (JWT) & bcryptjs

## ✨ Fitur Utama
1. **Autentikasi & Otorisasi (RBAC):** Pendaftaran, Login, dan pengamanan endpoint menggunakan middleware verifikasi JWT.
2. **Event Management:** Pembuatan event baru dan sistem registrasi (check-in) untuk peserta.
3. **Pessimistic Locking:** Penanganan *Race Condition* yang ketat menggunakan Prisma Interactive Transactions untuk memastikan kuota event tidak pernah bernilai minus meskipun diakses ribuan *request* secara bersamaan.
4. **Audit Trail:** Pencatatan log otomatis untuk setiap aktivitas krusial (seperti registrasi event).

## 🚀 Cara Menjalankan di Komputer Lokal

### 1. Clone Repositori
```bash
git clone [https://github.com/USERNAME_ANDA/gdgoc-backend-assignment.git](https://github.com/USERNAME_ANDA/gdgoc-backend-assignment.git)
cd gdgoc-backend-assignment
