'use client';

import { useCallback } from 'react';
import { Draggable, Droppable, DragDropContext, type DropResult } from '@hello-pangea/dnd';

import useIsClient from '@/hooks/useIsClient';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import SearchTableHeaderDisplay from '@/shared/table/SearchTableHeaderDisplay';
import { Table, TableRow, TableBody, TableHeader } from '@/components/ui/table';
import { SearchTableColumn, SUBSCRIPTIONS_TABLE_COLUMN_IDS } from '@/shared/table/table.utils';
import { useTotalColumnsWidth, useColumnOrdinalObject, useTableColumnsActions } from '@/store/subscriptions/table.store';
import { SubscriptionWithBillDues, SubscriptionWithBillDuesAndSortData } from '@/models/subscriptions/subscriptions.model';

import SubscriptionsTableParentRow from './SubscriptionsTableParentRow';
import SubscriptionsTableParentLoading from './SubscriptionsTableParentLoading';

interface Props {
  subscriptions: SubscriptionWithBillDuesAndSortData;
}

export default function SubscriptionsTableParentWrapper({ subscriptions }: Props) {
  const isClient = useIsClient();
  const totalColumnsWidth = useTotalColumnsWidth();
  const columnsOrderedByOrdinal = useColumnOrdinalObject();
  const { reorderColumns } = useTableColumnsActions();
  const columnsSorted: SearchTableColumn[] = [...SUBSCRIPTIONS_TABLE_COLUMN_IDS].toSorted(
    (a, b) =>
      (columnsOrderedByOrdinal[a.headerId as keyof typeof columnsOrderedByOrdinal] ?? 0) -
      (columnsOrderedByOrdinal[b.headerId as keyof typeof columnsOrderedByOrdinal] ?? 0),
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
        const storeKey = col.headerId === 'actions' ? 'tableActions' : col.headerId;
        newOrdinals[storeKey] = i;
        if (col.headerId === 'actions') {
          newOrdinals['actions'] = i;
        }
      }

      reorderColumns(newOrdinals);
    },
    [columnsSorted, reorderColumns],
  );

  if (!isClient) {
    return <SubscriptionsTableParentLoading />;
  }

  return (
    <DragDropContext onDragEnd={ handleDragEnd }>
      <Table className="table-fixed" style={ { width: `${totalColumnsWidth}px`, minWidth: '100%' } }>
        <TableHeader className={ `bg-muted` }>
          <Droppable droppableId="table-columns" direction="horizontal">
            { (droppableProvided) => (
              <TableRow ref={ droppableProvided.innerRef } { ...droppableProvided.droppableProps } className="hover:bg-transparent">
                { columnsSorted.map((column: SearchTableColumn, index: number, array: SearchTableColumn[]) => (
                  <Draggable key={ column.headerId } draggableId={ column.headerId } index={ index }>
                    { (draggableProvided, snapshot) => (
                      <SearchTableHeaderDisplay
                        ref={ draggableProvided.innerRef }
                        draggableProps={ draggableProvided.draggableProps }
                        dragHandleProps={ draggableProvided.dragHandleProps }
                        isDragging={ snapshot.isDragging }
                        columnId={ column.headerId }
                        index={ index }
                        length={ array.length }
                        sortData={ subscriptions.sortData }
                        pageId={ SORT_DATA_PAGE_IDS.subscriptions }
                        sortable={ column.sortable ?? false }
                      />
                    ) }
                  </Draggable>
                )) }
                { droppableProvided.placeholder }
              </TableRow>
            ) }
          </Droppable>
        </TableHeader>
        <TableBody>
          { subscriptions.subscriptions.map((subscription: SubscriptionWithBillDues) => (
            <SubscriptionsTableParentRow key={ subscription.id } subscription={ subscription } />
          )) }
        </TableBody>
      </Table>
    </DragDropContext>
  );
}
