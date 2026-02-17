'use client';

import { useCallback } from 'react';
import { Draggable, Droppable, DragDropContext, type DropResult } from '@hello-pangea/dnd';

import useIsClient from '@/hooks/useIsClient';
import BillsTableLoading from '@/shared/loading/BillsTableLoading';
import SearchTableHeaderDisplay from '@/shared/table/SearchTableHeaderDisplay';
import { Table, TableRow, TableBody, TableHeader } from '@/components/ui/table';
import { SortDataModel, SortDataPageId } from '@/models/sort-data/SortData.model';
import { BillDueWithSubscription, BillDueWithSubscriptionAndSortData } from '@/models/bills/bills.model';
import {
  BILLS_TABLE_COLUMNS,
  useTotalColumnsWidth,
  unsortableBillsColumns,
  useColumnOrdinalObject,
  useTableColumnsActions,
} from '@/store/subscriptions/table.store';

import BillsTableParentRow from './BillsTableParentRow';

type Props = {
  billDues: BillDueWithSubscriptionAndSortData;
  tableId?: string;
  sortData: SortDataModel | null;
  pageId: SortDataPageId;
  loadingMaskRowCount?: number;
};

export default function BillsTableParentContent({ billDues, tableId, sortData, pageId, loadingMaskRowCount = 6 }: Props) {
  const isClient = useIsClient();
  const totalColumnsWidth = useTotalColumnsWidth('bills');

  const columnsOrderedByOrdinal = useColumnOrdinalObject('bills');
  const { reorderBillsColumns } = useTableColumnsActions();
  const columnsSorted: string[] = [...BILLS_TABLE_COLUMNS].toSorted(
    (a: string, b: string) =>
      (columnsOrderedByOrdinal[a as keyof typeof columnsOrderedByOrdinal] ?? 0) -
      (columnsOrderedByOrdinal[b as keyof typeof columnsOrderedByOrdinal] ?? 0),
  );

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination || result.source.index === result.destination.index) {
        return;
      }

      const reordered = [...columnsSorted];
      const [moved] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, moved);

      const newOrdinals: Record<string, number> = {};
      for (const [i, col] of reordered.entries()) {
        const storeKey = col === 'actions' ? 'tableActions' : col;
        newOrdinals[storeKey] = i;
        if (col === 'actions') {
          newOrdinals['actions'] = i;
        }
      }

      reorderBillsColumns(newOrdinals);
    },
    [columnsSorted, reorderBillsColumns],
  );

  if (!isClient) {
    return <BillsTableLoading rowCount={ loadingMaskRowCount } />;
  }

  return (
    <DragDropContext onDragEnd={ handleDragEnd }>
      <Table className="table-fixed" style={ { width: `${totalColumnsWidth}px`, minWidth: '100%' } } id={ tableId ?? 'bills-table' }>
        <TableHeader className={ `bg-muted` }>
          <Droppable droppableId="table-columns" direction="horizontal">
            { (droppableProvided) => {
              return (
                <TableRow ref={ droppableProvided.innerRef } { ...droppableProvided.droppableProps } className="hover:bg-transparent">
                  { columnsSorted.map((column: string, index: number, array: string[]) => {
                    return (
                      <Draggable key={ column } draggableId={ column } index={ index }>
                        { (draggableProvided, snapshot) => {
                          return (
                            <SearchTableHeaderDisplay
                              ref={ draggableProvided.innerRef }
                              draggableProps={ draggableProvided.draggableProps }
                              dragHandleProps={ draggableProvided.dragHandleProps }
                              isDragging={ snapshot.isDragging }
                              columnId={ column }
                              index={ index }
                              length={ array.length }
                              sortData={ sortData }
                              pageId={ pageId }
                              sortable={ unsortableBillsColumns[column] ?? true }
                            />
                          );
                        } }
                      </Draggable>
                    );
                  }) }

                  { droppableProvided.placeholder }
                </TableRow>
              );
            } }
          </Droppable>
        </TableHeader>
        <TableBody>
          { billDues.billDues.map((billDue: BillDueWithSubscription) => (
            <BillsTableParentRow key={ billDue.id } billDue={ billDue } />
          )) }
        </TableBody>
      </Table>
    </DragDropContext>
  );
}
