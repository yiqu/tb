# table-filter-by (UI)

The "Filter By" half of a table header's three dot menu: a submenu with a text input and an Apply
button that writes the value to a search param. The constants and key derivation live in
`table-filter-by.utils.ts` here; the nuqs hooks live in `/hooks/table-filter-by`.

Every piece is its own component so a host can compose at whatever level it needs, and each one
takes a `className` (merged with `cn`, so your class wins) plus props for its text.

| Component | Use it when |
| --- | --- |
| `TableFilterByMenuSection` | Your header menu wants the whole "Filter" group. Renders nothing for a column that is not filterable, so you can drop it in unconditionally. |
| `TableFilterBySubMenu` | You want only the "Filter By" submenu, without the group heading or separator. |
| `TableFilterByPanel` | You are building your own popover and want the label, input and Apply button. |
| `TableFilterByInput` | You want only the input. |
| `TableFilterByApplyButton` | You want only the Apply button. |

## Which columns are filterable

`TABLE_FILTER_BY_COLUMNS` in `table-filter-by.utils.ts` — one object keyed by column id, covering
every table in the app. A column id in the object gets the menu item; a column id that is absent
does not. That is the whole test, so adding the filter to a new column is one entry here plus a
matching read on the server.

```ts
export const TABLE_FILTER_BY_COLUMNS: Partial<Record<AppColumnId, TableFilterByColumnConfig>> = {
  cost: { placeholder: 'e.g. 10, >10, <=99.99', hint: 'Supports >, <, >= and <=' },
  frequency: { searchParamKey: 'bills__frequency', placeholder: 'e.g. monthly' },
  // ...
};
```

Column ids are shared across tables on purpose — `cost` is filterable in both the bills and the
subscriptions table, and they never render on the same page, so one entry covers both.

## Search param keys

The key is the column id. `getTableFilterByParamKey` is the only place that is derived, so changing
the shape (a table prefix, one packed param) is a change to that one function.

`searchParamKey` overrides it for a column whose id is already taken by a different search param on
the same page. Name an override `tableId__columnId`, the shape every filter used before this
refactor. `frequency` is the only such case today: that param is the bills page's frequency multi
select (a comma separated list of exact values, also written by the cell hover "add to filter"
button), and this free text `contains` filter is a different thing, so it stays on
`bills__frequency`.

## Apply vs. filter-as-you-type

The input is a draft in local state and nothing reaches the URL until Apply (or Enter in the
input). To go back to writing the param on every keystroke, flip one constant in
`/hooks/table-filter-by/useTableFilterByQuery.ts`:

```ts
const FILTER_BY_COMMIT_ON_CHANGE: boolean = true;
```

`TableFilterByPanel` renders the Apply button off the hook's `commitOnChange`, so the button
disappears on its own — no component changes. `FILTER_BY_COMMIT_ON_CHANGE_DEBOUNCE_MS` next to it
sets how long typing settles first, and `FILTER_BY_QUERY_OPTIONS` above them holds the nuqs options
every filter param is read and written with.
