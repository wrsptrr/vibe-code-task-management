# Task Manajemen

Aplikasi untuk membuat, mengatur, dan memantau tugas. Tanpa database: semua data disimpan di `localStorage` browser.

## Fitur

- **Manajemen tugas**: tambah, ubah, dan hapus tugas (judul, deskripsi, status, prioritas, deadline).
- **Alur status**: `todo` → `in_progress` → `done`, bisa dimajukan dan dimundurkan.
- **Filter & pencarian** tugas berdasarkan status dan prioritas.
- **Report** per-hari, per-minggu, dan per-bulan: ringkasan tugas selesai, bar chart per status, dan daftar tugas selesai.

## Tech Stack

- React 19 + Vite 6
- TypeScript
- Shadcn UI + Tailwind CSS 4
- react-router, recharts
- Vitest + Testing Library (jsdom)

## Memulai

Prasyarat: Node.js dan npm.

```bash
# Install dependency
npm install

# Jalankan development server
npm run dev
```

## Perintah

| Perintah        | Fungsi                |
| --------------- | --------------------- |
| `npm run dev`   | Development server    |
| `npm run build` | Build produksi        |
| `npm run lint`  | Lint dengan ESLint    |
| `npm test`      | Jalankan unit test    |

Tambah komponen shadcn: `npx shadcn@latest add <komponen>`.

## Struktur Folder

```
task-manajemen/
├── src/
│   ├── components/   # Komponen UI yang dapat dipakai ulang
│   ├── pages/        # Halaman / route
│   ├── hooks/        # Logika bisnis
│   ├── types/        # Tipe TypeScript bersama
│   ├── services/     # Akses penyimpanan (localStorage)
│   └── utils/        # Fungsi helper
├── tests/            # Unit & integration test
├── docs/             # Dokumentasi tambahan
└── CLAUDE.md
```

## Model Data

**Task**

| Field       | Tipe     | Keterangan                              |
| ----------- | -------- | --------------------------------------- |
| id          | string   | ID unik                                 |
| title       | string   | Wajib                                   |
| description | string   | Opsional                                |
| status      | enum     | `todo` / `in_progress` / `done`         |
| priority    | enum     | `low` / `medium` / `high`               |
| dueDate     | string   | Opsional                                |
| createdAt   | datetime | Otomatis                                |
| updatedAt   | datetime | Otomatis                                |
| completedAt | datetime | Otomatis saat status menjadi `done`     |

## Kontribusi

- Branch utama: `main`. Buat branch fitur dengan `feat/<nama>` atau `fix/<nama>`.
- Format commit mengikuti Conventional Commits: `feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`, `test: ...`.
- Pastikan `npm run lint` dan `npm test` lulus sebelum commit.
- Setiap fitur baru disertai test di `tests/` (mirror struktur `src/`).
