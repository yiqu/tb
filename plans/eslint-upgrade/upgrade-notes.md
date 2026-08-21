# ESLint 10 Upgrade — Notes & Answers

Upgrade executed per `plan.md`. ESLint `8.57.1` → `10.7.0`, config converted from `.eslintrc.json` (removed in ESLint 10) to flat `eslint.config.mjs`.

## What changed

- **eslint** `^8.57.1` → `^10.7.0` (latest v10). Node requirement is now ≥ 20.19 / ≥ 22.13 / ≥ 24.
- **eslint-config-next** `~15.5.4` → `16.2.10` (matches the installed Next version and ships native flat configs; extended via `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`).
- **eslint-plugin-perfectionist** `~2.11.0` → `~5.10.0`. The rule options were migrated to the v5 API: camelCase option names, regex patterns instead of globs (`internalPattern: ['^@/.+']`), array-based `customGroups` with `groupName`/`elementNamePattern`, `newlinesBetween: 1`. The v2 `object` group no longer exists and was removed from `groups`. The unused `custom-ui-components` custom group (defined but never referenced in `groups`) was dropped.
- **eslint-plugin-unicorn** `~56.0.1` → `~71.1.0`. Rule rename: `unicorn/no-array-for-each` → `unicorn/no-for-each` (config + 2 inline disable comments updated).
- **eslint-config-prettier** `~9.1.0` → `~10.1.8` (imported as `eslint-config-prettier/flat`). It is layered *before* the custom rules block, matching the old `extends` order, so the re-enabled stylistic rules still apply.
- **@stylistic/eslint-plugin** `^5.10.0` **added**. ESLint 10 removed the internal APIs the deprecated formatting rules relied on, which crashed `react/jsx-curly-spacing`, `react/jsx-equals-spacing`, and `react/jsx-tag-spacing`. All formatting rules were moved to their maintained `@stylistic/*` equivalents (`semi`, `quote-props`, `jsx-quotes`, `no-multi-spaces`, `space-in-parens`, etc.).
  - `react/jsx-props-no-multi-spaces` was dropped: `@stylistic/no-multi-spaces` now covers JSX props.
  - `react/jsx-indent` was dropped: its `@stylistic` replacement is the whole-file `indent` rule, which conflicts with Prettier (Prettier owns indentation in your format-on-save flow).
- `settings.react.version` is pinned to `19.2` because eslint-plugin-react 7.37.x's version auto-detect still calls the removed `context.getFilename()` API under ESLint 10.

## Removed dependencies (no longer needed)

| Package | Why removed |
| --- | --- |
| `@babel/core`, `@babel/eslint-parser`, `@babel/preset-react` | Only used by the legacy eslintrc pipeline; nothing else in the repo references Babel (`babel-plugin-react-compiler` bundles its own `@babel/types`). |
| `@eslint/eslintrc` | FlatCompat is unnecessary — every config used now ships native flat configs. |
| `@rushstack/eslint-patch` | Plugin-resolution patch for eslintrc; obsolete with flat config. |
| `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser` (v5) | v5 doesn't support ESLint 10; `eslint-config-next` bundles `typescript-eslint` v8. |
| `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-import-resolver-node`, `eslint-import-resolver-typescript` | All bundled (and registered) by `eslint-config-next` 16; `import/*` and `react/*` rule overrides still work. |
| `eslint-plugin-node` | Not referenced by any rule or config. |
| `eslint-plugin-prettier` | Was loaded in `plugins` but no `prettier/prettier` rule was ever enabled — it did nothing. Prettier runs separately (CLI / format-on-save). `eslint-config-prettier` is kept. |
| `eslint-plugin-unused-imports` | Loaded but no `unused-imports/*` rule enabled; unused imports are already flagged by `no-unused-vars` / `@typescript-eslint/no-unused-vars`. |
| `eslint-plugin-react-refresh` | Loaded but no rule enabled; it targets Vite HMR, not Next.js. |
| `eslint-plugin-react-compiler` | Loaded but no rule enabled. React compiler linting is now built into `eslint-plugin-react-hooks` v7 (bundled by eslint-config-next) — rules like `react-hooks/purity`, `react-hooks/set-state-in-effect` are active now, which is strictly more coverage than before. |

## New rules downgraded to warnings

`eslint-config-next/typescript` (typescript-eslint recommended) and react-hooks v7 enable rules the old config never had. They flagged ~260 errors in existing code, so they are set to `warn` in a clearly marked block at the top of the rules in `eslint.config.mjs` (`no-explicit-any`, `prefer-const`, `react-hooks/set-state-in-effect`, `react-hooks/purity`, …). Delete that block to adopt the recommended `error` severities.

Two pre-existing errors remain (same severities as the old config):

- `components/404/NotFoundDisplay.tsx:14` — `@next/next/no-html-link-for-pages`
- `shared/multi-sort/multi-sort.query.ts:30` — `@tanstack/query/exhaustive-deps`

## Scripts

- `lint`: `next lint` was **removed in Next.js 16** → now `eslint .`
- `lint-check`: dropped `--ext js,ts,tsx` (not supported with flat config; file matching comes from the config). `--report-unused-disable-directives` and `--max-warnings 0` still work.

## VS Code

- **Extension to install: `dbaeumer.vscode-eslint` v3.0.24 or newer** (latest stable release channel; anything ≥ 3.0.10 understands flat config, but use the current release for ESLint 10). The extension runs the workspace-local ESLint 10, so no other change is needed.
- `.vscode/settings.json`: `"eslint.useFlatConfig": false` → `true` (with `false` the extension would try the removed eslintrc mode and fail under ESLint 10).

### Your ctrl+shift+c multiCommand

Still works, unchanged. `eslint.executeAutofix` remains a real command in the current extension (verified against the extension's command list), and `editor.action.formatDocument` is untouched by this upgrade. Keep:

```jsonc
{
  "key": "ctrl+shift+c",
  "command": "extension.multiCommand.execute",
  "args": { "command": "multiCommand.formatPrettierDocumentAndEsLintAutoFix" }
}
```

Optional simplification (not required): the same behavior without the multiCommand extension via
`"editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" }` + format-on-save, but your explicit-keybinding flow is still fully supported.

## Verification performed

- `npx eslint .` runs the whole repo with no crashes: 964 problems (2 errors — the pre-existing ones above — and 962 warnings, dominated by `better-tailwindcss/enforce-consistent-line-wrapping`, which also warned before).
- `npm run lint` and the `lint-check` flags execute correctly.
- Note: many `enforce-consistent-line-wrapping` warnings in this environment come from LF checkouts vs. the configured `lineBreakStyle: "windows"`; on a Windows checkout with CRLF these do not fire.
