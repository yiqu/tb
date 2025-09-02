import { Metadata } from 'next';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import DisplayCard from '@/shared/components/DisplayCard';
import { CardFooter, CardContent } from '@/components/ui/card';
import LayoutWithGutter from '@/components/layout/LayoutWithGutter';
import { SubscriptionOriginal } from '@/models/subscriptions/subscriptions.model';
import { getAllSubscriptionsCached } from '@/server/subscriptions/subscriptions.server';

import AddedBillDues from '../_components/AddedBillDues';
import AddNewEntityHeader from '../_components/AddNewEntityHeader';
import AddBillIsPaid from '../_components/form-fields/AddBillIsPaid';
import AddBillDueDate from '../_components/form-fields/AddBillDueDate';
import AddNewDueBillActions from '../_components/AddNewDueBillActions';
import AddNewBillFormWrapper from '../_components/AddNewBillFormWrapper';
import AddBillCurrency from '../_components/form-fields/AddBillCurrency';
import AddBillCostWatcher from '../_components/form-fields/AddBillCostWatcher';
import AddBillIsReimbursed from '../_components/form-fields/AddBillIsReimbursed';
import AddBillSubscriptionSelect from '../_components/form-fields/AddBillSubscriptionSelect';
import AddBillConsecutiveAddStandalone from '../_components/form-fields/AddBillConsecutiveAddStandalone';

export const metadata: Metadata = {
  title: 'Add New Bill',
  description: 'Add a new due bill.',
};

export default function AddNewBillPage() {
  const allSubscriptionsPromise: Promise<SubscriptionOriginal[]> = getAllSubscriptionsCached();

  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-3">
      <AddNewEntityHeader type="bill" />
      <LayoutWithGutter size="med" className="w-full">
        <DisplayCard className="w-full">
          <CardContent>
            <AddNewBillFormWrapper>
              <div className="flex w-full flex-col items-start justify-start gap-y-4">
                <Suspense fallback={ <AddBillSubscriptionSelectSuspense /> }>
                  <AddBillSubscriptionSelect allSubscriptionsPromise={ allSubscriptionsPromise } />
                </Suspense>
                <AddBillCostWatcher />
                <AddBillDueDate />
                <AddBillCurrency />
                <AddBillIsPaid />
                <AddBillIsReimbursed />
                <AddBillConsecutiveAddStandalone />
              </div>
            </AddNewBillFormWrapper>
          </CardContent>
          <CardFooter>
            <AddNewDueBillActions />
          </CardFooter>
        </DisplayCard>
      </LayoutWithGutter>

      <AddedBillDues />
    </div>
  );
}

function AddBillSubscriptionSelectSuspense() {
  return <Skeleton className="h-9 w-full" />;
}
