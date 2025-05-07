import { Suspense } from 'react';

import Typography from '@/components/typography/Typography';

import DisplayCard from './DisplayCard';
import InputFallback from './InputFallback';
import LocationInfoWrapper from './LocationInfoWrapper';

export default function LocationInfo() {
  return (
    <DisplayCard>
      <section className="flex flex-col gap-y-2">
        <Typography variant="h5">Address</Typography>
        <Typography variant="body1">Please enter your address, this is not shared with anyone.</Typography>
      </section>
      <Suspense fallback={ <InputFallback /> }>
        <LocationInfoWrapper />
      </Suspense>
    </DisplayCard>
  );
}
