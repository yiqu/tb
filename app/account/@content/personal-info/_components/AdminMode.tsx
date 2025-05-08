import { Suspense } from 'react';

import { Skeleton } from '@/components/ui-pre-19/skeleton';
import Typography from '@/components/typography/Typography';

import DisplayCard from './DisplayCard';
import AdminModeWrapper from './AdminModeWrapper';

export default function AdminMode() {
  return (
    <DisplayCard>
      <section className="flex flex-col gap-y-2">
        <Typography variant="h5">Admin</Typography>
        <Typography variant="body1">Toggle admin mode.</Typography>
      </section>
      <Suspense fallback={ <FallBack /> }>
        <AdminModeWrapper />
      </Suspense>
    </DisplayCard>
  );
}

function FallBack() {
  return <Skeleton className="h-[19px] w-full" />;
}
