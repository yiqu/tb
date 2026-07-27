import { cn } from '@/lib/utils';
import { TableHead } from '@/components/ui/table';

type FormattedTableHeadFillerProps = {
  className?: string;
};

/**
 * Zero-content header cell appended after the last data column.
 *
 * Under `table-fixed` it carries no width, so it absorbs whatever horizontal
 * space is left when the table is stretched to fill its container
 * (`minWidth: 100%`). This keeps every data column — including the last one —
 * at its stored px width instead of the last column stretching to fill the
 * section. When the columns overflow and the table scrolls horizontally, the
 * filler collapses to zero width.
 *
 * Pair with `<FormattedTableCellFiller />` appended to each body row so the
 * column structure matches between header and body.
 */
export default function FormattedTableHeadFiller({ className }: FormattedTableHeadFillerProps) {
  return <TableHead aria-hidden="true" className={ cn('rounded-tr-md', className) } />;
}
