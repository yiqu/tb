'use client';

import { use } from 'react';
import { parseAsString } from 'nuqs';
import { parseAsArrayOf, parseAsInteger, useQueryStates } from 'nuqs';

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

  const [selectedSubscriptions, setSelectedSubscriptions] = useQueryStates(
    {
      subscriptions: parseAsArrayOf(parseAsString)
        .withOptions({
          history: 'push',
          scroll: false,
          shallow: false,
        })
        .withDefault([]),
      page: parseAsInteger
        .withOptions({
          history: 'push',
          scroll: false,
          shallow: false,
        })
        .withDefault(1),
    },
    {
      history: 'push',
      scroll: false,
      shallow: false,
    },
  );

  const handleOnSubscriptionsChange = (values: string[] | string) => {
    setSelectedSubscriptions({
      subscriptions: values as string[],
      page: 1,
    });
  };

  return (
    <div>
      <AutocompleteInput
        options={ subscriptionOptions }
        placeholder="Subscriptions"
        onChange={ handleOnSubscriptionsChange }
        defaultValues={ selectedSubscriptions.subscriptions }
        multi={ true }
        className="min-w-60 bg-card"
        searchBy="label"
        badgeTextMaxLength={ 8 }
      />
    </div>
  );
}
