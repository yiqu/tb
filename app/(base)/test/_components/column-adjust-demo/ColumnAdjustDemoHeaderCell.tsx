'use client';

import { useState } from 'react';
import { EllipsisVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import RowStack from '@/shared/components/RowStack';
import useColumnResize from '@/hooks/useColumnResize';
import Typography from '@/components/typography/Typography';
import FormattedTableHead from '@/shared/table/FormattedTableHead';
import FormattedTableHeadDragHandle from '@/shared/table/FormattedTableHeadDragHandle';
import FormattedTableHeadResizeHandle from '@/shared/table/FormattedTableHeadResizeHandle';
import FormattedTableHeadMenuDisplayOption from '@/shared/table/FormattedTableHeadMenuDisplayOption';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/custom/dropdown-menu';
import { TableColumnOrderingSource } from '@/store/table-columns-adjust/table-column-adjuster.types';
import { TestTableColumnId, TEST_TABLE_COLUMN_LABELS } from '@/store/test-table/test-table.columns';
import { useTestTableColumnWidth, useTestTableColumnsActions } from '@/store/test-table/test-table.store';

import type { DraggableProvidedDraggableProps, DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

interface Props {
  columnId: TestTableColumnId;
  index: number;
  ordering: TableColumnOrderingSource;
  ref?: React.Ref<HTMLTableCellElement>;
  draggableProps?: DraggableProvidedDraggableProps;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  isDragging?: boolean;
}

/**
 * Header cell for the demo table.
 *
 * Everything here is shared app furniture — the head cell, drag handle, resize hook/handle and the
 * show/hide menu section. The only table specific wiring is this table's own store: widths come
 * from it, and its ordering source is handed to the menu.
 */
export default function ColumnAdjustDemoHeaderCell({
  columnId,
  index,
  ordering,
  ref,
  draggableProps,
  dragHandleProps,
  isDragging,
}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const columnWidth = useTestTableColumnWidth(columnId);
  const { setColumnWidth } = useTestTableColumnsActions();
  const { currentWidth, isResizing, handleResizePointerDown, handleResizeDoubleClick } = useColumnResize({
    columnId,
    initialWidth: columnWidth,
    minWidth: 80,
    maxWidth: 600,
    onWidthChange: setColumnWidth,
  });

  return (
    <FormattedTableHead
      ref={ ref }
      draggableProps={ draggableProps }
      currentWidth={ currentWidth }
      isDragging={ isDragging }
      index={ index }
      isResizing={ isResizing }
    >
      <RowStack className="items-center justify-start select-none">
        <FormattedTableHeadDragHandle dragHandleProps={ dragHandleProps } />
        <Typography variant="body1" className="truncate">
          { TEST_TABLE_COLUMN_LABELS[columnId] }
        </Typography>

        <DropdownMenu open={ isMenuOpen } onOpenChange={ setIsMenuOpen }>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Column actions" className="ml-auto size-6 shrink-0 rounded-md">
              <EllipsisVertical className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <FormattedTableHeadMenuDisplayOption
              onAction={ () => setIsMenuOpen(false) }
              tableId="test"
              columnId={ columnId }
              columnLabels={ TEST_TABLE_COLUMN_LABELS }
              ordering={ ordering }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </RowStack>

      <FormattedTableHeadResizeHandle
        handleResizePointerDown={ handleResizePointerDown }
        handleResizeDoubleClick={ handleResizeDoubleClick }
        isResizing={ isResizing }
      />
    </FormattedTableHead>
  );
}
