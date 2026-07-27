/**
 * DOM measurement utilities for auto-sizing a table column to fit its content.
 *
 * Portable by design: these helpers only rely on standard DOM APIs and the
 * native `<table>` structure (`th.cellIndex` + `row.cells[index]`), so they are
 * not tied to any specific dataset, store, or component library. Copy this
 * folder into another project and it will work with any `<table>`-based grid.
 *
 * How the measurement works:
 * 1. Starting from the column's header cell (`<th>`), find the owning `<table>`
 *    and collect every currently rendered body cell in the same column position.
 *    Only cells present in the DOM are measured — for paged or infinite-scroll
 *    tables this naturally means "what is currently loaded".
 * 2. Clone each cell into an off-screen, single-column measurement table with
 *    `table-layout: auto` and `white-space: nowrap` forced on, so every clone
 *    renders at its intrinsic (un-truncated, un-wrapped) content width.
 * 3. The measurement table's rendered width is the widest cell's content width
 *    (padding included, since the cells themselves are cloned).
 * 4. Clean up the off-screen container and return the clamped result.
 */

export interface MeasureColumnAutoWidthOptions {
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
}

const DEFAULT_MIN_WIDTH = 80;
const DEFAULT_MAX_WIDTH = 1200;
const DEFAULT_EXTRA_PADDING = 16;
const DEFAULT_MAX_ROWS_TO_MEASURE = 200;

/** Collects the header cell (optionally) and every rendered body cell occupying the same column position. */
function collectColumnCells(headerCell: HTMLTableCellElement, includeHeader: boolean, maxRowsToMeasure: number): HTMLTableCellElement[] {
  const table: HTMLTableElement | null = headerCell.closest('table');

  if (!table) {
    return [];
  }

  const columnIndex = headerCell.cellIndex;
  const cells: HTMLTableCellElement[] = [];

  if (includeHeader) {
    cells.push(headerCell);
  }

  let measuredRows = 0;
  for (const tBody of table.tBodies) {
    for (const row of tBody.rows) {
      if (measuredRows >= maxRowsToMeasure) {
        return cells;
      }

      const cell: HTMLTableCellElement | undefined = row.cells[columnIndex];
      if (cell) {
        cells.push(cell);
        measuredRows++;
      }
    }
  }

  return cells;
}

/**
 * Builds a hidden, off-screen single-column table used to render cell clones at
 * their natural content width. Font styles are copied from the source table so
 * text measures identically even if `document.body` styles differ.
 */
function createMeasurementContainer(sourceTable: HTMLTableElement): { container: HTMLDivElement; tbody: HTMLTableSectionElement; table: HTMLTableElement } {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.left = '-99999px';
  container.style.visibility = 'hidden';
  container.style.pointerEvents = 'none';
  container.style.width = 'max-content';
  container.setAttribute('aria-hidden', 'true');

  const table = document.createElement('table');
  const sourceStyle = window.getComputedStyle(sourceTable);
  table.style.tableLayout = 'auto';
  table.style.width = 'auto';
  table.style.borderCollapse = sourceStyle.borderCollapse;
  table.style.fontFamily = sourceStyle.fontFamily;
  table.style.fontSize = sourceStyle.fontSize;
  table.style.lineHeight = sourceStyle.lineHeight;

  const tbody = document.createElement('tbody');
  table.appendChild(tbody);
  container.appendChild(table);

  return { container, tbody, table };
}

/**
 * Clones a cell into its own measurement row, neutralizing anything that would
 * hide the content's true width (fixed widths, truncation, wrapping, ids).
 */
function appendCellCloneForMeasurement(tbody: HTMLTableSectionElement, cell: HTMLTableCellElement): void {
  const row = document.createElement('tr');
  const clone = cell.cloneNode(true) as HTMLTableCellElement;

  clone.style.width = 'auto';
  clone.style.minWidth = '0';
  clone.style.maxWidth = 'none';
  clone.style.position = 'static';
  clone.style.whiteSpace = 'nowrap';
  clone.removeAttribute('id');

  // Force single-line rendering on descendants so truncated/wrapped text
  // contributes its full width, and strip duplicate ids from the document.
  for (const descendant of clone.querySelectorAll<HTMLElement>('*')) {
    descendant.style.whiteSpace = 'nowrap';
    descendant.removeAttribute('id');
  }

  row.appendChild(clone);
  tbody.appendChild(row);
}

/**
 * Measures the width (px) a column needs to fully display the content of its
 * currently rendered cells, clamped to the provided min/max.
 *
 * @param headerCell - The column's `<th>` element (e.g. resolved from a resize handle via `closest('th')`).
 * @returns The clamped ideal width, or `null` when measurement is impossible
 *          (detached header cell / no owning table / nothing to measure).
 */
export function measureColumnAutoWidth(headerCell: HTMLTableCellElement, options: MeasureColumnAutoWidthOptions = {}): number | null {
  const {
    minWidth = DEFAULT_MIN_WIDTH,
    maxWidth = DEFAULT_MAX_WIDTH,
    extraPadding = DEFAULT_EXTRA_PADDING,
    includeHeader = true,
    maxRowsToMeasure = DEFAULT_MAX_ROWS_TO_MEASURE,
  } = options;

  const sourceTable: HTMLTableElement | null = headerCell.closest('table');
  const cells = collectColumnCells(headerCell, includeHeader, maxRowsToMeasure);

  if (!sourceTable || cells.length === 0) {
    return null;
  }

  const { container, tbody, table } = createMeasurementContainer(sourceTable);

  try {
    for (const cell of cells) {
      appendCellCloneForMeasurement(tbody, cell);
    }

    document.body.appendChild(container);
    const measuredWidth = Math.ceil(table.getBoundingClientRect().width);

    return Math.min(maxWidth, Math.max(minWidth, measuredWidth + extraPadding));
  } finally {
    container.remove();
  }
}
