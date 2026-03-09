'use client';

import { useOptimistic, useTransition } from 'react';

import { cn } from '@/lib/utils';
import useColumnResize from '@/hooks/useColumnResize';
import Typography from '@/components/typography/Typography';
import { useTableColumn, useTableColumnsActions } from '@/store/subscriptions/table.store';
import { SortDataModel, SortDataPageId, SortDataUpsertable } from '@/models/sort-data/SortData.model';
import {
  SortData,
  SortField,
  SortDirection,
  getSortInfoText,
  getNextSortDirection,
  SEARCH_TABLE_COLUMN_TEXT,
} from '@/shared/table/table.utils';

import type { DraggableProvidedDraggableProps, DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

import RowStack from '../components/RowStack';
import WithTooltip from '../components/WithTooltip';
import FormattedTableHead from './FormattedTableHead';
import FormattedTableHeadSortIcon from './FormattedTableHeadSortIcon';
import FormattedTableHeadDragHandle from './FormattedTableHeadDragHandle';
import FormattedTableHeadResizeHandle from './FormattedTableHeadResizeHandle';

interface FormattedTableHeaderProps {
  columnId: string;
  index: number;
  length: number;
  sortData: SortDataModel | null;
  pageId: SortDataPageId;
  sortable?: boolean;
  ref?: React.Ref<HTMLTableCellElement>;
  draggableProps?: DraggableProvidedDraggableProps;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  isDragging?: boolean;
  onSortUpdate?: (_sortData: SortDataUpsertable) => void;
}

export default function FormattedTableHeader({
  columnId,
  index,
  length,
  sortData,
  pageId,
  sortable,
  ref,
  draggableProps,
  dragHandleProps,
  isDragging,
  onSortUpdate,
}: FormattedTableHeaderProps) {
  const [isPending, startTransition] = useTransition();
  const storeColumnId = columnId === 'actions' ? 'tableActions' : columnId;
  const columnWidth = useTableColumn(storeColumnId);
  const { setColumnWidth } = useTableColumnsActions();
  const { currentWidth, isResizing, handleResizePointerDown } = useColumnResize({
    columnId: storeColumnId,
    initialWidth: columnWidth,
    minWidth: 80,
    maxWidth: 1200,
    onWidthChange: setColumnWidth,
  });

  const currentSortData: SortData = {
    direction: (sortData?.sortDirection as SortDirection) ?? '',
    sort: (sortData?.sortField as SortField) ?? '',
  };

  const [optimisticSortData, upsertOptimisticSortData] = useOptimistic(currentSortData, (state, optimisticValue: SortData) => {
    return {
      ...state,
      ...optimisticValue,
    };
  });

  const nextSortData: SortData = getNextSortDirection(optimisticSortData, columnId as SortField);
  const isColumnSorted: boolean = optimisticSortData.sort === columnId;
  const sortDirection: string | undefined = optimisticSortData.direction;
  const isLastColumn = index === length - 1;
  const columnSortTooltip: string = getSortInfoText(columnId, !!sortable, isColumnSorted, sortDirection as SortDirection, nextSortData);

  const handleOnHeaderClick = (columnId: string) => {
    if (!sortable) {
      return;
    }

    const nextSortData: SortData = getNextSortDirection(optimisticSortData, columnId as SortField);

    startTransition(() => {
      upsertOptimisticSortData(nextSortData);
      const sortDataToUpdate: SortDataUpsertable = {
        id: sortData?.id ?? undefined,
        pageId,
        sortDirection: nextSortData.direction,
        sortField: nextSortData.sort,
      };
      onSortUpdate?.(sortDataToUpdate);
    });
  };

  return (
    <FormattedTableHead
      ref={ ref }
      draggableProps={ draggableProps }
      currentWidth={ currentWidth }
      isDragging={ isDragging }
      index={ index }
      isLastColumn={ isLastColumn }
      isResizing={ isResizing }
    >
      <RowStack className={ cn('flex flex-row items-center justify-start truncate select-none') } id={ `table-header-content-${columnId}` }>
        <FormattedTableHeadDragHandle dragHandleProps={ dragHandleProps } />
        <RowStack
          id={ `table-header-content-display-${columnId}` }
          className={ cn('items-center gap-x-1 truncate', {
            'cursor-pointer rounded-md p-1.5 hover:bg-sidebar-accent/30 dark:hover:bg-sidebar-accent/30': sortable,
          }) }
        >
          <WithTooltip tooltip={ columnSortTooltip }>
            <Typography
              variant="body1"
              className={ cn('truncate', {
                'font-bold': isColumnSorted,
                'font-normal': !isColumnSorted,
              }) }
              onClick={ handleOnHeaderClick.bind(null, columnId) }
            >
              { SEARCH_TABLE_COLUMN_TEXT[columnId] ?? columnId }
            </Typography>
          </WithTooltip>

          <FormattedTableHeadSortIcon
            isColumnSorted={ isColumnSorted }
            sortable={ sortable }
            sortDirection={ sortDirection as SortDirection }
            isPending={ isPending }
          />
        </RowStack>
      </RowStack>
      <FormattedTableHeadResizeHandle
        handleResizePointerDown={ handleResizePointerDown }
        isResizing={ isResizing }
        isLastColumn={ isLastColumn }
      />
    </FormattedTableHead>
  );
}
