import { Suspense } from 'react';
import { cacheLife } from 'next/cache';

import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/typography/Typography';
import { CardTitle, CardHeader, CardDescription } from '@/components/ui/card';

import DisplayCard from './DisplayCard';
import DisplayNameWrapper from './DisplayNameWrapper';

export default async function DisplayName() {
  'use cache';
  cacheLife('weeks');

  return (
    <DisplayCard>
      <CardHeader>
        <CardTitle>
          <Typography variant="h5">Display Name</Typography>
        </CardTitle>
        <CardDescription>
          <Typography variant="body1">Please enter your full name, or a display name you are comfortable with.</Typography>
        </CardDescription>
      </CardHeader>
      <Suspense fallback={ <FallBack /> }>
        <DisplayNameWrapper />
      </Suspense>
    </DisplayCard>
  );
}

function FallBack() {
  return <Skeleton className="h-[113px] w-full" />;
}
