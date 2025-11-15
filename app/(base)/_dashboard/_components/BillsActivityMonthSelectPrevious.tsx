'use client';

import { useQueryState } from 'nuqs';
import { ArrowLeftIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { NavigationMonthData } from '@/models/bills/bills.model';

type Props = {
  navigationMonthData: NavigationMonthData;
};

export default function BillsActivityMonthSelectPreviousButton({ navigationMonthData }: Props) {
  const { previousMonth, previousYear, previousMonthName, isPreviousMonthTheCurrentMonth } = navigationMonthData;
  const previousMonthYear: string = `${previousMonth}/${previousYear}`;

  const [_monthDueBillsNavigation, setMonthDueBillsNavigation] = useQueryState('selectedMonthYear', {
    history: 'push',
    scroll: true,
    shallow: false,
  });

  const handleOnClickPrevious = () => {
    if (isPreviousMonthTheCurrentMonth) {
      setMonthDueBillsNavigation(null);
    } else {
      setMonthDueBillsNavigation(previousMonthYear);
    }
  };

  return (
    <Button variant="secondary" size="default" aria-label="Previous month" onClick={ handleOnClickPrevious } className="min-w-60">
      <ArrowLeftIcon />
      { previousMonthName ?? 'Previous month' }
      <span>{ previousMonthYear }</span>
      { isPreviousMonthTheCurrentMonth ?
        <span>(Current)</span>
      : null }
    </Button>
  );
}
