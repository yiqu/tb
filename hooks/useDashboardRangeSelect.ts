import { useQueryState } from 'nuqs';

export default function useDashboardRangeSelect() {
  const [monthDueBillsNavigation, setMonthDueBillsNavigation] = useQueryState('selectedMonthYear', {
    history: 'push',
    scroll: true,
    shallow: false,
  });

  const clearParams = () => {
    setMonthDueBillsNavigation(null);
  };

  return {
    selectedMonthYear: monthDueBillsNavigation,
    setMonthDueBillsNavigation,
    clearParams,
  };
}
