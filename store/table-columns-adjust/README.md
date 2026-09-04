# table-columns-adjust

Per-table column show/hide, persisted to local storage and keyed by table id.

Deliberately decoupled from `store/subscriptions/table.store.ts` (widths, ordinals, pinning): the only
thing this feature needs from a host app is a `TableId` union and one hard coded column list per table.

## Files

- `table-column-adjuster.types.ts` — `TableColumnDisplayConfiguration` (a `{ [columnId]: boolean }` object
  whose keys are limited to the columns of one table) and the per-table-id map the store persists.
- `table-column-adjuster.utils.ts` — pure helpers. `getDefaultTableColumns(tableId)` is the source of
  truth for "all possible columns"; the rest build defaults, reconcile persisted state, filter visible /
  hidden columns and compute ordinals.
- `table-column-adjuster.store.ts` — the zustand store (`persist` + `createJSONStorage(localStorage)`)
  holding one configuration object per table id, plus `useTableColumnDisplayConfiguration(tableId)` and
  `useTableColumnAdjusterActions()`.

Hooks live in `/hooks/table-columns-adjust`:

- `useTableColumnVisibility(tableId)` — all / visible / hidden columns, `isColumnShown`, `canHideColumn`.
- `useOrderedVisibleTableColumns(tableId)` — visible columns in the user's persisted order. This is what
  a table maps over for both its headers and its rows.
- `useOrderedTableColumns(tableId)` — every column, shown or hidden, in that same order. The show/hide
  menu lists these, so its list matches the table left to right.
- `useVisibleTableColumnsWidth(tableId)` — total width of the visible columns only.
- `useTableColumnDisplayToggle(tableId)` — `showColumn` / `hideColumn` / `toggleColumnDisplay`, plus
  `isColumnHideable(columnId)`. Hiding a column leaves its place in the ordering alone, so showing it
  again drops it straight back where it was.
- `useTableColumnReorder(tableId)` — persists a drag and drop reorder of the visible columns without
  colliding with (or moving) the ordinals held by hidden columns.

UI: `shared/table/FormattedTableHeadMenuDisplayOption.tsx` renders the "Display" section of a column's
three dot menu (Hide Column + a collision-aware submenu of checkbox items for every column).

## Adding a table

1. Add the table id to `TableId` and its hard coded column list in `table.store.ts`.
2. Add both to `TableColumnIdsByTableId` and `TABLE_COLUMNS_BY_TABLE_ID`, and add a default entry in
   `getDefaultTableColumnDisplayConfigurations()` / `normalizeTableColumnDisplayConfigurations()`.
3. In the table component, swap the inline `columnsSorted` computation for
   `useOrderedVisibleTableColumns(tableId)` (and `useVisibleTableColumnsWidth(tableId)` if it sizes itself).

## Notes

- The table's first (left-most) column can never be hidden: the menu drops its "Hide Column" item and
  disables its checkbox in the submenu. Since the last remaining column is also the first one, that rule
  alone makes hiding every column impossible — and the header menu is the only way to bring them back.
- Hidden columns keep their ordinal position, including across reorders of the visible columns.
- Persisted state is reconciled against the hard coded lists on rehydrate: new columns default to shown,
  removed columns are dropped, and an all-hidden payload falls back to the defaults.
