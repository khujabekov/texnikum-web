<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Texnikum-web — agent guide

## What this is

Official website of "Toshkent texnologiya texnikumi" (an Uzbek college) with an admin CMS.

- Public site: home, `/yonalishlar` (study directions), `/yangiliklar` (news), `/rahbariyat` (staff), `/galereya`, `/hujjatlar` (documents), `/aloqa` (contacts)
- Admin panel at `/admin`: CRUD for news, directions, staff, gallery, documents + site settings
- All UI copy is **Uzbek**. Keep it that way. This repo does not use code comments.

## Stack

- Next.js 16 App Router with Cache Components enabled (`cacheComponents: true` in `next.config.ts`)
- React 19, TypeScript, Tailwind CSS 4
- Prisma 7 + SQLite through `@prisma/adapter-better-sqlite3` (config in `prisma7.config.ts`)
- Auth: JWT (jose) in an `admin_token` httpOnly cookie; route protection in `src/proxy.ts`
- Uploads: files stored in `public/uploads`, served by the `/api/uploads/[filename]` route
- Docker: multi-stage standalone image (`Dockerfile`) + `docker-compose.yml`

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:push` | Apply `prisma/schema.prisma` to the database |
| `npm run db:seed` | Demo data + admin user (fresh DB only) |
| `npm run db:generate` | Regenerate the Prisma client |
| `docker compose up -d --build` | Production stack (app + schema push) |

## Local setup (fresh clone)

1. `npm install` — `postinstall` runs `prisma generate`
2. `cp .env.example .env` and set `JWT_SECRET`:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. `npm run db:push`
4. `npm run db:seed` — only on an empty DB. `SiteConfig`/`Admin` use `upsert`, everything else uses `createMany`, so re-running duplicates rows.
5. `npm run dev`

Admin panel: http://localhost:3000/admin — seed credentials `admin` / `admin123`.

## Before finishing any task

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build` if you touched routes, server actions, config or the Prisma schema
4. Manually exercise the affected flows (admin pages are auth-guarded; seeded data is available)

There is no automated test suite.

## Architecture map

| Path | Role |
|------|------|
| `src/app/(site)/` | Public pages (own layout: Navbar/Footer) |
| `src/app/admin/` | Admin pages; each section has `page.tsx` + `actions.ts` |
| `src/app/admin/<section>/actions.ts` | Server Actions for that section (`"use server"`) |
| `src/components/admin/<section>/*Manager.tsx` | Client UI for a section (list + create/edit forms) |
| `src/components/admin/form-fields.tsx` | Shared Field/Textarea/Toggle/StatusBanner/SubmitButton |
| `src/components/admin/FileUpload.tsx` | Upload widget; stores URL in a hidden input |
| `src/app/api/upload/route.ts` | Upload endpoint (auth required, 10 MB, jpg/png/webp/gif/pdf/docx) |
| `src/app/api/uploads/[filename]/route.ts` | Serves uploaded files (path traversal guarded) |
| `src/app/api/auth/login|logout/route.ts` | Cookie login/logout |
| `src/lib/queries.ts` | All DB reads/writes; mutations call `revalidatePath("/", "layout")` |
| `src/lib/public-data.ts` | Cached public reads (`"use cache"` + `cacheLife("max")`) |
| `src/lib/auth.ts` | `getAdminSession()` / `requireAdminSession()` |
| `src/lib/prisma.ts` | PrismaClient + SQLite adapter; relative `file:` URLs resolve against `process.cwd()` |
| `src/lib/slug.ts` | Uzbek/Cyrillic-aware slugify + unique-slug helper |
| `src/lib/action-state.ts` | Shared `ActionState` type and constants |
| `src/proxy.ts` | Middleware: protects `/admin/*`, redirects to `/admin/login` |
| `src/generated/prisma/` | Generated Prisma client — never edit by hand |

### Public data and caching

Public pages read through `src/lib/public-data.ts` (`"use cache"`, `cacheLife("max")`). Any mutation must invalidate it — the helpers in `src/lib/queries.ts` already call `revalidatePath("/", "layout")`, and admin actions additionally call `revalidatePath("/admin/<section>")`. Route admin pages as partial prerender: page shell is static, the auth-guarded content sits in `<Suspense>`.

### Admin CRUD pattern (follow it when adding a section)

1. **Page** (`src/app/admin/<section>/page.tsx`): header + `<Suspense fallback={skeleton}>`; inside the content component `await requireAdminSession()` then fetch via `lib/queries`.
2. **Actions** (`src/app/admin/<section>/actions.ts`): `"use server"`. Every action starts with the `getAdminSession()` guard and returns `ActionState` on failure. Create/update return `{ status, message }`; delete/toggle take `FormData` and return `void`. Mutate via `lib/queries`, then `revalidatePath("/admin/<section>")`.
3. **Manager** (`src/components/admin/<section>/<Name>Manager.tsx`): `"use client"`. Create/edit forms use `useActionState` and collapse on success (`useEffect` on `state.status`); delete/toggle use plain `<form action={...}>` + `window.confirm` so they work without JS.
4. Reuse `form-fields.tsx` and `FileUpload`.

## Rules

- Mutations only through Server Actions — no client-side fetch to database endpoints.
- Every Server Action must re-check auth with `getAdminSession()` (Server Actions are directly POST-able).
- New DB writes belong in `src/lib/queries.ts` so revalidation stays consistent.
- Never edit `src/generated/prisma`; regenerate instead. Keep it out of commits.
- Image rendering on the public site goes through `SafeImage` (`fallbackIcon` accepts a string name: `"newspaper" | "compass" | "graduation" | "image" | "user"`, or `fallback="initials"` + `fallbackText`). Never pass lucide components as props from Server Components.
- Uploaded asset URLs look like `/api/uploads/<name>`; do not hardcode `/uploads/...`.
- Validate form input in the action and return Uzbek error messages.
- Server Components by default; `"use client"` only where interaction/state is needed.
- Styling: Tailwind utilities, rounded-2xl/3xl cards, emerald→sky gradients, matching existing sections.

## Gotchas

- `next build` prerenders `use cache` scopes, so it needs a working SQLite DB **at build time**. Locally `.env` points at `prisma/dev.db`; the Docker builder pushes the schema and seeds a throwaway `prisma/build.db`.
- Prisma workflow is `prisma db push` — there is no migrations directory. After schema changes run `npm run db:push`.
- `.env`, `prisma/*.db`, `public/uploads/*` and `src/generated/prisma` are intentionally not in git.
- In Docker, `DATABASE_URL=file:/app/prisma/dev.db` and uploads live in `/app/public/uploads`; both are bind-mounted from the host.
- The `nextjs-agent-rules` block at the top of this file is maintained by `next dev`; leave it untouched.

## Data model (prisma/schema.prisma)

| Model | Purpose | Key fields |
|-------|---------|------------|
| `SiteConfig` | Singleton site settings (id = 1) | hero/about texts, contacts, socials, section toggles |
| `News` | News articles | `slug` unique, `published`, `views`, `createdAt` |
| `Direction` | Study directions | `slug` unique, `duration`, `eduForm`, `order` |
| `Staff` | Leadership/teachers | `fullName`, `role`, `department`, `order` |
| `Gallery` | Gallery photos | `title`, `category`, `imageUrl` |
| `Document` | Downloadable docs | `fileUrl` (pdf/docx), `category` |
| `Admin` | Admin accounts | `username` unique, bcrypt `passwordHash` |

## Docs

- `docs/ARCHITECTURE.md` — request flows, caching, auth, uploads, Docker
- `docs/DATA-BACKUP.md` — backing up/restoring the SQLite DB and uploads

