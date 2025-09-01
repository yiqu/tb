'use client';

import { useOptimistic, useTransition } from 'react';
/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
import { ChevronUp, ChevronDown, LoaderCircle, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { TableHead } from '@/components/ui/table';
import Typography from '@/components/typography/Typography';
import { upsertSortData2 } from '@/server/sort-data/sort-data.server';
import { SortDataModel, SortDataPageId, SortDataUpsertable } from '@/models/sort-data/SortData.model';
import {
  SortData,
  SortField,
  SortDirection,
  getNextSortDirection,
  SEARCH_TABLE_COLUMN_TEXT,
  SEARCH_TABLE_COLUMN_WIDTH,
} from '@/shared/table/table.utils';

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
    upsertOptimisticSortData(nextSortData);
    startTransition(() => {
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
      className={ cn('truncate', {
        'rounded-tl-md': index === 0,
        'rounded-tr-md': index === length - 1,
        'cursor-pointer hover:bg-sidebar-accent/30 dark:hover:bg-sidebar-accent/30': sortable,
      }) }
      style={ {
        width: SEARCH_TABLE_COLUMN_WIDTH[columnId],
      } }
      onClick={ handleOnHeaderClick.bind(null, columnId) }
    >
      <span className="flex flex-row items-center justify-between gap-x-2 truncate select-none">
        <Typography
          variant="body1"
          className={ cn('truncate', {
            'font-bold': isColumnSorted,
            'font-normal': !isColumnSorted,
          }) }
          title={ SEARCH_TABLE_COLUMN_TEXT[columnId] ?? columnId }
        >
          { SEARCH_TABLE_COLUMN_TEXT[columnId] ?? columnId }
        </Typography>
        <div className="flex flex-row items-center justify-end gap-x-1">
          { isPending ?
            <LoaderCircle className="size-3 animate-spin text-gray-500/70 dark:text-gray-200/30" />
          : null }
          { isColumnSorted ?
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
            <ChevronsUpDown className="size-4 min-w-4 text-gray-400/60 dark:text-gray-500/30" />
          : null }
        </div>
      </span>
    </TableHead>
  );
}
