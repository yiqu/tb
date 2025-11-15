import z from 'zod';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { billSearchParamsSchema } from '@/validators/bills/bill.schema';

import { isMonthSelectionSearchParamsExist } from './dashboard.utils';
import BillsActionBarClearAllFilters from './BillsActionBarClearAllFilters';

interface Props {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
}

export default async function BillsTableClearMonthSelectionButton({ searchParamsPromise }: Props) {
  const searchParams: z.infer<typeof billSearchParamsSchema> = await searchParamsPromise;
  const hasSearchParams: boolean = isMonthSelectionSearchParamsExist(searchParams);

  if (hasSearchParams) {
    return (
      <>
        <Suspense fallback={ <ActionBarButtonSkeleton /> }>
          <BillsActionBarClearAllFilters size="default" />
        </Suspense>
        <Separator orientation="vertical" className="h-[1.6rem]!" />
      </>
    );
  }

  return null;
}

function ActionBarButtonSkeleton() {
  return <Skeleton className="h-9 w-[120px]" />;
}
