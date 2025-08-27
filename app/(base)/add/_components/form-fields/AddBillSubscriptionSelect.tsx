'use client';

import z from 'zod';
import { use } from 'react';
import { useFormContext } from 'react-hook-form';

import { billAddableSchema } from '@/validators/bills/bill.schema';
import { SubscriptionOriginal } from '@/models/subscriptions/subscriptions.model';
import { AutocompleteInput, Autocomplete2Option } from '@/components/hook-form/Autocomplete2';

export default function AddBillSubscriptionSelect({
  allSubscriptionsPromise,
}: {
  allSubscriptionsPromise: Promise<SubscriptionOriginal[]>;
}) {
  const subscriptions: SubscriptionOriginal[] = use(allSubscriptionsPromise);

  const options = subscriptions.map((subscription) => ({
    label: subscription.name,
    value: subscription.id,
  }));

  const { control } = useFormContext<z.infer<typeof billAddableSchema>>();

  return (
    <>
      <AutocompleteInput
        options={ options as unknown as Autocomplete2Option[] }
        placeholder="Select a subscription"
        multi={ false }
        className="min-w-[12rem] bg-card"
        searchBy="label"
        badgeTextMaxLength={ 10 }
        name="subscriptionId"
        control={ control }
        label="Subscription"
      />
    </>
  );
}
