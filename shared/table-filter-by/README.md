# table-filter-by (UI)

The "Filter By" half of a table header's three dot menu: a submenu with a text input and an Apply
button that writes the value to a search param. The constants and key derivation live in
`table-filter-by.utils.ts` here; the nuqs hooks live in `/hooks/table-filter-by`.

Every piece is its own component so a host can compose at whatever level it needs. Each one takes
`tableId` and `columnId` (together they are the search param key), a `className` (merged with `cn`,
so your class wins), and props for its text.

| Component | Use it when |
| --- | --- |
| `TableFilterByMenuSection` | Your header menu wants the whole "Filter" group. Renders nothing for a column that is not filterable, so you can drop it in unconditionally. |
| `TableFilterBySubMenu` | You want only the "Filter By" submenu, without the group heading or separator. |
| `TableFilterByClearMenuItem` | You want only the "Clear Filter" row. Renders nothing while the column has no filter. |
| `TableFilterByPanel` | You are building your own popover and want the label, input and buttons. |
| `TableFilterByInput` | You want only the input. |
| `TableFilterByApplyButton` | You want only the Apply button. |
| `TableFilterByClearButton` | You want only the Clear button. |

## Clearing a filter

Three ways, all writing the same param: the X inside the input, the Clear button under Apply, and
"Clear Filter" in the main menu — the last one so dropping a filter does not mean hovering into the
submenu first. The two dedicated controls appear only while the column actually has a filter
applied, and "Clear Filter" closes the host menu through its `onAction`.

## Which columns are filterable

`TABLE_FILTER_BY_COLUMNS` in `table-filter-by.utils.ts` — one object keyed by column id, covering
every table in the app. A column id in the object gets the menu item; a column id that is absent
does not. That is the whole test, so adding the filter to a new column is one entry here plus a
matching read on the server.

```ts
export const TABLE_FILTER_BY_COLUMNS: Partial<Record<AppColumnId, TableFilterByColumnConfig>> = {
  cost: { placeholder: 'e.g. 10, >10, <=99.99', hint: 'Supports >, <, >= and <=' },
  frequency: { placeholder: 'e.g. monthly' },
  // ...
};
```

One entry covers that column in every table that has it — `cost` is filterable in both the bills
and the subscriptions table, and the table prefix below keeps their two search params apart.

## Search param keys

The key is `tableId__columnId`: `bills__cost`, `subscriptions__name`, `bills__frequency`.
`getTableFilterByParamKey` is the only place it is derived, so changing the shape (drop the prefix,
pack everything into one param) is a change to that one function.

The prefix does two things. It keeps a filter clear of the other params on its page — the bills page
already has a `frequency` multi select reading a comma separated list of exact values, which is not
this free text `contains` filter — and it keeps the same column filterable in two tables without
them sharing one value.

`searchParamKey` on a column overrides the whole key when the default cannot produce what a column
needs, such as one key deliberately shared by two tables. Nothing uses it today.

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
