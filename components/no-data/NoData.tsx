import Link from 'next/link';

import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';

import Typography from '../typography/Typography';
import NoResultsCard from '../status-cards/NoResultsCard';

interface NoDataProps {
  type: 'subscriptions' | 'bills';
  subscription?: SubscriptionWithBillDues;
}

export default function NoData({ type, subscription }: NoDataProps) {
  if (type === 'bills') {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-y-4">
        <NoResultsCard blendBg={ true } blendTextAreaBorder={ true } titleText="No Bill Dues Found">
          <Link href={ `/subscriptions/${subscription?.id}?addBillDueSubscriptionId=${subscription?.id}` } prefetch replace>
            <Typography variant="body1">Click here to add a new bill due</Typography>
          </Link>
        </NoResultsCard>
      </div>
    );
  }

  if (type === 'subscriptions') {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-y-4">
        <Typography variant="h3">No subscriptions found</Typography>
      </div>
    );
  }

  return (
    <div>
      <Typography>No data found.</Typography>
    </div>
  );
}
