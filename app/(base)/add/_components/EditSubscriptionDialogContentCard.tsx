import { CardContent } from '@/components/ui/card';
import DisplayCard from '@/shared/components/DisplayCard';
import DisplayCardContentDivider from '@/shared/components/DisplayCardContentDivider';

import EditSubscriptionUrl from './form-fields/EditSubscriptionUrl';
import EditSubscriptionName from './form-fields/EditSubscriptionName';
import EditSubscriptionCost from './form-fields/EditSubscriptionCost';
import EditSubscriptionSigned from './form-fields/EditSubscriptionSigned';
import EditSubscriptionApproved from './form-fields/EditSubscriptionApproved';
import EditSubscriptionDescription from './form-fields/EditSubscriptionDescription';
import EditSubscriptionCycleDuration from './form-fields/EditSubscriptionCycleDuration';

export default function EditSubscriptionDialogContentCard() {
  return (
    <div className="overflow-y-auto px-4">
      <DisplayCard>
        <CardContent className="flex w-full flex-col items-start justify-start gap-y-4">
          <EditSubscriptionName />
          <DisplayCardContentDivider />
          <EditSubscriptionCost />
          <DisplayCardContentDivider />
          <EditSubscriptionCycleDuration />
          <DisplayCardContentDivider />
          <EditSubscriptionDescription />
          <DisplayCardContentDivider />
          <EditSubscriptionUrl />
          <DisplayCardContentDivider />
          <EditSubscriptionApproved />
          <DisplayCardContentDivider />
          <EditSubscriptionSigned />
        </CardContent>
      </DisplayCard>
    </div>
  );
}
