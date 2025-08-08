import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/typography/Typography';
import { CardTitle, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

import DisplayCard from '../@content/personal-info/_components/DisplayCard';
import AccountGeneralVibeSelectionWrapper from './AccountGeneralVibeSelectionWrapper';

export default function AccountGeneralVibeSelection() {
  return (
    <DisplayCard>
      <CardHeader>
        <CardTitle>
          <Typography variant="h5">Vibe</Typography>
        </CardTitle>
        <CardDescription>
          <Typography variant="body1">Pick a mood to set the tone for your visit.</Typography>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={ <VibeSelectionSkeleton /> }>
          <AccountGeneralVibeSelectionWrapper />
        </Suspense>
      </CardContent>
    </DisplayCard>
  );
}

function VibeSelectionSkeleton() {
  return (
    <section className="h-[58px] w-full">
      <Skeleton className="h-full w-full" />
    </section>
  );
}
