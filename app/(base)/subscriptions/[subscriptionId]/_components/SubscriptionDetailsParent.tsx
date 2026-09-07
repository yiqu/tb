import { Suspense } from 'react';

import ColumnStack from '@/shared/components/ColumnStack';
import EditBillForm from '@/components/bills/EditBillForm';
import Typography from '@/components/typography/Typography';
import AddNewBillDueDialog from '@/app/(base)/add/_components/AddNewBillDueDialog';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import EditSubscriptionDialog from '@/app/(base)/add/_components/EditSubscriptionDialog';
import BillsTableActionDialog from '@/app/(base)/bills/_components/BillsTableActionDialog';
import { getSubscriptionWithBillDuesByIdCached } from '@/server/subscriptions/subscriptions.server';

import SubscriptionDetailsMetadata from './SubscriptionDetailsMetadata';
import SubscriptionDetailsBillsTableLoading from './SubscriptionDetailsBillsTableLoading';
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
    <ColumnStack className="w-full">
      <ColumnStack className="w-full gap-y-6">
        <SubscriptionDetailsMetadata subscription={ subscription } />
        <Suspense fallback={ <TableLoading /> }>
          <SubscriptionDetailsBillsTableParentParent subscriptionId={ subscriptionId } subscription={ subscription } />
        </Suspense>
      </ColumnStack>
      <BillsTableActionDialog>
        <EditBillForm />
      </BillsTableActionDialog>
      <AddNewBillDueDialog subscriptionId={ subscriptionId } />
      <EditSubscriptionDialog subscriptionId={ subscriptionId } />
    </ColumnStack>
  );
}

/**
 * Mirrors the resolved layout (heading + one bill dues card) using the same mask the table itself
 * shows while it waits for the client, so the page shows one continuous skeleton rather than
 * swapping between two different looking ones.
 */
function TableLoading() {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-6">
      <Typography variant="h3">Bill Dues</Typography>
      <SubscriptionDetailsBillsTableLoading />
    </div>
  );
}
