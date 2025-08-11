import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import EditBillForm from '@/components/bills/EditBillForm';
import Typography from '@/components/typography/Typography';
import AddNewBillDueDialog from '@/app/(base)/add/_components/AddNewBillDueDialog';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import EditSubscriptionDialog from '@/app/(base)/add/_components/EditSubscriptionDialog';
import BillsTableActionDialog from '@/app/(base)/bills/_components/BillsTableActionDialog';
import { getSubscriptionWithBillDuesByIdCached } from '@/server/subscriptions/subscriptions.server';

import SubscriptionDetailsMetadata from './SubscriptionDetailsMetadata';
import SubscriptionDetailsBillsTableParentParent from './SubscriptionDetailsBillsTableParentParent';

interface SubscriptionDetailsParentProps {
  paramsPromise: Promise<{ subscriptionId: string }>;
}

export default async function SubscriptionDetailsParent({ paramsPromise }: SubscriptionDetailsParentProps) {
  const params = await paramsPromise;
  const { subscriptionId } = params;

  const subscription: SubscriptionWithBillDues | null = await getSubscriptionWithBillDuesByIdCached(subscriptionId);

  if (!subscription) {
    return <div>Subscription not found</div>;
  }

  return (
    <div className="flex w-full flex-col items-start justify-start">
      <div className="flex w-full flex-col items-start justify-start gap-y-6">
        <SubscriptionDetailsMetadata subscription={ subscription } />
        <Suspense fallback={ <TableLoading /> }>
          <SubscriptionDetailsBillsTableParentParent subscriptionId={ subscriptionId } subscription={ subscription } />
        </Suspense>
      </div>
      <BillsTableActionDialog>
        <EditBillForm />
      </BillsTableActionDialog>
      <AddNewBillDueDialog subscriptionId={ subscriptionId } />
      <EditSubscriptionDialog subscriptionId={ subscriptionId } />
    </div>
  );
}

function TableLoading() {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-6">
      <Typography variant="h3">Bill Dues</Typography>
      <Skeleton className="h-[50rem] w-full" />
    </div>
  );
}
