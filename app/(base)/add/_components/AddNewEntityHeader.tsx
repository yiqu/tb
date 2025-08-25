import Link from 'next/link';
import { EllipsisVerticalIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Typography from '@/components/typography/Typography';
import SubscriptionLogo from '@/components/logos/SubscriptionLogo';

export default function AddNewEntityHeader() {
  return (
    <div className="flex w-full flex-row items-center justify-between py-2">
      <div className="flex flex-row items-center justify-start gap-x-2">
        <Link href={ `/add/subscription` } prefetch>
          <div className="flex flex-row items-center justify-start gap-x-2">
            <SubscriptionLogo subscriptionName={ '' } height={ 30 } />
            <Typography variant="h3">Add New Subscription</Typography>
          </div>
        </Link>
      </div>
      <Button variant="default" disabled>
        <EllipsisVerticalIcon className="h-4 w-4" />
        Actions
      </Button>
    </div>
  );
}
