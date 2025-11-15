import z from 'zod';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { Card, CardTitle, CardAction, CardFooter, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

import CurrentMonthText from './CurrentMonthText';
import CurrentMonthBillsTable from './CurrentMonthBillsTable';
import BillsActivityMonthSelect from './BillsActivityMonthSelect';
import BillsTableClearMonthSelectionButton from './BillsTableClearMonthSelectionButton';

type Props = {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
};

export default function BillsCurrentMonth({ searchParamsPromise }: Props) {
  return (
    <div className="flex w-full flex-col gap-y-2">
      <div className="flex w-full flex-row items-center justify-between gap-x-1">
        <Suspense fallback={ <MonthTextLoading /> }>
          <CurrentMonthText variant="h3" searchParamsPromise={ searchParamsPromise } />
        </Suspense>
        <div className="flex flex-row items-center justify-end gap-x-4">
          <Suspense fallback={ <Skeleton className="h-8 w-29" /> }>
            <BillsTableClearMonthSelectionButton searchParamsPromise={ searchParamsPromise } />
          </Suspense>
          <Suspense fallback={ <Skeleton className="h-9 w-121" /> }>
            <BillsActivityMonthSelect searchParamsPromise={ searchParamsPromise } />
          </Suspense>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Bills due this month</CardTitle>
          <CardDescription>View, edit, and manage bills that are due this month.</CardDescription>
          <CardAction></CardAction>
        </CardHeader>
        <CardContent>
          <CurrentMonthBillsTable searchParamsPromise={ searchParamsPromise } />
        </CardContent>
        <CardFooter className=""></CardFooter>
      </Card>
    </div>
  );
}

function MonthTextLoading() {
  return <Skeleton className="h-7 w-[95px]" />;
}
