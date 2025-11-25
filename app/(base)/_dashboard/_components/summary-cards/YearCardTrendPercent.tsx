import { Minus, TrendingUp, TrendingDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import WithTooltip from '@/shared/components/WithTooltip';
import Typography from '@/components/typography/Typography';
import { getUSDFormatter, getPercentFormatter } from '@/lib/number.utils';
import { getAllBillsByYearFromParamsCached } from '@/server/bills/bills.server';
import { BillDueWithSubscriptionByMonthAndYear } from '@/models/bills/bills.model';

import { getPercentIncreasedByPreviousMonth } from '../dashboard.utils';

const percentFormatter = getPercentFormatter();
const usdFormatter = getUSDFormatter();

type Props = {
  currentYearData: BillDueWithSubscriptionByMonthAndYear;
  selectedMonthYear: string | undefined;
};

export default async function YearCardTrendPercent({ selectedMonthYear, currentYearData }: Props) {
  const previousYearData: BillDueWithSubscriptionByMonthAndYear = await getAllBillsByYearFromParamsCached(selectedMonthYear, -1);
  const percentIncreased: number = getPercentIncreasedByPreviousMonth(currentYearData, previousYearData);

  return (
    <WithTooltip tooltip={ `Last year's total cost: ${usdFormatter.format(previousYearData.totalBillsCost)}` }>
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
    </WithTooltip>
  );
}
