'use client';

import { useQueryState } from 'nuqs';
import { ArrowRightIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { NavigationMonthData } from '@/models/bills/bills.model';

type Props = {
  navigationMonthData: NavigationMonthData;
};

export default function BillsActivityMonthSelectNextButton({ navigationMonthData }: Props) {
  const { nextMonth, nextYear, nextMonthName, isNextMonthTheCurrentMonth } = navigationMonthData;
  const nextMonthYear: string = `${nextMonth}/${nextYear}`;

  const [_monthDueBillsNavigation, setMonthDueBillsNavigation] = useQueryState('selectedMonthYear', {
    history: 'push',
    scroll: true,
    shallow: false,
  });

  const handleOnClickNext = () => {
    if (isNextMonthTheCurrentMonth) {
      setMonthDueBillsNavigation(null);
    } else {
      setMonthDueBillsNavigation(nextMonthYear);
    }
  };

  return (
    <Button variant="secondary" size="default" aria-label="Next month" onClick={ handleOnClickNext } className="min-w-60">
      <ArrowRightIcon /> { nextMonthName ?? 'Next month' }
      <span>{ nextMonthYear }</span>
      { isNextMonthTheCurrentMonth ?
        <span>(Current)</span>
      : null }
    </Button>
  );
}
