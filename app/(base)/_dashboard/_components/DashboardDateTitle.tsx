import z from 'zod';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { billSearchParamsSchema } from '@/validators/bills/bill.schema';

import CurrentMonthText from './CurrentMonthText';
import BillsActivityMonthSelect from './BillsActivityMonthSelect';
import BillsTableClearMonthSelectionButton from './BillsTableClearMonthSelectionButton';

type Props = {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
};

export default function DashboardDateTitle({ searchParamsPromise }: Props) {
  return (
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
  );
}

function MonthTextLoading() {
  return <Skeleton className="h-7 w-[95px]" />;
}
