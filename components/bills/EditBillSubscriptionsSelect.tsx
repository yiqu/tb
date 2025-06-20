'use client';

import { use } from 'react';
import { Undo2 } from 'lucide-react';
import { useWatch, useFormContext } from 'react-hook-form';

import { getUSDFormatter } from '@/lib/number.utils';
import { SubscriptionOriginal } from '@/models/subscriptions/subscriptions.model';

import { Button } from '../ui/button';
import HFSelect, { HFSelectOption } from '../hook-form/HFSelect';

const usdFormatter = getUSDFormatter(2, 2);

export default function EditBillSubscriptionsSelect({ subscriptionsPromise }: { subscriptionsPromise: Promise<SubscriptionOriginal[]> }) {
  const { control, getFieldState, setValue } = useFormContext();
  const subId = useWatch({ control, name: 'subscriptionId', defaultValue: '' });
  const subIdFieldState = getFieldState('subscriptionId');

  const allSubscriptions: SubscriptionOriginal[] = use(subscriptionsPromise);
  const allSubscriptionsOptions: HFSelectOption[] = allSubscriptions.map((subscription) => ({
    label: subscription.name,
    value: subscription.id,
  }));

  const selectedSubscription: SubscriptionOriginal | undefined = allSubscriptions.find(
    (subscription: SubscriptionOriginal) => subscription.id === subId,
  );
  const selectedSubscriptionCost: number | undefined = selectedSubscription?.cost;

  const handleOnUpdateCost = () => {
    setValue('cost', selectedSubscriptionCost ?? 0);
  };

  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-4">
      <HFSelect
        name="subscriptionId"
        label="Subscription"
        control={ control }
        options={ allSubscriptionsOptions }
        formItemClassName="w-full"
        placeholder="Select a subscription"
      />
      { (subIdFieldState.isDirty && !!subId) ?
        <div className="flex w-full flex-row items-center justify-end">
          <Button variant="outline" size="default" onClick={ handleOnUpdateCost } type="button">
            <Undo2 />
            Update cost to the new subscription&apos;s cost:{ ' ' }
            { selectedSubscriptionCost === undefined ? 'N/A' : usdFormatter.format(selectedSubscriptionCost) }
          </Button>
        </div>
      : null }
    </div>
  );
}
