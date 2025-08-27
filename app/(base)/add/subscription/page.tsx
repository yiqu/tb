import { Metadata } from 'next';

import DisplayCard from '@/shared/components/DisplayCard';
import { CardFooter, CardContent } from '@/components/ui/card';
import AddSubscriptionDialogContentFormWrapper from '@/components/subscriptions/AddSubscriptionDialogContentFormWrapper';

import AddNewEntityHeader from '../_components/AddNewEntityHeader';
import AddNewEntityActions from '../_components/AddNewEntityActions';
import EditSubscriptionUrl from '../_components/form-fields/EditSubscriptionUrl';
import EditSubscriptionName from '../_components/form-fields/EditSubscriptionName';
import EditSubscriptionCost from '../_components/form-fields/EditSubscriptionCost';
import EditSubscriptionSigned from '../_components/form-fields/EditSubscriptionSigned';
import EditSubscriptionApproved from '../_components/form-fields/EditSubscriptionApproved';
import EditSubscriptionDescription from '../_components/form-fields/EditSubscriptionDescription';
import EditSubscriptionCycleDuration from '../_components/form-fields/EditSubscriptionCycleDuration';

export const metadata: Metadata = {
  title: 'Add New Subscription',
  description: 'Add a new subscription.',
};

export default function AddNewSubscriptionPage() {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-9">
      <AddNewEntityHeader type="subscription" />
      <DisplayCard className="w-full">
        <CardContent>
          <AddSubscriptionDialogContentFormWrapper redirectToNewSubscriptionAfterCreation>
            <div className="flex w-full flex-col items-start justify-start gap-y-4">
              <EditSubscriptionName />
              <EditSubscriptionCost />
              <EditSubscriptionCycleDuration />
              <EditSubscriptionDescription />
              <EditSubscriptionUrl />
              <EditSubscriptionApproved />
              <EditSubscriptionSigned />
            </div>
          </AddSubscriptionDialogContentFormWrapper>
        </CardContent>
        <CardFooter>
          <AddNewEntityActions />
        </CardFooter>
      </DisplayCard>
    </div>
  );
}
