import { Suspense } from 'react';

import BillDetailsParent from './_components/BillDetailsParent';

export default function BillDetailsPage({ params }: PageProps<'/bills/[billId]'>) {
  return (
    <Suspense fallback={ <div>Loading...</div> }>
      <BillDetailsParent paramsPromise={ params } />
    </Suspense>
  );
}
