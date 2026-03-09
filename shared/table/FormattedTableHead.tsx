'use client';

import { cn } from '@/lib/utils';
import { TableHead } from '@/components/ui/table';

import type { DraggableProvidedDraggableProps } from '@hello-pangea/dnd';

type FormattedTableHeadProps = {
  ref?: React.Ref<HTMLTableCellElement>;
  draggableProps?: DraggableProvidedDraggableProps;
  isDragging?: boolean;
  index: number;
  isLastColumn: boolean;
  isResizing: boolean;
  currentWidth: number;
  children: React.ReactNode;
};

export default function FormattedTableHead({
  ref,
  draggableProps,
  isDragging,
  index,
  isLastColumn,
  isResizing,
  currentWidth,
  children,
}: FormattedTableHeadProps) {
  return (
    <TableHead
      ref={ ref }
      { ...draggableProps }
      className={ cn('relative truncate', {
        'sticky left-0 z-20 rounded-tl-md bg-muted after:pointer-events-none after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-foreground/20':
          index === 0,
        'rounded-tr-md': isLastColumn,
        'border-r border-foreground/30': !isLastColumn && index !== 0,
        'bg-accent': isResizing,
        'bg-accent shadow-md': isDragging,
      }) }
      style={ {
        width: isLastColumn ? '100%' : `${currentWidth}px`,
        ...draggableProps?.style,
      } }
    >
      { children }
    </TableHead>
  );
}
