# table-auto-width

Auto-fit a table column's width to its rendered content by double clicking the column's resize handle.

Self-contained and portable: only React + standard DOM APIs — no dataset, store, or UI-library coupling. Copy this folder into any project that renders a native `<table>`.

## Files

- `useAutoColumnWidth.ts` — hook returning `handleAutoFitDoubleClick`, an `onDoubleClick` handler for any element inside a column's `<th>` (typically the resize handle). Persisting the result is delegated to the `onWidthChange` callback.
- `tableAutoWidth.utils.ts` — pure DOM measurement. Clones the column's rendered cells into a hidden off-screen single-column table (`table-layout: auto`, `white-space: nowrap` forced) and reads the widest cell's intrinsic width.

## Usage

```tsx
const { handleAutoFitDoubleClick } = useAutoColumnWidth({
  columnId,
  minWidth: 80,
  maxWidth: 1200,
  onWidthChange: setColumnWidth, // e.g. persist to a zustand table store
});

<div onPointerDown={ handleResizePointerDown } onDoubleClick={ handleAutoFitDoubleClick } />;
```

In this app it is composed by `hooks/useColumnResize.ts` (returned as `handleResizeDoubleClick`) and wired to `FormattedTableHeadResizeHandle`.

## Notes

- Only cells currently in the DOM are measured — paged and infinite-scroll (e.g. TanStack infinite query) tables auto-fit to what is loaded.
- `maxRowsToMeasure` caps measurement work on very large tables.
- Header content is included by default (`includeHeader`).
