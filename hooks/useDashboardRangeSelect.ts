import { parseAsString, useQueryState, useQueryStates } from 'nuqs';

import { BILLS_TABLE_FILTER_PARAMS_OPTIONS } from '@/store/subscriptions/table.store';

const billsFilterParamsConfig = Object.fromEntries(BILLS_TABLE_FILTER_PARAMS_OPTIONS.map((key) => [key, parseAsString]));

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
    const nullParams = Object.fromEntries(BILLS_TABLE_FILTER_PARAMS_OPTIONS.map((key) => [key, null]));
    setBillsFilterParams(nullParams);
  };

  return {
    selectedMonthYear: monthDueBillsNavigation,
    setMonthDueBillsNavigation,
    clearSelectedMonthYear,
    clearBillsTableFilterParams,
  };
}
