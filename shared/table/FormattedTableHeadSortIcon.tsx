import { ChevronUp, ChevronDown, LoaderCircle, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';

import { SortDirection } from './table.utils';

type FormattedTableHeadSortIconProps = {
  isColumnSorted?: boolean;
  sortable?: boolean;
  isSorted?: boolean;
  sortDirection?: SortDirection;
  isPending?: boolean;
};

export default function FormattedTableHeadSortIcon({
  isColumnSorted,
  sortable,
  sortDirection,
  isPending,
}: FormattedTableHeadSortIconProps) {
  if (isPending) {
    return <LoaderCircle className={ `
      size-3 animate-spin text-gray-500/70
      dark:text-gray-200/30
    ` } />;
  }

  if (isColumnSorted) {
    return (
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
    );
  }

  if (sortable) {
    return <ChevronsUpDown className={ `
      size-4 min-w-4 text-gray-400/60
      dark:text-gray-500/30
    ` } />;
  }

  return null;
}
