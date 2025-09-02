import { Suspense } from 'react';

import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DisplayCard from '@/shared/components/DisplayCard';
import DisplayCardContentDivider from '@/shared/components/DisplayCardContentDivider';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';

import AddBillIsPaid from './form-fields/AddBillIsPaid';
import AddBillDueDate from './form-fields/AddBillDueDate';
import AddBillCurrency from './form-fields/AddBillCurrency';
import AddBillIsReimbursed from './form-fields/AddBillIsReimbursed';
import AddBillSubscriptionName from './form-fields/AddBillSubscriptionName';

export default function AddNewBillDueDialogContentCard({ subscription }: { subscription: SubscriptionWithBillDues }) {
  return (
    <div className="px-4">
      <DisplayCard>
        <CardContent className="flex w-full flex-col items-start justify-start gap-y-4">
          <Suspense fallback={ <AddBillSubscriptionNameSkeleton /> }>
            <AddBillSubscriptionName subscriptionName={ subscription.name } />
          </Suspense>
          <AddBillDueDate />
          <DisplayCardContentDivider />
          <AddBillCurrency />
          <DisplayCardContentDivider />
          <AddBillIsPaid />
          <DisplayCardContentDivider />
          <AddBillIsReimbursed />
        </CardContent>
      </DisplayCard>
    </div>
  );
}

function AddBillSubscriptionNameSkeleton() {
  return <Skeleton className="h-6 w-[6rem]" />;
}
