import { Suspense } from 'react';

import { CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/typography/Typography';
import { CardTitle, CardDescription } from '@/components/ui/card';

import DisplayCard from './DisplayCard';
import LocationInfoWrapper from './LocationInfoWrapper';

export default function LocationInfo() {
  return (
    <DisplayCard>
      <CardHeader>
        <CardTitle>
          <Typography variant="h5">Address</Typography>
        </CardTitle>
        <CardDescription>
          <Typography variant="body1">Please enter your address, this is not shared with anyone.</Typography>
        </CardDescription>
      </CardHeader>
      <Suspense fallback={ <FallBack /> }>
        <LocationInfoWrapper />
      </Suspense>
    </DisplayCard>
  );
}

function FallBack() {
  return <Skeleton className="h-[190px] w-full" />;
}
