import z from 'zod';
import { Minus, TrendingUp, TrendingDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { getPercentFormatter } from '@/lib/number.utils';
import Typography from '@/components/typography/Typography';
import { getAllBillsByMonthAndYearCached } from '@/server/bills/bills.server';
import { BillSearchParams, billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { CurrentMonthDateData, BillDueWithSubscriptionByMonthAndYear } from '@/models/bills/bills.model';

import { getPreviousMonthLuxon, getPercentIncreasedByPreviousMonth } from '../dashboard.utils';

const percentFormatter = getPercentFormatter();

type Props = {
  monthData: CurrentMonthDateData;
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
  currentMonthData: BillDueWithSubscriptionByMonthAndYear;
};

export default async function CardTrendPercent({ monthData, searchParamsPromise, currentMonthData }: Props) {
  let searchParams: BillSearchParams = await searchParamsPromise;
  let monthToFetch = monthData.previousMonth;
  let yearToFetch = monthData.previousMonthYear;

  if (searchParams.selectedMonthYear) {
    const [month, year] = searchParams.selectedMonthYear.split('/');
    const previousMonthLuxon = getPreviousMonthLuxon(Number.parseInt(month), Number.parseInt(year));
    monthToFetch = previousMonthLuxon.month;
    yearToFetch = previousMonthLuxon.year;
  }

  const previousMonthData: BillDueWithSubscriptionByMonthAndYear = await getAllBillsByMonthAndYearCached(
    monthToFetch.toString(),
    yearToFetch.toString(),
  );

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
