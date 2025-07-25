import Typography from '@/components/typography/Typography';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';

import { SubscriptionDetailsHeaderActionButton } from './SubscriptionDetailsHeaderActionButton';

export default function SubscriptionDetailsHeader({ subscription }: { subscription: SubscriptionWithBillDues }) {
  return (
    <div className="flex w-full flex-row items-center justify-between">
      <div>
        <Typography variant="h3">{ subscription.name }</Typography>
      </div>
      <SubscriptionDetailsHeaderActionButton subscription={ subscription } />
    </div>
  );
}
