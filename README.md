# Texnikum-web

Texnikum rasmiy sayti — Next.js 16 (App Router, Cache Components), Prisma 7 + SQLite, Tailwind CSS 4 asosida.

- Ochiq qism: bosh sahifa, yo'nalishlar, yangiliklar, rahbariyat, galereya, hujjatlar, aloqa
- Admin panel (`/admin`): JWT cookie autentifikatsiya, Server Actions asosida to'liq CRUD (yangiliklar, yo'nalishlar, rahbariyat, galereya, hujjatlar), fayl yuklash (rasm/PDF/DOCX), sayt sozlamalari
- Deployment: multi-stage Docker (Next.js standalone) + docker-compose (`./prisma` va `./public/uploads` persistent bind-mount'lar)

## Talablar

- Node.js 20+
- npm

## Lokal ishga tushirish

```bash
# 1. O'rnatish (postinstall prisma client'ni generatsiya qiladi)
npm install

# 2. Env fayl
cp .env.example .env
# JWT_SECRET uchun yangi qiymat generatsiya qiling:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 3. Baza sxemasi + demo ma'lumotlar
npm run db:push
npm run db:seed

# 4. Dev server
npm run dev
```

Sayt: http://localhost:3000 — Admin panel: http://localhost:3000/admin

Standart admin login (seed): **admin / admin123** (produksiyada o'zgartiring).

## Docker orqali ishga tushirish (produksiya)

```bash
docker compose up -d --build
```

- Ilova: http://localhost:3000
- `db-push` servisi har `up`da sxemani `./prisma/dev.db`ga qo'llaydi (idempotent)
- `./prisma` (SQLite baza) va `./public/uploads` (yuklangan fayllar) host'da saqlanadi — rebuild'dan keyin ham yo'qolmaydi
- `.env` faylidan `JWT_SECRET` o'qiladi (docker-compose interpolatsiya)
- Demo ma'lumotlar kerak bo'lsa: `docker compose run --rm seed`

## Muhim eslatmalar

- `.env` (JWT_SECRET) repoga kirmaydi — har deploy uchun alohida generatsiya qiling
- SQLite fayli (`prisma/dev.db`) va `src/generated/prisma` ham repoda saqlanmaydi (generatsiya: `npm run db:generate`)
- Yuklangan fayllar `public/uploads`ga tushadi va `/api/uploads/<fayl>` orqali xizmat qiladi

## Skriptlar

| Buyruq | Vazifa |
|--------|--------|
| `npm run dev` | Dev server |
| `npm run build` / `start` | Produksiya build / ishga tushirish |
| `npm run db:push` | Sxemani bazaga qo'llash |
| `npm run db:seed` | Demo ma'lumotlar + admin foydalanuvchi |
| `npm run db:generate` | Prisma client'ni generatsiya qilish |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript tekshiruvi (`tsc --noEmit`) |

## AI agentlar bilan ishlash

Repozitoriy istalgan mashinada clone qilinib, AI agent (Claude Code, Cursor, opencode, Codex va h.k.) orqali o'zgartirilishi mumkin. Buning uchun:

1. Agentga **avval `AGENTS.md` faylini o'qishni** aytng (Claude Code uchun `CLAUDE.md` avtomatik o'qiladi — u `AGENTS.md`ga havola qiladi)
2. Yangi mashinada oddiy setup:
   ```bash
   git clone https://github.com/khujabekov/texnikum-web.git
   cd texnikum-web
   npm install
   cp .env.example .env      # JWT_SECRET generatsiya qiling
   npm run db:push
   npm run db:seed           # faqat bo'sh baza uchun (demo ma'lumotlar)
   npm run dev
   ```
3. Har o'zgarishdan keyin tekshiruv: `npm run typecheck`, `npm run lint`, kerak bo'lsa `npm run build`

Hujjatlar:

- `AGENTS.md` — agentlar uchun to'liq qo'llanma (arxitektura, qoidalar, gotcha'lar)
- `docs/ARCHITECTURE.md` — so'rov oqimlari, kesh, auth, yuklash, Docker
- `docs/DATA-BACKUP.md` — baza va yuklangan fayllarni zaxiralash/tiklash

> Muhim: real ma'lumotlar (`.env`, `prisma/dev.db`, `public/uploads/`) repoda saqlanmaydi. Yangi clone'da demo seed bo'ladi; real ma'lumotni ko'chirish uchun `docs/DATA-BACKUP.md`ga qarang.

