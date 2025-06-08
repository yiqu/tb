'use client';

import { useOptimistic, useTransition } from 'react';
/* eslint-disable better-tailwindcss/multiline */
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { TableHead } from '@/components/ui/table';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
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
      className={ cn('cursor-pointer hover:bg-sidebar dark:hover:bg-secondary', {
        [`w-[${SEARCH_TABLE_COLUMN_WIDTH[columnId]}]`]: !!SEARCH_TABLE_COLUMN_WIDTH[columnId],
        'rounded-tl-lg': index === 0,
        'rounded-tr-lg': index === length - 1,
      }) }
      onClick={ handleOnHeaderClick.bind(null, columnId) }
    >
      <span className="flex flex-row items-center justify-between gap-x-2 select-none">
        { SEARCH_TABLE_COLUMN_TEXT[columnId] ?? columnId }
        { isColumnSorted ?
          <>
            { sortDirection === 'asc' ?
              <ChevronUp
                className={ cn('size-4', {
                  'opacity-30': isPending,
                }) }
              />
            : <ChevronDown
                className={ cn('size-4', {
                  'opacity-30': isPending,
                }) }
              />
            }
          </>
        : <ChevronsUpDown className="text-lighter-more size-4" /> }
      </span>
    </TableHead>
  );
}
