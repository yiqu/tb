'use client';

import { useOptimistic, useTransition } from 'react';
import { ChevronUp, ChevronDown, LoaderCircle, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { TableHead } from '@/components/ui/table';
import useColumnResize from '@/hooks/useColumnResize';
import Typography from '@/components/typography/Typography';
import { upsertSortData2 } from '@/server/sort-data/sort-data.server';
import { useTableColumn, useTableColumnsActions } from '@/store/subscriptions/table.store';
import { SortDataModel, SortDataPageId, SortDataUpsertable } from '@/models/sort-data/SortData.model';
import { SortData, SortField, SortDirection, getNextSortDirection, SEARCH_TABLE_COLUMN_TEXT } from '@/shared/table/table.utils';

import RowStack from '../components/RowStack';
import WithTooltip from '../components/WithTooltip';

interface SearchTableHeaderDisplayProps {
  columnId: string;
  index: number;
  length: number;
  sortData: SortDataModel | null;
  pageId: SortDataPageId;
  sortable?: boolean;
}

export default function SearchTableHeaderDisplay({ columnId, index, length, sortData, pageId, sortable }: SearchTableHeaderDisplayProps) {
  const [isPending, startTransition] = useTransition();
  const storeColumnId = columnId === 'actions' ? 'tableActions' : columnId;
  const columnWidth = useTableColumn(storeColumnId);
  const { setColumnWidth } = useTableColumnsActions();
  const isLastColumn = index === length - 1;

  const { currentWidth, isResizing, handleResizePointerDown } = useColumnResize({
    columnId: storeColumnId,
    initialWidth: columnWidth,
    minWidth: 120,
    maxWidth: 800,
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

  const isColumnSorted: boolean = optimisticSortData.sort === columnId;
  const sortDirection: string | undefined = optimisticSortData.direction;

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
      upsertSortData2(sortDataToUpdate);
    });
  };

  return (
    <TableHead
      className={ cn('relative truncate', {
        'rounded-tl-md': index === 0,
        'rounded-tr-md': isLastColumn,
        'border-l border-border': index !== 0,
        'bg-accent': isResizing,
      }) }
      style={ {
        width: `${currentWidth}px`,
      } }
      // onClick={ handleOnHeaderClick.bind(null, columnId) }
    >
      <RowStack className={ cn('flex flex-row items-center justify-start truncate select-none') }>
        <Typography
          variant="body1"
          className={ cn('flex flex-row items-center justify-between gap-x-1 truncate', {
            'font-bold': isColumnSorted,
            'font-normal': !isColumnSorted,
            'cursor-pointer rounded-md p-1.5 hover:bg-sidebar-accent/30 dark:hover:bg-sidebar-accent/30': sortable,
          }) }
          title={ SEARCH_TABLE_COLUMN_TEXT[columnId] ?? columnId }
          onClick={ handleOnHeaderClick.bind(null, columnId) }
        >
          { SEARCH_TABLE_COLUMN_TEXT[columnId] ?? columnId }
        </Typography>

        { isPending ?
          <LoaderCircle className={ `
            size-3 animate-spin text-gray-500/70
            dark:text-gray-200/30
          ` } />
        : isColumnSorted ?
          <>
            { sortDirection === 'asc' ?
              <ChevronUp
                className={ cn('size-4', {
                  'dark:text-gray-200/90': isPending,
                }) }
              />
            : <ChevronDown
                className={ cn('size-4', {
                  'dark:text-gray-200/90': isPending,
                }) }
              />
            }
          </>
        : sortable ?
          <ChevronsUpDown className={ `
            size-4 min-w-4 text-gray-400/60
            dark:text-gray-500/30
          ` } />
        : null }
      </RowStack>
      { !isLastColumn && (
        <WithTooltip tooltip="Resize column">
          <div
            onPointerDown={ handleResizePointerDown }
            className={ cn(`
              absolute top-0 right-0 z-10 h-full w-1 cursor-col-resize
              hover:bg-accent
            `, { 'bg-accent': isResizing }) }
          />
        </WithTooltip>
      ) }
    </TableHead>
  );
}
