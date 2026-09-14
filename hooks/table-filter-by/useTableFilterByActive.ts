'use client';

import { useSearchParams } from 'next/navigation';

import { AppColumnId } from '@/store/subscriptions/table.store';
import { getIsColumnFilterable, getTableFilterByParamKey } from '@/shared/table-filter-by/table-filter-by.utils';

/**
 * Whether a column currently has a filter applied, for the badge on its header menu trigger.
 *
 * Reads the committed search param rather than the draft in `useTableFilterByQuery`, so the badge
 * only counts filters the server actually ran.
 *
 * @param columnId - The column the header menu belongs to.
 */
export default function useTableFilterByActive(columnId: AppColumnId) {
  const searchParams = useSearchParams();
  // A column with no "Filter By" item never counts, even if some unrelated search param happens to
  // share its id.
  const isFilterable: boolean = getIsColumnFilterable(columnId);
  const filterValue: string = isFilterable ? (searchParams.get(getTableFilterByParamKey(columnId)) ?? '') : '';
  const hasFilterValue: boolean = !!filterValue.trim();

  return {
    activeCount: hasFilterValue ? 1 : 0,
    hasActive: hasFilterValue,
  };
}
