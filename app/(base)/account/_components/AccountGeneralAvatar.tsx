import { Suspense } from 'react';
import { User } from 'lucide-react';

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
          <Typography variant="h5" className="flex items-center gap-x-2">
            <User className="" />
            Avatar
          </Typography>
        </CardTitle>
        <CardDescription>
          <Typography variant="body1">Select an avatar for your account.</Typography>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={ <AvatarSelectionSkeleton /> }>
          <AccountGeneralAvatarSelectionWrapper />
        </Suspense>
      </CardContent>
    </DisplayCard>
  );
}

function AvatarSelectionSkeleton() {
  return (
    <section className="h-[296px] w-full">
      <Skeleton className="h-full w-full" />
    </section>
  );
}
