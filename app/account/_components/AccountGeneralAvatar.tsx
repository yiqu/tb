import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/typography/Typography';
import { CardTitle, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

import DisplayCard from '../@content/personal-info/_components/DisplayCard';
import AccountGeneralAvatarSelectionWrapper from './AccountGeneralAvatarSelectionWrapper';

export default function AccountGeneralAvatar() {
  return (
    <DisplayCard>
      <CardHeader>
        <CardTitle>
          <Typography variant="h5">Avatar</Typography>
        </CardTitle>
        <CardDescription>
          <Typography variant="body1">Select an avatar for your account.</Typography>
        </CardDescription>
      </CardHeader>
      <Suspense fallback={ <AvatarSelectionSkeleton /> }>
        <CardContent>
          <AccountGeneralAvatarSelectionWrapper />
        </CardContent>
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
