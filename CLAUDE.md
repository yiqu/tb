# CLAUDE.md — Project Instructions
 
# Project Overview

Next.js application using TypeScript, shadcn components, tailwindcss version 4+, Zod for validation, and React Hook Form for form management.

## Documentation

Reference the relevant doc on their website: `https://nextjs.org/docs`. Your training data is outdated — the docs are the source of truth.

## Code Style

- TypeScript strict mode, never use `any` — use `unknown` and narrow
- Prefer `interface` over `type` for object shapes
- Use `const` by default, `let` only when reassignment is needed
- Avoid enums, use `as const` objects instead

## Mongo Queries

- Always use the most efficient way for mongo queries. Don't query for ALL of the data unless necessary. 

## Next.js Conventions

- Do prefer using React Server Components.
- Use the client components at the most leaf level of a component tree, try to use the client components at the most leaf level only.
- Do not forget to insert the directives: use client, and user server for server action files.
- Put server action function in its own relevant sub folders.
- App router. Prefer to get the search params and params in a page.tsx or layout.tsx at the most leaf level component that needs it. This is because
  we want Suspense to happen at the most leaf level of the component tree. If it is a client component that needs it, use the use() hook to extract its values.

## Common components

- Prefer `<RowStack>` or `<ColumnStack>` for simple flex arrangements.
- Make sure to use `<Typography>` components for all texts.


## Forms (React Hook Form + Zod)

- Define Zod schemas first, then derive TypeScript types with `z.infer<typeof schema>`
- Use `zodResolver` from `@hookform/resolvers/zod` to connect schemas to forms
- Use `useForm` with explicit generic type: `useForm<FormSchema>({ resolver: zodResolver(schema) })`
- Display field errors via MUI's `error` and `helperText` props on TextFields
- Keep schemas colocated with the form or in a shared `schemas/` directory

## Dates

- Prefer to use the Luxon library for date related things.
- Manually set timezones to EST timezones when working with time.

## Architecture

- `/app/(base)` — main application
- `/components` — Shared reusable components
- `/components/ui` — Shared shadcn components
- `/constants` — constants for app wide
- `/hooks` — app hooks
- `/lib` — app utils files
- `/models` - app typescript types
- `/nuqs-parsers` - nuqs parsers
- `/prisma` - prisma schema
- `/store` - Zustand stores
- `/validators` - react hook forms validators

## Formatting

- Do not run Prettier, ESLint --fix, or any code formatter after making changes. Formatting is handled separately.
- Do not worry about linting. That is handled manually.
- Do not need to fix import orders.

## Important

- Never commit `.env` files
- Always prefer shadcn components.
- All form validation must go through Zod schemas — no inline validation logic
- Prefer server-side validation then pass it client-side
- When creating new routes, follow Next.js app router convention.

## Post plan

- Run a review and fix any issues or problems that does not required the developer or user's input. 
- If there is a unsure question, then do not fix it until you receive further clarification. 