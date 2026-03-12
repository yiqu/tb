import { debounce, useQueryState } from 'nuqs';

import { parseAsTrimmedString } from '@/nuqs-parsers/string.parser';
import { TableId, AppColumnId } from '@/store/subscriptions/table.store';

export default function useTableFilterMenuFilterByQuery(tableId: TableId, columnId: AppColumnId) {
  const [filterValue, setFilterValue] = useQueryState(
    `${tableId}__${columnId}`,
    parseAsTrimmedString.withDefault('').withOptions({
      shallow: false,
    }),
  );

  const setFilterValueWithOptions = (value: string, options?: { immediate?: boolean }) => {
    const trimmed = value.trim();
    setFilterValue(trimmed || null, {
      limitUrlUpdates: trimmed === '' || options?.immediate ? undefined : debounce(500),
    });
  };

  return {
    filterValue,
    setFilterValueWithOptions,
  };
}
