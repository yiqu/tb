'use client';

import { useCallback } from 'react';
import { Draggable, Droppable, DragDropContext, type DropResult } from '@hello-pangea/dnd';

import useIsClient from '@/hooks/useIsClient';
import { CardContent } from '@/components/ui/card';
import DisplayCard from '@/shared/components/DisplayCard';
import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/typography/Typography';
import { TestTableColumnId } from '@/store/test-table/test-table.columns';
import { useTestTableColumnOrdering } from '@/store/test-table/test-table.store';
import FormattedTableHeadFiller from '@/shared/table/FormattedTableHeadFiller';
import FormattedTableCellFiller from '@/shared/table/FormattedTableCellFiller';
import useTableColumnReorder from '@/hooks/table-columns-adjust/useTableColumnReorder';
import { Table, TableRow, TableBody, TableCell, TableHeader } from '@/components/ui/table';
import useOrderedVisibleTableColumns from '@/hooks/table-columns-adjust/useOrderedVisibleTableColumns';

import ColumnAdjustDemoHeaderCell from './ColumnAdjustDemoHeaderCell';
import { ColumnAdjustDemoRow, COLUMN_ADJUST_DEMO_ROWS } from './columnAdjustDemo.data';

/**
 * A brand new table wired to the column adjuster, used to check how much a new table actually has
 * to do. The whole wiring is the three lines below: its own ordering source, the visible columns,
 * and the reorder callback. Headers and rows both map over `columnsSorted`, so hiding a column from
 * the header menu removes it from both.
 *
 * See `/store/table-columns-adjust/README.md` for the drop-in recipe.
 */
export default function ColumnAdjustDemoTable() {
  const isClient = useIsClient();
  const ordering = useTestTableColumnOrdering();
  const columnsSorted = useOrderedVisibleTableColumns('test', ordering) as TestTableColumnId[];
  const { reorderVisibleColumns } = useTableColumnReorder('test', ordering);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination || result.source.index === result.destination.index) {
        return;
      }

      const reordered = [...columnsSorted];
      const [moved] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, moved);

      reorderVisibleColumns(reordered);
    },
    [columnsSorted, reorderVisibleColumns],
  );

  return (
    <DisplayCard className="w-full">
      <CardContent className="flex w-full flex-col items-start justify-start gap-y-3 overflow-x-auto">
        <Typography variant="h4">Column adjuster demo</Typography>
        <Typography variant="body1" className="text-muted-foreground">
          Five made up columns backed by their own zustand store. Use a column&apos;s three dot menu to hide it or toggle any column, and
          drag the grip to reorder.
        </Typography>

        { /* Column state lives in local storage, so the table waits for the client. */ }
        { isClient ?
          <DragDropContext onDragEnd={ handleDragEnd }>
            <Table className="table-fixed" id="column-adjust-demo-table" style={ { minWidth: '100%' } }>
              <TableHeader className="bg-muted">
                <Droppable droppableId="column-adjust-demo-columns" direction="horizontal">
                  { (droppableProvided) => (
                    <TableRow ref={ droppableProvided.innerRef } { ...droppableProvided.droppableProps } className="hover:bg-transparent">
                      { columnsSorted.map((columnId: TestTableColumnId, index: number) => (
                        <Draggable key={ columnId } draggableId={ columnId } index={ index }>
                          { (draggableProvided, snapshot) => (
                            <ColumnAdjustDemoHeaderCell
                              ref={ draggableProvided.innerRef }
                              draggableProps={ draggableProvided.draggableProps }
                              dragHandleProps={ draggableProvided.dragHandleProps }
                              isDragging={ snapshot.isDragging }
                              columnId={ columnId }
                              index={ index }
                              ordering={ ordering }
                            />
                          ) }
                        </Draggable>
                      )) }
                      { droppableProvided.placeholder }
                      <FormattedTableHeadFiller />
                    </TableRow>
                  ) }
                </Droppable>
              </TableHeader>
              <TableBody>
                { COLUMN_ADJUST_DEMO_ROWS.map((row: ColumnAdjustDemoRow) => (
                  <TableRow key={ row.id }>
                    { columnsSorted.map((columnId: TestTableColumnId) => (
                      <TableCell key={ columnId } className="truncate">
                        <Typography variant="body1">{ row[columnId] }</Typography>
                      </TableCell>
                    )) }
                    <FormattedTableCellFiller />
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </DragDropContext>
        : <Skeleton className="h-80 w-full" /> }
      </CardContent>
    </DisplayCard>
  );
}
