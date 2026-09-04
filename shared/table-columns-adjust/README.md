# table-columns-adjust (UI)

The menu half of the column show/hide feature. State, helpers and hooks live in
`/store/table-columns-adjust` and `/hooks/table-columns-adjust`.

Every piece is its own component so a host can compose at whatever level it needs, and each one takes
a `className` (merged with `cn`, so your class wins) plus props for its text.

| Component | Use it when |
| --- | --- |
| `TableColumnDisplayMenuButton` | You want the whole header menu: three dot trigger, menu, section. One line for a new table. |
| `TableColumnDisplayMenuSection` | Your header menu already has other options (sort, pin, filter) and you want the "Display" group inside it. |
| `TableColumnDisplaySubMenu` | You want only the "Show / Hide Columns" submenu. |
| `TableColumnHideMenuItem` | You want only "Hide Column". Renders nothing for the first column, which is never hideable. |
| `TableColumnDisplayCheckboxItem` | You are building your own list and want one column's checkbox row. |
| `TableColumnDisplayBulkMenuItems` | You want only "Hide All" / "Show All". |

## Shared props

- `tableId` — a table id registered in `/store/table-columns-adjust`.
- `columnId` — the column whose header owns the menu.
- `ordering` — a `TableColumnOrderingSource` when the table keeps its column order in its own store.
- `columnLabels` — `columnId -> header text`. Falls back to the column id.

## Customizing

```tsx
<TableColumnDisplayMenuButton
  tableId="test"
  columnId={ columnId }
  columnLabels={ TEST_TABLE_COLUMN_LABELS }
  ordering={ ordering }
  className="ml-auto size-7"                 // trigger button
  contentClassName="min-w-64"                // menu panel
  subMenuContentClassName="max-h-[24rem]"    // column list panel — height lives here
  label="Columns"                            // section heading, or null to drop it
  showBulkActions={ false }                  // drop Hide All / Show All
/>
```

The column list defaults to `max-h-[min(36rem,var(--radix-dropdown-menu-content-available-height,36rem))]`
— tall enough for a long list, never taller than the room Radix reports. Pass
`subMenuContentClassName` (or `contentClassName` on `TableColumnDisplaySubMenu`) to change it.
