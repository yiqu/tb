## Subscription Manager

> ⚠️⚠️⚠️  **CRITICAL SETUP STEP**  ⚠️⚠️⚠️
>
> Before running locally, you MUST create a `.env` file in the project root. The app will not start or behave correctly without required environment variables.

### Tech Stack

- **Framework**: Next.js 15 (App Router, React 19)
- **UI**: shadcn, Tailwind CSS
- **Forms/Validation**: React Hook Form, Zod
- **Data**: Prisma 6 (MongoDB), TanStack Query, Zustand
- **Tooling**: TypeScript, ESLint, Prettier, Turbopack

## Quick Start

1) Install dependencies

```bash
npm install
```

2) Create your `.env` in the project root (see Environment Variables below)

```bash
# .env — example values; replace with your own
DATABASE_URL="mongodb+srv://<user>:<pass>@<cluster>/<dbName>?retryWrites=true&w=majority"
NEXT_PUBLIC_APP_NAME="Subscription Manager"
NEXT_PUBLIC_ADMIN_PASSWORD="changeme"       # used only for client-side gating; not for real auth
NEXT_PUBLIC_ASK_CONSENT="false"             # 'true' to enable consent middleware
```

3) Generate Prisma client and push schema (MongoDB)

```bash
npx prisma generate
npx prisma db push
```

4) Start the dev server

```bash
npm run dev
```

App will be available at `http://localhost:3000`.

## Environment Variables (Required)

Set these in `.env` before running locally:

- **DATABASE_URL**: MongoDB connection string used by Prisma. Example (Atlas):
  - `mongodb+srv://USER:PASS@CLUSTER/DB_NAME?retryWrites=true&w=majority`
- **NEXT_PUBLIC_APP_NAME**: Public app name used in UI.
- **NEXT_PUBLIC_ADMIN_PASSWORD**: Client-only guard for certain admin UI flows. Do not use for real authentication.
- **NEXT_PUBLIC_ASK_CONSENT**: `'true' | 'false'`. Enables consent check in `middleware` when `true`.

Notes:
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Do not put secrets there.
- `NODE_ENV` is handled by Next.js commands and usually should not be set manually for local dev.

## Available Scripts

- **dev**: `next dev --turbopack` (development server)
- **build**: `npx prisma generate && npx prisma db push && next build`
- **start**: `next start` (after build)
- **lint**: `next lint`
- **push-prisma**: `npx prisma db push`
- **update-prisma**: `npx prisma generate`

Common flows:

```bash
# First-time setup
npm install
cp .env.example .env  # if you create one; otherwise create .env manually
npx prisma generate
npx prisma db push
npm run dev

# Type-check and lint
npm run lint

# Build for production
npm run build
npm run start
```

## Project Structure

```text
app/                      # Next.js App Router (routes, layouts, pages)
components/               # Reusable UI (MUI, shadcn/radix-based, form inputs)
constants/                # Shared constants and endpoints
hooks/                    # React hooks (client utilities)
lib/                      # Utilities (prisma, cookies, url, numbers, etc.)
models/                   # Typed models for app domains
providers/                # Context providers (Query Client, Theme, etc.)
public/                   # Static assets (fonts, images, css)
server/                   # Server helpers (axios instances, server calls)
shared/                   # Shared components and table helpers
store/                    # Zustand stores
validators/               # Zod schemas and validators
prisma/                   # Prisma schema (MongoDB)
```

Key files:
- `prisma/schema.prisma` — Prisma datasource set to MongoDB and models
- `lib/prisma.ts` — Prisma client setup
- `middleware.ts` — Consent middleware (`NEXT_PUBLIC_ASK_CONSENT`)
- `components/hook-form/Autocomplete2.tsx` — Autocomplete with RHF support

## Development Notes

- The project uses MUI 6+/7 components with functional React.
- Favor React Server Components where possible; use client components only when necessary (forms, interactivity).
- Validation is done with Zod; types are inferred into RHF where applicable.
- React Query is configured in `providers/TanstackQueryClientProvider.tsx`.

### Prisma (MongoDB)

Commands you will commonly run:

```bash
npx prisma generate     # generate client
npx prisma db push      # sync schema to your MongoDB database
```

### Tailwind & Styling

- Tailwind CSS is available project-wide. Use utility classes with MUI as needed.
- Radix primitives and shadcn-like components are in `components/ui`.

## Troubleshooting

- If the app does not start or certain pages misbehave, first verify your `.env` is present and values are correct.
- MongoDB connection issues: ensure your `DATABASE_URL` points to an accessible cluster/local instance and that IP access is allowed.
- Prisma issues after schema changes: re-run `npx prisma generate` and `npx prisma db push`.
- If you see client-only admin prompts not working, check `NEXT_PUBLIC_ADMIN_PASSWORD` and remember it is not a secure auth mechanism.

## License

Proprietary – internal use only unless otherwise specified.