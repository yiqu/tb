import z from 'zod';
import { Suspense } from 'react';

import { billSearchParamsSchema } from '@/validators/bills/bill.schema';

import BillsTableParent from './_components/BillsTableParent';
import BillsTableSkeleton from './_components/BillsTableSkeleton';
import BillsTableActionBar from './_components/BillsTableActionBar';
import BillsTablePaginationWrapper from './_components/BillsTablePaginationWrapper';

interface AllBillsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<z.infer<typeof billSearchParamsSchema>>;
}

export default function AllBillsPage({ searchParams }: AllBillsPageProps) {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-3">
      <BillsTableActionBar />
      <BillsTablePaginationWrapper searchParams={ searchParams } />
      <Suspense fallback={ <BillsTableSkeleton /> }>
        <BillsTableParent searchParamsPromise={ searchParams } />
      </Suspense>
    </div>
  );
}
