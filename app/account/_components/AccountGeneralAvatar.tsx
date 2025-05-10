import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/typography/Typography';

import DisplayCard from '../@content/personal-info/_components/DisplayCard';
import AccountGeneralAvatarSelectionWrapper from './AccountGeneralAvatarSelectionWrapper';

export default function AccountGeneralAvatar() {
  return (
    <DisplayCard>
      <section className="flex flex-col gap-y-2">
        <Typography variant="h5">Avatar</Typography>
        <Typography variant="body1">Select an avatar for your account.</Typography>
      </section>
      <Suspense fallback={ <AvatarSelectionSkeleton /> }>
        <AccountGeneralAvatarSelectionWrapper />
      </Suspense>
    </DisplayCard>
  );
}

function AvatarSelectionSkeleton() {
  return (
    <div className="min-h-[288px] w-full">
      <Skeleton className="h-full w-full" />
    </div>
  );
}
