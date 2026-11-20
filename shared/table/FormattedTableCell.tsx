import { cn } from '@/lib/utils';
import { TableCell } from '@/components/ui/table';

import { TABLE_VERTICAL_BORDER_OFF_CLASSES } from './table-border.utils';

type FormattedTableCellProps = React.ComponentProps<typeof TableCell> & {
  isSticky?: boolean;
};

export default function FormattedTableCell({ isSticky, className, ...props }: FormattedTableCellProps) {
  return (
    <TableCell
      // A cell directly followed by the filler column (or the row's last cell) drops its right
      // border so no stray line runs down the body of the table.
      className={ cn(
        '[&:has(+[data-table-filler])]:border-r-0 last:border-r-0',
        className,
        {
          'sticky left-0 z-10 bg-card after:pointer-events-none after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-border':
            isSticky,
          'border-r border-border': !isSticky,
        },
        TABLE_VERTICAL_BORDER_OFF_CLASSES,
      ) }
      { ...props }
    />
  );
}
