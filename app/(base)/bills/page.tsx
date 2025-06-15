import { Suspense } from 'react';

import BillsTableParent from './_components/BillsTableParent';
import BillsTableSkeleton from './_components/BillsTableSkeleton';
import BillsTableActionBar from './_components/BillsTableActionBar';

interface AllBillsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function AllBillsPage({}: AllBillsPageProps) {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-3">
      <BillsTableActionBar />
      <Suspense fallback={ <BillsTableSkeleton /> }>
        <BillsTableParent />
      </Suspense>
    </div>
  );
}
