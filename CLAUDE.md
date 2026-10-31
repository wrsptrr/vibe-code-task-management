# CLAUDE.md

Panduan untuk Claude Code saat bekerja di repository ini.

## Gambaran Proyek

**Task Manajemen** — aplikasi untuk membuat, mengatur, dan memantau tugas.

- **Tujuan:** <!-- TODO: masalah apa yang diselesaikan, untuk siapa -->
- **Status:** Project sudah di-init (Vite + React + TS + shadcn), belum ada fitur

### Fitur Utama

<!-- TODO: sesuaikan -->

- [ ] CRUD tugas (judul, deskripsi, status, prioritas, deadline)
- [ ] Status tugas: `todo` → `in_progress` → `done`
- [ ] Filter & pencarian tugas
- [ ] Kategori / label / proyek

## Tech Stack

<!-- TODO: isi setelah ditentukan -->

- React 19 + Vite 6
- Shadcn UI + Tailwind CSS 4
- Typescript
- Tanpa database, data disimpan di localstorage

## Struktur Folder

<!-- TODO: perbarui sesuai struktur sebenarnya -->

```
task-manajemen/
├── src/
│   ├── components/   # Komponen UI yang dapat dipakai ulang
│   ├── pages/        # Halaman / route
│   ├── hooks/        # Logika bisnis
│   ├── services/     # pemanggilan API
│   └── utils/        # Fungsi helper
├── tests/            # Unit & integration test
├── docs/             # Dokumentasi tambahan
└── CLAUDE.md
```

## Perintah Penting

<!-- TODO: sesuaikan dengan package manager / tooling -->

```bash
# Install dependency
npm install

# Jalankan development server
npm run dev

# Build produksi
npm run build

# Lint
npm run lint

# Tambah komponen shadcn
npx shadcn@latest add <komponen>

# Test: belum ada framework test
```

## Model Data

<!-- TODO: sesuaikan -->

**Task** | Field | Tipe | Keterangan | |-------------|----------|-------------------------------------| | id | string | ID unik | | title | string | Wajib | | description | string | Opsional | | status | enum | `todo` / `in_progress` / `done` | | priority | enum | `low` / `medium` / `high` | | dueDate | date | Opsional | | createdAt | datetime | Otomatis | | updatedAt | datetime | Otomatis |

## Konvensi Kode

- Penamaan: `camelCase` untuk variabel/fungsi, `PascalCase` untuk komponen/kelas, `camelCase` untuk nama file non-komponen.
- Satu komponen / modul per file; jaga fungsi tetap kecil dan fokus.
- Ikuti gaya kode yang sudah ada di sekitarnya.
- Jangan commit secret; gunakan `.env` (dan sediakan `.env.example`).

## Alur Kerja Git

- Branch utama: `main`. Buat branch fitur: `feat/<nama>`, `fix/<nama>`.
- Format commit (Conventional Commits): `feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`, `test: ...`.
- Pastikan test & lint lulus sebelum commit.

## Testing

- Setiap fitur baru disertai test.
- <!-- TODO: framework test & lokasi file test -->

## Catatan untuk Claude

- Bahasa komunikasi: Bahasa Indonesia.
- Bahasa di code: English
- Tanyakan dulu sebelum menambah dependency baru atau mengubah struktur folder.
- Perbarui file ini bila tech stack, struktur, atau perintah berubah.
