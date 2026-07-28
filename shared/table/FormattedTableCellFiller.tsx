import { cn } from '@/lib/utils';
import { TableCell } from '@/components/ui/table';

type FormattedTableCellFillerProps = {
  className?: string;
};

/**
 * Zero-content body cell appended after the last data cell of a row, matching
 * the `<FormattedTableHeadFiller />` column in the header so leftover
 * horizontal space is absorbed by an empty column instead of stretching the
 * last data column.
 */
export default function FormattedTableCellFiller({ className }: FormattedTableCellFillerProps) {
  return <TableCell aria-hidden="true" data-table-filler="true" className={ cn(className) } />;
}
