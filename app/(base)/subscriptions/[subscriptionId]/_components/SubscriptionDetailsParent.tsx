import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import EditBillForm from '@/components/bills/EditBillForm';
import Typography from '@/components/typography/Typography';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import BillsTableActionDialog from '@/app/(base)/bills/_components/BillsTableActionDialog';
import AddNewBillDueDialogTitle from '@/app/(base)/add/_components/AddNewBillDueDialogTitle';
import AddNewBillDueDialogFooter from '@/app/(base)/add/_components/AddNewBillDueDialogFooter';
import AddNewBillDueDialogWrapper from '@/app/(base)/add/_components/AddNewBillDueDialogWrapper';
import { getSubscriptionWithBillDuesByIdCached } from '@/server/subscriptions/subscriptions.server';
import AddNewBillDueDialogContentCard from '@/app/(base)/add/_components/AddNewBillDueDialogContentCard';
import AddNewBillDueDialogContentFormWrapper from '@/app/(base)/add/_components/AddNewBillDueDialogContentFormWrapper';

import SubscriptionDetailsHeader from './SubscriptionDetailsHeader';
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
    <div className="flex w-full flex-col items-start justify-start gap-y-9">
      <SubscriptionDetailsHeader subscription={ subscription } />
      <div className="flex w-full flex-col items-start justify-start gap-y-6">
        <SubscriptionDetailsMetadata subscription={ subscription } />
        <Suspense fallback={ <TableLoading /> }>
          <SubscriptionDetailsBillsTableParentParent subscriptionId={ subscriptionId } />
        </Suspense>
      </div>
      <BillsTableActionDialog>
        <EditBillForm />
      </BillsTableActionDialog>
      <AddNewBillDueDialogWrapper>
        <AddNewBillDueDialogTitle />
        <Separator />
        <AddNewBillDueDialogContentFormWrapper subscriptionId={ subscriptionId }>
          <AddNewBillDueDialogContentCard />
          <AddNewBillDueDialogFooter />
        </AddNewBillDueDialogContentFormWrapper>
      </AddNewBillDueDialogWrapper>
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
