/**
 * Tailwind classes that hide a cell's vertical border when the "Table Column Borders" setting is off.
 * The setting is mirrored on `<body>` as `data-table-v-borders` (see `TABLE_BORDER_DATA_ATTRIBUTES`).
 * `after:hidden` also removes the pseudo-element divider used by sticky columns.
 */
export const TABLE_VERTICAL_BORDER_OFF_CLASSES = 'in-data-[table-v-borders=false]:border-r-0 in-data-[table-v-borders=false]:after:hidden';
