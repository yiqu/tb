import z from 'zod';
import { TrendingUp, SquareArrowDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { getUSDFormatter } from '@/lib/number.utils';
import DisplayCard from '@/shared/components/DisplayCard';
import Typography from '@/components/typography/Typography';
import { BillSearchParams, billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { CardTitle, CardAction, CardFooter, CardHeader, CardDescription } from '@/components/ui/card';
import { CurrentMonthDateData, BillDueWithSubscriptionByMonthAndYear } from '@/models/bills/bills.model';
import { getCurrentMonthDateDataCached, getAllBillsByMonthAndYearCached } from '@/server/bills/bills.server';

import { appendMonthAndYearToSearchParams } from '../dashboard.utils';

const usdFormatter = getUSDFormatter();

type Props = {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
};

export default async function TotalDueMonthCard({ searchParamsPromise }: Props) {
  // get the current month and year from server
  const dateData: CurrentMonthDateData = await getCurrentMonthDateDataCached();
  const dateParamsData: BillSearchParams = await dateData.dateSearchParamsPromise;

  // use server month and year if searchParams are not set
  let searchParams: BillSearchParams = await searchParamsPromise;
  searchParams = appendMonthAndYearToSearchParams(searchParams, dateParamsData);

  const currentMonthData: BillDueWithSubscriptionByMonthAndYear = await getAllBillsByMonthAndYearCached(
    searchParams.month,
    searchParams.year,
  );

  console.log(currentMonthData);

  return (
    <DisplayCard className="@container/card">
      <CardHeader>
        <CardDescription>
          <div className="flex flex-row items-center justify-start gap-x-2">
            <SquareArrowDown className="size-5" />
            <Typography>This Month</Typography>
          </div>
        </CardDescription>
        <CardTitle className={ `text-2xl font-semibold tabular-nums` }>{ usdFormatter.format(currentMonthData.totalBillsCost) }</CardTitle>
        <CardAction>
          <Badge variant="outline">
            <TrendingUp />
            +12.5%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Trending up this month <TrendingUp className="size-4" />
        </div>
        <div className="text-muted-foreground">Visitors for the last 6 months</div>
      </CardFooter>
    </DisplayCard>
  );
}
