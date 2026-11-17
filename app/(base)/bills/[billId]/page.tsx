import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/typography/Typography';

import BillDetailsParent from './_components/BillDetailsParent';

export default function BillDetailsPage({ params }: PageProps<'/bills/[billId]'>) {
  return (
    <Suspense
      fallback={
        <div role="status">
          <Skeleton className="h-6 w-80" />
          <Typography variant="span1" className="sr-only">
            Loading bill details
          </Typography>
        </div>
      }
    >
      <BillDetailsParent paramsPromise={ params } />
    </Suspense>
  );
}
