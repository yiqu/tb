import { Suspense } from 'react';

import { Skeleton } from '@/components/ui-pre-19/skeleton';
import Typography from '@/components/typography/Typography';
import { CardHeader, CardContent } from '@/components/ui/card';
import { CardTitle, CardDescription } from '@/components/ui/card';

import DisplayCard from './DisplayCard';
import AdminModeWrapper from './AdminModeWrapper';

export default function AdminMode() {
  return (
    <DisplayCard>
      <CardHeader>
        <CardTitle>
          <Typography variant="h5">Admin</Typography>
        </CardTitle>
        <CardDescription>
          <Typography variant="body1">Toggle admin mode.</Typography>
        </CardDescription>
      </CardHeader>
      <Suspense fallback={ <FallBack /> }>
        <CardContent>
          <AdminModeWrapper />
        </CardContent>
      </Suspense>
    </DisplayCard>
  );
}

function FallBack() {
  return <Skeleton className="h-[19px] w-full" />;
}
