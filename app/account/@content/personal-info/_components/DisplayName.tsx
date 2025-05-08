import { Suspense } from 'react';
import { unstable_cacheLife as cacheLife } from 'next/cache';

import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/typography/Typography';

import DisplayCard from './DisplayCard';
import DisplayNameWrapper from './DisplayNameWrapper';

export default async function DisplayName() {
  'use cache';
  cacheLife('weeks');

  return (
    <DisplayCard>
      <section className="flex flex-col gap-y-2">
        <Typography variant="h5">Display Name</Typography>
        <Typography variant="body1">
          Please enter your full name, or a display name you are comfortable with.
        </Typography>
      </section>
      <Suspense fallback={ <FallBack /> }>
        <DisplayNameWrapper />
      </Suspense>
    </DisplayCard>
  );
}

function FallBack() {
  return <Skeleton className="h-[113px] w-full" />;
}
