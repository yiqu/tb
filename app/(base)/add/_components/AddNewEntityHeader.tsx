import Link from 'next/link';
import startCase from 'lodash/startCase';
import { EllipsisVerticalIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import BillLogo from '@/components/logos/BillLogo';
import Typography from '@/components/typography/Typography';
import SubscriptionLogo from '@/components/logos/SubscriptionLogo';

interface AddNewEntityHeaderProps {
  type: 'subscription' | 'bill';
}

export default function AddNewEntityHeader({ type }: AddNewEntityHeaderProps) {
  return (
    <div className="flex w-full flex-row items-center justify-between py-2">
      <div className="flex flex-row items-center justify-start gap-x-2">
        <Link href={ `/add/${type}` } prefetch>
          <div className="flex flex-row items-center justify-start gap-x-2">
            { type === 'subscription' ?
              <SubscriptionLogo subscriptionName={ '' } height={ 30 } />
            : <BillLogo height={ 30 } /> }
            <Typography variant="h3">Add New { startCase(type) }</Typography>
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
