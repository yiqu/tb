import { parseAsString, useQueryState, useQueryStates } from 'nuqs';

import { BILLS_TABLE_COLUMNS } from '@/store/subscriptions/table.store';
import { getTableFilterByParamKeys } from '@/shared/table-filter-by/table-filter-by.utils';

/** Search params every filterable column of the bills table writes to. */
const BILLS_TABLE_FILTER_PARAM_KEYS: string[] = getTableFilterByParamKeys('bills', BILLS_TABLE_COLUMNS);

const billsFilterParamsConfig = Object.fromEntries(BILLS_TABLE_FILTER_PARAM_KEYS.map((key) => [key, parseAsString]));

export default function useDashboardRangeSelect() {
  const [monthDueBillsNavigation, setMonthDueBillsNavigation] = useQueryState('selectedMonthYear', {
    history: 'push',
    scroll: true,
    shallow: false,
  });

  const [, setBillsFilterParams] = useQueryStates(billsFilterParamsConfig, { shallow: false });

  const clearSelectedMonthYear = () => {
    setMonthDueBillsNavigation(null);
  };

  const clearBillsTableFilterParams = () => {
    const nullParams = Object.fromEntries(BILLS_TABLE_FILTER_PARAM_KEYS.map((key) => [key, null]));
    setBillsFilterParams(nullParams);
  };

  return {
    selectedMonthYear: monthDueBillsNavigation,
    setMonthDueBillsNavigation,
    clearSelectedMonthYear,
    clearBillsTableFilterParams,
  };
}
