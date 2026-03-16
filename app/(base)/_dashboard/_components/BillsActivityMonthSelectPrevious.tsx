'use client';

import { ArrowLeftIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import MonthImage from '@/components/month/MonthImage';
import { NavigationMonthData } from '@/models/bills/bills.model';
import useDashboardRangeSelect from '@/hooks/useDashboardRangeSelect';

type Props = {
  navigationMonthData: NavigationMonthData;
};

export default function BillsActivityMonthSelectPreviousButton({ navigationMonthData }: Props) {
  const { previousMonth, previousYear, previousMonthName, isPreviousMonthTheCurrentMonth } = navigationMonthData;
  const previousMonthYear: string = `${previousMonth}/${previousYear}`;

  const { setMonthDueBillsNavigation, clearParams } = useDashboardRangeSelect();

  const handleOnClickPrevious = () => {
    if (isPreviousMonthTheCurrentMonth) {
      clearParams();
    } else {
      setMonthDueBillsNavigation(previousMonthYear);
    }
  };

  return (
    <Button variant="secondary" size="default" aria-label="Previous month" onClick={ handleOnClickPrevious } className="min-w-60">
      <ArrowLeftIcon />
      <MonthImage month={ previousMonth.toString() } height={ 18 } />
      { previousMonthName ?? 'Previous month' }
      <span>{ previousMonthYear }</span>
      { isPreviousMonthTheCurrentMonth ?
        <span>(Current)</span>
      : null }
    </Button>
  );
}
