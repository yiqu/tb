import { cn } from '@/lib/utils';
import { TableCell } from '@/components/ui/table';

type FormattedTableCellProps = React.ComponentProps<typeof TableCell> & {
  isSticky?: boolean;
  showVerticalBorder?: boolean;
};

export default function FormattedTableCell({ isSticky, showVerticalBorder, className, ...props }: FormattedTableCellProps) {
  return (
    <TableCell
      className={ cn(className, {
        'sticky left-0 z-10 bg-card after:pointer-events-none after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-border':
          isSticky,
        'border-r border-border': showVerticalBorder && !isSticky,
      }) }
      { ...props }
    />
  );
}
