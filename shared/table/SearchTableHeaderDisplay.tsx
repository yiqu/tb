'use client';

import { parseAsString, useQueryStates } from 'nuqs';
/* eslint-disable better-tailwindcss/multiline */
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { TableHead } from '@/components/ui/table';
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
}

export default function SearchTableHeaderDisplay({ columnId, index, length }: SearchTableHeaderDisplayProps) {
  const [sortData, setSortData] = useQueryStates(
    {
      sort: parseAsString.withDefault(''),
      direction: parseAsString.withDefault(''),
    },
    {
      history: 'push',
    },
  );

  const isColumnSorted: boolean = sortData.sort === columnId;
  const sortDirection: SortDirection = sortData.direction as SortDirection;

  const handleOnHeaderClick = (columnId: string) => {
    const currentSortData = sortData;
    const nextSortData = getNextSortDirection(currentSortData as SortData, columnId as SortField);
    setSortData({
      sort: nextSortData.sort,
      direction: nextSortData.direction,
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
        { SEARCH_TABLE_COLUMN_TEXT[columnId] }
        { isColumnSorted ?
          <>
            { sortDirection === 'asc' ?
              <ChevronUp className="size-4" />
            : <ChevronDown className="size-4" /> }
          </>
        : <ChevronsUpDown className="text-lighter-more size-4" /> }
      </span>
    </TableHead>
  );
}
