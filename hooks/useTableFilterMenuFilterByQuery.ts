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

  const setFilterValueWithOptions = (value: string) => {
    const trimmed = value.trim();
    setFilterValue(trimmed || null, {
      // Send immediate update if resetting, otherwise debounce at 500ms
      limitUrlUpdates: trimmed === '' ? undefined : debounce(500),
    });
  };

  return {
    filterValue,
    setFilterValueWithOptions,
  };
}
