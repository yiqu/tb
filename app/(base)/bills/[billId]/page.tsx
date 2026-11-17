import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

import BillDetailsParent from './_components/BillDetailsParent';

export default function BillDetailsPage({ params }: PageProps<'/bills/[billId]'>) {
  return (
    <Suspense fallback={ <Skeleton className="h-6 w-80" /> }>
      <BillDetailsParent paramsPromise={ params } />
    </Suspense>
  );
}
