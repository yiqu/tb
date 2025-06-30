'use client';

import { use } from 'react';
import { parseAsArrayOf } from 'nuqs';
import { parseAsString, useQueryState } from 'nuqs';

import { AutocompleteInput } from '@/components/hook-form/Autocomplete2';
import { SubscriptionOriginal } from '@/models/subscriptions/subscriptions.model';
interface BillsActionBarSubscriptionFilterProps {
  allSubscriptionsPromise: Promise<SubscriptionOriginal[]>;
}

export default function BillsActionBarSubscriptionFilter({ allSubscriptionsPromise }: BillsActionBarSubscriptionFilterProps) {
  const subscriptions: SubscriptionOriginal[] = use(allSubscriptionsPromise);

  const subscriptionOptions = subscriptions.map((subscription) => ({
    label: subscription.name,
    value: subscription.id,
  }));

  const [selectedSubscriptions, setSelectedSubscriptions] = useQueryState(
    'subscriptions',
    parseAsArrayOf(parseAsString)
      .withOptions({
        history: 'push',
        scroll: false,
      })
      .withDefault([]),
  );

  const handleOnSubscriptionsChange = (values: string[] | string) => {
    setSelectedSubscriptions(values as string[]);
  };

  return (
    <div>
      <AutocompleteInput
        options={ subscriptionOptions }
        placeholder="Subscriptions"
        onChange={ handleOnSubscriptionsChange }
        defaultValues={ selectedSubscriptions }
        multi={ true }
        className="min-w-[15rem] bg-card"
        searchBy="label"
        badgeTextMaxLength={ 5 }
      />
    </div>
  );
}
