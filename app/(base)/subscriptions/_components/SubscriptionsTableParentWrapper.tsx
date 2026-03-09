'use client';

import { useCallback } from 'react';
import { Draggable, Droppable, DragDropContext, type DropResult } from '@hello-pangea/dnd';

import useIsClient from '@/hooks/useIsClient';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { upsertSortData2 } from '@/server/sort-data/sort-data.server';
import FormattedTableHeader from '@/shared/table/FormattedTableHeader';
import { SortDataUpsertable } from '@/models/sort-data/SortData.model';
import { Table, TableRow, TableBody, TableHeader } from '@/components/ui/table';
import { SubscriptionWithBillDues, SubscriptionWithBillDuesAndSortData } from '@/models/subscriptions/subscriptions.model';
import {
  useTotalColumnsWidth,
  useColumnOrdinalObject,
  useTableColumnsActions,
  SUBSCRIPTIONS_TABLE_COLUMNS,
  unsortableSubscriptionsColumns,
} from '@/store/subscriptions/table.store';

import SubscriptionsTableParentRow from './SubscriptionsTableParentRow';
import SubscriptionsTableParentLoading from './SubscriptionsTableParentLoading';

interface Props {
  subscriptions: SubscriptionWithBillDuesAndSortData;
}

export default function SubscriptionsTableParentWrapper({ subscriptions }: Props) {
  const isClient = useIsClient();
  const totalColumnsWidth = useTotalColumnsWidth('subscriptions');
  const columnsOrderedByOrdinal = useColumnOrdinalObject('subscriptions');
  const { reorderSubscriptionsColumns } = useTableColumnsActions();
  const columnsSorted: string[] = [...SUBSCRIPTIONS_TABLE_COLUMNS].toSorted(
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

      reorderSubscriptionsColumns(newOrdinals);
    },
    [columnsSorted, reorderSubscriptionsColumns],
  );

  const handleOnSortUpdate = (sortDataToUpdate: SortDataUpsertable) => {
    upsertSortData2(sortDataToUpdate);
  };

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
                { columnsSorted.map((column: string, index: number, array: string[]) => (
                  <Draggable key={ column } draggableId={ column } index={ index }>
                    { (draggableProvided, snapshot) => (
                      <FormattedTableHeader
                        ref={ draggableProvided.innerRef }
                        draggableProps={ draggableProvided.draggableProps }
                        dragHandleProps={ draggableProvided.dragHandleProps }
                        isDragging={ snapshot.isDragging }
                        columnId={ column }
                        index={ index }
                        length={ array.length }
                        sortData={ subscriptions.sortData }
                        pageId={ SORT_DATA_PAGE_IDS.subscriptions }
                        sortable={ unsortableSubscriptionsColumns[column] ?? true }
                        onSortUpdate={ handleOnSortUpdate }
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
