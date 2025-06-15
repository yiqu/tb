'use client';

import { useOptimistic, useTransition } from 'react';
/* eslint-disable better-tailwindcss/multiline */
import { ChevronUp, ChevronDown, LoaderCircle, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { TableHead } from '@/components/ui/table';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import Typography from '@/components/typography/Typography';
import { upsertSortData2 } from '@/server/sort-data/sort-data.server';
import { SortDataModel, SortDataUpsertable } from '@/models/sort-data/SortData.model';
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
}

export default function SearchTableHeaderDisplay({ columnId, index, length, sortData }: SearchTableHeaderDisplayProps) {
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
    const nextSortData: SortData = getNextSortDirection(optimisticSortData, columnId as SortField);
    startTransition(() => {
      upsertOptimisticSortData(nextSortData);
      const sortDataToUpdate: SortDataUpsertable = {
        id: sortData?.id ?? undefined,
        pageId: SORT_DATA_PAGE_IDS.search,
        sortDirection: nextSortData.direction,
        sortField: nextSortData.sort,
      };
      upsertSortData2(sortDataToUpdate);
    });
  };

  return (
    <TableHead
      className={ cn('cursor-pointer truncate hover:bg-sidebar dark:hover:bg-secondary', {
        'rounded-tl-lg': index === 0,
        'rounded-tr-lg': index === length - 1,
      }) }
      style={ {
        width: SEARCH_TABLE_COLUMN_WIDTH[columnId],
        //maxWidth: SEARCH_TABLE_COLUMN_WIDTH[columnId],
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
        >
          { SEARCH_TABLE_COLUMN_TEXT[columnId] ?? columnId }
        </Typography>
        <div className="flex flex-row items-center justify-end gap-x-1">
          { isPending ?
            <LoaderCircle className="size-3 animate-spin text-gray-300 dark:text-gray-600" />
          : null }
          { isColumnSorted ?
            <>
              { sortDirection === 'asc' ?
                <ChevronUp
                  className={ cn('size-4', {
                    'text-yellow-700': isPending,
                  }) }
                />
              : <ChevronDown
                  className={ cn('size-4', {
                    'text-yellow-700': isPending,
                  }) }
                />
              }
            </>
          : <ChevronsUpDown className="size-4 min-w-4 text-gray-200" /> }
        </div>
      </span>
    </TableHead>
  );
}
