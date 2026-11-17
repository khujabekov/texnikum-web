# Architecture

## Overview

A single Next.js 16 application serving both the public website and the admin panel.

- Rendering: App Router; **Cache Components** enabled (`cacheComponents: true`). Pages are prerendered shells with dynamic holes streamed inside `<Suspense>`.
- Database: SQLite via Prisma 7 and the `@prisma/adapter-better-sqlite3` driver adapter. Schema: `prisma/schema.prisma`. There are no migrations — the workflow is `prisma db push`.
- Auth: stateless JWT (`jose`) stored in the `admin_token` httpOnly cookie. No session table.
- Uploads: plain files on disk in `public/uploads`, served by a route handler (not by the static file handler, because files are added at runtime and in Docker the folder is a bind mount).

## Request flows

### Public page

```
Request → (site)/layout.tsx ── getPublicSiteConfig() ── "use cache" + cacheLife("max")
        → page.tsx ── getPublicX() ── "use cache" ── lib/queries.ts ── Prisma ── SQLite
```

Cached reads live in `src/lib/public-data.ts`. The cache is invalidated by `revalidatePath("/", "layout")`, called by every write helper in `src/lib/queries.ts`.

### Admin page (partial prerender + auth)

```
Request → proxy.ts (JWT verify, redirect to /admin/login if missing)
        → admin/<section>/page.tsx  (static shell: header + <Suspense> skeleton)
            └─ async content component
                 await requireAdminSession()   ← cookies() → dynamic hole
                 lib/queries.getX()            ← fresh DB read, no cache
                 <XManager items={...} />      ← client component
```

No stale data on admin pages: the list is read at request time and the whole tree is re-rendered after each Server Action.

### Server Action mutation

```
<XManager> form action
  → admin/<section>/actions.ts   "use server"
      getAdminSession()  (guard — actions are directly POST-able)
      validate input → Uzbek error messages
      lib/queries.ts write helper
          → prisma write
          → revalidatePath("/", "layout")   (public caches)
      revalidatePath("/admin/<section>")    (explicit admin path)
      return ActionState { status, message }   ← or void for delete/toggle
```

Server Actions automatically re-render the current route and return the new RSC payload together with the action result.

### Auth

```
POST /api/auth/login  { username, password }
  → bcrypt.compare against Admin.passwordHash
  → signAdminToken() → Set-Cookie admin_token (httpOnly, sameSite=lax, 7 days)
POST /api/auth/logout → clears the cookie
src/proxy.ts          → matcher /admin/:path* (login page excluded)
src/lib/auth.ts       → verifyAdminToken / getAdminSession / requireAdminSession
```

Set `JWT_SECRET` in `.env`; tokens cannot be verified without it.

### Upload

```
FileUpload (client) → POST /api/upload (multipart, auth cookie)
  → validate type (jpg/png/webp/gif/pdf/docx) and size (≤ 10 MB)
  → write to public/uploads/<timestamp>-<uuid>.<ext>
  → respond { url: "/api/uploads/<file>" }
Hidden input keeps the URL; the form action stores it in the DB.
Public site/admin renders images through SafeImage → /_next/image → source /api/uploads/...
```

`src/app/api/uploads/[filename]/route.ts` serves the files with a 1-year immutable cache header and blocks path traversal. Deleting a DB row does **not** delete the underlying file.

## Data model

| Model | Purpose |
|-------|---------|
| `SiteConfig` | Singleton (id = 1): site name, hero/about content, contacts, socials, section visibility toggles |
| `News` | Articles: unique `slug`, `category`, `content`, `imageUrl`, `published`, `views` |
| `Direction` | Study directions: unique `slug`, descriptions, `duration`, `eduForm`, `order` |
| `Staff` | Leadership and teachers: `fullName`, `role`, `department`, `bio`, `order` |
| `Gallery` | Photos: `title`, `category`, `imageUrl` |
| `Document` | Downloadable files: `fileUrl` (pdf/docx), `category` |
| `Admin` | Admin accounts: unique `username`, bcrypt `passwordHash` |

## Docker

Services in `docker-compose.yml`:

| Service | Image target | Role |
|---------|--------------|------|
| `db-push` | `migrator` | One-shot `prisma db push` against `./prisma/dev.db`, runs before the app starts |
| `app` | `runner` | Next.js standalone server (`node server.js`) on port 3000 |
| `seed` (profile) | `migrator` | Optional `npx tsx prisma/seed.ts` for demo data |

Build stages in `Dockerfile`:

1. `deps` — `npm ci`
2. `builder` — `prisma generate`, then schema push + seed into a **throwaway** `prisma/build.db` (required because `next build` executes `use cache` scopes), then `next build` with `NEXT_OUTPUT_STANDALONE=true`
3. `migrator` — full `node_modules` + schema for one-shot CLI tasks
4. `runner` — `.next/standalone`, `.next/static` and `public/` only

Persistence (bind mounts from the host):

- `./prisma` → `/app/prisma` (SQLite database)
- `./public/uploads` → `/app/public/uploads` (uploaded files)

`DATABASE_URL=file:/app/prisma/dev.db` inside containers. `.env` is not baked into the image; `JWT_SECRET` is interpolated by Compose from the host `.env`.

## Key files

| Path | Responsibility |
|------|----------------|
| `src/proxy.ts` | Admin route protection (JWT) |
| `src/lib/auth.ts` | Token signing/verification, session helpers |
| `src/lib/prisma.ts` | Prisma client + SQLite adapter, URL resolution |
| `src/lib/queries.ts` | All reads/writes + cache invalidation |
| `src/lib/public-data.ts` | Cached public reads (`"use cache"`, `cacheLife("max")`) |
| `src/lib/slug.ts` | Uzbek/Cyrillic slugify, unique-slug helper |
| `src/lib/action-state.ts` | Shared action state type/constants |
| `src/app/admin/*/actions.ts` | Server Actions per section |
| `src/components/admin/*` | Admin UI (managers, form fields, upload) |
| `src/app/api/upload/route.ts` | Upload endpoint |
| `src/app/api/uploads/[filename]/route.ts` | File serving endpoint |
