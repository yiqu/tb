import z from 'zod';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/typography/Typography';
import { CurrentMonthDateData } from '@/models/bills/bills.model';
import { getCurrentMonthDateData } from '@/server/bills/bills.server';
import { billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { Card, CardTitle, CardAction, CardFooter, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

import CurrentMonthText from './CurrentMonthText';
import CurrentMonthBillsTable from './CurrentMonthBillsTable';

type Props = {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
};

export default function BillsCurrentMonth({ searchParamsPromise }: Props) {
  const dateDataPromise: Promise<CurrentMonthDateData> = getCurrentMonthDateData();

  return (
    <div className="flex w-full flex-col gap-y-2">
      <div className="flex flex-row items-center justify-start gap-x-1">
        <Suspense fallback={ <MonthTextLoading /> }>
          <CurrentMonthText variant="h4" dateDataPromise={ dateDataPromise } />
        </Suspense>
        <Typography variant="h4">Activities</Typography>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming this month</CardTitle>
          <CardDescription>View all the bills that are due this month.</CardDescription>
          <CardAction></CardAction>
        </CardHeader>
        <CardContent>
          <CurrentMonthBillsTable searchParamsPromise={ searchParamsPromise } />
        </CardContent>
      </Card>
    </div>
  );
}

function MonthTextLoading() {
  return <Skeleton className="h-7 w-[95px]" />;
}
