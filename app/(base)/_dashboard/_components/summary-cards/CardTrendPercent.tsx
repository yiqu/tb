import { Minus, TrendingUp, TrendingDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { getPercentFormatter } from '@/lib/number.utils';
import Typography from '@/components/typography/Typography';
import { BillDueWithSubscriptionByMonthAndYear } from '@/models/bills/bills.model';
import { getAllBillsByMonthAndYearParamsCached } from '@/server/bills/bills.server';

import { getPercentIncreasedByPreviousMonth } from '../dashboard.utils';

const percentFormatter = getPercentFormatter();

type Props = {
  currentMonthData: BillDueWithSubscriptionByMonthAndYear;
  selectedMonthYear: string | undefined;
};

export default async function CardTrendPercent({ selectedMonthYear, currentMonthData }: Props) {
  const previousMonthData: BillDueWithSubscriptionByMonthAndYear = await getAllBillsByMonthAndYearParamsCached(selectedMonthYear, -1);
  const percentIncreased: number = getPercentIncreasedByPreviousMonth(currentMonthData, previousMonthData);

  return (
    <Badge variant="outline">
      { percentIncreased > 0 ?
        <TrendingUp className={ `
          text-green-700
          dark:text-green-500
        ` } />
      : percentIncreased < 0 ?
        <TrendingDown className={ `
          text-red-700
          dark:text-red-500
        ` } />
      : <Minus /> }
      <Typography variant="body0" className="tracking-wide tabular-nums">
        { percentFormatter.format(percentIncreased) }
      </Typography>
    </Badge>
  );
}
