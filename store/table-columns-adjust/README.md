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
- `useTableColumnOrdering(tableId, ordering?)` — resolves where the column order is read from and
  written to. Defaults to the app's table store; pass a `TableColumnOrderingSource` and every hook
  above follows your store instead. This is what lets a new table bring its own zustand store.

UI: `shared/table/FormattedTableHeadMenuDisplayOption.tsx` renders the "Display" section of a column's
three dot menu (Hide Column + a collision-aware submenu of checkbox items for every column). Drop it
into any `<DropdownMenuContent>`; it takes `tableId`, `columnId`, and optionally `columnLabels` and
`ordering` for a table that is not one of the app's own.

## Adding a table

Worked example: `app/(base)/test/_components/column-adjust-demo` (rendered on `/test`) is a complete
new table — five columns, fake rows, its own store — built only from the pieces below. Copy it.

1. **Declare the columns.** A `['a', 'b', …] as const` list in its own file, next to the table
   (e.g. `store/test-table/test-table.columns.ts`), plus a `columnId -> label` map for the menu.
2. **Register it.** Add the id to `TableId`, add one line to `TableColumnIdsByTableId` and to
   `TABLE_COLUMNS_BY_TABLE_ID`, and one entry each in
   `getDefaultTableColumnDisplayConfigurations()` / `normalizeTableColumnDisplayConfigurations()`.
   Show/hide state is then handled for you, persisted and reconciled.
3. **Bring a store for what the table owns** — its column order, and widths if it is resizable
   (see `store/test-table/test-table.store.ts`). Expose the order as a `TableColumnOrderingSource`
   (`{ ordinals, reorderColumns }`, memoized). Skip this if the table has no ordering of its own:
   the hooks fall back to the app's table store.
4. **Wire the table.** Three lines:

   ```tsx
   const ordering = useMyTableColumnOrdering();                            // step 3, or omit
   const columnsSorted = useOrderedVisibleTableColumns('myTable', ordering);
   const { reorderVisibleColumns } = useTableColumnReorder('myTable', ordering);
   ```

   Map headers *and* rows over `columnsSorted`, and render
   `<FormattedTableHeadMenuDisplayOption tableId="myTable" columnId={ columnId } columnLabels={ … } ordering={ ordering } />`
   inside each header's dropdown. Gate the table on `useIsClient()` — the column state comes from
   local storage, so rendering it before mount would not match the server's markup.

## Notes

- The table's first (left-most) column can never be hidden: the menu drops its "Hide Column" item and
  disables its checkbox in the submenu. Since the last remaining column is also the first one, that rule
  alone makes hiding every column impossible — and the header menu is the only way to bring them back.
- Hidden columns keep their ordinal position, including across reorders of the visible columns.
- Persisted state is reconciled against the hard coded lists on rehydrate: new columns default to shown,
  removed columns are dropped, and an all-hidden payload falls back to the defaults.
