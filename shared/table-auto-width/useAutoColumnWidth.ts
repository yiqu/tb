'use client';

import { useCallback } from 'react';

import { measureColumnAutoWidth } from './tableAutoWidth.utils';

export interface UseAutoColumnWidthOptions {
  /** Identifier for the column being auto-sized, forwarded to onWidthChange. */
  columnId: string;
  /** Minimum allowed width in px. @default 80 */
  minWidth?: number;
  /** Maximum allowed width in px. @default 1200 */
  maxWidth?: number;
  /** Extra px added on top of the measured content width for breathing room. @default 16 */
  extraPadding?: number;
  /** Whether the header cell's own content participates in the measurement. @default true */
  includeHeader?: boolean;
  /** Safety cap on how many body rows are measured, for very large tables. @default 200 */
  maxRowsToMeasure?: number;
  /** Called with the measured width so the consumer can persist it (e.g. a zustand table store). */
  onWidthChange: (_columnId: string, _width: number) => void;
}

/**
 * Auto-fits a table column's width to its currently rendered content on double click.
 *
 * Composable and dataset-agnostic: the hook knows nothing about the data — it
 * resolves the column's `<th>` from the double-clicked element (`closest('th')`),
 * measures the rendered cells in that column position via
 * `measureColumnAutoWidth`, and hands the resulting width to `onWidthChange`
 * for the consumer to persist however it likes (zustand, URL state, server…).
 *
 * Usage: attach the returned `handleAutoFitDoubleClick` to the `onDoubleClick`
 * of any element rendered inside the column's header cell (typically the
 * column's resize handle).
 *
 * Infinite scrolling note: only cells present in the DOM are measured, so the
 * column auto-fits to what is currently loaded/on screen.
 */
export default function useAutoColumnWidth({
  columnId,
  minWidth,
  maxWidth,
  extraPadding,
  includeHeader,
  maxRowsToMeasure,
  onWidthChange,
}: UseAutoColumnWidthOptions) {
  /** Attach to the resize handle's onDoubleClick to auto-fit the column to its content. */
  const handleAutoFitDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      e.preventDefault();

      const headerCell: HTMLTableCellElement | null = e.currentTarget.closest('th');
      if (!headerCell) {
        return;
      }

      const autoWidth = measureColumnAutoWidth(headerCell, { minWidth, maxWidth, extraPadding, includeHeader, maxRowsToMeasure });
      if (autoWidth === null) {
        return;
      }

      onWidthChange(columnId, autoWidth);
    },
    [columnId, minWidth, maxWidth, extraPadding, includeHeader, maxRowsToMeasure, onWidthChange],
  );

  return {
    /** Double-click handler to attach to the column's resize handle element. */
    handleAutoFitDoubleClick,
  };
}
