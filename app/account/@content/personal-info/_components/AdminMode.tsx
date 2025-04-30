import { Suspense } from 'react';

import Typography from '@/components/typography/Typography';

import DisplayCard from './DisplayCard';
import InputFallback from './InputFallback';
import AdminModeWrapper from './AdminModeWrapper';

export default function AdminMode() {
  return (
    <DisplayCard>
      <section className="flex flex-col gap-y-2">
        <Typography variant="h5">Admin</Typography>
        <Typography variant="body1">Toggle admin mode.</Typography>
        <Suspense fallback={ <InputFallback /> }>
          <AdminModeWrapper />
        </Suspense>
      </section>
    </DisplayCard>
  );
}
