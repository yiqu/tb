import { useSearchParams } from 'next/navigation';

import { TableId, AppColumnId } from '@/store/subscriptions/table.store';

export default function useTableFilterMenuActive(tableId: TableId, columnId: AppColumnId) {
  const searchParams = useSearchParams();
  const filterValue = searchParams.get(`${tableId}__${columnId}`) ?? '';
  const hasFilterValue = !!filterValue.trim();

  const hasActive = hasFilterValue;
  const activeCount = 0 + (hasFilterValue ? 1 : 0);

  return {
    activeCount,
    hasActive,
  };
}
