generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

// -------------------------------------------------------------
// Model Data sesuai Studi Kasus GDGoC UNSRI
// -------------------------------------------------------------

model User {
  id            String       @id @default(uuid())
  name          String
  email         String       @unique
  password_hash String
  role          String       @default("Member") // Lead, Division Head, Member
  created_at    DateTime     @default(now())
  updated_at    DateTime     @updatedAt
  deleted_at    DateTime?    // Untuk Soft Delete
  
  attendances   Attendance[] // Relasi ke tabel Absensi
}

model Event {
  id          String       @id @default(uuid())
  title       String
  description String?
  date        DateTime
  quota       Int
  created_at  DateTime     @default(now())
  updated_at  DateTime     @updatedAt

  attendances Attendance[] // Relasi ke tabel Absensi
}

model Attendance {
  id            String   @id @default(uuid())
  event_id      String
  user_id       String
  check_in_time DateTime @default(now())

  // Relasi
  event Event @relation(fields: [event_id], references: [id])
  user  User  @relation(fields: [user_id], references: [id])

  // Composite Unique Key untuk mencegah absensi ganda (Idempotensi)
  @@unique([event_id, user_id])
}

model AuditLog {
  id           String   @id @default(uuid())
  action       String   // Contoh: "UPDATE_ROLE"
  performed_by String   // ID User yang melakukan aksi
  target_id    String?  // ID User/Data yang diubah
  timestamp    DateTime @default(now())
}