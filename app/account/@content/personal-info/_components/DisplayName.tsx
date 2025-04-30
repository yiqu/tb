import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/typography/Typography';

import DisplayCard from './DisplayCard';
import DisplayNameWrapper from './DisplayNameWrapper';

export default function DisplayName() {
  return (
    <DisplayCard>
      <section className="flex flex-col gap-y-2">
        <Typography variant="h5">Display Name</Typography>
        <Typography variant="body1">
          Please enter your full name, or a display name you are comfortable with.
        </Typography>
        <Suspense fallback={ <DisplayNameSuspenseFallback /> }>
          <DisplayNameWrapper />
        </Suspense>
      </section>
    </DisplayCard>
  );
}

function DisplayNameSuspenseFallback() {
  return (
    <div className="flex flex-col gap-y-2">
      <Skeleton className="h-[37px] w-full rounded-lg" />
      <section className="flex items-center justify-end">
        <Button size="default" disabled>
          Loading
        </Button>
      </section>
    </div>
  );
}
